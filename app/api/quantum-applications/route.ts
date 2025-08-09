import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';
import { QuantumMachineLearning } from '@/lib/quantum-machine-learning';

// Initialize quantum applications services
const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const quantumML = new QuantumMachineLearning(securityService);

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
    
    // Log quantum applications operation for security audit
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_applications_operation',
        resource: 'quantum-applications-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action, hasData: !!data },
        severity: 'medium'
      });
    }

    let response: any;

    switch (action) {
      // Quantum Machine Learning Operations
      case 'create_quantum_neural_network':
        const { name, architecture, inputSize, hiddenLayers, outputSize, qubits } = data;
        const neuralNetwork = await quantumML.createQuantumNeuralNetwork(
          name, architecture, inputSize, hiddenLayers, outputSize, qubits
        );
        response = {
          success: true,
          neuralNetwork,
          message: 'Quantum neural network created successfully'
        };
        break;

      case 'perform_quantum_optimization':
        const { optName, problemType, algorithm, variables, constraints } = data;
        const optimization = await quantumML.performQuantumOptimization(
          optName, problemType, algorithm, variables, constraints
        );
        response = {
          success: true,
          optimization,
          message: 'Quantum optimization performed successfully'
        };
        break;

      case 'run_quantum_simulation':
        const { simName, domain, simulationType, particles, dimensions } = data;
        const simulation = await quantumML.runQuantumSimulation(
          simName, domain, simulationType, particles, dimensions
        );
        response = {
          success: true,
          simulation,
          message: 'Quantum simulation run successfully'
        };
        break;

      case 'create_quantum_finance_app':
        const { financeName, application, financeAlgorithm, assets, timeHorizon, riskTolerance } = data;
        const financeApp = await quantumML.createQuantumFinanceApp(
          financeName, application, financeAlgorithm, assets, timeHorizon, riskTolerance
        );
        response = {
          success: true,
          financeApp,
          message: 'Quantum finance application created successfully'
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful quantum applications operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_applications_operation_success',
        resource: 'quantum-applications-api',
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
    console.error('Quantum Applications API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_applications_operation_error',
        resource: 'quantum-applications-api',
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
      // Quantum Machine Learning Queries
      case 'quantum_neural_networks':
        const neuralNetworks = await quantumML.getNeuralNetworks();
        response = {
          success: true,
          neuralNetworks,
          count: neuralNetworks.length
        };
        break;

      case 'quantum_optimizations':
        const optimizations = await quantumML.getOptimizations();
        response = {
          success: true,
          optimizations,
          count: optimizations.length
        };
        break;

      case 'quantum_simulations':
        const simulations = await quantumML.getSimulations();
        response = {
          success: true,
          simulations,
          count: simulations.length
        };
        break;

      case 'quantum_finance_apps':
        const financeApps = await quantumML.getFinanceApps();
        response = {
          success: true,
          financeApps,
          count: financeApps.length
        };
        break;

      case 'ml_metrics':
        const mlMetrics = await quantumML.trackMLMetrics();
        response = {
          success: true,
          metrics: mlMetrics
        };
        break;

      case 'ml_report':
        const mlReport = await quantumML.generateMLReport();
        response = {
          success: true,
          report: mlReport
        };
        break;

      case 'quantum_applications_summary':
        const neuralNetworksData = await quantumML.getNeuralNetworks();
        const optimizationsData = await quantumML.getOptimizations();
        const simulationsData = await quantumML.getSimulations();
        const financeAppsData = await quantumML.getFinanceApps();
        const mlReportData = await quantumML.generateMLReport();
        
        const summary = {
          quantumMachineLearning: {
            totalNeuralNetworks: mlReportData.totalNeuralNetworks,
            activeNeuralNetworks: mlReportData.activeNeuralNetworks,
            averageAccuracy: mlReportData.averageAccuracy,
            totalExecutionTime: mlReportData.totalExecutionTime
          },
          quantumOptimization: {
            totalOptimizations: mlReportData.totalOptimizations,
            activeOptimizations: mlReportData.activeOptimizations,
            averageQuantumAdvantage: mlReportData.averageQuantumAdvantage,
            problemTypeDistribution: mlReportData.problemTypeDistribution
          },
          quantumSimulation: {
            totalSimulations: mlReportData.totalSimulations,
            activeSimulations: mlReportData.activeSimulations,
            averageConvergence: simulationsData.length > 0 
              ? simulationsData.reduce((sum, s) => sum + s.results.convergence, 0) / simulationsData.length 
              : 0
          },
          quantumFinance: {
            totalFinanceApps: mlReportData.totalFinanceApps,
            activeFinanceApps: mlReportData.activeFinanceApps,
            averageReturn: financeAppsData.length > 0
              ? financeAppsData.reduce((sum, f) => sum + f.portfolio.expectedReturn, 0) / financeAppsData.length
              : 0
          },
          combined: {
            totalApplications: mlReportData.totalNeuralNetworks + mlReportData.totalOptimizations + 
              mlReportData.totalSimulations + mlReportData.totalFinanceApps,
            activeApplications: mlReportData.activeNeuralNetworks + mlReportData.activeOptimizations + 
              mlReportData.activeSimulations + mlReportData.activeFinanceApps,
            averageAccuracy: mlReportData.averageAccuracy,
            averageQuantumAdvantage: mlReportData.averageQuantumAdvantage,
            totalExecutionTime: mlReportData.totalExecutionTime
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

    // Log successful quantum applications operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_applications_operation_success',
        resource: 'quantum-applications-api',
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
    console.error('Quantum Applications API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_applications_operation_error',
        resource: 'quantum-applications-api',
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