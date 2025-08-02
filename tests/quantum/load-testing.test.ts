import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { AzureQuantumService } from '../../lib/azure-quantum';
import { QuantumWorkflowAgent } from '../../packages/ai-agents/src/agents/QuantumWorkflowAgent';

// Load testing configuration
const LOAD_TEST_CONFIG = {
  concurrentJobs: 100,
  maxFailureRate: 0.05, // 5%
  maxCompletionTime: 30000, // 30 seconds
  testDuration: 300000, // 5 minutes
  rampUpTime: 60000, // 1 minute
  coolDownTime: 30000, // 30 seconds
};

// Load testing scenarios
const loadTestScenarios = [
  {
    name: "Concurrent Bell States",
    jobs: 100,
    circuit: "bell_state_template",
    expectedSuccessRate: 0.95,
    maxCompletionTime: 30000, // 30 seconds
    description: "Test 100 concurrent Bell state circuits"
  },
  {
    name: "Mixed Circuit Types",
    jobs: 50,
    circuits: ["bell_state", "grover", "teleportation"],
    expectedSuccessRate: 0.90,
    maxCompletionTime: 60000, // 60 seconds
    description: "Test mixed circuit types with different complexities"
  },
  {
    name: "Large Circuit Stress Test",
    jobs: 20,
    circuit: "large_quantum_circuit",
    expectedSuccessRate: 0.85,
    maxCompletionTime: 120000, // 2 minutes
    description: "Test large quantum circuits under stress"
  },
  {
    name: "Provider Diversity Test",
    jobs: 30,
    providers: ["ionq.simulator", "pasqal.simulator", "rigetti.simulator"],
    expectedSuccessRate: 0.90,
    maxCompletionTime: 45000, // 45 seconds
    description: "Test across different quantum providers"
  }
];

// Performance metrics interface
interface PerformanceMetrics {
  totalJobs: number;
  successfulJobs: number;
  failedJobs: number;
  successRate: number;
  averageCompletionTime: number;
  medianCompletionTime: number;
  p95CompletionTime: number;
  p99CompletionTime: number;
  errorDistribution: Record<string, number>;
  providerPerformance: Record<string, any>;
  costAnalysis: {
    totalCost: number;
    averageCostPerJob: number;
    costPerProvider: Record<string, number>;
  };
}

// Load test result interface
interface LoadTestResult {
  scenario: string;
  metrics: PerformanceMetrics;
  startTime: Date;
  endTime: Date;
  duration: number;
  passed: boolean;
  errors: string[];
}

