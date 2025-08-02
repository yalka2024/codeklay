"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  GitBranch,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Settings,
  Monitor,
  Shield,
  Cloud,
  Database,
  Server,
} from "lucide-react"
import { useI18n } from '../../app/i18n'

const pipelineData = {
  current: {
    id: "build-456",
    status: "running",
    branch: "feature/user-auth",
    commit: "a1b2c3d",
    author: "John Doe",
    startTime: "2024-01-20T10:30:00Z",
    duration: "5m 23s",
    progress: 65,
    currentStage: "Testing",
  },
  stages: [
    {
      name: "Source",
      status: "completed",
      duration: "12s",
      steps: [
        { name: "Checkout Code", status: "completed", duration: "8s" },
        { name: "Install Dependencies", status: "completed", duration: "4s" },
      ],
    },
    {
      name: "Build",
      status: "completed",
      duration: "2m 45s",
      steps: [
        { name: "Compile TypeScript", status: "completed", duration: "1m 20s" },
        { name: "Bundle Assets", status: "completed", duration: "1m 15s" },
        { name: "Optimize Images", status: "completed", duration: "10s" },
      ],
    },
    {
      name: "Testing",
      status: "running",
      duration: "1m 30s",
      steps: [
        { name: "Unit Tests", status: "completed", duration: "45s" },
        { name: "Integration Tests", status: "running", duration: "45s" },
        { name: "E2E Tests", status: "pending", duration: "" },
      ],
    },
    {
      name: "Security",
      status: "pending",
      duration: "",
      steps: [
        { name: "Dependency Scan", status: "pending", duration: "" },
        { name: "SAST Analysis", status: "pending", duration: "" },
        { name: "Container Scan", status: "pending", duration: "" },
      ],
    },
    {
      name: "Deploy",
      status: "pending",
      duration: "",
      steps: [
        { name: "Build Docker Image", status: "pending", duration: "" },
        { name: "Push to Registry", status: "pending", duration: "" },
        { name: "Deploy to Staging", status: "pending", duration: "" },
      ],
    },
  ],
  history: [
    {
      id: "build-455",
      status: "success",
      branch: "main",
      commit: "x9y8z7w",
      author: "Jane Smith",
      duration: "8m 12s",
      timestamp: "2 hours ago",
    },
    {
      id: "build-454",
      status: "failed",
      branch: "feature/payment",
      commit: "m5n4o3p",
      author: "Mike Johnson",
      duration: "3m 45s",
      timestamp: "4 hours ago",
    },
    {
      id: "build-453",
      status: "success",
      branch: "main",
      commit: "q2r1s0t",
      author: "John Doe",
      duration: "7m 58s",
      timestamp: "6 hours ago",
    },
  ],
  environments: [
    {
      name: "Development",
      status: "healthy",
      version: "v1.2.3-dev",
      lastDeploy: "30 minutes ago",
      url: "https://dev.myapp.com",
      health: 98,
    },
    {
      name: "Staging",
      status: "healthy",
      version: "v1.2.2",
      lastDeploy: "2 hours ago",
      url: "https://staging.myapp.com",
      health: 95,
    },
    {
      name: "Production",
      status: "healthy",
      version: "v1.2.1",
      lastDeploy: "1 day ago",
      url: "https://myapp.com",
      health: 99,
    },
  ],
  metrics: {
    deploymentFrequency: "12/week",
    leadTime: "2.3 days",
    mttr: "45 minutes",
    changeFailureRate: "8%",
  },
}

const infrastructureResources = [
  {
    type: "Compute",
    name: "Web Servers",
    count: 3,
    status: "healthy",
    utilization: 65,
    cost: "$245/month",
  },
  {
    type: "Database",
    name: "PostgreSQL",
    count: 1,
    status: "healthy",
    utilization: 42,
    cost: "$89/month",
  },
  {
    type: "Storage",
    name: "Object Storage",
    count: 1,
    status: "healthy",
    utilization: 78,
    cost: "$34/month",
  },
  {
    type: "Network",
    name: "Load Balancer",
    count: 1,
    status: "healthy",
    utilization: 23,
    cost: "$18/month",
  },
]

