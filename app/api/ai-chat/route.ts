import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { AIService, AIMessage, ProjectContext } from '../../../backend/api/ai/ai.service'
import { authOptions } from '../auth/[...nextauth]'
import { trackEvent } from '@/lib/analytics'
import { EntitlementService } from '../../../backend/api/ai/entitlement.service';

export const runtime = 'edge'

// Initialize AI service (in production, this would be properly injected)
const aiService = new AIService(
  { get: (key: string) => process.env[key] } as any,
  { emit: () => {} } as any
)

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
    
    // Get user session for analytics
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    // Enforce AI quota for free/paid users
    const userId = user?.id;
    const tier = user?.subscription_tier || 'free';
    if (userId && !EntitlementService.checkAIQuota(userId, tier)) {
      return NextResponse.json({ error: 'AI usage quota exceeded for your plan. Upgrade to increase your limit.' }, { status: 402 });
    }

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    // Convert messages to AI service format
    const aiMessages: AIMessage[] = messages.map((m: any) => ({
      role: m.role,
      content: m.content,
      code: m.code,
      language: m.language,
      context: m.context
    }))

    // Build project context if provided
    let projectContext: ProjectContext | undefined
    if (context) {
      projectContext = {
        projectId: context.projectId || 'default',
        files: context.files || [],
        dependencies: context.dependencies || [],
        framework: context.framework || 'nextjs',
        language: context.language || 'typescript',
        recentChanges: context.recentChanges || [],
        userPreferences: context.userPreferences || {}
      }
    }

    let response: any
    switch (mode) {
      case 'codegen':
        response = await aiService.generateCode(
          messages[messages.length - 1].content,
          projectContext,
          language
        )
        break
      case 'review':
        const analysis = await aiService.reviewCode(
          messages[messages.length - 1].content,
          projectContext,
          language
        )
        // Convert CodeAnalysis to AIResponse format
        response = {
          message: `Code Analysis Complete\n\nIssues Found: ${analysis.issues.length}\nSecurity Score: ${analysis.securityScore}%\nPerformance Score: ${analysis.performanceScore}%\nMaintainability Score: ${analysis.maintainabilityScore}%\nOverall Score: ${analysis.overallScore}%\n\n${analysis.issues.map(issue => `- ${issue.severity.toUpperCase()}: ${issue.message}`).join('\n')}\n\nSuggestions:\n${analysis.suggestions.map(s => `- ${s}`).join('\n')}`,
          suggestions: analysis.suggestions,
          confidence: analysis.overallScore / 100,
          executionTime: analysis.executionTime,
          tokensUsed: 0
        }
        break
      case 'testgen':
        response = await aiService.generateTests(
          messages[messages.length - 1].content,
          projectContext,
          language
        )
        break
      case 'docs':
        response = await aiService.generateDocumentation(
          messages[messages.length - 1].content,
          projectContext,
          language
        )
        break
      case 'fixes':
        const errors = messages[messages.length - 1].errors || []
        response = await aiService.suggestFixes(
          messages[messages.length - 1].content,
          errors,
          projectContext,
          language
        )
        break
      default:
        response = await aiService.chat(aiMessages, projectContext, language)
    }

    // Increment AI usage after successful request
    if (userId) {
      EntitlementService.incrementAIUsage(userId);
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
        },
      });
    }

    return NextResponse.json({
      message: response.message,
      code: response.code,
      language: response.language,
      suggestions: response.suggestions,
      confidence: response.confidence,
      executionTime: response.executionTime,
      tokensUsed: response.tokensUsed
    })
  } catch (error) {
    console.error('AI Chat API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 