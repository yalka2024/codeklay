// AI Integration Testing for CodePal
// Features: Comprehensive testing frameworks, integration validation, performance testing, quality assurance

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface TestSuite {
  id: string;
  name: string;
  description: string;
  category: 'unit' | 'integration' | 'performance' | 'security' | 'end-to-end';
  status: 'passing' | 'failing' | 'running' | 'pending' | 'skipped';
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  executionTime: number; // seconds
  lastRun: string;
  nextRun: string;
  coverage: number; // percentage
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface TestCase {
  id: string;
  name: string;
  description: string;
  suiteId: string;
  status: 'pass' | 'fail' | 'skip' | 'pending';
  executionTime: number; // milliseconds
  errorMessage?: string;
  stackTrace?: string;
  expectedResult: string;
  actualResult?: string;
  tags: string[];
  lastRun: string;
  runCount: number;
  successRate: number; // percentage
}

interface IntegrationTest {
  id: string;
  name: string;
  description: string;
  type: 'api' | 'database' | 'external_service' | 'ai_model' | 'workflow';
  status: 'passing' | 'failing' | 'running' | 'pending';
  endpoints: string[];
  dependencies: string[];
  testData: TestData;
  results: IntegrationTestResults;
  lastRun: string;
  frequency: 'hourly' | 'daily' | 'weekly' | 'manual';
}

interface TestData {
  inputData: Record<string, any>;
  expectedOutput: Record<string, any>;
  mockResponses: Record<string, any>;
  testScenarios: TestScenario[];
}

interface TestScenario {
  id: string;
  name: string;
  description: string;
  input: Record<string, any>;
  expectedOutput: Record<string, any>;
  status: 'pass' | 'fail' | 'pending';
  executionTime: number;
  errorMessage?: string;
}

interface IntegrationTestResults {
  totalScenarios: number;
  passedScenarios: number;
  failedScenarios: number;
  averageResponseTime: number;
  successRate: number;
  lastSuccessfulRun?: string;
  consecutiveFailures: number;
}

interface PerformanceTest {
  id: string;
  name: string;
  description: string;
  type: 'load' | 'stress' | 'spike' | 'endurance' | 'scalability';
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  configuration: PerformanceConfig;
  results: PerformanceResults;
  thresholds: PerformanceThresholds;
  lastRun: string;
  duration: number; // minutes
}

interface PerformanceConfig {
  virtualUsers: number;
  rampUpTime: number; // seconds
  testDuration: number; // minutes
  targetEndpoint: string;
  requestPattern: 'constant' | 'ramp' | 'spike' | 'random';
  dataSet: string;
}

interface PerformanceResults {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  requestsPerSecond: number;
  errorRate: number;
  throughput: number;
  resourceUtilization: ResourceMetrics;
}

interface ResourceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  networkIO: number;
  diskIO: number;
  gpuUsage?: number;
}

interface PerformanceThresholds {
  maxResponseTime: number;
  maxErrorRate: number;
  minThroughput: number;
  maxResourceUsage: number;
}

interface AITest {
  id: string;
  name: string;
  description: string;
  modelId: string;
  testType: 'accuracy' | 'latency' | 'throughput' | 'quality' | 'bias';
  status: 'passing' | 'failing' | 'running' | 'pending';
  metrics: AIMetrics;
  testData: AITestData;
  results: AITestResults;
  lastRun: string;
}

interface AIMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  latency: number;
  throughput: number;
  qualityScore: number;
  biasScore: number;
}

interface AITestData {
  testSetSize: number;
  inputTypes: string[];
  expectedOutputs: Record<string, any>;
  edgeCases: string[];
  biasTestCases: string[];
}

interface AITestResults {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  averageAccuracy: number;
  averageLatency: number;
  qualityIssues: string[];
  biasIssues: string[];
  recommendations: string[];
}

interface TestReport {
  id: string;
  name: string;
  description: string;
  testRunId: string;
  timestamp: string;
  summary: TestSummary;
  details: TestDetails;
  recommendations: string[];
  status: 'generated' | 'reviewed' | 'approved' | 'rejected';
}

interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  totalExecutionTime: number;
  overallSuccessRate: number;
  criticalIssues: number;
  highPriorityIssues: number;
}

