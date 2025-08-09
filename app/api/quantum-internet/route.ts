import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';
import { QuantumInternet } from '@/lib/quantum-internet';

// Initialize quantum internet services
const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const quantumInternet = new QuantumInternet(securityService);

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
  role?: string;
  subscription_tier?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();
    
    // Get user session for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    // Log quantum internet operation for security audit
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_internet_operation',
        resource: 'quantum-internet-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action, hasData: !!data },
        severity: 'medium'
      });
    }

    let response: any;

    switch (action) {
      // Quantum Internet Protocol Operations
      case 'implement_quantum_internet_protocol':
        const { name, type, version } = data;
        const protocol = await quantumInternet.implementQuantumInternetProtocol(
          name, type, version
        );
        response = {
          success: true,
          protocol,
          message: 'Quantum internet protocol implemented successfully'
        };
        break;

      case 'deploy_quantum_internet_security':
        const { securityName, securityType, securityProvider } = data;
        const internetSecurity = await quantumInternet.deployQuantumInternetSecurity(
          securityName, securityType, securityProvider
        );
        response = {
          success: true,
          internetSecurity,
          message: 'Quantum internet security deployed successfully'
        };
        break;

      case 'develop_quantum_internet_application':
        const { appName, category, protocol } = data;
        const internetApplication = await quantumInternet.developQuantumInternetApplication(
          appName, category, protocol
        );
        response = {
          success: true,
          internetApplication,
          message: 'Quantum internet application developed successfully'
        };
        break;

      case 'establish_quantum_communication':
        const { commName, commType, commProtocol } = data;
        const quantumCommunication = await quantumInternet.establishQuantumCommunication(
          commName, commType, commProtocol
        );
        response = {
          success: true,
          quantumCommunication,
          message: 'Quantum communication established successfully'
        };
        break;

      case 'deploy_quantum_networking':
        const { netName, netType, topology } = data;
        const quantumNetworking = await quantumInternet.deployQuantumNetworking(
          netName, netType, topology
        );
        response = {
          success: true,
          quantumNetworking,
          message: 'Quantum networking deployed successfully'
        };
        break;

      case 'provision_quantum_internet_service':
        const { serviceName, serviceType, serviceProvider } = data;
        const internetService = await quantumInternet.provisionQuantumInternetService(
          serviceName, serviceType, serviceProvider
        );
        response = {
          success: true,
          internetService,
          message: 'Quantum internet service provisioned successfully'
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful quantum internet operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_internet_operation_success',
        resource: 'quantum-internet-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          action, 
          success: response.success 
        },
        severity: 'low'
      });
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Quantum Internet API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_internet_operation_error',
        resource: 'quantum-internet-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          action: req.body?.action
        },
        severity: 'high'
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    
    // Get user session for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    let response: any;

    switch (action) {
      // Quantum Internet Service Queries
      case 'quantum_internet_protocols':
        const protocols = await quantumInternet.getProtocols();
        response = {
          success: true,
          protocols,
          count: protocols.length
        };
        break;

      case 'quantum_internet_security':
        const security = await quantumInternet.getSecurity();
        response = {
          success: true,
          security,
          count: security.length
        };
        break;

      case 'quantum_internet_applications':
        const applications = await quantumInternet.getApplications();
        response = {
          success: true,
          applications,
          count: applications.length
        };
        break;

      case 'quantum_communication':
        const communication = await quantumInternet.getCommunication();
        response = {
          success: true,
          communication,
          count: communication.length
        };
        break;

      case 'quantum_networking':
        const networking = await quantumInternet.getNetworking();
        response = {
          success: true,
          networking,
          count: networking.length
        };
        break;

      case 'quantum_internet_services':
        const services = await quantumInternet.getServices();
        response = {
          success: true,
          services,
          count: services.length
        };
        break;

      case 'internet_metrics':
        const internetMetrics = await quantumInternet.trackInternetMetrics();
        response = {
          success: true,
          metrics: internetMetrics
        };
        break;

      case 'internet_report':
        const internetReport = await quantumInternet.generateInternetReport();
        response = {
          success: true,
          report: internetReport
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful quantum internet operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_internet_operation_success',
        resource: 'quantum-internet-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          action, 
          success: response.success 
        },
        severity: 'low'
      });
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Quantum Internet API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_internet_operation_error',
        resource: 'quantum-internet-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          action: req.url
        },
        severity: 'high'
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 