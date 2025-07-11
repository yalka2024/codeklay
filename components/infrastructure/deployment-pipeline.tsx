"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  GitBranch,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Rocket,
  Shield,
  TestTube,
  Package,
  Cloud,
  Database,
  Settings,
  Activity,
  Zap,
} from "lucide-react"
import { useI18n } from '../../app/i18n'

const deploymentPipeline = {
  stages: [
    {
      name: "Source Control",
      description: "Code repository and version control",
      tools: ["GitHub Enterprise", "GitLab", "Bitbucket"],
      status: "active",
      duration: "5s",
      success_rate: 99.9,
    },
    {
      name: "Build & Compile",
      description: "Code compilation and artifact generation",
      tools: ["Docker", "Buildpacks", "Webpack", "TypeScript"],
      status: "active",
      duration: "3m 45s",
      success_rate: 98.5,
    },
    {
      name: "Unit Testing",
      description: "Automated unit and integration tests",
      tools: ["Jest", "Cypress", "Playwright", "Go Test"],
      status: "active",
      duration: "2m 30s",
      success_rate: 97.2,
    },
    {
      name: "Security Scanning",
      description: "SAST, DAST, and dependency vulnerability scanning",
      tools: ["Snyk", "SonarQube", "OWASP ZAP", "Trivy"],
      status: "active",
      duration: "4m 15s",
      success_rate: 95.8,
    },
    {
      name: "Quality Gates",
      description: "Code quality and coverage validation",
      tools: ["SonarQube", "CodeClimate", "ESLint", "Prettier"],
      status: "active",
      duration: "1m 20s",
      success_rate: 96.5,
    },
    {
      name: "Container Build",
      description: "Docker image creation and optimization",
      tools: ["Docker", "Kaniko", "BuildKit", "Distroless"],
      status: "active",
      duration: "2m 10s",
      success_rate: 98.9,
    },
    {
      name: "Registry Push",
      description: "Artifact storage and versioning",
      tools: ["Harbor", "ECR", "GCR", "Docker Hub"],
      status: "active",
      duration: "45s",
      success_rate: 99.5,
    },
    {
      name: "Staging Deploy",
      description: "Deployment to staging environment",
      tools: ["Kubernetes", "Helm", "ArgoCD", "Flux"],
      status: "active",
      duration: "3m 30s",
      success_rate: 97.8,
    },
    {
      name: "E2E Testing",
      description: "End-to-end and performance testing",
      tools: ["Cypress", "Playwright", "K6", "Artillery"],
      status: "active",
      duration: "8m 45s",
      success_rate: 94.2,
    },
    {
      name: "Production Deploy",
      description: "Blue-green deployment to production",
      tools: ["Kubernetes", "Istio", "Flagger", "ArgoCD"],
      status: "active",
      duration: "5m 20s",
      success_rate: 98.1,
    },
  ],
  environments: [
    {
      name: "Development",
      purpose: "Feature development and testing",
      auto_deploy: true,
      approval_required: false,
      rollback_enabled: true,
      monitoring: "Basic",
    },
    {
      name: "Staging",
      purpose: "Pre-production validation",
      auto_deploy: true,
      approval_required: false,
      rollback_enabled: true,
      monitoring: "Full",
    },
    {
      name: "Production",
      purpose: "Live customer environment",
      auto_deploy: false,
      approval_required: true,
      rollback_enabled: true,
      monitoring: "Full + Alerting",
    },
  ],
  metrics: {
    deployment_frequency: "12 per day",
    lead_time: "2.3 hours",
    mttr: "45 minutes",
    change_failure_rate: "8%",
    success_rate: 96.8,
    total_deployments: 2847,
  },
}

