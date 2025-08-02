// apps/ai-worker/worker.ts
// Cloudflare Worker stub for DeepSeek Coder Model integration

export interface Env {
  DEEPSEEK_API_KEY: string;
  OPENAI_SECRET_KEY: string;
}

interface CodeCompletionRequest {
  code: string;
  language: string;
  context?: string;
  maxTokens?: number;
}

interface CodeAnalysisRequest {
  code: string;
  language: string;
  analysisType: 'quality' | 'security' | 'performance' | 'best_practices';
}

interface LearningRequest {
  userId: string;
  codeHistory: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredLanguages: string[];
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      switch (path) {
        case '/api/ai/complete':
          return await handleCodeCompletion(request, env);
        case '/api/ai/analyze':
          return await handleCodeAnalysis(request, env);
        case '/api/ai/learn':
          return await handleLearningRequest(request, env);
        case '/api/ai/suggest':
          return await handleCodeSuggestions(request, env);
        case '/api/ai/optimize':
          return await handleCodeOptimization(request, env);
        case '/health':
          return new Response(JSON.stringify({ status: 'healthy', service: 'ai-worker' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        default:
          return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
      }
    } catch (error) {
      console.error('AI Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },
};

async function handleCodeCompletion(request: Request, env: Env): Promise<Response> {
  const { code, language, context, maxTokens = 1000 }: CodeCompletionRequest = await request.json();

  if (!code || !language) {
    return new Response(JSON.stringify({ error: 'Code and language are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Use DeepSeek Coder Model for code completion
    const prompt = buildCompletionPrompt(code, language, context);
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-coder:33b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an expert software developer. Complete the given code with high quality, following best practices and the specified programming language conventions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.2,
        top_p: 0.95,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const result = await response.json();
    const completion = result.choices[0]?.message?.content || '';

    return new Response(JSON.stringify({
      completion,
      model: 'deepseek-coder:33b-instruct',
      usage: result.usage,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Code completion error:', error);
    return new Response(JSON.stringify({ error: 'Code completion failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleCodeAnalysis(request: Request, env: Env): Promise<Response> {
  const { code, language, analysisType }: CodeAnalysisRequest = await request.json();

  if (!code || !language || !analysisType) {
    return new Response(JSON.stringify({ error: 'Code, language, and analysis type are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const prompt = buildAnalysisPrompt(code, language, analysisType);
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-coder:33b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an expert code reviewer and security analyst. Analyze the given code and provide detailed feedback in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.1,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const result = await response.json();
    const analysis = result.choices[0]?.message?.content || '';

    // Parse the analysis response
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysis);
    } catch {
      // If parsing fails, return the raw text
      parsedAnalysis = { analysis: analysis };
    }

    return new Response(JSON.stringify({
      analysis: parsedAnalysis,
      analysisType,
      language,
      model: 'deepseek-coder:33b-instruct',
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Code analysis error:', error);
    return new Response(JSON.stringify({ error: 'Code analysis failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleLearningRequest(request: Request, env: Env): Promise<Response> {
  const { userId, codeHistory, skillLevel, preferredLanguages }: LearningRequest = await request.json();

  try {
    // Analyze user's coding patterns
    const patterns = await analyzeCodingPatterns(codeHistory, preferredLanguages);
    
    // Generate personalized learning recommendations
    const recommendations = await generateLearningRecommendations(patterns, skillLevel, env);
    
    // Create personalized tutorials
    const tutorials = await generatePersonalizedTutorials(patterns, skillLevel, preferredLanguages, env);

    return new Response(JSON.stringify({
      userId,
      patterns,
      recommendations,
      tutorials,
      skillLevel,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Learning request error:', error);
    return new Response(JSON.stringify({ error: 'Learning analysis failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleCodeSuggestions(request: Request, env: Env): Promise<Response> {
  const { code, language, context } = await request.json();

  try {
    const prompt = `Analyze this ${language} code and suggest improvements for readability, performance, and best practices:

Code:
${code}

Context: ${context || 'General improvement suggestions'}

Provide suggestions in JSON format with the following structure:
{
  "suggestions": [
    {
      "type": "readability|performance|security|best_practice",
      "description": "Description of the suggestion",
      "code": "Improved code example",
      "priority": "high|medium|low"
    }
  ]
}`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-coder:33b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an expert code reviewer. Provide specific, actionable suggestions for code improvement.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.2,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const result = await response.json();
    const suggestions = result.choices[0]?.message?.content || '';

    let parsedSuggestions;
    try {
      parsedSuggestions = JSON.parse(suggestions);
    } catch {
      parsedSuggestions = { suggestions: [{ description: suggestions, type: 'general' }] };
    }

    return new Response(JSON.stringify({
      suggestions: parsedSuggestions.suggestions || [],
      language,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Code suggestions error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate suggestions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleCodeOptimization(request: Request, env: Env): Promise<Response> {
  const { code, language, optimizationType = 'performance' } = await request.json();

  try {
    const prompt = `Optimize this ${language} code for ${optimizationType}. Provide the optimized version with explanations:

Original Code:
${code}

Optimize for: ${optimizationType}

Provide response in JSON format:
{
  "optimizedCode": "The optimized code",
  "explanations": ["Explanation 1", "Explanation 2"],
  "improvements": {
    "performance": "Estimated performance improvement",
    "readability": "Readability improvement notes"
  }
}`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-coder:33b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an expert code optimizer. Provide optimized code with detailed explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.1,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const result = await response.json();
    const optimization = result.choices[0]?.message?.content || '';

    let parsedOptimization;
    try {
      parsedOptimization = JSON.parse(optimization);
    } catch {
      parsedOptimization = { optimizedCode: optimization, explanations: [] };
    }

    return new Response(JSON.stringify({
      originalCode: code,
      optimizedCode: parsedOptimization.optimizedCode || optimization,
      explanations: parsedOptimization.explanations || [],
      improvements: parsedOptimization.improvements || {},
      language,
      optimizationType,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Code optimization error:', error);
    return new Response(JSON.stringify({ error: 'Code optimization failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper functions
function buildCompletionPrompt(code: string, language: string, context?: string): string {
  return `Complete the following ${language} code. Provide only the completion, not the original code:

${context ? `Context: ${context}\n\n` : ''}Code to complete:
${code}

Complete the code following ${language} best practices and conventions.`;
}

function buildAnalysisPrompt(code: string, language: string, analysisType: string): string {
  const analysisPrompts = {
    quality: `Analyze this ${language} code for code quality. Check for:
- Readability and maintainability
- Code structure and organization
- Naming conventions
- Documentation and comments
- Error handling

Code:
${code}

Provide analysis in JSON format:
{
  "score": 85,
  "issues": ["issue1", "issue2"],
  "strengths": ["strength1", "strength2"],
  "recommendations": ["rec1", "rec2"]
}`,
    security: `Analyze this ${language} code for security vulnerabilities. Check for:
- SQL injection
- XSS vulnerabilities
- Input validation
- Authentication issues
- Authorization problems
- Data exposure

Code:
${code}

Provide analysis in JSON format:
{
  "vulnerabilities": ["vuln1", "vuln2"],
  "riskLevel": "high|medium|low",
  "recommendations": ["rec1", "rec2"]
}`,
    performance: `Analyze this ${language} code for performance issues. Check for:
- Algorithm efficiency
- Memory usage
- Database query optimization
- Caching opportunities
- Resource management

Code:
${code}

Provide analysis in JSON format:
{
  "bottlenecks": ["bottleneck1", "bottleneck2"],
  "optimizations": ["opt1", "opt2"],
  "performanceScore": 75
}`,
    best_practices: `Analyze this ${language} code for best practices. Check for:
- Design patterns
- SOLID principles
- DRY principle
- Code reusability
- Testing practices

Code:
${code}

Provide analysis in JSON format:
{
  "practices": ["practice1", "practice2"],
  "violations": ["violation1", "violation2"],
  "score": 80
}`
  };

  return analysisPrompts[analysisType as keyof typeof analysisPrompts] || analysisPrompts.quality;
}

async function analyzeCodingPatterns(codeHistory: string[], languages: string[]): Promise<any> {
  // This would analyze the user's coding patterns
  // For now, return a basic analysis
  return {
    preferredPatterns: ['functional', 'modular'],
    commonIssues: ['missing error handling', 'inconsistent naming'],
    strengths: ['clean code structure', 'good documentation'],
    languageProficiency: languages.reduce((acc, lang) => {
      acc[lang] = 'intermediate';
      return acc;
    }, {} as Record<string, string>)
  };
}

async function generateLearningRecommendations(patterns: any, skillLevel: string, env: Env): Promise<any[]> {
  // Generate personalized learning recommendations based on patterns
  return [
    {
      type: 'tutorial',
      title: 'Advanced Error Handling',
      description: 'Improve your error handling patterns',
      difficulty: 'intermediate',
      estimatedTime: '2 hours'
    },
    {
      type: 'practice',
      title: 'Code Review Exercises',
      description: 'Practice reviewing code for best practices',
      difficulty: skillLevel,
      estimatedTime: '1 hour'
    }
  ];
}

async function generatePersonalizedTutorials(patterns: any, skillLevel: string, languages: string[], env: Env): Promise<any[]> {
  // Generate personalized tutorials based on user patterns
  return [
    {
      id: 'tut_001',
      title: 'Improving Code Quality',
      content: 'Based on your coding patterns, here are specific areas to focus on...',
      difficulty: skillLevel,
      languages: languages,
      estimatedTime: '3 hours'
    }
  ];
} 