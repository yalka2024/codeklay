import { NextRequest, NextResponse } from 'next/server';
import { EnhancedAuth } from '@/lib/enhanced-auth';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const session = EnhancedAuth.getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: session.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionId = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const session = EnhancedAuth.getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const { name, email } = await request.json();

    // Validate email if provided
    if (email && !EnhancedAuth.isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Update user profile
    const updatedUser = await EnhancedAuth.updateUserProfile(session.user.id, {
      name,
      email
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        emailVerified: updatedUser.emailVerified,
      },
      message: 'Profile updated successfully!'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 