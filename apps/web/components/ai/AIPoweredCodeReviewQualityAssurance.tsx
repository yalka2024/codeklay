// AI-Powered Code Review & Quality Assurance for CodePal
// Features: Automated code review, quality checks, intelligent feedback, compliance monitoring

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface CodeReview {
  id: string;
  pullRequestId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  files: ReviewFile[];
  issues: ReviewIssue[];
  metrics: ReviewMetrics;
  aiInsights: AIInsight[];
  reviewers: Reviewer[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface ReviewFile {
  id: string;
  path: string;
  language: string;
  changes: FileChange[];
  issues: ReviewIssue[];
  metrics: FileMetrics;
  status: 'pending' | 'reviewed' | 'approved' | 'needs_changes';
}

interface FileChange {
  id: string;
  type: 'added' | 'modified' | 'deleted';
  lineNumber: number;
  content: string;
  oldContent?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ReviewIssue {
  id: string;
  type: 'bug' | 'security' | 'performance' | 'style' | 'best_practice' | 'accessibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  filePath: string;
  lineNumber: number;
  columnNumber: number;
  suggestion: string;
  confidence: number;
  category: string;
  tags: string[];
  status: 'open' | 'resolved' | 'ignored' | 'false_positive';
  createdAt: string;
  resolvedAt?: string;
}

interface ReviewMetrics {
  totalIssues: number;
  criticalIssues: number;
  securityIssues: number;
  performanceIssues: number;
  codeQuality: number;
  testCoverage: number;
  complexity: number;
  maintainability: number;
  reliability: number;
  securityScore: number;
}

interface FileMetrics {
  linesOfCode: number;
  complexity: number;
  maintainability: number;
  testCoverage: number;
  duplication: number;
  issues: number;
}

interface AIInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'suggestion' | 'warning' | 'improvement';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  category: string;
  actionable: boolean;
  recommendations: string[];
  data: any;
}

interface Reviewer {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'senior_developer' | 'architect' | 'security_expert';
  status: 'pending' | 'reviewing' | 'approved' | 'requested_changes';
  comments: ReviewComment[];
  reviewTime: number;
  lastActivity: string;
}

interface ReviewComment {
  id: string;
  content: string;
  type: 'general' | 'suggestion' | 'question' | 'blocking';
  filePath?: string;
  lineNumber?: number;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

interface QualityCheck {
  id: string;
  name: string;
  category: 'security' | 'performance' | 'quality' | 'compliance' | 'accessibility';
  status: 'passed' | 'failed' | 'warning' | 'skipped';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  details: QualityCheckDetail[];
  executionTime: number;
  timestamp: string;
}

interface QualityCheckDetail {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  location?: string;
  suggestion?: string;
  impact: 'low' | 'medium' | 'high';
}

interface ComplianceRule {
  id: string;
  name: string;
  category: 'security' | 'privacy' | 'performance' | 'accessibility' | 'coding_standards';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  config: ComplianceConfig;
  violations: ComplianceViolation[];
  lastUpdated: string;
}

interface ComplianceConfig {
  threshold: number;
  enabled: boolean;
  customRules: string[];
  exceptions: string[];
}

interface ComplianceViolation {
  id: string;
  ruleId: string;
  filePath: string;
  lineNumber: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'resolved' | 'ignored';
  createdAt: string;
  resolvedAt?: string;
}

interface QualityReport {
  id: string;
  projectId: string;
  timestamp: string;
  summary: QualitySummary;
  checks: QualityCheck[];
  compliance: ComplianceRule[];
  recommendations: QualityRecommendation[];
  trends: QualityTrend[];
}

interface QualitySummary {
  overallScore: number;
  securityScore: number;
  performanceScore: number;
  maintainabilityScore: number;
  reliabilityScore: number;
  totalIssues: number;
  criticalIssues: number;
  passedChecks: number;
  failedChecks: number;
}

interface QualityRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  priority: number;
  category: string;
  estimatedSavings: string;
  implementation: string[];
}

interface QualityTrend {
  metric: string;
  values: TrendPoint[];
  trend: 'improving' | 'declining' | 'stable';
  change: number;
}

interface TrendPoint {
  timestamp: string;
  value: number;
}

export default function AIPoweredCodeReviewQualityAssurance() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'quality' | 'compliance' | 'reports' | 'trends'>('overview');
  const [codeReviews, setCodeReviews] = useState<CodeReview[]>([]);
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([]);
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
  const [qualityReports, setQualityReports] = useState<QualityReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQualityData();
  }, []);

  const loadQualityData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockCodeReviews: CodeReview[] = [
        {
          id: '1',
          pullRequestId: 'PR-1234',
          title: 'Add user authentication feature',
          description: 'Implement JWT-based authentication with refresh tokens',
          status: 'completed',
          priority: 'high',
          files: [
            {
              id: '1',
              path: '/src/auth/AuthService.ts',
              language: 'TypeScript',
              changes: [
                {
                  id: '1',
                  type: 'added',
                  lineNumber: 45,
                  content: 'const token = jwt.sign(payload, secret, { expiresIn: "1h" });',
                  severity: 'medium'
                }
              ],
              issues: [
                {
                  id: '1',
                  type: 'security',
                  severity: 'high',
                  title: 'Hardcoded JWT secret',
                  description: 'JWT secret should be stored in environment variables',
                  filePath: '/src/auth/AuthService.ts',
                  lineNumber: 45,
                  columnNumber: 12,
                  suggestion: 'Use process.env.JWT_SECRET instead of hardcoded secret',
                  confidence: 0.95,
                  category: 'security',
                  tags: ['jwt', 'security', 'hardcoded'],
                  status: 'open',
                  createdAt: '2024-03-20T10:00:00Z'
                }
              ],
              metrics: {
                linesOfCode: 120,
                complexity: 3,
                maintainability: 85,
                testCoverage: 78,
                duplication: 5,
                issues: 3
              },
              status: 'needs_changes'
            }
          ],
          issues: [
            {
              id: '1',
              type: 'security',
              severity: 'high',
              title: 'Hardcoded JWT secret',
              description: 'JWT secret should be stored in environment variables',
              filePath: '/src/auth/AuthService.ts',
              lineNumber: 45,
              columnNumber: 12,
              suggestion: 'Use process.env.JWT_SECRET instead of hardcoded secret',
              confidence: 0.95,
              category: 'security',
              tags: ['jwt', 'security', 'hardcoded'],
              status: 'open',
              createdAt: '2024-03-20T10:00:00Z'
            }
          ],
          metrics: {
            totalIssues: 5,
            criticalIssues: 1,
            securityIssues: 2,
            performanceIssues: 1,
            codeQuality: 78,
            testCoverage: 75,
            complexity: 4,
            maintainability: 82,
            reliability: 85,
            securityScore: 65
          },
          aiInsights: [
            {
              id: '1',
              type: 'warning',
              title: 'Security Vulnerability Detected',
              description: 'Hardcoded secrets in authentication code pose security risks',
              impact: 'high',
              confidence: 0.95,
              category: 'security',
              actionable: true,
              recommendations: [
                'Move JWT secret to environment variables',
                'Implement secret rotation',
                'Add security scanning to CI/CD pipeline'
              ],
              data: { affectedFiles: 2, riskLevel: 'high' }
            }
          ],
          reviewers: [
            {
              id: '1',
              name: 'Alice Security',
              email: 'alice@example.com',
              role: 'security_expert',
              status: 'requested_changes',
              comments: [
                {
                  id: '1',
                  content: 'Security issue: JWT secret should not be hardcoded',
                  type: 'blocking',
                  filePath: '/src/auth/AuthService.ts',
                  lineNumber: 45,
                  resolved: false,
                  createdAt: '2024-03-20T10:30:00Z'
                }
              ],
              reviewTime: 1800,
              lastActivity: '2024-03-20T10:30:00Z'
            }
          ],
          createdAt: '2024-03-20T09:00:00Z',
          updatedAt: '2024-03-20T10:30:00Z',
          completedAt: '2024-03-20T11:00:00Z'
        }
      ];

      const mockQualityChecks: QualityCheck[] = [
        {
          id: '1',
          name: 'Security Vulnerability Scan',
          category: 'security',
          status: 'failed',
          severity: 'high',
          description: 'Scan for common security vulnerabilities in code',
          details: [
            {
              id: '1',
              name: 'SQL Injection Check',
              status: 'failed',
              message: 'Potential SQL injection vulnerability detected',
              location: '/src/database/UserRepository.ts:67',
              suggestion: 'Use parameterized queries instead of string concatenation',
              impact: 'high'
            }
          ],
          executionTime: 45,
          timestamp: '2024-03-20T10:00:00Z'
        },
        {
          id: '2',
          name: 'Performance Analysis',
          category: 'performance',
          status: 'warning',
          severity: 'medium',
          description: 'Analyze code for performance bottlenecks',
          details: [
            {
              id: '2',
              name: 'Memory Leak Detection',
              status: 'warning',
              message: 'Potential memory leak in event listeners',
              location: '/src/components/DataTable.tsx:89',
              suggestion: 'Remove event listeners in component cleanup',
              impact: 'medium'
            }
          ],
          executionTime: 30,
          timestamp: '2024-03-20T10:00:00Z'
        }
      ];

      const mockComplianceRules: ComplianceRule[] = [
        {
          id: '1',
          name: 'No Hardcoded Secrets',
          category: 'security',
          description: 'Prevent hardcoded secrets, passwords, and API keys in code',
          severity: 'critical',
          enabled: true,
          config: {
            threshold: 0,
            enabled: true,
            customRules: ['password', 'secret', 'api_key'],
            exceptions: ['test', 'example']
          },
          violations: [
            {
              id: '1',
              ruleId: '1',
              filePath: '/src/auth/AuthService.ts',
              lineNumber: 45,
              description: 'Hardcoded JWT secret found',
              severity: 'critical',
              status: 'open',
              createdAt: '2024-03-20T10:00:00Z'
            }
          ],
          lastUpdated: '2024-03-20T09:00:00Z'
        }
      ];

      const mockQualityReports: QualityReport[] = [
        {
          id: '1',
          projectId: 'project-1',
          timestamp: '2024-03-20T10:00:00Z',
          summary: {
            overallScore: 78,
            securityScore: 65,
            performanceScore: 82,
            maintainabilityScore: 85,
            reliabilityScore: 88,
            totalIssues: 15,
            criticalIssues: 2,
            passedChecks: 12,
            failedChecks: 3
          },
          checks: mockQualityChecks,
          compliance: mockComplianceRules,
          recommendations: [
            {
              id: '1',
              title: 'Fix Security Vulnerabilities',
              description: 'Address critical security issues in authentication code',
              impact: 'critical',
              effort: 'medium',
              priority: 1,
              category: 'security',
              estimatedSavings: 'Prevent potential security breaches',
              implementation: [
                'Move secrets to environment variables',
                'Implement proper input validation',
                'Add security scanning to CI/CD'
              ]
            }
          ],
          trends: [
            {
              metric: 'Security Score',
              values: [
                { timestamp: '2024-03-15T00:00:00Z', value: 70 },
                { timestamp: '2024-03-16T00:00:00Z', value: 68 },
                { timestamp: '2024-03-17T00:00:00Z', value: 65 }
              ],
              trend: 'declining',
              change: -5
            }
          ]
        }
      ];

      setCodeReviews(mockCodeReviews);
      setQualityChecks(mockQualityChecks);
      setComplianceRules(mockComplianceRules);
      setQualityReports(mockQualityReports);
      setLoading(false);
    }, 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'skipped': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const renderOverview = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Overall Quality Score</h3>
          <p className={`text-3xl font-bold ${getScoreColor(qualityReports[0]?.summary.overallScore || 0)}`}>
            {qualityReports[0]?.summary.overallScore || 0}/100
          </p>
          <p className="text-sm text-blue-700">Code quality assessment</p>
        </div>
        <div className="bg-red-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-red-900">Critical Issues</h3>
          <p className="text-3xl font-bold text-red-600">{qualityReports[0]?.summary.criticalIssues || 0}</p>
          <p className="text-sm text-red-700">High priority issues</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Passed Checks</h3>
          <p className="text-3xl font-bold text-green-600">{qualityReports[0]?.summary.passedChecks || 0}</p>
          <p className="text-sm text-green-700">Quality checks passed</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Active Reviews</h3>
          <p className="text-3xl font-bold text-purple-600">{codeReviews.filter(r => r.status === 'in_progress').length}</p>
          <p className="text-sm text-purple-700">Ongoing code reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Security Score</span>
              <span className={`font-bold ${getScoreColor(qualityReports[0]?.summary.securityScore || 0)}`}>
                {qualityReports[0]?.summary.securityScore || 0}/100
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Performance Score</span>
              <span className={`font-bold ${getScoreColor(qualityReports[0]?.summary.performanceScore || 0)}`}>
                {qualityReports[0]?.summary.performanceScore || 0}/100
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Maintainability</span>
              <span className={`font-bold ${getScoreColor(qualityReports[0]?.summary.maintainabilityScore || 0)}`}>
                {qualityReports[0]?.summary.maintainabilityScore || 0}/100
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Reliability</span>
              <span className={`font-bold ${getScoreColor(qualityReports[0]?.summary.reliabilityScore || 0)}`}>
                {qualityReports[0]?.summary.reliabilityScore || 0}/100
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Issues</h3>
          <div className="space-y-3">
            {codeReviews.flatMap(review => review.issues).slice(0, 5).map(issue => (
              <div key={issue.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                <span className={`w-3 h-3 rounded-full mt-2 ${getSeverityColor(issue.severity).split(' ')[0]}`}></span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{issue.title}</p>
                  <p className="text-sm text-gray-600">{issue.filePath}:{issue.lineNumber}</p>
                  <p className="text-xs text-gray-500 mt-1">{issue.category} • {issue.severity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Reviews</h3>
      <div className="space-y-6">
        {codeReviews.map(review => (
          <div key={review.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{review.title}</h4>
                <p className="text-sm text-gray-600">{review.description}</p>
                <p className="text-sm text-gray-500 mt-1">PR #{review.pullRequestId}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(review.priority)}`}>
                  {review.priority} priority
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(review.status)}`}>
                  {review.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Total Issues</p>
                <p className="text-lg font-bold text-gray-900">{review.metrics.totalIssues}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Critical Issues</p>
                <p className="text-lg font-bold text-red-600">{review.metrics.criticalIssues}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Code Quality</p>
                <p className={`text-lg font-bold ${getScoreColor(review.metrics.codeQuality)}`}>
                  {review.metrics.codeQuality}/100
                </p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Test Coverage</p>
                <p className="text-lg font-bold text-gray-900">{review.metrics.testCoverage}%</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded mb-4">
              <h5 className="font-medium text-gray-900 mb-3">AI Insights</h5>
              <div className="space-y-3">
                {review.aiInsights.map(insight => (
                  <div key={insight.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="font-medium text-gray-900">{insight.title}</h6>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(insight.impact)}`}>
                        {insight.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                    {insight.recommendations.length > 0 && (
                      <div className="space-y-1">
                        {insight.recommendations.map((rec, index) => (
                          <p key={index} className="text-xs text-gray-600">• {rec}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Reviewers</h5>
              <div className="space-y-3">
                {review.reviewers.map(reviewer => (
                  <div key={reviewer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{reviewer.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{reviewer.role.replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reviewer.status)}`}>
                        {reviewer.status.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{Math.round(reviewer.reviewTime / 60)}min</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuality = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Checks</h3>
      <div className="space-y-6">
        {qualityChecks.map(check => (
          <div key={check.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{check.name}</h4>
                <p className="text-sm text-gray-600">{check.description}</p>
                <p className="text-sm text-gray-500 mt-1">{check.category}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(check.severity)}`}>
                  {check.severity}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(check.status)}`}>
                  {check.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Execution Time</p>
                <p className="text-lg font-bold text-gray-900">{check.executionTime}s</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Details</p>
                <p className="text-lg font-bold text-gray-900">{check.details.length}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Timestamp</p>
                <p className="text-sm text-gray-900">{new Date(check.timestamp).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Check Details</h5>
              <div className="space-y-3">
                {check.details.map(detail => (
                  <div key={detail.id} className="border-l-4 border-red-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="font-medium text-gray-900">{detail.name}</h6>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(detail.status)}`}>
                        {detail.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{detail.message}</p>
                    {detail.location && (
                      <p className="text-xs text-gray-500 mb-2">Location: {detail.location}</p>
                    )}
                    {detail.suggestion && (
                      <p className="text-xs text-blue-600">Suggestion: {detail.suggestion}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Rules</h3>
      <div className="space-y-6">
        {complianceRules.map(rule => (
          <div key={rule.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{rule.name}</h4>
                <p className="text-sm text-gray-600">{rule.description}</p>
                <p className="text-sm text-gray-500 mt-1">{rule.category}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(rule.severity)}`}>
                  {rule.severity}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${rule.enabled ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'}`}>
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Violations</p>
                <p className="text-lg font-bold text-gray-900">{rule.violations.length}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Threshold</p>
                <p className="text-lg font-bold text-gray-900">{rule.config.threshold}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Updated</p>
                <p className="text-sm text-gray-900">{new Date(rule.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Violations ({rule.violations.length})</h5>
              <div className="space-y-3">
                {rule.violations.map(violation => (
                  <div key={violation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{violation.description}</p>
                      <p className="text-sm text-gray-600">{violation.filePath}:{violation.lineNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(violation.severity)}`}>
                        {violation.severity}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{violation.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Reports</h3>
      <div className="space-y-6">
        {qualityReports.map(report => (
          <div key={report.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Quality Report</h4>
                <p className="text-sm text-gray-600">Project: {report.projectId}</p>
                <p className="text-sm text-gray-500 mt-1">{new Date(report.timestamp).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${getScoreColor(report.summary.overallScore)}`}>
                  {report.summary.overallScore}/100
                </p>
                <p className="text-sm text-gray-500">Overall Score</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Security</p>
                <p className={`text-lg font-bold ${getScoreColor(report.summary.securityScore)}`}>
                  {report.summary.securityScore}/100
                </p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Performance</p>
                <p className={`text-lg font-bold ${getScoreColor(report.summary.performanceScore)}`}>
                  {report.summary.performanceScore}/100
                </p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Maintainability</p>
                <p className={`text-lg font-bold ${getScoreColor(report.summary.maintainabilityScore)}`}>
                  {report.summary.maintainabilityScore}/100
                </p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Reliability</p>
                <p className={`text-lg font-bold ${getScoreColor(report.summary.reliabilityScore)}`}>
                  {report.summary.reliabilityScore}/100
                </p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Issues</p>
                <p className="text-lg font-bold text-gray-900">{report.summary.totalIssues}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Recommendations</h5>
              <div className="space-y-3">
                {report.recommendations.map(rec => (
                  <div key={rec.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="font-medium text-gray-900">{rec.title}</h6>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(rec.impact)}`}>
                        {rec.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Effort: {rec.effort}</span>
                      <span>Priority: {rec.priority}</span>
                      <span>Category: {rec.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Trends</h3>
      <div className="space-y-6">
        {qualityReports[0]?.trends.map(trend => (
          <div key={trend.metric} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">{trend.metric}</h4>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  trend.trend === 'improving' ? 'text-green-600 bg-green-100' :
                  trend.trend === 'declining' ? 'text-red-600 bg-red-100' :
                  'text-gray-600 bg-gray-100'
                }`}>
                  {trend.trend}
                </span>
                <span className={`text-sm font-medium ${
                  trend.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.change > 0 ? '+' : ''}{trend.change}%
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              {trend.values.map((point, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">
                    {new Date(point.timestamp).toLocaleDateString()}
                  </span>
                  <span className="font-medium text-gray-900">{point.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quality data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Code Review & Quality Assurance</h1>
          <p className="text-gray-600 mt-2">
            Automated code review, quality checks, intelligent feedback, and compliance monitoring
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'reviews', label: 'Code Reviews' },
              { id: 'quality', label: 'Quality Checks' },
              { id: 'compliance', label: 'Compliance' },
              { id: 'reports', label: 'Reports' },
              { id: 'trends', label: 'Trends' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'reviews' && renderReviews()}
          {activeTab === 'quality' && renderQuality()}
          {activeTab === 'compliance' && renderCompliance()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'trends' && renderTrends()}
        </div>
      </div>
    </div>
  );
} 