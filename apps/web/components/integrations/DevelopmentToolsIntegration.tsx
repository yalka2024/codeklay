// Development Tools Integration Platform for CodePal
// Features: GitHub, GitLab, Bitbucket, Jira, Azure DevOps, VS Code extensions, CI/CD integration

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface IntegrationProvider {
  id: string;
  name: string;
  type: 'git' | 'project_management' | 'ide' | 'cicd' | 'communication';
  status: 'connected' | 'disconnected' | 'error' | 'configuring';
  icon: string;
  description: string;
  features: string[];
  lastSync: string;
  syncStatus: 'success' | 'error' | 'in_progress' | 'pending';
}

interface GitIntegration {
  id: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  status: 'connected' | 'disconnected' | 'error';
  repositories: GitRepository[];
  webhooks: Webhook[];
  permissions: GitPermissions;
  lastSync: string;
}

interface GitRepository {
  id: string;
  name: string;
  fullName: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  lastCommit: string;
  branch: string;
  status: 'active' | 'archived' | 'disabled';
  syncStatus: 'synced' | 'syncing' | 'error' | 'pending';
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  lastTriggered: string;
  successRate: number;
}

interface GitPermissions {
  read: boolean;
  write: boolean;
  admin: boolean;
  issues: boolean;
  pullRequests: boolean;
  workflows: boolean;
}

interface ProjectManagementIntegration {
  id: string;
  provider: 'jira' | 'azure_devops' | 'linear' | 'clickup';
  status: 'connected' | 'disconnected' | 'error';
  projects: Project[];
  workflows: Workflow[];
  permissions: ProjectPermissions;
  lastSync: string;
}

interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  status: 'active' | 'archived' | 'closed';
  issues: Issue[];
  sprints: Sprint[];
  lastUpdated: string;
}

interface Issue {
  id: string;
  key: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  reporter: string;
  createdDate: string;
  updatedDate: string;
  labels: string[];
}

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'planned';
  issues: string[];
  velocity: number;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'active' | 'inactive' | 'draft';
  lastModified: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'manual' | 'automated' | 'approval';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignee: string;
  dueDate: string;
}

interface ProjectPermissions {
  read: boolean;
  write: boolean;
  admin: boolean;
  createIssues: boolean;
  manageWorkflows: boolean;
}

interface IDEIntegration {
  id: string;
  provider: 'vscode' | 'intellij' | 'eclipse' | 'sublime';
  status: 'connected' | 'disconnected' | 'error';
  extensions: Extension[];
  settings: IDESettings;
  lastSync: string;
}

interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  publisher: string;
  status: 'installed' | 'available' | 'updating' | 'error';
  rating: number;
  downloads: number;
  lastUpdated: string;
}

interface IDESettings {
  theme: string;
  fontSize: number;
  autoSave: boolean;
  formatOnSave: boolean;
  linting: boolean;
  debugging: boolean;
}

interface CICDIntegration {
  id: string;
  provider: 'github_actions' | 'gitlab_ci' | 'jenkins' | 'circleci' | 'azure_pipelines';
  status: 'connected' | 'disconnected' | 'error';
  pipelines: Pipeline[];
  environments: Environment[];
  permissions: CICDPermissions;
  lastSync: string;
}

interface Pipeline {
  id: string;
  name: string;
  description: string;
  status: 'success' | 'failed' | 'running' | 'pending' | 'cancelled';
  branch: string;
  commit: string;
  startTime: string;
  endTime: string;
  duration: number;
  stages: PipelineStage[];
}

interface PipelineStage {
  id: string;
  name: string;
  status: 'success' | 'failed' | 'running' | 'pending' | 'skipped';
  startTime: string;
  endTime: string;
  duration: number;
  jobs: PipelineJob[];
}

interface PipelineJob {
  id: string;
  name: string;
  status: 'success' | 'failed' | 'running' | 'pending' | 'cancelled';
  startTime: string;
  endTime: string;
  duration: number;
  logs: string;
}

interface Environment {
  id: string;
  name: string;
  type: 'development' | 'staging' | 'production';
  status: 'active' | 'inactive' | 'maintenance';
  url: string;
  lastDeployment: string;
  deploymentHistory: Deployment[];
}

