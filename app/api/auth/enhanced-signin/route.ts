import { NextRequest, NextResponse } from 'next/server';
import { EnhancedAuth } from '@/lib/enhanced-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Email validation
    if (!EnhancedAuth.isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check rate limiting
    if (EnhancedAuth.isRateLimited(email)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    // Authenticate user with enhanced validation
    const user = await EnhancedAuth.authenticateUser(email, password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const sessionId = EnhancedAuth.createSession(user);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
      sessionId,
      message: 'Login successful!'
    });
  } catch (error: any) {
    console.error('Enhanced signin error:', error);
    
    if (error.message.includes('Too many login attempts')) {
      return NextResponse.json(
        { error: error.message },
        { status: 429 }
      );
    }
    
    if (error.message.includes('Invalid email')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    if (error.message.includes('Invalid credentials')) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 