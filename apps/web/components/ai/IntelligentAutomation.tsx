// Intelligent Automation for CodePal
// Features: AI-powered workflow automation, smart project management, intelligent DevOps

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  type: 'code_review' | 'testing' | 'deployment' | 'monitoring' | 'security' | 'custom';
  status: 'active' | 'inactive' | 'error' | 'running';
  triggers: WorkflowTrigger[];
  steps: WorkflowStep[];
  metrics: WorkflowMetrics;
  lastRun: string;
  nextRun?: string;
  enabled: boolean;
}

interface WorkflowTrigger {
  id: string;
  type: 'push' | 'pull_request' | 'schedule' | 'manual' | 'webhook' | 'condition';
  config: Record<string, any>;
  enabled: boolean;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'ai_analysis' | 'code_review' | 'testing' | 'deployment' | 'notification' | 'custom';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  config: Record<string, any>;
  output?: any;
  duration: number;
  order: number;
}

interface WorkflowMetrics {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  averageDuration: number;
  lastSuccessRate: number;
  totalTimeSaved: number; // in hours
}

interface SmartProject {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  estimatedCompletion: string;
  actualCompletion?: string;
  team: ProjectTeam;
  tasks: ProjectTask[];
  risks: ProjectRisk[];
  automation: ProjectAutomation;
}

interface ProjectTeam {
  members: TeamMember[];
  roles: TeamRole[];
  capacity: number;
  utilization: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  availability: number; // percentage
  skills: string[];
  currentTasks: number;
}

interface TeamRole {
  name: string;
  responsibilities: string[];
  requiredSkills: string[];
  capacity: number;
}

interface ProjectTask {
  id: string;
  name: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
  automation: TaskAutomation;
}

interface TaskAutomation {
  autoAssign: boolean;
  autoPrioritize: boolean;
  autoSchedule: boolean;
  aiSuggestions: boolean;
}

interface ProjectRisk {
  id: string;
  title: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  status: 'identified' | 'mitigated' | 'monitoring' | 'resolved';
  mitigationPlan: string;
  aiRecommendations: string[];
}

interface ProjectAutomation {
  autoTaskAssignment: boolean;
  autoRiskDetection: boolean;
  autoProgressTracking: boolean;
  aiResourceOptimization: boolean;
  predictiveAnalytics: boolean;
}

interface IntelligentDevOps {
  id: string;
  name: string;
  type: 'infrastructure' | 'deployment' | 'monitoring' | 'security' | 'cost_optimization';
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  automation: DevOpsAutomation;
  metrics: DevOpsMetrics;
  alerts: DevOpsAlert[];
  recommendations: DevOpsRecommendation[];
}

interface DevOpsAutomation {
  autoScaling: boolean;
  autoBackup: boolean;
  autoSecurityScanning: boolean;
  autoPerformanceOptimization: boolean;
  autoCostOptimization: boolean;
  incidentResponse: boolean;
}

interface DevOpsMetrics {
  uptime: number;
  responseTime: number;
  errorRate: number;
  resourceUtilization: number;
  costEfficiency: number;
  securityScore: number;
}

interface DevOpsAlert {
  id: string;
  type: 'performance' | 'security' | 'cost' | 'availability' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  automation: AlertAutomation;
}

interface AlertAutomation {
  autoAcknowledge: boolean;
  autoEscalate: boolean;
  autoResolve: boolean;
  aiAnalysis: boolean;
}

interface DevOpsRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'performance' | 'security' | 'cost' | 'reliability';
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: string;
  effort: string;
  automation: boolean;
  status: 'pending' | 'implemented' | 'rejected';
}

