"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Cloud,
  Database,
  Server,
  Shield,
  Zap,
  Globe,
  Lock,
  Monitor,
  Users,
  Settings,
  Activity,
  Layers,
  Network,
} from "lucide-react"
import { useI18n } from '../../app/i18n'

const infrastructureComponents = {
  frontend: {
    name: "Frontend Layer",
    components: [
      {
        service: "Web Application",
        technology: "Next.js 14 + React 18",
        deployment: "Vercel Edge Network",
        scaling: "Auto-scaling CDN",
        status: "production",
      },
      {
        service: "Desktop App",
        technology: "Electron + Tauri",
        deployment: "Auto-updater",
        scaling: "Client-side",
        status: "development",
      },
      {
        service: "Mobile App",
        technology: "React Native + Expo",
        deployment: "App Stores",
        scaling: "Client-side",
        status: "planned",
      },
    ],
  },
  api: {
    name: "API Gateway & Services",
    components: [
      {
        service: "API Gateway",
        technology: "Kong + GraphQL Federation",
        deployment: "Kubernetes",
        scaling: "Horizontal Pod Autoscaler",
        status: "production",
      },
      {
        service: "Authentication Service",
        technology: "Auth0 + Custom JWT",
        deployment: "Multi-region",
        scaling: "Auto-scaling",
        status: "production",
      },
      {
        service: "AI Service",
        technology: "Python + FastAPI + GPU",
        deployment: "NVIDIA Triton",
        scaling: "GPU Auto-scaling",
        status: "production",
      },
    ],
  },
  microservices: {
    name: "Core Microservices",
    components: [
      {
        service: "Project Management",
        technology: "Node.js + TypeScript",
        deployment: "Docker + K8s",
        scaling: "HPA + VPA",
        status: "production",
      },
      {
        service: "Code Analysis",
        technology: "Go + gRPC",
        deployment: "Docker + K8s",
        scaling: "Queue-based",
        status: "production",
      },
      {
        service: "Collaboration",
        technology: "Node.js + Socket.io",
        deployment: "Docker + K8s",
        scaling: "WebSocket clustering",
        status: "production",
      },
      {
        service: "CI/CD Engine",
        technology: "Go + Tekton",
        deployment: "Kubernetes",
        scaling: "Job-based",
        status: "production",
      },
    ],
  },
  data: {
    name: "Data Layer",
    components: [
      {
        service: "Primary Database",
        technology: "PostgreSQL 15 + Citus",
        deployment: "Multi-master cluster",
        scaling: "Horizontal sharding",
        status: "production",
      },
      {
        service: "Cache Layer",
        technology: "Redis Cluster",
        deployment: "Multi-AZ",
        scaling: "Auto-scaling",
        status: "production",
      },
      {
        service: "Search Engine",
        technology: "Elasticsearch",
        deployment: "Multi-node cluster",
        scaling: "Auto-scaling",
        status: "production",
      },
      {
        service: "Object Storage",
        technology: "S3 + CloudFront",
        deployment: "Multi-region",
        scaling: "Unlimited",
        status: "production",
      },
    ],
  },
  ai: {
    name: "AI Infrastructure",
    components: [
      {
        service: "Model Serving",
        technology: "NVIDIA Triton + TensorRT",
        deployment: "GPU Clusters",
        scaling: "Auto-scaling GPUs",
        status: "production",
      },
      {
        service: "Training Pipeline",
        technology: "Kubeflow + MLflow",
        deployment: "Kubernetes",
        scaling: "Distributed training",
        status: "production",
      },
      {
        service: "Vector Database",
        technology: "Pinecone + Weaviate",
        deployment: "Managed service",
        scaling: "Auto-scaling",
        status: "production",
      },
    ],
  },
  security: {
    name: "Security & Compliance",
    components: [
      {
        service: "WAF & DDoS Protection",
        technology: "Cloudflare + AWS Shield",
        deployment: "Edge locations",
        scaling: "Global",
        status: "production",
      },
      {
        service: "Secrets Management",
        technology: "HashiCorp Vault",
        deployment: "Multi-region HA",
        scaling: "Auto-scaling",
        status: "production",
      },
      {
        service: "Compliance Engine",
        technology: "Custom + OpenPolicy",
        deployment: "Kubernetes",
        scaling: "Auto-scaling",
        status: "production",
      },
    ],
  },
}

