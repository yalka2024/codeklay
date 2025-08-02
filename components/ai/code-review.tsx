"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Shield, Zap, TrendingUp, AlertTriangle, CheckCircle, Eye, GitPullRequest } from "lucide-react"

const codeReviewData = {
  overall: {
    score: 87,
    issues: 12,
    suggestions: 8,
    security: 3,
    performance: 5,
    maintainability: 4,
  },
  files: [
    {
      name: "src/components/UserAuth.tsx",
      score: 92,
      issues: [
        {
          type: "security",
          severity: "high",
          line: 45,
          message: "Potential XSS vulnerability in user input handling",
          suggestion: "Use proper input sanitization with DOMPurify",
          autoFixable: true,
        },
        {
          type: "performance",
          severity: "medium",
          line: 23,
          message: "Unnecessary re-renders due to inline object creation",
          suggestion: "Move object creation outside render or use useMemo",
          autoFixable: true,
        },
      ],
    },
    {
      name: "src/utils/api.ts",
      score: 78,
      issues: [
        {
          type: "maintainability",
          severity: "low",
          line: 67,
          message: "Function complexity is too high (cyclomatic complexity: 12)",
          suggestion: "Break down into smaller functions",
          autoFixable: false,
        },
      ],
    },
  ],
}

const securityScans = [
  {
    type: "Dependency Vulnerabilities",
    count: 3,
    severity: "high",
    description: "Outdated packages with known security issues",
  },
  {
    type: "Code Injection",
    count: 1,
    severity: "critical",
    description: "Potential SQL injection vulnerability detected",
  },
  {
    type: "Authentication",
    count: 2,
    severity: "medium",
    description: "Weak authentication implementation",
  },
]

export function CodeReview() {
  const [selectedFile, setSelectedFile] = React.useState(codeReviewData.files[0])
  const [reviewInProgress, setReviewInProgress] = React.useState(false)

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "security":
        return <Shield className="h-4 w-4" />
      case "performance":
        return <Zap className="h-4 w-4" />
      case "maintainability":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Code Review</h1>
          <p className="text-muted-foreground">Comprehensive code analysis with AI-powered insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <GitPullRequest className="mr-2 h-4 w-4" />
            Review PR #123
          </Button>
          <Button
            className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700"
            onClick={() => setReviewInProgress(true)}
            disabled={reviewInProgress}
          >
            <Eye className="mr-2 h-4 w-4" />
            {reviewInProgress ? "Analyzing..." : "Start Review"}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{codeReviewData.overall.score}/100</div>
            <Progress value={codeReviewData.overall.score} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Issues</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{codeReviewData.overall.security}</div>
            <p className="text-xs text-muted-foreground">Critical vulnerabilities found</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{codeReviewData.overall.performance}</div>
            <p className="text-xs text-muted-foreground">Optimization opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintainability</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{codeReviewData.overall.maintainability}</div>
            <p className="text-xs text-muted-foreground">Code quality issues</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList>
          <TabsTrigger value="issues">Issues & Suggestions</TabsTrigger>
          <TabsTrigger value="security">Security Scan</TabsTrigger>
          <TabsTrigger value="metrics">Code Metrics</TabsTrigger>
          <TabsTrigger value="history">Review History</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* File List */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Files Reviewed</CardTitle>
                  <CardDescription>Click to view detailed analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {codeReviewData.files.map((file) => (
                      <div
                        key={file.name}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedFile.name === file.name
                            ? "border-teal-500 bg-teal-500/10"
                            : "border-border hover:border-teal-500/50"
                        }`}
                        onClick={() => setSelectedFile(file)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{file.name}</span>
                          <Badge variant="outline">{file.score}/100</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {file.issues.length} issues
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Issue Details */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedFile.name}</CardTitle>
                  <CardDescription>Detailed analysis and suggestions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedFile.issues.map((issue, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(issue.severity)}>
                            {getTypeIcon(issue.type)}
                            <span className="ml-1 capitalize">{issue.severity}</span>
                          </Badge>
                          <Badge variant="outline">Line {issue.line}</Badge>
                        </div>
                        {issue.autoFixable && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Zap className="mr-1 h-3 w-3" />
                            Auto Fix
                          </Button>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{issue.message}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{issue.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {securityScans.map((scan, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {scan.type}
                  </CardTitle>
                  <CardDescription>{scan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{scan.count}</div>
                    <Badge className={getSeverityColor(scan.severity)}>{scan.severity.toUpperCase()}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Code Complexity</CardTitle>
                <CardDescription>Cyclomatic complexity analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Complexity</span>
                    <span>4.2</span>
                  </div>
                  <Progress value={42} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Max Complexity</span>
                    <span>12</span>
                  </div>
                  <Progress value={80} className="bg-red-100" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Test Coverage</CardTitle>
                <CardDescription>Code coverage analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Line Coverage</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Branch Coverage</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review History</CardTitle>
              <CardDescription>Previous code reviews and improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "2 hours ago", score: 87, issues: 12, reviewer: "AI Assistant" },
                  { date: "1 day ago", score: 82, issues: 18, reviewer: "AI Assistant" },
                  { date: "3 days ago", score: 79, issues: 23, reviewer: "AI Assistant" },
                ].map((review, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Score: {review.score}/100</div>
                      <div className="text-sm text-muted-foreground">
                        {review.issues} issues • Reviewed by {review.reviewer}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{review.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