interface Deployment {
  id: string;
  version: string;
  status: 'success' | 'failed' | 'in_progress' | 'rolled_back';
  startTime: string;
  endTime: string;
  duration: number;
  commit: string;
  author: string;
}

interface CICDPermissions {
  read: boolean;
  write: boolean;
  admin: boolean;
  triggerBuilds: boolean;
  manageEnvironments: boolean;
}

export default function DevelopmentToolsIntegration() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'git' | 'project_management' | 'ide' | 'cicd'>('overview');
  const [providers, setProviders] = useState<IntegrationProvider[]>([]);
  const [gitIntegrations, setGitIntegrations] = useState<GitIntegration[]>([]);
  const [projectIntegrations, setProjectIntegrations] = useState<ProjectManagementIntegration[]>([]);
  const [ideIntegrations, setIdeIntegrations] = useState<IDEIntegration[]>([]);
  const [cicdIntegrations, setCicdIntegrations] = useState<CICDIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntegrationData();
  }, []);

  const loadIntegrationData = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockProviders: IntegrationProvider[] = [
        {
          id: '1',
          name: 'GitHub',
          type: 'git',
          status: 'connected',
          icon: 'github',
          description: 'Git repository hosting and collaboration platform',
          features: ['Repository Management', 'Pull Requests', 'Issues', 'Actions'],
          lastSync: '2024-01-15T10:00:00Z',
          syncStatus: 'success'
        },
        {
          id: '2',
          name: 'GitLab',
          type: 'git',
          status: 'connected',
          icon: 'gitlab',
          description: 'Complete DevOps platform with Git repository management',
          features: ['Repository Management', 'CI/CD', 'Issues', 'Merge Requests'],
          lastSync: '2024-01-15T09:30:00Z',
          syncStatus: 'success'
        },
        {
          id: '3',
          name: 'Jira',
          type: 'project_management',
          status: 'connected',
          icon: 'jira',
          description: 'Project and issue tracking for software teams',
          features: ['Issue Tracking', 'Project Management', 'Agile Boards', 'Reports'],
          lastSync: '2024-01-15T10:15:00Z',
          syncStatus: 'success'
        },
        {
          id: '4',
          name: 'VS Code',
          type: 'ide',
          status: 'connected',
          icon: 'vscode',
          description: 'Popular code editor with extensive extension ecosystem',
          features: ['Code Editing', 'Extensions', 'Debugging', 'Git Integration'],
          lastSync: '2024-01-15T08:45:00Z',
          syncStatus: 'success'
        },
        {
          id: '5',
          name: 'GitHub Actions',
          type: 'cicd',
          status: 'connected',
          icon: 'github-actions',
          description: 'Automated software workflows for GitHub repositories',
          features: ['CI/CD Pipelines', 'Automated Testing', 'Deployment', 'Workflows'],
          lastSync: '2024-01-15T10:30:00Z',
          syncStatus: 'success'
        }
      ];

      const mockGitIntegrations: GitIntegration[] = [
        {
          id: '1',
          provider: 'github',
          status: 'connected',
          repositories: [
            {
              id: '1',
              name: 'codepal-platform',
              fullName: 'codepal/codepal-platform',
              url: 'https://github.com/codepal/codepal-platform',
              description: 'Next-generation AI-powered development platform',
              language: 'TypeScript',
              stars: 1250,
              forks: 89,
              lastCommit: '2024-01-15T10:00:00Z',
              branch: 'main',
              status: 'active',
              syncStatus: 'synced'
            },
            {
              id: '2',
              name: 'codepal-mobile',
              fullName: 'codepal/codepal-mobile',
              url: 'https://github.com/codepal/codepal-mobile',
              description: 'Mobile application for CodePal platform',
              language: 'React Native',
              stars: 450,
              forks: 23,
              lastCommit: '2024-01-15T09:30:00Z',
              branch: 'develop',
              status: 'active',
              syncStatus: 'syncing'
            }
          ],
          webhooks: [
            {
              id: '1',
              name: 'CodePal Platform Sync',
              url: 'https://api.codepal.com/webhooks/github',
              events: ['push', 'pull_request', 'issues'],
              status: 'active',
              lastTriggered: '2024-01-15T10:00:00Z',
              successRate: 98.5
            }
          ],
          permissions: {
            read: true,
            write: true,
            admin: false,
            issues: true,
            pullRequests: true,
            workflows: true
          },
          lastSync: '2024-01-15T10:00:00Z'
        }
      ];

      const mockProjectIntegrations: ProjectManagementIntegration[] = [
        {
          id: '1',
          provider: 'jira',
          status: 'connected',
          projects: [
            {
              id: '1',
              name: 'CodePal Platform Development',
              key: 'CPAL',
              description: 'Main development project for CodePal platform',
              status: 'active',
              issues: [
                {
                  id: '1',
                  key: 'CPAL-123',
                  title: 'Implement AI code analysis feature',
                  description: 'Add AI-powered code analysis and suggestions',
                  status: 'in_progress',
                  priority: 'high',
                  assignee: 'john.doe@codepal.com',
                  reporter: 'jane.smith@codepal.com',
                  createdDate: '2024-01-10T09:00:00Z',
                  updatedDate: '2024-01-15T10:00:00Z',
                  labels: ['ai', 'feature', 'backend']
                }
              ],
              sprints: [
                {
                  id: '1',
                  name: 'Sprint 24 - AI Features',
                  startDate: '2024-01-08',
                  endDate: '2024-01-21',
                  status: 'active',
                  issues: ['CPAL-123', 'CPAL-124', 'CPAL-125'],
                  velocity: 85
                }
              ],
              lastUpdated: '2024-01-15T10:00:00Z'
            }
          ],
          workflows: [
            {
              id: '1',
              name: 'Feature Development Workflow',
              description: 'Standard workflow for feature development',
              steps: [
                {
                  id: '1',
                  name: 'Requirements Review',
                  type: 'approval',
                  status: 'completed',
                  assignee: 'product.manager@codepal.com',
                  dueDate: '2024-01-12T17:00:00Z'
                }
              ],
              status: 'active',
              lastModified: '2024-01-15T10:00:00Z'
            }
          ],
          permissions: {
            read: true,
            write: true,
            admin: false,
            createIssues: true,
            manageWorkflows: false
          },
          lastSync: '2024-01-15T10:15:00Z'
        }
      ];

      const mockIdeIntegrations: IDEIntegration[] = [
        {
          id: '1',
          provider: 'vscode',
          status: 'connected',
          extensions: [
            {
              id: '1',
              name: 'CodePal Extension',
              version: '1.2.0',
              description: 'Official CodePal extension for VS Code',
              publisher: 'CodePal',
              status: 'installed',
              rating: 4.8,
              downloads: 15000,
              lastUpdated: '2024-01-10T12:00:00Z'
            },
            {
              id: '2',
              name: 'AI Code Assistant',
              version: '2.1.0',
              description: 'AI-powered code completion and suggestions',
              publisher: 'CodePal',
              status: 'installed',
              rating: 4.9,
              downloads: 25000,
              lastUpdated: '2024-01-12T14:00:00Z'
            }
          ],
          settings: {
            theme: 'dark',
            fontSize: 14,
            autoSave: true,
            formatOnSave: true,
            linting: true,
            debugging: true
          },
          lastSync: '2024-01-15T08:45:00Z'
        }
      ];

      const mockCicdIntegrations: CICDIntegration[] = [
        {
          id: '1',
          provider: 'github_actions',
          status: 'connected',
          pipelines: [
            {
              id: '1',
              name: 'CodePal Platform CI/CD',
              description: 'Main CI/CD pipeline for CodePal platform',
              status: 'success',
              branch: 'main',
              commit: 'abc123def456',
              startTime: '2024-01-15T10:00:00Z',
              endTime: '2024-01-15T10:15:00Z',
              duration: 900,
              stages: [
                {
                  id: '1',
                  name: 'Build',
                  status: 'success',
                  startTime: '2024-01-15T10:00:00Z',
                  endTime: '2024-01-15T10:05:00Z',
                  duration: 300,
                  jobs: [
                    {
                      id: '1',
                      name: 'Install Dependencies',
                      status: 'success',
                      startTime: '2024-01-15T10:00:00Z',
                      endTime: '2024-01-15T10:02:00Z',
                      duration: 120,
                      logs: 'npm install completed successfully'
                    }
                  ]
                }
              ]
            }
          ],
          environments: [
            {
              id: '1',
              name: 'Production',
              type: 'production',
              status: 'active',
              url: 'https://app.codepal.com',
              lastDeployment: '2024-01-15T10:15:00Z',
              deploymentHistory: [
                {
                  id: '1',
                  version: 'v1.2.0',
                  status: 'success',
                  startTime: '2024-01-15T10:15:00Z',
                  endTime: '2024-01-15T10:20:00Z',
                  duration: 300,
                  commit: 'abc123def456',
                  author: 'john.doe@codepal.com'
                }
              ]
            }
          ],
          permissions: {
            read: true,
            write: true,
            admin: false,
            triggerBuilds: true,
            manageEnvironments: false
          },
          lastSync: '2024-01-15T10:30:00Z'
        }
      ];

      setProviders(mockProviders);
      setGitIntegrations(mockGitIntegrations);
      setProjectIntegrations(mockProjectIntegrations);
      setIdeIntegrations(mockIdeIntegrations);
      setCicdIntegrations(mockCicdIntegrations);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'success':
      case 'synced':
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'disconnected':
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      case 'error':
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'configuring':
      case 'syncing':
      case 'in_progress':
      case 'running':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'github':
        return '🐙';
      case 'gitlab':
        return '🦊';
      case 'jira':
        return '🦘';
      case 'vscode':
        return '💻';
      case 'github_actions':
        return '⚡';
      default:
        return '🔗';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connected Integrations</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">{providers.filter(p => p.status === 'connected').length}</div>
          <p className="text-sm text-gray-600">of {providers.length} total</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Repositories</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {gitIntegrations.flatMap(g => g.repositories).filter(r => r.status === 'active').length}
          </div>
          <p className="text-sm text-gray-600">Git repositories</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Projects</h3>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {projectIntegrations.flatMap(p => p.projects).filter(proj => proj.status === 'active').length}
          </div>
          <p className="text-sm text-gray-600">Project management</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Running Pipelines</h3>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {cicdIntegrations.flatMap(c => c.pipelines).filter(p => p.status === 'running').length}
          </div>
          <p className="text-sm text-gray-600">CI/CD pipelines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Integration Providers</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {providers.map(provider => (
                <div key={provider.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getProviderIcon(provider.name.toLowerCase())}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{provider.name}</h4>
                      <p className="text-sm text-gray-600">{provider.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(provider.status)}`}>
                      {provider.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(provider.lastSync).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {gitIntegrations.flatMap(g => g.repositories).slice(0, 3).map(repo => (
                <div key={repo.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{repo.name}</h4>
                    <p className="text-sm text-gray-600">{repo.description}</p>
                    <p className="text-xs text-gray-500">
                      Last commit: {new Date(repo.lastCommit).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(repo.syncStatus)}`}>
                    {repo.syncStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGit = () => (
    <div className="space-y-6">
      {gitIntegrations.map(integration => (
        <div key={integration.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getProviderIcon(integration.provider)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{integration.provider.toUpperCase()}</h3>
                  <p className="text-sm text-gray-600">Git Integration</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(integration.status)}`}>
                  {integration.status}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Last sync: {new Date(integration.lastSync).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Repositories</h4>
                <div className="space-y-3">
                  {integration.repositories.map(repo => (
                    <div key={repo.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{repo.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(repo.syncStatus)}`}>
                          {repo.syncStatus}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{repo.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Language:</span>
                          <span className="ml-1 font-medium">{repo.language}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Branch:</span>
                          <span className="ml-1 font-medium">{repo.branch}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Stars:</span>
                          <span className="ml-1 font-medium">{repo.stars}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Forks:</span>
                          <span className="ml-1 font-medium">{repo.forks}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Webhooks</h4>
                <div className="space-y-3">
                  {integration.webhooks.map(webhook => (
                    <div key={webhook.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{webhook.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(webhook.status)}`}>
                          {webhook.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{webhook.url}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {webhook.events.map(event => (
                          <span key={event} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {event}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        Success Rate: {webhook.successRate}% • Last Triggered: {new Date(webhook.lastTriggered).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProjectManagement = () => (
    <div className="space-y-6">
      {projectIntegrations.map(integration => (
        <div key={integration.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getProviderIcon(integration.provider)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{integration.provider.toUpperCase()}</h3>
                  <p className="text-sm text-gray-600">Project Management</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(integration.status)}`}>
                  {integration.status}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Last sync: {new Date(integration.lastSync).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Projects</h4>
                <div className="space-y-3">
                  {integration.projects.map(project => (
                    <div key={project.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{project.name}</h5>
                        <span className="text-sm font-medium text-gray-600">{project.key}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      
                      <div className="mb-3">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">Recent Issues</h6>
                        <div className="space-y-2">
                          {project.issues.slice(0, 3).map(issue => (
                            <div key={issue.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{issue.key}</p>
                                <p className="text-xs text-gray-600">{issue.title}</p>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(issue.status)}`}>
                                {issue.status.replace('_', ' ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Last updated: {new Date(project.lastUpdated).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Workflows</h4>
                <div className="space-y-3">
                  {integration.workflows.map(workflow => (
                    <div key={workflow.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{workflow.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(workflow.status)}`}>
                          {workflow.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                      
                      <div className="space-y-2">
                        {workflow.steps.map(step => (
                          <div key={step.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{step.name}</p>
                              <p className="text-xs text-gray-600">{step.assignee}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(step.status)}`}>
                              {step.status.replace('_', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderIDE = () => (
    <div className="space-y-6">
      {ideIntegrations.map(integration => (
        <div key={integration.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getProviderIcon(integration.provider)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{integration.provider.toUpperCase()}</h3>
                  <p className="text-sm text-gray-600">IDE Integration</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(integration.status)}`}>
                  {integration.status}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Last sync: {new Date(integration.lastSync).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Extensions</h4>
                <div className="space-y-3">
                  {integration.extensions.map(extension => (
                    <div key={extension.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{extension.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(extension.status)}`}>
                          {extension.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{extension.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Version:</span>
                          <span className="ml-1 font-medium">{extension.version}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Rating:</span>
                          <span className="ml-1 font-medium">{extension.rating}/5</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Downloads:</span>
                          <span className="ml-1 font-medium">{extension.downloads.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Publisher:</span>
                          <span className="ml-1 font-medium">{extension.publisher}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Settings</h4>
                <div className="space-y-3">
                  {Object.entries(integration.settings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm text-gray-900">
                        {typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCICD = () => (
    <div className="space-y-6">
      {cicdIntegrations.map(integration => (
        <div key={integration.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getProviderIcon(integration.provider)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{integration.provider.replace('_', ' ').toUpperCase()}</h3>
                  <p className="text-sm text-gray-600">CI/CD Integration</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(integration.status)}`}>
                  {integration.status}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Last sync: {new Date(integration.lastSync).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Pipelines</h4>
                <div className="space-y-3">
                  {integration.pipelines.map(pipeline => (
                    <div key={pipeline.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{pipeline.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(pipeline.status)}`}>
                          {pipeline.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{pipeline.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Branch:</span>
                          <span className="ml-1 font-medium">{pipeline.branch}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <span className="ml-1 font-medium">{Math.round(pipeline.duration / 60)}m</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Commit:</span>
                          <span className="ml-1 font-medium">{pipeline.commit.substring(0, 8)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Stages:</span>
                          <span className="ml-1 font-medium">{pipeline.stages.length}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Started: {new Date(pipeline.startTime).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Environments</h4>
                <div className="space-y-3">
                  {integration.environments.map(env => (
                    <div key={env.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{env.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(env.status)}`}>
                          {env.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{env.url}</p>
                      
                      <div className="mb-3">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">Recent Deployments</h6>
                        <div className="space-y-2">
                          {env.deploymentHistory.slice(0, 2).map(deployment => (
                            <div key={deployment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{deployment.version}</p>
                                <p className="text-xs text-gray-600">{deployment.author}</p>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(deployment.status)}`}>
                                {deployment.status.replace('_', ' ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Last deployment: {new Date(env.lastDeployment).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading integration data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Development Tools Integration</h1>
          <p className="text-gray-600 mt-2">
            GitHub, GitLab, Bitbucket, Jira, Azure DevOps, VS Code extensions, and CI/CD platforms
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'git', label: 'Git Providers' },
              { id: 'project_management', label: 'Project Management' },
              { id: 'ide', label: 'IDE & Extensions' },
              { id: 'cicd', label: 'CI/CD Platforms' }
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

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'git' && renderGit()}
          {activeTab === 'project_management' && renderProjectManagement()}
          {activeTab === 'ide' && renderIDE()}
          {activeTab === 'cicd' && renderCICD()}
        </div>
      </div>
    </div>
  );
} 