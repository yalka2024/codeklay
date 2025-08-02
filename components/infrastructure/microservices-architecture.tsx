"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Network,
  Database,
  Zap,
  Shield,
  Users,
  Code,
  GitBranch,
  MessageSquare,
  BarChart3,
  Settings,
  Lock,
  Cloud,
  Server,
  Activity,
} from "lucide-react"
import { useI18n } from '../../app/i18n'

const microservices = {
  core: [
    {
      name: "User Management Service",
      description: "Authentication, authorization, user profiles",
      technology: "Node.js + TypeScript + PostgreSQL",
      api: "REST + GraphQL",
      database: "PostgreSQL (users, profiles, permissions)",
      dependencies: ["Auth Service", "Notification Service"],
      endpoints: 15,
      rps: 5000,
      status: "healthy",
    },
    {
      name: "Project Management Service",
      description: "Projects, tasks, milestones, team management",
      technology: "Node.js + TypeScript + PostgreSQL",
      api: "GraphQL + WebSocket",
      database: "PostgreSQL (projects, tasks, teams)",
      dependencies: ["User Service", "Collaboration Service"],
      endpoints: 25,
      rps: 3000,
      status: "healthy",
    },
    {
      name: "Code Analysis Service",
      description: "Static analysis, code quality, security scanning",
      technology: "Go + gRPC + Redis",
      api: "gRPC + REST",
      database: "PostgreSQL + Redis (analysis results)",
      dependencies: ["AI Service", "Security Service"],
      endpoints: 12,
      rps: 2000,
      status: "healthy",
    },
  ],
  ai: [
    {
      name: "AI Orchestration Service",
      description: "AI model management, request routing, load balancing",
      technology: "Python + FastAPI + Redis",
      api: "REST + gRPC",
      database: "Redis (model cache, sessions)",
      dependencies: ["Model Services", "Vector DB"],
      endpoints: 8,
      rps: 10000,
      status: "healthy",
    },
    {
      name: "Code Generation Service",
      description: "AI-powered code completion, generation, refactoring",
      technology: "Python + PyTorch + CUDA",
      api: "gRPC",
      database: "Vector DB (embeddings)",
      dependencies: ["AI Orchestration", "Code Analysis"],
      endpoints: 6,
      rps: 8000,
      status: "healthy",
    },
    {
      name: "Natural Language Service",
      description: "Chat, documentation generation, code explanation",
      technology: "Python + Transformers + GPU",
      api: "gRPC + WebSocket",
      database: "Vector DB + PostgreSQL",
      dependencies: ["AI Orchestration", "Knowledge Base"],
      endpoints: 10,
      rps: 4000,
      status: "healthy",
    },
  ],
  platform: [
    {
      name: "API Gateway",
      description: "Request routing, rate limiting, authentication",
      technology: "Kong + Lua + Redis",
      api: "HTTP/HTTPS Proxy",
      database: "Redis (rate limits, cache)",
      dependencies: ["All services"],
      endpoints: 1,
      rps: 50000,
      status: "healthy",
    },
    {
      name: "Notification Service",
      description: "Email, SMS, push notifications, webhooks",
      technology: "Node.js + Bull Queue + Redis",
      api: "REST + Message Queue",
      database: "PostgreSQL + Redis (queue)",
      dependencies: ["User Service"],
      endpoints: 8,
      rps: 1000,
      status: "healthy",
    },
    {
      name: "File Storage Service",
      description: "File upload, processing, CDN integration",
      technology: "Go + S3 + CloudFront",
      api: "REST + gRPC",
      database: "PostgreSQL (metadata) + S3",
      dependencies: ["User Service"],
      endpoints: 12,
      rps: 2500,
      status: "healthy",
    },
  ],
  devops: [
    {
      name: "CI/CD Engine",
      description: "Build pipelines, deployments, testing automation",
      technology: "Go + Tekton + Kubernetes",
      api: "REST + WebSocket",
      database: "PostgreSQL + etcd",
      dependencies: ["Git Service", "Container Registry"],
      endpoints: 20,
      rps: 500,
      status: "healthy",
    },
    {
      name: "Infrastructure Service",
      description: "Resource provisioning, scaling, monitoring",
      technology: "Go + Terraform + Kubernetes API",
      api: "REST + gRPC",
      database: "PostgreSQL + etcd",
      dependencies: ["Monitoring Service"],
      endpoints: 15,
      rps: 200,
      status: "healthy",
    },
    {
      name: "Monitoring Service",
      description: "Metrics collection, alerting, observability",
      technology: "Go + Prometheus + InfluxDB",
      api: "REST + gRPC",
      database: "InfluxDB + PostgreSQL",
      dependencies: ["All services"],
      endpoints: 25,
      rps: 15000,
      status: "healthy",
    },
  ],
}

