import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from './enterprise-security';
import { QuantumSafeCrypto } from './quantum-safe-crypto';

// Advanced Quantum Security System
export interface QuantumKeyDistribution {
  id: string;
  name: string;
  protocol: 'bb84' | 'e91' | 'b92' | 'six_state' | 'sarg04';
  alice: string;
  bob: string;
  keyLength: number;
  sharedKey: string;
  errorRate: number;
  siftedRate: number;
  finalRate: number;
  securityLevel: '128' | '192' | '256';
  distance: number; // km
  isActive: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface QuantumRandomNumberGenerator {
  id: string;
  name: string;
  method: 'photon_detection' | 'vacuum_fluctuations' | 'beam_splitter' | 'quantum_dots' | 'nuclear_decay';
  entropySource: string;
  outputLength: number;
  randomNumbers: string[];
  entropyRate: number; // bits per second
  minEntropy: number;
  statisticalTests: {
    frequency: boolean;
    runs: boolean;
    autocorrelation: boolean;
    blockFrequency: boolean;
    cumulativeSums: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface QuantumResistantBlockchain {
  id: string;
  name: string;
  consensus: 'proof_of_quantum_work' | 'proof_of_quantum_stake' | 'quantum_byzantine_fault_tolerance';
  quantumAlgorithm: 'lattice' | 'hash' | 'code' | 'multivariate' | 'isogeny';
  blockSize: number;
  blockTime: number; // seconds
  totalSupply: number;
  circulatingSupply: number;
  transactionThroughput: number; // TPS
  securityLevel: '128' | '192' | '256';
  quantumResistance: number; // percentage
  isActive: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface QuantumThreatDetection {
  id: string;
  name: string;
  threatType: 'shor_attack' | 'grover_attack' | 'quantum_annealing_attack' | 'quantum_walk_attack';
  targetAlgorithm: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  detectionMethod: 'signature_based' | 'anomaly_based' | 'behavior_based' | 'quantum_based';
  confidence: number; // percentage
  mitigationStrategy: string;
  isDetected: boolean;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface QuantumSecurityAudit {
  id: string;
  name: string;
  scope: 'cryptography' | 'blockchain' | 'communication' | 'comprehensive';
  auditType: 'penetration_test' | 'vulnerability_assessment' | 'compliance_check' | 'quantum_resistance_test';
  findings: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  recommendations: string[];
  complianceScore: number; // percentage
  quantumResistanceScore: number; // percentage
  overallScore: number; // percentage
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface QuantumSecurityMetrics {
  id: string;
  timestamp: Date;
  totalQKD: number;
  activeQKD: number;
  totalQRNG: number;
  activeQRNG: number;
  totalBlockchains: number;
  activeBlockchains: number;
  totalThreats: number;
  detectedThreats: number;
  totalAudits: number;
  averageComplianceScore: number;
  averageQuantumResistanceScore: number;
  averageSecurityScore: number;
}

export class AdvancedQuantumSecurity {
  private securityService: EnterpriseSecurityService;
  private quantumCrypto: QuantumSafeCrypto;
  private qkd: Map<string, QuantumKeyDistribution> = new Map();
  private qrng: Map<string, QuantumRandomNumberGenerator> = new Map();
  private blockchains: Map<string, QuantumResistantBlockchain> = new Map();
  private threats: Map<string, QuantumThreatDetection> = new Map();
  private audits: Map<string, QuantumSecurityAudit> = new Map();
  private metrics: Map<string, QuantumSecurityMetrics> = new Map();

  constructor(securityService: EnterpriseSecurityService, quantumCrypto: QuantumSafeCrypto) {
    this.securityService = securityService;
    this.quantumCrypto = quantumCrypto;
  }

  async establishQuantumKeyDistribution(
    name: string,
    protocol: 'bb84' | 'e91' | 'b92' | 'six_state' | 'sarg04',
    alice: string,
    bob: string,
    keyLength: number = 256,
    distance: number = 100
  ): Promise<QuantumKeyDistribution> {
    const qkdId = `qkd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate QKD performance
    const errorRate = Math.random() * 0.05 + 0.01; // 1-6% error rate
    const siftedRate = Math.random() * 0.3 + 0.7; // 70-100% sifted rate
    const finalRate = siftedRate * (1 - errorRate);
    const sharedKey = this.generateMockQuantumKey(keyLength);
    const securityLevel = this.determineSecurityLevel(keyLength);

    const qkd: QuantumKeyDistribution = {
      id: qkdId,
      name,
      protocol,
      alice,
      bob,
      keyLength,
      sharedKey,
      errorRate,
      siftedRate,
      finalRate,
      securityLevel,
      distance,
      isActive: true,
      createdAt: new Date(),
      metadata: {
        photonRate: Math.random() * 1000 + 100, // 100-1100 photons/second
        detectorEfficiency: Math.random() * 0.2 + 0.8, // 80-100% efficiency
        darkCountRate: Math.random() * 100 + 10, // 10-110 counts/second
        quantumBitErrorRate: errorRate
      }
    };

    this.qkd.set(qkdId, qkd);

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'quantum_key_distribution_established',
      resource: 'advanced-quantum-security',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { qkdId, name, protocol, keyLength, securityLevel },
      severity: 'high'
    });

    return qkd;
  }

  async createQuantumRandomNumberGenerator(
    name: string,
    method: 'photon_detection' | 'vacuum_fluctuations' | 'beam_splitter' | 'quantum_dots' | 'nuclear_decay',
    entropySource: string,
    outputLength: number = 1024
  ): Promise<QuantumRandomNumberGenerator> {
    const qrngId = `qrng_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate QRNG performance
    const entropyRate = Math.random() * 1000 + 100; // 100-1100 bits/second
    const minEntropy = Math.random() * 0.2 + 0.8; // 80-100% min entropy
    const randomNumbers = this.generateMockRandomNumbers(outputLength);

    const qrng: QuantumRandomNumberGenerator = {
      id: qrngId,
      name,
      method,
      entropySource,
      outputLength,
      randomNumbers,
      entropyRate,
      minEntropy,
      statisticalTests: {
        frequency: Math.random() > 0.1,
        runs: Math.random() > 0.1,
        autocorrelation: Math.random() > 0.1,
        blockFrequency: Math.random() > 0.1,
        cumulativeSums: Math.random() > 0.1
      },
      isActive: true,
      createdAt: new Date(),
      metadata: {
        quantumEfficiency: Math.random() * 0.2 + 0.8, // 80-100% efficiency
        deadTime: Math.random() * 100 + 10, // 10-110 nanoseconds
        jitter: Math.random() * 10 + 1, // 1-11 picoseconds
        temperature: Math.random() * 20 + 20 // 20-40°C
      }
    };

    this.qrng.set(qrngId, qrng);

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'quantum_random_number_generator_created',
      resource: 'advanced-quantum-security',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { qrngId, name, method, entropyRate },
      severity: 'medium'
    });

    return qrng;
  }

  async deployQuantumResistantBlockchain(
    name: string,
    consensus: 'proof_of_quantum_work' | 'proof_of_quantum_stake' | 'quantum_byzantine_fault_tolerance',
    quantumAlgorithm: 'lattice' | 'hash' | 'code' | 'multivariate' | 'isogeny',
    blockSize: number = 1024,
    blockTime: number = 10
  ): Promise<QuantumResistantBlockchain> {
    const blockchainId = `qrb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate quantum-resistant blockchain performance
    const totalSupply = Math.random() * 1000000 + 100000; // 100k-1.1M tokens
    const circulatingSupply = totalSupply * (Math.random() * 0.3 + 0.7); // 70-100% circulating
    const transactionThroughput = Math.random() * 1000 + 100; // 100-1100 TPS
    const quantumResistance = Math.random() * 0.3 + 0.7; // 70-100% resistance

    const blockchain: QuantumResistantBlockchain = {
      id: blockchainId,
      name,
      consensus,
      quantumAlgorithm,
      blockSize,
      blockTime,
      totalSupply,
      circulatingSupply,
      transactionThroughput,
      securityLevel: this.determineSecurityLevel(256),
      quantumResistance,
      isActive: true,
      createdAt: new Date(),
      metadata: {
        networkHashrate: Math.random() * 1000000 + 100000, // 100k-1.1M H/s
        difficulty: Math.random() * 1000000 + 100000,
        averageBlockSize: blockSize * (Math.random() * 0.3 + 0.7), // 70-100% of max
        quantumAdvantage: Math.random() * 0.5 + 0.1 // 10-60% advantage
      }
    };

    this.blockchains.set(blockchainId, blockchain);

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'quantum_resistant_blockchain_deployed',
      resource: 'advanced-quantum-security',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { blockchainId, name, consensus, quantumResistance },
      severity: 'high'
    });

    return blockchain;
  }

  async detectQuantumThreat(
    name: string,
    threatType: 'shor_attack' | 'grover_attack' | 'quantum_annealing_attack' | 'quantum_walk_attack',
    targetAlgorithm: string
  ): Promise<QuantumThreatDetection> {
    const threatId = `qtd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate quantum threat detection
    const threatLevel = this.determineThreatLevel(threatType);
    const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
    const isDetected = Math.random() > 0.3; // 70% detection rate

    const mitigationStrategy = this.getMitigationStrategy(threatType, targetAlgorithm);

    const threat: QuantumThreatDetection = {
      id: threatId,
      name,
      threatType,
      targetAlgorithm,
      threatLevel,
      detectionMethod: this.getDetectionMethod(threatType),
      confidence,
      mitigationStrategy,
      isDetected,
      timestamp: new Date(),
      metadata: {
        attackVector: this.getAttackVector(threatType),
        estimatedTimeToBreak: this.getEstimatedTimeToBreak(threatType),
        quantumResources: this.getQuantumResources(threatType),
        classicalResources: this.getClassicalResources(threatType)
      }
    };

    this.threats.set(threatId, threat);

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'quantum_threat_detected',
      resource: 'advanced-quantum-security',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { threatId, name, threatType, threatLevel, isDetected },
      severity: threatLevel === 'critical' ? 'critical' : threatLevel === 'high' ? 'high' : 'medium'
    });

    return threat;
  }

  async performQuantumSecurityAudit(
    name: string,
    scope: 'cryptography' | 'blockchain' | 'communication' | 'comprehensive',
    auditType: 'penetration_test' | 'vulnerability_assessment' | 'compliance_check' | 'quantum_resistance_test'
  ): Promise<QuantumSecurityAudit> {
    const auditId = `qsa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate quantum security audit
    const findings = {
      critical: Math.floor(Math.random() * 3),
      high: Math.floor(Math.random() * 5) + 1,
      medium: Math.floor(Math.random() * 10) + 5,
      low: Math.floor(Math.random() * 15) + 10,
      info: Math.floor(Math.random() * 20) + 15
    };

    const complianceScore = Math.random() * 0.3 + 0.7; // 70-100% compliance
    const quantumResistanceScore = Math.random() * 0.3 + 0.7; // 70-100% resistance
    const overallScore = (complianceScore + quantumResistanceScore) / 2;

    const recommendations = this.generateRecommendations(findings, scope);

    const audit: QuantumSecurityAudit = {
      id: auditId,
      name,
      scope,
      auditType,
      findings,
      recommendations,
      complianceScore,
      quantumResistanceScore,
      overallScore,
      timestamp: new Date(),
      metadata: {
        auditDuration: Math.random() * 24 + 8, // 8-32 hours
        auditors: Math.floor(Math.random() * 5) + 2, // 2-7 auditors
        toolsUsed: this.getAuditTools(auditType),
        standardsCompliance: this.getStandardsCompliance(scope)
      }
    };

    this.audits.set(auditId, audit);

    // Log security event
    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'quantum_security_audit_performed',
      resource: 'advanced-quantum-security',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { auditId, name, scope, overallScore },
      severity: overallScore < 0.8 ? 'high' : 'medium'
    });

    return audit;
  }

  async trackQuantumSecurityMetrics(): Promise<QuantumSecurityMetrics> {
    const activeQKD = Array.from(this.qkd.values()).filter(q => q.isActive).length;
    const activeQRNG = Array.from(this.qrng.values()).filter(q => q.isActive).length;
    const activeBlockchains = Array.from(this.blockchains.values()).filter(b => b.isActive).length;
    const detectedThreats = Array.from(this.threats.values()).filter(t => t.isDetected).length;

    const averageComplianceScore = this.audits.size > 0
      ? Array.from(this.audits.values()).reduce((sum, a) => sum + a.complianceScore, 0) / this.audits.size
      : 0;

    const averageQuantumResistanceScore = this.audits.size > 0
      ? Array.from(this.audits.values()).reduce((sum, a) => sum + a.quantumResistanceScore, 0) / this.audits.size
      : 0;

    const averageSecurityScore = this.audits.size > 0
      ? Array.from(this.audits.values()).reduce((sum, a) => sum + a.overallScore, 0) / this.audits.size
      : 0;

    const metrics: QuantumSecurityMetrics = {
      id: `qsm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      totalQKD: this.qkd.size,
      activeQKD,
      totalQRNG: this.qrng.size,
      activeQRNG,
      totalBlockchains: this.blockchains.size,
      activeBlockchains,
      totalThreats: this.threats.size,
      detectedThreats,
      totalAudits: this.audits.size,
      averageComplianceScore,
      averageQuantumResistanceScore,
      averageSecurityScore
    };

    this.metrics.set(metrics.id, metrics);

    return metrics;
  }

  // Helper methods
  private generateMockQuantumKey(length: number): string {
    return `qkey_${length}_${Math.random().toString(16).substr(2, length / 4)}`;
  }

  private generateMockRandomNumbers(count: number): string[] {
    const numbers: string[] = [];
    for (let i = 0; i < count; i++) {
      numbers.push(Math.random().toString(16).substr(2, 8));
    }
    return numbers;
  }

  private determineSecurityLevel(keyLength: number): '128' | '192' | '256' {
    if (keyLength >= 256) return '256';
    if (keyLength >= 192) return '192';
    return '128';
  }

  private determineThreatLevel(threatType: string): 'low' | 'medium' | 'high' | 'critical' {
    const threatLevels: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
      'shor_attack': 'critical',
      'grover_attack': 'high',
      'quantum_annealing_attack': 'medium',
      'quantum_walk_attack': 'low'
    };
    return threatLevels[threatType] || 'medium';
  }

