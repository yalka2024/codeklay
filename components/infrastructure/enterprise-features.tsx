"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Users,
  Building,
  Key,
  Globe,
  Database,
  FileText,
  Settings,
  Activity,
  Zap,
  Cloud,
  Server,
  Network,
  BarChart3,
} from "lucide-react"
import { useI18n } from '../../app/i18n'

const enterpriseFeatures = {
  sso: {
    name: "Single Sign-On (SSO)",
    providers: [
      { name: "Active Directory", status: "configured", users: 2500, sync: "Real-time" },
      { name: "Okta", status: "configured", users: 1200, sync: "Real-time" },
      { name: "Azure AD", status: "configured", users: 800, sync: "Real-time" },
      { name: "Google Workspace", status: "available", users: 0, sync: "N/A" },
      { name: "SAML 2.0", status: "available", users: 0, sync: "N/A" },
    ],
    features: [
      "Automatic user provisioning",
      "Group-based access control",
      "Multi-factor authentication",
      "Session management",
      "Audit logging",
    ],
  },
  rbac: {
    name: "Role-Based Access Control",
    roles: [
      { name: "Super Admin", users: 5, permissions: 100, scope: "Global" },
      { name: "Organization Admin", users: 25, permissions: 80, scope: "Organization" },
      { name: "Project Manager", users: 150, permissions: 60, scope: "Projects" },
      { name: "Developer", users: 2000, permissions: 40, scope: "Development" },
      { name: "Viewer", users: 500, permissions: 20, scope: "Read-only" },
    ],
    permissions: [
      "User management",
      "Project creation",
      "Code repository access",
      "Deployment permissions",
      "Security settings",
      "Billing management",
      "Audit log access",
      "API key management",
    ],
  },
  multiTenancy: {
    name: "Multi-Tenancy",
    tenants: [
      { name: "Enterprise Corp", users: 1500, projects: 250, storage: "50TB", tier: "Enterprise" },
      { name: "Startup Inc", users: 50, projects: 15, storage: "2TB", tier: "Professional" },
      { name: "Agency LLC", users: 200, projects: 80, storage: "10TB", tier: "Business" },
      { name: "Freelancer", users: 5, projects: 3, storage: "500GB", tier: "Individual" },
    ],
    isolation: ["Data isolation", "Network isolation", "Compute isolation", "Storage isolation", "Backup isolation"],
  },
  compliance: {
    name: "Compliance & Governance",
    frameworks: [
      { name: "SOC 2 Type II", status: "certified", lastAudit: "2024-01-15", nextAudit: "2024-07-15" },
      { name: "GDPR", status: "compliant", lastAudit: "2024-01-10", nextAudit: "2024-04-10" },
      { name: "HIPAA", status: "compliant", lastAudit: "2024-01-05", nextAudit: "2024-04-05" },
      { name: "ISO 27001", status: "in-progress", lastAudit: "N/A", nextAudit: "2024-06-01" },
      { name: "FedRAMP", status: "planned", lastAudit: "N/A", nextAudit: "2024-12-01" },
    ],
    controls: [
      "Data retention policies",
      "Access control matrices",
      "Encryption standards",
      "Audit trail requirements",
      "Incident response procedures",
    ],
  },
}

const scalingMetrics = {
  current: {
    users: 100000,
    organizations: 5000,
    projects: 250000,
    requests: 10000000,
    storage: 500,
    compute: 1000,
  },
  capacity: {
    users: 1000000,
    organizations: 50000,
    projects: 5000000,
    requests: 100000000,
    storage: 10000,
    compute: 10000,
  },
}

