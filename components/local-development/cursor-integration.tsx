"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Settings, Download, ExternalLink } from "lucide-react"

const editorFeatures = [
  {
    name: "AI Code Completion",
    description: "Intelligent code suggestions powered by CodePal AI",
    status: "active",
    shortcut: "Ctrl+Space",
  },
  {
    name: "AI Chat Assistant",
    description: "Ask questions about your code directly in the editor",
    status: "active",
    shortcut: "Ctrl+Shift+L",
  },
  {
    name: "Code Review Integration",
    description: "Real-time code quality analysis and suggestions",
    status: "active",
    shortcut: "Ctrl+Shift+R",
  },
  {
    name: "Terminal Integration",
    description: "Embedded terminal with AI command suggestions",
    status: "active",
    shortcut: "Ctrl+`",
  },
]

const availableExtensions = [
  {
    name: "CodePal VS Code Extension",
    description: "Full CodePal integration for VS Code",
    downloads: "50K+",
    rating: 4.8,
    status: "available",
  },
  {
    name: "CodePal Cursor Plugin",
    description: "Native Cursor integration with CodePal AI",
    downloads: "25K+",
    rating: 4.9,
    status: "available",
  },
  {
    name: "CodePal JetBrains Plugin",
    description: "IntelliJ, WebStorm, and other JetBrains IDEs",
    downloads: "15K+",
    rating: 4.7,
    status: "available",
  },
  {
    name: "CodePal Vim Plugin",
    description: "Vim/Neovim integration for terminal-based development",
    downloads: "8K+",
    rating: 4.6,
    status: "beta",
  },
]

export function CursorIntegration() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editor Integration</h1>
          <p className="text-muted-foreground">Use CodePal AI directly in your favorite code editor</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
          <Download className="mr-2 h-4 w-4" />
          Install Extensions
        </Button>
      </div>

      {/* Cursor-like Interface Demo */}
      <Card className="border-2 border-teal-500/20 bg-gradient-to-r from-teal-500/5 to-purple-600/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            CodePal AI in Your Editor
          </CardTitle>
          <CardDescription>Experience Cursor-like AI assistance with CodePal's advanced capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4 text-gray-400">
              <span>📁 my-project/src/components/UserAuth.tsx</span>
              <Badge variant="outline" className="text-xs">
                TypeScript React
              </Badge>
            </div>
            <div className="space-y-2 text-gray-300">
              <div>
                <span className="text-blue-400">import</span> <span className="text-yellow-300">React</span>{" "}
                <span className="text-blue-400">from</span> <span className="text-green-400">'react'</span>
              </div>
              <div>
                <span className="text-blue-400">import</span> {`{ useState }`}{" "}
                <span className="text-blue-400">from</span> <span className="text-green-400">'react'</span>
              </div>
              <div className="mt-4"></div>
              <div>
                <span className="text-blue-400">export</span> <span className="text-blue-400">function</span>{" "}
                <span className="text-yellow-300">UserAuth</span>() {`{`}
              </div>
              <div className="ml-4">
                <span className="text-blue-400">const</span> [email, setEmail] ={" "}
                <span className="text-yellow-300">useState</span>(<span className="text-green-400">''</span>)
              </div>
              <div className="ml-4 bg-blue-500/20 border-l-2 border-blue-500 pl-2">
                <span className="text-blue-300">// 🤖 CodePal AI Suggestion:</span>
                <br />
                <span className="text-blue-300">// Add password state and validation</span>
              </div>
              <div className="ml-4 text-gray-500">
                <span>const [password, setPassword] = useState('')</span>
                <span className="bg-gray-700 text-gray-400 px-1 ml-2 text-xs">Tab to accept</span>
              </div>
              <div className="ml-4"></div>
              <div className="ml-4 bg-purple-500/20 border-l-2 border-purple-500 pl-2">
                <span className="text-purple-300">💬 AI Chat: "How can I add email validation?"</span>
              </div>
              <div>{`}`}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="features" className="space-y-4">
        <TabsList>
          <TabsTrigger value="features">AI Features</TabsTrigger>
          <TabsTrigger value="extensions">Extensions</TabsTrigger>
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {editorFeatures.map((feature) => (
              <Card key={feature.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{feature.name}</CardTitle>
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">{feature.status}</Badge>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Shortcut: {feature.shortcut}</span>
                    <Button size="sm" variant="outline">
                      <Settings className="mr-1 h-3 w-3" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="extensions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {availableExtensions.map((extension) => (
              <Card key={extension.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{extension.name}</CardTitle>
                  <CardDescription>{extension.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Downloads: {extension.downloads}</span>
                    <span>Rating: ⭐ {extension.rating}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Download className="mr-1 h-3 w-3" />
                      Install
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Setup Guide</CardTitle>
              <CardDescription>Get CodePal AI working in your editor in minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500 text-white text-sm font-medium">
                    1
                  </div>
                  <div>
                    <div className="font-medium">Install Extension</div>
                    <div className="text-sm text-muted-foreground">
                      Download and install the CodePal extension for your editor
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500 text-white text-sm font-medium">
                    2
                  </div>
                  <div>
                    <div className="font-medium">Authenticate</div>
                    <div className="text-sm text-muted-foreground">
                      Sign in with your CodePal account to enable AI features
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500 text-white text-sm font-medium">
                    3
                  </div>
                  <div>
                    <div className="font-medium">Configure Settings</div>
                    <div className="text-sm text-muted-foreground">Customize AI behavior and keyboard shortcuts</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500 text-white text-sm font-medium">
                    4
                  </div>
                  <div>
                    <div className="font-medium">Start Coding</div>
                    <div className="text-sm text-muted-foreground">
                      Begin using AI-powered code completion and assistance
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shortcuts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>AI Assistance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { action: "AI Code Completion", shortcut: "Ctrl+Space" },
                  { action: "AI Chat", shortcut: "Ctrl+Shift+L" },
                  { action: "Explain Code", shortcut: "Ctrl+Shift+E" },
                  { action: "Generate Tests", shortcut: "Ctrl+Shift+T" },
                ].map((item) => (
                  <div key={item.action} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{item.action}</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.shortcut}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Development Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { action: "Run Terminal Command", shortcut: "Ctrl+Shift+R" },
                  { action: "Debug with AI", shortcut: "Ctrl+Shift+D" },
                  { action: "Code Review", shortcut: "Ctrl+Shift+C" },
                  { action: "Sync to Cloud", shortcut: "Ctrl+Shift+S" },
                ].map((item) => (
                  <div key={item.action} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{item.action}</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.shortcut}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
