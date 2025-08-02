// Advanced Security & Compliance for CodePal
// Features: Advanced security features, compliance monitoring, threat detection, security analytics

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface SecurityThreat {
  id: string;
  type: 'malware' | 'ddos' | 'phishing' | 'sql_injection' | 'xss' | 'brute_force';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'investigating' | 'mitigated' | 'resolved';
  source: string;
  target: string;
  timestamp: string;
  description: string;
  impact: string;
}

interface ComplianceFramework {
  id: string;
  name: string;
  type: 'gdpr' | 'ccpa' | 'sox' | 'pci_dss' | 'iso27001' | 'hipaa';
  status: 'compliant' | 'non_compliant' | 'pending' | 'audit';
  requirements: ComplianceRequirement[];
  lastAudit: string;
  nextAudit: string;
  score: number;
}

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  status: 'met' | 'not_met' | 'partial' | 'pending';
  evidence: string;
  lastChecked: string;
}

interface SecurityPolicy {
  id: string;
  name: string;
  category: 'access_control' | 'data_protection' | 'network_security' | 'incident_response';
  status: 'active' | 'inactive' | 'draft' | 'review';
  description: string;
  rules: SecurityRule[];
  lastUpdated: string;
}

interface SecurityRule {
  id: string;
  name: string;
  description: string;
  action: 'allow' | 'deny' | 'log' | 'alert';
  conditions: string[];
  priority: number;
}

interface SecurityAnalytics {
  id: string;
  metric: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  period: string;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
}

interface VulnerabilityScan {
  id: string;
  name: string;
  type: 'network' | 'application' | 'database' | 'infrastructure';
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  vulnerabilities: Vulnerability[];
  scanDate: string;
  duration: number;
  coverage: number;
}

interface Vulnerability {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cvss_score: number;
  description: string;
  remediation: string;
  status: 'open' | 'in_progress' | 'resolved' | 'false_positive';
}

interface SecurityIncident {
  id: string;
  title: string;
  type: 'breach' | 'intrusion' | 'data_leak' | 'malware' | 'phishing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'contained' | 'resolved';
  description: string;
  affectedSystems: string[];
  timeline: IncidentTimeline[];
  createdAt: string;
  updatedAt: string;
}

interface IncidentTimeline {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  actor: string;
}