const serviceMap = {
  "API Gateway": { x: 50, y: 10, connections: ["User Management", "Project Management", "AI Orchestration"] },
  "User Management": { x: 20, y: 30, connections: ["Project Management", "Notification"] },
  "Project Management": { x: 50, y: 30, connections: ["Code Analysis", "Collaboration"] },
  "AI Orchestration": { x: 80, y: 30, connections: ["Code Generation", "Natural Language"] },
  "Code Analysis": { x: 35, y: 50, connections: ["Security Service"] },
  "Code Generation": { x: 65, y: 50, connections: ["Vector DB"] },
  "Natural Language": { x: 80, y: 50, connections: ["Knowledge Base"] },
}

export function MicroservicesArchitecture() {
  const { t } = useI18n()
  const [selectedCategory, setSelectedCategory] = React.useState("core")
  const [selectedService, setSelectedService] = React.useState(microservices.core[0])

  const getServiceIcon = (name: string) => {
    if (name.includes("User")) return <Users className="h-4 w-4" />
    if (name.includes("Project")) return <GitBranch className="h-4 w-4" />
    if (name.includes("Code")) return <Code className="h-4 w-4" />
    if (name.includes("AI")) return <Zap className="h-4 w-4" />
    if (name.includes("Gateway")) return <Network className="h-4 w-4" />
    if (name.includes("Security")) return <Shield className="h-4 w-4" />
    if (name.includes("Notification")) return <MessageSquare className="h-4 w-4" />
    if (name.includes("Monitoring")) return <BarChart3 className="h-4 w-4" />
    if (name.includes("Storage")) return <Database className="h-4 w-4" />
    return <Server className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "warning":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('microservices_architecture')}</h1>
          <p className="text-muted-foreground">{t('microservices_architecture_description')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            Service Health
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
            <Settings className="mr-2 h-4 w-4" />
            Configure Services
          </Button>
        </div>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">{t('services')}</TabsTrigger>
          <TabsTrigger value="architecture">{t('service_map')}</TabsTrigger>
          <TabsTrigger value="communication">{t('communication')}</TabsTrigger>
          <TabsTrigger value="data">{t('data_flow')}</TabsTrigger>
          <TabsTrigger value="deployment">{t('deployment')}</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Service Categories */}
            <div className="space-y-2">
              {Object.entries(microservices).map(([key, services]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedCategory(key)
                    setSelectedService(services[0])
                  }}
                >
                  <Server className="mr-2 h-4 w-4" />
                  {key.charAt(0).toUpperCase() + key.slice(1)} ({services.length})
                </Button>
              ))}
            </div>

            {/* Service List */}
            <div className="space-y-2">
              {microservices[selectedCategory as keyof typeof microservices].map((service) => (
                <Card
                  key={service.name}
                  className={`cursor-pointer transition-colors ${
                    selectedService.name === service.name
                      ? "border-teal-500 bg-teal-500/10"
                      : "hover:border-teal-500/50"
                  }`}
                  onClick={() => setSelectedService(service)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getServiceIcon(service.name)}
                        <span className="font-medium text-sm">{service.name}</span>
                      </div>
                      <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {service.endpoints} endpoints • {service.rps} RPS
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Service Details */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getServiceIcon(selectedService.name)}
                      {selectedService.name}
                    </CardTitle>
                    <Badge className={getStatusColor(selectedService.status)}>{selectedService.status}</Badge>
                  </div>
                  <CardDescription>{selectedService.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">{t('technology_stack')}</h4>
                      <p className="text-sm text-muted-foreground">{selectedService.technology}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{t('api_interface')}</h4>
                      <p className="text-sm text-muted-foreground">{selectedService.api}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">{t('database')}</h4>
                    <p className="text-sm text-muted-foreground">{selectedService.database}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">{t('dependencies')}</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedService.dependencies.map((dep) => (
                        <Badge key={dep} variant="outline" className="text-xs">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">{t('performance')}</h4>
                      <div className="text-sm text-muted-foreground">
                        <div>Endpoints: {selectedService.endpoints}</div>
                        <div>Requests/sec: {selectedService.rps.toLocaleString()}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{t('actions')}</h4>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Activity className="mr-1 h-3 w-3" />
                          Metrics
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="mr-1 h-3 w-3" />
                          Config
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('service_communication_map')}</CardTitle>
              <CardDescription>
                Visual representation of service dependencies and communication patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-96 bg-muted/20 rounded-lg p-4">
                {/* Service nodes */}
                {Object.entries(serviceMap).map(([service, position]) => (
                  <div
                    key={service}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${position.x}%`, top: `${position.y}%` }}
                  >
                    <div className="bg-background border-2 border-teal-500 rounded-lg p-2 shadow-lg">
                      <div className="flex items-center gap-1">
                        {getServiceIcon(service)}
                        <span className="text-xs font-medium">{service}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Connection lines would be drawn here with SVG */}
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full">
                    {/* Example connection lines */}
                    <line
                      x1="50%"
                      y1="10%"
                      x2="20%"
                      y2="30%"
                      stroke="rgb(20 184 166)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    <line
                      x1="50%"
                      y1="10%"
                      x2="50%"
                      y2="30%"
                      stroke="rgb(20 184 166)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    <line
                      x1="50%"
                      y1="10%"
                      x2="80%"
                      y2="30%"
                      stroke="rgb(20 184 166)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-4 grid gap-2 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-teal-500"></div>
                  <span className="text-sm">Synchronous (REST/gRPC)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-purple-500" style={{ borderStyle: "dashed" }}></div>
                  <span className="text-sm">Asynchronous (Message Queue)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-blue-500"></div>
                  <span className="text-sm">WebSocket (Real-time)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('communication_patterns')}</CardTitle>
                <CardDescription>{t('how_services_communicate')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { pattern: "REST API", usage: "60%", description: "Standard HTTP APIs for CRUD operations" },
                  { pattern: "gRPC", usage: "25%", description: "High-performance RPC for internal services" },
                  { pattern: "GraphQL", usage: "10%", description: "Flexible queries for frontend clients" },
                  { pattern: "WebSocket", usage: "5%", description: "Real-time bidirectional communication" },
                ].map((comm) => (
                  <div key={comm.pattern} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{comm.pattern}</span>
                      <Badge variant="outline">{comm.usage}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{comm.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('message_queues')}</CardTitle>
                <CardDescription>{t('async_communication')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { queue: "User Events", messages: 1500, consumers: 3, lag: "0ms" },
                  { queue: "Code Analysis", messages: 800, consumers: 5, lag: "50ms" },
                  { queue: "Notifications", messages: 2000, consumers: 2, lag: "100ms" },
                  { queue: "AI Processing", messages: 600, consumers: 8, lag: "200ms" },
                ].map((queue) => (
                  <div key={queue.queue} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{queue.queue}</span>
                      <Badge variant="outline">{queue.messages} msgs</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {queue.consumers} consumers • {queue.lag} lag
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Primary Databases
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { db: "Users DB", type: "PostgreSQL", size: "500GB", connections: 50 },
                  { db: "Projects DB", type: "PostgreSQL", size: "2TB", connections: 80 },
                  { db: "Analytics DB", type: "ClickHouse", size: "5TB", connections: 20 },
                  { db: "Cache", type: "Redis", size: "100GB", connections: 200 },
                ].map((db) => (
                  <div key={db.db} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{db.db}</span>
                      <Badge variant="outline">{db.type}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {db.size} • {db.connections} connections
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Data Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { storage: "User Files", type: "S3", size: "50TB", access: "Frequent" },
                  { storage: "Code Repos", type: "Git LFS", size: "20TB", access: "Frequent" },
                  { storage: "Artifacts", type: "S3 IA", size: "100TB", access: "Infrequent" },
                  { storage: "Backups", type: "Glacier", size: "200TB", access: "Archive" },
                ].map((storage) => (
                  <div key={storage.storage} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{storage.storage}</span>
                      <Badge variant="outline">{storage.type}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {storage.size} • {storage.access}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { feature: "Encryption at Rest", status: "AES-256", coverage: "All data" },
                  { feature: "Encryption in Transit", status: "TLS 1.3", coverage: "All traffic" },
                  { feature: "Data Masking", status: "Active", coverage: "PII fields" },
                  { feature: "Access Logging", status: "Active", coverage: "All access" },
                ].map((security) => (
                  <div key={security.feature} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{security.feature}</span>
                      <Badge className="bg-green-500/10 text-green-500">{security.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{security.coverage}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('container_orchestration')}</CardTitle>
                <CardDescription>{t('kubernetes_deployment')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { resource: "Namespaces", count: 8, description: "Environment isolation" },
                  { resource: "Deployments", count: 25, description: "Service deployments" },
                  { resource: "Services", count: 30, description: "Service discovery" },
                  { resource: "Ingresses", count: 12, description: "External access" },
                ].map((k8s) => (
                  <div key={k8s.resource} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{k8s.resource}</span>
                      <Badge variant="outline">{k8s.count}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{k8s.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('service_mesh')}</CardTitle>
                <CardDescription>{t('istio_service_mesh')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { feature: "Traffic Management", status: "Active", description: "Load balancing, routing" },
                  { feature: "Security Policies", status: "Active", description: "mTLS, authorization" },
                  { feature: "Observability", status: "Active", description: "Metrics, tracing" },
                  { feature: "Circuit Breaker", status: "Active", description: "Fault tolerance" },
                ].map((mesh) => (
                  <div key={mesh.feature} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{mesh.feature}</span>
                      <Badge className="bg-green-500/10 text-green-500">{mesh.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{mesh.description}</p>
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
