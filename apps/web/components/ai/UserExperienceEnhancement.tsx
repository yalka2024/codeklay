// User Experience Enhancement for CodePal
// Features: User feedback systems, usability improvements, accessibility features, user journey optimization

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface UserFeedback {
  id: string;
  userId: string;
  type: 'bug' | 'feature' | 'improvement' | 'complaint' | 'praise';
  category: 'ui' | 'ai' | 'performance' | 'accessibility' | 'general';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  rating: number; // 1-5
  tags: string[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: string;
}

interface UsabilityMetric {
  id: string;
  feature: string;
  metric: 'completion_rate' | 'error_rate' | 'time_to_complete' | 'satisfaction_score';
  value: number;
  target: number;
  trend: 'improving' | 'stable' | 'declining';
  period: 'daily' | 'weekly' | 'monthly';
  lastUpdated: string;
}

interface AccessibilityFeature {
  id: string;
  name: string;
  description: string;
  type: 'screen_reader' | 'keyboard_navigation' | 'color_contrast' | 'font_scaling' | 'voice_control';
  status: 'enabled' | 'disabled' | 'beta';
  compliance: 'wcag_2_1' | 'section_508' | 'aria';
  usageCount: number;
  userSatisfaction: number;
  lastUpdated: string;
}

interface UserJourney {
  id: string;
  name: string;
  description: string;
  steps: JourneyStep[];
  completionRate: number;
  averageTime: number; // seconds
  dropoffPoints: DropoffPoint[];
  optimization: JourneyOptimization;
  lastAnalyzed: string;
}

interface JourneyStep {
  id: string;
  name: string;
  description: string;
  order: number;
  completionRate: number;
  averageTime: number;
  errors: string[];
  suggestions: string[];
}

interface DropoffPoint {
  stepId: string;
  stepName: string;
  dropoffRate: number;
  reasons: string[];
  suggestions: string[];
}

interface JourneyOptimization {
  isOptimized: boolean;
  improvements: string[];
  impact: number; // percentage improvement
  implementationStatus: 'planned' | 'in_progress' | 'completed';
  lastOptimized: string;
}

interface UserSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number; // seconds
  features: string[];
  interactions: UserInteraction[];
  satisfaction: number;
  issues: string[];
}

interface UserInteraction {
  id: string;
  type: 'click' | 'scroll' | 'input' | 'navigation' | 'ai_interaction';
  element: string;
  timestamp: string;
  duration?: number;
  success: boolean;
  error?: string;
}

