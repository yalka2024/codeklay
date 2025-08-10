import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';
import { QuantumMobile } from '@/lib/quantum-mobile';

const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const mobile = new QuantumMobile(securityService);

type SessionUser = { id?: string; role?: string } & Record<string, unknown>;

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();
    const session = await getServerSession(authOptions);
    const user = (session?.user || {}) as SessionUser;

    let result: any;
    switch (action) {
      case 'implement_protocol':
        result = await mobile.implementProtocol(data.name, data.type, data.version);
        break;
      case 'deploy_security':
        result = await mobile.deploySecurity(data.name, data.type, data.provider);
        break;
      case 'create_application':
        result = await mobile.createApplication(data.name, data.category, data.protocol);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (user?.id) {
      await securityService.getAudit().then(audit => audit.logEvent({ userId: user.id!, action: 'quantum_mobile_post', resource: 'quantum-mobile-api', ip: req.headers.get('x-forwarded-for') || 'unknown', userAgent: req.headers.get('user-agent') || 'unknown', metadata: { action }, severity: 'low' }));
    }

    return NextResponse.json({ success: true, result });
  } catch (e: any) {
    return NextResponse.json({ error: 'Internal error', details: e?.message || 'unknown' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    let result: any;

    switch (action) {
      case 'protocols':
        result = await mobile.getProtocols();
        break;
      case 'security':
        result = await mobile.getSecurity();
        break;
      case 'applications':
        result = await mobile.getApplications();
        break;
      case 'metrics':
        result = await mobile.trackMetrics();
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, result });
  } catch (e: any) {
    return NextResponse.json({ error: 'Internal error', details: e?.message || 'unknown' }, { status: 500 });
  }
}