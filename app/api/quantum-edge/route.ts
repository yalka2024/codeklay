import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';
import { QuantumEdgeComputing } from '@/lib/quantum-edge-computing';

// Initialize quantum edge computing services
const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const quantumEdge = new QuantumEdgeComputing(securityService);

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
    
    // Log quantum edge operation for security audit
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_edge_operation',
        resource: 'quantum-edge-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action, hasData: !!data },
        severity: 'medium'
      });
    }

    let response: any;

    switch (action) {
      // Quantum Edge Protocol Operations
      case 'implement_quantum_edge_protocol':
        const { name, type, version } = data;
        const protocol = await quantumEdge.implementQuantumEdgeProtocol(
          name, type, version
        );
        response = {
          success: true,
          protocol,
          message: 'Quantum edge protocol implemented successfully'
        };
        break;

      case 'deploy_quantum_edge_security':
        const { securityName, securityType, securityProvider } = data;
        const edgeSecurity = await quantumEdge.deployQuantumEdgeSecurity(
          securityName, securityType, securityProvider
        );
        response = {
          success: true,
          edgeSecurity,
          message: 'Quantum edge security deployed successfully'
        };
        break;

      case 'develop_quantum_edge_application':
        const { appName, category, protocol } = data;
        const edgeApplication = await quantumEdge.developQuantumEdgeApplication(
          appName, category, protocol
        );
        response = {
          success: true,
          edgeApplication,
          message: 'Quantum edge application developed successfully'
        };
        break;

      case 'establish_quantum_edge_communication':
        const { commName, commType, commProtocol } = data;
        const edgeCommunication = await quantumEdge.establishQuantumEdgeCommunication(
          commName, commType, commProtocol
        );
        response = {
          success: true,
          edgeCommunication,
          message: 'Quantum edge communication established successfully'
        };
        break;

      case 'deploy_quantum_edge_networking':
        const { netName, netType, topology } = data;
        const edgeNetworking = await quantumEdge.deployQuantumEdgeNetworking(
          netName, netType, topology
        );
        response = {
          success: true,
          edgeNetworking,
          message: 'Quantum edge networking deployed successfully'
        };
        break;

      case 'deploy_quantum_edge_analytics':
        const { analyticsName, analyticsType } = data;
        const edgeAnalytics = await quantumEdge.deployQuantumEdgeAnalytics(
          analyticsName, analyticsType
        );
        response = {
          success: true,
          edgeAnalytics,
          message: 'Quantum edge analytics deployed successfully'
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful quantum edge operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_edge_operation_success',
        resource: 'quantum-edge-api',
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
    console.error('Quantum Edge API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_edge_operation_error',
        resource: 'quantum-edge-api',
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
      // Quantum Edge Service Queries
      case 'quantum_edge_protocols':
        const protocols = await quantumEdge.getProtocols();
        response = {
          success: true,
          protocols,
          count: protocols.length
        };
        break;

      case 'quantum_edge_security':
        const security = await quantumEdge.getSecurity();
        response = {
          success: true,
          security,
          count: security.length
        };
        break;

      case 'quantum_edge_applications':
        const applications = await quantumEdge.getApplications();
        response = {
          success: true,
          applications,
          count: applications.length
        };
        break;

      case 'quantum_edge_communication':
        const communication = await quantumEdge.getCommunication();
        response = {
          success: true,
          communication,
          count: communication.length
        };
        break;

      case 'quantum_edge_networking':
        const networking = await quantumEdge.getNetworking();
        response = {
          success: true,
          networking,
          count: networking.length
        };
        break;

      case 'quantum_edge_analytics':
        const analytics = await quantumEdge.getAnalytics();
        response = {
          success: true,
          analytics,
          count: analytics.length
        };
        break;

      case 'edge_metrics':
        const edgeMetrics = await quantumEdge.trackEdgeMetrics();
        response = {
          success: true,
          metrics: edgeMetrics
        };
        break;

      case 'edge_report':
        const edgeReport = await quantumEdge.generateEdgeReport();
        response = {
          success: true,
          report: edgeReport
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful quantum edge operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_edge_operation_success',
        resource: 'quantum-edge-api',
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
    console.error('Quantum Edge API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_edge_operation_error',
        resource: 'quantum-edge-api',
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