// Intelligent Code Completion & Generation for CodePal
// Features: AI-powered code completion, intelligent code generation, context-aware suggestions, multi-language support

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface CodeCompletion {
  id: string;
  type: 'snippet' | 'function' | 'class' | 'import' | 'variable' | 'method';
  language: string;
  context: string;
  suggestion: string;
  confidence: number;
  relevance: number;
  usage: number;
  tags: string[];
  timestamp: string;
  metadata: CompletionMetadata;
}

interface CompletionMetadata {
  framework?: string;
  library?: string;
  pattern?: string;
  complexity: 'simple' | 'medium' | 'complex';
  performance: 'low' | 'medium' | 'high';
  security: 'safe' | 'warning' | 'unsafe';
}

interface CodeGeneration {
  id: string;
  prompt: string;
  language: string;
  generatedCode: string;
  status: 'generating' | 'completed' | 'failed';
  quality: number;
  complexity: number;
  lines: number;
  tokens: number;
  generationTime: number;
  timestamp: string;
  feedback: GenerationFeedback;
}

interface GenerationFeedback {
  rating: number;
  comments: string;
  improvements: string[];
  accepted: boolean;
  timestamp: string;
}

interface CodeSuggestion {
  id: string;
  type: 'completion' | 'refactor' | 'optimization' | 'pattern' | 'best_practice';
  title: string;
  description: string;
  code: string;
  language: string;
  context: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  tags: string[];
  examples: CodeExample[];
}