export default function IntelligentAutomation() {
  const { user } = useAuthContext();
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [projects, setProjects] = useState<SmartProject[]>([]);
  const [devOps, setDevOps] = useState<IntelligentDevOps[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null);
  const [selectedProject, setSelectedProject] = useState<SmartProject | null>(null);
  const [selectedDevOps, setSelectedDevOps] = useState<IntelligentDevOps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'workflows' | 'projects' | 'devops'>('overview');

  // Load intelligent automation data
  const loadAutomationData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockWorkflows: AutomationWorkflow[] = [
        {
          id: '1',
          name: 'AI Code Review Pipeline',
          description: 'Automated code review with AI-powered analysis and suggestions',
          type: 'code_review',
          status: 'active',
          triggers: [
            {
              id: 'trigger-1',
              type: 'pull_request',
              config: { branches: ['main', 'develop'] },
              enabled: true
            }
          ],
          steps: [
            {
              id: 'step-1',
              name: 'AI Code Analysis',
              type: 'ai_analysis',
              status: 'completed',
              config: { analysisType: 'quality_security_performance' },
              duration: 45,
              order: 1
            },
            {
              id: 'step-2',
              name: 'Automated Testing',
              type: 'testing',
              status: 'completed',
              config: { testTypes: ['unit', 'integration'] },
              duration: 120,
              order: 2
            }
          ],
          metrics: {
            totalRuns: 156,
            successfulRuns: 148,
            failedRuns: 8,
            averageDuration: 165,
            lastSuccessRate: 94.9,
            totalTimeSaved: 24.5
          },
          lastRun: '2024-01-15T10:30:00Z',
          enabled: true
        },
        {
          id: '2',
          name: 'Smart Deployment Pipeline',
          description: 'Intelligent deployment with automated rollback and monitoring',
          type: 'deployment',
          status: 'active',
          triggers: [
            {
              id: 'trigger-2',
              type: 'push',
              config: { branch: 'main' },
              enabled: true
            }
          ],
          steps: [
            {
              id: 'step-3',
              name: 'Environment Validation',
              type: 'custom',
              status: 'completed',
              config: { environment: 'staging' },
              duration: 30,
              order: 1
            },
            {
              id: 'step-4',
              name: 'Automated Deployment',
              type: 'deployment',
              status: 'completed',
              config: { strategy: 'blue_green' },
              duration: 180,
              order: 2
            }
          ],
          metrics: {
            totalRuns: 89,
            successfulRuns: 85,
            failedRuns: 4,
            averageDuration: 210,
            lastSuccessRate: 95.5,
            totalTimeSaved: 31.2
          },
          lastRun: '2024-01-15T09:15:00Z',
          enabled: true
        }
      ];

      const mockProjects: SmartProject[] = [
        {
          id: '1',
          name: 'E-commerce Platform Redesign',
          description: 'Modern e-commerce platform with AI-powered recommendations',
          status: 'active',
          priority: 'high',
          progress: 65,
          estimatedCompletion: '2024-03-15',
          team: {
            members: [
              {
                id: 'member-1',
                name: 'Sarah Johnson',
                role: 'Lead Developer',
                availability: 85,
                skills: ['React', 'Node.js', 'TypeScript'],
                currentTasks: 3
              },
              {
                id: 'member-2',
                name: 'Mike Chen',
                role: 'Backend Developer',
                availability: 90,
                skills: ['Python', 'Django', 'PostgreSQL'],
                currentTasks: 2
              }
            ],
            roles: [
              {
                name: 'Lead Developer',
                responsibilities: ['Architecture design', 'Code review', 'Team coordination'],
                requiredSkills: ['React', 'Node.js', 'TypeScript'],
                capacity: 1
              }
            ],
            capacity: 100,
            utilization: 75
          },
          tasks: [
            {
              id: 'task-1',
              name: 'Implement AI recommendation engine',
              description: 'Build machine learning model for product recommendations',
              status: 'in_progress',
              priority: 'high',
              assignee: 'Sarah Johnson',
              estimatedHours: 40,
              actualHours: 25,
              dependencies: [],
              automation: {
                autoAssign: true,
                autoPrioritize: true,
                autoSchedule: true,
                aiSuggestions: true
              }
            }
          ],
          risks: [
            {
              id: 'risk-1',
              title: 'AI Model Performance',
              description: 'AI recommendation model may not meet performance requirements',
              probability: 'medium',
              impact: 'high',
              status: 'monitoring',
              mitigationPlan: 'Implement fallback recommendation system',
              aiRecommendations: [
                'Add model performance monitoring',
                'Implement A/B testing framework',
                'Create backup recommendation algorithm'
              ]
            }
          ],
          automation: {
            autoTaskAssignment: true,
            autoRiskDetection: true,
            autoProgressTracking: true,
            aiResourceOptimization: true,
            predictiveAnalytics: true
          }
        }
      ];

      const mockDevOps: IntelligentDevOps[] = [
        {
          id: '1',
          name: 'Production Infrastructure',
          type: 'infrastructure',
          status: 'active',
          automation: {
            autoScaling: true,
            autoBackup: true,
            autoSecurityScanning: true,
            autoPerformanceOptimization: true,
            autoCostOptimization: true,
            incidentResponse: true
          },
          metrics: {
            uptime: 99.9,
            responseTime: 45,
            errorRate: 0.1,
            resourceUtilization: 75,
            costEfficiency: 85,
            securityScore: 92
          },
          alerts: [
            {
              id: 'alert-1',
              type: 'performance',
              severity: 'medium',
              message: 'Database response time increased by 20%',
              timestamp: '2024-01-15T11:00:00Z',
              status: 'acknowledged',
              automation: {
                autoAcknowledge: true,
                autoEscalate: false,
                autoResolve: false,
                aiAnalysis: true
              }
            }
          ],
          recommendations: [
            {
              id: 'rec-1',
              title: 'Implement Database Connection Pooling',
              description: 'Add connection pooling to improve database performance',
              category: 'performance',
              priority: 'high',
              impact: 'Reduce response time by 30%',
              effort: '2-3 days',
              automation: true,
              status: 'pending'
            }
          ]
        }
      ];

      setWorkflows(mockWorkflows);
      setProjects(mockProjects);
      setDevOps(mockDevOps);
    } catch (error) {
      console.error('Error loading automation data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle workflow status
  const toggleWorkflow = async (workflowId: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWorkflows(prev => prev.map(workflow => 
        workflow.id === workflowId 
          ? { ...workflow, enabled: !workflow.enabled }
          : workflow
      ));
    } catch (error) {
      console.error('Error toggling workflow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run workflow manually
  const runWorkflow = async (workflowId: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setWorkflows(prev => prev.map(workflow => 
        workflow.id === workflowId 
          ? { 
              ...workflow, 
              status: 'running',
              lastRun: new Date().toISOString()
            }
          : workflow
      ));
    } catch (error) {
      console.error('Error running workflow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new workflow
  const createWorkflow = async (name: string, description: string, type: string) => {
    try {
      const newWorkflow: AutomationWorkflow = {
        id: `workflow-${Date.now()}`,
        name,
        description,
        type: type as any,
        status: 'inactive',
        triggers: [],
        steps: [],
        metrics: {
          totalRuns: 0,
          successfulRuns: 0,
          failedRuns: 0,
          averageDuration: 0,
          lastSuccessRate: 0,
          totalTimeSaved: 0
        },
        lastRun: new Date().toISOString(),
        enabled: false
      };
      
      setWorkflows(prev => [newWorkflow, ...prev]);
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  useEffect(() => {
    loadAutomationData();
  }, []);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Workflows</h3>
          <p className="text-2xl font-bold text-blue-600">{workflows.filter(w => w.enabled).length}</p>
          <p className="text-xs text-gray-400">Automation workflows</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
          <p className="text-2xl font-bold text-green-600">{projects.filter(p => p.status === 'active').length}</p>
          <p className="text-xs text-gray-400">Smart projects</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Time Saved</h3>
          <p className="text-2xl font-bold text-purple-600">
            {workflows.reduce((acc, w) => acc + w.metrics.totalTimeSaved, 0).toFixed(1)}h
          </p>
          <p className="text-xs text-gray-400">This month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
          <p className="text-2xl font-bold text-orange-600">
            {workflows.length > 0 
              ? (workflows.reduce((acc, w) => acc + w.metrics.lastSuccessRate, 0) / workflows.length).toFixed(1)
              : 0}%
          </p>
          <p className="text-xs text-gray-400">Workflow success</p>
        </div>
      </div>

      {/* Recent Workflow Runs */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Workflow Runs</h3>
        </div>
        <div className="p-6">
          {workflows.slice(0, 3).map(workflow => (
            <div key={workflow.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <h4 className="font-medium text-gray-900">{workflow.name}</h4>
                <p className="text-sm text-gray-500">{workflow.type.replace('_', ' ')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">{new Date(workflow.lastRun).toLocaleDateString()}</p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  workflow.status === 'active' ? 'bg-green-100 text-green-800' :
                  workflow.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {workflow.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Progress */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Project Progress</h3>
        </div>
        <div className="p-6">
          {projects.slice(0, 3).map(project => (
            <div key={project.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">{project.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.priority === 'critical' ? 'bg-red-100 text-red-800' :
                  project.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {project.priority}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{project.progress}% complete</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWorkflows = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Automation Workflows</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflows.map(workflow => (
          <div key={workflow.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{workflow.name}</h3>
                <p className="text-sm text-gray-500">{workflow.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  workflow.status === 'active' ? 'bg-green-100 text-green-800' :
                  workflow.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {workflow.status}
                </span>
                <button
                  onClick={() => toggleWorkflow(workflow.id)}
                  className={`px-2 py-1 text-xs rounded ${
                    workflow.enabled 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {workflow.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-lg font-semibold text-gray-900">{workflow.metrics.lastSuccessRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time Saved</p>
                <p className="text-lg font-semibold text-gray-900">{workflow.metrics.totalTimeSaved}h</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Recent Steps</p>
              <div className="space-y-2">
                {workflow.steps.slice(0, 2).map(step => (
                  <div key={step.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{step.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      step.status === 'completed' ? 'bg-green-100 text-green-800' :
                      step.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => runWorkflow(workflow.id)}
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Run Now
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

  const renderProjects = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Smart Project Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                <p className="text-sm text-gray-500">{project.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                project.status === 'active' ? 'bg-green-100 text-green-800' :
                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Team Size</p>
                <p className="text-lg font-semibold text-gray-900">{project.team.members.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Utilization</p>
                <p className="text-lg font-semibold text-gray-900">{project.team.utilization}%</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Active Tasks</p>
              <div className="space-y-2">
                {project.tasks.filter(t => t.status !== 'done').slice(0, 2).map(task => (
                  <div key={task.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{task.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      task.status === 'review' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status.replace('_', ' ')}
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
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDevOps = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Intelligent DevOps</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {devOps.map(devops => (
          <div key={devops.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{devops.name}</h3>
                <p className="text-sm text-gray-500">{devops.type.replace('_', ' ')}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                devops.status === 'active' ? 'bg-green-100 text-green-800' :
                devops.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {devops.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Uptime</p>
                <p className="text-lg font-semibold text-gray-900">{devops.metrics.uptime}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Response Time</p>
                <p className="text-lg font-semibold text-gray-900">{devops.metrics.responseTime}ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Error Rate</p>
                <p className="text-lg font-semibold text-gray-900">{devops.metrics.errorRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Security Score</p>
                <p className="text-lg font-semibold text-gray-900">{devops.metrics.securityScore}/100</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Active Alerts</p>
              <div className="space-y-2">
                {devops.alerts.filter(a => a.status === 'active').slice(0, 2).map(alert => (
                  <div key={alert.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{alert.message}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Recommendations</p>
              <div className="space-y-2">
                {devops.recommendations.filter(r => r.status === 'pending').slice(0, 2).map(rec => (
                  <div key={rec.id} className="text-sm">
                    <p className="font-medium text-gray-900">{rec.title}</p>
                    <p className="text-gray-600">{rec.impact}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                View Details
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Intelligent Automation</h1>
          <p className="text-gray-600 mt-2">
            AI-powered workflow automation, smart project management, and intelligent DevOps
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'workflows', label: 'Workflows' },
              { id: 'projects', label: 'Projects' },
              { id: 'devops', label: 'DevOps' }
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'workflows' && renderWorkflows()}
            {activeTab === 'projects' && renderProjects()}
            {activeTab === 'devops' && renderDevOps()}
          </div>
        )}
      </div>
    </div>
  );
} 