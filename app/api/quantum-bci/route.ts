import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';
import { QuantumBCI } from '@/lib/quantum-bci';

const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const bci = new QuantumBCI(securityService);

type SessionUser = { id?: string } & Record<string, unknown>;

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();
    const session = await getServerSession(authOptions);
    const user = (session?.user || {}) as SessionUser;

    let result: any;
    switch (action) {
      case 'implement_protocol': result = await bci.implementProtocol(data.name, data.type, data.version); break;
      case 'deploy_security': result = await bci.deploySecurity(data.name, data.type, data.provider); break;
      case 'create_application': result = await bci.createApplication(data.name, data.category, data.protocol); break;
      default: return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (user?.id) { await securityService.getAudit().then(a => a.logEvent({ userId: user.id!, action: 'quantum_bci_post', resource: 'quantum-bci-api', ip: req.headers.get('x-forwarded-for') || 'unknown', userAgent: req.headers.get('user-agent') || 'unknown', metadata: { action }, severity: 'low' })); }
    return NextResponse.json({ success: true, result });
  } catch (e: any) { return NextResponse.json({ error: 'Internal error', details: e?.message || 'unknown' }, { status: 500 }); }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    let result: any;
    switch (action) {
      case 'protocols': result = await bci.getProtocols(); break;
      case 'security': result = await bci.getSecurity(); break;
      case 'applications': result = await bci.getApplications(); break;
      case 'metrics': result = await bci.trackMetrics(); break;
      default: return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    return NextResponse.json({ success: true, result });
  } catch (e: any) { return NextResponse.json({ error: 'Internal error', details: e?.message || 'unknown' }, { status: 500 }); }
}