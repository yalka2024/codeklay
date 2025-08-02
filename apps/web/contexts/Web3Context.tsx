// Web3 Context for CodePal
// Provides blockchain connectivity and smart contract interactions

import React, { createContext, useContext, useEffect, useState } from 'react';
import { web3Manager, Web3Provider, PodContract } from '../lib/web3';

interface Web3ContextType {
  isConnected: boolean;
  isConnecting: boolean;
  provider: Web3Provider | null;
  address: string | null;
  chainId: number | null;
  connect: () => Promise<Web3Provider>;
  disconnect: () => void;
  loadPodContract: (contractAddress: string) => Promise<PodContract>;
  getTokenBalance: (contractAddress: string, userAddress?: string) => Promise<string>;
  getVotingPower: (contractAddress: string, userAddress?: string) => Promise<string>;
  createProposal: (
    contractAddress: string,
    proposalData: {
      title: string;
      description: string;
      proposalType: string;
      targetAddress?: string;
      amount?: string;
      codeSnippetId?: string;
    }
  ) => Promise<any>;
  voteOnProposal: (
    contractAddress: string,
    proposalId: string,
    support: boolean,
    reason?: string
  ) => Promise<any>;
  claimReward: (
    contractAddress: string,
    amount: string,
    reason: string,
    codeSnippetId?: string
  ) => Promise<any>;
  formatAddress: (address: string) => string;
  formatTokenAmount: (amount: string, decimals?: number) => string;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<Web3Provider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  // Check connection status on mount
  useEffect(() => {
    const checkConnection = () => {
      const connected = web3Manager.isConnected();
      setIsConnected(connected);
      
      if (connected) {
        const currentProvider = web3Manager.getProvider();
        if (currentProvider) {
          setProvider(currentProvider);
          setAddress(currentProvider.address);
          setChainId(currentProvider.chainId);
        }
      }
    };

    checkConnection();
    
    // Listen for connection changes
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const connect = async (): Promise<Web3Provider> => {
    setIsConnecting(true);
    try {
      const web3Provider = await web3Manager.connect();
      setIsConnected(true);
      setProvider(web3Provider);
      setAddress(web3Provider.address);
      setChainId(web3Provider.chainId);
      return web3Provider;
    } catch (error) {
      console.error('Failed to connect to Web3:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    web3Manager.disconnect();
    setIsConnected(false);
    setProvider(null);
    setAddress(null);
    setChainId(null);
  };

  const loadPodContract = async (contractAddress: string): Promise<PodContract> => {
    return await web3Manager.loadPodContract(contractAddress);
  };

  const getTokenBalance = async (contractAddress: string, userAddress?: string): Promise<string> => {
    return await web3Manager.getTokenBalance(contractAddress, userAddress);
  };

  const getVotingPower = async (contractAddress: string, userAddress?: string): Promise<string> => {
    return await web3Manager.getVotingPower(contractAddress, userAddress);
  };

  const createProposal = async (
    contractAddress: string,
    proposalData: {
      title: string;
      description: string;
      proposalType: string;
      targetAddress?: string;
      amount?: string;
      codeSnippetId?: string;
    }
  ) => {
    return await web3Manager.createProposal(contractAddress, proposalData);
  };

  const voteOnProposal = async (
    contractAddress: string,
    proposalId: string,
    support: boolean,
    reason?: string
  ) => {
    return await web3Manager.voteOnProposal(contractAddress, proposalId, support, reason);
  };

  const claimReward = async (
    contractAddress: string,
    amount: string,
    reason: string,
    codeSnippetId?: string
  ) => {
    return await web3Manager.claimReward(contractAddress, amount, reason, codeSnippetId);
  };

  const formatAddress = (address: string): string => {
    return web3Manager.formatAddress(address);
  };

  const formatTokenAmount = (amount: string, decimals: number = 18): string => {
    return web3Manager.formatTokenAmount(amount, decimals);
  };

  const value: Web3ContextType = {
    isConnected,
    isConnecting,
    provider,
    address,
    chainId,
    connect,
    disconnect,
    loadPodContract,
    getTokenBalance,
    getVotingPower,
    createProposal,
    voteOnProposal,
    claimReward,
    formatAddress,
    formatTokenAmount,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
} 