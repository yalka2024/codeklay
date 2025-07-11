import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]';
import { RBACService } from '../../../../backend/api/enterprise/rbac.service';

const prisma = new PrismaClient();

type SessionUser = {
  id?: string;
  role?: string;
  email?: string;
};

async function verifyAuditAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const user = session.user as SessionUser;
  if (!RBACService.hasPermission(user, 'view_audit_logs')) return null;
  return user;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAuditAccess();
    if (!admin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '0', 10);
    const take = 50;
    const skip = page * take;
    // Filters
    const changedBy = searchParams.get('changedBy');
    const changedUser = searchParams.get('changedUser');
    const oldRole = searchParams.get('oldRole');
    const newRole = searchParams.get('newRole');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    // Build where clause
    const where: any = { action: 'role_changed' };
    if (changedBy) where["details"].changed_by = changedBy;
    if (changedUser) where.resource_id = changedUser;
    if (oldRole) where["details"].old_role = oldRole;
    if (newRole) where["details"].new_role = newRole;
    if (fromDate || toDate) {
      where.created_at = {};
      if (fromDate) where.created_at.gte = new Date(fromDate);
      if (toDate) where.created_at.lte = new Date(toDate + 'T23:59:59');
    }
    // Try both Prisma model names; adjust as needed for your schema
    let logs = [];
    let total = 0;
    try {
      logs = await prisma.activity_logs.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: take + 1,
        include: {
          user: { select: { id: true, email: true } },
        },
      });
    } catch (e) {
      try {
        logs = await prisma.activityLogs.findMany({
          where,
          orderBy: { created_at: 'desc' },
          skip,
          take: take + 1,
          include: {
            user: { select: { id: true, email: true } },
          },
        });
      } catch (e2) {
        // Fallback: raw query (no filtering/pagination)
        logs = await prisma.$queryRaw`SELECT * FROM activity_logs WHERE action = 'role_changed' ORDER BY created_at DESC LIMIT 51 OFFSET ${skip}`;
      }
    }
    const hasNext = logs.length > take;
    if (hasNext) logs = logs.slice(0, take);
    return NextResponse.json({ logs, hasNext });
  } catch (error) {
    console.error('Audit logs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 