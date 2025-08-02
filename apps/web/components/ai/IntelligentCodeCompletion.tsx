// Intelligent Code Completion for CodePal
// Features: Context-aware suggestions, multi-language support, learning from patterns

import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface CodeSuggestion {
  id: string;
  type: 'completion' | 'snippet' | 'import' | 'function' | 'variable' | 'class';
  text: string;
  description: string;
  confidence: number;
  context: string;
  language: string;
  category: string;
  usage: number;
  lastUsed?: string;
  tags: string[];
  metadata: {
    parameters?: string[];
    returnType?: string;
    complexity?: number;
    documentation?: string;
    examples?: string[];
  };
}

interface CompletionContext {
  filePath: string;
  language: string;
  framework?: string;
  currentLine: string;
  cursorPosition: number;
  surroundingCode: string;
  imports: string[];
  variables: string[];
  functions: string[];
  classes: string[];
  recentSnippets: string[];
  userPreferences: UserPreferences;
}

interface UserPreferences {
  suggestionStyle: 'minimal' | 'detailed' | 'contextual';
  autoComplete: boolean;
  snippetExpansion: boolean;
  learningEnabled: boolean;
  languagePreferences: string[];
  frameworkPreferences: string[];
  customSnippets: CustomSnippet[];
}

interface CustomSnippet {
  id: string;
  name: string;
  description: string;
  trigger: string;
  content: string;
  language: string;
  category: string;
  tags: string[];
  usage: number;
  createdAt: string;
  updatedAt: string;
}

interface LearningPattern {
  id: string;
  userId: string;
  pattern: string;
  context: string;
  language: string;
  frequency: number;
  confidence: number;
  lastUsed: string;
  createdAt: string;
}

interface CompletionStats {
  totalSuggestions: number;
  acceptedSuggestions: number;
  rejectionRate: number;
  averageConfidence: number;
  mostUsedSnippets: string[];
  languageDistribution: Record<string, number>;
  timeSavings: number; // in minutes
  accuracyImprovement: number;
}

