// Advanced Security & Privacy Framework for CodePal
// Features: Zero-trust architecture, advanced threat detection, privacy-preserving technologies, compliance automation

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface SecurityPolicy {
  id: string;
  name: string;
  type: 'zero-trust' | 'data-protection' | 'access-control' | 'threat-prevention' | 'compliance';
  status: 'active' | 'draft' | 'archived' | 'testing';
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  rules: SecurityRule[];
  createdAt: string;
  lastUpdated: string;
  compliance: string[];
}

interface SecurityRule {
  id: string;
  name: string;
  type: 'authentication' | 'authorization' | 'encryption' | 'monitoring' | 'response';
  condition: string;
  action: string;
  enabled: boolean;
  priority: number;
}

interface ThreatDetection {
  id: string;
  name: string;
  type: 'anomaly' | 'signature' | 'behavioral' | 'ml-based' | 'ai-powered';
  status: 'active' | 'learning' | 'disabled' | 'maintenance';
  accuracy: number;
  falsePositives: number;
  detectedThreats: number;
  lastDetection: string;
  capabilities: string[];
  model: string;
}

interface PrivacyTechnology {
  id: string;
  name: string;
  type: 'differential-privacy' | 'homomorphic-encryption' | 'federated-learning' | 'secure-multiparty' | 'zero-knowledge';
  status: 'implemented' | 'testing' | 'planned' | 'deprecated';
  description: string;
  privacyLevel: 'basic' | 'enhanced' | 'maximum' | 'enterprise';
  performance: number;
  compliance: string[];
  useCases: string[];
}

interface ComplianceFramework {
  id: string;
  name: string;
  type: 'gdpr' | 'ccpa' | 'sox' | 'hipaa' | 'iso27001' | 'custom';
  status: 'compliant' | 'non-compliant' | 'in-progress' | 'audit-required';
  lastAudit: string;
  nextAudit: string;
  requirements: ComplianceRequirement[];
  automatedChecks: number;
  manualChecks: number;
  score: number;
}

interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  status: 'met' | 'partial' | 'not-met' | 'not-applicable';
  evidence: string[];
  lastVerified: string;
  automated: boolean;
}

interface SecurityIncident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  type: 'breach' | 'malware' | 'phishing' | 'ddos' | 'insider' | 'other';
  detectedAt: string;
  resolvedAt?: string;
  affectedSystems: string[];
  impact: string;
  response: string;
}

