"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, TrendingUp, Target, Zap, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react"
import { useI18n } from '../../app/i18n'

const projectData = {
  overview: {
    name: "E-commerce Platform",
    description: "Modern e-commerce platform with AI-powered recommendations",
    status: "In Progress",
    progress: 68,
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    budget: 150000,
    spent: 89000,
    team: 8,
    tasks: { total: 156, completed: 89, inProgress: 23, pending: 44 },
  },
  milestones: [
    {
      id: 1,
      name: "MVP Development",
      date: "2024-02-28",
      status: "completed",
      progress: 100,
      tasks: 45,
    },
    {
      id: 2,
      name: "User Authentication",
      date: "2024-03-15",
      status: "in-progress",
      progress: 75,
      tasks: 23,
    },
    {
      id: 3,
      name: "Payment Integration",
      date: "2024-03-30",
      status: "pending",
      progress: 0,
      tasks: 18,
    },
    {
      id: 4,
      name: "AI Recommendations",
      date: "2024-04-10",
      status: "pending",
      progress: 0,
      tasks: 32,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Implement user registration API",
      description: "Create secure user registration with email verification",
      status: "completed",
      priority: "high",
      assignee: "John Doe",
      estimatedHours: 8,
      actualHours: 6,
      dueDate: "2024-02-20",
      tags: ["backend", "api", "authentication"],
    },
    {
      id: 2,
      title: "Design product catalog UI",
      description: "Create responsive product catalog with filtering",
      status: "in-progress",
      priority: "medium",
      assignee: "Jane Smith",
      estimatedHours: 12,
      actualHours: 8,
      dueDate: "2024-02-25",
      tags: ["frontend", "ui", "catalog"],
    },
    {
      id: 3,
      title: "Set up payment gateway",
      description: "Integrate Stripe payment processing",
      status: "pending",
      priority: "high",
      assignee: "Mike Johnson",
      estimatedHours: 16,
      actualHours: 0,
      dueDate: "2024-03-01",
      tags: ["backend", "payment", "integration"],
    },
  ],
  team: [
    {
      id: 1,
      name: "John Doe",
      role: "Full Stack Developer",
      avatar: "/placeholder.svg?height=32&width=32",
      tasksCompleted: 23,
      tasksInProgress: 3,
      productivity: 92,
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Frontend Developer",
      avatar: "/placeholder.svg?height=32&width=32",
      tasksCompleted: 18,
      tasksInProgress: 2,
      productivity: 88,
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Backend Developer",
      avatar: "/placeholder.svg?height=32&width=32",
      tasksCompleted: 15,
      tasksInProgress: 4,
      productivity: 85,
    },
  ],
}

const riskAnalysis = [
  {
    type: "Schedule Risk",
    level: "medium",
    description: "Payment integration may delay milestone by 1 week",
    impact: "Medium",
    probability: "High",
    mitigation: "Start payment integration in parallel with current tasks",
  },
  {
    type: "Technical Risk",
    level: "low",
    description: "AI recommendation system complexity",
    impact: "Low",
    probability: "Medium",
    mitigation: "Use pre-built ML models to reduce development time",
  },
  {
    type: "Resource Risk",
    level: "high",
    description: "Frontend developer may be unavailable next month",
    impact: "High",
    probability: "Medium",
    mitigation: "Cross-train backend developers on frontend tasks",
  },
]

export function ProjectManagement() {
  const { t } = useI18n()
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "pending":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('project_management')}</h1>
          <p className="text-muted-foreground">{t('ai_powered_project_planning_and_tracking')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t('generate_report')}
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
            <Zap className="mr-2 h-4 w-4" />
            {t('ai_insights')}
          </Button>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('progress')}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectData.overview.progress}%</div>
            <Progress value={projectData.overview.progress} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('budget_used')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(projectData.overview.spent / 1000).toFixed(0)}k</div>
            <p className="text-xs text-muted-foreground">
              of ${(projectData.overview.budget / 1000).toFixed(0)}k budget
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('team_size')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectData.overview.team}</div>
            <p className="text-xs text-muted-foreground">{t('active_developers')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('tasks')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projectData.overview.tasks.completed}/{projectData.overview.tasks.total}
            </div>
            <p className="text-xs text-muted-foreground">{t('completed_tasks')}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="milestones">{t('milestones')}</TabsTrigger>
          <TabsTrigger value="tasks">{t('tasks')}</TabsTrigger>
          <TabsTrigger value="team">{t('team')}</TabsTrigger>
          <TabsTrigger value="risks">{t('risk_analysis')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('project_timeline')}</CardTitle>
                <CardDescription>{t('key_milestones_deadlines')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectData.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{milestone.name}</h4>
                        <Badge className={getStatusColor(milestone.status)}>{milestone.status.replace("-", " ")}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Due: {milestone.date}</span>
                        <span>{milestone.tasks} tasks</span>
                      </div>
                      <Progress value={milestone.progress} className="mt-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('ai_recommendations')}</CardTitle>
                <CardDescription>{t('smart_suggestions')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-600">{t('optimize_task_allocation')}</h4>
                      <p className="text-sm text-muted-foreground">
                        Reassign 2 frontend tasks to backend developers to balance workload
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-600">{t('schedule_risk')}</h4>
                      <p className="text-sm text-muted-foreground">
                        Payment integration may cause 1-week delay. Consider parallel development
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-600">{t('on_track')}</h4>
                      <p className="text-sm text-muted-foreground">
                        MVP milestone completed ahead of schedule. Great progress!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <div className="grid gap-4">
            {projectData.milestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{milestone.name}</CardTitle>
                    <Badge className={getStatusColor(milestone.status)}>{milestone.status.replace("-", " ")}</Badge>
                  </div>
                  <CardDescription>
                    Due: {milestone.date} • {milestone.tasks} tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('progress')}</span>
                      <span>{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.progress} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="space-y-4">
            {projectData.tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <CardDescription>{task.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Assignee: {task.assignee}</span>
                      <span>Due: {task.dueDate}</span>
                      <span>Est: {task.estimatedHours}h</span>
                      {task.actualHours > 0 && <span>Actual: {task.actualHours}h</span>}
                    </div>
                    <div className="flex gap-1">
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectData.team.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription>{member.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{t('completed_tasks')}</span>
                    <span>{member.tasksCompleted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('in_progress')}</span>
                    <span>{member.tasksInProgress}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{t('productivity')}</span>
                      <span>{member.productivity}%</span>
                    </div>
                    <Progress value={member.productivity} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <div className="space-y-4">
            {riskAnalysis.map((risk, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      {risk.type}
                    </CardTitle>
                    <Badge className={getRiskColor(risk.level)}>{risk.level.toUpperCase()} RISK</Badge>
                  </div>
                  <CardDescription>{risk.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <span className="text-sm font-medium">Impact: </span>
                      <span className="text-sm text-muted-foreground">{risk.impact}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Probability: </span>
                      <span className="text-sm text-muted-foreground">{risk.probability}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Mitigation: </span>
                    <p className="text-sm text-muted-foreground">{risk.mitigation}</p>
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
