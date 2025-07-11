import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    // Validate required fields
    const { type, priority, title, description, userAgent, url, metadata } = body;
    
    if (!type || !priority || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create feedback record
    const feedback = await prisma.feedback.create({
      data: {
        type,
        priority,
        title,
        description,
        userAgent,
        url,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        status: 'pending',
        metadata: metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Send real-time alerts for critical issues
    if (priority === 'critical') {
      await sendCriticalAlert(feedback);
    }

    // Track feedback analytics
    await trackFeedbackAnalytics(feedback);

    return NextResponse.json(
      { 
        success: true, 
        feedbackId: feedback.id,
        message: 'Feedback submitted successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow admin users to view feedback
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (priority) where.priority = priority;

    // Get feedback with pagination
    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.feedback.count({ where }),
    ]);

    return NextResponse.json({
      feedback,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Feedback retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendCriticalAlert(feedback: any) {
  try {
    // Send to Slack
    if (process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 CRITICAL FEEDBACK ALERT\n\n*${feedback.title}*\n\n${feedback.description}\n\n*User:* ${feedback.userEmail || 'Anonymous'}\n*URL:* ${feedback.url}\n*Browser:* ${feedback.metadata?.browser}\n*Priority:* ${feedback.priority}`,
        }),
      });
    }

    // Send email to admin team
    if (process.env.ADMIN_EMAIL) {
      // Implementation for email sending
      console.log('Sending critical feedback email to admin team');
    }

    // Log to monitoring system
    console.error('CRITICAL FEEDBACK:', {
      id: feedback.id,
      title: feedback.title,
      description: feedback.description,
      userEmail: feedback.userEmail,
      url: feedback.url,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to send critical alert:', error);
  }
}

async function trackFeedbackAnalytics(feedback: any) {
  try {
    // Track in analytics database
    await prisma.feedbackAnalytics.create({
      data: {
        feedbackId: feedback.id,
        type: feedback.type,
        priority: feedback.priority,
        userAgent: feedback.userAgent,
        browser: feedback.metadata?.browser,
        os: feedback.metadata?.os,
        screenSize: feedback.metadata?.screenSize,
        loadTime: feedback.metadata?.performance?.loadTime,
        errorCount: feedback.metadata?.performance?.errors?.length || 0,
        timestamp: new Date(),
      },
    });

    // Update real-time metrics
    await updateFeedbackMetrics(feedback);
  } catch (error) {
    console.error('Failed to track feedback analytics:', error);
  }
}

async function updateFeedbackMetrics(feedback: any) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get or create daily metrics
    let metrics = await prisma.feedbackMetrics.findFirst({
      where: { date: today },
    });

    if (!metrics) {
      metrics = await prisma.feedbackMetrics.create({
        data: {
          date: today,
          totalFeedback: 0,
          bugReports: 0,
          featureRequests: 0,
          criticalIssues: 0,
          averageLoadTime: 0,
          totalLoadTime: 0,
          loadTimeCount: 0,
        },
      });
    }

    // Update metrics
    await prisma.feedbackMetrics.update({
      where: { id: metrics.id },
      data: {
        totalFeedback: metrics.totalFeedback + 1,
        bugReports: metrics.bugReports + (feedback.type === 'bug' ? 1 : 0),
        featureRequests: metrics.featureRequests + (feedback.type === 'feature' ? 1 : 0),
        criticalIssues: metrics.criticalIssues + (feedback.priority === 'critical' ? 1 : 0),
        totalLoadTime: metrics.totalLoadTime + (feedback.metadata?.performance?.loadTime || 0),
        loadTimeCount: metrics.loadTimeCount + (feedback.metadata?.performance?.loadTime ? 1 : 0),
        averageLoadTime: (metrics.totalLoadTime + (feedback.metadata?.performance?.loadTime || 0)) / 
                        (metrics.loadTimeCount + (feedback.metadata?.performance?.loadTime ? 1 : 0)),
      },
    });
  } catch (error) {
    console.error('Failed to update feedback metrics:', error);
  }
} 