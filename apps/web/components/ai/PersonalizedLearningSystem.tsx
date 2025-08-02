// Personalized Learning System for CodePal
// Features: AI-powered personalized learning paths, skill assessments, adaptive content delivery, progress tracking

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration: number;
  modules: LearningModule[];
  prerequisites: string[];
  skills: string[];
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  lastAccessed: string;
  completionDate?: string;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'interactive' | 'quiz' | 'project' | 'reading';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: ModuleContent;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  timeSpent: number;
}

interface ModuleContent {
  videoUrl?: string;
  textContent?: string;
  interactiveElements?: InteractiveElement[];
  quizQuestions?: QuizQuestion[];
  projectRequirements?: ProjectRequirement[];
  resources: LearningResource[];
}

interface InteractiveElement {
  id: string;
  type: 'code_editor' | 'simulation' | 'drag_drop' | 'matching';
  title: string;
  description: string;
  content: any;
  completed: boolean;
}

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'coding' | 'fill_blank';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface ProjectRequirement {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  deliverables: string[];
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface LearningResource {
  id: string;
  title: string;
  type: 'documentation' | 'article' | 'video' | 'code_sample' | 'tool';
  url: string;
  description: string;
  tags: string[];
}

interface SkillAssessment {
  id: string;
  title: string;
  category: string;
  description: string;
  questions: AssessmentQuestion[];
  timeLimit: number;
  passingScore: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  completedAt?: string;
  timeSpent: number;
}

interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'coding' | 'scenario' | 'true_false';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  category: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  interests: string[];
  learningGoals: string[];
  preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  timeAvailability: number;
  currentSkills: UserSkill[];
  targetSkills: UserSkill[];
  learningHistory: LearningSession[];
}

interface UserSkill {
  name: string;
  category: string;
  proficiency: number;
  confidence: number;
  lastAssessed: string;
  improvement: number;
}

interface LearningSession {
  id: string;
  moduleId: string;
  startTime: string;
  endTime: string;
  duration: number;
  progress: number;
  score?: number;
  notes: string;
}

interface Recommendation {
  id: string;
  type: 'path' | 'module' | 'assessment' | 'resource';
  title: string;
  description: string;
  reason: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  estimatedImpact: number;
  category: string;
}

interface LearningAnalytics {
  totalTimeSpent: number;
  modulesCompleted: number;
  averageScore: number;
  learningStreak: number;
  skillImprovements: SkillImprovement[];
  learningPatterns: LearningPattern[];
  recommendations: Recommendation[];
}

interface SkillImprovement {
  skill: string;
  category: string;
  improvement: number;
  timeframe: string;
  confidence: number;
}

interface LearningPattern {
  pattern: string;
  description: string;
  frequency: number;
  effectiveness: number;
  recommendations: string[];
}

