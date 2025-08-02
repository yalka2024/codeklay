"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, AlertTriangle, Rocket, Code, Database, Shield, Cloud } from "lucide-react"
import { useI18n } from '../app/i18n'

const productionReadiness = {
  frontend: {
    name: "Frontend & UI",
    completion: 95,
    status: "ready",
    items: [
      { task: "React Components", status: "complete", priority: "high" },
      { task: "Responsive Design", status: "complete", priority: "high" },
      { task: "State Management", status: "complete", priority: "high" },
      { task: "Error Boundaries", status: "pending", priority: "medium" },
      { task: "Performance Optimization", status: "pending", priority: "medium" },
      { task: "Accessibility (WCAG)", status: "pending", priority: "medium" },
    ],
  },
  backend: {
    name: "Backend Services",
    completion: 15,
    status: "in-progress",
    items: [
      { task: "API Gateway Setup", status: "pending", priority: "critical" },
      { task: "Authentication Service", status: "pending", priority: "critical" },
      { task: "User Management API", status: "pending", priority: "critical" },
      { task: "Project Management API", status: "pending", priority: "critical" },
      { task: "AI Service Integration", status: "pending", priority: "critical" },
      { task: "File Storage Service", status: "pending", priority: "high" },
      { task: "Notification Service", status: "pending", priority: "high" },
      { task: "Analytics Service", status: "pending", priority: "medium" },
    ],
  },
  database: {
    name: "Database & Storage",
    completion: 10,
    status: "not-started",
    items: [
      { task: "Database Schema Design", status: "pending", priority: "critical" },
      { task: "Migration Scripts", status: "pending", priority: "critical" },
      { task: "Data Seeding", status: "pending", priority: "high" },
      { task: "Backup Strategy", status: "pending", priority: "critical" },
      { task: "Replication Setup", status: "pending", priority: "high" },
      { task: "Performance Tuning", status: "pending", priority: "medium" },
    ],
  },
  infrastructure: {
    name: "Infrastructure & DevOps",
    completion: 20,
    status: "planning",
    items: [
      { task: "Kubernetes Cluster Setup", status: "pending", priority: "critical" },
      { task: "CI/CD Pipeline Implementation", status: "pending", priority: "critical" },
      { task: "Infrastructure as Code", status: "pending", priority: "critical" },
      { task: "Monitoring & Logging", status: "pending", priority: "critical" },
      { task: "Security Hardening", status: "pending", priority: "critical" },
      { task: "Load Balancer Configuration", status: "pending", priority: "high" },
      { task: "SSL/TLS Certificates", status: "pending", priority: "high" },
      { task: "DNS Configuration", status: "pending", priority: "medium" },
    ],
  },
  security: {
    name: "Security & Compliance",
    completion: 5,
    status: "not-started",
    items: [
      { task: "Authentication Implementation", status: "pending", priority: "critical" },
      { task: "Authorization (RBAC)", status: "pending", priority: "critical" },
      { task: "Data Encryption", status: "pending", priority: "critical" },
      { task: "Security Scanning", status: "pending", priority: "critical" },
      { task: "Vulnerability Management", status: "pending", priority: "high" },
      { task: "Compliance Auditing", status: "pending", priority: "high" },
      { task: "Incident Response Plan", status: "pending", priority: "medium" },
    ],
  },
  testing: {
    name: "Testing & Quality",
    completion: 0,
    status: "not-started",
    items: [
      { task: "Unit Test Suite", status: "pending", priority: "critical" },
      { task: "Integration Tests", status: "pending", priority: "critical" },
      { task: "End-to-End Tests", status: "pending", priority: "high" },
      { task: "Performance Tests", status: "pending", priority: "high" },
      { task: "Security Tests", status: "pending", priority: "high" },
      { task: "Load Testing", status: "pending", priority: "medium" },
    ],
  },
}

