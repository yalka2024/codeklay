import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';
import { QuantumSafeCrypto } from '@/lib/quantum-safe-crypto';
import { QuantumAnalytics } from '@/lib/quantum-analytics';
import { QuantumHybridSystems } from '@/lib/quantum-hybrid-systems';
import { AdvancedQuantumSecurity } from '@/lib/advanced-quantum-security';
import { QuantumInfrastructure } from '@/lib/quantum-infrastructure';

// Initialize advanced quantum services
const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const quantumCrypto = new QuantumSafeCrypto(securityService);
const quantumAnalytics = new QuantumAnalytics(securityService);
const quantumHybrid = new QuantumHybridSystems(securityService, quantumCrypto, quantumAnalytics);
const quantumSecurity = new AdvancedQuantumSecurity(securityService, quantumCrypto);
const quantumInfrastructure = new QuantumInfrastructure(
  securityService, 
  quantumCrypto, 
  quantumAnalytics, 
  quantumHybrid, 
  quantumSecurity
);

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
    
    // Log advanced quantum operation for security audit
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'advanced_quantum_operation',
        resource: 'quantum-advanced-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action, hasData: !!data },
        severity: 'medium'
      });
    }

    let response: any;

    switch (action) {
      // Quantum-Classical Hybrid Systems Operations
      case 'create_hybrid_algorithm':
        const { name, type, quantumAlgorithm, classicalAlgorithm, qubits, depth, shots, hybridStrategy } = data;
        const algorithm = await quantumHybrid.createHybridAlgorithm(
          name, type, quantumAlgorithm, classicalAlgorithm, qubits, depth, shots, hybridStrategy
        );
        response = {
          success: true,
          algorithm,
          message: 'Hybrid algorithm created successfully'
        };
        break;

      case 'implement_quantum_error_correction':
        const { name: ecName, code, qubits: ecQubits, logicalQubits } = data;
        const errorCorrection = await quantumHybrid.implementQuantumErrorCorrection(
          ecName, code, ecQubits, logicalQubits
        );
        response = {
          success: true,
          errorCorrection,
          message: 'Quantum error correction implemented successfully'
        };
        break;

      case 'validate_quantum_advantage':
        const { algorithmId, classicalBaseline } = data;
        const validation = await quantumHybrid.validateQuantumAdvantage(algorithmId, classicalBaseline);
        response = {
          success: true,
          validation,
          message: 'Quantum advantage validation completed successfully'
        };
        break;

      case 'perform_hybrid_optimization':
        const { optName, problemType, size, variables, constraints, quantumAlgorithm: optQuantumAlg, classicalAlgorithm: optClassicalAlg } = data;
        const optimization = await quantumHybrid.performHybridOptimization(
          optName, problemType, size, variables, constraints, optQuantumAlg, optClassicalAlg
        );
        response = {
          success: true,
          optimization,
          message: 'Hybrid optimization performed successfully'
        };
        break;

      case 'create_quantum_classical_interface':
        const { interfaceName, type, quantumEndpoint, classicalEndpoint, protocol } = data;
        const interface = await quantumHybrid.createQuantumClassicalInterface(
          interfaceName, type, quantumEndpoint, classicalEndpoint, protocol
        );
        response = {
          success: true,
          interface,
          message: 'Quantum-classical interface created successfully'
        };
        break;

      // Advanced Quantum Security Operations
      case 'establish_quantum_key_distribution':
        const { qkdName, protocol, alice, bob, keyLength, distance } = data;
        const qkd = await quantumSecurity.establishQuantumKeyDistribution(
          qkdName, protocol, alice, bob, keyLength, distance
        );
        response = {
          success: true,
          qkd,
          message: 'Quantum key distribution established successfully'
        };
        break;

      case 'create_quantum_random_number_generator':
        const { qrngName, method, entropySource, outputLength } = data;
        const qrng = await quantumSecurity.createQuantumRandomNumberGenerator(
          qrngName, method, entropySource, outputLength
        );
        response = {
          success: true,
          qrng,
          message: 'Quantum random number generator created successfully'
        };
        break;

      case 'deploy_quantum_resistant_blockchain':
        const { blockchainName, consensus, quantumAlgorithm: bcQuantumAlg, blockSize, blockTime } = data;
        const blockchain = await quantumSecurity.deployQuantumResistantBlockchain(
          blockchainName, consensus, bcQuantumAlg, blockSize, blockTime
        );
        response = {
          success: true,
          blockchain,
          message: 'Quantum-resistant blockchain deployed successfully'
        };
        break;

      case 'detect_quantum_threat':
        const { threatName, threatType, targetAlgorithm } = data;
        const threat = await quantumSecurity.detectQuantumThreat(threatName, threatType, targetAlgorithm);
        response = {
          success: true,
          threat,
          message: 'Quantum threat detection completed successfully'
        };
        break;

      case 'perform_quantum_security_audit':
        const { auditName, scope, auditType } = data;
        const audit = await quantumSecurity.performQuantumSecurityAudit(auditName, scope, auditType);
        response = {
          success: true,
          audit,
          message: 'Quantum security audit performed successfully'
        };
        break;

      // Quantum Infrastructure Operations
      case 'integrate_quantum_cloud':
        const { cloudName, provider, service, region, qubits } = data;
        const cloudIntegration = await quantumInfrastructure.integrateQuantumCloud(
          cloudName, provider, service, region, qubits
        );
        response = {
          success: true,
          cloudIntegration,
          message: 'Quantum cloud integration established successfully'
        };
        break;

      case 'optimize_quantum_hardware':
        const { hardwareName, hardwareType, optimizationType } = data;
        const hardwareOptimization = await quantumInfrastructure.optimizeQuantumHardware(
          hardwareName, hardwareType, optimizationType
        );
        response = {
          success: true,
          hardwareOptimization,
          message: 'Quantum hardware optimization completed successfully'
        };
        break;

      case 'deploy_enterprise_quantum':
        const { deploymentName, deploymentType, servers, quantumProcessors, storage, network } = data;
        const deployment = await quantumInfrastructure.deployEnterpriseQuantum(
          deploymentName, deploymentType, servers, quantumProcessors, storage, network
        );
        response = {
          success: true,
          deployment,
          message: 'Enterprise quantum deployment completed successfully'
        };
        break;

      case 'manage_quantum_resources':
        const { resourceName, resourceType, total, allocated } = data;
        const resource = await quantumInfrastructure.manageQuantumResources(
          resourceName, resourceType, total, allocated
        );
        response = {
          success: true,
          resource,
          message: 'Quantum resource management completed successfully'
        };
        break;

      case 'monitor_quantum_performance':
        const { monitoringName, metricType, currentValue, targetValue } = data;
        const monitoring = await quantumInfrastructure.monitorQuantumPerformance(
          monitoringName, metricType, currentValue, targetValue
        );
        response = {
          success: true,
          monitoring,
          message: 'Quantum performance monitoring established successfully'
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful advanced quantum operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'advanced_quantum_operation_success',
        resource: 'quantum-advanced-api',
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
    console.error('Advanced Quantum API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'advanced_quantum_operation_error',
        resource: 'quantum-advanced-api',
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
      // Quantum-Classical Hybrid Systems Queries
      case 'hybrid_algorithms':
        const algorithms = await quantumHybrid.getAlgorithms();
        response = {
          success: true,
          algorithms,
          count: algorithms.length
        };
        break;

      case 'quantum_error_corrections':
        const errorCorrections = await quantumHybrid.getErrorCorrections();
        response = {
          success: true,
          errorCorrections,
          count: errorCorrections.length
        };
        break;

      case 'quantum_advantage_validations':
        const validations = await quantumHybrid.getValidations();
        response = {
          success: true,
          validations,
          count: validations.length
        };
        break;

      case 'hybrid_optimizations':
        const optimizations = await quantumHybrid.getOptimizations();
        response = {
          success: true,
          optimizations,
          count: optimizations.length
        };
        break;

      case 'quantum_classical_interfaces':
        const interfaces = await quantumHybrid.getInterfaces();
        response = {
          success: true,
          interfaces,
          count: interfaces.length
        };
        break;

      case 'hybrid_metrics':
        const hybridMetrics = await quantumHybrid.trackHybridMetrics();
        response = {
          success: true,
          metrics: hybridMetrics
        };
        break;

      // Advanced Quantum Security Queries
      case 'quantum_key_distributions':
        const qkd = await quantumSecurity.getQKD();
        response = {
          success: true,
          qkd,
          count: qkd.length
        };
        break;

      case 'quantum_random_number_generators':
        const qrng = await quantumSecurity.getQRNG();
        response = {
          success: true,
          qrng,
          count: qrng.length
        };
        break;

      case 'quantum_resistant_blockchains':
        const blockchains = await quantumSecurity.getBlockchains();
        response = {
          success: true,
          blockchains,
          count: blockchains.length
        };
        break;

      case 'quantum_threats':
        const threats = await quantumSecurity.getThreats();
        response = {
          success: true,
          threats,
          count: threats.length
        };
        break;

      case 'quantum_security_audits':
        const audits = await quantumSecurity.getAudits();
        response = {
          success: true,
          audits,
          count: audits.length
        };
        break;

      case 'quantum_security_metrics':
        const securityMetrics = await quantumSecurity.trackQuantumSecurityMetrics();
        response = {
          success: true,
          metrics: securityMetrics
        };
        break;

      // Quantum Infrastructure Queries
      case 'quantum_cloud_integrations':
        const cloudIntegrations = await quantumInfrastructure.getCloudIntegrations();
        response = {
          success: true,
          cloudIntegrations,
          count: cloudIntegrations.length
        };
        break;

      case 'quantum_hardware_optimizations':
        const hardwareOptimizations = await quantumInfrastructure.getHardwareOptimizations();
        response = {
          success: true,
          hardwareOptimizations,
          count: hardwareOptimizations.length
        };
        break;

      case 'enterprise_quantum_deployments':
        const deployments = await quantumInfrastructure.getDeployments();
        response = {
          success: true,
          deployments,
          count: deployments.length
        };
        break;

      case 'quantum_resource_management':
        const resourceManagement = await quantumInfrastructure.getResourceManagement();
        response = {
          success: true,
          resourceManagement,
          count: resourceManagement.length
        };
        break;

      case 'quantum_performance_monitoring':
        const performanceMonitoring = await quantumInfrastructure.getPerformanceMonitoring();
        response = {
          success: true,
          performanceMonitoring,
          count: performanceMonitoring.length
        };
        break;

      case 'quantum_infrastructure_metrics':
        const infrastructureMetrics = await quantumInfrastructure.trackInfrastructureMetrics();
        response = {
          success: true,
          metrics: infrastructureMetrics
        };
        break;

      case 'hybrid_report':
        const hybridReport = await quantumHybrid.generateHybridReport();
        response = {
          success: true,
          report: hybridReport
        };
        break;

      case 'quantum_security_report':
        const securityReport = await quantumSecurity.generateQuantumSecurityReport();
        response = {
          success: true,
          report: securityReport
        };
        break;

      case 'quantum_infrastructure_report':
        const infrastructureReport = await quantumInfrastructure.generateInfrastructureReport();
        response = {
          success: true,
          report: infrastructureReport
        };
        break;

      case 'advanced_quantum_summary':
        const hybridReportData = await quantumHybrid.generateHybridReport();
        const securityReportData = await quantumSecurity.generateQuantumSecurityReport();
        const infrastructureReportData = await quantumInfrastructure.generateInfrastructureReport();
        
        const summary = {
          hybridSystems: {
            totalAlgorithms: hybridReportData.totalAlgorithms,
            activeAlgorithms: hybridReportData.activeAlgorithms,
            totalErrorCorrections: hybridReportData.totalErrorCorrections,
            activeErrorCorrections: hybridReportData.activeErrorCorrections,
            totalValidations: hybridReportData.totalValidations,
            successfulValidations: hybridReportData.successfulValidations,
            totalOptimizations: hybridReportData.totalOptimizations,
            averageQuantumAdvantage: hybridReportData.averageQuantumAdvantage
          },
          quantumSecurity: {
            totalQKD: securityReportData.totalQKD,
            activeQKD: securityReportData.activeQKD,
            totalQRNG: securityReportData.totalQRNG,
            activeQRNG: securityReportData.activeQRNG,
            totalBlockchains: securityReportData.totalBlockchains,
            activeBlockchains: securityReportData.activeBlockchains,
            totalThreats: securityReportData.totalThreats,
            detectedThreats: securityReportData.detectedThreats,
            totalAudits: securityReportData.totalAudits,
            averageComplianceScore: securityReportData.averageComplianceScore,
            averageQuantumResistanceScore: securityReportData.averageQuantumResistanceScore
          },
          quantumInfrastructure: {
            totalCloudIntegrations: infrastructureReportData.totalCloudIntegrations,
            activeCloudIntegrations: infrastructureReportData.activeCloudIntegrations,
            totalHardwareOptimizations: infrastructureReportData.totalHardwareOptimizations,
            activeHardwareOptimizations: infrastructureReportData.activeHardwareOptimizations,
            totalDeployments: infrastructureReportData.totalDeployments,
            activeDeployments: infrastructureReportData.activeDeployments,
            totalResources: infrastructureReportData.totalResources,
            allocatedResources: infrastructureReportData.allocatedResources,
            totalMonitoring: infrastructureReportData.totalMonitoring,
            alertCount: infrastructureReportData.alertCount,
            averagePerformance: infrastructureReportData.averagePerformance,
            averageCost: infrastructureReportData.averageCost
          },
          combined: {
            totalQuantumSystems: hybridReportData.totalAlgorithms + securityReportData.totalQKD + infrastructureReportData.totalCloudIntegrations,
            activeQuantumSystems: hybridReportData.activeAlgorithms + securityReportData.activeQKD + infrastructureReportData.activeCloudIntegrations,
            averageQuantumAdvantage: hybridReportData.averageQuantumAdvantage,
            averageSecurityScore: securityReportData.averageComplianceScore,
            averagePerformance: infrastructureReportData.averagePerformance
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

    // Log successful advanced quantum operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'advanced_quantum_operation_success',
        resource: 'quantum-advanced-api',
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
    console.error('Advanced Quantum API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'advanced_quantum_operation_error',
        resource: 'quantum-advanced-api',
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