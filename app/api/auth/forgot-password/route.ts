import { NextRequest, NextResponse } from 'next/server';
import { EnhancedAuth } from '@/lib/enhanced-auth';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Initiate password reset
    const success = await EnhancedAuth.initiatePasswordReset(email);

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 