  private getDetectionMethod(threatType: string): 'signature_based' | 'anomaly_based' | 'behavior_based' | 'quantum_based' {
    const methods: Record<string, 'signature_based' | 'anomaly_based' | 'behavior_based' | 'quantum_based'> = {
      'shor_attack': 'quantum_based',
      'grover_attack': 'anomaly_based',
      'quantum_annealing_attack': 'behavior_based',
      'quantum_walk_attack': 'signature_based'
    };
    return methods[threatType] || 'anomaly_based';
  }

  private getMitigationStrategy(threatType: string, targetAlgorithm: string): string {
    const strategies: Record<string, string> = {
      'shor_attack': 'Implement post-quantum cryptography with lattice-based algorithms',
      'grover_attack': 'Increase key sizes and use quantum-resistant hash functions',
      'quantum_annealing_attack': 'Use classical annealing with quantum-resistant optimization',
      'quantum_walk_attack': 'Implement quantum-resistant random number generators'
    };
    return strategies[threatType] || 'Implement comprehensive quantum-resistant security measures';
  }

  private getAttackVector(threatType: string): string {
    const vectors: Record<string, string> = {
      'shor_attack': 'Factorization of large numbers',
      'grover_attack': 'Database search and brute force',
      'quantum_annealing_attack': 'Optimization problem solving',
      'quantum_walk_attack': 'Graph traversal and search'
    };
    return vectors[threatType] || 'Unknown attack vector';
  }

