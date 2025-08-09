import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { BlockchainIntegration, defaultBlockchainConfig } from '@/lib/blockchain-integration';
import { EnterpriseBlockchain } from '@/lib/enterprise-blockchain';
import { AdvancedGovernance } from '@/lib/advanced-governance';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';

// Initialize enterprise services
const blockchain = new BlockchainIntegration(defaultBlockchainConfig);
const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const enterpriseBlockchain = new EnterpriseBlockchain(blockchain, securityService);
const advancedGovernance = new AdvancedGovernance(enterpriseBlockchain, securityService);

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
  role?: string;
  subscription_tier?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();
    
    // Get user session for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    // Log enterprise operation for security audit
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'enterprise_operation',
        resource: 'enterprise-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action, hasData: !!data },
        severity: 'medium'
      });
    }

    let response: any;

    switch (action) {
      case 'create_private_network':
        const { name, description, networkType, consensus, config } = data;
        const network = await enterpriseBlockchain.createPrivateNetwork(
          name,
          description,
          networkType,
          consensus,
          config
        );
        response = {
          success: true,
          network,
          message: 'Private network created successfully'
        };
        break;

      case 'add_participant':
        const { networkId, participantName, participantType, address, publicKey, permissions } = data;
        const participant = await enterpriseBlockchain.addParticipant(
          networkId,
          participantName,
          participantType,
          address,
          publicKey,
          permissions
        );
        response = {
          success: true,
          participant,
          message: 'Participant added successfully'
        };
        break;

      case 'deploy_contract':
        const { networkId: contractNetworkId, name: contractName, sourceCode, constructorArgs } = data;
        const contract = await enterpriseBlockchain.deployContract(
          contractNetworkId,
          contractName,
          sourceCode,
          constructorArgs
        );
        response = {
          success: true,
          contract,
          message: 'Contract deployed successfully'
        };
        break;

      case 'create_consortium':
        const { consortiumName, consortiumDescription, governance } = data;
        const consortium = await enterpriseBlockchain.createConsortium(
          consortiumName,
          consortiumDescription,
          governance
        );
        response = {
          success: true,
          consortium,
          message: 'Consortium created successfully'
        };
        break;

      case 'add_consortium_member':
        const { consortiumId, organization, role, memberPermissions } = data;
        const member = await enterpriseBlockchain.addConsortiumMember(
          consortiumId,
          organization,
          role,
          memberPermissions
        );
        response = {
          success: true,
          member,
          message: 'Consortium member added successfully'
        };
        break;

      case 'create_policy':
        const { consortiumId: policyConsortiumId, policyName, policyType, policyDescription, rules, enforcement } = data;
        const policy = await enterpriseBlockchain.createPolicy(
          policyConsortiumId,
          policyName,
          policyType,
          policyDescription,
          rules,
          enforcement
        );
        response = {
          success: true,
          policy,
          message: 'Policy created successfully'
        };
        break;

      case 'execute_transaction':
        const { networkId: txNetworkId, from, to, value, txData } = data;
        const transaction = await enterpriseBlockchain.executeTransaction(
          txNetworkId,
          from,
          to,
          value,
          txData
        );
        response = {
          success: true,
          transaction,
          message: 'Transaction executed successfully'
        };
        break;

      case 'create_dao':
        const { daoName, daoDescription, tokenAddress, governanceToken, treasuryAddress, governanceConfig } = data;
        const dao = await advancedGovernance.createDAO(
          daoName,
          daoDescription,
          tokenAddress,
          governanceToken,
          treasuryAddress,
          governanceConfig
        );
        response = {
          success: true,
          dao,
          message: 'DAO created successfully'
        };
        break;

      case 'add_dao_member':
        const { daoId, memberAddress, memberName, memberRole, tokenBalance, memberPermissions } = data;
        const daoMember = await advancedGovernance.addDAOMember(
          daoId,
          memberAddress,
          memberName,
          memberRole,
          tokenBalance,
          memberPermissions
        );
        response = {
          success: true,
          member: daoMember,
          message: 'DAO member added successfully'
        };
        break;

      case 'create_proposal':
        const { daoId: proposalDaoId, title, description, proposer, proposalType, votingPeriod, executionDelay } = data;
        const proposal = await advancedGovernance.createProposal(
          proposalDaoId,
          title,
          description,
          proposer,
          proposalType,
          votingPeriod,
          executionDelay
        );
        response = {
          success: true,
          proposal,
          message: 'Proposal created successfully'
        };
        break;

      case 'activate_proposal':
        const { proposalId: activateProposalId } = data;
        const activatedProposal = await advancedGovernance.activateProposal(activateProposalId);
        response = {
          success: true,
          proposal: activatedProposal,
          message: 'Proposal activated successfully'
        };
        break;

      case 'cast_vote':
        const { proposalId: voteProposalId, voter, support, reason } = data;
        const vote = await advancedGovernance.castVote(
          voteProposalId,
          voter,
          support,
          reason
        );
        response = {
          success: true,
          vote,
          message: 'Vote cast successfully'
        };
        break;

      case 'execute_proposal':
        const { proposalId: executeProposalId, executor } = data;
        const executedProposal = await advancedGovernance.executeProposal(executeProposalId, executor);
        response = {
          success: true,
          proposal: executedProposal,
          message: 'Proposal executed successfully'
        };
        break;

      case 'validate_policy':
        const { consortiumId: validateConsortiumId, action, actor, resource } = data;
        const validation = await enterpriseBlockchain.validatePolicy(
          validateConsortiumId,
          action,
          actor,
          resource
        );
        response = {
          success: true,
          validation,
          message: 'Policy validation completed'
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful enterprise operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'enterprise_operation_success',
        resource: 'enterprise-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          action, 
          success: response.success 
        },
        severity: 'low'
      });
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Enterprise API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'enterprise_operation_error',
        resource: 'enterprise-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          action: req.body?.action
        },
        severity: 'high'
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    
    // Get user session for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    let response: any;

    switch (action) {
      case 'networks':
        const networks = await enterpriseBlockchain.getNetworks();
        response = {
          success: true,
          networks,
          count: networks.length
        };
        break;

      case 'consortia':
        const consortia = await enterpriseBlockchain.getConsortia();
        response = {
          success: true,
          consortia,
          count: consortia.length
        };
        break;

      case 'transactions':
        const { networkId } = searchParams;
        const transactions = await enterpriseBlockchain.getTransactions(networkId);
        response = {
          success: true,
          transactions,
          count: transactions.length
        };
        break;

      case 'network_metrics':
        const { networkId: metricsNetworkId } = searchParams;
        if (!metricsNetworkId) {
          return NextResponse.json({ error: 'Network ID required' }, { status: 400 });
        }
        const metrics = await enterpriseBlockchain.trackNetworkMetrics(metricsNetworkId);
        response = {
          success: true,
          metrics
        };
        break;

      case 'network_governance':
        const { networkId: governanceNetworkId } = searchParams;
        if (!governanceNetworkId) {
          return NextResponse.json({ error: 'Network ID required' }, { status: 400 });
        }
        const governance = await enterpriseBlockchain.getNetworkGovernance(governanceNetworkId);
        response = {
          success: true,
          governance
        };
        break;

      case 'daos':
        const daos = await advancedGovernance.getDAOs();
        response = {
          success: true,
          daos,
          count: daos.length
        };
        break;

      case 'proposals':
        const { daoId } = searchParams;
        const proposals = await advancedGovernance.getProposals(daoId);
        response = {
          success: true,
          proposals,
          count: proposals.length
        };
        break;

      case 'votes':
        const { proposalId } = searchParams;
        const votes = await advancedGovernance.getVotes(proposalId);
        response = {
          success: true,
          votes,
          count: votes.length
        };
        break;

      case 'voting_power':
        const { daoId: powerDaoId, address } = searchParams;
        if (!powerDaoId || !address) {
          return NextResponse.json({ error: 'DAO ID and address required' }, { status: 400 });
        }
        const votingPower = await advancedGovernance.getVotingPower(powerDaoId, address);
        response = {
          success: true,
          votingPower
        };
        break;

      case 'governance_metrics':
        const { daoId: metricsDaoId } = searchParams;
        if (!metricsDaoId) {
          return NextResponse.json({ error: 'DAO ID required' }, { status: 400 });
        }
        const governanceMetrics = await advancedGovernance.trackGovernanceMetrics(metricsDaoId);
        response = {
          success: true,
          metrics: governanceMetrics
        };
        break;

      case 'dao_governance':
        const { daoId: governanceDaoId } = searchParams;
        if (!governanceDaoId) {
          return NextResponse.json({ error: 'DAO ID required' }, { status: 400 });
        }
        const daoGovernance = await advancedGovernance.getDAOGovernance(governanceDaoId);
        response = {
          success: true,
          governance: daoGovernance
        };
        break;

      case 'enterprise_report':
        const enterpriseReport = await enterpriseBlockchain.generateEnterpriseReport();
        response = {
          success: true,
          report: enterpriseReport
        };
        break;

      case 'governance_report':
        const governanceReport = await advancedGovernance.generateGovernanceReport();
        response = {
          success: true,
          report: governanceReport
        };
        break;

      case 'network_details':
        const { networkId: detailsNetworkId } = searchParams;
        if (!detailsNetworkId) {
          return NextResponse.json({ error: 'Network ID required' }, { status: 400 });
        }
        const networkDetails = enterpriseBlockchain.getNetworkById(detailsNetworkId);
        response = {
          success: true,
          network: networkDetails
        };
        break;

      case 'consortium_details':
        const { consortiumId } = searchParams;
        if (!consortiumId) {
          return NextResponse.json({ error: 'Consortium ID required' }, { status: 400 });
        }
        const consortiumDetails = enterpriseBlockchain.getConsortiumById(consortiumId);
        response = {
          success: true,
          consortium: consortiumDetails
        };
        break;

      case 'dao_details':
        const { daoId: detailsDaoId } = searchParams;
        if (!detailsDaoId) {
          return NextResponse.json({ error: 'DAO ID required' }, { status: 400 });
        }
        const daoDetails = advancedGovernance.getDAOById(detailsDaoId);
        response = {
          success: true,
          dao: daoDetails
        };
        break;

      case 'proposal_details':
        const { proposalId: detailsProposalId } = searchParams;
        if (!detailsProposalId) {
          return NextResponse.json({ error: 'Proposal ID required' }, { status: 400 });
        }
        const proposalDetails = advancedGovernance.getProposalById(detailsProposalId);
        response = {
          success: true,
          proposal: proposalDetails
        };
        break;

      case 'network_status':
        const { networkId: statusNetworkId } = searchParams;
        if (!statusNetworkId) {
          return NextResponse.json({ error: 'Network ID required' }, { status: 400 });
        }
        const networkStatus = enterpriseBlockchain.isNetworkActive(statusNetworkId);
        response = {
          success: true,
          active: networkStatus
        };
        break;

      case 'consortium_status':
        const { consortiumId: statusConsortiumId } = searchParams;
        if (!statusConsortiumId) {
          return NextResponse.json({ error: 'Consortium ID required' }, { status: 400 });
        }
        const consortiumStatus = enterpriseBlockchain.isConsortiumActive(statusConsortiumId);
        response = {
          success: true,
          active: consortiumStatus
        };
        break;

      case 'dao_status':
        const { daoId: statusDaoId } = searchParams;
        if (!statusDaoId) {
          return NextResponse.json({ error: 'DAO ID required' }, { status: 400 });
        }
        const daoStatus = advancedGovernance.isDAOActive(statusDaoId);
        response = {
          success: true,
          active: daoStatus
        };
        break;

      case 'proposal_status':
        const { proposalId: statusProposalId } = searchParams;
        if (!statusProposalId) {
          return NextResponse.json({ error: 'Proposal ID required' }, { status: 400 });
        }
        const proposalStatus = advancedGovernance.isProposalActive(statusProposalId);
        response = {
          success: true,
          active: proposalStatus
        };
        break;

      case 'enterprise_summary':
        const enterpriseReportData = await enterpriseBlockchain.generateEnterpriseReport();
        const governanceReportData = await advancedGovernance.generateGovernanceReport();
        
        const summary = {
          enterprise: {
            totalNetworks: enterpriseReportData.totalNetworks,
            totalConsortia: enterpriseReportData.totalConsortia,
            totalTransactions: enterpriseReportData.totalTransactions,
            totalParticipants: enterpriseReportData.totalParticipants
          },
          governance: {
            totalDAOs: governanceReportData.totalDAOs,
            totalProposals: governanceReportData.totalProposals,
            totalVotes: governanceReportData.totalVotes,
            totalMembers: governanceReportData.totalMembers
          },
          combined: {
            totalNetworks: enterpriseReportData.totalNetworks,
            totalConsortia: enterpriseReportData.totalConsortia,
            totalDAOs: governanceReportData.totalDAOs,
            totalTransactions: enterpriseReportData.totalTransactions,
            totalProposals: governanceReportData.totalProposals,
            totalVotes: governanceReportData.totalVotes
          }
        };
        
        response = {
          success: true,
          summary
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful enterprise operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'enterprise_operation_success',
        resource: 'enterprise-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          action, 
          success: response.success 
        },
        severity: 'low'
      });
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Enterprise API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'enterprise_operation_error',
        resource: 'enterprise-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          action: req.url
        },
        severity: 'high'
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 