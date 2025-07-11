"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  Activity,
  Code,
} from "lucide-react"
import { useI18n } from '../app/i18n'

const analyticsData = {
  overview: {
    productivity: {
      current: 87,
      previous: 82,
      trend: "up",
    },
    codeQuality: {
      current: 92,
      previous: 89,
      trend: "up",
    },
    deploymentSuccess: {
      current: 94,
      previous: 91,
      trend: "up",
    },
    teamVelocity: {
      current: 23,
      previous: 19,
      trend: "up",
    },
  },
  productivity: {
    linesOfCode: [
      { date: "Mon", value: 1250 },
      { date: "Tue", value: 1890 },
      { date: "Wed", value: 1420 },
      { date: "Thu", value: 2100 },
      { date: "Fri", value: 1680 },
      { date: "Sat", value: 890 },
      { date: "Sun", value: 450 },
    ],
    commits: [
      { date: "Mon", value: 12 },
      { date: "Tue", value: 18 },
      { date: "Wed", value: 15 },
      { date: "Thu", value: 22 },
      { date: "Fri", value: 19 },
      { date: "Sat", value: 8 },
      { date: "Sun", value: 4 },
    ],
    pullRequests: [
      { date: "Mon", value: 3 },
      { date: "Tue", value: 5 },
      { date: "Wed", value: 4 },
      { date: "Thu", value: 7 },
      { date: "Fri", value: 6 },
      { date: "Sat", value: 2 },
      { date: "Sun", value: 1 },
    ],
  },
  codeQuality: {
    complexity: 4.2,
    testCoverage: 78,
    duplicateCode: 3.5,
    maintainabilityIndex: 85,
    technicalDebt: 12,
  },
  performance: {
    buildTime: [
      { date: "Week 1", value: 8.5 },
      { date: "Week 2", value: 7.8 },
      { date: "Week 3", value: 6.9 },
      { date: "Week 4", value: 6.2 },
    ],
    deploymentTime: [
      { date: "Week 1", value: 12.3 },
      { date: "Week 2", value: 10.8 },
      { date: "Week 3", value: 9.5 },
      { date: "Week 4", value: 8.7 },
    ],
  },
  team: [
    {
      name: "John Doe",
      productivity: 92,
      codeQuality: 88,
      commits: 45,
      linesOfCode: 2340,
      pullRequests: 12,
      bugsFixed: 8,
    },
    {
      name: "Jane Smith",
      productivity: 89,
      codeQuality: 94,
      commits: 38,
      linesOfCode: 1980,
      pullRequests: 10,
      bugsFixed: 6,
    },
    {
      name: "Mike Johnson",
      productivity: 85,
      codeQuality: 91,
      commits: 42,
      linesOfCode: 2150,
      pullRequests: 11,
      bugsFixed: 9,
    },
    {
      name: "Sarah Wilson",
      productivity: 91,
      codeQuality: 89,
      commits: 35,
      linesOfCode: 1750,
      pullRequests: 8,
      bugsFixed: 5,
    },
  ],
  insights: [
    {
      type: "positive",
      title: "Code Quality Improved",
      description: "Test coverage increased by 12% this month",
      impact: "High",
      recommendation: "Continue current testing practices",
    },
    {
      type: "warning",
      title: "Build Time Increasing",
      description: "Average build time has increased by 15% over the last week",
      impact: "Medium",
      recommendation: "Consider optimizing build pipeline and dependencies",
    },
    {
      type: "negative",
      title: "Technical Debt Growing",
      description: "Technical debt has increased by 8% this sprint",
      impact: "High",
      recommendation: "Allocate time for refactoring in next sprint",
    },
  ],
}

