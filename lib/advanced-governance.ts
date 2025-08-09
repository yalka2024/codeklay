import { ethers } from 'ethers';
import { EnterpriseBlockchain } from './enterprise-blockchain';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from './enterprise-security';

// Advanced Governance System
export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  proposalType: 'parameter' | 'upgrade' | 'emergency' | 'governance' | 'treasury';
  status: 'draft' | 'active' | 'passed' | 'rejected' | 'executed' | 'expired';
  votingPeriod: number; // in seconds
  executionDelay: number; // in seconds
  quorum: number;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  totalVotes: string;
  createdAt: Date;
  updatedAt: Date;
  executedAt?: Date;
  metadata?: Record<string, any>;
}

export interface GovernanceVote {
  id: string;
  proposalId: string;
  voter: string;
  support: 'for' | 'against' | 'abstain';
  weight: string;
  reason?: string;
  timestamp: Date;
  transactionHash?: string;
}

export interface DAO {
  id: string;
  name: string;
  description: string;
  tokenAddress: string;
  governanceToken: string;
  treasuryAddress: string;
  governanceConfig: DAOGovernanceConfig;
  members: DAOMember[];
  proposals: GovernanceProposal[];
  votes: GovernanceVote[];
  treasury: TreasuryInfo;
  status: 'active' | 'paused' | 'emergency';
  createdAt: Date;
  updatedAt: Date;
}

export interface DAOMember {
  id: string;
  address: string;
  name: string;
  role: 'admin' | 'moderator' | 'member' | 'observer';
  tokenBalance: string;
  votingPower: string;
  reputation: number;
  joinedAt: Date;
  isActive: boolean;
  permissions: string[];
}

export interface DAOGovernanceConfig {
  proposalThreshold: string;
  votingPeriod: number;
  executionDelay: number;
  quorum: number;
  votingPowerDecay: number;
  emergencyPause: boolean;
  vetoPower: boolean;
  timelock: boolean;
  timelockDelay: number;
}

export interface TreasuryInfo {
  address: string;
  balance: string;
  tokens: TreasuryToken[];
  transactions: TreasuryTransaction[];
  budget: BudgetInfo;
}

export interface TreasuryToken {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  value: string;
  decimals: number;
}

export interface TreasuryTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'swap';
  from: string;
  to: string;
  amount: string;
  token: string;
  description: string;
  proposalId?: string;
  timestamp: Date;
  transactionHash: string;
}

export interface BudgetInfo {
  totalBudget: string;
  allocatedBudget: string;
  remainingBudget: string;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: string;
  spent: string;
  remaining: string;
  description: string;
}

export interface VotingPower {
  address: string;
  tokenBalance: string;
  votingPower: string;
  reputation: number;
  lastVote: Date;
  participationRate: number;
}

export interface GovernanceMetrics {
  id: string;
  daoId: string;
  timestamp: Date;
  totalProposals: number;
  activeProposals: number;
  totalVotes: number;
  participationRate: number;
  averageVotingPower: string;
  treasuryBalance: string;
  memberCount: number;
  activeMembers: number;
}

export class AdvancedGovernance {
  private enterpriseBlockchain: EnterpriseBlockchain;
  private securityService: EnterpriseSecurityService;
  private daos: Map<string, DAO> = new Map();
  private proposals: Map<string, GovernanceProposal> = new Map();
  private votes: Map<string, GovernanceVote> = new Map();
  private metrics: Map<string, GovernanceMetrics> = new Map();

  constructor(enterpriseBlockchain: EnterpriseBlockchain, securityService: EnterpriseSecurityService) {
    this.enterpriseBlockchain = enterpriseBlockchain;
    this.securityService = securityService;
  }

