// AI Launch Preparation for CodePal
// Features: Launch readiness checks, deployment preparation, monitoring setup, go-live coordination

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface LaunchChecklist {
  id: string;
  category: 'technical' | 'security' | 'performance' | 'compliance' | 'business';
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  dueDate: string;
  completedDate?: string;
  notes?: string;
  dependencies: string[];
}

interface DeploymentPlan {
  id: string;
  name: string;
  description: string;
  environment: 'staging' | 'production' | 'canary';
  status: 'planned' | 'in_progress' | 'completed' | 'failed' | 'rolled_back';
  steps: DeploymentStep[];
  rollbackPlan: RollbackPlan;
  estimatedDuration: number; // minutes
  actualDuration?: number;
  scheduledDate: string;
  completedDate?: string;
  team: string[];
}

interface DeploymentStep {
  id: string;
  name: string;
  description: string;
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  estimatedTime: number; // minutes
  actualTime?: number;
  dependencies: string[];
  verificationSteps: string[];
  rollbackSteps: string[];
}

interface RollbackPlan {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  steps: RollbackStep[];
  estimatedTime: number; // minutes
  lastTested: string;
  status: 'ready' | 'needs_testing' | 'not_ready';
}

interface RollbackStep {
  id: string;
  name: string;
  description: string;
  order: number;
  estimatedTime: number;
  verification: string;
}

interface MonitoringSetup {
  id: string;
  name: string;
  type: 'performance' | 'error' | 'security' | 'business' | 'infrastructure';
  status: 'configured' | 'testing' | 'active' | 'failed';
  metrics: MonitoringMetric[];
  alerts: Alert[];
  dashboard: string;
  lastUpdated: string;
}

interface MonitoringMetric {
  id: string;
  name: string;
  description: string;
  unit: string;
  threshold: number;
  currentValue: number;
  status: 'normal' | 'warning' | 'critical';
  trend: 'stable' | 'increasing' | 'decreasing';
}

interface Alert {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  condition: string;
  recipients: string[];
  status: 'active' | 'testing' | 'disabled';
}

interface LaunchTimeline {
  id: string;
  name: string;
  description: string;
  phases: LaunchPhase[];
  status: 'planning' | 'executing' | 'completed' | 'delayed';
  startDate: string;
  endDate: string;
  progress: number; // percentage
}

interface LaunchPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  startDate: string;
  endDate: string;
  tasks: LaunchTask[];
  dependencies: string[];
}

interface LaunchTask {
  id: string;
  name: string;
  description: string;
  assignee: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedHours: number;
  actualHours?: number;
  dueDate: string;
  completedDate?: string;
}

