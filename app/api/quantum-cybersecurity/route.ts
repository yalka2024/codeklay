import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';
import { QuantumCybersecurity } from '@/lib/quantum-cybersecurity';

// Initialize quantum cybersecurity services
const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const quantumCybersecurity = new QuantumCybersecurity(securityService);

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
    
    // Log quantum cybersecurity operation for security audit
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_cybersecurity_operation',
        resource: 'quantum-cybersecurity-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action, hasData: !!data },
        severity: 'medium'
      });
    }

    let response: any;

    switch (action) {
      // Quantum Threat Detection Operations
      case 'deploy_quantum_threat_detection':
        const { name, type, algorithm } = data;
        const threatDetection = await quantumCybersecurity.deployQuantumThreatDetection(
          name, type, algorithm
        );
        response = {
          success: true,
          threatDetection,
          message: 'Quantum threat detection deployed successfully'
        };
        break;

      case 'perform_quantum_vulnerability_assessment':
        const { assessmentName, assessmentType } = data;
        const vulnerabilityAssessment = await quantumCybersecurity.performQuantumVulnerabilityAssessment(
          assessmentName, assessmentType
        );
        response = {
          success: true,
          vulnerabilityAssessment,
          message: 'Quantum vulnerability assessment performed successfully'
        };
        break;

      case 'deploy_quantum_security_monitoring':
        const { monitoringName, monitoringType, provider } = data;
        const securityMonitoring = await quantumCybersecurity.deployQuantumSecurityMonitoring(
          monitoringName, monitoringType, provider
        );
        response = {
          success: true,
          securityMonitoring,
          message: 'Quantum security monitoring deployed successfully'
        };
        break;

      case 'implement_quantum_encryption':
        const { encryptionName, encryptionType, encryptionAlgorithm } = data;
        const quantumEncryption = await quantumCybersecurity.implementQuantumEncryption(
          encryptionName, encryptionType, encryptionAlgorithm
        );
        response = {
          success: true,
          quantumEncryption,
          message: 'Quantum encryption implemented successfully'
        };
        break;

      case 'deploy_quantum_authentication':
        const { authName, authType, authMethod } = data;
        const quantumAuthentication = await quantumCybersecurity.deployQuantumAuthentication(
          authName, authType, authMethod
        );
        response = {
          success: true,
          quantumAuthentication,
          message: 'Quantum authentication deployed successfully'
        };
        break;

      case 'deploy_quantum_security_analytics':
        const { analyticsName, analyticsType } = data;
        const securityAnalytics = await quantumCybersecurity.deployQuantumSecurityAnalytics(
          analyticsName, analyticsType
        );
        response = {
          success: true,
          securityAnalytics,
          message: 'Quantum security analytics deployed successfully'
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful quantum cybersecurity operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_cybersecurity_operation_success',
        resource: 'quantum-cybersecurity-api',
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
    console.error('Quantum Cybersecurity API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_cybersecurity_operation_error',
        resource: 'quantum-cybersecurity-api',
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
      // Quantum Cybersecurity Service Queries
      case 'quantum_threat_detection':
        const threatDetection = await quantumCybersecurity.getThreatDetection();
        response = {
          success: true,
          threatDetection,
          count: threatDetection.length
        };
        break;

      case 'quantum_vulnerability_assessment':
        const vulnerabilityAssessment = await quantumCybersecurity.getVulnerabilityAssessment();
        response = {
          success: true,
          vulnerabilityAssessment,
          count: vulnerabilityAssessment.length
        };
        break;

      case 'quantum_security_monitoring':
        const securityMonitoring = await quantumCybersecurity.getSecurityMonitoring();
        response = {
          success: true,
          securityMonitoring,
          count: securityMonitoring.length
        };
        break;

      case 'quantum_encryption':
        const encryption = await quantumCybersecurity.getEncryption();
        response = {
          success: true,
          encryption,
          count: encryption.length
        };
        break;

      case 'quantum_authentication':
        const authentication = await quantumCybersecurity.getAuthentication();
        response = {
          success: true,
          authentication,
          count: authentication.length
        };
        break;

      case 'quantum_security_analytics':
        const securityAnalytics = await quantumCybersecurity.getSecurityAnalytics();
        response = {
          success: true,
          securityAnalytics,
          count: securityAnalytics.length
        };
        break;

      case 'security_metrics':
        const securityMetrics = await quantumCybersecurity.trackSecurityMetrics();
        response = {
          success: true,
          metrics: securityMetrics
        };
        break;

      case 'security_report':
        const securityReport = await quantumCybersecurity.generateSecurityReport();
        response = {
          success: true,
          report: securityReport
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful quantum cybersecurity operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_cybersecurity_operation_success',
        resource: 'quantum-cybersecurity-api',
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
    console.error('Quantum Cybersecurity API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_cybersecurity_operation_error',
        resource: 'quantum-cybersecurity-api',
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