const deploymentTimeline = [
  {
    phase: "Phase 1: Core Backend",
    duration: "8-12 weeks",
    description: "Build essential APIs and services",
    tasks: ["Authentication", "User Management", "Project APIs", "Database Setup"],
    blockers: ["Team size", "AI model integration complexity"],
  },
  {
    phase: "Phase 2: AI Integration",
    duration: "6-8 weeks",
    description: "Integrate AI services and models",
    tasks: ["AI Service", "Model Deployment", "Vector Database", "GPU Infrastructure"],
    blockers: ["Model licensing", "GPU availability", "Performance optimization"],
  },
  {
    phase: "Phase 3: Infrastructure",
    duration: "4-6 weeks",
    description: "Production infrastructure setup",
    tasks: ["Kubernetes", "CI/CD", "Monitoring", "Security Hardening"],
    blockers: ["Cloud provider setup", "Compliance requirements"],
  },
  {
    phase: "Phase 4: Testing & Launch",
    duration: "4-6 weeks",
    description: "Comprehensive testing and deployment",
    tasks: ["Testing Suite", "Performance Tuning", "Security Audit", "Go-Live"],
    blockers: ["Security certification", "Load testing results"],
  },
]

export function ProductionReadinessChecklist() {
  const { t } = useI18n()
  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
      case "ready":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "in-progress":
      case "planning":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "pending":
      case "not-started":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "pending":
      case "not-started":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const overallCompletion = Math.round(
    Object.values(productionReadiness).reduce((acc, category) => acc + category.completion, 0) /
      Object.values(productionReadiness).length,
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('production_readiness.title')}</h1>
          <p className="text-muted-foreground">{t('production_readiness.description')}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{overallCompletion}%</div>
          <div className="text-sm text-muted-foreground">{t('production_readiness.overall_complete')}</div>
        </div>
      </div>

      {/* Overall Progress */}
      <Card className="border-orange-500/20 bg-orange-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {t('production_readiness.status')}
          </CardTitle>
          <CardDescription>
            {t('production_readiness.not_ready_message')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('production_readiness.overall_progress')}</span>
              <span>{overallCompletion}%</span>
            </div>
            <Progress value={overallCompletion} className="h-3" />
            <div className="text-sm text-muted-foreground">
              {t('production_readiness.estimated_time', { time: '22-32 weeks' })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(productionReadiness).map(([key, category]) => (
          <Card key={key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {key === "frontend" && <Code className="h-4 w-4" />}
                  {key === "backend" && <Cloud className="h-4 w-4" />}
                  {key === "database" && <Database className="h-4 w-4" />}
                  {key === "infrastructure" && <Cloud className="h-4 w-4" />}
                  {key === "security" && <Shield className="h-4 w-4" />}
                  {key === "testing" && <CheckCircle className="h-4 w-4" />}
                  {category.name}
                </CardTitle>
                <Badge className={getStatusColor(category.status)}>{category.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('production_readiness.progress')}</span>
                  <span>{category.completion}%</span>
                </div>
                <Progress value={category.completion} />
              </div>
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(item.status)} variant="outline">
                        {getStatusIcon(item.status)}
                      </Badge>
                      <span>{item.task}</span>
                    </div>
                    <Badge className={getPriorityColor(item.priority)} variant="outline">
                      {item.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Deployment Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            {t('production_readiness.deployment_timeline')}
          </CardTitle>
          <CardDescription>{t('production_readiness.timeline_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {deploymentTimeline.map((phase, index) => (
              <div key={index} className="relative">
                {index < deploymentTimeline.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-16 bg-border"></div>
                )}
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500 text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{phase.phase}</h3>
                      <Badge variant="outline">{phase.duration}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium mb-1">{t('production_readiness.key_tasks')}:</h4>
                        <div className="flex flex-wrap gap-1">
                          {phase.tasks.map((task) => (
                            <Badge key={task} variant="outline" className="text-xs">
                              {task}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">{t('production_readiness.potential_blockers')}:</h4>
                        <div className="flex flex-wrap gap-1">
                          {phase.blockers.map((blocker) => (
                            <Badge key={blocker} variant="outline" className="text-xs bg-red-500/10 text-red-500">
                              {blocker}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-teal-500/20 bg-teal-500/5">
        <CardHeader>
          <CardTitle>{t('production_readiness.immediate_next_steps')}</CardTitle>
          <CardDescription>{t('production_readiness.next_steps_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">{t('production_readiness.technical_priorities')}:</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  {t('production_readiness.build_auth_apis')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  {t('production_readiness.design_database_schemas')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  {t('production_readiness.setup_cicd_pipeline')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  {t('production_readiness.integrate_ai_services')}
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">{t('production_readiness.business_priorities')}:</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  {t('production_readiness.assemble_development_team')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  {t('production_readiness.secure_cloud_budget')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  {t('production_readiness.obtain_ai_licenses')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  {t('production_readiness.plan_compliance_audits')}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
