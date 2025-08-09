import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';
import { QuantumHardwareIntegration } from '@/lib/quantum-hardware-integration';
import { QuantumEcosystem } from '@/lib/quantum-ecosystem';

// Initialize production quantum services
const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const quantumHardware = new QuantumHardwareIntegration(securityService);
const quantumEcosystem = new QuantumEcosystem(securityService);

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
    
    // Log production quantum operation for security audit
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'production_quantum_operation',
        resource: 'quantum-production-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action, hasData: !!data },
        severity: 'medium'
      });
    }

    let response: any;

    switch (action) {
      // Quantum Hardware Integration Operations
      case 'register_quantum_hardware':
        const { name, type, manufacturer, qubits } = data;
        const hardware = await quantumHardware.registerQuantumHardware(
          name, type, manufacturer, qubits
        );
        response = {
          success: true,
          hardware,
          message: 'Quantum hardware registered successfully'
        };
        break;

      case 'optimize_quantum_cloud_service':
        const { cloudName, provider, region, cloudQubits } = data;
        const cloudService = await quantumHardware.optimizeQuantumCloudService(
          cloudName, provider, region, cloudQubits
        );
        response = {
          success: true,
          cloudService,
          message: 'Quantum cloud service optimized successfully'
        };
        break;

      case 'deploy_enterprise_quantum':
        const { deploymentName, deploymentType, servers, quantumProcessors, storage, network } = data;
        const deployment = await quantumHardware.deployEnterpriseQuantum(
          deploymentName, deploymentType, servers, quantumProcessors, storage, network
        );
        response = {
          success: true,
          deployment,
          message: 'Enterprise quantum deployment completed successfully'
        };
        break;

      // Quantum Ecosystem Operations
      case 'add_third_party_integration':
        const { integrationName, provider, category, integrationType } = data;
        const integration = await quantumEcosystem.addThirdPartyIntegration(
          integrationName, provider, category, integrationType
        );
        response = {
          success: true,
          integration,
          message: 'Third-party integration added successfully'
        };
        break;

      case 'add_marketplace_item':
        const { marketplaceName, marketplaceCategory, marketplaceProvider, description } = data;
        const marketplaceItem = await quantumEcosystem.addMarketplaceItem(
          marketplaceName, marketplaceCategory, marketplaceProvider, description
        );
        response = {
          success: true,
          marketplaceItem,
          message: 'Marketplace item added successfully'
        };
        break;

      case 'add_developer_tool':
        const { toolName, toolType, language, targetPlatform } = data;
        const developerTool = await quantumEcosystem.addDeveloperTool(
          toolName, toolType, language, targetPlatform
        );
        response = {
          success: true,
          developerTool,
          message: 'Developer tool added successfully'
        };
        break;

      case 'add_api_gateway':
        const { apiName, endpoint, method, authentication } = data;
        const apiGateway = await quantumEcosystem.addAPIGateway(
          apiName, endpoint, method, authentication
        );
        response = {
          success: true,
          apiGateway,
          message: 'API gateway added successfully'
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful production quantum operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'production_quantum_operation_success',
        resource: 'quantum-production-api',
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
    console.error('Production Quantum API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'production_quantum_operation_error',
        resource: 'quantum-production-api',
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
      // Quantum Hardware Integration Queries
      case 'quantum_hardware':
        const hardware = await quantumHardware.getHardware();
        response = {
          success: true,
          hardware,
          count: hardware.length
        };
        break;

      case 'quantum_cloud_services':
        const cloudServices = await quantumHardware.getCloudServices();
        response = {
          success: true,
          cloudServices,
          count: cloudServices.length
        };
        break;

      case 'enterprise_deployments':
        const deployments = await quantumHardware.getDeployments();
        response = {
          success: true,
          deployments,
          count: deployments.length
        };
        break;

      case 'hardware_report':
        const hardwareReport = await quantumHardware.generateHardwareReport();
        response = {
          success: true,
          report: hardwareReport
        };
        break;

      // Quantum Ecosystem Queries
      case 'third_party_integrations':
        const integrations = await quantumEcosystem.getIntegrations();
        response = {
          success: true,
          integrations,
          count: integrations.length
        };
        break;

      case 'marketplace_items':
        const marketplaceItems = await quantumEcosystem.getMarketplace();
        response = {
          success: true,
          marketplaceItems,
          count: marketplaceItems.length
        };
        break;

      case 'developer_tools':
        const developerTools = await quantumEcosystem.getDeveloperTools();
        response = {
          success: true,
          developerTools,
          count: developerTools.length
        };
        break;

      case 'api_gateways':
        const apiGateways = await quantumEcosystem.getAPIGateways();
        response = {
          success: true,
          apiGateways,
          count: apiGateways.length
        };
        break;

      case 'ecosystem_metrics':
        const ecosystemMetrics = await quantumEcosystem.trackEcosystemMetrics();
        response = {
          success: true,
          metrics: ecosystemMetrics
        };
        break;

      case 'ecosystem_report':
        const ecosystemReport = await quantumEcosystem.generateEcosystemReport();
        response = {
          success: true,
          report: ecosystemReport
        };
        break;

      case 'production_quantum_summary':
        const hardwareReportData = await quantumHardware.generateHardwareReport();
        const ecosystemReportData = await quantumEcosystem.generateEcosystemReport();
        
        const summary = {
          quantumHardware: {
            totalHardware: hardwareReportData.totalHardware,
            activeHardware: hardwareReportData.activeHardware,
            totalCloudServices: hardwareReportData.totalCloudServices,
            activeCloudServices: hardwareReportData.activeCloudServices,
            totalDeployments: hardwareReportData.totalDeployments,
            activeDeployments: hardwareReportData.activeDeployments
          },
          quantumEcosystem: {
            totalIntegrations: ecosystemReportData.totalIntegrations,
            activeIntegrations: ecosystemReportData.activeIntegrations,
            totalMarketplaceItems: ecosystemReportData.totalMarketplaceItems,
            activeMarketplaceItems: ecosystemReportData.activeMarketplaceItems,
            totalDeveloperTools: ecosystemReportData.totalDeveloperTools,
            activeDeveloperTools: ecosystemReportData.activeDeveloperTools,
            totalAPIs: ecosystemReportData.totalAPIs,
            activeAPIs: ecosystemReportData.activeAPIs,
            averageRating: ecosystemReportData.averageRating,
            totalDownloads: ecosystemReportData.totalDownloads
          },
          combined: {
            totalQuantumSystems: hardwareReportData.totalHardware + ecosystemReportData.totalIntegrations,
            activeQuantumSystems: hardwareReportData.activeHardware + ecosystemReportData.activeIntegrations,
            totalMarketplaceItems: ecosystemReportData.totalMarketplaceItems,
            totalDeveloperTools: ecosystemReportData.totalDeveloperTools,
            averageRating: ecosystemReportData.averageRating,
            totalDownloads: ecosystemReportData.totalDownloads
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

    // Log successful production quantum operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'production_quantum_operation_success',
        resource: 'quantum-production-api',
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
    console.error('Production Quantum API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'production_quantum_operation_error',
        resource: 'quantum-production-api',
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