describe('Quantum Computing Load Testing', () => {
  let azureQuantum: AzureQuantumService;
  let quantumAgent: QuantumWorkflowAgent;
  let loadTestResults: LoadTestResult[] = [];

  beforeAll(async () => {
    // Initialize services
    azureQuantum = new AzureQuantumService({
      subscriptionId: process.env.AZURE_SUBSCRIPTION_ID || 'test-subscription',
      resourceGroup: process.env.AZURE_RESOURCE_GROUP || 'test-rg',
      workspaceName: process.env.AZURE_QUANTUM_WORKSPACE || 'test-workspace',
      location: process.env.AZURE_LOCATION || 'westus'
    });

    quantumAgent = new QuantumWorkflowAgent(
      { name: 'load-test-quantum-agent' },
      'test-qiskit-key',
      'test-deepseek-key'
    );

    await quantumAgent.start();
  });

  afterAll(async () => {
    await quantumAgent.stop();
    await azureQuantum.cleanup();
    
    // Generate load test report
    generateLoadTestReport(loadTestResults);
  });

  describe('Concurrent Bell States Load Test', () => {
    it('should handle 100 concurrent Bell state jobs with <5% failure rate', async () => {
      const scenario = loadTestScenarios[0];
      const result = await runLoadTest(scenario);
      
      expect(result.passed).toBe(true);
      expect(result.metrics.successRate).toBeGreaterThanOrEqual(scenario.expectedSuccessRate);
      expect(result.metrics.averageCompletionTime).toBeLessThanOrEqual(scenario.maxCompletionTime);
      
      loadTestResults.push(result);
    }, LOAD_TEST_CONFIG.testDuration + LOAD_TEST_CONFIG.rampUpTime + LOAD_TEST_CONFIG.coolDownTime);
  });

  describe('Mixed Circuit Types Load Test', () => {
    it('should handle mixed circuit types with acceptable performance', async () => {
      const scenario = loadTestScenarios[1];
      const result = await runLoadTest(scenario);
      
      expect(result.passed).toBe(true);
      expect(result.metrics.successRate).toBeGreaterThanOrEqual(scenario.expectedSuccessRate);
      expect(result.metrics.averageCompletionTime).toBeLessThanOrEqual(scenario.maxCompletionTime);
      
      loadTestResults.push(result);
    }, LOAD_TEST_CONFIG.testDuration + LOAD_TEST_CONFIG.rampUpTime + LOAD_TEST_CONFIG.coolDownTime);
  });

  describe('Large Circuit Stress Test', () => {
    it('should handle large quantum circuits under stress', async () => {
      const scenario = loadTestScenarios[2];
      const result = await runLoadTest(scenario);
      
      expect(result.passed).toBe(true);
      expect(result.metrics.successRate).toBeGreaterThanOrEqual(scenario.expectedSuccessRate);
      expect(result.metrics.averageCompletionTime).toBeLessThanOrEqual(scenario.maxCompletionTime);
      
      loadTestResults.push(result);
    }, LOAD_TEST_CONFIG.testDuration + LOAD_TEST_CONFIG.rampUpTime + LOAD_TEST_CONFIG.coolDownTime);
  });

  describe('Provider Diversity Load Test', () => {
    it('should handle multiple quantum providers with consistent performance', async () => {
      const scenario = loadTestScenarios[3];
      const result = await runLoadTest(scenario);
      
      expect(result.passed).toBe(true);
      expect(result.metrics.successRate).toBeGreaterThanOrEqual(scenario.expectedSuccessRate);
      expect(result.metrics.averageCompletionTime).toBeLessThanOrEqual(scenario.maxCompletionTime);
      
      // Check provider diversity
      const providerCount = Object.keys(result.metrics.providerPerformance).length;
      expect(providerCount).toBeGreaterThanOrEqual(2);
      
      loadTestResults.push(result);
    }, LOAD_TEST_CONFIG.testDuration + LOAD_TEST_CONFIG.rampUpTime + LOAD_TEST_CONFIG.coolDownTime);
  });

  describe('Performance Benchmarking', () => {
    it('should meet performance benchmarks for all scenarios', async () => {
      const benchmarks = {
        maxAverageCompletionTime: 45000, // 45 seconds
        minSuccessRate: 0.85,
        maxErrorRate: 0.15,
        maxCostPerJob: 5.0, // $5 per job
      };

      for (const result of loadTestResults) {
        expect(result.metrics.averageCompletionTime).toBeLessThanOrEqual(benchmarks.maxAverageCompletionTime);
        expect(result.metrics.successRate).toBeGreaterThanOrEqual(benchmarks.minSuccessRate);
        expect(result.metrics.failedJobs / result.metrics.totalJobs).toBeLessThanOrEqual(benchmarks.maxErrorRate);
        expect(result.metrics.costAnalysis.averageCostPerJob).toBeLessThanOrEqual(benchmarks.maxCostPerJob);
      }
    });
  });

  describe('Error Analysis', () => {
    it('should categorize and analyze errors properly', async () => {
      for (const result of loadTestResults) {
        // Check error distribution
        expect(Object.keys(result.metrics.errorDistribution).length).toBeGreaterThan(0);
        
        // Check for specific error types
        const errorTypes = Object.keys(result.metrics.errorDistribution);
        expect(errorTypes).toContain('timeout');
        expect(errorTypes).toContain('validation_error');
        expect(errorTypes).toContain('provider_error');
      }
    });
  });

  describe('Resource Utilization', () => {
    it('should monitor resource utilization during load tests', async () => {
      for (const result of loadTestResults) {
        // Check CPU utilization
        expect(result.metrics.providerPerformance).toBeDefined();
        
        // Check memory usage
        expect(result.metrics).toHaveProperty('resourceUtilization');
        
        // Check network usage
        expect(result.metrics).toHaveProperty('networkMetrics');
      }
    });
  });
});

// Load testing utility functions
async function runLoadTest(scenario: any): Promise<LoadTestResult> {
  const startTime = new Date();
  const jobs: Promise<any>[] = [];
  const jobResults: any[] = [];
  const errors: string[] = [];

  console.log(`🚀 Starting load test: ${scenario.name}`);
  console.log(`📊 Target: ${scenario.jobs} concurrent jobs`);
  console.log(`⏱️  Expected completion time: ${scenario.maxCompletionTime}ms`);

  // Create job promises
  for (let i = 0; i < scenario.jobs; i++) {
    const jobPromise = createQuantumJob(scenario, i)
      .then(result => {
        jobResults.push(result);
        return result;
      })
      .catch(error => {
        errors.push(error.message);
        return { error: error.message, jobId: i };
      });
    
    jobs.push(jobPromise);
  }

  // Execute all jobs concurrently
  const results = await Promise.allSettled(jobs);
  
  const endTime = new Date();
  const duration = endTime.getTime() - startTime.getTime();

  // Calculate metrics
  const metrics = calculatePerformanceMetrics(jobResults, errors, scenario);

  // Determine if test passed
  const passed = metrics.successRate >= scenario.expectedSuccessRate &&
                 metrics.averageCompletionTime <= scenario.maxCompletionTime &&
                 errors.length / scenario.jobs <= (1 - scenario.expectedSuccessRate);

  const result: LoadTestResult = {
    scenario: scenario.name,
    metrics,
    startTime,
    endTime,
    duration,
    passed,
    errors
  };

  console.log(`✅ Load test completed: ${scenario.name}`);
  console.log(`📈 Success rate: ${(metrics.successRate * 100).toFixed(2)}%`);
  console.log(`⏱️  Average completion time: ${metrics.averageCompletionTime.toFixed(2)}ms`);
  console.log(`💰 Total cost: $${metrics.costAnalysis.totalCost.toFixed(2)}`);

  return result;
}