  private getEstimatedTimeToBreak(threatType: string): string {
    const times: Record<string, string> = {
      'shor_attack': '10-15 years',
      'grover_attack': '15-20 years',
      'quantum_annealing_attack': '20-25 years',
      'quantum_walk_attack': '25-30 years'
    };
    return times[threatType] || 'Unknown timeframe';
  }

  private getQuantumResources(threatType: string): string {
    const resources: Record<string, string> = {
      'shor_attack': '1000-10000 qubits',
      'grover_attack': '100-1000 qubits',
      'quantum_annealing_attack': '100-500 qubits',
      'quantum_walk_attack': '50-200 qubits'
    };
    return resources[threatType] || 'Unknown quantum resources';
  }

  private getClassicalResources(threatType: string): string {
    const resources: Record<string, string> = {
      'shor_attack': '1000-10000 CPU cores',
      'grover_attack': '100-1000 CPU cores',
      'quantum_annealing_attack': '100-500 CPU cores',
      'quantum_walk_attack': '50-200 CPU cores'
    };
    return resources[threatType] || 'Unknown classical resources';
  }

  private generateRecommendations(findings: any, scope: string): string[] {
    const recommendations: string[] = [];
    
    if (findings.critical > 0) {
      recommendations.push('Immediately address critical vulnerabilities with highest priority');
    }
    if (findings.high > 0) {
      recommendations.push('Address high-severity vulnerabilities within 30 days');
    }
    if (findings.medium > 0) {
      recommendations.push('Address medium-severity vulnerabilities within 90 days');
    }
    if (findings.low > 0) {
      recommendations.push('Address low-severity vulnerabilities as resources permit');
    }
    
    if (scope === 'cryptography') {
      recommendations.push('Implement post-quantum cryptography algorithms');
      recommendations.push('Upgrade to quantum-resistant key exchange protocols');
    }
    if (scope === 'blockchain') {
      recommendations.push('Deploy quantum-resistant consensus mechanisms');
      recommendations.push('Implement quantum-resistant smart contracts');
    }
    if (scope === 'communication') {
      recommendations.push('Establish quantum key distribution networks');
      recommendations.push('Implement quantum-resistant communication protocols');
    }
    
    return recommendations;
  }

