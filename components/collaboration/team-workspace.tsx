"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageCircle,
  Video,
  Users,
  Share2,
  Bell,
  Calendar,
  FileText,
  Code,
  GitPullRequest,
  Star,
  Send,
  Paperclip,
  Smile,
} from "lucide-react"
import { useI18n } from '../app/i18n'
import { useEntitlement } from '../../hooks/use-entitlement';
import { UpgradePrompt } from '../../components/ui/upgrade-prompt';

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    role: "Full Stack Developer",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "online",
    currentTask: "Working on user authentication",
    lastActive: "now",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Frontend Developer",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "busy",
    currentTask: "Designing product catalog UI",
    lastActive: "5 minutes ago",
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "Backend Developer",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "away",
    currentTask: "Setting up payment gateway",
    lastActive: "1 hour ago",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    role: "DevOps Engineer",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "online",
    currentTask: "Configuring CI/CD pipeline",
    lastActive: "now",
  },
]

const chatMessages = [
  {
    id: 1,
    author: "John Doe",
    avatar: "/placeholder.svg?height=24&width=24",
    message: "Hey team, I've finished the user authentication API. Ready for review!",
    timestamp: "10:30 AM",
    type: "message",
  },
  {
    id: 2,
    author: "Jane Smith",
    avatar: "/placeholder.svg?height=24&width=24",
    message: "Great work! I'll review it after I finish the login UI components.",
    timestamp: "10:32 AM",
    type: "message",
  },
  {
    id: 3,
    author: "System",
    avatar: "",
    message: "John Doe created a pull request: 'Add user authentication endpoints'",
    timestamp: "10:35 AM",
    type: "system",
    link: "#pr-123",
  },
  {
    id: 4,
    author: "Mike Johnson",
    avatar: "/placeholder.svg?height=24&width=24",
    message: "Can someone help me with the Stripe integration? Getting some webhook issues.",
    timestamp: "10:45 AM",
    type: "message",
  },
  {
    id: 5,
    author: "Sarah Wilson",
    avatar: "/placeholder.svg?height=24&width=24",
    message: "I can help with that! Let's hop on a quick call.",
    timestamp: "10:46 AM",
    type: "message",
  },
]

const codeReviews = [
  {
    id: 1,
    title: "Add user authentication endpoints",
    author: "John Doe",
    status: "pending",
    reviewers: ["Jane Smith", "Mike Johnson"],
    comments: 3,
    changes: "+127 -45",
    createdAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Implement product catalog filtering",
    author: "Jane Smith",
    status: "approved",
    reviewers: ["John Doe"],
    comments: 1,
    changes: "+89 -12",
    createdAt: "1 day ago",
  },
  {
    id: 3,
    title: "Add payment webhook handlers",
    author: "Mike Johnson",
    status: "changes-requested",
    reviewers: ["Sarah Wilson", "John Doe"],
    comments: 5,
    changes: "+156 -23",
    createdAt: "2 days ago",
  },
]

const sharedResources = [
  {
    id: 1,
    name: "API Documentation",
    type: "documentation",
    author: "John Doe",
    lastModified: "1 hour ago",
    starred: true,
  },
  {
    id: 2,
    name: "Design System Components",
    type: "code",
    author: "Jane Smith",
    lastModified: "3 hours ago",
    starred: false,
  },
  {
    id: 3,
    name: "Database Schema",
    type: "documentation",
    author: "Mike Johnson",
    lastModified: "1 day ago",
    starred: true,
  },
  {
    id: 4,
    name: "Deployment Guide",
    type: "documentation",
    author: "Sarah Wilson",
    lastModified: "2 days ago",
    starred: false,
  },
]

const upcomingMeetings = [
  {
    id: 1,
    title: "Daily Standup",
    time: "9:00 AM",
    duration: "15 min",
    attendees: 4,
    type: "recurring",
  },
  {
    id: 2,
    title: "Sprint Planning",
    time: "2:00 PM",
    duration: "2 hours",
    attendees: 4,
    type: "meeting",
  },
  {
    id: 3,
    title: "Code Review Session",
    time: "4:00 PM",
    duration: "1 hour",
    attendees: 3,
    type: "review",
  },
]