  async createDAO(
    name: string,
    description: string,
    tokenAddress: string,
    governanceToken: string,
    treasuryAddress: string,
    governanceConfig: DAOGovernanceConfig
  ): Promise<DAO> {
    const daoId = `dao_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const dao: DAO = {
      id: daoId,
      name,
      description,
      tokenAddress,
      governanceToken,
      treasuryAddress,
      governanceConfig,
      members: [],
      proposals: [],
      votes: [],
      treasury: {
        address: treasuryAddress,
        balance: '0',
        tokens: [],
        transactions: [],
        budget: {
          totalBudget: '0',
          allocatedBudget: '0',
          remainingBudget: '0',
          categories: []
        }
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.daos.set(daoId, dao);

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'dao_created',
      resource: 'advanced-governance',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { daoId, name, tokenAddress },
      severity: 'medium'
    });

    return dao;
  }

  async addDAOMember(
    daoId: string,
    address: string,
    name: string,
    role: 'admin' | 'moderator' | 'member' | 'observer',
    tokenBalance: string,
    permissions: string[] = []
  ): Promise<DAOMember> {
    const dao = this.daos.get(daoId);
    if (!dao) {
      throw new Error('DAO not found');
    }

    const votingPower = this.calculateVotingPower(tokenBalance, role);
    const reputation = this.calculateReputation(role, tokenBalance);

    const member: DAOMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      address,
      name,
      role,
      tokenBalance,
      votingPower,
      reputation,
      joinedAt: new Date(),
      isActive: true,
      permissions
    };

    dao.members.push(member);
    dao.updatedAt = new Date();

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'dao_member_added',
      resource: 'advanced-governance',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { daoId, address, role },
      severity: 'medium'
    });

    return member;
  }

  private calculateVotingPower(tokenBalance: string, role: string): string {
    const balance = ethers.BigNumber.from(tokenBalance);
    const roleMultiplier = {
      admin: 2.0,
      moderator: 1.5,
      member: 1.0,
      observer: 0.5
    };
    
    return balance.mul(Math.floor(roleMultiplier[role as keyof typeof roleMultiplier] * 100)).div(100).toString();
  }

  private calculateReputation(role: string, tokenBalance: string): number {
    const balance = parseFloat(ethers.utils.formatEther(tokenBalance));
    const roleBase = {
      admin: 100,
      moderator: 75,
      member: 50,
      observer: 25
    };
    
    return roleBase[role as keyof typeof roleBase] + Math.min(balance / 1000, 50);
  }

  async createProposal(
    daoId: string,
    title: string,
    description: string,
    proposer: string,
    proposalType: 'parameter' | 'upgrade' | 'emergency' | 'governance' | 'treasury',
    votingPeriod?: number,
    executionDelay?: number
  ): Promise<GovernanceProposal> {
    const dao = this.daos.get(daoId);
    if (!dao) {
      throw new Error('DAO not found');
    }

    // Check if proposer has sufficient voting power
    const member = dao.members.find(m => m.address === proposer);
    if (!member || ethers.BigNumber.from(member.votingPower).lt(dao.governanceConfig.proposalThreshold)) {
      throw new Error('Insufficient voting power to create proposal');
    }

    const proposal: GovernanceProposal = {
      id: `proposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      proposer,
      proposalType,
      status: 'draft',
      votingPeriod: votingPeriod || dao.governanceConfig.votingPeriod,
      executionDelay: executionDelay || dao.governanceConfig.executionDelay,
      quorum: dao.governanceConfig.quorum,
      forVotes: '0',
      againstVotes: '0',
      abstainVotes: '0',
      totalVotes: '0',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        daoId,
        proposalType,
        emergency: proposalType === 'emergency'
      }
    };

    dao.proposals.push(proposal);
    dao.updatedAt = new Date();
    this.proposals.set(proposal.id, proposal);

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'proposal_created',
      resource: 'advanced-governance',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { daoId, proposalId: proposal.id, proposer, proposalType },
      severity: 'medium'
    });

    return proposal;
  }

  async activateProposal(proposalId: string): Promise<GovernanceProposal> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    proposal.status = 'active';
    proposal.updatedAt = new Date();

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'proposal_activated',
      resource: 'advanced-governance',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { proposalId, status: 'active' },
      severity: 'medium'
    });

    return proposal;
  }

  async castVote(
    proposalId: string,
    voter: string,
    support: 'for' | 'against' | 'abstain',
    reason?: string
  ): Promise<GovernanceVote> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal || proposal.status !== 'active') {
      throw new Error('Proposal not found or not active');
    }

    // Find DAO and member
    const dao = this.daos.get(proposal.metadata?.daoId);
    if (!dao) {
      throw new Error('DAO not found');
    }

    const member = dao.members.find(m => m.address === voter);
    if (!member || !member.isActive) {
      throw new Error('Member not found or inactive');
    }

    // Check if already voted
    const existingVote = dao.votes.find(v => v.proposalId === proposalId && v.voter === voter);
    if (existingVote) {
      throw new Error('Already voted on this proposal');
    }

    const vote: GovernanceVote = {
      id: `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      proposalId,
      voter,
      support,
      weight: member.votingPower,
      reason,
      timestamp: new Date(),
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
    };

    dao.votes.push(vote);
    dao.updatedAt = new Date();
    this.votes.set(vote.id, vote);

    // Update proposal vote counts
    const voteWeight = ethers.BigNumber.from(member.votingPower);
    if (support === 'for') {
      proposal.forVotes = ethers.BigNumber.from(proposal.forVotes).add(voteWeight).toString();
    } else if (support === 'against') {
      proposal.againstVotes = ethers.BigNumber.from(proposal.againstVotes).add(voteWeight).toString();
    } else {
      proposal.abstainVotes = ethers.BigNumber.from(proposal.abstainVotes).add(voteWeight).toString();
    }

    proposal.totalVotes = ethers.BigNumber.from(proposal.totalVotes).add(voteWeight).toString();
    proposal.updatedAt = new Date();

    // Check if proposal should be finalized
    await this.checkProposalFinalization(proposal);

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'vote_cast',
      resource: 'advanced-governance',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { proposalId, voter, support, weight: member.votingPower },
      severity: 'low'
    });

    return vote;
  }

  private async checkProposalFinalization(proposal: GovernanceProposal): Promise<void> {
    const totalVotes = ethers.BigNumber.from(proposal.totalVotes);
    const forVotes = ethers.BigNumber.from(proposal.forVotes);
    const quorum = ethers.BigNumber.from(proposal.quorum);

    // Check if voting period has ended
    const votingEndTime = new Date(proposal.createdAt.getTime() + proposal.votingPeriod * 1000);
    const now = new Date();

    if (now >= votingEndTime) {
      if (totalVotes.gte(quorum)) {
        if (forVotes.gt(ethers.BigNumber.from(proposal.againstVotes))) {
          proposal.status = 'passed';
        } else {
          proposal.status = 'rejected';
        }
      } else {
        proposal.status = 'expired';
      }
      proposal.updatedAt = new Date();
    }
  }

  async executeProposal(proposalId: string, executor: string): Promise<GovernanceProposal> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal || proposal.status !== 'passed') {
      throw new Error('Proposal not found or not passed');
    }

    // Check execution delay
    const executionTime = new Date(proposal.createdAt.getTime() + proposal.executionDelay * 1000);
    const now = new Date();
    if (now < executionTime) {
      throw new Error('Execution delay not met');
    }

    proposal.status = 'executed';
    proposal.executedAt = new Date();
    proposal.updatedAt = new Date();

    // Execute the proposal based on type
    await this.executeProposalAction(proposal);

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'proposal_executed',
      resource: 'advanced-governance',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { proposalId, executor, proposalType: proposal.proposalType },
      severity: 'high'
    });

    return proposal;
  }

  private async executeProposalAction(proposal: GovernanceProposal): Promise<void> {
    const dao = this.daos.get(proposal.metadata?.daoId);
    if (!dao) return;

    switch (proposal.proposalType) {
      case 'treasury':
        // Execute treasury action
        await this.executeTreasuryAction(dao, proposal);
        break;
      case 'governance':
        // Update governance parameters
        await this.updateGovernanceParameters(dao, proposal);
        break;
      case 'emergency':
        // Execute emergency action
        await this.executeEmergencyAction(dao, proposal);
        break;
      default:
        // Generic proposal execution
        console.log(`Executing ${proposal.proposalType} proposal: ${proposal.title}`);
    }
  }

  private async executeTreasuryAction(dao: DAO, proposal: GovernanceProposal): Promise<void> {
    // Simulate treasury action execution
    const transaction: TreasuryTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'transfer',
      from: dao.treasury.address,
      to: '0x1234567890123456789012345678901234567890',
      amount: '1000000000000000000', // 1 ETH
      token: 'ETH',
      description: `Treasury action: ${proposal.title}`,
      proposalId: proposal.id,
      timestamp: new Date(),
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
    };

    dao.treasury.transactions.push(transaction);
  }

  private async updateGovernanceParameters(dao: DAO, proposal: GovernanceProposal): Promise<void> {
    // Simulate governance parameter update
    console.log(`Updating governance parameters for proposal: ${proposal.title}`);
  }

  private async executeEmergencyAction(dao: DAO, proposal: GovernanceProposal): Promise<void> {
    // Simulate emergency action execution
    dao.status = 'emergency';
    dao.updatedAt = new Date();
  }

  async getVotingPower(daoId: string, address: string): Promise<VotingPower> {
    const dao = this.daos.get(daoId);
    if (!dao) {
      throw new Error('DAO not found');
    }

    const member = dao.members.find(m => m.address === address);
    if (!member) {
      return {
        address,
        tokenBalance: '0',
        votingPower: '0',
        reputation: 0,
        lastVote: new Date(0),
        participationRate: 0
      };
    }

    const votes = dao.votes.filter(v => v.voter === address);
    const participationRate = dao.proposals.length > 0 ? (votes.length / dao.proposals.length) * 100 : 0;

    return {
      address,
      tokenBalance: member.tokenBalance,
      votingPower: member.votingPower,
      reputation: member.reputation,
      lastVote: votes.length > 0 ? votes[votes.length - 1].timestamp : new Date(0),
      participationRate
    };
  }

  async trackGovernanceMetrics(daoId: string): Promise<GovernanceMetrics> {
    const dao = this.daos.get(daoId);
    if (!dao) {
      throw new Error('DAO not found');
    }

    const activeProposals = dao.proposals.filter(p => p.status === 'active');
    const totalVotes = dao.votes.length;
    const participationRate = dao.members.length > 0 
      ? (dao.votes.length / (dao.members.length * dao.proposals.length)) * 100 
      : 0;

    const averageVotingPower = dao.members.length > 0
      ? dao.members.reduce((sum, m) => sum + parseFloat(m.votingPower), 0) / dao.members.length
      : 0;

    const metrics: GovernanceMetrics = {
      id: `metrics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      daoId,
      timestamp: new Date(),
      totalProposals: dao.proposals.length,
      activeProposals: activeProposals.length,
      totalVotes,
      participationRate,
      averageVotingPower: averageVotingPower.toString(),
      treasuryBalance: dao.treasury.balance,
      memberCount: dao.members.length,
      activeMembers: dao.members.filter(m => m.isActive).length
    };

    this.metrics.set(metrics.id, metrics);

    return metrics;
  }

  async getDAOGovernance(daoId: string): Promise<{
    proposals: GovernanceProposal[];
    votes: GovernanceVote[];
    activeProposals: GovernanceProposal[];
    governanceStats: any;
  }> {
    const dao = this.daos.get(daoId);
    if (!dao) {
      throw new Error('DAO not found');
    }

    const activeProposals = dao.proposals.filter(p => p.status === 'active');
    const governanceStats = {
      totalProposals: dao.proposals.length,
      activeProposals: activeProposals.length,
      totalVotes: dao.votes.length,
      participationRate: dao.members.length > 0 
        ? (dao.votes.length / (dao.members.length * dao.proposals.length)) * 100 
        : 0,
      averageVotingPower: dao.members.length > 0
        ? dao.members.reduce((sum, m) => sum + parseFloat(m.votingPower), 0) / dao.members.length
        : 0
    };

    return {
      proposals: dao.proposals,
      votes: dao.votes,
      activeProposals,
      governanceStats
    };
  }

  // Analytics and reporting methods
  async getDAOs(): Promise<DAO[]> {
    return Array.from(this.daos.values());
  }

  async getProposals(daoId?: string): Promise<GovernanceProposal[]> {
    const proposals = Array.from(this.proposals.values());
    if (daoId) {
      return proposals.filter(p => p.metadata?.daoId === daoId);
    }
    return proposals;
  }

  async getVotes(proposalId?: string): Promise<GovernanceVote[]> {
    const votes = Array.from(this.votes.values());
    if (proposalId) {
      return votes.filter(v => v.proposalId === proposalId);
    }
    return votes;
  }

  async getMetrics(daoId?: string): Promise<GovernanceMetrics[]> {
    const metrics = Array.from(this.metrics.values());
    if (daoId) {
      return metrics.filter(m => m.daoId === daoId);
    }
    return metrics;
  }

  async generateGovernanceReport(): Promise<{
    totalDAOs: number;
    totalProposals: number;
    totalVotes: number;
    totalMembers: number;
    daoStats: any;
    proposalStats: any;
    votingStats: any;
  }> {
    const daos = Array.from(this.daos.values());
    const proposals = Array.from(this.proposals.values());
    const votes = Array.from(this.votes.values());

    const daoStats = {
      active: daos.filter(d => d.status === 'active').length,
      paused: daos.filter(d => d.status === 'paused').length,
      emergency: daos.filter(d => d.status === 'emergency').length,
      totalMembers: daos.reduce((sum, d) => sum + d.members.length, 0),
      totalTreasuryBalance: daos.reduce((sum, d) => sum + parseFloat(d.treasury.balance), 0)
    };

    const proposalStats = {
      total: proposals.length,
      active: proposals.filter(p => p.status === 'active').length,
      passed: proposals.filter(p => p.status === 'passed').length,
      rejected: proposals.filter(p => p.status === 'rejected').length,
      executed: proposals.filter(p => p.status === 'executed').length,
      expired: proposals.filter(p => p.status === 'expired').length
    };

    const votingStats = {
      totalVotes: votes.length,
      forVotes: votes.filter(v => v.support === 'for').length,
      againstVotes: votes.filter(v => v.support === 'against').length,
      abstainVotes: votes.filter(v => v.support === 'abstain').length,
      averageParticipation: daos.length > 0 
        ? daos.reduce((sum, d) => sum + (d.votes.length / Math.max(d.members.length * d.proposals.length, 1)) * 100, 0) / daos.length 
        : 0
    };

    return {
      totalDAOs: daos.length,
      totalProposals: proposals.length,
      totalVotes: votes.length,
      totalMembers: daoStats.totalMembers,
      daoStats,
      proposalStats,
      votingStats
    };
  }

  // Public methods for external access
  getDAOById(daoId: string): DAO | undefined {
    return this.daos.get(daoId);
  }

  getProposalById(proposalId: string): GovernanceProposal | undefined {
    return this.proposals.get(proposalId);
  }

  getVoteById(voteId: string): GovernanceVote | undefined {
    return this.votes.get(voteId);
  }

  getMetricsById(metricsId: string): GovernanceMetrics | undefined {
    return this.metrics.get(metricsId);
  }

  isDAOActive(daoId: string): boolean {
    const dao = this.daos.get(daoId);
    return dao?.status === 'active';
  }

  isProposalActive(proposalId: string): boolean {
    const proposal = this.proposals.get(proposalId);
    return proposal?.status === 'active';
  }
} 