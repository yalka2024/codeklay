"use client"

import type * as React from "react"
import {
  Code2,
  FolderPlus,
  Bug,
  Rocket,
  BookOpen,
  Home,
  Terminal,
  GitBranch,
  Shield,
  BarChart3,
  Users,
  Settings,
  Zap,
  Eye,
  Database,
  Cloud,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useI18n } from '../app/i18n'
import { useRBAC } from '../hooks/use-rbac';

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Project Creation",
    url: "/projects/new",
    icon: FolderPlus,
  },
  {
    title: "Code Editor",
    url: "/editor",
    icon: Code2,
  },
  {
    title: "AI Code Review",
    url: "/code-review",
    icon: Eye,
  },
  {
    title: "Debugging",
    url: "/debug",
    icon: Bug,
  },
  {
    title: "Knowledge Base",
    url: "/knowledge",
    icon: BookOpen,
  },
]

const projectManagementItems = [
  {
    title: "Project Management",
    url: "/project-management",
    icon: FolderPlus,
  },
  {
    title: "Team Workspace",
    url: "/team",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
]

const devopsItems = [
  {
    title: "CI/CD Pipeline",
    url: "/cicd",
    icon: GitBranch,
  },
  {
    title: "Deployment",
    url: "/deploy",
    icon: Rocket,
  },
  {
    title: "Infrastructure",
    url: "/infrastructure",
    icon: Cloud,
  },
]

const securityItems = [
  {
    title: "Security Center",
    url: "/security",
    icon: Shield,
  },
  {
    title: "Compliance",
    url: "/compliance",
    icon: Settings,
  },
]

const toolsItems = [
  {
    title: "Terminal",
    url: "/terminal",
    icon: Terminal,
  },
  {
    title: "Database",
    url: "/database",
    icon: Database,
  },
  {
    title: "AI Assistant",
    url: "/ai-assistant",
    icon: Zap,
  },
]

export function AppSidebarEnhanced({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useI18n()
  const { hasPermission } = useRBAC();
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-purple-600">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{t('codepal_pro')}</span>
            <span className="truncate text-xs text-muted-foreground">{t('enterprise_ai_assistant')}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('core_features')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t('project_management')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projectManagementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>DevOps & Deployment</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {devopsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Security & Compliance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {securityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t('tools')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {hasPermission('manage_users') && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/admin/users">Manage Users</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=24&width=24" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span>John Developer</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