export default function AILaunchPreparation() {
  const { user } = useAuthContext();
  const [checklist, setChecklist] = useState<LaunchChecklist[]>([]);
  const [deployments, setDeployments] = useState<DeploymentPlan[]>([]);
  const [monitoring, setMonitoring] = useState<MonitoringSetup[]>([]);
  const [timeline, setTimeline] = useState<LaunchTimeline[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'deployment' | 'monitoring' | 'timeline'>('overview');

  // Load launch data
  const loadLaunchData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockChecklist: LaunchChecklist[] = [
        {
          id: '1',
          category: 'technical',
          name: 'AI Model Performance Testing',
          description: 'Verify all AI models meet performance benchmarks',
          status: 'completed',
          priority: 'critical',
          assignee: 'ai-team',
          dueDate: '2024-01-20T00:00:00Z',
          completedDate: '2024-01-18T15:30:00Z',
          dependencies: []
        },
        {
          id: '2',
          category: 'security',
          name: 'Security Audit Completion',
          description: 'Complete final security audit and vulnerability assessment',
          status: 'in_progress',
          priority: 'critical',
          assignee: 'security-team',
          dueDate: '2024-01-22T00:00:00Z',
          dependencies: ['1']
        }
      ];

      const mockDeployments: DeploymentPlan[] = [
        {
          id: '1',
          name: 'AI Features Production Deployment',
          description: 'Deploy all AI features to production environment',
          environment: 'production',
          status: 'planned',
          steps: [
            {
              id: 'step1',
              name: 'Database Migration',
              description: 'Update database schema for AI features',
              order: 1,
              status: 'pending',
              estimatedTime: 30,
              dependencies: [],
              verificationSteps: ['Verify schema changes', 'Check data integrity'],
              rollbackSteps: ['Restore previous schema', 'Verify rollback']
            }
          ],
          rollbackPlan: {
            id: 'rollback1',
            name: 'AI Features Rollback',
            description: 'Rollback plan for AI features deployment',
            triggers: ['Performance degradation', 'Critical errors', 'Security issues'],
            steps: [
              {
                id: 'rb1',
                name: 'Disable AI Features',
                description: 'Disable all AI features immediately',
                order: 1,
                estimatedTime: 5,
                verification: 'Verify AI features are disabled'
              }
            ],
            estimatedTime: 15,
            lastTested: '2024-01-15T10:00:00Z',
            status: 'ready'
          },
          estimatedDuration: 120,
          scheduledDate: '2024-01-25T02:00:00Z',
          team: ['devops', 'ai-team', 'backend']
        }
      ];

      const mockMonitoring: MonitoringSetup[] = [
        {
          id: '1',
          name: 'AI Performance Monitoring',
          type: 'performance',
          status: 'active',
          metrics: [
            {
              id: 'm1',
              name: 'Response Time',
              description: 'AI model response time',
              unit: 'ms',
              threshold: 100,
              currentValue: 85,
              status: 'normal',
              trend: 'stable'
            }
          ],
          alerts: [
            {
              id: 'a1',
              name: 'High Response Time',
              description: 'Alert when AI response time exceeds threshold',
              severity: 'high',
              condition: 'response_time > 100ms',
              recipients: ['ai-team', 'devops'],
              status: 'active'
            }
          ],
          dashboard: '/monitoring/ai-performance',
          lastUpdated: '2024-01-15T12:00:00Z'
        }
      ];

      const mockTimeline: LaunchTimeline[] = [
        {
          id: '1',
          name: 'AI Features Launch',
          description: 'Complete launch of AI features to production',
          phases: [
            {
              id: 'phase1',
              name: 'Final Testing',
              description: 'Complete final testing and validation',
              order: 1,
              status: 'completed',
              startDate: '2024-01-15T00:00:00Z',
              endDate: '2024-01-20T00:00:00Z',
              tasks: [
                {
                  id: 'task1',
                  name: 'Performance Testing',
                  description: 'Complete performance testing',
                  assignee: 'qa-team',
                  status: 'completed',
                  priority: 'high',
                  estimatedHours: 16,
                  actualHours: 14,
                  dueDate: '2024-01-18T00:00:00Z',
                  completedDate: '2024-01-17T16:00:00Z'
                }
              ],
              dependencies: []
            }
          ],
          status: 'executing',
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-01-30T00:00:00Z',
          progress: 65
        }
      ];

      setChecklist(mockChecklist);
      setDeployments(mockDeployments);
      setMonitoring(mockMonitoring);
      setTimeline(mockTimeline);
    } catch (error) {
      console.error('Error loading launch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update checklist item
  const updateChecklistItem = async (itemId: string, status: LaunchChecklist['status']) => {
    try {
      setChecklist(prev => prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status,
              completedDate: status === 'completed' ? new Date().toISOString() : undefined
            }
          : item
      ));
    } catch (error) {
      console.error('Error updating checklist item:', error);
    }
  };

  useEffect(() => {
    loadLaunchData();
  }, []);

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Checklist Items</h3>
          <p className="text-2xl font-bold text-blue-600">{checklist.length}</p>
          <p className="text-xs text-gray-400">Total items</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-2xl font-bold text-green-600">
            {checklist.filter(item => item.status === 'completed').length}
          </p>
          <p className="text-xs text-gray-400">Ready for launch</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Critical Items</h3>
          <p className="text-2xl font-bold text-red-600">
            {checklist.filter(item => item.priority === 'critical' && item.status !== 'completed').length}
          </p>
          <p className="text-xs text-gray-400">Need attention</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Launch Progress</h3>
          <p className="text-2xl font-bold text-purple-600">
            {timeline.length > 0 ? timeline[0].progress : 0}%
          </p>
          <p className="text-xs text-gray-400">Overall progress</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Critical Checklist Items</h3>
        {checklist.filter(item => item.priority === 'critical').map(item => (
          <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div>
              <h4 className="font-medium text-gray-900">{item.name}</h4>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.status === 'completed' ? 'bg-green-100 text-green-800' :
                item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                item.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status.replace('_', ' ')}
              </span>
              <button
                onClick={() => updateChecklistItem(item.id, 'completed')}
                disabled={item.status === 'completed'}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Mark Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChecklist = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Launch Checklist</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {checklist.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.priority === 'critical' ? 'bg-red-100 text-red-800' :
                item.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {item.priority}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Assignee</p>
                <p className="text-lg font-semibold text-gray-900">{item.assignee}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(item.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.status === 'completed' ? 'bg-green-100 text-green-800' :
                item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                item.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status.replace('_', ' ')}
              </span>
              <span className="text-sm text-gray-500">{item.category}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => updateChecklistItem(item.id, 'completed')}
                disabled={item.status === 'completed'}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Mark Complete
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDeployment = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Deployment Plans</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deployments.map(deployment => (
          <div key={deployment.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{deployment.name}</h3>
                <p className="text-sm text-gray-500">{deployment.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                deployment.status === 'completed' ? 'bg-green-100 text-green-800' :
                deployment.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                deployment.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {deployment.status.replace('_', ' ')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Environment</p>
                <p className="text-lg font-semibold text-gray-900">{deployment.environment}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="text-lg font-semibold text-gray-900">{deployment.estimatedDuration}min</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Steps</p>
              <div className="space-y-2">
                {deployment.steps.map(step => (
                  <div key={step.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{step.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      step.status === 'completed' ? 'bg-green-100 text-green-800' :
                      step.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Execute
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                View Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Monitoring Setup</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {monitoring.map(setup => (
          <div key={setup.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{setup.name}</h3>
                <p className="text-sm text-gray-500">{setup.type} monitoring</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                setup.status === 'active' ? 'bg-green-100 text-green-800' :
                setup.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                setup.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {setup.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Metrics</p>
                <p className="text-lg font-semibold text-gray-900">{setup.metrics.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Alerts</p>
                <p className="text-lg font-semibold text-gray-900">{setup.alerts.length}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Key Metrics</p>
              <div className="space-y-2">
                {setup.metrics.slice(0, 3).map(metric => (
                  <div key={metric.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{metric.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      metric.status === 'normal' ? 'bg-green-100 text-green-800' :
                      metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {metric.currentValue} {metric.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                View Dashboard
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Launch Timeline</h2>
      <div className="space-y-4">
        {timeline.map(launch => (
          <div key={launch.id} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">{launch.name}</h3>
              <p className="text-sm text-gray-500">{launch.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Progress</p>
                <p className="text-lg font-semibold text-gray-900">{launch.progress}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-semibold text-gray-900">{launch.status}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Phases</p>
              <div className="space-y-2">
                {launch.phases.map(phase => (
                  <div key={phase.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{phase.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                      phase.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      phase.status === 'delayed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {phase.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                View Details
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Update Progress
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Launch Preparation</h1>
          <p className="text-gray-600 mt-2">
            Launch readiness checks, deployment preparation, monitoring setup, and go-live coordination
          </p>
        </div>

        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'checklist', label: 'Checklist' },
              { id: 'deployment', label: 'Deployment' },
              { id: 'monitoring', label: 'Monitoring' },
              { id: 'timeline', label: 'Timeline' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!isLoading && (
          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'checklist' && renderChecklist()}
            {activeTab === 'deployment' && renderDeployment()}
            {activeTab === 'monitoring' && renderMonitoring()}
            {activeTab === 'timeline' && renderTimeline()}
          </div>
        )}
      </div>
    </div>
  );
} 