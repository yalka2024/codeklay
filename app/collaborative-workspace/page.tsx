'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TeamWorkspace } from '@/components/team-workspace';
import { CollaborativeEditor } from '@/components/collaborative-editor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Code, 
  MessageSquare, 
  GitBranch, 
  Activity,
  Settings,
  Plus,
  FolderOpen
} from 'lucide-react';

export default function CollaborativeWorkspacePage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('workspace');
  const [selectedProject, setSelectedProject] = useState<{
    id: string;
    name: string;
    language: string;
    roomId: string;
  } | null>(null);

  useEffect(() => {
    // Check for project parameter in URL
    const projectId = searchParams.get('project');
    if (projectId) {
      // Simulate loading project data
      const mockProject = {
        id: projectId,
        name: 'E-commerce Platform',
        language: 'TypeScript',
        roomId: `room_${projectId}`,
      };
      setSelectedProject(mockProject);
      setActiveTab('editor');
    }
  }, [searchParams]);

  const handleProjectSelect = (project: any) => {
    setSelectedProject({
      id: project.id,
      name: project.name,
      language: project.language,
      roomId: project.roomId,
    });
    setActiveTab('editor');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Collaborative Workspace</h1>
            <p className="text-muted-foreground">
              Real-time collaboration for your development team
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Live Collaboration
            </Badge>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workspace" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Workspace
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2" disabled={!selectedProject}>
              <Code className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Team Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workspace" className="mt-6">
            <TeamWorkspace />
          </TabsContent>

          <TabsContent value="editor" className="mt-6">
            {selectedProject ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedProject.name}</h2>
                    <p className="text-muted-foreground">
                      Real-time collaborative editing • Room: {selectedProject.roomId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedProject.language}</Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab('workspace')}
                    >
                      Back to Workspace
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <CollaborativeEditor
                    roomId={selectedProject.roomId}
                    initialCode={`// ${selectedProject.name}
// Welcome to the collaborative editor!
// Start coding with your team in real-time.

function welcome() {
  console.log("Hello from ${selectedProject.name}!");
  
  // Add your code here
  return "Ready to collaborate!";
}

// Your team members can see your changes in real-time
// Use the chat panel to discuss your code
`}
                    language={selectedProject.language.toLowerCase()}
                  />
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Code className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Project Selected</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Select a project from the workspace to start collaborative editing
                  </p>
                  <Button onClick={() => setActiveTab('workspace')}>
                    Go to Workspace
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Team Chat
                </CardTitle>
                <CardDescription>
                  Real-time messaging and discussion for your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chat messages would go here */}
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      J
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">John Doe</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">
                        Hey team! I've been working on the authentication flow. Anyone want to review the latest changes?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      J
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Jane Smith</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">
                        Sure! I can take a look. Are you using the new OAuth provider we discussed?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      B
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Bob Wilson</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">
                        I'm working on the API endpoints. Should be ready for testing by tomorrow.
                      </p>
                    </div>
                  </div>

                  {/* Message input */}
                  <div className="flex gap-2 pt-4 border-t">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button size="sm">Send</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 