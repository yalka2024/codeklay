import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { CodePalButton } from '@codepal/ui';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  progress: number;
  estimatedDuration: number;
  modules: LearningModule[];
}

interface LearningModule {
  id: string;
  title: string;
  type: string;
  difficulty: number;
  estimatedTime: number;
  completed: boolean;
}

interface SkillAssessment {
  language: string;
  level: string;
  score: number;
  areas: string[];
}

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState('paths');
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [skillAssessment, setSkillAssessment] = useState<SkillAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch learning data from API
    const fetchLearningData = async () => {
      try {
        // Simulated data
        setLearningPaths([
          {
            id: '1',
            title: 'Advanced TypeScript Mastery',
            description: 'Master advanced TypeScript concepts and patterns',
            difficulty: 'intermediate',
            progress: 75,
            estimatedDuration: 20,
            modules: [
              { id: '1', title: 'Generics Deep Dive', type: 'tutorial', difficulty: 3, estimatedTime: 45, completed: true },
              { id: '2', title: 'Advanced Types', type: 'tutorial', difficulty: 4, estimatedTime: 60, completed: true },
              { id: '3', title: 'Design Patterns', type: 'exercise', difficulty: 4, estimatedTime: 90, completed: false },
              { id: '4', title: 'Performance Optimization', type: 'project', difficulty: 5, estimatedTime: 120, completed: false }
            ]
          },
          {
            id: '2',
            title: 'React Performance Optimization',
            description: 'Learn to build high-performance React applications',
            difficulty: 'advanced',
            progress: 30,
            estimatedDuration: 15,
            modules: [
              { id: '5', title: 'React.memo and useMemo', type: 'tutorial', difficulty: 3, estimatedTime: 45, completed: true },
              { id: '6', title: 'Code Splitting', type: 'tutorial', difficulty: 4, estimatedTime: 60, completed: false },
              { id: '7', title: 'Bundle Analysis', type: 'exercise', difficulty: 4, estimatedTime: 75, completed: false }
            ]
          }
        ]);

        setSkillAssessment([
          { language: 'TypeScript', level: 'Intermediate', score: 78, areas: ['Generics', 'Advanced Types'] },
          { language: 'React', level: 'Advanced', score: 85, areas: ['Performance', 'Hooks'] },
          { language: 'Python', level: 'Beginner', score: 45, areas: ['Basic Syntax', 'Data Structures'] }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch learning data:', error);
        setLoading(false);
      }
    };

    fetchLearningData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading learning engine...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Head>
        <title>AI Learning Engine - CodePal</title>
        <meta name="description" content="Personalized AI-powered learning experience" />
      </Head>

      {/* Header */}
      <header className="p-6 bg-black bg-opacity-20 backdrop-blur-sm border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">🤖 AI Learning Engine</h1>
            <span className="text-blue-300 text-sm">Personalized learning paths</span>
          </div>
          <nav className="flex items-center space-x-4">
            <CodePalButton onClick={() => window.location.href = '/dashboard'} className="bg-gray-700 hover:bg-gray-800">
              Dashboard
            </CodePalButton>
            <CodePalButton onClick={() => setActiveTab('assessment')} className="bg-green-600 hover:bg-green-700">
              Take Assessment
            </CodePalButton>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'paths', label: 'Learning Paths', icon: '📚' },
              { id: 'assessment', label: 'Skill Assessment', icon: '🎯' },
              { id: 'tutorials', label: 'Tutorials', icon: '📖' },
              { id: 'exercises', label: 'Exercises', icon: '💻' },
              { id: 'progress', label: 'Progress', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          {activeTab === 'paths' && <LearningPathsTab paths={learningPaths} />}
          {activeTab === 'assessment' && <SkillAssessmentTab assessment={skillAssessment} />}
          {activeTab === 'tutorials' && <TutorialsTab />}
          {activeTab === 'exercises' && <ExercisesTab />}
          {activeTab === 'progress' && <ProgressTab />}
        </div>
      </main>
    </div>
  );
}

