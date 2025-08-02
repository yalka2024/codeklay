import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { AzureQuantumService } from '../../lib/azure-quantum';
import { QuantumWorkflowAgent } from '../../packages/ai-agents/src/agents/QuantumWorkflowAgent';

// Mock environment variables for testing
process.env.AZURE_SUBSCRIPTION_ID = 'test-subscription-id';
process.env.AZURE_RESOURCE_GROUP = 'test-resource-group';
process.env.AZURE_QUANTUM_WORKSPACE = 'test-workspace';
process.env.AZURE_LOCATION = 'westus';

describe('Quantum Computing Integration Tests', () => {
  let azureQuantum: AzureQuantumService;
  let quantumAgent: QuantumWorkflowAgent;

  beforeAll(async () => {
    // Initialize Azure Quantum service
    azureQuantum = new AzureQuantumService({
      subscriptionId: process.env.AZURE_SUBSCRIPTION_ID!,
      resourceGroup: process.env.AZURE_RESOURCE_GROUP!,
      workspaceName: process.env.AZURE_QUANTUM_WORKSPACE!,
      location: process.env.AZURE_LOCATION!
    });

    // Initialize Quantum Workflow Agent
    quantumAgent = new QuantumWorkflowAgent(
      { name: 'test-quantum-agent' },
      'test-qiskit-key',
      'test-deepseek-key'
    );

    await quantumAgent.start();
  });

  afterAll(async () => {
    await quantumAgent.stop();
    await azureQuantum.cleanup();
  });

  describe('Azure Quantum Service', () => {
    it('should initialize Azure Quantum service', () => {
      expect(azureQuantum).toBeDefined();
    });

    it('should get available backends', async () => {
      const backends = await azureQuantum.getBackends();
      expect(backends).toBeDefined();
      expect(Array.isArray(backends)).toBe(true);
      expect(backends.length).toBeGreaterThan(0);

      // Check for expected backends
      const backendNames = backends.map(b => b.name);
      expect(backendNames).toContain('ionq.simulator');
      expect(backendNames).toContain('pasqal.simulator');
    });

    it('should validate quantum circuit', async () => {
      const circuit = {
        id: 'test-circuit',
        name: 'Test Bell State',
        code: 'from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()',
        language: 'qiskit' as const,
        qubits: 2,
        depth: 3,
        gates: 3
      };

      const validation = await azureQuantum.validateCircuit(circuit, 'ionq.simulator');
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should estimate job cost', async () => {
      const circuit = {
        id: 'test-circuit',
        name: 'Test Circuit',
        code: 'from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()',
        language: 'qiskit' as const,
        qubits: 2,
        depth: 3,
        gates: 3
      };

      const cost = await azureQuantum.estimateJobCost(circuit, 'ionq.simulator');
      expect(cost).toBeGreaterThan(0);
      expect(typeof cost).toBe('number');
    });

    it('should submit and monitor quantum job', async () => {
      const circuit = {
        id: 'test-job-circuit',
        name: 'Test Job Circuit',
        code: 'from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()',
        language: 'qiskit' as const,
        qubits: 2,
        depth: 3,
        gates: 3
      };

      // Submit job
      const jobStatus = await azureQuantum.submitQuantumJob(circuit, 'ionq.simulator');
      expect(jobStatus).toBeDefined();
      expect(jobStatus.id).toBeDefined();
      expect(jobStatus.status).toBe('queued');

      // Monitor job
      const monitoredJob = await azureQuantum.getJobStatus(jobStatus.id);
      expect(monitoredJob).toBeDefined();
      expect(monitoredJob?.id).toBe(jobStatus.id);
    });

    it('should list jobs with filters', async () => {
      const jobs = await azureQuantum.listJobs({ status: 'completed' });
      expect(Array.isArray(jobs)).toBe(true);
    });

    it('should get quantum metrics', async () => {
      const metrics = await azureQuantum.getMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.totalJobs).toBeGreaterThanOrEqual(0);
      expect(metrics.successfulJobs).toBeGreaterThanOrEqual(0);
      expect(metrics.failedJobs).toBeGreaterThanOrEqual(0);
      expect(metrics.totalCost).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Quantum Workflow Agent', () => {
    it('should initialize quantum agent', () => {
      expect(quantumAgent).toBeDefined();
    });

    it('should generate quantum code from natural language', async () => {
      const naturalLanguage = 'Create a Bell state circuit with 2 qubits';
      const code = await quantumAgent.generateQuantumCode(naturalLanguage);
      
      expect(code).toBeDefined();
      expect(typeof code).toBe('string');
      expect(code.length).toBeGreaterThan(0);
      expect(code).toContain('QuantumCircuit');
    });

    it('should optimize quantum circuit', async () => {
      const originalCode = `
        from qiskit import QuantumCircuit
        qc = QuantumCircuit(3, 3)
        qc.h(0)
        qc.cx(0, 1)
        qc.cx(1, 2)
        qc.measure_all()
      `;

      const optimizedCode = await quantumAgent.optimizeQuantumCode(originalCode);
      expect(optimizedCode).toBeDefined();
      expect(typeof optimizedCode).toBe('string');
      expect(optimizedCode.length).toBeGreaterThan(0);
    });

    it('should predict quantum performance', async () => {
      const code = `
        from qiskit import QuantumCircuit
        qc = QuantumCircuit(2, 2)
        qc.h(0)
        qc.cx(0, 1)
        qc.measure_all()
      `;

      const simulation = await quantumAgent.predictQuantumPerformance(code);
      expect(simulation).toBeDefined();
      expect(simulation.id).toBeDefined();
      expect(simulation.status).toBe('completed');
      expect(simulation.predictedPerformance).toBeGreaterThan(0);
    });

    it('should create quantum algorithm', async () => {
      const algorithmData = {
        name: 'Test Algorithm',
        description: 'A test quantum algorithm',
        code: 'from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()',
        type: 'custom'
      };

      const algorithm = await quantumAgent.createQuantumAlgorithm(algorithmData);
      expect(algorithm).toBeDefined();
      expect(algorithm.id).toBeDefined();
      expect(algorithm.name).toBe(algorithmData.name);
      expect(algorithm.qubits).toBe(2);
      expect(algorithm.depth).toBe(3);
      expect(algorithm.gates).toBe(3);
    });

    it('should run quantum simulation', async () => {
      // First create an algorithm
      const algorithmData = {
        name: 'Test Simulation Algorithm',
        description: 'Algorithm for testing simulation',
        code: 'from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()',
        type: 'custom'
      };

      const algorithm = await quantumAgent.createQuantumAlgorithm(algorithmData);
      
      // Run simulation
      const simulation = await quantumAgent.runQuantumSimulation(algorithm.id, {}, 'aer_simulator');
      expect(simulation).toBeDefined();
      expect(simulation.algorithmId).toBe(algorithm.id);
      expect(simulation.status).toBe('completed');
    });

    it('should get quantum metrics', async () => {
      const metrics = await quantumAgent.getQuantumMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.algorithms).toBeDefined();
      expect(metrics.simulations).toBeDefined();
      expect(metrics.optimizations).toBeDefined();
    });

    it('should list algorithms and simulations', async () => {
      const algorithms = await quantumAgent.listAlgorithms();
      expect(Array.isArray(algorithms)).toBe(true);

      const simulations = await quantumAgent.listSimulations();
      expect(Array.isArray(simulations)).toBe(true);
    });
  });

  describe('API Integration', () => {
    it('should handle API requests for backends', async () => {
      // This would test the actual API endpoint
      // For now, we'll test the service directly
      const backends = await azureQuantum.getBackends();
      expect(backends).toBeDefined();
    });

    it('should handle API requests for job submission', async () => {
      const circuit = {
        id: 'api-test-circuit',
        name: 'API Test Circuit',
        code: 'from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()',
        language: 'qiskit' as const,
        qubits: 2,
        depth: 3,
        gates: 3
      };

      const jobStatus = await azureQuantum.submitQuantumJob(circuit, 'ionq.simulator');
      expect(jobStatus).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid circuit validation', async () => {
      const invalidCircuit = {
        id: 'invalid-circuit',
        name: 'Invalid Circuit',
        code: 'invalid quantum code',
        language: 'qiskit' as const,
        qubits: 1000, // Too many qubits
        depth: 1000,  // Too deep
        gates: 1000
      };

      const validation = await azureQuantum.validateCircuit(invalidCircuit, 'ionq.simulator');
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should handle non-existent job ID', async () => {
      const job = await azureQuantum.getJobStatus('non-existent-job-id');
      expect(job).toBeNull();
    });

    it('should handle invalid backend', async () => {
      const circuit = {
        id: 'test-circuit',
        name: 'Test Circuit',
        code: 'from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()',
        language: 'qiskit' as const,
        qubits: 2,
        depth: 3,
        gates: 3
      };

      await expect(azureQuantum.submitQuantumJob(circuit, 'invalid-backend'))
        .rejects.toThrow();
    });
  });

  describe('Performance Tests', () => {
    it('should generate quantum code within 5 seconds', async () => {
      const startTime = Date.now();
      await quantumAgent.generateQuantumCode('Create a simple quantum circuit');
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should optimize circuit within 10 seconds', async () => {
      const circuitCode = `
        from qiskit import QuantumCircuit
        qc = QuantumCircuit(3, 3)
        qc.h(0)
        qc.cx(0, 1)
        qc.cx(1, 2)
        qc.measure_all()
      `;

      const startTime = Date.now();
      await quantumAgent.optimizeQuantumCode(circuitCode);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(10000);
    });

    it('should validate circuit within 2 seconds', async () => {
      const circuit = {
        id: 'perf-test-circuit',
        name: 'Performance Test Circuit',
        code: 'from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()',
        language: 'qiskit' as const,
        qubits: 2,
        depth: 3,
        gates: 3
      };

      const startTime = Date.now();
      await azureQuantum.validateCircuit(circuit, 'ionq.simulator');
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(2000);
    });
  });

  describe('Security Tests', () => {
    it('should not expose sensitive information in logs', async () => {
      // This test ensures that sensitive data like API keys are not logged
      const consoleSpy = jest.spyOn(console, 'log');
      
      await quantumAgent.generateQuantumCode('test prompt');
      
      const loggedMessages = consoleSpy.mock.calls.flat();
      const sensitiveData = loggedMessages.some(msg => 
        typeof msg === 'string' && 
        (msg.includes('test-qiskit-key') || msg.includes('test-deepseek-key'))
      );
      
      expect(sensitiveData).toBe(false);
      consoleSpy.mockRestore();
    });

    it('should validate input parameters', async () => {
      // Test with invalid input
      await expect(quantumAgent.generateQuantumCode(''))
        .rejects.toThrow();
    });
  });
}); 