export function DeploymentPipeline() {
  const [selectedStage, setSelectedStage] = React.useState(deploymentPipeline.stages[0])
  const { t } = useI18n()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "success":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "running":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStageIcon = (name: string) => {
    if (name.includes("Source")) return <GitBranch className="h-4 w-4" />
    if (name.includes("Build")) return <Package className="h-4 w-4" />
    if (name.includes("Test")) return <TestTube className="h-4 w-4" />
    if (name.includes("Security")) return <Shield className="h-4 w-4" />
    if (name.includes("Quality")) return <CheckCircle className="h-4 w-4" />
    if (name.includes("Container")) return <Package className="h-4 w-4" />
    if (name.includes("Registry")) return <Database className="h-4 w-4" />
    if (name.includes("Deploy")) return <Rocket className="h-4 w-4" />
    return <Settings className="h-4 w-4" />
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('deployment_pipeline')}</h1>
          <p className="text-muted-foreground">Enterprise CI/CD pipeline for CodePal Pro platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            Pipeline Status
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
            <Play className="mr-2 h-4 w-4" />
            Trigger Deploy
          </Button>
        </div>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('deploy_frequency')}</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deploymentPipeline.metrics.deployment_frequency}</div>
            <p className="text-xs text-muted-foreground">{t('average_per_day')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('lead_time')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deploymentPipeline.metrics.lead_time}</div>
            <p className="text-xs text-muted-foreground">{t('commit_to_production')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('mttr')}</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deploymentPipeline.metrics.mttr}</div>
            <p className="text-xs text-muted-foreground">{t('mean_time_to_recovery')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('failure_rate')}</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deploymentPipeline.metrics.change_failure_rate}</div>
            <p className="text-xs text-muted-foreground">{t('change_failure_rate')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('success_rate')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deploymentPipeline.metrics.success_rate}%</div>
            <p className="text-xs text-muted-foreground">{t('overall_success_rate')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_deploys')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deploymentPipeline.metrics.total_deployments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t('all_time')}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">{t('pipeline_stages')}</TabsTrigger>
          <TabsTrigger value="environments">{t('environments')}</TabsTrigger>
          <TabsTrigger value="security">{t('security')}</TabsTrigger>
          <TabsTrigger value="monitoring">{t('monitoring')}</TabsTrigger>
          <TabsTrigger value="optimization">{t('optimization')}</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Pipeline Stages List */}
            <div className="space-y-2">
              {deploymentPipeline.stages.map((stage, index) => (
                <Card
                  key={stage.name}
                  className={`cursor-pointer transition-colors ${
                    selectedStage.name === stage.name ? "border-teal-500 bg-teal-500/10" : "hover:border-teal-500/50"
                  }`}
                  onClick={() => setSelectedStage(stage)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-medium">
                        {index + 1}
                      </div>
                      {getStageIcon(stage.name)}
                      <span className="font-medium text-sm">{stage.name}</span>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {stage.duration} • {stage.success_rate}% success
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stage Details */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getStageIcon(selectedStage.name)}
                      {selectedStage.name}
                    </CardTitle>
                    <Badge className={getStatusColor(selectedStage.status)}>{selectedStage.status}</Badge>
                  </div>
                  <CardDescription>{selectedStage.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">{t('performance_metrics')}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t('average_duration')}</span>
                          <span>{selectedStage.duration}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{t('success_rate')}</span>
                          <span>{selectedStage.success_rate}%</span>
                        </div>
                        <Progress value={selectedStage.success_rate} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Tools & Technologies</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedStage.tools.map((tool) => (
                          <Badge key={tool} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">{t('recent_executions')}</h4>
                    {[
                      { id: "exec-001", status: "success", duration: "2m 45s", timestamp: "5 min ago" },
                      { id: "exec-002", status: "success", duration: "3m 12s", timestamp: "1 hour ago" },
                      { id: "exec-003", status: "failed", duration: "1m 30s", timestamp: "2 hours ago" },
                      { id: "exec-004", status: "success", duration: "2m 58s", timestamp: "4 hours ago" },
                    ].map((execution) => (
                      <div key={execution.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(execution.status)}>
                            {execution.status === "success" ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                          </Badge>
                          <span className="text-sm font-mono">{execution.id}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {execution.duration} • {execution.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="environments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {deploymentPipeline.environments.map((env) => (
              <Card key={env.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5" />
                    {env.name}
                  </CardTitle>
                  <CardDescription>{env.purpose}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('auto_deploy')}</span>
                      <Badge
                        className={env.auto_deploy ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}
                      >
                        {env.auto_deploy ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('approval_required')}</span>
                      <Badge
                        className={
                          env.approval_required ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"
                        }
                      >
                        {env.approval_required ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('rollback')}</span>
                      <Badge
                        className={
                          env.rollback_enabled ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }
                      >
                        {env.rollback_enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('monitoring')}</span>
                      <Badge variant="outline">{env.monitoring}</Badge>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Environment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t('automated_security_checks')}
                </CardTitle>
                <CardDescription>{t('automated_security_checks')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { scan: "SAST (Static Analysis)", tool: "SonarQube", status: "passing", issues: 0 },
                  { scan: "DAST (Dynamic Analysis)", tool: "OWASP ZAP", status: "passing", issues: 2 },
                  { scan: "Dependency Scan", tool: "Snyk", status: "warning", issues: 5 },
                  { scan: "Container Scan", tool: "Trivy", status: "passing", issues: 1 },
                  { scan: "License Compliance", tool: "FOSSA", status: "passing", issues: 0 },
                ].map((scan) => (
                  <div key={scan.scan} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{scan.scan}</span>
                      <Badge className={getStatusColor(scan.status)}>{scan.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {scan.tool} • {scan.issues} issues found
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('security_policies')}</CardTitle>
                <CardDescription>{t('enforced_security_policies')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "No critical vulnerabilities allowed",
                  "All dependencies must be up-to-date",
                  "Code coverage must be > 80%",
                  "All commits must be signed",
                  "Secrets must not be in code",
                  "Container images must be scanned",
                ].map((policy) => (
                  <div key={policy} className="flex items-center gap-3 p-2 border rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{policy}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Pipeline Monitoring
                </CardTitle>
                <CardDescription>Real-time pipeline health and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { metric: "Pipeline Success Rate", value: "96.8%", trend: "up" },
                  { metric: "Average Build Time", value: "8m 45s", trend: "down" },
                  { metric: "Queue Wait Time", value: "2m 15s", trend: "stable" },
                  { metric: "Resource Utilization", value: "67%", trend: "up" },
                ].map((metric) => (
                  <div key={metric.metric} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{metric.metric}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{metric.value}</span>
                        {metric.trend === "up" && <span className="text-green-500">↗</span>}
                        {metric.trend === "down" && <span className="text-red-500">↘</span>}
                        {metric.trend === "stable" && <span className="text-gray-500">→</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alerting & Notifications</CardTitle>
                <CardDescription>{t('pipeline_alerts')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { channel: "Slack #deployments", events: "All pipeline events", status: "active" },
                  { channel: "PagerDuty", events: "Critical failures only", status: "active" },
                  { channel: "Email (DevOps)", events: "Security issues", status: "active" },
                  { channel: "Teams #releases", events: "Production deploys", status: "active" },
                ].map((alert) => (
                  <div key={alert.channel} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{alert.channel}</span>
                      <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{alert.events}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {t('pipeline_performance_improvements')}
                </CardTitle>
                <CardDescription>{t('pipeline_performance_improvements')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    optimization: "Parallel Test Execution",
                    impact: "40% faster",
                    status: "implemented",
                    description: "Run tests in parallel across multiple workers",
                  },
                  {
                    optimization: "Build Cache Optimization",
                    impact: "60% faster",
                    status: "implemented",
                    description: "Intelligent caching of build dependencies",
                  },
                  {
                    optimization: "Container Layer Caching",
                    impact: "30% faster",
                    status: "recommended",
                    description: "Cache Docker layers between builds",
                  },
                  {
                    optimization: "Incremental Builds",
                    impact: "50% faster",
                    status: "planned",
                    description: "Only build changed components",
                  },
                ].map((opt) => (
                  <div key={opt.optimization} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{opt.optimization}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{opt.impact}</Badge>
                        <Badge className={getStatusColor(opt.status)}>{opt.status}</Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{opt.description}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('resource_optimization')}</CardTitle>
                <CardDescription>{t('compute_storage_optimization')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { resource: "Build Agents", current: "20 agents", optimized: "Auto-scaling", savings: "30%" },
                  { resource: "Storage", current: "500GB", optimized: "Lifecycle policies", savings: "40%" },
                  { resource: "Network", current: "Fixed bandwidth", optimized: "Burst capacity", savings: "25%" },
                  { resource: "Compute", current: "Fixed instances", optimized: "Spot instances", savings: "60%" },
                ].map((resource) => (
                  <div key={resource.resource} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{resource.resource}</span>
                      <Badge className="bg-green-500/10 text-green-500">{resource.savings} savings</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {resource.current} → {resource.optimized}
                    </div>
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
