"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, Lock, Key, AlertTriangle, CheckCircle, XCircle, Eye, FileText, Users, Scan } from "lucide-react"
import { useI18n } from '../app/i18n'

const securityData = {
  overview: {
    securityScore: 87,
    vulnerabilities: {
      critical: 2,
      high: 5,
      medium: 12,
      low: 8,
    },
    compliance: 94,
    lastScan: "2 hours ago",
  },
  vulnerabilities: [
    {
      id: "CVE-2024-0001",
      title: "SQL Injection in User Authentication",
      severity: "critical",
      component: "auth-service",
      description: "Potential SQL injection vulnerability in login endpoint",
      impact: "Data breach, unauthorized access",
      remediation: "Update to parameterized queries, input validation",
      status: "open",
      discoveredAt: "2024-01-20T10:30:00Z",
    },
    {
      id: "CVE-2024-0002",
      title: "Cross-Site Scripting (XSS)",
      severity: "high",
      component: "web-frontend",
      description: "Reflected XSS in search functionality",
      impact: "Session hijacking, data theft",
      remediation: "Implement proper input sanitization",
      status: "in-progress",
      discoveredAt: "2024-01-19T14:20:00Z",
    },
    {
      id: "DEP-001",
      title: "Outdated Dependencies",
      severity: "medium",
      component: "package.json",
      description: "Multiple dependencies with known vulnerabilities",
      impact: "Various security risks",
      remediation: "Update dependencies to latest versions",
      status: "open",
      discoveredAt: "2024-01-18T09:15:00Z",
    },
  ],
  compliance: {
    frameworks: [
      {
        name: "SOC 2 Type II",
        status: "compliant",
        score: 96,
        lastAudit: "2024-01-15",
        nextAudit: "2024-07-15",
        requirements: 45,
        passed: 43,
      },
      {
        name: "GDPR",
        status: "compliant",
        score: 92,
        lastAudit: "2024-01-10",
        nextAudit: "2024-04-10",
        requirements: 32,
        passed: 29,
      },
      {
        name: "HIPAA",
        status: "non-compliant",
        score: 78,
        lastAudit: "2024-01-05",
        nextAudit: "2024-02-05",
        requirements: 28,
        passed: 22,
      },
    ],
  },
  accessControl: {
    users: 24,
    roles: 6,
    permissions: 45,
    lastReview: "1 week ago",
    privilegedUsers: 4,
    inactiveUsers: 2,
  },
  auditLog: [
    {
      id: 1,
      timestamp: "2024-01-20T15:30:00Z",
      user: "john.doe@company.com",
      action: "Login",
      resource: "CodePal Dashboard",
      ip: "192.168.1.100",
      status: "success",
    },
    {
      id: 2,
      timestamp: "2024-01-20T15:25:00Z",
      user: "jane.smith@company.com",
      action: "Deploy",
      resource: "Production Environment",
      ip: "192.168.1.101",
      status: "success",
    },
    {
      id: 3,
      timestamp: "2024-01-20T15:20:00Z",
      user: "admin@company.com",
      action: "Permission Change",
      resource: "User: mike.johnson@company.com",
      ip: "192.168.1.102",
      status: "success",
    },
    {
      id: 4,
      timestamp: "2024-01-20T15:15:00Z",
      user: "unknown",
      action: "Failed Login",
      resource: "CodePal Dashboard",
      ip: "203.0.113.1",
      status: "failed",
    },
  ],
  secrets: [
    {
      name: "DATABASE_URL",
      type: "Database Connection",
      lastRotated: "2 weeks ago",
      nextRotation: "2 weeks",
      status: "active",
      usage: 156,
    },
    {
      name: "JWT_SECRET",
      type: "Authentication Key",
      lastRotated: "1 month ago",
      nextRotation: "1 week",
      status: "expiring",
      usage: 2340,
    },
    {
      name: "API_KEY_STRIPE",
      type: "Third-party API",
      lastRotated: "3 days ago",
      nextRotation: "3 months",
      status: "active",
      usage: 89,
    },
  ],
}

