"use client"

import * as React from "react"
import { Plus, Clock, CheckCircle, AlertCircle, Play } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useI18n } from '../app/i18n'
import { AnalyticsDashboard } from './analytics-dashboard'

export function Dashboard() {
  const { t } = useI18n()
  const [quickInput, setQuickInput] = React.useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "In Progress":
        return "bg-teal-500/10 text-teal-500 border-teal-500/20"
      case "Planning":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      case "In Progress":
        return <Clock className="h-4 w-4" />
      case "Planning":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const recentProjects = [
    {
      id: 1,
      name: t('dashboard.ecommerce_platform'),
      status: t('dashboard.in_progress'),
      progress: 75,
      language: "TypeScript",
      framework: "Next.js",
      lastModified: t('dashboard.last_modified_2_hours_ago'),
    },
    {
      id: 2,
      name: t('dashboard.task_management_api'),
      status: t('dashboard.completed'),
      progress: 100,
      language: "Python",
      framework: "FastAPI",
      lastModified: t('dashboard.last_modified_1_day_ago'),
    },
    {
      id: 3,
      name: t('dashboard.portfolio_website'),
      status: t('dashboard.in_progress'),
      progress: 45,
      language: "JavaScript",
      framework: "React",
      lastModified: t('dashboard.last_modified_3_hours_ago'),
    },
    {
      id: 4,
      name: t('dashboard.data_visualization_tool'),
      status: t('dashboard.planning'),
      progress: 15,
      language: "Python",
      framework: "Streamlit",
      lastModified: t('dashboard.last_modified_5_hours_ago'),
    },
  ]

  const quickTasks = [
    t('dashboard.task_scrape_website'),
    t('dashboard.task_user_auth_component'),
    t('dashboard.task_user_management_api'),
    t('dashboard.task_generate_unit_tests'),
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.welcome_back')}</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          {t('dashboard.new_project')}
        </Button>
      </div>

      {/* Quick AI Input */}
      <Card className="border-dashed border-2 border-teal-500/20 bg-gradient-to-r from-teal-500/5 to-purple-600/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            {t('dashboard.quick_ai_assistant')}
          </CardTitle>
          <CardDescription>{t('dashboard.describe_what_you_want_to_build')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={t('dashboard.input_placeholder')}
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {quickTasks.map((task, index) => (
                <Button key={index} variant="outline" size="sm" onClick={() => setQuickInput(task)} className="text-xs">
                  {task}
                </Button>
              ))}
            </div>
            <Button disabled={!quickInput.trim()}>
              <Play className="mr-2 h-4 w-4" />
              {t('dashboard.generate')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t('dashboard.recent_projects')}</h2>
          <Button variant="outline" size="sm">
            {t('dashboard.view_all')}
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {recentProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusIcon(project.status)}
                    <span className="ml-1">{project.status}</span>
                  </Badge>
                </div>
                <CardDescription>
                  {project.language} • {project.framework}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{t('progress')}</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Last modified {project.lastModified}</span>
                  <Button variant="ghost" size="sm">
                    Open
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_projects')}</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📁</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('lines_of_code')}</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">💻</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('bugs_fixed')}</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🐛</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+7 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('deployments')}</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🚀</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />
    </div>
  )
}
