import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';
import { QuantumIoT } from '@/lib/quantum-iot';

// Initialize quantum IoT services
const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const quantumIoT = new QuantumIoT(securityService);

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
    
    // Log quantum IoT operation for security audit
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_iot_operation',
        resource: 'quantum-iot-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action, hasData: !!data },
        severity: 'medium'
      });
    }

    let response: any;

    switch (action) {
      // Quantum IoT Protocol Operations
      case 'implement_quantum_iot_protocol':
        const { name, type, version } = data;
        const protocol = await quantumIoT.implementQuantumIoTProtocol(
          name, type, version
        );
        response = {
          success: true,
          protocol,
          message: 'Quantum IoT protocol implemented successfully'
        };
        break;

      case 'deploy_quantum_iot_security':
        const { securityName, securityType, securityProvider } = data;
        const iotSecurity = await quantumIoT.deployQuantumIoTSecurity(
          securityName, securityType, securityProvider
        );
        response = {
          success: true,
          iotSecurity,
          message: 'Quantum IoT security deployed successfully'
        };
        break;

      case 'develop_quantum_iot_application':
        const { appName, category, protocol } = data;
        const iotApplication = await quantumIoT.developQuantumIoTApplication(
          appName, category, protocol
        );
        response = {
          success: true,
          iotApplication,
          message: 'Quantum IoT application developed successfully'
        };
        break;

      case 'establish_quantum_iot_communication':
        const { commName, commType, commProtocol } = data;
        const iotCommunication = await quantumIoT.establishQuantumIoTCommunication(
          commName, commType, commProtocol
        );
        response = {
          success: true,
          iotCommunication,
          message: 'Quantum IoT communication established successfully'
        };
        break;

      case 'deploy_quantum_iot_networking':
        const { netName, netType, topology } = data;
        const iotNetworking = await quantumIoT.deployQuantumIoTNetworking(
          netName, netType, topology
        );
        response = {
          success: true,
          iotNetworking,
          message: 'Quantum IoT networking deployed successfully'
        };
        break;

      case 'deploy_quantum_iot_analytics':
        const { analyticsName, analyticsType } = data;
        const iotAnalytics = await quantumIoT.deployQuantumIoTAnalytics(
          analyticsName, analyticsType
        );
        response = {
          success: true,
          iotAnalytics,
          message: 'Quantum IoT analytics deployed successfully'
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful quantum IoT operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_iot_operation_success',
        resource: 'quantum-iot-api',
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
    console.error('Quantum IoT API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_iot_operation_error',
        resource: 'quantum-iot-api',
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
      // Quantum IoT Service Queries
      case 'quantum_iot_protocols':
        const protocols = await quantumIoT.getProtocols();
        response = {
          success: true,
          protocols,
          count: protocols.length
        };
        break;

      case 'quantum_iot_security':
        const security = await quantumIoT.getSecurity();
        response = {
          success: true,
          security,
          count: security.length
        };
        break;

      case 'quantum_iot_applications':
        const applications = await quantumIoT.getApplications();
        response = {
          success: true,
          applications,
          count: applications.length
        };
        break;

      case 'quantum_iot_communication':
        const communication = await quantumIoT.getCommunication();
        response = {
          success: true,
          communication,
          count: communication.length
        };
        break;

      case 'quantum_iot_networking':
        const networking = await quantumIoT.getNetworking();
        response = {
          success: true,
          networking,
          count: networking.length
        };
        break;

      case 'quantum_iot_analytics':
        const analytics = await quantumIoT.getAnalytics();
        response = {
          success: true,
          analytics,
          count: analytics.length
        };
        break;

      case 'iot_metrics':
        const iotMetrics = await quantumIoT.trackIoTMetrics();
        response = {
          success: true,
          metrics: iotMetrics
        };
        break;

      case 'iot_report':
        const iotReport = await quantumIoT.generateIoTReport();
        response = {
          success: true,
          report: iotReport
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful quantum IoT operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_iot_operation_success',
        resource: 'quantum-iot-api',
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
    console.error('Quantum IoT API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_iot_operation_error',
        resource: 'quantum-iot-api',
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