interface CodeExample {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

interface LanguageModel {
  id: string;
  name: string;
  language: string;
  version: string;
  status: 'active' | 'training' | 'deprecated';
  accuracy: number;
  responseTime: number;
  contextWindow: number;
  trainingData: string;
  capabilities: string[];
  lastUpdated: string;
}

interface CompletionStats {
  totalCompletions: number;
  acceptanceRate: number;
  averageConfidence: number;
  popularLanguages: string[];
  topPatterns: string[];
  userSatisfaction: number;
}

export default function IntelligentCodeCompletionGeneration() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'completions' | 'generation' | 'suggestions' | 'models' | 'stats'>('overview');
  const [codeCompletions, setCodeCompletions] = useState<CodeCompletion[]>([]);
  const [codeGenerations, setCodeGenerations] = useState<CodeGeneration[]>([]);
  const [codeSuggestions, setCodeSuggestions] = useState<CodeSuggestion[]>([]);
  const [languageModels, setLanguageModels] = useState<LanguageModel[]>([]);
  const [completionStats, setCompletionStats] = useState<CompletionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompletionData();
  }, []);

  const loadCompletionData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockCodeCompletions: CodeCompletion[] = [
        {
          id: '1',
          type: 'function',
          language: 'TypeScript',
          context: 'React component with user data',
          suggestion: 'const handleUserUpdate = (userId: string, data: Partial<User>) => {\n  return api.put(`/users/${userId}`, data);\n};',
          confidence: 0.94,
          relevance: 0.89,
          usage: 156,
          tags: ['react', 'api', 'typescript', 'function'],
          timestamp: '2024-03-20T10:00:00Z',
          metadata: {
            framework: 'React',
            library: 'axios',
            pattern: 'api-call',
            complexity: 'medium',
            performance: 'medium',
            security: 'safe'
          }
        },
        {
          id: '2',
          type: 'snippet',
          language: 'JavaScript',
          context: 'Array manipulation with filtering',
          suggestion: 'const filteredItems = items.filter(item => item.active && item.category === selectedCategory);',
          confidence: 0.87,
          relevance: 0.92,
          usage: 89,
          tags: ['javascript', 'array', 'filter', 'functional'],
          timestamp: '2024-03-20T09:45:00Z',
          metadata: {
            pattern: 'array-filter',
            complexity: 'simple',
            performance: 'high',
            security: 'safe'
          }
        },
        {
          id: '3',
          type: 'class',
          language: 'Python',
          context: 'Data processing with validation',
          suggestion: 'class DataProcessor:\n    def __init__(self, config: dict):\n        self.config = config\n        self.validator = DataValidator()\n    \n    def process(self, data: list) -> list:\n        return [item for item in data if self.validator.validate(item)]',
          confidence: 0.91,
          relevance: 0.85,
          usage: 67,
          tags: ['python', 'class', 'validation', 'data-processing'],
          timestamp: '2024-03-20T09:30:00Z',
          metadata: {
            pattern: 'data-processor',
            complexity: 'complex',
            performance: 'medium',
            security: 'safe'
          }
        }
      ];

      const mockCodeGenerations: CodeGeneration[] = [
        {
          id: '1',
          prompt: 'Create a React hook for managing form state with validation',
          language: 'TypeScript',
          generatedCode: `import { useState, useCallback } from 'react';

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
}

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit
}: UseFormOptions<T>): FormState<T> & {
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: () => void;
  reset: () => void;
} {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validate = useCallback((values: T) => {
    if (!validationSchema) return {};
    return validationSchema(values);
  }, [validationSchema]);

  const handleChange = useCallback((field: keyof T) => (value: any) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    
    const newErrors = validate(newValues);
    setErrors(newErrors);
  }, [values, validate]);

  const handleBlur = useCallback((field: keyof T) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = useCallback(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    if (Object.keys(newErrors).length === 0 && onSubmit) {
      onSubmit(values);
    }
  }, [values, validate, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  };
}`,
          status: 'completed',
          quality: 92,
          complexity: 4,
          lines: 65,
          tokens: 1200,
          generationTime: 3.2,
          timestamp: '2024-03-20T10:00:00Z',
          feedback: {
            rating: 4.5,
            comments: 'Excellent hook implementation with proper TypeScript support and validation',
            improvements: ['Add async validation support', 'Include field-level validation'],
            accepted: true,
            timestamp: '2024-03-20T10:05:00Z'
          }
        },
        {
          id: '2',
          prompt: 'Generate a Python function to parse and validate JSON configuration files',
          language: 'Python',
          generatedCode: `import json
import os
from typing import Dict, Any, Optional
from pathlib import Path

class ConfigValidator:
    def __init__(self, required_fields: list, optional_fields: list = None):
        self.required_fields = required_fields
        self.optional_fields = optional_fields or []
    
    def validate(self, config: Dict[str, Any]) -> tuple[bool, list[str]]:
        errors = []
        
        # Check required fields
        for field in self.required_fields:
            if field not in config:
                errors.append(f"Missing required field: {field}")
            elif config[field] is None:
                errors.append(f"Required field '{field}' cannot be null")
        
        return len(errors) == 0, errors

def parse_config_file(
    file_path: str,
    validator: Optional[ConfigValidator] = None,
    default_config: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Parse and validate a JSON configuration file.
    
    Args:
        file_path: Path to the JSON configuration file
        validator: Optional validator instance
        default_config: Optional default configuration to merge
    
    Returns:
        Parsed and validated configuration dictionary
    
    Raises:
        FileNotFoundError: If the configuration file doesn't exist
        json.JSONDecodeError: If the file contains invalid JSON
        ValueError: If validation fails
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Configuration file not found: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
    except json.JSONDecodeError as e:
        raise json.JSONDecodeError(f"Invalid JSON in config file: {e.msg}", e.doc, e.pos)
    
    # Merge with default config if provided
    if default_config:
        config = {**default_config, **config}
    
    # Validate if validator is provided
    if validator:
        is_valid, errors = validator.validate(config)
        if not is_valid:
            raise ValueError(f"Configuration validation failed: {'; '.join(errors)}")
    
    return config

# Example usage
if __name__ == "__main__":
    # Define validator
    validator = ConfigValidator(
        required_fields=['database_url', 'api_key', 'debug'],
        optional_fields=['timeout', 'retry_count']
    )
    
    # Parse config
    try:
        config = parse_config_file(
            'config.json',
            validator=validator,
            default_config={'timeout': 30, 'retry_count': 3}
        )
        print("Configuration loaded successfully:", config)
    except Exception as e:
        print(f"Error loading configuration: {e}")`,
          status: 'completed',
          quality: 88,
          complexity: 3,
          lines: 85,
          tokens: 1800,
          generationTime: 4.1,
          timestamp: '2024-03-20T09:45:00Z',
          feedback: {
            rating: 4.2,
            comments: 'Good implementation with proper error handling and validation',
            improvements: ['Add schema validation', 'Support YAML format'],
            accepted: true,
            timestamp: '2024-03-20T09:50:00Z'
          }
        }
      ];

      const mockCodeSuggestions: CodeSuggestion[] = [
        {
          id: '1',
          type: 'pattern',
          title: 'React Custom Hook Pattern',
          description: 'Extract reusable logic into custom hooks for better code organization and reusability',
          code: 'const useCustomHook = (dependencies) => {\n  // Hook logic here\n  return { data, loading, error };\n};',
          language: 'TypeScript',
          context: 'React component with repeated logic',
          confidence: 0.92,
          impact: 'high',
          effort: 'medium',
          tags: ['react', 'hooks', 'typescript', 'pattern'],
          examples: [
            {
              id: '1',
              title: 'API Data Hook',
              description: 'Custom hook for fetching API data with loading and error states',
              code: 'const useApiData = (url: string) => {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n  \n  useEffect(() => {\n    fetch(url)\n      .then(res => res.json())\n      .then(setData)\n      .catch(setError)\n      .finally(() => setLoading(false));\n  }, [url]);\n  \n  return { data, loading, error };\n};',
              language: 'TypeScript',
              complexity: 'intermediate',
              tags: ['api', 'fetch', 'state-management']
            }
          ]
        },
        {
          id: '2',
          type: 'optimization',
          title: 'Memoization for Performance',
          description: 'Use React.memo and useMemo to prevent unnecessary re-renders and expensive calculations',
          code: 'const MemoizedComponent = React.memo(({ data }) => {\n  const processedData = useMemo(() => processData(data), [data]);\n  return <div>{processedData}</div>;\n});',
          language: 'TypeScript',
          context: 'Component with expensive calculations',
          confidence: 0.89,
          impact: 'high',
          effort: 'low',
          tags: ['react', 'performance', 'optimization', 'memoization'],
          examples: [
            {
              id: '2',
              title: 'Expensive Calculation Memoization',
              description: 'Memoize expensive calculations to improve performance',
              code: 'const ExpensiveComponent = ({ items }) => {\n  const processedItems = useMemo(() => {\n    return items.map(item => {\n      // Expensive processing here\n      return processItem(item);\n    });\n  }, [items]);\n  \n  return <div>{processedItems.map(item => <Item key={item.id} {...item} />)}</div>;\n};',
              language: 'TypeScript',
              complexity: 'intermediate',
              tags: ['performance', 'usememo', 'optimization']
            }
          ]
        }
      ];

      const mockLanguageModels: LanguageModel[] = [
        {
          id: '1',
          name: 'TypeScript Completion Model',
          language: 'TypeScript',
          version: '2.1.0',
          status: 'active',
          accuracy: 0.94,
          responseTime: 0.8,
          contextWindow: 8192,
          trainingData: '2.5M TypeScript files',
          capabilities: ['function completion', 'import suggestions', 'type inference', 'React patterns'],
          lastUpdated: '2024-03-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Python Generation Model',
          language: 'Python',
          version: '1.8.0',
          status: 'active',
          accuracy: 0.91,
          responseTime: 1.2,
          contextWindow: 4096,
          trainingData: '1.8M Python files',
          capabilities: ['function generation', 'class creation', 'data processing', 'API patterns'],
          lastUpdated: '2024-03-10T00:00:00Z'
        },
        {
          id: '3',
          name: 'JavaScript Snippet Model',
          language: 'JavaScript',
          version: '1.6.0',
          status: 'active',
          accuracy: 0.89,
          responseTime: 0.6,
          contextWindow: 6144,
          trainingData: '3.2M JavaScript files',
          capabilities: ['snippet completion', 'ES6+ features', 'async patterns', 'DOM manipulation'],
          lastUpdated: '2024-03-05T00:00:00Z'
        }
      ];

      const mockCompletionStats: CompletionStats = {
        totalCompletions: 15420,
        acceptanceRate: 0.87,
        averageConfidence: 0.89,
        popularLanguages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go'],
        topPatterns: ['api-call', 'array-filter', 'react-hook', 'data-processor', 'validation'],
        userSatisfaction: 4.6
      };

      setCodeCompletions(mockCodeCompletions);
      setCodeGenerations(mockCodeGenerations);
      setCodeSuggestions(mockCodeSuggestions);
      setLanguageModels(mockLanguageModels);
      setCompletionStats(mockCompletionStats);
      setLoading(false);
    }, 1000);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.8) return 'text-yellow-600';
    if (confidence >= 0.7) return 'text-orange-600';
    return 'text-red-600';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'generating': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Total Completions</h3>
          <p className="text-3xl font-bold text-blue-600">{completionStats?.totalCompletions.toLocaleString()}</p>
          <p className="text-sm text-blue-700">Code completions generated</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Acceptance Rate</h3>
          <p className="text-3xl font-bold text-green-600">{Math.round((completionStats?.acceptanceRate || 0) * 100)}%</p>
          <p className="text-sm text-green-700">User acceptance rate</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Avg Confidence</h3>
          <p className="text-3xl font-bold text-purple-600">{Math.round((completionStats?.averageConfidence || 0) * 100)}%</p>
          <p className="text-sm text-purple-700">Average confidence score</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900">Satisfaction</h3>
          <p className="text-3xl font-bold text-orange-600">{completionStats?.userSatisfaction}/5</p>
          <p className="text-sm text-orange-700">User satisfaction rating</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Languages</h3>
          <div className="space-y-3">
            {completionStats?.popularLanguages.map((language, index) => (
              <div key={language} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{language}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${100 - (index * 15)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{100 - (index * 15)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Patterns</h3>
          <div className="flex flex-wrap gap-2">
            {completionStats?.topPatterns.map(pattern => (
              <span key={pattern} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {pattern}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompletions = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Completions</h3>
      <div className="space-y-6">
        {codeCompletions.map(completion => (
          <div key={completion.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{completion.type} Completion</h4>
                <p className="text-sm text-gray-600">{completion.language} • {completion.context}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(completion.confidence)}`}>
                  {Math.round(completion.confidence * 100)}% confidence
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                  {completion.usage} uses
                </span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Suggested Code</h5>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                <code>{completion.suggestion}</code>
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Relevance</p>
                <p className="text-lg font-bold text-gray-900">{Math.round(completion.relevance * 100)}%</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Complexity</p>
                <p className="text-lg font-bold text-gray-900 capitalize">{completion.metadata.complexity}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Performance</p>
                <p className="text-lg font-bold text-gray-900 capitalize">{completion.metadata.performance}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Security</p>
                <p className="text-lg font-bold text-gray-900 capitalize">{completion.metadata.security}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {completion.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGeneration = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Generation</h3>
      <div className="space-y-6">
        {codeGenerations.map(generation => (
          <div key={generation.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{generation.language} Generation</h4>
                <p className="text-sm text-gray-600">{generation.prompt}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(generation.status)}`}>
                  {generation.status}
                </span>
                <span className="text-sm text-gray-500">{generation.generationTime}s</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Quality</p>
                <p className="text-lg font-bold text-gray-900">{generation.quality}/100</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Complexity</p>
                <p className="text-lg font-bold text-gray-900">{generation.complexity}/5</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Lines</p>
                <p className="text-lg font-bold text-gray-900">{generation.lines}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Tokens</p>
                <p className="text-lg font-bold text-gray-900">{generation.tokens}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Generated Code</h5>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto max-h-64 overflow-y-auto">
                <code>{generation.generatedCode}</code>
              </pre>
            </div>

            {generation.feedback && (
              <div className="bg-white p-4 rounded">
                <h5 className="font-medium text-gray-900 mb-3">User Feedback</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Rating:</span>
                    <span className="text-sm text-gray-900">{generation.feedback.rating}/5</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Comments:</span>
                    <p className="text-sm text-gray-900 mt-1">{generation.feedback.comments}</p>
                  </div>
                  {generation.feedback.improvements.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Improvements:</span>
                      <ul className="text-sm text-gray-900 mt-1 list-disc list-inside">
                        {generation.feedback.improvements.map((improvement, index) => (
                          <li key={index}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSuggestions = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Suggestions</h3>
      <div className="space-y-6">
        {codeSuggestions.map(suggestion => (
          <div key={suggestion.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{suggestion.title}</h4>
                <p className="text-sm text-gray-600">{suggestion.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactColor(suggestion.impact)}`}>
                  {suggestion.impact} impact
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                  {suggestion.effort} effort
                </span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Pattern Code</h5>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                <code>{suggestion.code}</code>
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Confidence</p>
                <p className="text-lg font-bold text-gray-900">{Math.round(suggestion.confidence * 100)}%</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Language</p>
                <p className="text-lg font-bold text-gray-900">{suggestion.language}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Examples</p>
                <p className="text-lg font-bold text-gray-900">{suggestion.examples.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Examples</h5>
              <div className="space-y-4">
                {suggestion.examples.map(example => (
                  <div key={example.id} className="border-l-4 border-blue-500 pl-4">
                    <h6 className="font-medium text-gray-900">{example.title}</h6>
                    <p className="text-sm text-gray-600 mb-2">{example.description}</p>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                      <code>{example.code}</code>
                    </pre>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-500 capitalize">{example.complexity}</span>
                      {example.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
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

  const renderModels = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Models</h3>
      <div className="space-y-6">
        {languageModels.map(model => (
          <div key={model.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{model.name}</h4>
                <p className="text-sm text-gray-600">v{model.version} • {model.language}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${model.status === 'active' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'}`}>
                  {model.status}
                </span>
                <span className="text-sm text-gray-500">{Math.round(model.accuracy * 100)}% accuracy</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Response Time</p>
                <p className="text-lg font-bold text-gray-900">{model.responseTime}s</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Context Window</p>
                <p className="text-lg font-bold text-gray-900">{model.contextWindow.toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Training Data</p>
                <p className="text-sm text-gray-900">{model.trainingData}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Updated</p>
                <p className="text-sm text-gray-900">{new Date(model.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Capabilities ({model.capabilities.length})</h5>
              <div className="flex flex-wrap gap-2">
                {model.capabilities.map(capability => (
                  <span key={capability} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {capability}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Completions</span>
              <span className="text-lg font-bold text-gray-900">{completionStats?.totalCompletions.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Acceptance Rate</span>
              <span className="text-lg font-bold text-gray-900">{Math.round((completionStats?.acceptanceRate || 0) * 100)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Average Confidence</span>
              <span className="text-lg font-bold text-gray-900">{Math.round((completionStats?.averageConfidence || 0) * 100)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">User Satisfaction</span>
              <span className="text-lg font-bold text-gray-900">{completionStats?.userSatisfaction}/5</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Language Distribution</h4>
          <div className="space-y-3">
            {completionStats?.popularLanguages.map((language, index) => (
              <div key={language} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{language}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${100 - (index * 15)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{100 - (index * 15)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading completion data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Intelligent Code Completion & Generation</h1>
          <p className="text-gray-600 mt-2">
            AI-powered code completion, intelligent code generation, context-aware suggestions, and multi-language support
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'completions', label: 'Completions' },
              { id: 'generation', label: 'Generation' },
              { id: 'suggestions', label: 'Suggestions' },
              { id: 'models', label: 'Models' },
              { id: 'stats', label: 'Statistics' }
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
          {activeTab === 'completions' && renderCompletions()}
          {activeTab === 'generation' && renderGeneration()}
          {activeTab === 'suggestions' && renderSuggestions()}
          {activeTab === 'models' && renderModels()}
          {activeTab === 'stats' && renderStats()}
        </div>
      </div>
    </div>
  );
} 