export default function AdvancedSecurityPrivacyFramework() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'threats' | 'privacy' | 'compliance' | 'incidents'>('overview');
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([]);
  const [threatDetections, setThreatDetections] = useState<ThreatDetection[]>([]);
  const [privacyTechnologies, setPrivacyTechnologies] = useState<PrivacyTechnology[]>([]);
  const [complianceFrameworks, setComplianceFrameworks] = useState<ComplianceFramework[]>([]);
  const [securityIncidents, setSecurityIncidents] = useState<SecurityIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSecurityPolicies([
        {
          id: 'policy-1',
          name: 'Zero-Trust Network Access',
          type: 'zero-trust',
          status: 'active',
          priority: 'critical',
          description: 'Implements zero-trust principles for all network access and resource requests',
          rules: [
            {
              id: 'rule-1',
              name: 'Multi-Factor Authentication',
              type: 'authentication',
              condition: 'All user access attempts',
              action: 'Require MFA verification',
              enabled: true,
              priority: 1
            },
            {
              id: 'rule-2',
              name: 'Continuous Verification',
              type: 'monitoring',
              condition: 'Active sessions',
              action: 'Monitor and verify session integrity',
              enabled: true,
              priority: 2
            }
          ],
          createdAt: '2024-01-01T00:00:00Z',
          lastUpdated: '2024-01-20T10:00:00Z',
          compliance: ['SOC2', 'ISO27001', 'GDPR']
        },
        {
          id: 'policy-2',
          name: 'Data Encryption at Rest',
          type: 'data-protection',
          status: 'active',
          priority: 'high',
          description: 'Ensures all sensitive data is encrypted when stored',
          rules: [
            {
              id: 'rule-3',
              name: 'AES-256 Encryption',
              type: 'encryption',
              condition: 'Data storage operations',
              action: 'Apply AES-256 encryption',
              enabled: true,
              priority: 1
            }
          ],
          createdAt: '2024-01-05T00:00:00Z',
          lastUpdated: '2024-01-18T14:30:00Z',
          compliance: ['HIPAA', 'GDPR', 'CCPA']
        }
      ]);

      setThreatDetections([
        {
          id: 'threat-1',
          name: 'AI-Powered Anomaly Detection',
          type: 'ai-powered',
          status: 'active',
          accuracy: 0.95,
          falsePositives: 0.02,
          detectedThreats: 47,
          lastDetection: '2024-01-20T15:30:00Z',
          capabilities: ['behavioral-analysis', 'pattern-recognition', 'predictive-modeling'],
          model: 'deep-learning-v2.1'
        },
        {
          id: 'threat-2',
          name: 'Real-Time Signature Detection',
          type: 'signature',
          status: 'active',
          accuracy: 0.98,
          falsePositives: 0.01,
          detectedThreats: 156,
          lastDetection: '2024-01-20T15:25:00Z',
          capabilities: ['malware-detection', 'virus-scanning', 'threat-intelligence'],
          model: 'signature-db-v3.4'
        }
      ]);

      setPrivacyTechnologies([
        {
          id: 'privacy-1',
          name: 'Differential Privacy Engine',
          type: 'differential-privacy',
          status: 'implemented',
          description: 'Adds noise to data queries to protect individual privacy while maintaining statistical accuracy',
          privacyLevel: 'maximum',
          performance: 0.85,
          compliance: ['GDPR', 'CCPA'],
          useCases: ['analytics', 'machine-learning', 'data-sharing']
        },
        {
          id: 'privacy-2',
          name: 'Homomorphic Encryption',
          type: 'homomorphic-encryption',
          status: 'testing',
          description: 'Enables computation on encrypted data without decryption',
          privacyLevel: 'enterprise',
          performance: 0.60,
          compliance: ['HIPAA', 'GDPR'],
          useCases: ['secure-computation', 'privacy-preserving-ml', 'confidential-computing']
        }
      ]);

      setComplianceFrameworks([
        {
          id: 'compliance-1',
          name: 'GDPR Compliance',
          type: 'gdpr',
          status: 'compliant',
          lastAudit: '2024-01-15T00:00:00Z',
          nextAudit: '2024-07-15T00:00:00Z',
          requirements: [
            {
              id: 'req-1',
              name: 'Data Subject Rights',
              description: 'Implement mechanisms for data subject access, rectification, and deletion',
              status: 'met',
              evidence: ['automated-dsr-portal', 'data-deletion-workflow'],
              lastVerified: '2024-01-15T00:00:00Z',
              automated: true
            },
            {
              id: 'req-2',
              name: 'Data Protection Impact Assessment',
              description: 'Conduct DPIA for high-risk processing activities',
              status: 'met',
              evidence: ['dpia-template', 'risk-assessment-reports'],
              lastVerified: '2024-01-10T00:00:00Z',
              automated: false
            }
          ],
          automatedChecks: 85,
          manualChecks: 15,
          score: 98
        },
        {
          id: 'compliance-2',
          name: 'SOC 2 Type II',
          type: 'custom',
          status: 'in-progress',
          lastAudit: '2024-01-01T00:00:00Z',
          nextAudit: '2024-04-01T00:00:00Z',
          requirements: [
            {
              id: 'req-3',
              name: 'Access Control',
              description: 'Implement comprehensive access control mechanisms',
              status: 'met',
              evidence: ['rbac-system', 'access-logs', 'privilege-management'],
              lastVerified: '2024-01-20T00:00:00Z',
              automated: true
            }
          ],
          automatedChecks: 70,
          manualChecks: 30,
          score: 85
        }
      ]);

      setSecurityIncidents([
        {
          id: 'incident-1',
          title: 'Suspicious Login Attempts',
          severity: 'medium',
          status: 'resolved',
          type: 'phishing',
          detectedAt: '2024-01-20T14:00:00Z',
          resolvedAt: '2024-01-20T14:30:00Z',
          affectedSystems: ['authentication-service', 'user-portal'],
          impact: 'Multiple failed login attempts from suspicious IP addresses',
          response: 'Blocked suspicious IPs, enhanced monitoring, user notifications sent'
        },
        {
          id: 'incident-2',
          title: 'Data Access Anomaly',
          severity: 'low',
          status: 'investigating',
          type: 'anomaly',
          detectedAt: '2024-01-20T16:00:00Z',
          affectedSystems: ['data-warehouse', 'analytics-platform'],
          impact: 'Unusual data access patterns detected',
          response: 'Under investigation by security team'
        }
      ]);
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'implemented': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'testing': return 'text-yellow-600 bg-yellow-100';
      case 'learning': return 'text-blue-600 bg-blue-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'disabled': return 'text-red-600 bg-red-100';
      case 'non-compliant': return 'text-red-600 bg-red-100';
      case 'deprecated': return 'text-gray-600 bg-gray-100';
      case 'open': return 'text-red-600 bg-red-100';
      case 'investigating': return 'text-yellow-600 bg-yellow-100';
      case 'contained': return 'text-blue-600 bg-blue-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      case 'info': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Policies</p>
              <p className="text-2xl font-bold text-gray-900">
                {securityPolicies.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">🛡️</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Threat Detections</p>
              <p className="text-2xl font-bold text-gray-900">{threatDetections.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Privacy Technologies</p>
              <p className="text-2xl font-bold text-gray-900">{privacyTechnologies.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">🔒</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(complianceFrameworks.reduce((acc, f) => acc + f.score, 0) / complianceFrameworks.length)}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Incidents</h3>
          <div className="space-y-3">
            {securityIncidents.slice(0, 3).map((incident) => (
              <div key={incident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🚨</span>
                  <div>
                    <p className="font-medium text-gray-900">{incident.title}</p>
                    <p className="text-sm text-gray-500">{incident.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(incident.severity)}`}>
                  {incident.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Threat Detections</h3>
          <div className="space-y-3">
            {threatDetections.filter(t => t.status === 'active').slice(0, 3).map((threat) => (
              <div key={threat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🔍</span>
                  <div>
                    <p className="font-medium text-gray-900">{threat.name}</p>
                    <p className="text-sm text-gray-500">{(threat.accuracy * 100).toFixed(1)}% accuracy</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(threat.status)}`}>
                  {threat.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPolicies = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Security Policies</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create Policy
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityPolicies.map((policy) => (
          <div key={policy.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🛡️</span>
                <h3 className="font-semibold text-gray-900">{policy.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(policy.status)}`}>
                {policy.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{policy.description}</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium capitalize">{policy.type.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Priority:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(policy.priority)}`}>
                  {policy.priority}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Rules:</span>
                <span className="font-medium">{policy.rules.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Compliance:</span>
                <span className="font-medium">{policy.compliance.length} frameworks</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Edit
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  Test
                </button>
                <button className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors">
                  Disable
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderThreats = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Threat Detection Systems</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          Add Detection
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {threatDetections.map((threat) => (
          <div key={threat.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔍</span>
                <h3 className="font-semibold text-gray-900">{threat.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(threat.status)}`}>
                {threat.status}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium capitalize">{threat.type.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Accuracy:</span>
                <span className="font-medium">{(threat.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">False Positives:</span>
                <span className="font-medium">{(threat.falsePositives * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Detected Threats:</span>
                <span className="font-medium">{threat.detectedThreats}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Capabilities:</span>
                <span className="font-medium">{threat.capabilities.length}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Configure
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  Monitor
                </button>
                <button className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors">
                  Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Privacy Technologies</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Implement Technology
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {privacyTechnologies.map((tech) => (
          <div key={tech.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔒</span>
                <h3 className="font-semibold text-gray-900">{tech.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tech.status)}`}>
                {tech.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{tech.description}</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium capitalize">{tech.type.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Privacy Level:</span>
                <span className="font-medium capitalize">{tech.privacyLevel}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Performance:</span>
                <span className="font-medium">{(tech.performance * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Compliance:</span>
                <span className="font-medium">{tech.compliance.length} frameworks</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Use Cases:</span>
                <span className="font-medium">{tech.useCases.length}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Configure
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  Test
                </button>
                <button className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors">
                  Deploy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Compliance Frameworks</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Add Framework
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complianceFrameworks.map((framework) => (
          <div key={framework.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📋</span>
                <h3 className="font-semibold text-gray-900">{framework.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(framework.status)}`}>
                {framework.status}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium uppercase">{framework.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Score:</span>
                <span className="font-medium">{framework.score}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Requirements:</span>
                <span className="font-medium">{framework.requirements.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Automated Checks:</span>
                <span className="font-medium">{framework.automatedChecks}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Next Audit:</span>
                <span className="font-medium">{new Date(framework.nextAudit).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  View Details
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  Run Audit
                </button>
                <button className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors">
                  Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIncidents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Security Incidents</h2>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
          Report Incident
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {securityIncidents.map((incident) => (
          <div key={incident.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🚨</span>
                <h3 className="font-semibold text-gray-900">{incident.title}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(incident.severity)}`}>
                {incident.severity}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium capitalize">{incident.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(incident.status)}`}>
                  {incident.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Detected:</span>
                <span className="font-medium">{new Date(incident.detectedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Affected Systems:</span>
                <span className="font-medium">{incident.affectedSystems.length}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <p className="text-sm text-gray-600"><strong>Impact:</strong> {incident.impact}</p>
                <p className="text-sm text-gray-600"><strong>Response:</strong> {incident.response}</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Update
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  Escalate
                </button>
                <button className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors">
                  Resolve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading security data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Security & Privacy Framework</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive security and privacy protection with zero-trust architecture, advanced threat detection, and compliance automation.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'policies', name: 'Policies', icon: '🛡️' },
                { id: 'threats', name: 'Threats', icon: '🔍' },
                { id: 'privacy', name: 'Privacy', icon: '🔒' },
                { id: 'compliance', name: 'Compliance', icon: '📋' },
                { id: 'incidents', name: 'Incidents', icon: '🚨' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'policies' && renderPolicies()}
            {activeTab === 'threats' && renderThreats()}
            {activeTab === 'privacy' && renderPrivacy()}
            {activeTab === 'compliance' && renderCompliance()}
            {activeTab === 'incidents' && renderIncidents()}
          </div>
        </div>
      </div>
    </div>
  );
} 