export function EnterpriseFeatures() {
  const { t } = useI18n()
  const [selectedFeature, setSelectedFeature] = React.useState("sso")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "configured":
      case "certified":
      case "compliant":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "available":
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "planned":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Enterprise":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "Professional":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "Business":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Individual":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('enterprise_features')}</h1>
          <p className="text-muted-foreground">Enterprise-grade security, compliance, and scalability</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            Health Check
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* Platform Scale Metrics */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('users')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(scalingMetrics.current.users / 1000).toFixed(0)}K</div>
            <Progress value={(scalingMetrics.current.users / scalingMetrics.capacity.users) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground">
              of {(scalingMetrics.capacity.users / 1000).toFixed(0)}K capacity
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('organizations')}</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(scalingMetrics.current.organizations / 1000).toFixed(0)}K</div>
            <Progress
              value={(scalingMetrics.current.organizations / scalingMetrics.capacity.organizations) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground">
              of {(scalingMetrics.capacity.organizations / 1000).toFixed(0)}K capacity
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('projects')}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(scalingMetrics.current.projects / 1000).toFixed(0)}K</div>
            <Progress
              value={(scalingMetrics.current.projects / scalingMetrics.capacity.projects) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground">
              of {(scalingMetrics.capacity.projects / 1000000).toFixed(0)}M capacity
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('daily_requests')}</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(scalingMetrics.current.requests / 1000000).toFixed(0)}M</div>
            <Progress
              value={(scalingMetrics.current.requests / scalingMetrics.capacity.requests) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground">
              of {(scalingMetrics.capacity.requests / 1000000).toFixed(0)}M capacity
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('storage')}</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scalingMetrics.current.storage}TB</div>
            <Progress
              value={(scalingMetrics.current.storage / scalingMetrics.capacity.storage) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground">of {scalingMetrics.capacity.storage}TB capacity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('compute')}</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scalingMetrics.current.compute}</div>
            <Progress
              value={(scalingMetrics.current.compute / scalingMetrics.capacity.compute) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground">of {scalingMetrics.capacity.compute} vCPUs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sso" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sso">{t('configured_sso')}</TabsTrigger>
          <TabsTrigger value="rbac">{t('access_control')}</TabsTrigger>
          <TabsTrigger value="tenancy">Multi-Tenancy</TabsTrigger>
          <TabsTrigger value="compliance">{t('compliance')}</TabsTrigger>
          <TabsTrigger value="scaling">{t('enterprise_scale')}</TabsTrigger>
        </TabsList>

        <TabsContent value="sso" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Identity Providers
                </CardTitle>
                <CardDescription>{t('configured_sso')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {enterpriseFeatures.sso.providers.map((provider) => (
                  <div key={provider.name} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{provider.name}</span>
                      <Badge className={getStatusColor(provider.status)}>{provider.status}</Badge>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
                      <div>Users: {provider.users.toLocaleString()}</div>
                      <div>Sync: {provider.sync}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('sso_features')}</CardTitle>
                <CardDescription>{t('enterprise_identity')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {enterpriseFeatures.sso.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 p-2 border rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                <div className="mt-4 space-y-2">
                  <Button className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure SSO
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Sync Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rbac" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Role Hierarchy
                </CardTitle>
                <CardDescription>{t('user_roles_permissions')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {enterpriseFeatures.rbac.roles.map((role) => (
                  <div key={role.name} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{role.name}</span>
                      <Badge variant="outline">{role.users} users</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('permissions')}</span>
                        <span>{role.permissions}%</span>
                      </div>
                      <Progress value={role.permissions} />
                      <div className="text-sm text-muted-foreground">Scope: {role.scope}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('permission_matrix')}</CardTitle>
                <CardDescription>{t('granular_access')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {enterpriseFeatures.rbac.permissions.map((permission) => (
                  <div key={permission} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{permission}</span>
                    <div className="flex gap-1">
                      {["Super Admin", "Org Admin", "PM", "Dev", "Viewer"].map((role, index) => (
                        <div
                          key={role}
                          className={`w-3 h-3 rounded-full ${
                            index < 3 ? "bg-green-500" : index === 3 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          title={role}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tenancy" className="space-y-4">
          <div className="space-y-4">
            {enterpriseFeatures.multiTenancy.tenants.map((tenant) => (
              <Card key={tenant.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {tenant.name}
                    </CardTitle>
                    <Badge className={getTierColor(tenant.tier)}>{tenant.tier}</Badge>
                  </div>
                  <CardDescription>Multi-tenant organization with isolated resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{tenant.users.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{tenant.projects}</div>
                      <div className="text-sm text-muted-foreground">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{tenant.storage}</div>
                      <div className="text-sm text-muted-foreground">Storage</div>
                    </div>
                    <div className="text-center">
                      <Button size="sm" variant="outline" className="w-full">
                        <Settings className="mr-1 h-3 w-3" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle>{t('tenant_isolation')}</CardTitle>
                <CardDescription>{t('tenant_isolation_desc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {enterpriseFeatures.multiTenancy.isolation.map((isolation) => (
                    <div key={isolation} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{isolation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('regulatory_compliance')}
                </CardTitle>
                <CardDescription>{t('regulatory_compliance')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {enterpriseFeatures.compliance.frameworks.map((framework) => (
                  <div key={framework.name} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{framework.name}</span>
                      <Badge className={getStatusColor(framework.status)}>{framework.status}</Badge>
                    </div>
                    <div className="grid gap-1 text-sm text-muted-foreground">
                      <div>Last audit: {framework.lastAudit}</div>
                      <div>Next audit: {framework.nextAudit}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('governance_controls')}</CardTitle>
                <CardDescription>{t('governance_controls_desc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {enterpriseFeatures.compliance.controls.map((control) => (
                  <div key={control} className="flex items-center gap-3 p-2 border rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{control}</span>
                  </div>
                ))}
                <div className="mt-4 space-y-2">
                  <Button className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Compliance Report
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Policies
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scaling" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Auto-Scaling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { metric: "CPU Utilization", threshold: "70%", action: "Scale out" },
                  { metric: "Memory Usage", threshold: "80%", action: "Scale out" },
                  { metric: "Request Queue", threshold: "100", action: "Scale out" },
                  { metric: "Response Time", threshold: "500ms", action: "Scale out" },
                ].map((scaling) => (
                  <div key={scaling.metric} className="p-2 border rounded">
                    <div className="flex items-center justify-between text-sm">
                      <span>{scaling.metric}</span>
                      <Badge variant="outline">{scaling.threshold}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{scaling.action}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Global Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { region: "US East", load: 40, latency: "50ms" },
                  { region: "US West", load: 25, latency: "45ms" },
                  { region: "Europe", load: 20, latency: "80ms" },
                  { region: "Asia Pacific", load: 15, latency: "120ms" },
                ].map((region) => (
                  <div key={region.region} className="p-2 border rounded">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{region.region}</span>
                      <span>{region.latency}</span>
                    </div>
                    <Progress value={region.load} />
                    <div className="text-xs text-muted-foreground mt-1">{region.load}% load</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance SLAs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { sla: "Availability", target: "99.99%", current: "99.995%" },
                  { sla: "Response Time", target: "<200ms", current: "150ms" },
                  { sla: "Throughput", target: "50K RPS", current: "45K RPS" },
                  { sla: "Error Rate", target: "<0.1%", current: "0.05%" },
                ].map((sla) => (
                  <div key={sla.sla} className="p-2 border rounded">
                    <div className="flex items-center justify-between text-sm">
                      <span>{sla.sla}</span>
                      <Badge className="bg-green-500/10 text-green-500">{t('met')}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
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
