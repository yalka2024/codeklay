import { NextRequest, NextResponse } from 'next/server';
import { AzureQuantumService, QuantumCircuitBuilder } from '@/lib/azure-quantum';

// Initialize Azure Quantum service
const azureQuantum = new AzureQuantumService({
  subscriptionId: process.env.AZURE_SUBSCRIPTION_ID || '',
  resourceGroup: process.env.AZURE_RESOURCE_GROUP || '',
  workspaceName: process.env.AZURE_QUANTUM_WORKSPACE || '',
  location: process.env.AZURE_LOCATION || 'westus'
});

// GET /api/quantum/azure/backends
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'backends':
        const backends = await azureQuantum.getBackends();
        return NextResponse.json({ success: true, data: backends });

      case 'jobs':
        const status = searchParams.get('status');
        const backend = searchParams.get('backend');
        const jobs = await azureQuantum.listJobs({ status, backend });
        return NextResponse.json({ success: true, data: jobs });

      case 'metrics':
        const metrics = await azureQuantum.getMetrics();
        return NextResponse.json({ success: true, data: metrics });

      case 'job':
        const jobId = searchParams.get('jobId');
        if (!jobId) {
          return NextResponse.json({ success: false, error: 'Job ID is required' }, { status: 400 });
        }
        const job = await azureQuantum.getJobStatus(jobId);
        if (!job) {
          return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: job });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Azure Quantum API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/quantum/azure/submit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'submit_job':
        return await handleJobSubmission(params);

      case 'cancel_job':
        return await handleJobCancellation(params);

      case 'validate_circuit':
        return await handleCircuitValidation(params);

      case 'estimate_cost':
        return await handleCostEstimation(params);

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Azure Quantum API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Handle quantum job submission
async function handleJobSubmission(params: any) {
  const { circuit, backend = 'ionq.simulator', parameters = {} } = params;

  if (!circuit) {
    return NextResponse.json(
      { success: false, error: 'Circuit is required' },
      { status: 400 }
    );
  }

  try {
    // Validate circuit
    const validation = await azureQuantum.validateCircuit(circuit, backend);
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Circuit validation failed',
        details: validation.errors,
        warnings: validation.warnings
      }, { status: 400 });
    }

    // Submit job
    const jobStatus = await azureQuantum.submitQuantumJob(circuit, backend, parameters);

    return NextResponse.json({
      success: true,
      data: jobStatus,
      warnings: validation.warnings
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Handle job cancellation
async function handleJobCancellation(params: any) {
  const { jobId } = params;

  if (!jobId) {
    return NextResponse.json(
      { success: false, error: 'Job ID is required' },
      { status: 400 }
    );
  }

  try {
    const cancelled = await azureQuantum.cancelJob(jobId);
    return NextResponse.json({
      success: true,
      data: { cancelled, jobId }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Handle circuit validation
async function handleCircuitValidation(params: any) {
  const { circuit, backend = 'ionq.simulator' } = params;

  if (!circuit) {
    return NextResponse.json(
      { success: false, error: 'Circuit is required' },
      { status: 400 }
    );
  }

  try {
    const validation = await azureQuantum.validateCircuit(circuit, backend);
    return NextResponse.json({
      success: true,
      data: validation
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Handle cost estimation
async function handleCostEstimation(params: any) {
  const { circuit, backend = 'ionq.simulator' } = params;

  if (!circuit) {
    return NextResponse.json(
      { success: false, error: 'Circuit is required' },
      { status: 400 }
    );
  }

  try {
    const cost = await azureQuantum.estimateJobCost(circuit, backend);
    return NextResponse.json({
      success: true,
      data: { cost, currency: 'USD' }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 