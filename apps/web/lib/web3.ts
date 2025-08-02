// Web3 Integration for CodePal
// Handles blockchain connectivity and smart contract interactions

import { ethers } from 'ethers';

export interface Web3Provider {
  provider: ethers.providers.Web3Provider;
  signer: ethers.Signer;
  address: string;
  chainId: number;
}

export interface PodContract {
  address: string;
  contract: ethers.Contract;
  tokenSymbol: string;
  totalSupply: string;
}

export interface ProposalData {
  id: string;
  title: string;
  description: string;
  proposer: string;
  proposalType: string;
  targetAddress?: string;
  amount?: string;
  codeSnippetId?: string;
  quorum: number;
  endTime: number;
  executed: boolean;
  canceled: boolean;
}

export interface VoteData {
  voter: string;
  support: boolean;
  reason?: string;
  votingPower: string;
}

class Web3Manager {
  private provider: Web3Provider | null = null;
  private contracts: Map<string, PodContract> = new Map();

  // Initialize Web3 connection
  async connect(): Promise<Web3Provider> {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to use blockchain features.');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      // Create provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      const chainId = network.chainId;

      // Check if we're on the correct network (Ethereum mainnet or testnet)
      if (chainId !== 1 && chainId !== 5) { // 1 = mainnet, 5 = Goerli testnet
        console.warn(`Connected to chain ID ${chainId}. Consider switching to Ethereum mainnet or Goerli testnet.`);
      }

      this.provider = {
        provider,
        signer,
        address: account,
        chainId,
      };

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          this.disconnect();
        } else {
          this.provider!.address = accounts[0];
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        window.location.reload();
      });

      return this.provider;
    } catch (error) {
      console.error('Failed to connect to Web3:', error);
      throw error;
    }
  }

  // Disconnect from Web3
  disconnect() {
    this.provider = null;
    this.contracts.clear();
  }

  // Get current connection status
  isConnected(): boolean {
    return this.provider !== null;
  }

  // Get current provider
  getProvider(): Web3Provider | null {
    return this.provider;
  }

  // Get user's address
  getAddress(): string | null {
    return this.provider?.address || null;
  }

  // Get current chain ID
  getChainId(): number | null {
    return this.provider?.chainId || null;
  }

  // Load a pod contract
  async loadPodContract(contractAddress: string): Promise<PodContract> {
    if (!this.provider) {
      throw new Error('Web3 not connected. Please connect your wallet first.');
    }

    // Check if contract is already loaded
    if (this.contracts.has(contractAddress)) {
      return this.contracts.get(contractAddress)!;
    }

    try {
      // Pod contract ABI (simplified for demonstration)
      const podABI = [
        // ERC20 functions
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
        'function totalSupply() view returns (uint256)',
        'function balanceOf(address) view returns (uint256)',
        'function transfer(address to, uint256 amount) returns (bool)',
        'function approve(address spender, uint256 amount) returns (bool)',
        'function allowance(address owner, address spender) view returns (uint256)',
        
        // Pod governance functions
        'function proposalCount() view returns (uint256)',
        'function proposals(uint256) view returns (tuple(uint256 id, address proposer, string title, string description, string proposalType, address targetAddress, uint256 amount, string codeSnippetId, uint256 quorum, uint256 endTime, bool executed, bool canceled))',
        'function votes(uint256, address) view returns (tuple(bool support, string reason, uint256 votingPower))',
        'function hasVoted(uint256, address) view returns (bool)',
        'function getVotes(address) view returns (uint256)',
        
        // Proposal functions
        'function propose(string title, string description, string proposalType, address targetAddress, uint256 amount, string codeSnippetId) returns (uint256)',
        'function vote(uint256 proposalId, bool support, string reason)',
        'function execute(uint256 proposalId)',
        'function cancel(uint256 proposalId)',
        
        // Reward functions
        'function claimReward(address recipient, uint256 amount, string reason, string codeSnippetId)',
        'function getRewardBalance(address recipient) view returns (uint256)',
        
        // Events
        'event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title, string proposalType)',
        'event Voted(uint256 indexed proposalId, address indexed voter, bool support, string reason)',
        'event ProposalExecuted(uint256 indexed proposalId)',
        'event ProposalCanceled(uint256 indexed proposalId)',
        'event RewardClaimed(address indexed recipient, uint256 amount, string reason)',
      ];

      const contract = new ethers.Contract(contractAddress, podABI, this.provider.signer);
      
      // Get basic contract info
      const tokenSymbol = await contract.symbol();
      const totalSupply = await contract.totalSupply();

      const podContract: PodContract = {
        address: contractAddress,
        contract,
        tokenSymbol,
        totalSupply: ethers.utils.formatEther(totalSupply),
      };

      this.contracts.set(contractAddress, podContract);
      return podContract;
    } catch (error) {
      console.error('Failed to load pod contract:', error);
      throw error;
    }
  }

  // Get user's token balance for a pod
  async getTokenBalance(contractAddress: string, userAddress?: string): Promise<string> {
    const podContract = await this.loadPodContract(contractAddress);
    const address = userAddress || this.provider!.address;
    const balance = await podContract.contract.balanceOf(address);
    return ethers.utils.formatEther(balance);
  }

  // Get voting power for a user
  async getVotingPower(contractAddress: string, userAddress?: string): Promise<string> {
    const podContract = await this.loadPodContract(contractAddress);
    const address = userAddress || this.provider!.address;
    const votes = await podContract.contract.getVotes(address);
    return ethers.utils.formatEther(votes);
  }

  // Create a new proposal
  async createProposal(
    contractAddress: string,
    proposalData: {
      title: string;
      description: string;
      proposalType: string;
      targetAddress?: string;
      amount?: string;
      codeSnippetId?: string;
    }
  ): Promise<ethers.ContractTransaction> {
    const podContract = await this.loadPodContract(contractAddress);
    
    const targetAddress = proposalData.targetAddress || ethers.constants.AddressZero;
    const amount = proposalData.amount ? ethers.utils.parseEther(proposalData.amount) : 0;
    const codeSnippetId = proposalData.codeSnippetId || '';

    return podContract.contract.propose(
      proposalData.title,
      proposalData.description,
      proposalData.proposalType,
      targetAddress,
      amount,
      codeSnippetId
    );
  }

  // Vote on a proposal
  async voteOnProposal(
    contractAddress: string,
    proposalId: string,
    support: boolean,
    reason: string = ''
  ): Promise<ethers.ContractTransaction> {
    const podContract = await this.loadPodContract(contractAddress);
    return podContract.contract.vote(proposalId, support, reason);
  }

  // Execute a proposal
  async executeProposal(
    contractAddress: string,
    proposalId: string
  ): Promise<ethers.ContractTransaction> {
    const podContract = await this.loadPodContract(contractAddress);
    return podContract.contract.execute(proposalId);
  }

  // Cancel a proposal
  async cancelProposal(
    contractAddress: string,
    proposalId: string
  ): Promise<ethers.ContractTransaction> {
    const podContract = await this.loadPodContract(contractAddress);
    return podContract.contract.cancel(proposalId);
  }

  // Claim rewards
  async claimReward(
    contractAddress: string,
    amount: string,
    reason: string,
    codeSnippetId?: string
  ): Promise<ethers.ContractTransaction> {
    const podContract = await this.loadPodContract(contractAddress);
    const recipient = this.provider!.address;
    const parsedAmount = ethers.utils.parseEther(amount);
    const snippetId = codeSnippetId || '';

    return podContract.contract.claimReward(recipient, parsedAmount, reason, snippetId);
  }

  // Get proposal details
  async getProposal(contractAddress: string, proposalId: string): Promise<ProposalData> {
    const podContract = await this.loadPodContract(contractAddress);
    const proposal = await podContract.contract.proposals(proposalId);
    
    return {
      id: proposalId,
      title: proposal.title,
      description: proposal.description,
      proposer: proposal.proposer,
      proposalType: proposal.proposalType,
      targetAddress: proposal.targetAddress,
      amount: proposal.amount ? ethers.utils.formatEther(proposal.amount) : undefined,
      codeSnippetId: proposal.codeSnippetId,
      quorum: proposal.quorum.toNumber(),
      endTime: proposal.endTime.toNumber(),
      executed: proposal.executed,
      canceled: proposal.canceled,
    };
  }

  // Get user's vote on a proposal
  async getVote(contractAddress: string, proposalId: string, userAddress?: string): Promise<VoteData | null> {
    const podContract = await this.loadPodContract(contractAddress);
    const address = userAddress || this.provider!.address;
    
    const hasVoted = await podContract.contract.hasVoted(proposalId, address);
    if (!hasVoted) {
      return null;
    }

    const vote = await podContract.contract.votes(proposalId, address);
    return {
      voter: address,
      support: vote.support,
      reason: vote.reason,
      votingPower: ethers.utils.formatEther(vote.votingPower),
    };
  }

  // Get proposal count
  async getProposalCount(contractAddress: string): Promise<number> {
    const podContract = await this.loadPodContract(contractAddress);
    const count = await podContract.contract.proposalCount();
    return count.toNumber();
  }

  // Get all proposals for a pod
  async getAllProposals(contractAddress: string): Promise<ProposalData[]> {
    const count = await this.getProposalCount(contractAddress);
    const proposals: ProposalData[] = [];

    for (let i = 1; i <= count; i++) {
      try {
        const proposal = await this.getProposal(contractAddress, i.toString());
        proposals.push(proposal);
      } catch (error) {
        console.warn(`Failed to fetch proposal ${i}:`, error);
      }
    }

    return proposals;
  }

  // Transfer tokens
  async transferTokens(
    contractAddress: string,
    to: string,
    amount: string
  ): Promise<ethers.ContractTransaction> {
    const podContract = await this.loadPodContract(contractAddress);
    const parsedAmount = ethers.utils.parseEther(amount);
    return podContract.contract.transfer(to, parsedAmount);
  }

  // Approve tokens for spending
  async approveTokens(
    contractAddress: string,
    spender: string,
    amount: string
  ): Promise<ethers.ContractTransaction> {
    const podContract = await this.loadPodContract(contractAddress);
    const parsedAmount = ethers.utils.parseEther(amount);
    return podContract.contract.approve(spender, parsedAmount);
  }

  // Get allowance
  async getAllowance(
    contractAddress: string,
    owner: string,
    spender: string
  ): Promise<string> {
    const podContract = await this.loadPodContract(contractAddress);
    const allowance = await podContract.contract.allowance(owner, spender);
    return ethers.utils.formatEther(allowance);
  }

  // Utility function to format addresses
  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Utility function to format token amounts
  formatTokenAmount(amount: string, decimals: number = 18): string {
    const parsed = parseFloat(amount);
    if (parsed === 0) return '0';
    if (parsed < 0.01) return '< 0.01';
    return parsed.toFixed(2);
  }

  // Utility function to check if transaction is pending
  async waitForTransaction(tx: ethers.ContractTransaction): Promise<ethers.ContractReceipt> {
    return await tx.wait();
  }

  // Utility function to get transaction status
  async getTransactionStatus(txHash: string): Promise<{
    status: 'pending' | 'confirmed' | 'failed';
    receipt?: ethers.ContractReceipt;
    error?: string;
  }> {
    try {
      const receipt = await this.provider!.provider.waitForTransaction(txHash);
      return {
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        receipt,
      };
    } catch (error) {
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Create singleton instance
export const web3Manager = new Web3Manager();

// Export types and utilities
export { ethers };

// Declare global ethereum object
declare global {
  interface Window {
    ethereum?: any;
  }
} 