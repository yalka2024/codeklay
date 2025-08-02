'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  FolderOpen, 
  Settings, 
  Plus, 
  Share2, 
  GitBranch,
  Calendar,
  Activity,
  Crown,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
  joinedAt: string;
  lastActive: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  framework: string;
  status: 'active' | 'archived' | 'completed';
  lastModified: string;
  collaborators: number;
  roomId: string;
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  projects: Project[];
  settings: {
    allowGuestAccess: boolean;
    requireApproval: boolean;
    maxCollaborators: number;
  };
}

export function TeamWorkspace() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({ name: '', description: '', language: 'typescript', framework: 'nextjs' });
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    // Simulate loading workspace data
    setTimeout(() => {
      const mockWorkspace: Workspace = {
        id: 'ws_123',
        name: 'CodePal Team',
        description: 'Our main development workspace',
        members: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'owner',
            avatar: '/placeholder-user.jpg',
            joinedAt: '2024-01-15',
            lastActive: '2024-01-20T10:30:00Z',
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'admin',
            avatar: '/placeholder-user.jpg',
            joinedAt: '2024-01-16',
            lastActive: '2024-01-20T09:15:00Z',
          },
          {
            id: '3',
            name: 'Bob Wilson',
            email: 'bob@example.com',
            role: 'member',
            avatar: '/placeholder-user.jpg',
            joinedAt: '2024-01-17',
            lastActive: '2024-01-19T16:45:00Z',
          },
        ],
        projects: [
          {
            id: 'proj_1',
            name: 'E-commerce Platform',
            description: 'Modern e-commerce solution with AI recommendations',
            language: 'TypeScript',
            framework: 'Next.js',
            status: 'active',
            lastModified: '2024-01-20T10:30:00Z',
            collaborators: 3,
            roomId: 'room_ecommerce_123',
          },
          {
            id: 'proj_2',
            name: 'Task Management API',
            description: 'RESTful API for task management',
            language: 'Python',
            framework: 'FastAPI',
            status: 'completed',
            lastModified: '2024-01-18T14:20:00Z',
            collaborators: 2,
            roomId: 'room_task_api_456',
          },
          {
            id: 'proj_3',
            name: 'Portfolio Website',
            description: 'Personal portfolio with modern design',
            language: 'JavaScript',
            framework: 'React',
            status: 'active',
            lastModified: '2024-01-19T11:45:00Z',
            collaborators: 1,
            roomId: 'room_portfolio_789',
          },
        ],
        settings: {
          allowGuestAccess: false,
          requireApproval: true,
          maxCollaborators: 10,
        },
      };
      setWorkspace(mockWorkspace);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      toast({
        title: 'Error',
        description: 'Project name is required',
        variant: 'destructive',
      });
      return;
    }

    const project: Project = {
      id: `proj_${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      language: newProject.language,
      framework: newProject.framework,
      status: 'active',
      lastModified: new Date().toISOString(),
      collaborators: 1,
      roomId: `room_${newProject.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    };

    setWorkspace(prev => prev ? {
      ...prev,
      projects: [...prev.projects, project],
    } : null);

    setNewProject({ name: '', description: '', language: 'typescript', framework: 'nextjs' });
    toast({
      title: 'Project Created',
      description: `${project.name} has been created successfully`,
    });
  };

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      toast({
        title: 'Error',
        description: 'Email is required',
        variant: 'destructive',
      });
      return;
    }

    // Simulate inviting a member
    toast({
      title: 'Invitation Sent',
      description: `Invitation sent to ${inviteEmail}`,
    });
    setInviteEmail('');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No workspace found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{workspace.name}</h1>
          <p className="text-muted-foreground">{workspace.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {workspace.members.length} members
          </Badge>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Workspace
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workspace.projects.filter(p => p.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {workspace.projects.length} total projects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workspace.members.length}</div>
                <p className="text-xs text-muted-foreground">
                  {workspace.members.filter(m => m.role === 'owner' || m.role === 'admin').length} admins
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workspace.projects.filter(p => 
                    new Date(p.lastModified) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Projects updated this week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Latest project activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workspace.projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FolderOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {project.language}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {project.framework}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(project.lastModified).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {project.collaborators} collaborators
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Projects</h2>
            <Button onClick={() => setActiveTab('overview')}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>

          {/* Create New Project */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>Start a new collaborative project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Project Name</label>
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Language</label>
                  <Select value={newProject.language} onValueChange={(value) => setNewProject(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter project description"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Framework</label>
                <Select value={newProject.framework} onValueChange={(value) => setNewProject(prev => ({ ...prev, framework: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nextjs">Next.js</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="vue">Vue.js</SelectItem>
                    <SelectItem value="fastapi">FastAPI</SelectItem>
                    <SelectItem value="django">Django</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateProject} disabled={!newProject.name.trim()}>
                Create Project
              </Button>
            </CardContent>
          </Card>

          {/* Project List */}
          <div className="grid gap-4">
            {workspace.projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FolderOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {project.language}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {project.framework}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Last modified {new Date(project.lastModified).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {project.collaborators} collaborators
                      </p>
                                             <Button 
                         variant="outline" 
                         size="sm" 
                         className="mt-2"
                         onClick={() => {
                           // Navigate to collaborative workspace with project selected
                           window.location.href = `/collaborative-workspace?project=${project.id}`;
                         }}
                       >
                         Open Project
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <div className="flex gap-2">
              <Input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-64"
              />
              <Button onClick={handleInviteMember} disabled={!inviteEmail.trim()}>
                Invite Member
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {workspace.members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getRoleColor(member.role)} flex items-center gap-1`}>
                        {getRoleIcon(member.role)}
                        {member.role}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Last active {new Date(member.lastActive).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <h2 className="text-xl font-semibold">Workspace Settings</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>Manage workspace permissions and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Guest Access</h4>
                  <p className="text-sm text-muted-foreground">Allow guests to view projects</p>
                </div>
                <Badge variant={workspace.settings.allowGuestAccess ? 'default' : 'secondary'}>
                  {workspace.settings.allowGuestAccess ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Require Approval</h4>
                  <p className="text-sm text-muted-foreground">Require approval for new members</p>
                </div>
                <Badge variant={workspace.settings.requireApproval ? 'default' : 'secondary'}>
                  {workspace.settings.requireApproval ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Max Collaborators</h4>
                  <p className="text-sm text-muted-foreground">Maximum number of collaborators per project</p>
                </div>
                <Badge variant="outline">{workspace.settings.maxCollaborators}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 