import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';
import { QuantumSafeCrypto } from '@/lib/quantum-safe-crypto';
import { QuantumAnalytics } from '@/lib/quantum-analytics';

// Initialize quantum services
const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const quantumCrypto = new QuantumSafeCrypto(securityService);
const quantumAnalytics = new QuantumAnalytics(securityService);

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
    
    // Log quantum operation for security audit
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_operation',
        resource: 'quantum-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action, hasData: !!data },
        severity: 'medium'
      });
    }

    let response: any;

    switch (action) {
      // Quantum-Safe Cryptography Operations
      case 'generate_quantum_key':
        const { algorithm, keySize, expiresInDays } = data;
        const key = await quantumCrypto.generateQuantumSafeKey(algorithm, keySize, expiresInDays);
        response = {
          success: true,
          key,
          message: 'Quantum-safe key generated successfully'
        };
        break;

      case 'create_quantum_signature':
        const { keyId, message, sigAlgorithm } = data;
        const signature = await quantumCrypto.createQuantumSignature(keyId, message, sigAlgorithm);
        response = {
          success: true,
          signature,
          message: 'Quantum-safe signature created successfully'
        };
        break;

      case 'verify_quantum_signature':
        const { signatureId, message: verifyMessage, publicKey } = data;
        const isValid = await quantumCrypto.verifyQuantumSignature(signatureId, verifyMessage, publicKey);
        response = {
          success: true,
          isValid,
          message: `Quantum signature verification ${isValid ? 'succeeded' : 'failed'}`
        };
        break;

      case 'encrypt_quantum_safe':
        const { plaintext, keyId: encKeyId, algorithm: encAlgorithm } = data;
        const encryption = await quantumCrypto.encryptWithQuantumSafe(plaintext, encKeyId, encAlgorithm);
        response = {
          success: true,
          encryption,
          message: 'Quantum-safe encryption performed successfully'
        };
        break;

      case 'create_quantum_hash':
        const { input, algorithm: hashAlgorithm, salt } = data;
        const hash = await quantumCrypto.createQuantumResistantHash(input, hashAlgorithm, salt);
        response = {
          success: true,
          hash,
          message: 'Quantum-resistant hash created successfully'
        };
        break;

      case 'perform_quantum_key_exchange':
        const { partyA, partyB, algorithm: keAlgorithm } = data;
        const keyExchange = await quantumCrypto.performQuantumKeyExchange(partyA, partyB, keAlgorithm);
        response = {
          success: true,
          keyExchange,
          message: 'Quantum key exchange performed successfully'
        };
        break;

      // Quantum Analytics Operations
      case 'create_quantum_dataset':
        const { name, description, size, dimensions, quantumCompatible, classicalCompatible } = data;
        const dataset = await quantumAnalytics.createQuantumDataset(
          name, description, size, dimensions, quantumCompatible, classicalCompatible
        );
        response = {
          success: true,
          dataset,
          message: 'Quantum dataset created successfully'
        };
        break;

      case 'train_quantum_model':
        const { modelName, type, algorithm, datasetId, hyperparameters } = data;
        const model = await quantumAnalytics.trainQuantumModel(
          modelName, type, algorithm, datasetId, hyperparameters
        );
        response = {
          success: true,
          model,
          message: 'Quantum model trained successfully'
        };
        break;

      case 'make_quantum_prediction':
        const { modelId, input: predInput } = data;
        const prediction = await quantumAnalytics.makeQuantumPrediction(modelId, predInput);
        response = {
          success: true,
          prediction,
          message: 'Quantum prediction made successfully'
        };
        break;

      case 'perform_quantum_optimization':
        const { optName, type, algorithm, problemSize, variables, constraints, objective } = data;
        const optimization = await quantumAnalytics.performQuantumOptimization(
          optName, type, algorithm, problemSize, variables, constraints, objective
        );
        response = {
          success: true,
          optimization,
          message: 'Quantum optimization performed successfully'
        };
        break;

      case 'run_quantum_simulation':
        const { simName, type, qubits, depth, shots } = data;
        const simulation = await quantumAnalytics.runQuantumSimulation(
          simName, type, qubits, depth, shots
        );
        response = {
          success: true,
          simulation,
          message: 'Quantum simulation run successfully'
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful quantum operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_operation_success',
        resource: 'quantum-api',
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
    console.error('Quantum API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_operation_error',
        resource: 'quantum-api',
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
      // Quantum-Safe Cryptography Queries
      case 'quantum_keys':
        const keys = await quantumCrypto.getKeys();
        response = {
          success: true,
          keys,
          count: keys.length
        };
        break;

      case 'quantum_signatures':
        const signatures = await quantumCrypto.getSignatures();
        response = {
          success: true,
          signatures,
          count: signatures.length
        };
        break;

      case 'quantum_encryptions':
        const encryptions = await quantumCrypto.getEncryptions();
        response = {
          success: true,
          encryptions,
          count: encryptions.length
        };
        break;

      case 'quantum_hashes':
        const hashes = await quantumCrypto.getHashes();
        response = {
          success: true,
          hashes,
          count: hashes.length
        };
        break;

      case 'quantum_key_exchanges':
        const keyExchanges = await quantumCrypto.getKeyExchanges();
        response = {
          success: true,
          keyExchanges,
          count: keyExchanges.length
        };
        break;

      case 'quantum_crypto_metrics':
        const cryptoMetrics = await quantumCrypto.trackQuantumSecurityMetrics();
        response = {
          success: true,
          metrics: cryptoMetrics
        };
        break;

      // Quantum Analytics Queries
      case 'quantum_datasets':
        const datasets = await quantumAnalytics.getDatasets();
        response = {
          success: true,
          datasets,
          count: datasets.length
        };
        break;

      case 'quantum_models':
        const models = await quantumAnalytics.getModels();
        response = {
          success: true,
          models,
          count: models.length
        };
        break;

      case 'quantum_predictions':
        const { modelId } = searchParams;
        const predictions = await quantumAnalytics.getPredictions(modelId);
        response = {
          success: true,
          predictions,
          count: predictions.length
        };
        break;

      case 'quantum_optimizations':
        const optimizations = await quantumAnalytics.getOptimizations();
        response = {
          success: true,
          optimizations,
          count: optimizations.length
        };
        break;

      case 'quantum_simulations':
        const simulations = await quantumAnalytics.getSimulations();
        response = {
          success: true,
          simulations,
          count: simulations.length
        };
        break;

      case 'quantum_analytics_metrics':
        const analyticsMetrics = await quantumAnalytics.trackQuantumAnalyticsMetrics();
        response = {
          success: true,
          metrics: analyticsMetrics
        };
        break;

      case 'quantum_crypto_report':
        const cryptoReport = await quantumCrypto.generateQuantumSecurityReport();
        response = {
          success: true,
          report: cryptoReport
        };
        break;

      case 'quantum_analytics_report':
        const analyticsReport = await quantumAnalytics.generateQuantumAnalyticsReport();
        response = {
          success: true,
          report: analyticsReport
        };
        break;

      case 'quantum_key_details':
        const { keyId } = searchParams;
        if (!keyId) {
          return NextResponse.json({ error: 'Key ID required' }, { status: 400 });
        }
        const keyDetails = quantumCrypto.getKeyById(keyId);
        response = {
          success: true,
          key: keyDetails
        };
        break;

      case 'quantum_model_details':
        const { modelId } = searchParams;
        if (!modelId) {
          return NextResponse.json({ error: 'Model ID required' }, { status: 400 });
        }
        const modelDetails = quantumAnalytics.getModelById(modelId);
        response = {
          success: true,
          model: modelDetails
        };
        break;

      case 'quantum_key_status':
        const { keyId: statusKeyId } = searchParams;
        if (!statusKeyId) {
          return NextResponse.json({ error: 'Key ID required' }, { status: 400 });
        }
        const keyStatus = quantumCrypto.isKeyActive(statusKeyId);
        response = {
          success: true,
          active: keyStatus
        };
        break;

      case 'quantum_model_status':
        const { modelId: statusModelId } = searchParams;
        if (!statusModelId) {
          return NextResponse.json({ error: 'Model ID required' }, { status: 400 });
        }
        const modelStatus = quantumAnalytics.isModelActive(statusModelId);
        response = {
          success: true,
          active: modelStatus
        };
        break;

      case 'quantum_summary':
        const cryptoReportData = await quantumCrypto.generateQuantumSecurityReport();
        const analyticsReportData = await quantumAnalytics.generateQuantumAnalyticsReport();
        
        const summary = {
          quantumCrypto: {
            totalKeys: cryptoReportData.totalKeys,
            activeKeys: cryptoReportData.activeKeys,
            totalSignatures: cryptoReportData.totalSignatures,
            verifiedSignatures: cryptoReportData.verifiedSignatures,
            totalEncryptions: cryptoReportData.totalEncryptions,
            totalKeyExchanges: cryptoReportData.totalKeyExchanges
          },
          quantumAnalytics: {
            totalDatasets: analyticsReportData.totalDatasets,
            totalModels: analyticsReportData.totalModels,
            activeModels: analyticsReportData.activeModels,
            totalPredictions: analyticsReportData.totalPredictions,
            totalOptimizations: analyticsReportData.totalOptimizations,
            totalSimulations: analyticsReportData.totalSimulations
          },
          combined: {
            totalKeys: cryptoReportData.totalKeys,
            totalModels: analyticsReportData.totalModels,
            totalPredictions: analyticsReportData.totalPredictions,
            totalOptimizations: analyticsReportData.totalOptimizations,
            averageAccuracy: analyticsReportData.averageAccuracy,
            averageQuantumAdvantage: analyticsReportData.averageQuantumAdvantage
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

    // Log successful quantum operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_operation_success',
        resource: 'quantum-api',
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
    console.error('Quantum API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'quantum_operation_error',
        resource: 'quantum-api',
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