async function createQuantumJob(scenario: any, jobId: number): Promise<any> {
  const startTime = Date.now();
  
  try {
    // Create quantum circuit based on scenario
    const circuit = await generateCircuitForScenario(scenario, jobId);
    
    // Submit job to Azure Quantum
    const backend = scenario.providers ? 
      scenario.providers[jobId % scenario.providers.length] : 
      'ionq.simulator';
    
    const jobStatus = await azureQuantum.submitQuantumJob(circuit, backend);
    
    // Wait for completion
    let finalStatus = jobStatus;
    while (finalStatus.status === 'queued' || finalStatus.status === 'running') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      finalStatus = await azureQuantum.getJobStatus(jobStatus.id);
      
      // Check timeout
      if (Date.now() - startTime > scenario.maxCompletionTime) {
        throw new Error('Job timeout');
      }
    }
    
    const completionTime = Date.now() - startTime;
    
    return {
      jobId,
      status: finalStatus.status,
      completionTime,
      cost: finalStatus.cost || 0,
      backend,
      result: finalStatus.result,
      error: finalStatus.error
    };
    
  } catch (error) {
    const completionTime = Date.now() - startTime;
    throw new Error(`Job ${jobId} failed: ${error.message} (${completionTime}ms)`);
  }
}

async function generateCircuitForScenario(scenario: any, jobId: number): Promise<any> {
  const circuitTemplates = {
    bell_state: {
      id: `bell-state-${jobId}`,
      name: `Bell State ${jobId}`,
      code: `from qiskit import QuantumCircuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure_all()`,
      language: 'qiskit' as const,
      qubits: 2,
      depth: 3,
      gates: 3
    },
    grover: {
      id: `grover-${jobId}`,
      name: `Grover Algorithm ${jobId}`,
      code: `from qiskit import QuantumCircuit
qc = QuantumCircuit(3, 3)
qc.h([0, 1, 2])
qc.x([0, 1, 2])
qc.h(2)
qc.ccx(0, 1, 2)
qc.h(2)
qc.x([0, 1, 2])
qc.h([0, 1, 2])
qc.measure_all()`,
      language: 'qiskit' as const,
      qubits: 3,
      depth: 8,
      gates: 12
    },
    teleportation: {
      id: `teleportation-${jobId}`,
      name: `Quantum Teleportation ${jobId}`,
      code: `from qiskit import QuantumCircuit
qc = QuantumCircuit(3, 3)
qc.h(1)
qc.cx(1, 2)
qc.cx(0, 1)
qc.h(0)
qc.measure([0, 1], [0, 1])
qc.cx(1, 2)
qc.cz(0, 2)
qc.measure(2, 2)`,
      language: 'qiskit' as const,
      qubits: 3,
      depth: 7,
      gates: 8
    },
    large_quantum_circuit: {
      id: `large-circuit-${jobId}`,
      name: `Large Quantum Circuit ${jobId}`,
      code: `from qiskit import QuantumCircuit
qc = QuantumCircuit(5, 5)
for i in range(5):
    qc.h(i)
for i in range(4):
    qc.cx(i, i+1)
for i in range(5):
    qc.rz(0.1, i)
for i in range(4):
    qc.cx(i, i+1)
qc.measure_all()`,
      language: 'qiskit' as const,
      qubits: 5,
      depth: 15,
      gates: 20
    }
  };

  if (scenario.circuit) {
    return circuitTemplates[scenario.circuit as keyof typeof circuitTemplates];
  } else if (scenario.circuits) {
    const circuitType = scenario.circuits[jobId % scenario.circuits.length];
    return circuitTemplates[circuitType as keyof typeof circuitTemplates];
  } else {
    return circuitTemplates.bell_state;
  }
}

