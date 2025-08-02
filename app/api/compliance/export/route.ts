import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { RBACService } from '../../../../backend/api/enterprise/rbac.service';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!RBACService.hasPermission(session.user, 'export_data')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  // Mocked user data export
  const exportData = {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      createdAt: '2024-01-01T00:00:00Z',
      // Add more fields as needed
    },
    projects: [],
    activity: [],
  };
  return NextResponse.json(exportData);
} 