export function TeamWorkspace() {
  const { t } = useI18n()
  const [chatMessage, setChatMessage] = React.useState("")
  const [selectedMember, setSelectedMember] = React.useState(teamMembers[0])
  const { canAccessAdvancedCollab, isFree } = useEntitlement();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-red-500"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getReviewStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "changes-requested":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const sendMessage = () => {
    if (chatMessage.trim()) {
      // Add message to chat
      setChatMessage("")
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('team_workspace.title')}</h1>
          <p className="text-muted-foreground">{t('team_workspace.description')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Video className="mr-2 h-4 w-4" />
            {t('team_workspace.start_meeting')}
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
            <Share2 className="mr-2 h-4 w-4" />
            {t('team_workspace.share_screen')}
          </Button>
        </div>
      </div>

      {isFree && (
        <div style={{ marginBottom: 16 }}>
          <UpgradePrompt message="Upgrade to unlock advanced collaboration features: video calls, code review, resource sharing, and more." />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Team Members */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t('team_workspace.team_members')}
              </CardTitle>
              <CardDescription>{t('team_workspace.members_online', { count: 4 })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedMember.id === member.id ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{member.currentTask}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Meetings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('team_workspace.todays_schedule')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="p-2 border rounded-lg">
                  <div className="font-medium text-sm">{meeting.title}</div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>
                      {meeting.time} • {meeting.duration}
                    </span>
                    <span>{t('team_workspace.attendees', { count: meeting.attendees })}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="chat" className="space-y-4">
            <TabsList>
              <TabsTrigger value="chat">{t('team_workspace.team_chat')}</TabsTrigger>
              <TabsTrigger value="reviews">{t('team_workspace.code_reviews')}</TabsTrigger>
              <TabsTrigger value="resources">{t('team_workspace.shared_resources')}</TabsTrigger>
              <TabsTrigger value="activity">{t('team_workspace.activity_feed')}</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    {t('team_workspace.team_chat')}
                  </CardTitle>
                  <CardDescription>{t('team_workspace.real_time_communication')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div key={message.id} className="flex gap-3">
                          {message.type === "system" ? (
                            <div className="flex-1 p-2 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground">{message.message}</p>
                              <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                            </div>
                          ) : (
                            <>
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={message.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {message.author
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">{message.author}</span>
                                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                                </div>
                                <p className="text-sm">{message.message}</p>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Input
                      placeholder={t('team_workspace.type_message')}
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button onClick={sendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <div className="space-y-4">
                {codeReviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{review.title}</CardTitle>
                          <CardDescription>
                            {t('team_workspace.by_author_created_changes', { 
                              author: review.author, 
                              createdAt: review.createdAt, 
                              changes: review.changes 
                            })}
                          </CardDescription>
                        </div>
                        <Badge className={getReviewStatusColor(review.status)}>{review.status.replace("-", " ")}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{t('team_workspace.reviewers')}: {review.reviewers.join(", ")}</span>
                          <span>{t('team_workspace.comments', { count: review.comments })}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <GitPullRequest className="mr-2 h-3 w-3" />
                          {t('team_workspace.review')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {sharedResources.map((resource) => (
                  <Card key={resource.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {resource.type === "documentation" ? (
                            <FileText className="h-5 w-5" />
                          ) : (
                            <Code className="h-5 w-5" />
                          )}
                          {resource.name}
                        </CardTitle>
                        {resource.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      </div>
                      <CardDescription>
                        {t('team_workspace.by_author_modified', { 
                          author: resource.author, 
                          lastModified: resource.lastModified 
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" className="w-full">
                        {t('team_workspace.open_resource')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    {t('team_workspace.recent_activity')}
                  </CardTitle>
                  <CardDescription>{t('team_workspace.team_activity_last_24_hours')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        user: "John Doe",
                        action: t('team_workspace.created_pull_request'),
                        target: "Add user authentication endpoints",
                        time: "2 hours ago",
                      },
                      {
                        user: "Jane Smith",
                        action: t('team_workspace.completed_task'),
                        target: "Design login form components",
                        time: "4 hours ago",
                      },
                      {
                        user: "Mike Johnson",
                        action: t('team_workspace.commented_on'),
                        target: "Payment integration PR",
                        time: "6 hours ago",
                      },
                      {
                        user: "Sarah Wilson",
                        action: t('team_workspace.deployed_to'),
                        target: "staging environment",
                        time: "8 hours ago",
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {activity.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                            <span className="font-medium">{activity.target}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
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