export function CICDPipeline() {
  const { t } = useI18n()
  const [selectedBuild, setSelectedBuild] = React.useState(pipelineData.current)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
      case "completed":
      case "healthy":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "failed":
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "running":
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "pending":
      case "waiting":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
      case "completed":
      case "healthy":
        return <CheckCircle className="h-4 w-4" />
      case "failed":
      case "error":
        return <XCircle className="h-4 w-4" />
      case "running":
      case "in-progress":
        return <Play className="h-4 w-4" />
      case "pending":
      case "waiting":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('cicd_pipeline')}</h1>
          <p className="text-muted-foreground">{t('automated_build_test_and_deployment_pipeline')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            {t('configure')}
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
            <Play className="mr-2 h-4 w-4" />
            {t('run_pipeline')}
          </Button>
        </div>
      </div>

      {/* Current Build Status */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Current Build: {pipelineData.current.id}
            </CardTitle>
            <Badge className={getStatusColor(pipelineData.current.status)}>
              {getStatusIcon(pipelineData.current.status)}
              <span className="ml-1 capitalize">{pipelineData.current.status}</span>
            </Badge>
          </div>
          <CardDescription>
            Branch: {pipelineData.current.branch} • Commit: {pipelineData.current.commit} • Author:{" "}
            {pipelineData.current.author}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Overall Progress</span>
              <span className="text-sm">{pipelineData.current.progress}%</span>
            </div>
            <Progress value={pipelineData.current.progress} className="h-2" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Current Stage: {pipelineData.current.currentStage}</span>
              <span>Duration: {pipelineData.current.duration}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="environments">Environments</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4">
            {pipelineData.stages.map((stage, index) => (
              <Card key={stage.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                        {index + 1}
                      </div>
                      {stage.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(stage.status)}>
                        {getStatusIcon(stage.status)}
                        <span className="ml-1 capitalize">{stage.status}</span>
                      </Badge>
                      {stage.duration && <span className="text-sm text-muted-foreground">{stage.duration}</span>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stage.steps.map((step) => (
                      <div key={step.name} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(step.status)}>
                            {getStatusIcon(step.status)}
                          </Badge>
                          <span className="text-sm">{step.name}</span>
                        </div>
                        {step.duration && <span className="text-xs text-muted-foreground">{step.duration}</span>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="environments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {pipelineData.environments.map((env) => (
              <Card key={env.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{env.name}</CardTitle>
                    <Badge className={getStatusColor(env.status)}>
                      {getStatusIcon(env.status)}
                      <span className="ml-1 capitalize">{env.status}</span>
                    </Badge>
                  </div>
                  <CardDescription>Version: {env.version}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Health Score</span>
                      <span>{env.health}%</span>
                    </div>
                    <Progress value={env.health} />
                  </div>
                  <div className="text-sm text-muted-foreground">Last deploy: {env.lastDeploy}</div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Monitor className="mr-2 h-3 w-3" />
                    View Environment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {infrastructureResources.map((resource) => (
              <Card key={resource.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {resource.type === "Compute" && <Server className="h-5 w-5" />}
                      {resource.type === "Database" && <Database className="h-5 w-5" />}
                      {resource.type === "Storage" && <Cloud className="h-5 w-5" />}
                      {resource.type === "Network" && <Zap className="h-5 w-5" />}
                      {resource.name}
                    </CardTitle>
                    <Badge className={getStatusColor(resource.status)}>{resource.status}</Badge>
                  </div>
                  <CardDescription>
                    {resource.count} instance{resource.count > 1 ? "s" : ""} • {resource.cost}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Utilization</span>
                      <span>{resource.utilization}%</span>
                    </div>
                    <Progress value={resource.utilization} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Deployment Frequency</CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pipelineData.metrics.deploymentFrequency}</div>
                <p className="text-xs text-muted-foreground">Average per week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lead Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pipelineData.metrics.leadTime}</div>
                <p className="text-xs text-muted-foreground">Commit to production</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">MTTR</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pipelineData.metrics.mttr}</div>
                <p className="text-xs text-muted-foreground">Mean time to recovery</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Change Failure Rate</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pipelineData.metrics.changeFailureRate}</div>
                <p className="text-xs text-muted-foreground">Failed deployments</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-3">
            {pipelineData.history.map((build) => (
              <Card key={build.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(build.status)}>
                        {getStatusIcon(build.status)}
                        <span className="ml-1 capitalize">{build.status}</span>
                      </Badge>
                      <div>
                        <div className="font-medium">{build.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {build.branch} • {build.commit} • {build.author}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{build.duration}</div>
                      <div>{build.timestamp}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