function LearningPathsTab({ paths }: { paths: LearningPath[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Your Learning Paths</h2>
        <CodePalButton onClick={() => console.log('Create new path')} className="bg-blue-600 hover:bg-blue-700">
          Create New Path
        </CodePalButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paths.map((path) => (
          <div key={path.id} className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{path.title}</h3>
                <p className="text-gray-300 text-sm mb-2">{path.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-blue-300">Difficulty: {path.difficulty}</span>
                  <span className="text-green-300">{path.estimatedDuration}h</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                path.difficulty === 'beginner' ? 'bg-green-600' :
                path.difficulty === 'intermediate' ? 'bg-yellow-600' : 'bg-red-600'
              }`}>
                {path.difficulty}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Progress</span>
                <span>{path.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${path.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Modules */}
            <div className="space-y-2 mb-4">
              {path.modules.map((module) => (
                <div key={module.id} className="flex items-center justify-between p-2 bg-white bg-opacity-5 rounded">
                  <div className="flex items-center space-x-2">
                    <span className={`w-4 h-4 rounded-full ${
                      module.completed ? 'bg-green-500' : 'bg-gray-500'
                    }`}></span>
                    <span className="text-white text-sm">{module.title}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-300">
                    <span>{module.type}</span>
                    <span>{module.estimatedTime}m</span>
                  </div>
                </div>
              ))}
            </div>

            <CodePalButton 
              onClick={() => console.log('Continue path', path.id)} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Continue Learning
            </CodePalButton>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillAssessmentTab({ assessment }: { assessment: SkillAssessment[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Skill Assessment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessment.map((skill) => (
          <div key={skill.language} className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">{skill.language}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                skill.score >= 80 ? 'bg-green-600' :
                skill.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
              }`}>
                {skill.level}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Score</span>
                <span>{skill.score}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${skill.score}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-300">Areas to improve:</p>
              {skill.areas.map((area, index) => (
                <div key={index} className="text-xs text-red-300 bg-red-900 bg-opacity-20 px-2 py-1 rounded">
                  {area}
                </div>
              ))}
            </div>

            <CodePalButton 
              onClick={() => console.log('Retake assessment', skill.language)} 
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
            >
              Retake Assessment
            </CodePalButton>
          </div>
        ))}
      </div>

      <div className="bg-blue-900 bg-opacity-20 rounded-xl p-6 border border-blue-500 border-opacity-20">
        <h3 className="text-xl font-semibold text-white mb-2">AI Recommendations</h3>
        <p className="text-gray-300 mb-4">
          Based on your assessment, we recommend focusing on TypeScript generics and React performance optimization.
        </p>
        <CodePalButton onClick={() => console.log('Generate recommendations')} className="bg-blue-600 hover:bg-blue-700">
          Generate New Recommendations
        </CodePalButton>
      </div>
    </div>
  );
}

function TutorialsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Interactive Tutorials</h2>
      <p className="text-gray-300">This tab will contain interactive tutorials and learning materials.</p>
      <CodePalButton onClick={() => console.log('Browse tutorials')} className="bg-blue-600 hover:bg-blue-700">
        Browse Tutorials
      </CodePalButton>
    </div>
  );
}

function ExercisesTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Practice Exercises</h2>
      <p className="text-gray-300">This tab will contain coding exercises and challenges.</p>
      <CodePalButton onClick={() => console.log('Start exercises')} className="bg-green-600 hover:bg-green-700">
        Start Exercises
      </CodePalButton>
    </div>
  );
}

function ProgressTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Learning Progress</h2>
      <p className="text-gray-300">This tab will contain detailed progress analytics and achievements.</p>
      <CodePalButton onClick={() => console.log('View progress')} className="bg-purple-600 hover:bg-purple-700">
        View Detailed Progress
      </CodePalButton>
    </div>
  );
} 