export default function PersonalizedLearningSystem() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'paths' | 'assessments' | 'profile' | 'analytics' | 'recommendations'>('overview');
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [learningAnalytics, setLearningAnalytics] = useState<LearningAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockLearningPaths: LearningPath[] = [
        {
          id: '1',
          title: 'React Development Mastery',
          description: 'Master React development from basics to advanced patterns and best practices',
          category: 'Frontend Development',
          difficulty: 'intermediate',
          estimatedDuration: 40,
          modules: [
            {
              id: '1',
              title: 'React Fundamentals',
              description: 'Learn the core concepts of React including components, props, and state',
              type: 'video',
              duration: 120,
              difficulty: 'beginner',
              content: {
                videoUrl: 'https://example.com/react-fundamentals',
                textContent: 'Introduction to React components and JSX syntax...',
                resources: [
                  {
                    id: '1',
                    title: 'React Official Documentation',
                    type: 'documentation',
                    url: 'https://react.dev',
                    description: 'Official React documentation and tutorials',
                    tags: ['react', 'documentation', 'official']
                  }
                ]
              },
              progress: 100,
              status: 'completed',
              score: 95,
              timeSpent: 125
            },
            {
              id: '2',
              title: 'Advanced State Management',
              description: 'Master Redux, Context API, and other state management solutions',
              type: 'interactive',
              duration: 180,
              difficulty: 'intermediate',
              content: {
                interactiveElements: [
                  {
                    id: '1',
                    type: 'code_editor',
                    title: 'Redux Store Implementation',
                    description: 'Build a Redux store with actions and reducers',
                    content: { /* interactive content */ },
                    completed: true
                  }
                ],
                resources: [
                  {
                    id: '2',
                    title: 'Redux Toolkit Guide',
                    type: 'article',
                    url: 'https://example.com/redux-toolkit',
                    description: 'Modern Redux development with Redux Toolkit',
                    tags: ['redux', 'state-management', 'toolkit']
                  }
                ]
              },
              progress: 75,
              status: 'in_progress',
              timeSpent: 135
            }
          ],
          prerequisites: ['JavaScript Fundamentals', 'HTML/CSS Basics'],
          skills: ['React', 'JavaScript', 'State Management', 'Component Design'],
          progress: 65,
          status: 'in_progress',
          lastAccessed: '2024-03-20T10:00:00Z'
        },
        {
          id: '2',
          title: 'Python Data Science',
          description: 'Learn Python for data analysis, machine learning, and scientific computing',
          category: 'Data Science',
          difficulty: 'advanced',
          estimatedDuration: 60,
          modules: [
            {
              id: '3',
              title: 'Python Basics for Data Science',
              description: 'Essential Python programming concepts for data analysis',
              type: 'interactive',
              duration: 90,
              difficulty: 'beginner',
              content: {
                interactiveElements: [
                  {
                    id: '2',
                    type: 'code_editor',
                    title: 'Data Manipulation with Pandas',
                    description: 'Practice data manipulation using pandas library',
                    content: { /* interactive content */ },
                    completed: false
                  }
                ],
                resources: [
                  {
                    id: '3',
                    title: 'Pandas Documentation',
                    type: 'documentation',
                    url: 'https://pandas.pydata.org',
                    description: 'Comprehensive pandas documentation and tutorials',
                    tags: ['python', 'pandas', 'data-analysis']
                  }
                ]
              },
              progress: 30,
              status: 'in_progress',
              timeSpent: 45
            }
          ],
          prerequisites: ['Python Basics', 'Mathematics Fundamentals'],
          skills: ['Python', 'Pandas', 'NumPy', 'Data Analysis', 'Machine Learning'],
          progress: 15,
          status: 'not_started',
          lastAccessed: '2024-03-19T15:30:00Z'
        }
      ];

      const mockSkillAssessments: SkillAssessment[] = [
        {
          id: '1',
          title: 'JavaScript Fundamentals Assessment',
          category: 'Programming',
          description: 'Test your knowledge of JavaScript fundamentals including variables, functions, and objects',
          questions: [
            {
              id: '1',
              type: 'multiple_choice',
              question: 'What is the difference between let, const, and var in JavaScript?',
              options: [
                'There is no difference',
                'let and const are block-scoped, var is function-scoped',
                'const is always mutable',
                'var is the most modern way to declare variables'
              ],
              correctAnswer: 'let and const are block-scoped, var is function-scoped',
              explanation: 'let and const are block-scoped variables introduced in ES6, while var is function-scoped and hoisted.',
              difficulty: 'medium',
              points: 10,
              category: 'Variables'
            },
            {
              id: '2',
              type: 'coding',
              question: 'Write a function that reverses a string without using the reverse() method',
              options: [],
              correctAnswer: 'function reverseString(str) { return str.split("").reverse().join(""); }',
              explanation: 'Split the string into an array, reverse it, then join it back together.',
              difficulty: 'easy',
              points: 15,
              category: 'Functions'
            }
          ],
          timeLimit: 1800,
          passingScore: 70,
          difficulty: 'intermediate',
          status: 'completed',
          score: 85,
          completedAt: '2024-03-18T14:30:00Z',
          timeSpent: 1200
        },
        {
          id: '2',
          title: 'React Component Patterns',
          category: 'Frontend Development',
          description: 'Assess your understanding of React component patterns and best practices',
          questions: [
            {
              id: '3',
              type: 'scenario',
              question: 'You need to create a reusable button component. What pattern would you use?',
              options: [
                'Create a simple function component with props',
                'Use a class component with state',
                'Create a compound component pattern',
                'Use a render prop pattern'
              ],
              correctAnswer: 'Create a simple function component with props',
              explanation: 'For a simple reusable button, a function component with props is the most appropriate pattern.',
              difficulty: 'easy',
              points: 10,
              category: 'Component Patterns'
            }
          ],
          timeLimit: 1200,
          passingScore: 75,
          difficulty: 'intermediate',
          status: 'not_started',
          timeSpent: 0
        }
      ];

      const mockUserProfile: UserProfile = {
        id: '1',
        name: 'John Developer',
        email: 'john@example.com',
        skillLevel: 'intermediate',
        interests: ['React', 'TypeScript', 'Node.js', 'Machine Learning'],
        learningGoals: ['Master React advanced patterns', 'Learn TypeScript', 'Build full-stack applications'],
        preferredLearningStyle: 'visual',
        timeAvailability: 10,
        currentSkills: [
          {
            name: 'JavaScript',
            category: 'Programming',
            proficiency: 85,
            confidence: 80,
            lastAssessed: '2024-03-18T14:30:00Z',
            improvement: 15
          },
          {
            name: 'React',
            category: 'Frontend Development',
            proficiency: 70,
            confidence: 75,
            lastAssessed: '2024-03-20T10:00:00Z',
            improvement: 25
          },
          {
            name: 'Python',
            category: 'Programming',
            proficiency: 60,
            confidence: 65,
            lastAssessed: '2024-03-15T09:00:00Z',
            improvement: 10
          }
        ],
        targetSkills: [
          {
            name: 'TypeScript',
            category: 'Programming',
            proficiency: 30,
            confidence: 40,
            lastAssessed: '2024-03-10T11:00:00Z',
            improvement: 30
          },
          {
            name: 'Node.js',
            category: 'Backend Development',
            proficiency: 45,
            confidence: 50,
            lastAssessed: '2024-03-12T16:00:00Z',
            improvement: 20
          }
        ],
        learningHistory: [
          {
            id: '1',
            moduleId: '1',
            startTime: '2024-03-20T09:00:00Z',
            endTime: '2024-03-20T10:30:00Z',
            duration: 5400,
            progress: 100,
            score: 95,
            notes: 'Great session! React fundamentals are now clear.'
          }
        ]
      };

      const mockLearningAnalytics: LearningAnalytics = {
        totalTimeSpent: 15600,
        modulesCompleted: 8,
        averageScore: 87,
        learningStreak: 12,
        skillImprovements: [
          {
            skill: 'React',
            category: 'Frontend Development',
            improvement: 25,
            timeframe: 'Last 30 days',
            confidence: 0.85
          },
          {
            skill: 'JavaScript',
            category: 'Programming',
            improvement: 15,
            timeframe: 'Last 30 days',
            confidence: 0.90
          }
        ],
        learningPatterns: [
          {
            pattern: 'Morning Learning Sessions',
            description: 'You learn most effectively in morning sessions between 9-11 AM',
            frequency: 8,
            effectiveness: 0.92,
            recommendations: ['Schedule important modules in the morning', 'Use this time for complex topics']
          },
          {
            pattern: 'Interactive Learning Preference',
            description: 'You perform better with interactive content and hands-on projects',
            frequency: 12,
            effectiveness: 0.88,
            recommendations: ['Focus on interactive modules', 'Practice with real projects']
          }
        ],
        recommendations: [
          {
            id: '1',
            type: 'path',
            title: 'Advanced React Patterns',
            description: 'Continue your React learning with advanced patterns and optimization techniques',
            reason: 'Based on your strong performance in React fundamentals',
            confidence: 0.92,
            priority: 'high',
            estimatedImpact: 85,
            category: 'Frontend Development'
          },
          {
            id: '2',
            type: 'assessment',
            title: 'TypeScript Fundamentals',
            description: 'Take this assessment to evaluate your TypeScript knowledge',
            reason: 'Aligns with your learning goal to master TypeScript',
            confidence: 0.78,
            priority: 'medium',
            estimatedImpact: 70,
            category: 'Programming'
          }
        ]
      };

      setLearningPaths(mockLearningPaths);
      setSkillAssessments(mockSkillAssessments);
      setUserProfile(mockUserProfile);
      setLearningAnalytics(mockLearningAnalytics);
      setLoading(false);
    }, 1000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'not_started': return 'text-gray-600 bg-gray-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Learning Streak</h3>
          <p className="text-3xl font-bold text-blue-600">{learningAnalytics?.learningStreak} days</p>
          <p className="text-sm text-blue-700">Current learning streak</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Modules Completed</h3>
          <p className="text-3xl font-bold text-green-600">{learningAnalytics?.modulesCompleted}</p>
          <p className="text-sm text-green-700">Total modules finished</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Average Score</h3>
          <p className="text-3xl font-bold text-purple-600">{learningAnalytics?.averageScore}%</p>
          <p className="text-sm text-purple-700">Overall performance</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900">Time Spent</h3>
          <p className="text-3xl font-bold text-orange-600">{Math.round((learningAnalytics?.totalTimeSpent || 0) / 3600)}h</p>
          <p className="text-sm text-orange-700">Total learning time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Learning Paths</h3>
          <div className="space-y-4">
            {learningPaths.filter(path => path.status === 'in_progress').map(path => (
              <div key={path.id} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{path.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                    {path.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{path.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${path.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">{path.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills</h3>
          <div className="space-y-4">
            {userProfile?.currentSkills.slice(0, 5).map(skill => (
              <div key={skill.name} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{skill.name}</p>
                  <p className="text-sm text-gray-600">{skill.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{skill.proficiency}%</p>
                  <p className="text-xs text-green-600">+{skill.improvement}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaths = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Paths</h3>
      <div className="space-y-6">
        {learningPaths.map(path => (
          <div key={path.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{path.title}</h4>
                <p className="text-sm text-gray-600">{path.description}</p>
                <p className="text-sm text-gray-500 mt-1">{path.category}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(path.difficulty)}`}>
                  {path.difficulty}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(path.status)}`}>
                  {path.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Progress</p>
                <p className="text-lg font-bold text-gray-900">{path.progress}%</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Duration</p>
                <p className="text-lg font-bold text-gray-900">{path.estimatedDuration}h</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Modules</p>
                <p className="text-lg font-bold text-gray-900">{path.modules.length}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Accessed</p>
                <p className="text-sm text-gray-900">{new Date(path.lastAccessed).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded mb-4">
              <h5 className="font-medium text-gray-900 mb-3">Modules ({path.modules.length})</h5>
              <div className="space-y-3">
                {path.modules.map(module => (
                  <div key={module.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{module.title}</p>
                      <p className="text-sm text-gray-600">{module.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500 capitalize">{module.type}</span>
                        <span className="text-xs text-gray-500">{module.duration}min</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                          {module.status.replace('_', ' ')}
                        </span>
                        {module.score && (
                          <span className="text-xs text-gray-500">{module.score}%</span>
                        )}
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full" 
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {path.skills.map(skill => (
                <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssessments = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Assessments</h3>
      <div className="space-y-6">
        {skillAssessments.map(assessment => (
          <div key={assessment.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{assessment.title}</h4>
                <p className="text-sm text-gray-600">{assessment.description}</p>
                <p className="text-sm text-gray-500 mt-1">{assessment.category}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(assessment.difficulty)}`}>
                  {assessment.difficulty}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assessment.status)}`}>
                  {assessment.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Questions</p>
                <p className="text-lg font-bold text-gray-900">{assessment.questions.length}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Time Limit</p>
                <p className="text-lg font-bold text-gray-900">{Math.round(assessment.timeLimit / 60)}min</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Passing Score</p>
                <p className="text-lg font-bold text-gray-900">{assessment.passingScore}%</p>
              </div>
              {assessment.score && (
                <div className="bg-white p-3 rounded">
                  <p className="text-sm font-medium text-gray-700">Your Score</p>
                  <p className="text-lg font-bold text-gray-900">{assessment.score}%</p>
                </div>
              )}
            </div>

            {assessment.status === 'completed' && (
              <div className="bg-white p-4 rounded mb-4">
                <h5 className="font-medium text-gray-900 mb-3">Assessment Results</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Score</p>
                    <p className="text-lg font-bold text-gray-900">{assessment.score}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Time Spent</p>
                    <p className="text-lg font-bold text-gray-900">{Math.round(assessment.timeSpent / 60)}min</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Completed</p>
                    <p className="text-sm text-gray-900">{assessment.completedAt ? new Date(assessment.completedAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Question Categories</h5>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(assessment.questions.map(q => q.category))).map(category => (
                  <span key={category} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Profile</h3>
      {userProfile && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Name</p>
                <p className="text-lg text-gray-900">{userProfile.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-lg text-gray-900">{userProfile.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Skill Level</p>
                <p className="text-lg text-gray-900 capitalize">{userProfile.skillLevel}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Learning Style</p>
                <p className="text-lg text-gray-900 capitalize">{userProfile.preferredLearningStyle}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Current Skills</h4>
            <div className="space-y-4">
              {userProfile.currentSkills.map(skill => (
                <div key={skill.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{skill.name}</p>
                    <p className="text-sm text-gray-600">{skill.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{skill.proficiency}%</p>
                    <p className="text-xs text-green-600">+{skill.improvement}% improvement</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Learning Goals</h4>
            <div className="space-y-2">
              {userProfile.learningGoals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <p className="text-gray-900">{goal}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Learning Sessions</h4>
            <div className="space-y-3">
              {userProfile.learningHistory.slice(0, 5).map(session => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">Module {session.moduleId}</p>
                    <p className="text-sm text-gray-600">{session.notes}</p>
                    <p className="text-xs text-gray-500">{new Date(session.startTime).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{Math.round(session.duration / 60)}min</p>
                    {session.score && (
                      <p className="text-sm text-gray-600">{session.score}% score</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Analytics</h3>
      {learningAnalytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Skill Improvements</h4>
              <div className="space-y-4">
                {learningAnalytics.skillImprovements.map(improvement => (
                  <div key={improvement.skill} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{improvement.skill}</p>
                      <p className="text-sm text-gray-600">{improvement.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+{improvement.improvement}%</p>
                      <p className="text-xs text-gray-500">{improvement.timeframe}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Learning Patterns</h4>
              <div className="space-y-4">
                {learningAnalytics.learningPatterns.map(pattern => (
                  <div key={pattern.pattern} className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-medium text-gray-900">{pattern.pattern}</h5>
                    <p className="text-sm text-gray-600 mb-2">{pattern.description}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-gray-500">{pattern.frequency} occurrences</span>
                      <span className="text-xs text-green-600">{Math.round(pattern.effectiveness * 100)}% effective</span>
                    </div>
                    <div className="space-y-1">
                      {pattern.recommendations.map((rec, index) => (
                        <p key={index} className="text-xs text-gray-600">• {rec}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderRecommendations = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
      {learningAnalytics && (
        <div className="space-y-6">
          {learningAnalytics.recommendations.map(recommendation => (
            <div key={recommendation.id} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{recommendation.title}</h4>
                  <p className="text-sm text-gray-600">{recommendation.description}</p>
                  <p className="text-sm text-gray-500 mt-1">{recommendation.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(recommendation.priority)}`}>
                    {recommendation.priority} priority
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                    {recommendation.type}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-3 rounded">
                  <p className="text-sm font-medium text-gray-700">Confidence</p>
                  <p className="text-lg font-bold text-gray-900">{Math.round(recommendation.confidence * 100)}%</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-sm font-medium text-gray-700">Estimated Impact</p>
                  <p className="text-lg font-bold text-gray-900">{recommendation.estimatedImpact}%</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-sm font-medium text-gray-700">Reason</p>
                  <p className="text-sm text-gray-900">{recommendation.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading learning data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Personalized Learning System</h1>
          <p className="text-gray-600 mt-2">
            AI-powered personalized learning paths, skill assessments, adaptive content delivery, and progress tracking
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'paths', label: 'Learning Paths' },
              { id: 'assessments', label: 'Assessments' },
              { id: 'profile', label: 'Profile' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'recommendations', label: 'Recommendations' }
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
          {activeTab === 'paths' && renderPaths()}
          {activeTab === 'assessments' && renderAssessments()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'recommendations' && renderRecommendations()}
        </div>
      </div>
    </div>
  );
} 