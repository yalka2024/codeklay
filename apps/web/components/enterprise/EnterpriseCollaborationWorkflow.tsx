// Enterprise Collaboration & Workflow for CodePal
// Features: Team collaboration tools, advanced project management, workflow automation, approval processes

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  projects: number;
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  lastActivity: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  team: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startDate: string;
  endDate: string;
  tasks: Task[];
  collaborators: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  attachments: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  type: 'approval' | 'review' | 'deployment' | 'custom';
  status: 'active' | 'draft' | 'archived';
  steps: WorkflowStep[];
  triggers: string[];
  createdAt: string;
  lastModified: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'review' | 'notification' | 'action';
  assignee: string;
  order: number;
  conditions: string[];
  actions: string[];
  estimatedTime: number;
}

interface ApprovalProcess {
  id: string;
  title: string;
  description: string;
  type: 'code_review' | 'deployment' | 'budget' | 'security';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requester: string;
  approvers: Approver[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  dueDate: string;
  attachments: string[];
}

interface Approver {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: string;
  timestamp: string;
}

interface Communication {
  id: string;
  type: 'announcement' | 'update' | 'alert' | 'meeting';
  title: string;
  content: string;
  author: string;
  audience: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  scheduledFor?: string;
  readBy: string[];
}

export default function EnterpriseCollaborationWorkflow() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'projects' | 'workflows' | 'approvals' | 'communication'>('overview');
  const [teams, setTeams] = useState<Team[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [approvalProcesses, setApprovalProcesses] = useState<ApprovalProcess[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollaborationData();
  }, []);