export default function AdvancedSecurityCompliance() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'threats' | 'compliance' | 'policies' | 'analytics' | 'vulnerabilities' | 'incidents'>('overview');
  const [securityThreats, setSecurityThreats] = useState<SecurityThreat[]>([]);
  const [complianceFrameworks, setComplianceFrameworks] = useState<ComplianceFramework[]>([]);
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([]);
  const [securityAnalytics, setSecurityAnalytics] = useState<SecurityAnalytics[]>([]);
  const [vulnerabilityScans, setVulnerabilityScans] = useState<VulnerabilityScan[]>([]);
  const [securityIncidents, setSecurityIncidents] = useState<SecurityIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockThreats: SecurityThreat[] = [
        {
          id: '1',
          type: 'ddos',
          severity: 'high',
          status: 'mitigated',
          source: '192.168.1.100',
          target: 'api.codepal.com',
          timestamp: '2024-01-15T10:00:00Z',
          description: 'DDoS attack detected from multiple sources',
          impact: 'Service degradation for 15 minutes'
        },
        {
          id: '2',
          type: 'phishing',
          severity: 'medium',
          status: 'investigating',
          source: 'suspicious@malware.com',
          target: 'user@codepal.com',
          timestamp: '2024-01-15T09:30:00Z',
          description: 'Phishing attempt targeting user credentials',
          impact: 'Potential credential compromise'
        }
      ];

      const mockCompliance: ComplianceFramework[] = [
        {
          id: '1',
          name: 'GDPR Compliance',
          type: 'gdpr',
          status: 'compliant',
          requirements: [
            {
              id: '1',
              title: 'Data Processing Consent',
              description: 'Ensure explicit consent for data processing',
              status: 'met',
              evidence: 'Consent forms implemented',
              lastChecked: '2024-01-15T10:00:00Z'
            }
          ],
          lastAudit: '2024-01-01T00:00:00Z',
          nextAudit: '2024-07-01T00:00:00Z',
          score: 95
        }
      ];

      const mockPolicies: SecurityPolicy[] = [
        {
          id: '1',
          name: 'Access Control Policy',
          category: 'access_control',
          status: 'active',
          description: 'Controls user access to systems and data',
          rules: [
            {
              id: '1',
              name: 'Multi-Factor Authentication',
              description: 'Require MFA for all user accounts',
              action: 'deny',
              conditions: ['no_mfa'],
              priority: 1
            }
          ],
          lastUpdated: '2024-01-15T10:00:00Z'
        }
      ];

      const mockAnalytics: SecurityAnalytics[] = [
        {
          id: '1',
          metric: 'Threats Blocked',
          value: 1250,
          unit: 'count',
          trend: 'up',
          period: '24h',
          threshold: 1000,
          status: 'warning'
        },
        {
          id: '2',
          metric: 'Security Score',
          value: 92,
          unit: '%',
          trend: 'up',
          period: '7d',
          threshold: 90,
          status: 'normal'
        }
      ];

      const mockVulnerabilities: VulnerabilityScan[] = [
        {
          id: '1',
          name: 'Application Security Scan',
          type: 'application',
          status: 'completed',
          vulnerabilities: [
            {
              id: '1',
              title: 'SQL Injection Vulnerability',
              severity: 'high',
              cvss_score: 8.5,
              description: 'Potential SQL injection in login form',
              remediation: 'Use parameterized queries',
              status: 'open'
            }
          ],
          scanDate: '2024-01-15T10:00:00Z',
          duration: 1800,
          coverage: 95
        }
      ];

      const mockIncidents: SecurityIncident[] = [
        {
          id: '1',
          title: 'Suspicious Login Attempts',
          type: 'intrusion',
          severity: 'medium',
          status: 'investigating',
          description: 'Multiple failed login attempts detected',
          affectedSystems: ['auth-service', 'user-database'],
          timeline: [
            {
              id: '1',
              timestamp: '2024-01-15T10:00:00Z',
              action: 'Incident Created',
              description: 'Security incident detected',
              actor: 'Security System'
            }
          ],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        }
      ];

      setSecurityThreats(mockThreats);
      setComplianceFrameworks(mockCompliance);
      setSecurityPolicies(mockPolicies);
      setSecurityAnalytics(mockAnalytics);
      setVulnerabilityScans(mockVulnerabilities);
      setSecurityIncidents(mockIncidents);
      setLoading(false);
    }, 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'compliant':
      case 'resolved':
      case 'normal':
        return 'text-green-600 bg-green-100';
      case 'investigating':
      case 'pending':
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'non_compliant':
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Threats</h3>
          <div className="text-3xl font-bold text-red-600 mb-2">
            {securityThreats.filter(t => t.status === 'detected' || t.status === 'investigating').length}
          </div>
          <p className="text-sm text-gray-600">Threats requiring attention</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Score</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {securityAnalytics.find(a => a.metric === 'Security Score')?.value || 0}%
          </div>
          <p className="text-sm text-gray-600">Overall security rating</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Compliance Status</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {complianceFrameworks.filter(c => c.status === 'compliant').length}/{complianceFrameworks.length}
          </div>
          <p className="text-sm text-gray-600">Frameworks compliant</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Open Vulnerabilities</h3>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {vulnerabilityScans.flatMap(s => s.vulnerabilities).filter(v => v.status === 'open').length}
          </div>
          <p className="text-sm text-gray-600">Vulnerabilities to address</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Security Threats</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {securityThreats.slice(0, 5).map(threat => (
                <div key={threat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{threat.type.toUpperCase()}</h4>
                    <p className="text-sm text-gray-600">{threat.description}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{threat.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Security Analytics</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {securityAnalytics.map(metric => (
                <div key={metric.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                    <p className="text-sm text-gray-600">Last {metric.period}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {metric.value} {metric.unit}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderThreats = () => (
    <div className="space-y-6">
      {securityThreats.map(threat => (
        <div key={threat.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{threat.type.toUpperCase()} Threat</h3>
                <p className="text-sm text-gray-600">{threat.description}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getSeverityColor(threat.severity)}`}>
                  {threat.severity}
                </span>
                <span className={`ml-2 px-3 py-1 text-sm rounded-full ${getStatusColor(threat.status)}`}>
                  {threat.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Threat Details</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Source:</span>
                        <span className="ml-1 font-medium">{threat.source}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Target:</span>
                        <span className="ml-1 font-medium">{threat.target}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Impact:</span>
                        <span className="ml-1 font-medium">{threat.impact}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Detected:</span>
                        <span className="ml-1 font-medium">{new Date(threat.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Actions</h4>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Investigate Threat
                  </button>
                  <button className="w-full px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                    Mitigate Threat
                  </button>
                  <button className="w-full px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      {complianceFrameworks.map(framework => (
        <div key={framework.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{framework.name}</h3>
                <p className="text-sm text-gray-600">{framework.type.toUpperCase()} Framework</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(framework.status)}`}>
                  {framework.status}
                </span>
                <div className="text-sm text-gray-600 mt-1">Score: {framework.score}%</div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Requirements</h4>
                <div className="space-y-3">
                  {framework.requirements.map(req => (
                    <div key={req.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{req.title}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{req.description}</p>
                      <div className="text-xs text-gray-500">
                        Evidence: {req.evidence}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Audit Information</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Last Audit</span>
                      <span className="font-medium">{new Date(framework.lastAudit).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Next Audit</span>
                      <span className="font-medium">{new Date(framework.nextAudit).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Compliance Score</span>
                      <span className="font-medium">{framework.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${framework.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPolicies = () => (
    <div className="space-y-6">
      {securityPolicies.map(policy => (
        <div key={policy.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{policy.name}</h3>
                <p className="text-sm text-gray-600">{policy.category.replace('_', ' ')}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(policy.status)}`}>
                  {policy.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Policy Description</h4>
                <p className="text-sm text-gray-600 mb-4">{policy.description}</p>
                
                <h4 className="font-medium text-gray-900 mb-4">Security Rules</h4>
                <div className="space-y-3">
                  {policy.rules.map(rule => (
                    <div key={rule.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{rule.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(rule.action)}`}>
                          {rule.action}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                      <div className="text-xs text-gray-500">
                        Priority: {rule.priority} | Conditions: {rule.conditions.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Policy Management</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium">{new Date(policy.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Active Rules</span>
                      <span className="font-medium">{policy.rules.length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <button className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Edit Policy
                  </button>
                  <button className="w-full px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    View History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Security Analytics Dashboard</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityAnalytics.map(metric => (
              <div key={metric.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>
                
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value} {metric.unit}
                  </div>
                  <div className="text-sm text-gray-600">Last {metric.period}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Threshold: {metric.threshold}</div>
                  <div className="text-lg">
                    {metric.trend === 'up' ? '↗️' : metric.trend === 'down' ? '↘️' : '→'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVulnerabilities = () => (
    <div className="space-y-6">
      {vulnerabilityScans.map(scan => (
        <div key={scan.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{scan.name}</h3>
                <p className="text-sm text-gray-600">{scan.type} vulnerability scan</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(scan.status)}`}>
                  {scan.status}
                </span>
                <div className="text-sm text-gray-600 mt-1">Coverage: {scan.coverage}%</div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Vulnerabilities Found</h4>
                <div className="space-y-3">
                  {scan.vulnerabilities.map(vuln => (
                    <div key={vuln.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{vuln.title}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(vuln.severity)}`}>
                          {vuln.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{vuln.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">CVSS:</span>
                          <span className="ml-1 font-medium">{vuln.cvss_score}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <span className="ml-1 font-medium">{vuln.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Scan Information</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Scan Date</span>
                      <span className="font-medium">{new Date(scan.scanDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{scan.duration}s</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Coverage</span>
                      <span className="font-medium">{scan.coverage}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <button className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Run New Scan
                  </button>
                  <button className="w-full px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    View Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderIncidents = () => (
    <div className="space-y-6">
      {securityIncidents.map(incident => (
        <div key={incident.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                <p className="text-sm text-gray-600">{incident.type} incident</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getSeverityColor(incident.severity)}`}>
                  {incident.severity}
                </span>
                <span className={`ml-2 px-3 py-1 text-sm rounded-full ${getStatusColor(incident.status)}`}>
                  {incident.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Incident Details</h4>
                <p className="text-sm text-gray-600 mb-4">{incident.description}</p>
                
                <h5 className="font-medium text-gray-900 mb-2">Affected Systems</h5>
                <div className="space-y-2">
                  {incident.affectedSystems.map(system => (
                    <div key={system} className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm">
                      {system}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Timeline</h4>
                <div className="space-y-3">
                  {incident.timeline.map(event => (
                    <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{event.action}</span>
                        <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <p className="text-xs text-gray-500">By: {event.actor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
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
          <h1 className="text-3xl font-bold text-gray-900">Advanced Security & Compliance</h1>
          <p className="text-gray-600 mt-2">
            Advanced security features, compliance monitoring, threat detection, and security analytics
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'threats', label: 'Security Threats' },
              { id: 'compliance', label: 'Compliance' },
              { id: 'policies', label: 'Security Policies' },
              { id: 'analytics', label: 'Security Analytics' },
              { id: 'vulnerabilities', label: 'Vulnerabilities' },
              { id: 'incidents', label: 'Security Incidents' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'threats' && renderThreats()}
          {activeTab === 'compliance' && renderCompliance()}
          {activeTab === 'policies' && renderPolicies()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'vulnerabilities' && renderVulnerabilities()}
          {activeTab === 'incidents' && renderIncidents()}
        </div>
      </div>
    </div>
  );
} 