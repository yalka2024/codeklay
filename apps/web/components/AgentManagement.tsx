import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface Agent {
  id: string;
  name: string;
  type: 'codebase' | 'collaboration' | 'vr' | 'marketplace' | 'quantum' | 'cross-platform' | 'meta';
  status: 'active' | 'inactive' | 'error';
  lastActive: Date;
  performance: number;
  actionsExecuted: number;
}

interface AgentManagementProps {
  className?: string;
}

const AgentManagement: React.FC<AgentManagementProps> = ({ className = '' }) => {
  const { user } = useAuthContext();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'settings'>('overview');
  
  // Accessibility: Focus management
  const containerRef = useRef<HTMLDivElement>(null);
  const agentListRef = useRef<HTMLUListElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);

  // Load agents data
  const loadAgents = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockAgents: Agent[] = [
        {
          id: 'codebase-agent',
          name: 'Codebase Management Agent',
          type: 'codebase',
          status: 'active',
          lastActive: new Date(),
          performance: 95,
          actionsExecuted: 1247
        },
        {
          id: 'collaboration-agent',
          name: 'Collaboration Coordinator Agent',
          type: 'collaboration',
          status: 'active',
          lastActive: new Date(),
          performance: 92,
          actionsExecuted: 892
        },
        {
          id: 'vr-agent',
          name: 'VR Workflow Agent',
          type: 'vr',
          status: 'active',
          lastActive: new Date(),
          performance: 88,
          actionsExecuted: 456
        },
        {
          id: 'marketplace-agent',
          name: 'Marketplace Optimization Agent',
          type: 'marketplace',
          status: 'active',
          lastActive: new Date(),
          performance: 91,
          actionsExecuted: 678
        },
        {
          id: 'quantum-agent',
          name: 'Quantum Workflow Agent',
          type: 'quantum',
          status: 'active',
          lastActive: new Date(),
          performance: 87,
          actionsExecuted: 234
        },
        {
          id: 'cross-platform-agent',
          name: 'Cross-Platform Optimization Agent',
          type: 'cross-platform',
          status: 'inactive',
          lastActive: new Date(),
          performance: 0,
          actionsExecuted: 0
        },
        {
          id: 'meta-agent',
          name: 'Meta Agent',
          type: 'meta',
          status: 'inactive',
          lastActive: new Date(),
          performance: 0,
          actionsExecuted: 0
        }
      ];
      
      setAgents(mockAgents);
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  // Accessibility: Keyboard navigation for tabs
  const handleTabKeyDown = useCallback((event: React.KeyboardEvent, tabId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveTab(tabId as any);
    }
  }, []);

  // Accessibility: Keyboard navigation for agent list
  const handleAgentKeyDown = useCallback((event: React.KeyboardEvent, agent: Agent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedAgent(agent);
    }
  }, []);

  // Accessibility: Focus management
  const focusFirstAgent = useCallback(() => {
    const firstAgentButton = agentListRef.current?.querySelector('button');
    if (firstAgentButton) {
      (firstAgentButton as HTMLElement).focus();
    }
  }, []);

  const focusFirstTab = useCallback(() => {
    const firstTabButton = tabListRef.current?.querySelector('button');
    if (firstTabButton) {
      (firstTabButton as HTMLElement).focus();
    }
  }, []);

  // Handle agent selection
  const handleAgentSelect = useCallback((agent: Agent) => {
    setSelectedAgent(agent);
    setActiveTab('details');
  }, []);

  // Handle agent status toggle
  const handleAgentToggle = useCallback(async (agentId: string) => {
    try {
      // Mock API call - replace with actual implementation
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
          : agent
      ));
    } catch (error) {
      console.error('Error toggling agent:', error);
    }
  }, []);

  if (isLoading) {
    return (
      <div 
        className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" aria-hidden="true"></div>
          <p className="mt-4 text-gray-600">Loading agent management...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-gray-50 ${className}`}
      role="main"
      aria-label="Agent Management Dashboard"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" id="page-title">
            Agent Management
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor and control autonomous AI agents for intelligent development workflows
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav 
            ref={tabListRef}
            className="flex space-x-8" 
            role="tablist"
            aria-label="Agent management sections"
          >
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'details', label: 'Agent Details' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                onClick={() => setActiveTab(tab.id as any)}
                onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                tabIndex={0}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Panels */}
        <div className="bg-white rounded-lg shadow">
          {/* Overview Panel */}
          <div 
            role="tabpanel"
            id="overview-panel"
            aria-labelledby="overview-tab"
            className={activeTab === 'overview' ? 'block' : 'hidden'}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Overview</h2>
              
              {/* Agent Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    role="article"
                    aria-label={`${agent.name} - ${agent.status} status`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          agent.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : agent.status === 'error'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                        aria-label={`Status: ${agent.status}`}
                      >
                        {agent.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Performance:</span>
                        <span className="font-medium">{agent.performance}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Actions:</span>
                        <span className="font-medium">{agent.actionsExecuted.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Active:</span>
                        <span className="font-medium">
                          {agent.lastActive.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleAgentSelect(agent)}
                        onKeyDown={(e) => handleAgentKeyDown(e, agent)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label={`View details for ${agent.name}`}
                        tabIndex={0}
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleAgentToggle(agent.id)}
                        className={`px-3 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          agent.status === 'active'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                        aria-label={`${agent.status === 'active' ? 'Deactivate' : 'Activate'} ${agent.name}`}
                        tabIndex={0}
                      >
                        {agent.status === 'active' ? 'Stop' : 'Start'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div 
            role="tabpanel"
            id="details-panel"
            aria-labelledby="details-tab"
            className={activeTab === 'details' ? 'block' : 'hidden'}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Details</h2>
              
              {selectedAgent ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {selectedAgent.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Type:</span>
                        <span className="ml-2 text-gray-900">{selectedAgent.type}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className="ml-2 text-gray-900">{selectedAgent.status}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Performance:</span>
                        <span className="ml-2 text-gray-900">{selectedAgent.performance}%</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Actions Executed:</span>
                        <span className="ml-2 text-gray-900">
                          {selectedAgent.actionsExecuted.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Agent-specific controls would go here */}
                  <div className="border-t pt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-2">Agent Controls</h4>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        View Logs
                      </button>
                      <button className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                        Test Agent
                      </button>
                      <button className="bg-yellow-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Select an agent to view details</p>
                </div>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          <div 
            role="tabpanel"
            id="settings-panel"
            aria-labelledby="settings-tab"
            className={activeTab === 'settings' ? 'block' : 'hidden'}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Global Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Auto-start agents</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="sr-only">Enable auto-start</span>
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Performance monitoring</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="sr-only">Enable monitoring</span>
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-5"></span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Agent status changes</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="sr-only">Enable notifications</span>
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-5"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Performance alerts</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="sr-only">Enable alerts</span>
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-5"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentManagement; 