function calculatePerformanceMetrics(jobResults: any[], errors: string[], scenario: any): PerformanceMetrics {
  const successfulJobs = jobResults.filter(job => job.status === 'completed');
  const failedJobs = jobResults.filter(job => job.status === 'failed' || job.error);
  const totalJobs = jobResults.length;
  
  const completionTimes = successfulJobs.map(job => job.completionTime);
  const costs = jobResults.map(job => job.cost || 0);
  
  // Calculate statistics
  const successRate = successfulJobs.length / totalJobs;
  const averageCompletionTime = completionTimes.length > 0 ? 
    completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length : 0;
  
  // Calculate percentiles
  const sortedTimes = [...completionTimes].sort((a, b) => a - b);
  const medianCompletionTime = sortedTimes.length > 0 ? 
    sortedTimes[Math.floor(sortedTimes.length / 2)] : 0;
  const p95CompletionTime = sortedTimes.length > 0 ? 
    sortedTimes[Math.floor(sortedTimes.length * 0.95)] : 0;
  const p99CompletionTime = sortedTimes.length > 0 ? 
    sortedTimes[Math.floor(sortedTimes.length * 0.99)] : 0;
  
  // Error distribution
  const errorDistribution: Record<string, number> = {
    timeout: errors.filter(e => e.includes('timeout')).length,
    validation_error: errors.filter(e => e.includes('validation')).length,
    provider_error: errors.filter(e => e.includes('provider')).length,
    network_error: errors.filter(e => e.includes('network')).length,
    other: errors.filter(e => !e.includes('timeout') && !e.includes('validation') && 
                             !e.includes('provider') && !e.includes('network')).length
  };
  
  // Provider performance
  const providerPerformance: Record<string, any> = {};
  jobResults.forEach(job => {
    if (!providerPerformance[job.backend]) {
      providerPerformance[job.backend] = {
        totalJobs: 0,
        successfulJobs: 0,
        averageCompletionTime: 0,
        totalCost: 0
      };
    }
    
    providerPerformance[job.backend].totalJobs++;
    if (job.status === 'completed') {
      providerPerformance[job.backend].successfulJobs++;
      providerPerformance[job.backend].averageCompletionTime += job.completionTime;
    }
    providerPerformance[job.backend].totalCost += job.cost || 0;
  });
  
  // Calculate provider averages
  Object.keys(providerPerformance).forEach(provider => {
    const perf = providerPerformance[provider];
    if (perf.successfulJobs > 0) {
      perf.averageCompletionTime /= perf.successfulJobs;
    }
    perf.successRate = perf.successfulJobs / perf.totalJobs;
  });
  
  // Cost analysis
  const totalCost = costs.reduce((a, b) => a + b, 0);
  const averageCostPerJob = totalCost / totalJobs;
  const costPerProvider: Record<string, number> = {};
  Object.keys(providerPerformance).forEach(provider => {
    costPerProvider[provider] = providerPerformance[provider].totalCost;
  });
  
  return {
    totalJobs,
    successfulJobs: successfulJobs.length,
    failedJobs: failedJobs.length,
    successRate,
    averageCompletionTime,
    medianCompletionTime,
    p95CompletionTime,
    p99CompletionTime,
    errorDistribution,
    providerPerformance,
    costAnalysis: {
      totalCost,
      averageCostPerJob,
      costPerProvider
    }
  };
}

function generateLoadTestReport(results: LoadTestResult[]): void {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: results.length,
      passedTests: results.filter(r => r.passed).length,
      failedTests: results.filter(r => !r.passed).length,
      overallSuccessRate: results.filter(r => r.passed).length / results.length
    },
    results: results.map(result => ({
      scenario: result.scenario,
      passed: result.passed,
      successRate: result.metrics.successRate,
      averageCompletionTime: result.metrics.averageCompletionTime,
      totalCost: result.metrics.costAnalysis.totalCost,
      duration: result.duration,
      errors: result.errors.length
    })),
    recommendations: generateRecommendations(results)
  };
  
  // Save report to file
  const fs = require('fs');
  const reportPath = 'tests/quantum/load-test-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📊 Load test report generated: ${reportPath}`);
}

function generateRecommendations(results: LoadTestResult[]): string[] {
  const recommendations: string[] = [];
  
  // Analyze results and generate recommendations
  const avgSuccessRate = results.reduce((sum, r) => sum + r.metrics.successRate, 0) / results.length;
  const avgCompletionTime = results.reduce((sum, r) => sum + r.metrics.averageCompletionTime, 0) / results.length;
  const totalCost = results.reduce((sum, r) => sum + r.metrics.costAnalysis.totalCost, 0);
  
  if (avgSuccessRate < 0.95) {
    recommendations.push("Consider optimizing error handling and retry mechanisms");
  }
  
  if (avgCompletionTime > 30000) {
    recommendations.push("Investigate performance bottlenecks in quantum job processing");
  }
  
  if (totalCost > 100) {
    recommendations.push("Implement cost optimization strategies for quantum computing");
  }
  
  if (results.some(r => r.errors.length > 10)) {
    recommendations.push("Review and improve error handling for high-load scenarios");
  }
  
  return recommendations;
} 