interface TestDetails {
  testSuites: TestSuite[];
  integrationTests: IntegrationTest[];
  performanceTests: PerformanceTest[];
  aiTests: AITest[];
  failedTests: TestCase[];
  performanceIssues: string[];
  securityIssues: string[];
}

export default function AIIntegrationTesting() {
  const { user } = useAuthContext();
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [integrationTests, setIntegrationTests] = useState<IntegrationTest[]>([]);
  const [performanceTests, setPerformanceTests] = useState<PerformanceTest[]>([]);
  const [aiTests, setAITests] = useState<AITest[]>([]);
  const [testReports, setTestReports] = useState<TestReport[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestSuite | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'suites' | 'integration' | 'performance' | 'ai' | 'reports'>('overview');

  // Load testing data
  const loadTestingData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockTestSuites: TestSuite[] = [
        {
          id: '1',
          name: 'AI Code Completion Tests',
          description: 'Comprehensive tests for AI code completion functionality',
          category: 'integration',
          status: 'passing',
          totalTests: 45,
          passedTests: 43,
          failedTests: 1,
          skippedTests: 1,
          executionTime: 120,
          lastRun: '2024-01-15T10:30:00Z',
          nextRun: '2024-01-15T16:30:00Z',
          coverage: 92.5,
          priority: 'high'
        },
        {
          id: '2',
          name: 'AI Model Performance Tests',
          description: 'Performance and accuracy tests for AI models',
          category: 'performance',
          status: 'running',
          totalTests: 28,
          passedTests: 25,
          failedTests: 2,
          skippedTests: 1,
          executionTime: 180,
          lastRun: '2024-01-15T11:00:00Z',
          nextRun: '2024-01-15T17:00:00Z',
          coverage: 89.3,
          priority: 'critical'
        },
        {
          id: '3',
          name: 'API Integration Tests',
          description: 'Tests for external API integrations',
          category: 'integration',
          status: 'failing',
          totalTests: 32,
          passedTests: 28,
          failedTests: 4,
          skippedTests: 0,
          executionTime: 95,
          lastRun: '2024-01-15T09:15:00Z',
          nextRun: '2024-01-15T15:15:00Z',
          coverage: 87.5,
          priority: 'medium'
        }
      ];

      const mockTestCases: TestCase[] = [
        {
          id: '1',
          name: 'Code Completion Accuracy Test',
          description: 'Test AI code completion accuracy with various code snippets',
          suiteId: '1',
          status: 'pass',
          executionTime: 2500,
          expectedResult: 'Accurate code completion with 95%+ accuracy',
          actualResult: 'Accurate code completion with 96.2% accuracy',
          tags: ['ai', 'accuracy', 'code-completion'],
          lastRun: '2024-01-15T10:30:00Z',
          runCount: 156,
          successRate: 98.7
        },
        {
          id: '2',
          name: 'Model Latency Test',
          description: 'Test AI model response time under normal load',
          suiteId: '2',
          status: 'fail',
          executionTime: 1800,
          expectedResult: 'Response time < 100ms',
          actualResult: 'Response time 125ms',
          errorMessage: 'Response time exceeded threshold',
          tags: ['ai', 'performance', 'latency'],
          lastRun: '2024-01-15T11:00:00Z',
          runCount: 89,
          successRate: 92.1
        }
      ];

      const mockIntegrationTests: IntegrationTest[] = [
        {
          id: '1',
          name: 'AI Model API Integration',
          description: 'Test integration with external AI model APIs',
          type: 'ai_model',
          status: 'passing',
          endpoints: ['/api/ai/completion', '/api/ai/analysis'],
          dependencies: ['OpenAI API', 'DeepSeek API'],
          testData: {
            inputData: { code: 'function test() {', language: 'javascript' },
            expectedOutput: { completion: 'return true; }', confidence: 0.95 },
            mockResponses: { 'openai': { completion: 'return true; }' } },
            testScenarios: [
              {
                id: '1',
                name: 'Basic Code Completion',
                description: 'Test basic code completion functionality',
                input: { code: 'const user = {', language: 'javascript' },
                expectedOutput: { completion: 'name: "", age: 0 }', confidence: 0.9 },
                status: 'pass',
                executionTime: 1200
              }
            ]
          },
          results: {
            totalScenarios: 15,
            passedScenarios: 14,
            failedScenarios: 1,
            averageResponseTime: 85,
            successRate: 93.3,
            consecutiveFailures: 0
          },
          lastRun: '2024-01-15T10:00:00Z',
          frequency: 'hourly'
        }
      ];

      const mockPerformanceTests: PerformanceTest[] = [
        {
          id: '1',
          name: 'AI Model Load Test',
          description: 'Test AI model performance under high load',
          type: 'load',
          status: 'completed',
          configuration: {
            virtualUsers: 100,
            rampUpTime: 60,
            testDuration: 30,
            targetEndpoint: '/api/ai/completion',
            requestPattern: 'constant',
            dataSet: 'code_snippets.json'
          },
          results: {
            totalRequests: 18000,
            successfulRequests: 17500,
            failedRequests: 500,
            averageResponseTime: 95,
            p95ResponseTime: 150,
            p99ResponseTime: 200,
            requestsPerSecond: 10,
            errorRate: 2.8,
            throughput: 9500,
            resourceUtilization: {
              cpuUsage: 75,
              memoryUsage: 68,
              networkIO: 45,
              diskIO: 12,
              gpuUsage: 85
            }
          },
          thresholds: {
            maxResponseTime: 100,
            maxErrorRate: 5,
            minThroughput: 8000,
            maxResourceUsage: 80
          },
          lastRun: '2024-01-15T09:00:00Z',
          duration: 30
        }
      ];

      const mockAITests: AITest[] = [
        {
          id: '1',
          name: 'Code Completion Accuracy Test',
          description: 'Test accuracy of AI code completion model',
          modelId: 'code-completion-v2.1',
          testType: 'accuracy',
          status: 'passing',
          metrics: {
            accuracy: 0.962,
            precision: 0.945,
            recall: 0.978,
            f1Score: 0.961,
            latency: 85,
            throughput: 1200,
            qualityScore: 0.89,
            biasScore: 0.12
          },
          testData: {
            testSetSize: 5000,
            inputTypes: ['javascript', 'python', 'typescript'],
            expectedOutputs: { 'javascript': 0.95, 'python': 0.93, 'typescript': 0.96 },
            edgeCases: ['empty_input', 'malformed_code', 'very_long_code'],
            biasTestCases: ['gender_bias', 'language_bias', 'framework_bias']
          },
          results: {
            totalTests: 5000,
            passedTests: 4810,
            failedTests: 190,
            averageAccuracy: 0.962,
            averageLatency: 85,
            qualityIssues: ['Some edge cases show lower accuracy'],
            biasIssues: ['Minor bias detected in framework preferences'],
            recommendations: ['Retrain model with more diverse data', 'Add bias correction layer']
          },
          lastRun: '2024-01-15T08:00:00Z'
        }
      ];

      const mockTestReports: TestReport[] = [
        {
          id: '1',
          name: 'Daily AI Integration Test Report',
          description: 'Comprehensive report of AI integration tests',
          testRunId: 'run-2024-01-15',
          timestamp: '2024-01-15T12:00:00Z',
          summary: {
            totalTests: 105,
            passedTests: 98,
            failedTests: 6,
            skippedTests: 1,
            totalExecutionTime: 1800,
            overallSuccessRate: 93.3,
            criticalIssues: 1,
            highPriorityIssues: 3
          },
          details: {
            testSuites: mockTestSuites,
            integrationTests: mockIntegrationTests,
            performanceTests: mockPerformanceTests,
            aiTests: mockAITests,
            failedTests: mockTestCases.filter(tc => tc.status === 'fail'),
            performanceIssues: ['Response time exceeded threshold in 2 tests'],
            securityIssues: ['No security issues detected']
          },
          recommendations: [
            'Optimize AI model response time',
            'Add more edge case testing',
            'Implement retry mechanism for failed API calls'
          ],
          status: 'reviewed'
        }
      ];

      setTestSuites(mockTestSuites);
      setTestCases(mockTestCases);
      setIntegrationTests(mockIntegrationTests);
      setPerformanceTests(mockPerformanceTests);
      setAITests(mockAITests);
      setTestReports(mockTestReports);
    } catch (error) {
      console.error('Error loading testing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run test suite
  const runTestSuite = async (suiteId: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTestSuites(prev => prev.map(suite => 
        suite.id === suiteId 
          ? { ...suite, status: 'running' }
          : suite
      ));
      
      // Simulate test completion
      setTimeout(() => {
        setTestSuites(prev => prev.map(suite => 
          suite.id === suiteId 
            ? { 
                ...suite, 
                status: 'passing',
                lastRun: new Date().toISOString(),
                passedTests: suite.totalTests - 1,
                failedTests: 1
              }
            : suite
        ));
      }, 5000);
    } catch (error) {
      console.error('Error running test suite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run performance test
  const runPerformanceTest = async (testId: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPerformanceTests(prev => prev.map(test => 
        test.id === testId 
          ? { ...test, status: 'running' }
          : test
      ));
      
      // Simulate test completion
      setTimeout(() => {
        setPerformanceTests(prev => prev.map(test => 
          test.id === testId 
            ? { 
                ...test, 
                status: 'completed',
                lastRun: new Date().toISOString()
              }
            : test
        ));
      }, 10000);
    } catch (error) {
      console.error('Error running performance test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTestingData();
  }, []);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Test Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Test Suites</h3>
          <p className="text-2xl font-bold text-blue-600">{testSuites.length}</p>
          <p className="text-xs text-gray-400">Active test suites</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Overall Success Rate</h3>
          <p className="text-2xl font-bold text-green-600">
            {testSuites.length > 0 
              ? Math.round((testSuites.reduce((acc, suite) => acc + suite.passedTests, 0) / 
                           testSuites.reduce((acc, suite) => acc + suite.totalTests, 0)) * 100)
              : 0}%
          </p>
          <p className="text-xs text-gray-400">Test pass rate</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Failed Tests</h3>
          <p className="text-2xl font-bold text-red-600">
            {testSuites.reduce((acc, suite) => acc + suite.failedTests, 0)}
          </p>
          <p className="text-xs text-gray-400">Tests requiring attention</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Test Coverage</h3>
          <p className="text-2xl font-bold text-purple-600">
            {testSuites.length > 0 
              ? Math.round(testSuites.reduce((acc, suite) => acc + suite.coverage, 0) / testSuites.length)
              : 0}%
          </p>
          <p className="text-xs text-gray-400">Code coverage</p>
        </div>
      </div>

      {/* Test Suite Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Test Suite Status</h3>
        </div>
        <div className="p-6">
          {testSuites.map(suite => (
            <div key={suite.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <h4 className="font-medium text-gray-900">{suite.name}</h4>
                <p className="text-sm text-gray-500">{suite.description}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {suite.passedTests}/{suite.totalTests} passed
                </p>
                <p className="text-sm text-gray-500">{suite.coverage}% coverage</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  suite.status === 'passing' ? 'bg-green-100 text-green-800' :
                  suite.status === 'failing' ? 'bg-red-100 text-red-800' :
                  suite.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {suite.status}
                </span>
                <button
                  onClick={() => runTestSuite(suite.id)}
                  disabled={isLoading || suite.status === 'running'}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Run
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Test Results */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Test Results</h3>
        </div>
        <div className="p-6">
          {testCases.slice(0, 5).map(testCase => (
            <div key={testCase.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <h4 className="font-medium text-gray-900">{testCase.name}</h4>
                <p className="text-sm text-gray-500">{testCase.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{testCase.executionTime}ms</p>
                <p className="text-sm text-gray-500">{testCase.successRate}% success</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                testCase.status === 'pass' ? 'bg-green-100 text-green-800' :
                testCase.status === 'fail' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {testCase.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTestSuites = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Test Suites</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testSuites.map(suite => (
          <div key={suite.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{suite.name}</h3>
                <p className="text-sm text-gray-500">{suite.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                suite.status === 'passing' ? 'bg-green-100 text-green-800' :
                suite.status === 'failing' ? 'bg-red-100 text-red-800' :
                suite.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {suite.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Tests</p>
                <p className="text-lg font-semibold text-gray-900">
                  {suite.passedTests}/{suite.totalTests}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Coverage</p>
                <p className="text-lg font-semibold text-gray-900">{suite.coverage}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Execution Time</p>
                <p className="text-lg font-semibold text-gray-900">{suite.executionTime}s</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Priority</p>
                <p className="text-lg font-semibold text-gray-900">{suite.priority}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Category</p>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {suite.category}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => runTestSuite(suite.id)}
                disabled={isLoading || suite.status === 'running'}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Run Tests
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIntegration = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Integration Tests</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrationTests.map(test => (
          <div key={test.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{test.name}</h3>
                <p className="text-sm text-gray-500">{test.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                test.status === 'passing' ? 'bg-green-100 text-green-800' :
                test.status === 'failing' ? 'bg-red-100 text-red-800' :
                test.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {test.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Scenarios</p>
                <p className="text-lg font-semibold text-gray-900">
                  {test.results.passedScenarios}/{test.results.totalScenarios}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-lg font-semibold text-gray-900">{test.results.successRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Response Time</p>
                <p className="text-lg font-semibold text-gray-900">{test.results.averageResponseTime}ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Frequency</p>
                <p className="text-lg font-semibold text-gray-900">{test.frequency}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Type</p>
              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                {test.type.replace('_', ' ')}
              </span>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Run Test
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                View Results
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Performance Tests</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {performanceTests.map(test => (
          <div key={test.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{test.name}</h3>
                <p className="text-sm text-gray-500">{test.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                test.status === 'completed' ? 'bg-green-100 text-green-800' :
                test.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                test.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {test.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Requests</p>
                <p className="text-lg font-semibold text-gray-900">{test.results.totalRequests.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((test.results.successfulRequests / test.results.totalRequests) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Response</p>
                <p className="text-lg font-semibold text-gray-900">{test.results.averageResponseTime}ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Throughput</p>
                <p className="text-lg font-semibold text-gray-900">{test.results.requestsPerSecond}/s</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Type</p>
              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                {test.type}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => runPerformanceTest(test.id)}
                disabled={isLoading || test.status === 'running'}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Run Test
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                View Results
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">AI Model Tests</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aiTests.map(test => (
          <div key={test.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{test.name}</h3>
                <p className="text-sm text-gray-500">{test.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                test.status === 'passing' ? 'bg-green-100 text-green-800' :
                test.status === 'failing' ? 'bg-red-100 text-red-800' :
                test.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {test.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Accuracy</p>
                <p className="text-lg font-semibold text-gray-900">{(test.metrics.accuracy * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Latency</p>
                <p className="text-lg font-semibold text-gray-900">{test.metrics.latency}ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quality Score</p>
                <p className="text-lg font-semibold text-gray-900">{(test.metrics.qualityScore * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bias Score</p>
                <p className="text-lg font-semibold text-gray-900">{(test.metrics.biasScore * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Test Type</p>
              <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded">
                {test.testType}
              </span>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Run Test
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                View Results
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Test Reports</h2>

      <div className="space-y-4">
        {testReports.map(report => (
          <div key={report.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
                <p className="text-sm text-gray-500">{report.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                report.status === 'approved' ? 'bg-green-100 text-green-800' :
                report.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {report.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Total Tests</p>
                <p className="text-lg font-semibold text-gray-900">{report.summary.totalTests}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-lg font-semibold text-gray-900">{report.summary.overallSuccessRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Critical Issues</p>
                <p className="text-lg font-semibold text-red-600">{report.summary.criticalIssues}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Execution Time</p>
                <p className="text-lg font-semibold text-gray-900">{report.summary.totalExecutionTime}s</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Recommendations</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {report.recommendations.slice(0, 3).map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                View Full Report
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Integration Testing</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive testing frameworks, integration validation, performance testing, and quality assurance
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'suites', label: 'Test Suites' },
              { id: 'integration', label: 'Integration Tests' },
              { id: 'performance', label: 'Performance Tests' },
              { id: 'ai', label: 'AI Tests' },
              { id: 'reports', label: 'Reports' }
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'suites' && renderTestSuites()}
            {activeTab === 'integration' && renderIntegration()}
            {activeTab === 'performance' && renderPerformance()}
            {activeTab === 'ai' && renderAI()}
            {activeTab === 'reports' && renderReports()}
          </div>
        )}
      </div>
    </div>
  );
} 