export default function IntelligentCodeCompletion() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('editor');
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [customSnippets, setCustomSnippets] = useState<CustomSnippet[]>([]);
  const [learningPatterns, setLearningPatterns] = useState<LearningPattern[]>([]);
  const [completionStats, setCompletionStats] = useState<CompletionStats | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    suggestionStyle: 'contextual',
    autoComplete: true,
    snippetExpansion: true,
    learningEnabled: true,
    languagePreferences: ['javascript', 'typescript', 'python'],
    frameworkPreferences: ['react', 'node', 'express'],
    customSnippets: []
  });
  const [isLearning, setIsLearning] = useState(false);
  const [currentContext, setCurrentContext] = useState<CompletionContext | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<CodeSuggestion | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Load completion data
  useEffect(() => {
    loadCompletionData();
  }, []);

  const loadCompletionData = async () => {
    try {
      // Load suggestions
      const suggestionsResponse = await fetch('/api/ai/completion/suggestions');
      if (suggestionsResponse.ok) {
        const suggestionsData = await suggestionsResponse.json();
        setSuggestions(suggestionsData);
      }

      // Load custom snippets
      const snippetsResponse = await fetch('/api/ai/completion/snippets');
      if (snippetsResponse.ok) {
        const snippetsData = await snippetsResponse.json();
        setCustomSnippets(snippetsData);
      }

      // Load learning patterns
      const patternsResponse = await fetch('/api/ai/completion/patterns');
      if (patternsResponse.ok) {
        const patternsData = await patternsResponse.json();
        setLearningPatterns(patternsData);
      }

      // Load completion stats
      const statsResponse = await fetch('/api/ai/completion/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setCompletionStats(statsData);
      }
    } catch (error) {
      console.error('Failed to load completion data:', error);
    }
  };

  // Generate suggestions based on context
  const generateSuggestions = async (context: CompletionContext) => {
    try {
      const response = await fetch('/api/ai/completion/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context)
      });

      if (response.ok) {
        const newSuggestions = await response.json();
        setSuggestions(newSuggestions);
      }
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    }
  };

  // Handle editor content change
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    const position = e.target.selectionStart;
    setEditorContent(content);
    setCursorPosition(position);

    // Update context and generate suggestions
    const context: CompletionContext = {
      filePath: 'main.js',
      language: 'javascript',
      currentLine: getCurrentLine(content, position),
      cursorPosition: position,
      surroundingCode: getSurroundingCode(content, position),
      imports: extractImports(content),
      variables: extractVariables(content),
      functions: extractFunctions(content),
      classes: extractClasses(content),
      recentSnippets: [],
      userPreferences
    };

    setCurrentContext(context);
    generateSuggestions(context);
  };

  // Apply suggestion
  const applySuggestion = async (suggestion: CodeSuggestion) => {
    if (!editorRef.current) return;

    const before = editorContent.substring(0, cursorPosition);
    const after = editorContent.substring(cursorPosition);
    const newContent = before + suggestion.text + after;
    
    setEditorContent(newContent);
    setSelectedSuggestion(suggestion);

    // Log suggestion usage
    try {
      await fetch('/api/ai/completion/log-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggestionId: suggestion.id,
          accepted: true,
          context: currentContext
        })
      });
    } catch (error) {
      console.error('Failed to log suggestion usage:', error);
    }
  };

  // Create custom snippet
  const createCustomSnippet = async (snippetData: Omit<CustomSnippet, 'id' | 'createdAt' | 'updatedAt' | 'usage'>) => {
    try {
      const response = await fetch('/api/ai/completion/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snippetData)
      });

      if (response.ok) {
        const newSnippet = await response.json();
        setCustomSnippets(prev => [...prev, newSnippet]);
      }
    } catch (error) {
      console.error('Failed to create custom snippet:', error);
    }
  };

  // Start learning mode
  const startLearning = async () => {
    setIsLearning(true);
    try {
      const response = await fetch('/api/ai/completion/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          context: currentContext,
          preferences: userPreferences
        })
      });

      if (response.ok) {
        const learningResult = await response.json();
        setLearningPatterns(prev => [...prev, learningResult]);
      }
    } catch (error) {
      console.error('Failed to start learning:', error);
    } finally {
      setIsLearning(false);
    }
  };

  // Helper functions
  const getCurrentLine = (content: string, position: number): string => {
    const lines = content.split('\n');
    let currentPos = 0;
    for (let i = 0; i < lines.length; i++) {
      if (currentPos + lines[i].length >= position) {
        return lines[i];
      }
      currentPos += lines[i].length + 1; // +1 for newline
    }
    return '';
  };

  const getSurroundingCode = (content: string, position: number): string => {
    const start = Math.max(0, position - 200);
    const end = Math.min(content.length, position + 200);
    return content.substring(start, end);
  };

  const extractImports = (content: string): string[] => {
    const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
    const imports: string[] = [];
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    return imports;
  };

  const extractVariables = (content: string): string[] => {
    const varRegex = /(?:const|let|var)\s+(\w+)/g;
    const variables: string[] = [];
    let match;
    while ((match = varRegex.exec(content)) !== null) {
      variables.push(match[1]);
    }
    return variables;
  };

  const extractFunctions = (content: string): string[] => {
    const funcRegex = /function\s+(\w+)|(\w+)\s*[:=]\s*function|(\w+)\s*[:=]\s*\(/g;
    const functions: string[] = [];
    let match;
    while ((match = funcRegex.exec(content)) !== null) {
      const funcName = match[1] || match[2] || match[3];
      if (funcName) functions.push(funcName);
    }
    return functions;
  };

  const extractClasses = (content: string): string[] => {
    const classRegex = /class\s+(\w+)/g;
    const classes: string[] = [];
    let match;
    while ((match = classRegex.exec(content)) !== null) {
      classes.push(match[1]);
    }
    return classes;
  };

  const CodeEditor = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Intelligent Code Editor</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={startLearning}
            disabled={isLearning}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded"
          >
            {isLearning ? 'Learning...' : 'Learn Patterns'}
          </button>
          <button
            onClick={() => setActiveTab('snippets')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Custom Snippets
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Code Editor</label>
              <textarea
                ref={editorRef}
                value={editorContent}
                onChange={handleEditorChange}
                className="w-full h-96 p-4 bg-gray-800 border border-gray-600 rounded text-white font-mono text-sm resize-none"
                placeholder="Start typing to see intelligent suggestions..."
              />
            </div>
            
            {/* Current Context Info */}
            {currentContext && (
              <div className="bg-gray-800 rounded p-4">
                <h4 className="text-white font-semibold mb-2">Current Context</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Language:</span>
                    <span className="text-gray-300 ml-2">{currentContext.language}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Position:</span>
                    <span className="text-gray-300 ml-2">{currentContext.cursorPosition}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Variables:</span>
                    <span className="text-gray-300 ml-2">{currentContext.variables.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Functions:</span>
                    <span className="text-gray-300 ml-2">{currentContext.functions.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggestions Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <h4 className="text-white font-semibold mb-4">AI Suggestions</h4>
            
            {suggestions.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                <div className="text-4xl mb-2">🤖</div>
                <p>Start typing to see intelligent suggestions</p>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.slice(0, 5).map(suggestion => (
                  <div
                    key={suggestion.id}
                    className="p-3 bg-white bg-opacity-5 rounded-lg hover:bg-white hover:bg-opacity-10 cursor-pointer border border-transparent hover:border-blue-400"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{suggestion.text}</span>
                      <span className="text-gray-400 text-xs">{suggestion.confidence}%</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{suggestion.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">{suggestion.category}</span>
                      <span className="text-gray-500 text-xs">Used {suggestion.usage} times</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const CustomSnippets = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Custom Snippets</h3>
        <button
          onClick={() => setActiveTab('create-snippet')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Create Snippet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customSnippets.map(snippet => (
          <div
            key={snippet.id}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-white font-semibold">{snippet.name}</h4>
                <p className="text-gray-400 text-sm">{snippet.description}</p>
              </div>
              <span className="px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded">
                {snippet.language}
              </span>
            </div>

            <div className="mb-4">
              <div className="bg-gray-800 rounded p-3">
                <pre className="text-gray-300 text-sm overflow-x-auto">
                  <code>{snippet.content}</code>
                </pre>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Trigger:</span>
                <span className="text-gray-300 font-mono">{snippet.trigger}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Usage:</span>
                <span className="text-gray-300">{snippet.usage} times</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Category:</span>
                <span className="text-gray-300">{snippet.category}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {snippet.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => {
                  // Apply snippet to editor
                  if (editorRef.current) {
                    const newContent = editorContent + '\n' + snippet.content;
                    setEditorContent(newContent);
                  }
                }}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
              >
                Use
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const LearningPatterns = () => (
    <div className="space-y-6">
      <h3 className="text-white font-semibold">Learning Patterns</h3>

      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
        <div className="space-y-4">
          {learningPatterns.map(pattern => (
            <div
              key={pattern.id}
              className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg"
            >
              <div>
                <div className="text-gray-300 font-medium">{pattern.pattern}</div>
                <div className="text-gray-400 text-sm">{pattern.context}</div>
              </div>
              <div className="text-right">
                <div className="text-gray-300 text-sm">{pattern.language}</div>
                <div className="text-gray-400 text-xs">
                  {pattern.frequency} times • {pattern.confidence}% confidence
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CompletionStats = () => (
    <div className="space-y-6">
      <h3 className="text-white font-semibold">Completion Statistics</h3>

      {completionStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <h4 className="text-white font-semibold mb-2">Total Suggestions</h4>
            <div className="text-3xl font-bold text-blue-400">{completionStats.totalSuggestions}</div>
            <p className="text-gray-400 text-sm">Generated suggestions</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <h4 className="text-white font-semibold mb-2">Accepted</h4>
            <div className="text-3xl font-bold text-green-400">{completionStats.acceptedSuggestions}</div>
            <p className="text-gray-400 text-sm">Used suggestions</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <h4 className="text-white font-semibold mb-2">Time Saved</h4>
            <div className="text-3xl font-bold text-purple-400">{completionStats.timeSavings}m</div>
            <p className="text-gray-400 text-sm">Development time saved</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <h4 className="text-white font-semibold mb-2">Accuracy</h4>
            <div className="text-3xl font-bold text-orange-400">{completionStats.averageConfidence}%</div>
            <p className="text-gray-400 text-sm">Average confidence</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Intelligent Code Completion</h1>
        <p className="text-gray-300">Context-aware code suggestions with AI-powered learning and customization</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-2 mb-8">
        <div className="flex space-x-2">
          {[
            { id: 'editor', label: 'Editor', icon: '💻' },
            { id: 'snippets', label: 'Snippets', icon: '📝' },
            { id: 'patterns', label: 'Learning', icon: '🧠' },
            { id: 'stats', label: 'Statistics', icon: '📊' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
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
        {activeTab === 'editor' && <CodeEditor />}
        {activeTab === 'snippets' && <CustomSnippets />}
        {activeTab === 'patterns' && <LearningPatterns />}
        {activeTab === 'stats' && <CompletionStats />}
        {activeTab === 'settings' && (
          <div className="text-gray-300">
            Completion settings and preferences will be implemented here.
          </div>
        )}
      </div>
    </div>
  );
} 