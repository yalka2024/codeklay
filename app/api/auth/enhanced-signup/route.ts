import { NextRequest, NextResponse } from 'next/server';
import { EnhancedAuth } from '@/lib/enhanced-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

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

    // Password strength validation
    const passwordValidation = EnhancedAuth.isStrongPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { 
          error: 'Password does not meet requirements',
          details: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Create user with enhanced validation
    const user = await EnhancedAuth.createUser(email, password, name);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
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
      message: 'Account created successfully! Please verify your email.'
    });
  } catch (error: any) {
    console.error('Enhanced signup error:', error);
    
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }
    
    if (error.message.includes('Invalid email')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    if (error.message.includes('Password validation failed')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 