export function SecurityCenter() {
  const { t } = useI18n()
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600/10 text-red-600 border-red-600/20"
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
      case "active":
      case "success":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "non-compliant":
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "in-progress":
      case "expiring":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
      case "active":
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "non-compliant":
      case "failed":
        return <XCircle className="h-4 w-4" />
      case "in-progress":
      case "expiring":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('security_center')}</h1>
          <p className="text-muted-foreground">{t('comprehensive_security_monitoring_and_compliance_management')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Scan className="mr-2 h-4 w-4" />
            {t('run_security_scan')}
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
            <Shield className="mr-2 h-4 w-4" />
            {t('security_report')}
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('security_score')}</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityData.overview.securityScore}/100</div>
            <Progress value={securityData.overview.securityScore} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('critical_issues')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{securityData.overview.vulnerabilities.critical}</div>
            <p className="text-xs text-muted-foreground">{t('require_immediate_attention')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('compliance')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityData.overview.compliance}%</div>
            <Progress value={securityData.overview.compliance} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('last_scan')}</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityData.overview.lastScan}</div>
            <p className="text-xs text-muted-foreground">{t('automated_security_scan')}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vulnerabilities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vulnerabilities">{t('vulnerabilities')}</TabsTrigger>
          <TabsTrigger value="compliance">{t('compliance')}</TabsTrigger>
          <TabsTrigger value="access">{t('access_control')}</TabsTrigger>
          <TabsTrigger value="secrets">{t('secrets_management')}</TabsTrigger>
          <TabsTrigger value="audit">{t('audit_logs')}</TabsTrigger>
        </TabsList>

        <TabsContent value="vulnerabilities" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t('critical')}</p>
                    <p className="text-2xl font-bold text-red-600">{securityData.overview.vulnerabilities.critical}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t('high')}</p>
                    <p className="text-2xl font-bold text-red-500">{securityData.overview.vulnerabilities.high}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t('medium')}</p>
                    <p className="text-2xl font-bold text-yellow-500">{securityData.overview.vulnerabilities.medium}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t('low')}</p>
                    <p className="text-2xl font-bold text-blue-500">{securityData.overview.vulnerabilities.low}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {securityData.vulnerabilities.map((vuln) => (
              <Card key={vuln.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Badge className={getSeverityColor(vuln.severity)}>{vuln.severity.toUpperCase()}</Badge>
                        {vuln.title}
                      </CardTitle>
                      <CardDescription>
                        {vuln.component} • {vuln.id} • Discovered {new Date(vuln.discoveredAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(vuln.status)}>
                      {getStatusIcon(vuln.status)}
                      <span className="ml-1 capitalize">{vuln.status.replace("-", " ")}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-1">{t('description')}</h4>
                    <p className="text-sm text-muted-foreground">{vuln.description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{t('impact')}</h4>
                    <p className="text-sm text-muted-foreground">{vuln.impact}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{t('remediation')}</h4>
                    <p className="text-sm text-muted-foreground">{vuln.remediation}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">{t('fix_now')}</Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Assign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="space-y-4">
            {securityData.compliance.frameworks.map((framework) => (
              <Card key={framework.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{framework.name}</CardTitle>
                    <Badge className={getStatusColor(framework.status)}>
                      {getStatusIcon(framework.status)}
                      <span className="ml-1 capitalize">{framework.status.replace("-", " ")}</span>
                    </Badge>
                  </div>
                  <CardDescription>
                    Last audit: {framework.lastAudit} • Next audit: {framework.nextAudit}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('compliance_score')}</span>
                      <span>{framework.score}%</span>
                    </div>
                    <Progress value={framework.score} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('requirements_met')}</span>
                    <span>
                      {framework.passed}/{framework.requirements}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">{t('view_report')}</Button>
                    <Button size="sm" variant="outline">
                      Schedule Audit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('total_users')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityData.accessControl.users}</div>
                <p className="text-xs text-muted-foreground">{t('active_user_accounts')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('privileged_users')}</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityData.accessControl.privilegedUsers}</div>
                <p className="text-xs text-muted-foreground">{t('admin_elevated_access')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('inactive_users')}</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{securityData.accessControl.inactiveUsers}</div>
                <p className="text-xs text-muted-foreground">{t('require_review')}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('role_distribution')}</CardTitle>
                <CardDescription>{t('user_roles_permissions')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { role: "Admin", count: 2, permissions: 45 },
                  { role: "Developer", count: 18, permissions: 32 },
                  { role: "Viewer", count: 4, permissions: 8 },
                ].map((role) => (
                  <div key={role.role} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{role.role}</div>
                      <div className="text-sm text-muted-foreground">{role.permissions} permissions</div>
                    </div>
                    <Badge variant="outline">{role.count} users</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('access_review')}</CardTitle>
                <CardDescription>{t('regular_access_reviews')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{t('last_review')}</div>
                      <div className="text-sm text-muted-foreground">{securityData.accessControl.lastReview}</div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{t('next_review')}</div>
                      <div className="text-sm text-muted-foreground">In 3 weeks</div>
                    </div>
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
                <Button className="w-full">{t('start_access_review')}</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="secrets" className="space-y-4">
          <div className="space-y-4">
            {securityData.secrets.map((secret) => (
              <Card key={secret.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      {secret.name}
                    </CardTitle>
                    <Badge className={getStatusColor(secret.status)}>
                      {getStatusIcon(secret.status)}
                      <span className="ml-1 capitalize">{secret.status}</span>
                    </Badge>
                  </div>
                  <CardDescription>{secret.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <div className="text-sm font-medium">{t('last_rotated')}</div>
                      <div className="text-sm text-muted-foreground">{secret.lastRotated}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t('next_rotation')}</div>
                      <div className="text-sm text-muted-foreground">{secret.nextRotation}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t('usage_count')}</div>
                      <div className="text-sm text-muted-foreground">{secret.usage} times</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">{t('rotate_now')}</Button>
                    <Button size="sm" variant="outline">
                      View Usage
                    </Button>
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('audit_log')}</CardTitle>
              <CardDescription>{t('security_events')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {securityData.auditLog.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(log.status)}>{getStatusIcon(log.status)}</Badge>
                        <div>
                          <div className="font-medium text-sm">{log.action}</div>
                          <div className="text-xs text-muted-foreground">
                            {log.user} • {log.resource} • {log.ip}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
