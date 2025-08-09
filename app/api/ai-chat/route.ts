import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { trackEvent } from '@/lib/analytics'
import { EntitlementService } from '../../../backend/api/ai/entitlement.service'
import { AdvancedAIService, defaultAIServiceConfig } from '@/lib/advanced-ai-service'
import { VertexAI } from '@google-cloud/vertexai'
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security'

// Initialize enhanced AI service
const aiService = new AdvancedAIService(defaultAIServiceConfig)
const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig)

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
  role?: string;
  subscription_tier?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { messages, mode, language, context } = await req.json()
    
    // Get user session for analytics and security
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    // Enterprise security audit logging
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'ai_interaction',
        resource: 'ai-chat',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { mode, language, messageCount: messages?.length || 0 },
        severity: 'low'
      });
    }
    
    // Enforce AI quota for free/paid users
    const userId = user?.id;
    const tier = user?.subscription_tier || 'free';
    if (userId && !(await EntitlementService.checkAIQuotaDB(userId, tier))) {
      return NextResponse.json({ error: 'AI usage quota exceeded for your plan. Upgrade to increase your limit.' }, { status: 402 });
    }

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    // Build project context for enhanced AI
    let projectContext = {
      projectId: context?.projectId || 'default',
      files: context?.files || [],
      dependencies: context?.dependencies || [],
      framework: context?.framework || 'nextjs',
      language: context?.language || 'typescript',
      recentChanges: context?.recentChanges || [],
      userPreferences: context?.userPreferences || {}
    };

    let response: any;
    const startTime = Date.now();

    switch (mode) {
      case 'codegen':
        const codeGenResult = await aiService.generateCodeWithContext({
          prompt: messages[messages.length - 1].content,
          context: projectContext,
          language: language || 'typescript',
          mode: 'generate',
          constraints: {
            maxLines: 100,
            performance: true,
            security: true,
            maintainability: true
          }
        });
        
        response = {
          message: `Generated code with ${Math.round(codeGenResult.confidence * 100)}% confidence using ${codeGenResult.models.join(', ')} models`,
          code: codeGenResult.code,
          language: language || 'typescript',
          suggestions: [],
          confidence: codeGenResult.confidence,
          executionTime: codeGenResult.executionTime,
          tokensUsed: 0
        };
        break;

      case 'review': {
        const code = messages[messages.length - 1].content
        // Prefer Vertex AI if configured; fallback to internal service
        if (process.env.GCP_PROJECT_ID) {
          const vertex = new VertexAI({
            project: process.env.GCP_PROJECT_ID,
            location: process.env.GCP_REGION || 'us-central1',
          })
          const model = vertex.preview.getGenerativeModel({ model: 'gemini-1.5-pro' })
          const result = await model.generateContent(
            `Review this code for security, performance, and maintainability. Provide issues and actionable fixes.\n\n${code}`
          )
          const text = result.response.text()
          response = {
            message: 'Code analysis (Vertex AI) complete',
            suggestions: [],
            confidence: 0.85,
            executionTime: Date.now() - startTime,
            tokensUsed: 0,
            analysis: { summary: text },
          }
        } else {
          const reviewResult = await aiService.reviewCodeSecurity(code, projectContext)
          response = {
            message: `Code Analysis Complete`,
            suggestions: reviewResult.suggestions,
            confidence: reviewResult.overallScore / 100,
            executionTime: reviewResult.executionTime,
            tokensUsed: 0,
            analysis: {
              issues: reviewResult.issues,
              securityScore: reviewResult.securityScore,
              performanceScore: reviewResult.performanceScore,
              maintainabilityScore: reviewResult.maintainabilityScore,
              overallScore: reviewResult.overallScore,
            },
          }
        }
        break;
      }

      case 'testgen':
        const testResult = await aiService.generateTests(
          messages[messages.length - 1].content,
          projectContext
        );
        
        response = {
          message: `Generated ${testResult.tests.length} tests with ${testResult.coverage}% coverage`,
          code: testResult.tests.map(test => test.code).join('\n\n'),
          language: language || 'typescript',
          suggestions: testResult.tests.map(test => test.description),
          confidence: testResult.coverage / 100,
          executionTime: testResult.executionTime,
          tokensUsed: 0,
          tests: testResult.tests
        };
        break;

      case 'docs':
        const docResult = await aiService.generateDocumentation(
          messages[messages.length - 1].content,
          projectContext
        );
        
        response = {
          message: `Documentation generated successfully`,
          code: docResult.documentation.api,
          language: language || 'typescript',
          suggestions: docResult.documentation.examples,
          confidence: 0.9,
          executionTime: docResult.executionTime,
          tokensUsed: 0,
          documentation: docResult.documentation
        };
        break;

      case 'optimize':
        const optimizeResult = await aiService.optimizeCodePerformance(
          messages[messages.length - 1].content,
          projectContext
        );
        
        response = {
          message: `Code optimized with ${optimizeResult.performanceGain}% performance improvement`,
          code: optimizeResult.optimizedCode,
          language: language || 'typescript',
          suggestions: optimizeResult.improvements,
          confidence: 0.85,
          executionTime: optimizeResult.executionTime,
          tokensUsed: 0,
          optimization: {
            improvements: optimizeResult.improvements,
            performanceGain: optimizeResult.performanceGain
          }
        };
        break;

      default:
        // Enhanced chat with context awareness
        const chatResult = await aiService.generateCodeWithContext({
          prompt: messages[messages.length - 1].content,
          context: projectContext,
          language: language || 'typescript',
          mode: 'generate'
        });
        
        response = {
          message: chatResult.code ? `Generated code: ${chatResult.code}` : 'I understand your request. How can I help you with your code?',
          code: chatResult.code || '',
          language: language || 'typescript',
          suggestions: [],
          confidence: chatResult.confidence,
          executionTime: chatResult.executionTime,
          tokensUsed: 0
        };
    }

    // Increment AI usage after successful request
    if (userId) {
      await EntitlementService.incrementAIUsageDB(userId);
    }

    // Track AI interaction for analytics
    if (user?.id) {
      trackEvent({
        userId: user.id,
        event: `ai_interaction_${mode || 'chat'}`,
        category: 'ai',
        metadata: {
          mode,
          language,
          hasContext: !!context,
          messageCount: messages.length,
          executionTime: response.executionTime,
          tokensUsed: response.tokensUsed,
          confidence: response.confidence,
          models: response.models || [],
          securityScore: response.analysis?.securityScore,
          performanceScore: response.analysis?.performanceScore,
        },
      });
    }

    // Log successful AI interaction
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'ai_interaction_success',
        resource: 'ai-chat',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          mode, 
          language, 
          executionTime: response.executionTime,
          confidence: response.confidence 
        },
        severity: 'low'
      });
    }

    return NextResponse.json({
      message: response.message,
      code: response.code,
      language: response.language,
      suggestions: response.suggestions,
      confidence: response.confidence,
      executionTime: response.executionTime,
      tokensUsed: response.tokensUsed,
      analysis: response.analysis,
      tests: response.tests,
      documentation: response.documentation,
      optimization: response.optimization
    })
  } catch (error) {
    console.error('AI Chat API Error:', error)
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'ai_interaction_error',
        resource: 'ai-chat',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          mode: req.body?.mode,
          language: req.body?.language
        },
        severity: 'medium'
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 