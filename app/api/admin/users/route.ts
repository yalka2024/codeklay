import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]';
import { RBACService } from '../../../../backend/api/enterprise/rbac.service';
import { RolePermissions } from '../../../../backend/api/enterprise/rbac.model';

const prisma = new PrismaClient();

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
  role?: string;
};

async function verifyRBACAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }
  const user = session.user as SessionUser;
  if (!RBACService.hasPermission(user, 'manage_users')) {
    return null;
  }
  return user;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyRBACAccess();
    if (!admin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: {
          select: {
            apiKeys: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await verifyRBACAccess();
    if (!admin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { userId, role } = await req.json();
    if (!userId || !role) {
      return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 });
    }

    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Fetch old role
    const existingUser = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const oldRole = existingUser.role;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Log the role change
    await prisma.activity_logs.create({
      data: {
        user_id: admin.id,
        action: 'role_changed',
        resource_type: 'user',
        resource_id: userId,
        details: {
          old_role: oldRole,
          new_role: role,
          changed_by: admin.id,
        },
        ip_address: req.headers.get('x-forwarded-for') || null,
        user_agent: req.headers.get('user-agent') || null,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Admin update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 