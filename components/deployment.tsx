'use client';

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Rocket, Settings, CheckCircle, Clock, ExternalLink, Copy, AlertCircle } from "lucide-react"
import { useI18n } from '../app/i18n'

const deploymentPlatforms = [
  {
    name: "Vercel",
    icon: "▲",
    description: "Deploy your Next.js, React, and static sites",
    connected: true,
    lastDeploy: "2 hours ago",
    status: "active",
  },
  {
    name: "Netlify",
    icon: "🌐",
    description: "Deploy static sites and serverless functions",
    connected: false,
    lastDeploy: "Never",
    status: "inactive",
  },
  {
    name: "Railway",
    icon: "🚂",
    description: "Deploy full-stack applications and databases",
    connected: true,
    lastDeploy: "1 day ago",
    status: "active",
  },
  {
    name: "Local Server",
    icon: "🖥️",
    description: "Deploy to your local development server",
    connected: true,
    lastDeploy: "5 minutes ago",
    status: "active",
  },
]

const deploymentHistory = [
  {
    id: 1,
    project: "E-commerce Platform",
    platform: "Vercel",
    status: "success",
    url: "https://ecommerce-platform-abc123.vercel.app",
    deployedAt: "2 hours ago",
    duration: "2m 34s",
  },
  {
    id: 2,
    project: "Task Management API",
    platform: "Railway",
    status: "success",
    url: "https://task-api-production.railway.app",
    deployedAt: "1 day ago",
    duration: "1m 45s",
  },
  {
    id: 3,
    project: "Portfolio Website",
    platform: "Netlify",
    status: "failed",
    url: "",
    deployedAt: "2 days ago",
    duration: "Failed after 30s",
  },
]

const envVariables = [
  { key: "DATABASE_URL", value: "postgresql://...", required: true },
  { key: "JWT_SECRET", value: "your-secret-key", required: true },
  { key: "API_KEY", value: "sk-...", required: false },
  { key: "NODE_ENV", value: "production", required: true },
]

export function Deployment() {
  const { t } = useI18n()
  const [selectedPlatform, setSelectedPlatform] = React.useState("Vercel")
  const [deploymentProgress, setDeploymentProgress] = React.useState(0)
  const [isDeploying, setIsDeploying] = React.useState(false)

  const handleDeploy = () => {
    setIsDeploying(true)
    setDeploymentProgress(0)

    const interval = setInterval(() => {
      setDeploymentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsDeploying(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "failed":
        return <AlertCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('deployment.title')}</h1>
          <p className="text-muted-foreground">{t('deployment.description')}</p>
        </div>
        <Button
          className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700"
          onClick={handleDeploy}
          disabled={isDeploying}
        >
          <Rocket className="mr-2 h-4 w-4" />
          {isDeploying ? t('deployment.deploying') : t('deployment.deploy_now')}
        </Button>
      </div>

      {/* Deployment Progress */}
      {isDeploying && (
        <Card className="border-teal-500/20 bg-teal-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              {t('deployment.deployment_in_progress')}
            </CardTitle>
            <CardDescription>{t('deployment.deploying_to', { platform: selectedPlatform })}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{t('deployment.progress')}</span>
                <span>{deploymentProgress}%</span>
              </div>
              <Progress value={deploymentProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Platform Selection */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('deployment.deployment_platforms')}</CardTitle>
              <CardDescription>{t('deployment.choose_where_to_deploy')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {deploymentPlatforms.map((platform) => (
                <div
                  key={platform.name}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPlatform === platform.name
                      ? "border-teal-500 bg-teal-500/10"
                      : "border-border hover:border-teal-500/50"
                  }`}
                  onClick={() => setSelectedPlatform(platform.name)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{platform.name}</h4>
                        <Badge variant={platform.connected ? "default" : "secondary"} className="text-xs">
                          {platform.connected ? t('deployment.connected') : t('deployment.not_connected')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{platform.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{t('deployment.last_deploy')}: {platform.lastDeploy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Deployment Configuration */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="config" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="config">{t('deployment.configuration')}</TabsTrigger>
              <TabsTrigger value="env">{t('deployment.environment')}</TabsTrigger>
              <TabsTrigger value="history">{t('deployment.history')}</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {t('deployment.deployment_configuration')}
                  </CardTitle>
                  <CardDescription>{t('deployment.configure_deployment_settings', { platform: selectedPlatform })}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">{t('deployment.project_name')}</Label>
                      <Input id="project-name" value="ecommerce-platform" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="branch">{t('deployment.branch')}</Label>
                      <Input id="branch" value="main" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="build-command">{t('deployment.build_command')}</Label>
                    <Input id="build-command" value="npm run build" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="output-directory">{t('deployment.output_directory')}</Label>
                    <Input id="output-directory" value="dist" />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{t('deployment.auto_deploy')}</h4>
                      <p className="text-sm text-muted-foreground">{t('deployment.auto_deploy_description')}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {t('deployment.enable')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="env" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('deployment.environment_variables')}</CardTitle>
                  <CardDescription>{t('deployment.configure_env_variables')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {envVariables.map((env, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1 grid gap-2 md:grid-cols-2">
                        <Input value={env.key} placeholder={t('deployment.variable_name')} />
                        <Input type="password" value={env.value} placeholder={t('deployment.variable_value')} />
                      </div>
                      <Badge variant={env.required ? "destructive" : "secondary"}>
                        {env.required ? t('deployment.required') : t('deployment.optional')}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    {t('deployment.add_variable')}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('deployment.deployment_history')}</CardTitle>
                  <CardDescription>{t('deployment.recent_deployments')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deploymentHistory.map((deployment) => (
                      <div key={deployment.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Badge className={getStatusColor(deployment.status)}>
                          {getStatusIcon(deployment.status)}
                          <span className="ml-1 capitalize">{deployment.status}</span>
                        </Badge>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{deployment.project}</h4>
                          <p className="text-xs text-muted-foreground">
                            {deployment.platform} • {deployment.deployedAt} • {deployment.duration}
                          </p>
                        </div>
                        {deployment.url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={deployment.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
