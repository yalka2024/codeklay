import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { CodePalButton } from '@codepal/ui';

interface BlockchainPod {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  contractAddress: string;
  tokenSymbol: string;
  totalSupply: string;
  treasuryBalance: string;
  proposalCount: number;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  proposals: Proposal[];
  rewards: TokenReward[];
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposerId: string;
  proposalType: string;
  status: string;
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  endTime: string;
  votes: Vote[];
}

interface Vote {
  id: string;
  voterId: string;
  vote: string;
  votingPower: string;
  reason?: string;
}

interface TokenReward {
  id: string;
  recipientId: string;
  amount: string;
  reason: string;
  status: string;
  createdAt: string;
}

interface PodMember {
  userId: string;
  name: string;
  totalRewards: string;
  contributions: number;
  lastActivity: string;
}

export default function PodsPage() {
  const [activeTab, setActiveTab] = useState('pods');
  const [pods, setPods] = useState<BlockchainPod[]>([]);
  const [userBalance, setUserBalance] = useState<{ [podId: string]: { totalEarned: string; totalClaimed: string; pendingRewards: string } }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch pods data from API
    const fetchPodsData = async () => {
      try {
        // Simulated data
        setPods([
          {
            id: '1',
            name: 'React Masters',
            description: 'Advanced React development and optimization techniques',
            ownerId: 'owner-1',
            memberIds: ['user-1', 'user-2', 'user-3', 'user-4'],
            contractAddress: '0x1234...5678',
            tokenSymbol: 'RCT',
            totalSupply: '1000000',
            treasuryBalance: '25000',
            proposalCount: 5,
            owner: {
              id: 'owner-1',
              name: 'React Expert',
              email: 'expert@example.com'
            },
            proposals: [
              {
                id: 'prop-1',
                title: 'Implement New Performance Hook',
                description: 'Create a custom hook for performance monitoring',
                proposerId: 'user-2',
                proposalType: 'CODE_REVIEW',
                status: 'ACTIVE',
                votesFor: 3,
                votesAgainst: 0,
                quorum: 3,
                endTime: '2024-02-15T00:00:00Z',
                votes: []
              }
            ],
            rewards: [
              {
                id: 'reward-1',
                recipientId: 'user-1',
                amount: '150',
                reason: 'CODE_CONTRIBUTION',
                status: 'PROCESSED',
                createdAt: '2024-01-20T00:00:00Z'
              }
            ]
          },
          {
            id: '2',
            name: 'TypeScript Wizards',
            description: 'TypeScript advanced patterns and best practices',
            ownerId: 'owner-2',
            memberIds: ['user-1', 'user-5', 'user-6'],
            contractAddress: '0x8765...4321',
            tokenSymbol: 'TSW',
            totalSupply: '500000',
            treasuryBalance: '15000',
            proposalCount: 3,
            owner: {
              id: 'owner-2',
              name: 'TypeScript Guru',
              email: 'guru@example.com'
            },
            proposals: [],
            rewards: []
          }
        ]);

        setUserBalance({
          '1': { totalEarned: '450', totalClaimed: '300', pendingRewards: '150' },
          '2': { totalEarned: '200', totalClaimed: '200', pendingRewards: '0' }
        });

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch pods data:', error);
        setLoading(false);
      }
    };

    fetchPodsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading blockchain pods...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Head>
        <title>Blockchain Pods - CodePal</title>
        <meta name="description" content="Decentralized coding pods with tokenized rewards" />
      </Head>

      {/* Header */}
      <header className="p-6 bg-black bg-opacity-20 backdrop-blur-sm border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">🔗 Blockchain Pods</h1>
            <span className="text-blue-300 text-sm">Decentralized collaboration</span>
          </div>
          <nav className="flex items-center space-x-4">
            <CodePalButton onClick={() => window.location.href = '/dashboard'} className="bg-gray-700 hover:bg-gray-800">
              Dashboard
            </CodePalButton>
            <CodePalButton onClick={() => setActiveTab('create')} className="bg-green-600 hover:bg-green-700">
              Create Pod
            </CodePalButton>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'pods', label: 'My Pods', icon: '🏠' },
              { id: 'discover', label: 'Discover', icon: '🔍' },
              { id: 'proposals', label: 'Proposals', icon: '📋' },
              { id: 'rewards', label: 'Rewards', icon: '🏆' },
              { id: 'create', label: 'Create', icon: '➕' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          {activeTab === 'pods' && <MyPodsTab pods={pods} userBalance={userBalance} />}
          {activeTab === 'discover' && <DiscoverTab />}
          {activeTab === 'proposals' && <ProposalsTab pods={pods} />}
          {activeTab === 'rewards' && <RewardsTab pods={pods} userBalance={userBalance} />}
          {activeTab === 'create' && <CreatePodTab />}
        </div>
      </main>
    </div>
  );
}

