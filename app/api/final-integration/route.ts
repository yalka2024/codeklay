import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';
import { FinalIntegration } from '@/lib/final-integration';

const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const orchestrator = new FinalIntegration(securityService);

type SessionUser = { id?: string; role?: string } & Record<string, unknown>;

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();
    const session = await getServerSession(authOptions);
    const user = (session?.user || {}) as SessionUser;

    let result: any;
    switch (action) {
      case 'register_service':
        result = await orchestrator.registerService(data.name, data.version, data.category, data.endpoint);
        break;
      case 'run_health_checks':
        result = await orchestrator.runHealthChecks();
        break;
      case 'validate_config':
        result = await orchestrator.validateConfiguration(data.env || {});
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (user?.id) {
      await securityService.getAudit().then(a => a.logEvent({ userId: user.id!, action: 'final_integration_post', resource: 'final-integration-api', ip: req.headers.get('x-forwarded-for') || 'unknown', userAgent: req.headers.get('user-agent') || 'unknown', metadata: { action }, severity: 'low' }));
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
      case 'services':
        result = orchestrator.getServices();
        break;
      case 'readiness':
        result = await orchestrator.generateReadinessReport();
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, result });
  } catch (e: any) {
    return NextResponse.json({ error: 'Internal error', details: e?.message || 'unknown' }, { status: 500 });
  }
}