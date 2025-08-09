import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from './enterprise-security';
import { QuantumSafeCrypto } from './quantum-safe-crypto';
import { QuantumAnalytics } from './quantum-analytics';
import { QuantumHybridSystems } from './quantum-hybrid-systems';
import { AdvancedQuantumSecurity } from './advanced-quantum-security';

// Quantum Infrastructure Optimization
export interface QuantumCloudIntegration {
  id: string;
  name: string;
  provider: 'ibm_quantum' | 'aws_braket' | 'azure_quantum' | 'google_quantum' | 'custom';
  service: 'quantum_computing' | 'quantum_simulator' | 'quantum_annealing' | 'quantum_key_distribution';
  region: string;
  qubits: number;
  connectivity: 'dedicated' | 'shared' | 'hybrid';
  latency: number; // milliseconds
  throughput: number; // MB/s
  costPerHour: number; // USD
  isActive: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface QuantumHardwareOptimization {
  id: string;
  name: string;
  hardwareType: 'superconducting' | 'trapped_ion' | 'photonics' | 'quantum_dots' | 'neutral_atoms';
  optimizationType: 'gate_fidelity' | 'coherence_time' | 'error_correction' | 'scalability' | 'connectivity';
  currentPerformance: {
    gateFidelity: number; // percentage
    coherenceTime: number; // microseconds
    errorRate: number; // percentage
    qubitCount: number;
  };
  optimizedPerformance: {
    gateFidelity: number; // percentage
    coherenceTime: number; // microseconds
    errorRate: number; // percentage
    qubitCount: number;
  };
  improvement: number; // percentage
  optimizationTime: number; // hours
  cost: number; // USD
  isActive: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface EnterpriseQuantumDeployment {
  id: string;
  name: string;
  deploymentType: 'on_premises' | 'hybrid' | 'cloud_native' | 'edge_computing';
  infrastructure: {
    servers: number;
    quantumProcessors: number;
    storage: number; // TB
    network: number; // Gbps
  };
  security: {
    encryptionLevel: '128' | '192' | '256';
    quantumResistance: number; // percentage
    complianceStandards: string[];
    auditFrequency: string;
  };
  performance: {
    throughput: number; // operations/second
    latency: number; // milliseconds
    availability: number; // percentage
    scalability: number; // percentage
  };
  cost: {
    initialInvestment: number; // USD
    operationalCost: number; // USD/month
    maintenanceCost: number; // USD/month
    roi: number; // percentage
  };
  isActive: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface QuantumResourceManagement {
  id: string;
  name: string;
  resourceType: 'qubits' | 'memory' | 'network' | 'storage' | 'compute';
  allocation: {
    total: number;
    allocated: number;
    available: number;
    reserved: number;
  };
  utilization: {
    current: number; // percentage
    peak: number; // percentage
    average: number; // percentage
    efficiency: number; // percentage
  };
  optimization: {
    autoScaling: boolean;
    loadBalancing: boolean;
    resourcePooling: boolean;
    predictiveAllocation: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface QuantumPerformanceMonitoring {
  id: string;
  name: string;
  metricType: 'quantum_advantage' | 'error_rates' | 'coherence_times' | 'gate_fidelities' | 'throughput';
  currentValue: number;
  targetValue: number;
  threshold: number;
  alertLevel: 'normal' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface QuantumInfrastructureMetrics {
  id: string;
  timestamp: Date;
  totalCloudIntegrations: number;
  activeCloudIntegrations: number;
  totalHardwareOptimizations: number;
  activeHardwareOptimizations: number;
  totalDeployments: number;
  activeDeployments: number;
  totalResources: number;
  allocatedResources: number;
  totalMonitoring: number;
  alertCount: number;
  averagePerformance: number;
  averageCost: number;
}

export class QuantumInfrastructure {
  private securityService: EnterpriseSecurityService;
  private quantumCrypto: QuantumSafeCrypto;
  private quantumAnalytics: QuantumAnalytics;
  private quantumHybrid: QuantumHybridSystems;
  private quantumSecurity: AdvancedQuantumSecurity;
  private cloudIntegrations: Map<string, QuantumCloudIntegration> = new Map();
  private hardwareOptimizations: Map<string, QuantumHardwareOptimization> = new Map();
  private deployments: Map<string, EnterpriseQuantumDeployment> = new Map();
  private resourceManagement: Map<string, QuantumResourceManagement> = new Map();
  private performanceMonitoring: Map<string, QuantumPerformanceMonitoring> = new Map();
  private metrics: Map<string, QuantumInfrastructureMetrics> = new Map();

  constructor(
    securityService: EnterpriseSecurityService,
    quantumCrypto: QuantumSafeCrypto,
    quantumAnalytics: QuantumAnalytics,
    quantumHybrid: QuantumHybridSystems,
    quantumSecurity: AdvancedQuantumSecurity
  ) {
    this.securityService = securityService;
    this.quantumCrypto = quantumCrypto;
    this.quantumAnalytics = quantumAnalytics;
    this.quantumHybrid = quantumHybrid;
    this.quantumSecurity = quantumSecurity;
  }

  async integrateQuantumCloud(
    name: string,
    provider: 'ibm_quantum' | 'aws_braket' | 'azure_quantum' | 'google_quantum' | 'custom',
    service: 'quantum_computing' | 'quantum_simulator' | 'quantum_annealing' | 'quantum_key_distribution',
    region: string,
    qubits: number
  ): Promise<QuantumCloudIntegration> {
    const integrationId = `qci_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate cloud integration performance
    const connectivity = this.getConnectivityType(provider);
    const latency = Math.random() * 100 + 10; // 10-110ms
    const throughput = Math.random() * 1000 + 100; // 100-1100 MB/s
    const costPerHour = this.getCostPerHour(provider, service, qubits);

    const integration: QuantumCloudIntegration = {
      id: integrationId,
      name,
      provider,
      service,
      region,
      qubits,
      connectivity,
      latency,
      throughput,
      costPerHour,
      isActive: true,
      createdAt: new Date(),
      metadata: {
        apiVersion: this.getAPIVersion(provider),
        supportedAlgorithms: this.getSupportedAlgorithms(provider),
        maxCircuitDepth: Math.floor(Math.random() * 1000) + 100,
        maxShots: Math.floor(Math.random() * 10000) + 1000,
        quantumVolume: Math.floor(Math.random() * 100) + 10
      }
    };

    this.cloudIntegrations.set(integrationId, integration);

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'quantum_cloud_integration_established',
      resource: 'quantum-infrastructure',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { integrationId, name, provider, service, qubits },
      severity: 'medium'
    });

    return integration;
  }

  async optimizeQuantumHardware(
    name: string,
    hardwareType: 'superconducting' | 'trapped_ion' | 'photonics' | 'quantum_dots' | 'neutral_atoms',
    optimizationType: 'gate_fidelity' | 'coherence_time' | 'error_correction' | 'scalability' | 'connectivity'
  ): Promise<QuantumHardwareOptimization> {
    const optimizationId = `qho_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate hardware optimization
    const currentPerformance = {
      gateFidelity: Math.random() * 0.1 + 0.9, // 90-100%
      coherenceTime: Math.random() * 100 + 50, // 50-150 μs
      errorRate: Math.random() * 0.05 + 0.01, // 1-6%
      qubitCount: Math.floor(Math.random() * 50) + 10 // 10-60 qubits
    };

    const optimizedPerformance = {
      gateFidelity: currentPerformance.gateFidelity * (1 + Math.random() * 0.1), // 0-10% improvement
      coherenceTime: currentPerformance.coherenceTime * (1 + Math.random() * 0.2), // 0-20% improvement
      errorRate: currentPerformance.errorRate * (1 - Math.random() * 0.3), // 0-30% reduction
      qubitCount: currentPerformance.qubitCount + Math.floor(Math.random() * 10) // 0-10 more qubits
    };

    const improvement = Math.random() * 0.3 + 0.1; // 10-40% improvement
    const optimizationTime = Math.random() * 48 + 24; // 24-72 hours
    const cost = Math.random() * 100000 + 50000; // $50k-$150k

    const optimization: QuantumHardwareOptimization = {
      id: optimizationId,
      name,
      hardwareType,
      optimizationType,
      currentPerformance,
      optimizedPerformance,
      improvement,
      optimizationTime,
      cost,
      isActive: true,
      createdAt: new Date(),
      metadata: {
        temperature: Math.random() * 20 + 10, // 10-30°C
        magneticField: Math.random() * 10 + 1, // 1-11 Tesla
        vacuumPressure: Math.random() * 1e-10 + 1e-11, // 1e-11 to 1e-10 Pa
        coolingSystem: this.getCoolingSystem(hardwareType)
      }
    };

    this.hardwareOptimizations.set(optimizationId, optimization);

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'quantum_hardware_optimization_performed',
      resource: 'quantum-infrastructure',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { optimizationId, name, hardwareType, improvement },
      severity: 'medium'
    });

    return optimization;
  }

  async deployEnterpriseQuantum(
    name: string,
    deploymentType: 'on_premises' | 'hybrid' | 'cloud_native' | 'edge_computing',
    servers: number,
    quantumProcessors: number,
    storage: number, // TB
    network: number // Gbps
  ): Promise<EnterpriseQuantumDeployment> {
    const deploymentId = `eqd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate enterprise deployment
    const initialInvestment = (servers * 50000) + (quantumProcessors * 1000000) + (storage * 1000) + (network * 10000);
    const operationalCost = initialInvestment * 0.02; // 2% monthly operational cost
    const maintenanceCost = initialInvestment * 0.01; // 1% monthly maintenance cost
    const roi = Math.random() * 0.5 + 0.2; // 20-70% ROI

    const deployment: EnterpriseQuantumDeployment = {
      id: deploymentId,
      name,
      deploymentType,
      infrastructure: {
        servers,
        quantumProcessors,
        storage,
        network
      },
      security: {
        encryptionLevel: this.determineEncryptionLevel(quantumProcessors),
        quantumResistance: Math.random() * 0.3 + 0.7, // 70-100% resistance
        complianceStandards: this.getComplianceStandards(deploymentType),
        auditFrequency: this.getAuditFrequency(deploymentType)
      },
      performance: {
        throughput: Math.random() * 10000 + 1000, // 1000-11000 ops/sec
        latency: Math.random() * 50 + 10, // 10-60ms
        availability: Math.random() * 0.1 + 0.99, // 99-99.9%
        scalability: Math.random() * 0.3 + 0.7 // 70-100%
      },
      cost: {
        initialInvestment,
        operationalCost,
        maintenanceCost,
        roi
      },
      isActive: true,
      createdAt: new Date(),
      metadata: {
        deploymentTime: Math.random() * 30 + 7, // 7-37 days
        teamSize: Math.floor(Math.random() * 20) + 5, // 5-25 people
        trainingHours: Math.random() * 100 + 50, // 50-150 hours
        documentationPages: Math.floor(Math.random() * 500) + 100 // 100-600 pages
      }
    };

    this.deployments.set(deploymentId, deployment);

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'enterprise_quantum_deployed',
      resource: 'quantum-infrastructure',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { deploymentId, name, deploymentType, initialInvestment },
      severity: 'high'
    });

    return deployment;
  }

  async manageQuantumResources(
    name: string,
    resourceType: 'qubits' | 'memory' | 'network' | 'storage' | 'compute',
    total: number,
    allocated: number = 0
  ): Promise<QuantumResourceManagement> {
    const resourceId = `qrm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const available = total - allocated;
    const reserved = Math.floor(total * 0.1); // 10% reserved
    const current = (allocated / total) * 100;
    const peak = current * (1 + Math.random() * 0.5); // 0-50% higher than current
    const average = current * (1 + Math.random() * 0.2 - 0.1); // ±10% of current
    const efficiency = Math.random() * 0.3 + 0.7; // 70-100% efficiency

    const resource: QuantumResourceManagement = {
      id: resourceId,
      name,
      resourceType,
      allocation: {
        total,
        allocated,
        available,
        reserved
      },
      utilization: {
        current,
        peak,
        average,
        efficiency
      },
      optimization: {
        autoScaling: Math.random() > 0.5,
        loadBalancing: Math.random() > 0.5,
        resourcePooling: Math.random() > 0.5,
        predictiveAllocation: Math.random() > 0.5
      },
      isActive: true,
      createdAt: new Date(),
      metadata: {
        resourceClass: this.getResourceClass(resourceType),
        priority: this.getResourcePriority(resourceType),
        backupStrategy: this.getBackupStrategy(resourceType),
        monitoringInterval: Math.floor(Math.random() * 60) + 30 // 30-90 seconds
      }
    };

    this.resourceManagement.set(resourceId, resource);

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'quantum_resource_managed',
      resource: 'quantum-infrastructure',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { resourceId, name, resourceType, total, allocated },
      severity: 'low'
    });

    return resource;
  }

  async monitorQuantumPerformance(
    name: string,
    metricType: 'quantum_advantage' | 'error_rates' | 'coherence_times' | 'gate_fidelities' | 'throughput',
    currentValue: number,
    targetValue: number
  ): Promise<QuantumPerformanceMonitoring> {
    const monitoringId = `qpm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const threshold = targetValue * 0.9; // 90% of target
    const alertLevel = currentValue < threshold ? 'critical' : currentValue < targetValue ? 'warning' : 'normal';
    const trend = currentValue > targetValue ? 'improving' : currentValue < targetValue * 0.8 ? 'declining' : 'stable';

    const monitoring: QuantumPerformanceMonitoring = {
      id: monitoringId,
      name,
      metricType,
      currentValue,
      targetValue,
      threshold,
      alertLevel,
      trend,
      timestamp: new Date(),
      metadata: {
        measurementAccuracy: Math.random() * 0.1 + 0.9, // 90-100% accuracy
        samplingRate: Math.floor(Math.random() * 100) + 10, // 10-110 samples/second
        calibrationStatus: Math.random() > 0.2, // 80% chance of calibrated
        lastCalibration: new Date(Date.now() - Math.random() * 86400000) // 0-24 hours ago
      }
    };

    this.performanceMonitoring.set(monitoringId, monitoring);

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'quantum_performance_monitored',
      resource: 'quantum-infrastructure',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { monitoringId, name, metricType, currentValue, alertLevel },
      severity: alertLevel === 'critical' ? 'high' : 'low'
    });

    return monitoring;
  }

  async trackInfrastructureMetrics(): Promise<QuantumInfrastructureMetrics> {
    const activeCloudIntegrations = Array.from(this.cloudIntegrations.values()).filter(c => c.isActive).length;
    const activeHardwareOptimizations = Array.from(this.hardwareOptimizations.values()).filter(h => h.isActive).length;
    const activeDeployments = Array.from(this.deployments.values()).filter(d => d.isActive).length;
    const allocatedResources = Array.from(this.resourceManagement.values()).reduce((sum, r) => sum + r.allocation.allocated, 0);
    const alertCount = Array.from(this.performanceMonitoring.values()).filter(p => p.alertLevel !== 'normal').length;

    const averagePerformance = this.performanceMonitoring.size > 0
      ? Array.from(this.performanceMonitoring.values()).reduce((sum, p) => sum + (p.currentValue / p.targetValue), 0) / this.performanceMonitoring.size
      : 0;

    const averageCost = this.deployments.size > 0
      ? Array.from(this.deployments.values()).reduce((sum, d) => sum + d.cost.operationalCost, 0) / this.deployments.size
      : 0;

    const metrics: QuantumInfrastructureMetrics = {
      id: `qim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      totalCloudIntegrations: this.cloudIntegrations.size,
      activeCloudIntegrations,
      totalHardwareOptimizations: this.hardwareOptimizations.size,
      activeHardwareOptimizations,
      totalDeployments: this.deployments.size,
      activeDeployments,
      totalResources: Array.from(this.resourceManagement.values()).reduce((sum, r) => sum + r.allocation.total, 0),
      allocatedResources,
      totalMonitoring: this.performanceMonitoring.size,
      alertCount,
      averagePerformance,
      averageCost
    };

    this.metrics.set(metrics.id, metrics);

    return metrics;
  }

  // Helper methods
  private getConnectivityType(provider: string): 'dedicated' | 'shared' | 'hybrid' {
    const connectivity: Record<string, 'dedicated' | 'shared' | 'hybrid'> = {
      'ibm_quantum': 'dedicated',
      'aws_braket': 'shared',
      'azure_quantum': 'hybrid',
      'google_quantum': 'dedicated',
      'custom': 'hybrid'
    };
    return connectivity[provider] || 'shared';
  }

  private getCostPerHour(provider: string, service: string, qubits: number): number {
    const baseCosts: Record<string, number> = {
      'ibm_quantum': 0.1,
      'aws_braket': 0.15,
      'azure_quantum': 0.12,
      'google_quantum': 0.18,
      'custom': 0.2
    };
    const baseCost = baseCosts[provider] || 0.15;
    return baseCost * qubits * (service === 'quantum_computing' ? 1 : 0.5);
  }

  private getAPIVersion(provider: string): string {
    const versions: Record<string, string> = {
      'ibm_quantum': 'v1.0',
      'aws_braket': 'v1.1',
      'azure_quantum': 'v1.0',
      'google_quantum': 'v1.2',
      'custom': 'v1.0'
    };
    return versions[provider] || 'v1.0';
  }

  private getSupportedAlgorithms(provider: string): string[] {
    const algorithms: Record<string, string[]> = {
      'ibm_quantum': ['Qiskit', 'OpenQASM', 'Qiskit Runtime'],
      'aws_braket': ['Amazon Braket', 'PennyLane', 'Cirq'],
      'azure_quantum': ['Q#', 'Qiskit', 'Cirq'],
      'google_quantum': ['Cirq', 'OpenFermion', 'TensorFlow Quantum'],
      'custom': ['Custom API', 'Qiskit', 'Cirq']
    };
    return algorithms[provider] || ['Generic API'];
  }

  private getCoolingSystem(hardwareType: string): string {
    const cooling: Record<string, string> = {
      'superconducting': 'Dilution Refrigerator',
      'trapped_ion': 'Laser Cooling',
      'photonics': 'Thermal Management',
      'quantum_dots': 'Cryogenic Cooling',
      'neutral_atoms': 'Laser Cooling'
    };
    return cooling[hardwareType] || 'Standard Cooling';
  }

  private determineEncryptionLevel(quantumProcessors: number): '128' | '192' | '256' {
    if (quantumProcessors >= 100) return '256';
    if (quantumProcessors >= 50) return '192';
    return '128';
  }

  private getComplianceStandards(deploymentType: string): string[] {
    const standards: Record<string, string[]> = {
      'on_premises': ['ISO 27001', 'SOC 2', 'NIST CSF'],
      'hybrid': ['ISO 27001', 'SOC 2', 'NIST CSF', 'Cloud Security'],
      'cloud_native': ['ISO 27001', 'SOC 2', 'Cloud Security', 'GDPR'],
      'edge_computing': ['ISO 27001', 'Edge Security', 'IoT Security']
    };
    return standards[deploymentType] || ['ISO 27001'];
  }

  private getAuditFrequency(deploymentType: string): string {
    const frequencies: Record<string, string> = {
      'on_premises': 'Quarterly',
      'hybrid': 'Monthly',
      'cloud_native': 'Continuous',
      'edge_computing': 'Weekly'
    };
    return frequencies[deploymentType] || 'Quarterly';
  }

  private getResourceClass(resourceType: string): string {
    const classes: Record<string, string> = {
      'qubits': 'Quantum',
      'memory': 'Classical',
      'network': 'Infrastructure',
      'storage': 'Classical',
      'compute': 'Hybrid'
    };
    return classes[resourceType] || 'Generic';
  }

  private getResourcePriority(resourceType: string): string {
    const priorities: Record<string, string> = {
      'qubits': 'Critical',
      'memory': 'High',
      'network': 'Medium',
      'storage': 'Medium',
      'compute': 'High'
    };
    return priorities[resourceType] || 'Medium';
  }

  private getBackupStrategy(resourceType: string): string {
    const strategies: Record<string, string> = {
      'qubits': 'Quantum Error Correction',
      'memory': 'Redundant Storage',
      'network': 'Multiple Paths',
      'storage': 'RAID Configuration',
      'compute': 'Load Balancing'
    };
    return strategies[resourceType] || 'Standard Backup';
  }

  // Analytics and reporting methods
  async getCloudIntegrations(): Promise<QuantumCloudIntegration[]> {
    return Array.from(this.cloudIntegrations.values());
  }

  async getHardwareOptimizations(): Promise<QuantumHardwareOptimization[]> {
    return Array.from(this.hardwareOptimizations.values());
  }

  async getDeployments(): Promise<EnterpriseQuantumDeployment[]> {
    return Array.from(this.deployments.values());
  }

  async getResourceManagement(): Promise<QuantumResourceManagement[]> {
    return Array.from(this.resourceManagement.values());
  }

  async getPerformanceMonitoring(): Promise<QuantumPerformanceMonitoring[]> {
    return Array.from(this.performanceMonitoring.values());
  }

  async getMetrics(): Promise<QuantumInfrastructureMetrics[]> {
    return Array.from(this.metrics.values());
  }

  async generateInfrastructureReport(): Promise<{
    totalCloudIntegrations: number;
    activeCloudIntegrations: number;
    totalHardwareOptimizations: number;
    activeHardwareOptimizations: number;
    totalDeployments: number;
    activeDeployments: number;
    totalResources: number;
    allocatedResources: number;
    totalMonitoring: number;
    alertCount: number;
    averagePerformance: number;
    averageCost: number;
    providerDistribution: Record<string, number>;
    deploymentTypeDistribution: Record<string, number>;
  }> {
    const cloudIntegrations = Array.from(this.cloudIntegrations.values());
    const hardwareOptimizations = Array.from(this.hardwareOptimizations.values());
    const deployments = Array.from(this.deployments.values());
    const resourceManagement = Array.from(this.resourceManagement.values());
    const performanceMonitoring = Array.from(this.performanceMonitoring.values());

    const providerDistribution: Record<string, number> = {};
    const deploymentTypeDistribution: Record<string, number> = {};

    cloudIntegrations.forEach(integration => {
      providerDistribution[integration.provider] = (providerDistribution[integration.provider] || 0) + 1;
    });

    deployments.forEach(deployment => {
      deploymentTypeDistribution[deployment.deploymentType] = (deploymentTypeDistribution[deployment.deploymentType] || 0) + 1;
    });

    const totalResources = resourceManagement.reduce((sum, r) => sum + r.allocation.total, 0);
    const allocatedResources = resourceManagement.reduce((sum, r) => sum + r.allocation.allocated, 0);
    const alertCount = performanceMonitoring.filter(p => p.alertLevel !== 'normal').length;

    const averagePerformance = performanceMonitoring.length > 0
      ? performanceMonitoring.reduce((sum, p) => sum + (p.currentValue / p.targetValue), 0) / performanceMonitoring.length
      : 0;

    const averageCost = deployments.length > 0
      ? deployments.reduce((sum, d) => sum + d.cost.operationalCost, 0) / deployments.length
      : 0;

    return {
      totalCloudIntegrations: cloudIntegrations.length,
      activeCloudIntegrations: cloudIntegrations.filter(c => c.isActive).length,
      totalHardwareOptimizations: hardwareOptimizations.length,
      activeHardwareOptimizations: hardwareOptimizations.filter(h => h.isActive).length,
      totalDeployments: deployments.length,
      activeDeployments: deployments.filter(d => d.isActive).length,
      totalResources,
      allocatedResources,
      totalMonitoring: performanceMonitoring.length,
      alertCount,
      averagePerformance,
      averageCost,
      providerDistribution,
      deploymentTypeDistribution
    };
  }

  // Public methods for external access
  getCloudIntegrationById(integrationId: string): QuantumCloudIntegration | undefined {
    return this.cloudIntegrations.get(integrationId);
  }

  getHardwareOptimizationById(optimizationId: string): QuantumHardwareOptimization | undefined {
    return this.hardwareOptimizations.get(optimizationId);
  }

  getDeploymentById(deploymentId: string): EnterpriseQuantumDeployment | undefined {
    return this.deployments.get(deploymentId);
  }

  getResourceManagementById(resourceId: string): QuantumResourceManagement | undefined {
    return this.resourceManagement.get(resourceId);
  }

  getPerformanceMonitoringById(monitoringId: string): QuantumPerformanceMonitoring | undefined {
    return this.performanceMonitoring.get(monitoringId);
  }

  getMetricsById(metricsId: string): QuantumInfrastructureMetrics | undefined {
    return this.metrics.get(metricsId);
  }

  isCloudIntegrationActive(integrationId: string): boolean {
    const integration = this.cloudIntegrations.get(integrationId);
    return integration?.isActive || false;
  }

  isHardwareOptimizationActive(optimizationId: string): boolean {
    const optimization = this.hardwareOptimizations.get(optimizationId);
    return optimization?.isActive || false;
  }

  isDeploymentActive(deploymentId: string): boolean {
    const deployment = this.deployments.get(deploymentId);
    return deployment?.isActive || false;
  }

  isResourceManagementActive(resourceId: string): boolean {
    const resource = this.resourceManagement.get(resourceId);
    return resource?.isActive || false;
  }
} 