export function AnalyticsDashboard() {
  const { t } = useI18n()
  const [timeRange, setTimeRange] = React.useState("7d")
  const [selectedMetric, setSelectedMetric] = React.useState("productivity")

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "warning":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "negative":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "negative":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('analytics.title')}</h1>
          <p className="text-muted-foreground">{t('analytics.description')}</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{t('analytics.last_7_days')}</SelectItem>
              <SelectItem value="30d">{t('analytics.last_30_days')}</SelectItem>
              <SelectItem value="90d">{t('analytics.last_90_days')}</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t('analytics.export_report')}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.team_productivity')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{analyticsData.overview.productivity.current}%</div>
              {getTrendIcon(analyticsData.overview.productivity.trend)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{analyticsData.overview.productivity.current - analyticsData.overview.productivity.previous}% {t('analytics.from_last_period')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.code_quality')}</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{analyticsData.overview.codeQuality.current}%</div>
              {getTrendIcon(analyticsData.overview.codeQuality.trend)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{analyticsData.overview.codeQuality.current - analyticsData.overview.codeQuality.previous}% {t('analytics.from_last_period')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.deployment_success')}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{analyticsData.overview.deploymentSuccess.current}%</div>
              {getTrendIcon(analyticsData.overview.deploymentSuccess.trend)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{analyticsData.overview.deploymentSuccess.current - analyticsData.overview.deploymentSuccess.previous}% {t('analytics.from_last_period')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.team_velocity')}</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{analyticsData.overview.teamVelocity.current}</div>
              {getTrendIcon(analyticsData.overview.teamVelocity.trend)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{analyticsData.overview.teamVelocity.current - analyticsData.overview.teamVelocity.previous} {t('analytics.story_points')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="productivity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="productivity">{t('analytics.productivity')}</TabsTrigger>
          <TabsTrigger value="quality">{t('analytics.code_quality')}</TabsTrigger>
          <TabsTrigger value="performance">{t('analytics.performance')}</TabsTrigger>
          <TabsTrigger value="team">{t('analytics.team_analytics')}</TabsTrigger>
          <TabsTrigger value="insights">{t('analytics.ai_insights')}</TabsTrigger>
        </TabsList>

        <TabsContent value="productivity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.lines_of_code')}</CardTitle>
                <CardDescription>{t('analytics.daily_code_output')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.productivity.linesOfCode.map((day) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <span className="text-sm">{day.date}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className="bg-teal-500 h-2 rounded-full"
                            style={{ width: `${(day.value / 2100) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{day.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.commits')}</CardTitle>
                <CardDescription>{t('analytics.daily_commit_activity')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.productivity.commits.map((day) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <span className="text-sm">{day.date}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${(day.value / 22) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{day.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.pull_requests')}</CardTitle>
                <CardDescription>{t('analytics.daily_pr_activity')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.productivity.pullRequests.map((day) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <span className="text-sm">{day.date}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(day.value / 7) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{day.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.code_complexity')}</CardTitle>
                <CardDescription>{t('analytics.cyclomatic_complexity_average')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.codeQuality.complexity}</div>
                <Progress value={(analyticsData.codeQuality.complexity / 10) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">{t('analytics.target_less_than_5')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.test_coverage')}</CardTitle>
                <CardDescription>{t('analytics.code_coverage_percentage')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.codeQuality.testCoverage}%</div>
                <Progress value={analyticsData.codeQuality.testCoverage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">{t('analytics.target_greater_than_80')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.duplicate_code')}</CardTitle>
                <CardDescription>{t('analytics.code_duplication_percentage')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.codeQuality.duplicateCode}%</div>
                <Progress value={analyticsData.codeQuality.duplicateCode} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">{t('analytics.target_less_than_5_percent')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.maintainability')}</CardTitle>
                <CardDescription>{t('analytics.maintainability_index')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.codeQuality.maintainabilityIndex}</div>
                <Progress value={analyticsData.codeQuality.maintainabilityIndex} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">{t('analytics.target_greater_than_80')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.technical_debt')}</CardTitle>
                <CardDescription>{t('analytics.hours_of_technical_debt')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.codeQuality.technicalDebt}h</div>
                <Progress value={(analyticsData.codeQuality.technicalDebt / 50) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">{t('analytics.target_less_than_20h')}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.build_time_trend')}</CardTitle>
                <CardDescription>{t('analytics.average_build_time_over_weeks')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.performance.buildTime.map((week) => (
                    <div key={week.date} className="flex items-center justify-between">
                      <span className="text-sm">{week.date}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(week.value / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-16 text-right">{week.value}min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.deployment_time_trend')}</CardTitle>
                <CardDescription>{t('analytics.average_deployment_time_over_weeks')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.performance.deploymentTime.map((week) => (
                    <div key={week.date} className="flex items-center justify-between">
                      <span className="text-sm">{week.date}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(week.value / 15) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-16 text-right">{week.value}min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4">
            {analyticsData.team.map((member) => (
              <Card key={member.name}>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{t('analytics.individual_performance_metrics')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{member.productivity}%</div>
                      <div className="text-xs text-muted-foreground">{t('analytics.productivity')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{member.codeQuality}%</div>
                      <div className="text-xs text-muted-foreground">{t('analytics.code_quality')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{member.commits}</div>
                      <div className="text-xs text-muted-foreground">{t('analytics.commits')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{member.linesOfCode.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{t('analytics.lines_of_code')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{member.pullRequests}</div>
                      <div className="text-xs text-muted-foreground">{t('analytics.pull_requests')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{member.bugsFixed}</div>
                      <div className="text-xs text-muted-foreground">{t('analytics.bugs_fixed')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-4">
            {analyticsData.insights.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Badge className={getInsightColor(insight.type)}>{getInsightIcon(insight.type)}</Badge>
                      {insight.title}
                    </CardTitle>
                    <Badge variant="outline">{insight.impact} {t('analytics.impact')}</Badge>
                  </div>
                  <CardDescription>{insight.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium mb-1">{t('analytics.ai_recommendation')}:</h4>
                    <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
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