export default function UserExperienceEnhancement() {
  const { user } = useAuthContext();
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [metrics, setMetrics] = useState<UsabilityMetric[]>([]);
  const [accessibility, setAccessibility] = useState<AccessibilityFeature[]>([]);
  const [journeys, setJourneys] = useState<UserJourney[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'feedback' | 'metrics' | 'accessibility' | 'journeys' | 'sessions'>('overview');

  // Load UX data
  const loadUXData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockFeedback: UserFeedback[] = [
        {
          id: '1',
          userId: 'user1',
          type: 'improvement',
          category: 'ai',
          title: 'AI code completion could be faster',
          description: 'The AI suggestions take too long to appear, making coding less efficient.',
          priority: 'high',
          status: 'in_progress',
          rating: 4,
          tags: ['ai', 'performance', 'code-completion'],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T14:30:00Z',
          assignedTo: 'dev-team'
        }
      ];

      const mockMetrics: UsabilityMetric[] = [
        {
          id: '1',
          feature: 'AI Code Completion',
          metric: 'completion_rate',
          value: 87.5,
          target: 90,
          trend: 'improving',
          period: 'weekly',
          lastUpdated: '2024-01-15T12:00:00Z'
        }
      ];

      const mockAccessibility: AccessibilityFeature[] = [
        {
          id: '1',
          name: 'Screen Reader Support',
          description: 'Full NVDA and JAWS compatibility',
          type: 'screen_reader',
          status: 'enabled',
          compliance: 'wcag_2_1',
          usageCount: 1250,
          userSatisfaction: 4.2,
          lastUpdated: '2024-01-15T11:00:00Z'
        }
      ];

      const mockJourneys: UserJourney[] = [
        {
          id: '1',
          name: 'First Code Completion',
          description: 'User journey from signup to first AI code completion',
          steps: [
            {
              id: 'step1',
              name: 'Sign Up',
              description: 'User creates account',
              order: 1,
              completionRate: 95,
              averageTime: 120,
              errors: [],
              suggestions: ['Simplify form fields']
            }
          ],
          completionRate: 78,
          averageTime: 300,
          dropoffPoints: [],
          optimization: {
            isOptimized: false,
            improvements: ['Reduce onboarding steps'],
            impact: 15,
            implementationStatus: 'planned',
            lastOptimized: '2024-01-10T00:00:00Z'
          },
          lastAnalyzed: '2024-01-15T10:00:00Z'
        }
      ];

      setFeedback(mockFeedback);
      setMetrics(mockMetrics);
      setAccessibility(mockAccessibility);
      setJourneys(mockJourneys);
    } catch (error) {
      console.error('Error loading UX data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUXData();
  }, []);

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Open Feedback</h3>
          <p className="text-2xl font-bold text-blue-600">{feedback.filter(f => f.status === 'open').length}</p>
          <p className="text-xs text-gray-400">Pending review</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Satisfaction</h3>
          <p className="text-2xl font-bold text-green-600">
            {feedback.length > 0 ? (feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length).toFixed(1) : '0'} / 5
          </p>
          <p className="text-xs text-gray-400">User ratings</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Accessibility Users</h3>
          <p className="text-2xl font-bold text-purple-600">{accessibility.reduce((acc, a) => acc + a.usageCount, 0)}</p>
          <p className="text-xs text-gray-400">Active users</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Journey Completion</h3>
          <p className="text-2xl font-bold text-orange-600">
            {journeys.length > 0 ? Math.round(journeys.reduce((acc, j) => acc + j.completionRate, 0) / journeys.length) : 0}%
          </p>
          <p className="text-xs text-gray-400">Success rate</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Feedback</h3>
        {feedback.slice(0, 3).map(item => (
          <div key={item.id} className="border-b border-gray-100 last:border-b-0 py-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.priority === 'critical' ? 'bg-red-100 text-red-800' :
                item.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {item.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">User Feedback</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {feedback.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.status === 'open' ? 'bg-blue-100 text-blue-800' :
                item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                item.status === 'resolved' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status.replace('_', ' ')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="text-lg font-semibold text-gray-900">{item.rating}/5</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-lg font-semibold text-gray-900">{item.category}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                View Details
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Update Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Usability Metrics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metrics.map(metric => (
          <div key={metric.id} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">{metric.feature}</h3>
              <p className="text-sm text-gray-500">{metric.metric.replace('_', ' ')}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Current Value</p>
                <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Target</p>
                <p className="text-lg font-semibold text-gray-900">{metric.target}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 text-xs rounded-full ${
                metric.trend === 'improving' ? 'bg-green-100 text-green-800' :
                metric.trend === 'stable' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {metric.trend}
              </span>
              <span className="text-sm text-gray-500">{metric.period}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAccessibility = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Accessibility Features</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accessibility.map(feature => (
          <div key={feature.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                feature.status === 'enabled' ? 'bg-green-100 text-green-800' :
                feature.status === 'beta' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {feature.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Usage</p>
                <p className="text-lg font-semibold text-gray-900">{feature.usageCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Satisfaction</p>
                <p className="text-lg font-semibold text-gray-900">{feature.userSatisfaction}/5</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Compliance</p>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {feature.compliance.replace('_', ' ')}
              </span>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Configure
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                View Analytics
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderJourneys = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">User Journeys</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {journeys.map(journey => (
          <div key={journey.id} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">{journey.name}</h3>
              <p className="text-sm text-gray-500">{journey.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-lg font-semibold text-gray-900">{journey.completionRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Time</p>
                <p className="text-lg font-semibold text-gray-900">{journey.averageTime}s</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Steps</p>
              <div className="space-y-2">
                {journey.steps.map(step => (
                  <div key={step.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{step.name}</span>
                    <span className="font-medium">{step.completionRate}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Analyze
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Optimize
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">User Sessions</h2>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <p className="text-gray-500">Session analytics and user behavior tracking will be displayed here.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Experience Enhancement</h1>
          <p className="text-gray-600 mt-2">
            User feedback systems, usability improvements, accessibility features, and user journey optimization
          </p>
        </div>

        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'feedback', label: 'Feedback' },
              { id: 'metrics', label: 'Metrics' },
              { id: 'accessibility', label: 'Accessibility' },
              { id: 'journeys', label: 'Journeys' },
              { id: 'sessions', label: 'Sessions' }
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

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!isLoading && (
          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'feedback' && renderFeedback()}
            {activeTab === 'metrics' && renderMetrics()}
            {activeTab === 'accessibility' && renderAccessibility()}
            {activeTab === 'journeys' && renderJourneys()}
            {activeTab === 'sessions' && renderSessions()}
          </div>
        )}
      </div>
    </div>
  );
} 