import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';
import { QuantumAIFrameworks } from '@/lib/quantum-ai-frameworks';

// Initialize quantum AI services
const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const quantumAI = new QuantumAIFrameworks(securityService);

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
    
    // Log quantum AI operation for security audit
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_ai_operation',
        resource: 'quantum-ai-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action, hasData: !!data },
        severity: 'medium'
      });
    }

    let response: any;

    switch (action) {
      // Quantum AI Framework Operations
      case 'create_quantum_ml_framework':
        const { name, type, language, architecture } = data;
        const framework = await quantumAI.createQuantumMLFramework(
          name, type, language, architecture
        );
        response = {
          success: true,
          framework,
          message: 'Quantum ML framework created successfully'
        };
        break;

      case 'create_quantum_neural_network_library':
        const { libName, libArchitecture, inputSize, hiddenLayers, outputSize, quantumLayers } = data;
        const library = await quantumAI.createQuantumNeuralNetworkLibrary(
          libName, libArchitecture, inputSize, hiddenLayers, outputSize, quantumLayers
        );
        response = {
          success: true,
          library,
          message: 'Quantum neural network library created successfully'
        };
        break;

      case 'perform_quantum_ai_optimization':
        const { optName, optimizationType, algorithm, target } = data;
        const optimization = await quantumAI.performQuantumAIOptimization(
          optName, optimizationType, algorithm, target
        );
        response = {
          success: true,
          optimization,
          message: 'Quantum AI optimization performed successfully'
        };
        break;

      case 'create_quantum_nlp':
        const { nlpName, task, model } = data;
        const nlp = await quantumAI.createQuantumNLP(
          nlpName, task, model
        );
        response = {
          success: true,
          nlp,
          message: 'Quantum NLP created successfully'
        };
        break;

      case 'create_quantum_computer_vision':
        const { cvName, cvTask, cvModel } = data;
        const computerVision = await quantumAI.createQuantumComputerVision(
          cvName, cvTask, cvModel
        );
        response = {
          success: true,
          computerVision,
          message: 'Quantum computer vision created successfully'
        };
        break;

      case 'create_quantum_recommendation_system':
        const { recName, recType, recAlgorithm } = data;
        const recommendationSystem = await quantumAI.createQuantumRecommendationSystem(
          recName, recType, recAlgorithm
        );
        response = {
          success: true,
          recommendationSystem,
          message: 'Quantum recommendation system created successfully'
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful quantum AI operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_ai_operation_success',
        resource: 'quantum-ai-api',
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
    console.error('Quantum AI API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_ai_operation_error',
        resource: 'quantum-ai-api',
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
      // Quantum AI Framework Queries
      case 'quantum_ml_frameworks':
        const frameworks = await quantumAI.getFrameworks();
        response = {
          success: true,
          frameworks,
          count: frameworks.length
        };
        break;

      case 'quantum_neural_network_libraries':
        const libraries = await quantumAI.getLibraries();
        response = {
          success: true,
          libraries,
          count: libraries.length
        };
        break;

      case 'quantum_ai_optimizations':
        const optimizations = await quantumAI.getOptimizations();
        response = {
          success: true,
          optimizations,
          count: optimizations.length
        };
        break;

      case 'quantum_nlp':
        const nlp = await quantumAI.getNLP();
        response = {
          success: true,
          nlp,
          count: nlp.length
        };
        break;

      case 'quantum_computer_vision':
        const computerVision = await quantumAI.getComputerVision();
        response = {
          success: true,
          computerVision,
          count: computerVision.length
        };
        break;

      case 'quantum_recommendation_systems':
        const recommendationSystems = await quantumAI.getRecommendationSystems();
        response = {
          success: true,
          recommendationSystems,
          count: recommendationSystems.length
        };
        break;

      case 'ai_metrics':
        const aiMetrics = await quantumAI.trackAIMetrics();
        response = {
          success: true,
          metrics: aiMetrics
        };
        break;

      case 'ai_report':
        const aiReport = await quantumAI.generateAIReport();
        response = {
          success: true,
          report: aiReport
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful quantum AI operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_ai_operation_success',
        resource: 'quantum-ai-api',
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
    console.error('Quantum AI API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_ai_operation_error',
        resource: 'quantum-ai-api',
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