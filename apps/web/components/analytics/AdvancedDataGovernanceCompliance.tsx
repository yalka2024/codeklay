// Advanced Data Governance & Compliance for CodePal
// Features: Data governance framework, compliance monitoring, data classification, regulatory adherence

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface DataPolicy {
  id: string;
  name: string;
  description: string;
  category: 'privacy' | 'security' | 'retention' | 'access' | 'quality';
  status: 'active' | 'draft' | 'archived';
  rules: DataRule[];
  compliance: ComplianceRequirement[];
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
}

interface DataRule {
  id: string;
  name: string;
  type: 'validation' | 'transformation' | 'filtering' | 'encryption';
  condition: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

interface ComplianceRequirement {
  id: string;
  regulation: string;
  requirement: string;
  status: 'compliant' | 'non-compliant' | 'pending' | 'exempt';
  lastAudit: string;
  nextAudit: string;
  evidence: string[];
}

interface DataClassification {
  id: string;
  name: string;
  level: 'public' | 'internal' | 'confidential' | 'restricted' | 'secret';
  description: string;
  handling: string[];
  retention: RetentionPolicy;
  encryption: EncryptionPolicy;
  access: AccessPolicy;
  createdBy: string;
  createdAt: string;
}

interface RetentionPolicy {
  period: number;
  unit: 'days' | 'weeks' | 'months' | 'years';
  action: 'delete' | 'archive' | 'anonymize';
  exceptions: string[];
}

interface EncryptionPolicy {
  algorithm: string;
  keySize: number;
  rotation: number;
  atRest: boolean;
  inTransit: boolean;
}

interface AccessPolicy {
  roles: string[];
  permissions: string[];
  timeRestrictions: string[];
  locationRestrictions: string[];
}

interface DataCatalog {
  id: string;
  name: string;
  description: string;
  type: 'database' | 'file' | 'api' | 'stream';
  location: string;
  classification: string;
  owner: string;
  steward: string;
  tags: string[];
  metadata: Record<string, any>;
  lastUpdated: string;
  status: 'active' | 'deprecated' | 'archived';
}

interface DataLineage {
  id: string;
  source: string;
  target: string;
  transformation: string;
  timestamp: string;
  user: string;
  metadata: Record<string, any>;
}

interface ComplianceAudit {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'regulatory';
  scope: string[];
  status: 'planned' | 'in-progress' | 'completed' | 'failed';
  findings: AuditFinding[];
  startDate: string;
  endDate?: string;
  auditor: string;
  report: string;
}

interface AuditFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  recommendation: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo: string;
  dueDate: string;
}

interface DataQuality {
  id: string;
  dataset: string;
  metric: string;
  value: number;
  threshold: number;
  status: 'pass' | 'fail' | 'warning';
  lastCheck: string;
  trend: 'improving' | 'stable' | 'declining';
}

interface PrivacyRequest {
  id: string;
  type: 'access' | 'deletion' | 'correction' | 'portability';
  requester: string;
  dataSubject: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestDate: string;
  dueDate: string;
  completionDate?: string;
  notes: string;
}