  const loadCollaborationData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'Frontend Development',
          description: 'Responsible for user interface and client-side development',
          members: [
            { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'owner', avatar: '/avatars/sarah.jpg', status: 'online', lastSeen: '2024-03-20T10:30:00Z' },
            { id: '2', name: 'Mike Chen', email: 'mike.chen@company.com', role: 'admin', avatar: '/avatars/mike.jpg', status: 'online', lastSeen: '2024-03-20T10:25:00Z' },
            { id: '3', name: 'Emily Davis', email: 'emily.davis@company.com', role: 'member', avatar: '/avatars/emily.jpg', status: 'away', lastSeen: '2024-03-20T09:45:00Z' }
          ],
          projects: 5,
          status: 'active',
          createdAt: '2024-01-15',
          lastActivity: '2024-03-20T10:30:00Z'
        },
        {
          id: '2',
          name: 'Backend Development',
          description: 'Server-side development and API management',
          members: [
            { id: '4', name: 'Alex Rodriguez', email: 'alex.rodriguez@company.com', role: 'owner', avatar: '/avatars/alex.jpg', status: 'online', lastSeen: '2024-03-20T10:28:00Z' },
            { id: '5', name: 'Lisa Wang', email: 'lisa.wang@company.com', role: 'admin', avatar: '/avatars/lisa.jpg', status: 'offline', lastSeen: '2024-03-20T08:15:00Z' }
          ],
          projects: 3,
          status: 'active',
          createdAt: '2024-01-20',
          lastActivity: '2024-03-20T10:28:00Z'
        }
      ];

      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'CodePal Dashboard Redesign',
          description: 'Modernize the main dashboard with improved UX and performance',
          team: 'Frontend Development',
          status: 'active',
          priority: 'high',
          progress: 65,
          startDate: '2024-02-15',
          endDate: '2024-04-15',
          tasks: [
            {
              id: '1',
              title: 'Design new dashboard layout',
              description: 'Create wireframes and mockups for the new dashboard',
              assignee: 'Sarah Johnson',
              status: 'done',
              priority: 'high',
              dueDate: '2024-03-10',
              estimatedHours: 16,
              actualHours: 18,
              tags: ['design', 'ui'],
              comments: [
                { id: '1', author: 'Sarah Johnson', content: 'Design completed and approved', timestamp: '2024-03-10T15:30:00Z', attachments: [] }
              ]
            },
            {
              id: '2',
              title: 'Implement responsive components',
              description: 'Build reusable React components for the dashboard',
              assignee: 'Mike Chen',
              status: 'in_progress',
              priority: 'high',
              dueDate: '2024-03-25',
              estimatedHours: 24,
              actualHours: 12,
              tags: ['development', 'react'],
              comments: [
                { id: '2', author: 'Mike Chen', content: 'Working on the chart components', timestamp: '2024-03-20T10:15:00Z', attachments: [] }
              ]
            }
          ],
          collaborators: ['Sarah Johnson', 'Mike Chen', 'Emily Davis']
        },
        {
          id: '2',
          name: 'API Performance Optimization',
          description: 'Improve API response times and add caching layer',
          team: 'Backend Development',
          status: 'active',
          priority: 'medium',
          progress: 40,
          startDate: '2024-03-01',
          endDate: '2024-04-30',
          tasks: [
            {
              id: '3',
              title: 'Implement Redis caching',
              description: 'Add Redis cache layer for frequently accessed data',
              assignee: 'Alex Rodriguez',
              status: 'in_progress',
              priority: 'medium',
              dueDate: '2024-03-30',
              estimatedHours: 20,
              actualHours: 8,
              tags: ['backend', 'performance'],
              comments: [
                { id: '3', author: 'Alex Rodriguez', content: 'Redis setup completed, working on cache strategies', timestamp: '2024-03-20T09:45:00Z', attachments: [] }
              ]
            }
          ],
          collaborators: ['Alex Rodriguez', 'Lisa Wang']
        }
      ];

      const mockWorkflows: Workflow[] = [
        {
          id: '1',
          name: 'Code Review Process',
          description: 'Automated code review workflow with approval gates',
          type: 'review',
          status: 'active',
          steps: [
            {
              id: '1',
              name: 'Automated Tests',
              type: 'action',
              assignee: 'system',
              order: 1,
              conditions: ['tests_passed'],
              actions: ['run_tests', 'generate_report'],
              estimatedTime: 5
            },
            {
              id: '2',
              name: 'Peer Review',
              type: 'review',
              assignee: 'team_lead',
              order: 2,
              conditions: ['tests_passed', 'code_quality_ok'],
              actions: ['request_review', 'notify_reviewer'],
              estimatedTime: 60
            },
            {
              id: '3',
              name: 'Senior Review',
              type: 'approval',
              assignee: 'senior_developer',
              order: 3,
              conditions: ['peer_approved'],
              actions: ['request_approval', 'merge_if_approved'],
              estimatedTime: 120
            }
          ],
          triggers: ['pull_request_created'],
          createdAt: '2024-01-15',
          lastModified: '2024-03-15'
        },
        {
          id: '2',
          name: 'Deployment Pipeline',
          description: 'Automated deployment workflow with staging and production',
          type: 'deployment',
          status: 'active',
          steps: [
            {
              id: '4',
              name: 'Build & Test',
              type: 'action',
              assignee: 'ci_system',
              order: 1,
              conditions: ['code_merged'],
              actions: ['build', 'run_tests', 'security_scan'],
              estimatedTime: 15
            },
            {
              id: '5',
              name: 'Staging Deployment',
              type: 'action',
              assignee: 'devops',
              order: 2,
              conditions: ['build_successful'],
              actions: ['deploy_staging', 'run_integration_tests'],
              estimatedTime: 30
            },
            {
              id: '6',
              name: 'Production Approval',
              type: 'approval',
              assignee: 'release_manager',
              order: 3,
              conditions: ['staging_tests_passed'],
              actions: ['request_approval', 'deploy_production'],
              estimatedTime: 60
            }
          ],
          triggers: ['main_branch_updated'],
          createdAt: '2024-02-01',
          lastModified: '2024-03-10'
        }
      ];

      const mockApprovalProcesses: ApprovalProcess[] = [
        {
          id: '1',
          title: 'Database Schema Changes',
          description: 'Request to modify user table structure for new features',
          type: 'code_review',
          status: 'pending',
          requester: 'Alex Rodriguez',
          approvers: [
            { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'Tech Lead', status: 'pending', comments: '', timestamp: '' },
            { id: '2', name: 'John Smith', email: 'john.smith@company.com', role: 'Database Admin', status: 'pending', comments: '', timestamp: '' }
          ],
          priority: 'high',
          createdAt: '2024-03-20T09:00:00Z',
          dueDate: '2024-03-22T17:00:00Z',
          attachments: ['schema_changes.sql', 'migration_plan.md']
        },
        {
          id: '2',
          title: 'Production Deployment - v2.1.0',
          description: 'Deploy new features including dashboard redesign',
          type: 'deployment',
          status: 'approved',
          requester: 'Mike Chen',
          approvers: [
            { id: '3', name: 'Lisa Wang', email: 'lisa.wang@company.com', role: 'Release Manager', status: 'approved', comments: 'All tests passed, ready for deployment', timestamp: '2024-03-20T10:15:00Z' }
          ],
          priority: 'medium',
          createdAt: '2024-03-20T08:30:00Z',
          dueDate: '2024-03-20T18:00:00Z',
          attachments: ['release_notes.md', 'deployment_checklist.md']
        }
      ];

      const mockCommunications: Communication[] = [
        {
          id: '1',
          type: 'announcement',
          title: 'New CodePal Features Released',
          content: 'We are excited to announce the release of new collaboration features including real-time code editing and enhanced project management tools.',
          author: 'Product Team',
          audience: ['all_users'],
          priority: 'medium',
          status: 'published',
          createdAt: '2024-03-20T10:00:00Z',
          readBy: ['sarah.johnson@company.com', 'mike.chen@company.com']
        },
        {
          id: '2',
          type: 'meeting',
          title: 'Sprint Planning - Q2 2024',
          content: 'Join us for the Q2 2024 sprint planning session to discuss upcoming features and priorities.',
          author: 'Project Manager',
          audience: ['development_team', 'product_team'],
          priority: 'high',
          status: 'published',
          createdAt: '2024-03-19T14:00:00Z',
          scheduledFor: '2024-03-25T10:00:00Z',
          readBy: ['alex.rodriguez@company.com']
        },
        {
          id: '3',
          type: 'alert',
          title: 'Scheduled Maintenance - March 22',
          content: 'CodePal will be undergoing scheduled maintenance on March 22 from 2:00 AM to 4:00 AM EST.',
          author: 'DevOps Team',
          audience: ['all_users'],
          priority: 'urgent',
          status: 'published',
          createdAt: '2024-03-18T16:00:00Z',
          readBy: ['sarah.johnson@company.com', 'mike.chen@company.com', 'alex.rodriguez@company.com']
        }
      ];

      setTeams(mockTeams);
      setProjects(mockProjects);
      setWorkflows(mockWorkflows);
      setApprovalProcesses(mockApprovalProcesses);
      setCommunications(mockCommunications);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'archived': return 'text-yellow-600 bg-yellow-100';
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      case 'away': return 'text-orange-600 bg-orange-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      case 'published': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      case 'urgent': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderOverview = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Active Teams</h3>
          <p className="text-3xl font-bold text-blue-600">{teams.filter(t => t.status === 'active').length}</p>
          <p className="text-sm text-blue-700">Collaborative teams</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Active Projects</h3>
          <p className="text-3xl font-bold text-green-600">{projects.filter(p => p.status === 'active').length}</p>
          <p className="text-sm text-green-700">Ongoing projects</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Workflows</h3>
          <p className="text-3xl font-bold text-purple-600">{workflows.filter(w => w.status === 'active').length}</p>
          <p className="text-sm text-purple-700">Active workflows</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900">Pending Approvals</h3>
          <p className="text-3xl font-bold text-orange-600">{approvalProcesses.filter(a => a.status === 'pending').length}</p>
          <p className="text-sm text-orange-700">Awaiting approval</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Project Updates</h3>
          <div className="space-y-4">
            {projects.slice(0, 3).map(project => (
              <div key={project.id} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${getProgressColor(project.progress)}`} style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{project.team}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Activity</h3>
          <div className="space-y-4">
            {teams.map(team => (
              <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <h4 className="font-medium text-gray-900">{team.name}</h4>
                  <p className="text-sm text-gray-600">{team.members.length} members • {team.projects} projects</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(team.status)}`}>
                    {team.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {team.members.filter(m => m.status === 'online').length} online
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeams = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Management</h3>
      <div className="space-y-6">
        {teams.map(team => (
          <div key={team.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{team.name}</h4>
                <p className="text-sm text-gray-600">{team.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(team.status)}`}>
                {team.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Members</p>
                <p className="text-lg font-semibold text-gray-900">{team.members.length}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Projects</p>
                <p className="text-lg font-semibold text-gray-900">{team.projects}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Activity</p>
                <p className="text-sm text-gray-900">{new Date(team.lastActivity).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Team Members</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {team.members.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">{member.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Management</h3>
      <div className="space-y-6">
        {projects.map(project => (
          <div key={project.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{project.name}</h4>
                <p className="text-sm text-gray-600">{project.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status.replace('_', ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Progress</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${getProgressColor(project.progress)}`} style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Team</p>
                <p className="text-sm text-gray-900">{project.team}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Tasks</p>
                <p className="text-sm text-gray-900">{project.tasks.length}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Due Date</p>
                <p className="text-sm text-gray-900">{new Date(project.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Tasks ({project.tasks.length})</h5>
              <div className="space-y-2">
                {project.tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-600">Assigned to {task.assignee}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWorkflows = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Automation</h3>
      <div className="space-y-6">
        {workflows.map(workflow => (
          <div key={workflow.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{workflow.name}</h4>
                <p className="text-sm text-gray-600">{workflow.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workflow.status)}`}>
                  {workflow.status}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                  {workflow.type}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Steps</p>
                <p className="text-lg font-semibold text-gray-900">{workflow.steps.length}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Triggers</p>
                <p className="text-sm text-gray-900">{workflow.triggers.join(', ')}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Modified</p>
                <p className="text-sm text-gray-900">{new Date(workflow.lastModified).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Workflow Steps</h5>
              <div className="space-y-3">
                {workflow.steps.map(step => (
                  <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {step.order}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{step.name}</p>
                        <p className="text-xs text-gray-600">{step.type} • {step.estimatedTime} min</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{step.assignee}</p>
                      <p className="text-xs text-gray-600">{step.conditions.length} conditions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApprovals = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Processes</h3>
      <div className="space-y-4">
        {approvalProcesses.map(process => (
          <div key={process.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{process.title}</h4>
                <p className="text-sm text-gray-600">{process.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(process.status)}`}>
                  {process.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(process.priority)}`}>
                  {process.priority}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Type</p>
                <p className="text-sm text-gray-900">{process.type.replace('_', ' ')}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Requester</p>
                <p className="text-sm text-gray-900">{process.requester}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Approvers</p>
                <p className="text-sm text-gray-900">{process.approvers.length}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Due Date</p>
                <p className="text-sm text-gray-900">{new Date(process.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Approvers</h5>
              <div className="space-y-2">
                {process.approvers.map(approver => (
                  <div key={approver.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{approver.name}</p>
                      <p className="text-xs text-gray-600">{approver.role}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approver.status)}`}>
                        {approver.status}
                      </span>
                      {approver.comments && (
                        <span className="text-xs text-gray-500">"{approver.comments}"</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Enterprise Communication</h3>
      <div className="space-y-4">
        {communications.map(comm => (
          <div key={comm.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    comm.type === 'announcement' ? 'bg-blue-100 text-blue-600' :
                    comm.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                    comm.type === 'alert' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {comm.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(comm.priority)}`}>
                    {comm.priority}
                  </span>
                </div>
                <h4 className="text-lg font-medium text-gray-900">{comm.title}</h4>
                <p className="text-sm text-gray-600">{comm.content}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(comm.status)}`}>
                {comm.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Author</p>
                <p className="text-sm text-gray-900">{comm.author}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Audience</p>
                <p className="text-sm text-gray-900">{comm.audience.join(', ')}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Read By</p>
                <p className="text-sm text-gray-900">{comm.readBy.length} users</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Created</p>
                <p className="text-sm text-gray-900">{new Date(comm.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {comm.scheduledFor && (
              <div className="bg-blue-50 p-3 rounded mb-4">
                <p className="text-sm text-blue-700">
                  <strong>Scheduled for:</strong> {new Date(comm.scheduledFor).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading collaboration data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Collaboration & Workflow</h1>
          <p className="text-gray-600 mt-2">
            Team collaboration tools, advanced project management, workflow automation, and approval processes
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'teams', label: 'Teams' },
              { id: 'projects', label: 'Projects' },
              { id: 'workflows', label: 'Workflows' },
              { id: 'approvals', label: 'Approvals' },
              { id: 'communication', label: 'Communication' }
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
          {activeTab === 'teams' && renderTeams()}
          {activeTab === 'projects' && renderProjects()}
          {activeTab === 'workflows' && renderWorkflows()}
          {activeTab === 'approvals' && renderApprovals()}
          {activeTab === 'communication' && renderCommunication()}
        </div>
      </div>
    </div>
  );
} 