function MyPodsTab({ pods, userBalance }: { pods: BlockchainPod[]; userBalance: { [podId: string]: { totalEarned: string; totalClaimed: string; pendingRewards: string } } }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">My Coding Pods</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pods.map((pod) => (
          <div key={pod.id} className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">{pod.name}</h3>
                <p className="text-gray-300 text-sm mb-3">{pod.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-blue-300">{pod.memberIds.length} members</span>
                  <span className="text-green-300">{pod.proposalCount} proposals</span>
                  <span className="text-purple-300">{pod.tokenSymbol} tokens</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300">Treasury</div>
                <div className="text-lg font-bold text-white">{pod.treasuryBalance} {pod.tokenSymbol}</div>
              </div>
            </div>

            {/* User Balance */}
            {userBalance[pod.id] && (
              <div className="bg-blue-900 bg-opacity-20 rounded-lg p-4 mb-4">
                <h4 className="text-white font-semibold mb-2">Your Balance</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-300">Total Earned:</span>
                    <div className="text-white font-semibold">{userBalance[pod.id].totalEarned} {pod.tokenSymbol}</div>
                  </div>
                  <div>
                    <span className="text-gray-300">Claimed:</span>
                    <div className="text-white font-semibold">{userBalance[pod.id].totalClaimed} {pod.tokenSymbol}</div>
                  </div>
                  <div>
                    <span className="text-gray-300">Pending:</span>
                    <div className="text-yellow-400 font-semibold">{userBalance[pod.id].pendingRewards} {pod.tokenSymbol}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Active Proposals */}
            {pod.proposals.filter(p => p.status === 'ACTIVE').length > 0 && (
              <div className="mb-4">
                <h4 className="text-white font-semibold mb-2">Active Proposals</h4>
                <div className="space-y-2">
                  {pod.proposals.filter(p => p.status === 'ACTIVE').map((proposal) => (
                    <div key={proposal.id} className="bg-white bg-opacity-5 rounded p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm">{proposal.title}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400 text-xs">{proposal.votesFor} for</span>
                          <span className="text-red-400 text-xs">{proposal.votesAgainst} against</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <CodePalButton 
                onClick={() => console.log('View pod', pod.id)} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                View Pod
              </CodePalButton>
              <CodePalButton 
                onClick={() => console.log('Create proposal', pod.id)} 
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Create Proposal
              </CodePalButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiscoverTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Discover Pods</h2>
      <p className="text-gray-300">This tab will contain discoverable pods and join functionality.</p>
      <CodePalButton onClick={() => console.log('Browse pods')} className="bg-blue-600 hover:bg-blue-700">
        Browse All Pods
      </CodePalButton>
    </div>
  );
}

function ProposalsTab({ pods }: { pods: BlockchainPod[] }) {
  const allProposals = pods.flatMap(pod => 
    pod.proposals.map(proposal => ({ ...proposal, podName: pod.name, podId: pod.id }))
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Active Proposals</h2>

      <div className="space-y-4">
        {allProposals.filter(p => p.status === 'ACTIVE').map((proposal) => (
          <div key={proposal.id} className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">{proposal.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{proposal.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-blue-300">Pod: {proposal.podName}</span>
                  <span className="text-green-300">Type: {proposal.proposalType}</span>
                  <span className="text-yellow-300">Quorum: {proposal.quorum}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300">Votes</div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400 text-lg font-bold">{proposal.votesFor}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-red-400 text-lg font-bold">{proposal.votesAgainst}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <CodePalButton 
                onClick={() => console.log('Vote for', proposal.id)} 
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Vote For
              </CodePalButton>
              <CodePalButton 
                onClick={() => console.log('Vote against', proposal.id)} 
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Vote Against
              </CodePalButton>
              <CodePalButton 
                onClick={() => console.log('View details', proposal.id)} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                View Details
              </CodePalButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RewardsTab({ pods, userBalance }: { pods: BlockchainPod[]; userBalance: { [podId: string]: { totalEarned: string; totalClaimed: string; pendingRewards: string } } }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Token Rewards</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pods.map((pod) => (
          <div key={pod.id} className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
            <h3 className="text-xl font-semibold text-white mb-4">{pod.name} Rewards</h3>
            
            {userBalance[pod.id] && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{userBalance[pod.id].totalEarned}</div>
                    <div className="text-sm text-gray-300">Total Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{userBalance[pod.id].totalClaimed}</div>
                    <div className="text-sm text-gray-300">Claimed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{userBalance[pod.id].pendingRewards}</div>
                    <div className="text-sm text-gray-300">Pending</div>
                  </div>
                </div>

                <CodePalButton 
                  onClick={() => console.log('Claim rewards', pod.id)} 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={parseFloat(userBalance[pod.id].pendingRewards) === 0}
                >
                  Claim Rewards
                </CodePalButton>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CreatePodTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Create New Pod</h2>
      <p className="text-gray-300">This tab will contain the pod creation form with smart contract deployment.</p>
      <CodePalButton onClick={() => console.log('Create pod')} className="bg-green-600 hover:bg-green-700">
        Create Pod
      </CodePalButton>
    </div>
  );
} 