export default function AdvancedDataGovernanceCompliance() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'classification' | 'catalog' | 'lineage' | 'audits' | 'quality' | 'privacy'>('overview');
  const [dataPolicies, setDataPolicies] = useState<DataPolicy[]>([]);
  const [classifications, setClassifications] = useState<DataClassification[]>([]);
  const [dataCatalog, setDataCatalog] = useState<DataCatalog[]>([]);
  const [dataLineage, setDataLineage] = useState<DataLineage[]>([]);
  const [complianceAudits, setComplianceAudits] = useState<ComplianceAudit[]>([]);
  const [dataQuality, setDataQuality] = useState<DataQuality[]>([]);
  const [privacyRequests, setPrivacyRequests] = useState<PrivacyRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGovernanceData();
  }, []);

  const loadGovernanceData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockPolicies: DataPolicy[] = [
        {
          id: 'policy-1',
          name: 'GDPR Data Protection Policy',
          description: 'Ensures compliance with GDPR requirements for personal data handling',
          category: 'privacy',
          status: 'active',
          rules: [
            {
              id: 'rule-1',
              name: 'Data Minimization',
              type: 'validation',
              condition: 'personal_data.length <= required_fields',
              action: 'reject_excess_data',
              priority: 'high',
              enabled: true
            }
          ],
          compliance: [
            {
              id: 'comp-1',
              regulation: 'GDPR',
              requirement: 'Article 5 - Data Minimization',
              status: 'compliant',
              lastAudit: '2024-01-15T00:00:00Z',
              nextAudit: '2024-04-15T00:00:00Z',
              evidence: ['audit_report_2024.pdf', 'data_flow_diagram.pdf']
            }
          ],
          createdBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          lastUpdated: '2024-01-15T00:00:00Z'
        }
      ];

      const mockClassifications: DataClassification[] = [
        {
          id: 'class-1',
          name: 'Customer Personal Data',
          level: 'confidential',
          description: 'Personal identifiable information of customers',
          handling: ['encrypt_at_rest', 'access_logging', 'audit_trail'],
          retention: {
            period: 7,
            unit: 'years',
            action: 'delete',
            exceptions: ['legal_hold', 'ongoing_investigation']
          },
          encryption: {
            algorithm: 'AES-256',
            keySize: 256,
            rotation: 90,
            atRest: true,
            inTransit: true
          },
          access: {
            roles: ['data_analyst', 'customer_service'],
            permissions: ['read', 'update'],
            timeRestrictions: ['business_hours'],
            locationRestrictions: ['office_network']
          },
          createdBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      const mockCatalog: DataCatalog[] = [
        {
          id: 'catalog-1',
          name: 'Customer Database',
          description: 'Primary customer information database',
          type: 'database',
          location: 'aws-rds-us-east-1',
          classification: 'confidential',
          owner: 'data_team',
          steward: 'john.doe@company.com',
          tags: ['customer', 'personal', 'billing'],
          metadata: {
            schema_version: '2.1',
            row_count: 1500000,
            last_backup: '2024-01-15T02:00:00Z'
          },
          lastUpdated: '2024-01-15T10:30:00Z',
          status: 'active'
        }
      ];

      const mockLineage: DataLineage[] = [
        {
          id: 'lineage-1',
          source: 'customer_raw_data',
          target: 'customer_processed_data',
          transformation: 'data_cleaning_and_enrichment',
          timestamp: '2024-01-15T08:00:00Z',
          user: 'data_engineer',
          metadata: {
            transformation_type: 'ETL',
            records_processed: 1500000,
            quality_score: 0.98
          }
        }
      ];

      const mockAudits: ComplianceAudit[] = [
        {
          id: 'audit-1',
          name: 'Q1 2024 GDPR Compliance Audit',
          type: 'internal',
          scope: ['customer_data', 'employee_data', 'vendor_data'],
          status: 'completed',
          findings: [
            {
              id: 'finding-1',
              severity: 'medium',
              category: 'Data Retention',
              description: 'Some customer records exceed retention period',
              recommendation: 'Implement automated data deletion process',
              status: 'in-progress',
              assignedTo: 'data_team',
              dueDate: '2024-03-31T00:00:00Z'
            }
          ],
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-15T00:00:00Z',
          auditor: 'internal_audit_team',
          report: 'gdpr_audit_q1_2024.pdf'
        }
      ];

      const mockQuality: DataQuality[] = [
        {
          id: 'quality-1',
          dataset: 'customer_database',
          metric: 'completeness',
          value: 0.98,
          threshold: 0.95,
          status: 'pass',
          lastCheck: '2024-01-15T06:00:00Z',
          trend: 'stable'
        }
      ];

      const mockPrivacyRequests: PrivacyRequest[] = [
        {
          id: 'privacy-1',
          type: 'access',
          requester: 'john.smith@email.com',
          dataSubject: 'john.smith@email.com',
          status: 'completed',
          requestDate: '2024-01-10T00:00:00Z',
          dueDate: '2024-01-24T00:00:00Z',
          completionDate: '2024-01-12T00:00:00Z',
          notes: 'Data export provided via secure link'
        }
      ];

      setDataPolicies(mockPolicies);
      setClassifications(mockClassifications);
      setDataCatalog(mockCatalog);
      setDataLineage(mockLineage);
      setComplianceAudits(mockAudits);
      setDataQuality(mockQuality);
      setPrivacyRequests(mockPrivacyRequests);
    } catch (error) {
      console.error('Error loading governance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'non-compliant': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-blue-600 bg-blue-100';
      case 'pass': return 'text-green-600 bg-green-100';
      case 'fail': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'public': return 'text-green-600 bg-green-100';
      case 'internal': return 'text-blue-600 bg-blue-100';
      case 'confidential': return 'text-yellow-600 bg-yellow-100';
      case 'restricted': return 'text-orange-600 bg-orange-100';
      case 'secret': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
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
              <p className="text-2xl font-bold text-gray-900">{dataPolicies.filter(p => p.status === 'active').length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">📋</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-green-500">↗</span>
              <span className="ml-1">15% from last quarter</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
              <p className="text-2xl font-bold text-gray-900">98.5%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-green-500">↗</span>
              <span className="ml-1">2.3% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Data Assets</p>
              <p className="text-2xl font-bold text-gray-900">{dataCatalog.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">🗄️</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-green-500">↗</span>
              <span className="ml-1">8% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Privacy Requests</p>
              <p className="text-2xl font-bold text-gray-900">{privacyRequests.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-2xl">🔒</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-green-500">↗</span>
              <span className="ml-1">12% from last month</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Compliance Audits</h3>
          <div className="space-y-3">
            {complianceAudits.slice(0, 3).map((audit) => (
              <div key={audit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">📊</span>
                  <div>
                    <p className="font-medium text-gray-900">{audit.name}</p>
                    <p className="text-sm text-gray-500">{audit.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(audit.status)}`}>
                  {audit.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Quality Metrics</h3>
          <div className="space-y-3">
            {dataQuality.slice(0, 3).map((quality) => (
              <div key={quality.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">📈</span>
                  <div>
                    <p className="font-medium text-gray-900">{quality.dataset}</p>
                    <p className="text-sm text-gray-500">{quality.metric}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quality.status)}`}>
                  {(quality.value * 100).toFixed(1)}%
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
        <h2 className="text-xl font-semibold text-gray-900">Data Policies</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create Policy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dataPolicies.map((policy) => (
          <div key={policy.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📋</span>
                <h3 className="font-semibold text-gray-900">{policy.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(policy.status)}`}>
                {policy.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{policy.description}</p>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Category:</span>
                <span className="font-medium capitalize">{policy.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Rules:</span>
                <span className="font-medium">{policy.rules.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Compliance:</span>
                <span className="font-medium">{policy.compliance.length} requirements</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Edit
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClassification = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Data Classification</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Add Classification
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {classifications.map((classification) => (
          <div key={classification.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏷️</span>
                <h3 className="font-semibold text-gray-900">{classification.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(classification.level)}`}>
                {classification.level}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{classification.description}</p>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Retention:</span>
                <span className="font-medium">{classification.retention.period} {classification.retention.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Encryption:</span>
                <span className="font-medium">{classification.encryption.algorithm}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Access Roles:</span>
                <span className="font-medium">{classification.access.roles.length}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Edit
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCatalog = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Data Catalog</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Add Asset
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classification</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dataCatalog.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                  <div className="text-sm text-gray-500">{asset.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">{asset.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(asset.classification)}`}>
                    {asset.classification}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{asset.owner}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(asset.lastUpdated).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLineage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Data Lineage</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Track Lineage
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transformation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dataLineage.map((lineage) => (
              <tr key={lineage.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{lineage.source}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{lineage.target}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lineage.transformation}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lineage.user}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(lineage.timestamp).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">View Details</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAudits = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Compliance Audits</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Schedule Audit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {complianceAudits.map((audit) => (
          <div key={audit.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📊</span>
                <h3 className="font-semibold text-gray-900">{audit.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(audit.status)}`}>
                {audit.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium capitalize">{audit.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Scope:</span>
                <span className="font-medium">{audit.scope.length} areas</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Findings:</span>
                <span className="font-medium">{audit.findings.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Auditor:</span>
                <span className="font-medium">{audit.auditor}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  View Report
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  View Findings
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuality = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Data Quality Metrics</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Add Metric
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dataset</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Check</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dataQuality.map((quality) => (
              <tr key={quality.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{quality.dataset}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">{quality.metric}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{(quality.value * 100).toFixed(1)}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{(quality.threshold * 100).toFixed(1)}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quality.status)}`}>
                    {quality.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`text-sm ${
                      quality.trend === 'improving' ? 'text-green-600' :
                      quality.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {quality.trend === 'improving' ? '↗' : quality.trend === 'declining' ? '↘' : '→'}
                    </span>
                    <span className="ml-1 text-sm text-gray-900 capitalize">{quality.trend}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(quality.lastCheck).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Privacy Requests</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          New Request
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {privacyRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 capitalize">{request.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{request.requester}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(request.requestDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(request.dueDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Process</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading governance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Data Governance & Compliance</h1>
          <p className="mt-2 text-gray-600">
            Manage data policies, classifications, compliance, and privacy requirements
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'policies', name: 'Policies', icon: '📋' },
                { id: 'classification', name: 'Classification', icon: '🏷️' },
                { id: 'catalog', name: 'Data Catalog', icon: '🗄️' },
                { id: 'lineage', name: 'Data Lineage', icon: '🔄' },
                { id: 'audits', name: 'Audits', icon: '📊' },
                { id: 'quality', name: 'Data Quality', icon: '📈' },
                { id: 'privacy', name: 'Privacy', icon: '🔒' }
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
            {activeTab === 'classification' && renderClassification()}
            {activeTab === 'catalog' && renderCatalog()}
            {activeTab === 'lineage' && renderLineage()}
            {activeTab === 'audits' && renderAudits()}
            {activeTab === 'quality' && renderQuality()}
            {activeTab === 'privacy' && renderPrivacy()}
          </div>
        </div>
      </div>
    </div>
  );
} 