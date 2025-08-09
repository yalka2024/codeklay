import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';
import { QuantumCloudServices } from '@/lib/quantum-cloud-services';

// Initialize quantum cloud services
const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const quantumCloud = new QuantumCloudServices(securityService);

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
    
    // Log quantum cloud operation for security audit
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_cloud_operation',
        resource: 'quantum-cloud-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action, hasData: !!data },
        severity: 'medium'
      });
    }

    let response: any;

    switch (action) {
      // Quantum Cloud Computing Operations
      case 'provision_quantum_cloud_computing':
        const { name, type, provider } = data;
        const cloudComputing = await quantumCloud.provisionQuantumCloudComputing(
          name, type, provider
        );
        response = {
          success: true,
          cloudComputing,
          message: 'Quantum cloud computing provisioned successfully'
        };
        break;

      case 'provision_quantum_cloud_storage':
        const { storageName, storageType, storageProvider, capacity } = data;
        const cloudStorage = await quantumCloud.provisionQuantumCloudStorage(
          storageName, storageType, storageProvider, capacity
        );
        response = {
          success: true,
          cloudStorage,
          message: 'Quantum cloud storage provisioned successfully'
        };
        break;

      case 'provision_quantum_cloud_networking':
        const { networkName, networkType, networkProvider } = data;
        const cloudNetworking = await quantumCloud.provisionQuantumCloudNetworking(
          networkName, networkType, networkProvider
        );
        response = {
          success: true,
          cloudNetworking,
          message: 'Quantum cloud networking provisioned successfully'
        };
        break;

      case 'deploy_quantum_saas_application':
        const { saasName, category, saasProvider } = data;
        const saasApplication = await quantumCloud.deployQuantumSaaSApplication(
          saasName, category, saasProvider
        );
        response = {
          success: true,
          saasApplication,
          message: 'Quantum SaaS application deployed successfully'
        };
        break;

      case 'provision_quantum_cloud_analytics':
        const { analyticsName, analyticsType, analyticsProvider } = data;
        const cloudAnalytics = await quantumCloud.provisionQuantumCloudAnalytics(
          analyticsName, analyticsType, analyticsProvider
        );
        response = {
          success: true,
          cloudAnalytics,
          message: 'Quantum cloud analytics provisioned successfully'
        };
        break;

      case 'provision_quantum_cloud_security':
        const { securityName, securityType, securityProvider } = data;
        const cloudSecurity = await quantumCloud.provisionQuantumCloudSecurity(
          securityName, securityType, securityProvider
        );
        response = {
          success: true,
          cloudSecurity,
          message: 'Quantum cloud security provisioned successfully'
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful quantum cloud operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_cloud_operation_success',
        resource: 'quantum-cloud-api',
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
    console.error('Quantum Cloud API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_cloud_operation_error',
        resource: 'quantum-cloud-api',
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
      // Quantum Cloud Service Queries
      case 'quantum_cloud_computing':
        const cloudComputing = await quantumCloud.getCloudComputing();
        response = {
          success: true,
          cloudComputing,
          count: cloudComputing.length
        };
        break;

      case 'quantum_cloud_storage':
        const cloudStorage = await quantumCloud.getCloudStorage();
        response = {
          success: true,
          cloudStorage,
          count: cloudStorage.length
        };
        break;

      case 'quantum_cloud_networking':
        const cloudNetworking = await quantumCloud.getCloudNetworking();
        response = {
          success: true,
          cloudNetworking,
          count: cloudNetworking.length
        };
        break;

      case 'quantum_saas_applications':
        const saasApplications = await quantumCloud.getSaaSApplications();
        response = {
          success: true,
          saasApplications,
          count: saasApplications.length
        };
        break;

      case 'quantum_cloud_analytics':
        const cloudAnalytics = await quantumCloud.getCloudAnalytics();
        response = {
          success: true,
          cloudAnalytics,
          count: cloudAnalytics.length
        };
        break;

      case 'quantum_cloud_security':
        const cloudSecurity = await quantumCloud.getCloudSecurity();
        response = {
          success: true,
          cloudSecurity,
          count: cloudSecurity.length
        };
        break;

      case 'cloud_metrics':
        const cloudMetrics = await quantumCloud.trackCloudMetrics();
        response = {
          success: true,
          metrics: cloudMetrics
        };
        break;

      case 'cloud_report':
        const cloudReport = await quantumCloud.generateCloudReport();
        response = {
          success: true,
          report: cloudReport
        };
        break;

      case 'quantum_cloud_summary':
        const computingData = await quantumCloud.getCloudComputing();
        const storageData = await quantumCloud.getCloudStorage();
        const networkingData = await quantumCloud.getCloudNetworking();
        const saasData = await quantumCloud.getSaaSApplications();
        const analyticsData = await quantumCloud.getCloudAnalytics();
        const securityData = await quantumCloud.getCloudSecurity();
        const cloudReportData = await quantumCloud.generateCloudReport();
        
        const summary = {
          quantumCloudComputing: {
            totalComputing: cloudReportData.totalCloudComputing,
            activeComputing: cloudReportData.activeCloudComputing,
            averagePerformance: cloudReportData.averagePerformance,
            averageCost: cloudReportData.averageCost,
            computingTypeDistribution: cloudReportData.computingTypeDistribution
          },
          quantumCloudStorage: {
            totalStorage: cloudReportData.totalCloudStorage,
            activeStorage: cloudReportData.activeCloudStorage,
            averageAvailability: cloudReportData.averageAvailability,
            storageTypeDistribution: cloudReportData.storageTypeDistribution
          },
          quantumCloudNetworking: {
            totalNetworking: cloudReportData.totalCloudNetworking,
            activeNetworking: cloudReportData.activeCloudNetworking,
            averageThroughput: networkingData.length > 0
              ? networkingData.reduce((sum, n) => sum + n.performance.throughput, 0) / networkingData.length
              : 0,
            networkingTypeDistribution: cloudReportData.networkingTypeDistribution
          },
          quantumSaaSApplications: {
            totalSaaS: cloudReportData.totalSaaSApplications,
            activeSaaS: cloudReportData.activeSaaSApplications,
            averageResponseTime: saasData.length > 0
              ? saasData.reduce((sum, s) => sum + s.performance.responseTime, 0) / saasData.length
              : 0,
            saasCategoryDistribution: cloudReportData.saasCategoryDistribution
          },
          quantumCloudAnalytics: {
            totalAnalytics: cloudReportData.totalCloudAnalytics,
            activeAnalytics: cloudReportData.activeCloudAnalytics,
            averageProcessingSpeed: analyticsData.length > 0
              ? analyticsData.reduce((sum, a) => sum + a.performance.processingSpeed, 0) / analyticsData.length
              : 0
          },
          quantumCloudSecurity: {
            totalSecurity: cloudReportData.totalCloudSecurity,
            activeSecurity: cloudReportData.activeCloudSecurity,
            averageDetectionSpeed: securityData.length > 0
              ? securityData.reduce((sum, s) => sum + s.performance.detectionSpeed, 0) / securityData.length
              : 0
          },
          combined: {
            totalCloudServices: cloudReportData.totalCloudComputing + cloudReportData.totalCloudStorage + 
              cloudReportData.totalCloudNetworking + cloudReportData.totalSaaSApplications + 
              cloudReportData.totalCloudAnalytics + cloudReportData.totalCloudSecurity,
            activeCloudServices: cloudReportData.activeCloudComputing + cloudReportData.activeCloudStorage + 
              cloudReportData.activeCloudNetworking + cloudReportData.activeSaaSApplications + 
              cloudReportData.activeCloudAnalytics + cloudReportData.activeCloudSecurity,
            averagePerformance: cloudReportData.averagePerformance,
            averageCost: cloudReportData.averageCost,
            averageAvailability: cloudReportData.averageAvailability
          }
        };
        
        response = {
          success: true,
          summary
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful quantum cloud operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_cloud_operation_success',
        resource: 'quantum-cloud-api',
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
    console.error('Quantum Cloud API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_cloud_operation_error',
        resource: 'quantum-cloud-api',
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