const deploymentMetrics = {
  availability: 99.99,
  responseTime: 150,
  throughput: 50000,
  regions: 12,
  users: 100000,
  requests: 10000000,
}

export function DeploymentArchitecture() {
  const { t } = useI18n()
  const [selectedLayer, setSelectedLayer] = React.useState("frontend")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "production":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "development":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "planned":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('deployment_architecture')}</h1>
          <p className="text-muted-foreground">{t('deployment_architecture_description')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Monitor className="mr-2 h-4 w-4" />
            System Status
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
            <Cloud className="mr-2 h-4 w-4" />
            Deploy Platform
          </Button>
        </div>
      </div>

      {/* Platform Metrics */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('availability')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deploymentMetrics.availability}%</div>
            <p className="text-xs text-muted-foreground">SLA: 99.9%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('response_time')}</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deploymentMetrics.responseTime}ms</div>
            <p className="text-xs text-muted-foreground">P95 latency</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('throughput')}</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(deploymentMetrics.throughput / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Requests/sec</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('global_regions')}</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deploymentMetrics.regions}</div>
            <p className="text-xs text-muted-foreground">Multi-region</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('active_users')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(deploymentMetrics.users / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">{t('concurrent')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('daily_requests')}</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(deploymentMetrics.requests / 1000000).toFixed(0)}M</div>
            <p className="text-xs text-muted-foreground">{t('per_day')}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="architecture" className="space-y-4">
        <TabsList>
          <TabsTrigger value="architecture">{t('architecture')}</TabsTrigger>
          <TabsTrigger value="infrastructure">{t('infrastructure')}</TabsTrigger>
          <TabsTrigger value="scaling">Auto-Scaling</TabsTrigger>
          <TabsTrigger value="security">{t('security')}</TabsTrigger>
          <TabsTrigger value="monitoring">{t('monitoring')}</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Layer Selection */}
            <div className="space-y-2">
              {Object.entries(infrastructureComponents).map(([key, layer]) => (
                <Button
                  key={key}
                  variant={selectedLayer === key ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedLayer(key)}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  {layer.name}
                </Button>
              ))}
            </div>

            {/* Layer Details */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {infrastructureComponents[selectedLayer as keyof typeof infrastructureComponents].name}
                  </CardTitle>
                  <CardDescription>{t('components_services')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {infrastructureComponents[selectedLayer as keyof typeof infrastructureComponents].components.map(
                      (component, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{component.service}</h4>
                            <Badge className={getStatusColor(component.status)}>{component.status}</Badge>
                          </div>
                          <div className="grid gap-2 md:grid-cols-3 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Technology:</span> {component.technology}
                            </div>
                            <div>
                              <span className="font-medium">Deployment:</span> {component.deployment}
                            </div>
                            <div>
                              <span className="font-medium">Scaling:</span> {component.scaling}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Cloud Providers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { provider: "AWS", usage: "Primary (70%)", services: "EKS, RDS, S3, Lambda" },
                  { provider: "Google Cloud", usage: "AI/ML (20%)", services: "Vertex AI, BigQuery" },
                  { provider: "Azure", usage: "Enterprise (10%)", services: "AD, DevOps" },
                ].map((cloud) => (
                  <div key={cloud.provider} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{cloud.provider}</span>
                      <Badge variant="outline">{cloud.usage}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{cloud.services}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Compute Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { type: "Web Servers", count: "50+ pods", spec: "2 vCPU, 4GB RAM" },
                  { type: "API Servers", count: "30+ pods", spec: "4 vCPU, 8GB RAM" },
                  { type: "AI Workers", count: "10+ GPUs", spec: "NVIDIA A100" },
                  { type: "Background Jobs", count: "20+ pods", spec: "1 vCPU, 2GB RAM" },
                ].map((resource) => (
                  <div key={resource.type} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{resource.type}</span>
                      <Badge variant="outline">{resource.count}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{resource.spec}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { type: "PostgreSQL", size: "10TB+", usage: "Primary data" },
                  { type: "Redis", size: "500GB", usage: "Cache & sessions" },
                  { type: "Elasticsearch", size: "2TB", usage: "Search & logs" },
                  { type: "S3", size: "100TB+", usage: "Files & artifacts" },
                ].map((storage) => (
                  <div key={storage.type} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{storage.type}</span>
                      <Badge variant="outline">{storage.size}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{storage.usage}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scaling" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('horizontal_pod_autoscaler')}</CardTitle>
                <CardDescription>{t('automatic_scaling')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { service: "Web Frontend", current: 15, min: 5, max: 100, metric: "CPU: 65%" },
                  { service: "API Gateway", current: 8, min: 3, max: 50, metric: "Memory: 70%" },
                  { service: "AI Service", current: 12, min: 2, max: 30, metric: "GPU: 80%" },
                  { service: "Background Jobs", current: 6, min: 1, max: 20, metric: "Queue: 45%" },
                ].map((hpa) => (
                  <div key={hpa.service} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{hpa.service}</span>
                      <Badge variant="outline">{hpa.current} pods</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Range: {hpa.min}-{hpa.max} pods • {hpa.metric}
                    </div>
                    <Progress value={65} className="mt-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('load_balancing')}</CardTitle>
                <CardDescription>{t('traffic_distribution')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { region: "US East", traffic: 40, latency: "120ms", status: "healthy" },
                  { region: "US West", traffic: 25, latency: "95ms", status: "healthy" },
                  { region: "Europe", traffic: 20, latency: "180ms", status: "healthy" },
                  { region: "Asia Pacific", traffic: 15, latency: "220ms", status: "degraded" },
                ].map((region) => (
                  <div key={region.region} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{region.region}</span>
                      <Badge
                        className={
                          region.status === "healthy"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }
                      >
                        {region.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Traffic: {region.traffic}% • Latency: {region.latency}
                    </div>
                    <Progress value={region.traffic} className="mt-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Network Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { feature: "WAF Protection", status: "active", coverage: "100%" },
                  { feature: "DDoS Mitigation", status: "active", coverage: "Global" },
                  { feature: "VPC Isolation", status: "active", coverage: "All services" },
                  { feature: "Network Policies", status: "active", coverage: "Kubernetes" },
                ].map((security) => (
                  <div key={security.feature} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{security.feature}</span>
                    <Badge className="bg-green-500/10 text-green-500">{security.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { feature: "Encryption at Rest", status: "AES-256", coverage: "All data" },
                  { feature: "Encryption in Transit", status: "TLS 1.3", coverage: "All traffic" },
                  { feature: "Key Management", status: "HSM", coverage: "Vault" },
                  { feature: "Backup Encryption", status: "active", coverage: "All backups" },
                ].map((protection) => (
                  <div key={protection.feature} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{protection.feature}</span>
                    <Badge variant="outline">{protection.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { standard: "SOC 2 Type II", status: "certified", audit: "Annual" },
                  { standard: "GDPR", status: "compliant", audit: "Quarterly" },
                  { standard: "HIPAA", status: "compliant", audit: "Bi-annual" },
                  { standard: "ISO 27001", status: "in-progress", audit: "Pending" },
                ].map((compliance) => (
                  <div key={compliance.standard} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{compliance.standard}</span>
                    <Badge
                      className={
                        compliance.status === "certified" || compliance.status === "compliant"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }
                    >
                      {compliance.status}
                    </Badge>
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
                <CardTitle>{t('observability_stack')}</CardTitle>
                <CardDescription>Monitoring, logging, and tracing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { tool: "Prometheus + Grafana", purpose: "Metrics & Dashboards", status: "active" },
                  { tool: "ELK Stack", purpose: "Centralized Logging", status: "active" },
                  { tool: "Jaeger", purpose: "Distributed Tracing", status: "active" },
                  { tool: "PagerDuty", purpose: "Incident Management", status: "active" },
                ].map((tool) => (
                  <div key={tool.tool} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{tool.tool}</span>
                      <Badge className="bg-green-500/10 text-green-500">{tool.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{tool.purpose}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('sla_monitoring')}</CardTitle>
                <CardDescription>{t('service_level_objectives')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { metric: "API Availability", target: "99.9%", current: "99.95%", status: "healthy" },
                  { metric: "Response Time", target: "<200ms", current: "150ms", status: "healthy" },
                  { metric: "Error Rate", target: "<0.1%", current: "0.05%", status: "healthy" },
                  { metric: "Data Durability", target: "99.999%", current: "99.999%", status: "healthy" },
                ].map((sla) => (
                  <div key={sla.metric} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{sla.metric}</span>
                      <Badge className="bg-green-500/10 text-green-500">{sla.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Target: {sla.target} • Current: {sla.current}
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