  private getAuditTools(auditType: string): string[] {
    const tools: Record<string, string[]> = {
      'penetration_test': ['Quantum Penetration Testing Framework', 'Post-Quantum Security Scanner', 'Quantum Threat Simulator'],
      'vulnerability_assessment': ['Quantum Vulnerability Scanner', 'Post-Quantum Algorithm Analyzer', 'Quantum Security Assessment Tool'],
      'compliance_check': ['NIST Post-Quantum Compliance Checker', 'Quantum Security Standards Validator', 'Compliance Reporting Tool'],
      'quantum_resistance_test': ['Quantum Resistance Tester', 'Post-Quantum Algorithm Validator', 'Quantum Security Benchmark']
    };
    return tools[auditType] || ['Generic Security Audit Tool'];
  }

  private getStandardsCompliance(scope: string): string[] {
    const standards: Record<string, string[]> = {
      'cryptography': ['NIST Post-Quantum Cryptography', 'ISO/IEC 14888', 'FIPS 186-5'],
      'blockchain': ['NIST Blockchain Security', 'ISO/IEC 27001', 'Quantum Blockchain Standards'],
      'communication': ['NIST Quantum Key Distribution', 'ISO/IEC 27033', 'Quantum Communication Protocols'],
      'comprehensive': ['NIST Cybersecurity Framework', 'ISO/IEC 27001', 'Post-Quantum Security Standards']
    };
    return standards[scope] || ['Generic Security Standards'];
  }

