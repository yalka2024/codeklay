"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Laptop,
  FolderOpen,
  Terminal,
  FolderSyncIcon as Sync,
  Download,
  Upload,
  Play,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

const localProjects = [
  {
    id: 1,
    name: "my-react-app",
    path: "/Users/john/projects/my-react-app",
    status: "synced",
    lastSync: "2 minutes ago",
    framework: "React",
    language: "TypeScript",
    gitBranch: "main",
    hasChanges: false,
  },
  {
    id: 2,
    name: "backend-api",
    path: "/Users/john/projects/backend-api",
    status: "syncing",
    lastSync: "syncing...",
    framework: "Express.js",
    language: "JavaScript",
    gitBranch: "feature/auth",
    hasChanges: true,
  },
  {
    id: 3,
    name: "mobile-app",
    path: "/Users/john/projects/mobile-app",
    status: "offline",
    lastSync: "1 hour ago",
    framework: "React Native",
    language: "TypeScript",
    gitBranch: "develop",
    hasChanges: false,
  },
]

const terminalSessions = [
  {
    id: 1,
    project: "my-react-app",
    command: "npm run dev",
    status: "running",
    output: "Local: http://localhost:3000\nready - started server on 0.0.0.0:3000",
  },
  {
    id: 2,
    project: "backend-api",
    command: "npm test",
    status: "completed",
    output: "✓ All tests passed (23 tests, 0 failures)",
  },
]

export function LocalDevelopment() {
  const [selectedProject, setSelectedProject] = React.useState(localProjects[0])
  const [connectionStatus, setConnectionStatus] = React.useState("connected")
  const [localPath, setLocalPath] = React.useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "synced":
      case "connected":
      case "running":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "syncing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "offline":
      case "disconnected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "synced":
      case "connected":
        return <CheckCircle className="h-4 w-4" />
      case "syncing":
        return <Sync className="h-4 w-4 animate-spin" />
      case "offline":
      case "disconnected":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Local Development</h1>
          <p className="text-muted-foreground">Connect and sync with your local development environment</p>
        </div>
        <div className="flex gap-2">
          <Badge className={getStatusColor(connectionStatus)}>
            {connectionStatus === "connected" ? (
              <Wifi className="mr-1 h-3 w-3" />
            ) : (
              <WifiOff className="mr-1 h-3 w-3" />
            )}
            {connectionStatus}
          </Badge>
          <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
            <Download className="mr-2 h-4 w-4" />
            Install CodePal CLI
          </Button>
        </div>
      </div>

      {/* Connection Setup */}
      <Card className="border-dashed border-2 border-teal-500/20 bg-gradient-to-r from-teal-500/5 to-purple-600/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Laptop className="h-5 w-5" />
            Connect Local Environment
          </CardTitle>
          <CardDescription>Install the CodePal CLI to sync your local projects with the cloud platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
            <div># Install CodePal CLI</div>
            <div>npm install -g @codepal/cli</div>
            <div className="mt-2"># Connect to your workspace</div>
            <div>codepal connect --workspace=your-workspace</div>
            <div className="mt-2"># Sync current directory</div>
            <div>codepal sync .</div>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter local project path..."
              value={localPath}
              onChange={(e) => setLocalPath(e.target.value)}
              className="flex-1"
            />
            <Button>
              <FolderOpen className="mr-2 h-4 w-4" />
              Browse
            </Button>
            <Button variant="outline">
              <Sync className="mr-2 h-4 w-4" />
              Sync
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Local Projects</TabsTrigger>
          <TabsTrigger value="terminal">Terminal Sessions</TabsTrigger>
          <TabsTrigger value="file-sync">File Sync</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {localProjects.map((project) => (
              <Card
                key={project.id}
                className={`cursor-pointer transition-colors ${
                  selectedProject.id === project.id ? "border-teal-500 bg-teal-500/10" : "hover:border-teal-500/50"
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1">{project.status}</span>
                    </Badge>
                  </div>
                  <CardDescription className="font-mono text-xs">{project.path}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>{project.framework}</span>
                    <span>{project.language}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Branch: {project.gitBranch}</span>
                    {project.hasChanges && (
                      <Badge variant="outline" className="text-xs">
                        Changes
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Last sync: {project.lastSync}</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Terminal className="mr-1 h-3 w-3" />
                      Terminal
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Play className="mr-1 h-3 w-3" />
                      Run
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="terminal" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {terminalSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{session.project}</CardTitle>
                    <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
                  </div>
                  <CardDescription className="font-mono text-sm">$ {session.command}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm min-h-[120px]">
                    <pre>{session.output}</pre>
                    {session.status === "running" && (
                      <div className="flex items-center mt-2">
                        <span>$ </span>
                        <span className="ml-2 bg-green-400 w-2 h-4 animate-pulse"></span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Terminal className="mr-1 h-3 w-3" />
                      New Terminal
                    </Button>
                    <Button size="sm" variant="outline">
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="file-sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time File Synchronization</CardTitle>
              <CardDescription>Monitor and control file changes between local and cloud environments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { file: "src/components/Header.tsx", status: "synced", action: "Modified", time: "2 min ago" },
                  { file: "package.json", status: "syncing", action: "Updated", time: "syncing..." },
                  { file: "src/utils/api.ts", status: "conflict", action: "Conflict", time: "5 min ago" },
                  { file: "README.md", status: "synced", action: "Created", time: "10 min ago" },
                ].map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(file.status)}>{getStatusIcon(file.status)}</Badge>
                      <div>
                        <div className="font-medium text-sm">{file.file}</div>
                        <div className="text-xs text-muted-foreground">
                          {file.action} • {file.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Upload className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Local Development Settings</CardTitle>
              <CardDescription>Configure your local development environment integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Auto-sync on file changes</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically sync files when they change locally
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Real-time collaboration</div>
                    <div className="text-sm text-muted-foreground">Share your local development session with team</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Terminal sharing</div>
                    <div className="text-sm text-muted-foreground">Allow team members to access your terminal</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
