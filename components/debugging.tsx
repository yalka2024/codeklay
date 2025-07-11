'use client';

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bug, Zap, BookOpen, CheckCircle, AlertTriangle, XCircle, Clock, ArrowRight } from "lucide-react"
import { useI18n } from '../app/i18n'

const detectedBugs = [
  {
    id: 1,
    severity: "error",
    file: "src/components/TodoList.tsx",
    line: 23,
    column: 15,
    message: "Property 'id' does not exist on type 'TodoItem'",
    description: "The TodoItem interface is missing the 'id' property that's being accessed in the component.",
    suggestion: "Add 'id: number' to the TodoItem interface definition",
    fixCode: "interface TodoItem {\n  id: number;\n  text: string;\n  completed: boolean;\n}",
    timestamp: "2 minutes ago",
  },
  {
    id: 2,
    severity: "warning",
    file: "src/utils/api.ts",
    line: 45,
    column: 8,
    message: "Unused variable 'response'",
    description: "The 'response' variable is declared but never used in the function scope.",
    suggestion: "Remove the unused variable or use it in your code",
    fixCode: "// Remove: const response = await fetch(url);\n// Or use it: return response.json();",
    timestamp: "5 minutes ago",
  },
  {
    id: 3,
    severity: "info",
    file: "src/components/Header.tsx",
    line: 12,
    column: 3,
    message: "Consider using React.memo for performance optimization",
    description: "This component could benefit from memoization to prevent unnecessary re-renders.",
    suggestion: "Wrap the component with React.memo",
    fixCode: "export default React.memo(Header);",
    timestamp: "10 minutes ago",
  },
]

const bugHistory = [
  {
    id: 1,
    title: "Fixed null pointer exception in user authentication",
    file: "src/auth/login.ts",
    fixedAt: "2 hours ago",
    solution: "Added null check before accessing user properties",
  },
  {
    id: 2,
    title: "Resolved memory leak in event listeners",
    file: "src/components/Chart.tsx",
    fixedAt: "1 day ago",
    solution: "Added cleanup function in useEffect hook",
  },
  {
    id: 3,
    title: "Fixed infinite loop in useEffect dependency",
    file: "src/hooks/useData.ts",
    fixedAt: "2 days ago",
    solution: "Corrected dependency array to prevent unnecessary re-renders",
  },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "error":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    case "warning":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "info":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "error":
      return <XCircle className="h-4 w-4" />
    case "warning":
      return <AlertTriangle className="h-4 w-4" />
    case "info":
      return <Bug className="h-4 w-4" />
    default:
      return <Bug className="h-4 w-4" />
  }
}

export function Debugging() {
  const { t } = useI18n()
  const [selectedBug, setSelectedBug] = React.useState(detectedBugs[0])

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('debugging.title')}</h1>
          <p className="text-muted-foreground">{t('debugging.description')}</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
          <Bug className="mr-2 h-4 w-4" />
          {t('debugging.scan_project')}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bug List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('debugging.detected_issues')}</span>
                <Badge variant="secondary">{detectedBugs.length}</Badge>
              </CardTitle>
              <CardDescription>{t('debugging.issues_found_in_codebase')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {detectedBugs.map((bug) => (
                    <div
                      key={bug.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedBug.id === bug.id
                          ? "border-teal-500 bg-teal-500/10"
                          : "border-border hover:border-teal-500/50"
                      }`}
                      onClick={() => setSelectedBug(bug)}
                    >
                      <div className="flex items-start gap-2">
                        <Badge className={getSeverityColor(bug.severity)}>
                          {getSeverityIcon(bug.severity)}
                          <span className="ml-1 capitalize">{bug.severity}</span>
                        </Badge>
                      </div>
                      <h4 className="font-medium mt-2 text-sm leading-tight">{bug.message}</h4>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>
                          {bug.file}:{bug.line}
                        </span>
                        <span>{bug.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Bug Details */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getSeverityIcon(selectedBug.severity)}
                  {t('debugging.bug_details')}
                </CardTitle>
                <Badge className={getSeverityColor(selectedBug.severity)}>{selectedBug.severity.toUpperCase()}</Badge>
              </div>
              <CardDescription>
                {selectedBug.file} • {t('debugging.line_column', { line: selectedBug.line, column: selectedBug.column })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{t('debugging.error_message')}</h4>
                <p className="text-sm bg-muted p-3 rounded-md font-mono">{selectedBug.message}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{t('debugging.description')}</h4>
                <p className="text-sm text-muted-foreground">{selectedBug.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{t('debugging.ai_suggestion')}</h4>
                <p className="text-sm mb-3">{selectedBug.suggestion}</p>
                <div className="bg-muted p-3 rounded-md">
                  <pre className="text-sm font-mono overflow-x-auto">
                    <code>{selectedBug.fixCode}</code>
                  </pre>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Zap className="mr-2 h-4 w-4" />
                  {t('debugging.fix_with_ai')}
                </Button>
                <Button variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t('debugging.learn_more')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bug History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t('debugging.recently_fixed')}
              </CardTitle>
              <CardDescription>{t('debugging.history_of_resolved_bugs')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bugHistory.map((fix) => (
                  <div key={fix.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{fix.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {fix.file} • {fix.fixedAt}
                      </p>
                      <p className="text-sm mt-2 text-muted-foreground">{fix.solution}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