  // Analytics and reporting methods
  async getQKD(): Promise<QuantumKeyDistribution[]> {
    return Array.from(this.qkd.values());
  }

  async getQRNG(): Promise<QuantumRandomNumberGenerator[]> {
    return Array.from(this.qrng.values());
  }

  async getBlockchains(): Promise<QuantumResistantBlockchain[]> {
    return Array.from(this.blockchains.values());
  }

  async getThreats(): Promise<QuantumThreatDetection[]> {
    return Array.from(this.threats.values());
  }

  async getAudits(): Promise<QuantumSecurityAudit[]> {
    return Array.from(this.audits.values());
  }

  async getMetrics(): Promise<QuantumSecurityMetrics[]> {
    return Array.from(this.metrics.values());
  }

  async generateQuantumSecurityReport(): Promise<{
    totalQKD: number;
    activeQKD: number;
    totalQRNG: number;
    activeQRNG: number;
    totalBlockchains: number;
    activeBlockchains: number;
    totalThreats: number;
    detectedThreats: number;
    totalAudits: number;
    averageComplianceScore: number;
    averageQuantumResistanceScore: number;
    averageSecurityScore: number;
    threatLevelDistribution: Record<string, number>;
    auditTypeDistribution: Record<string, number>;
  }> {
    const qkd = Array.from(this.qkd.values());
    const qrng = Array.from(this.qrng.values());
    const blockchains = Array.from(this.blockchains.values());
    const threats = Array.from(this.threats.values());
    const audits = Array.from(this.audits.values());

    const threatLevelDistribution: Record<string, number> = {};
    const auditTypeDistribution: Record<string, number> = {};

    threats.forEach(threat => {
      threatLevelDistribution[threat.threatLevel] = (threatLevelDistribution[threat.threatLevel] || 0) + 1;
    });

    audits.forEach(audit => {
      auditTypeDistribution[audit.auditType] = (auditTypeDistribution[audit.auditType] || 0) + 1;
    });

    const averageComplianceScore = audits.length > 0
      ? audits.reduce((sum, a) => sum + a.complianceScore, 0) / audits.length
      : 0;

    const averageQuantumResistanceScore = audits.length > 0
      ? audits.reduce((sum, a) => sum + a.quantumResistanceScore, 0) / audits.length
      : 0;

    const averageSecurityScore = audits.length > 0
      ? audits.reduce((sum, a) => sum + a.overallScore, 0) / audits.length
      : 0;

    return {
      totalQKD: qkd.length,
      activeQKD: qkd.filter(q => q.isActive).length,
      totalQRNG: qrng.length,
      activeQRNG: qrng.filter(q => q.isActive).length,
      totalBlockchains: blockchains.length,
      activeBlockchains: blockchains.filter(b => b.isActive).length,
      totalThreats: threats.length,
      detectedThreats: threats.filter(t => t.isDetected).length,
      totalAudits: audits.length,
      averageComplianceScore,
      averageQuantumResistanceScore,
      averageSecurityScore,
      threatLevelDistribution,
      auditTypeDistribution
    };
  }

  // Public methods for external access
  getQKDById(qkdId: string): QuantumKeyDistribution | undefined {
    return this.qkd.get(qkdId);
  }

  getQRNGById(qrngId: string): QuantumRandomNumberGenerator | undefined {
    return this.qrng.get(qrngId);
  }

  getBlockchainById(blockchainId: string): QuantumResistantBlockchain | undefined {
    return this.blockchains.get(blockchainId);
  }

  getThreatById(threatId: string): QuantumThreatDetection | undefined {
    return this.threats.get(threatId);
  }

  getAuditById(auditId: string): QuantumSecurityAudit | undefined {
    return this.audits.get(auditId);
  }

  getMetricsById(metricsId: string): QuantumSecurityMetrics | undefined {
    return this.metrics.get(metricsId);
  }

  isQKDActive(qkdId: string): boolean {
    const qkd = this.qkd.get(qkdId);
    return qkd?.isActive || false;
  }

  isQRNGActive(qrngId: string): boolean {
    const qrng = this.qrng.get(qrngId);
    return qrng?.isActive || false;
  }

  isBlockchainActive(blockchainId: string): boolean {
    const blockchain = this.blockchains.get(blockchainId);
    return blockchain?.isActive || false;
  }
} 