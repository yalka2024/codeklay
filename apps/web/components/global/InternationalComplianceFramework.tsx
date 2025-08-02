// International Compliance Framework for CodePal
// Features: Global compliance management, data privacy, regional regulations, audit logging

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface ComplianceFramework {
  id: string;
  name: string;
  region: string;
  type: 'privacy' | 'security' | 'data_residency' | 'industry_specific';
  status: 'compliant' | 'in_progress' | 'non_compliant' | 'pending_review';
  complianceScore: number;
  lastAssessment: string;
  nextAssessment: string;
  requirements: ComplianceRequirement[];
  documentation: ComplianceDocument[];
  auditLogs: AuditLog[];
}

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  category: 'data_protection' | 'user_rights' | 'security' | 'transparency' | 'accountability';
  status: 'implemented' | 'in_progress' | 'not_started' | 'exempt';
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate: string;
  assignedTo: string;
  evidence: string[];
}

interface ComplianceDocument {
  id: string;
  name: string;
  type: 'policy' | 'procedure' | 'guideline' | 'template' | 'report';
  version: string;
  lastUpdated: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  url: string;
  tags: string[];
}

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  complianceImpact: 'low' | 'medium' | 'high' | 'critical';
  framework: string;
}

interface DataSubjectRequest {
  id: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  userId: string;
  userEmail: string;
  requestDate: string;
  dueDate: string;
  assignedTo: string;
  description: string;
  dataProcessed: string[];
  response: string;
}

interface PrivacyImpactAssessment {
  id: string;
  title: string;
  description: string;
  dataTypes: string[];
  processingPurposes: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'review' | 'approved' | 'mitigation_required';
  createdDate: string;
  lastUpdated: string;
  stakeholders: string[];
  recommendations: string[];
}

interface RegionalCompliance {
  region: string;
  frameworks: ComplianceFramework[];
  dataResidency: DataResidencyRequirement[];
  localLaws: LocalLaw[];
  contactInfo: RegionalContact[];
}

interface DataResidencyRequirement {
  id: string;
  region: string;
  dataType: string;
  requirement: string;
  status: 'compliant' | 'non_compliant' | 'in_progress';
  implementation: string;
  lastVerified: string;
}

interface LocalLaw {
  id: string;
  name: string;
  region: string;
  effectiveDate: string;
  description: string;
  impact: string;
  complianceStatus: 'compliant' | 'non_compliant' | 'review_required';
  actions: string[];
}

interface RegionalContact {
  id: string;
  region: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  responsibilities: string[];
}

export default function InternationalComplianceFramework() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'frameworks' | 'requests' | 'assessments' | 'regional' | 'audit'>('overview');
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [dataSubjectRequests, setDataSubjectRequests] = useState<DataSubjectRequest[]>([]);
  const [privacyAssessments, setPrivacyAssessments] = useState<PrivacyImpactAssessment[]>([]);
  const [regionalCompliance, setRegionalCompliance] = useState<RegionalCompliance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockFrameworks: ComplianceFramework[] = [
        {
          id: '1',
          name: 'General Data Protection Regulation (GDPR)',
          region: 'European Union',
          type: 'privacy',
          status: 'compliant',
          complianceScore: 95,
          lastAssessment: '2024-01-15',
          nextAssessment: '2024-07-15',
          requirements: [
            {
              id: 'req1',
              title: 'Data Processing Register',
              description: 'Maintain a record of all data processing activities',
              category: 'transparency',
              status: 'implemented',
              priority: 'critical',
              dueDate: '2024-01-31',
              assignedTo: 'Compliance Team',
              evidence: ['Processing register document', 'Automated logging system']
            },
            {
              id: 'req2',
              title: 'User Consent Management',
              description: 'Implement granular consent collection and management',
              category: 'user_rights',
              status: 'implemented',
              priority: 'critical',
              dueDate: '2024-01-31',
              assignedTo: 'Product Team',
              evidence: ['Consent management system', 'User preference center']
            }
          ],
          documentation: [
            {
              id: 'doc1',
              name: 'GDPR Privacy Policy',
              type: 'policy',
              version: '2.1',
              lastUpdated: '2024-01-10',
              status: 'approved',
              url: '/docs/gdpr-privacy-policy',
              tags: ['gdpr', 'privacy', 'policy']
            }
          ],
          auditLogs: [
            {
              id: 'audit1',
              timestamp: '2024-01-15T10:00:00Z',
              action: 'Compliance Assessment Completed',
              user: 'Compliance Officer',
              details: 'Annual GDPR compliance assessment completed with 95% score',
              complianceImpact: 'low',
              framework: 'GDPR'
            }
          ]
        },
        {
          id: '2',
          name: 'California Consumer Privacy Act (CCPA)',
          region: 'California, USA',
          type: 'privacy',
          status: 'compliant',
          complianceScore: 92,
          lastAssessment: '2024-01-10',
          nextAssessment: '2024-07-10',
          requirements: [
            {
              id: 'req3',
              title: 'Consumer Rights Implementation',
              description: 'Implement consumer rights to know, delete, and opt-out',
              category: 'user_rights',
              status: 'implemented',
              priority: 'critical',
              dueDate: '2024-01-31',
              assignedTo: 'Engineering Team',
              evidence: ['Consumer rights API', 'Opt-out mechanism']
            }
          ],
          documentation: [
            {
              id: 'doc2',
              name: 'CCPA Compliance Guide',
              type: 'guideline',
              version: '1.0',
              lastUpdated: '2024-01-05',
              status: 'approved',
              url: '/docs/ccpa-compliance-guide',
              tags: ['ccpa', 'california', 'privacy']
            }
          ],
          auditLogs: [
            {
              id: 'audit2',
              timestamp: '2024-01-10T14:30:00Z',
              action: 'CCPA Assessment',
              user: 'Legal Team',
              details: 'CCPA compliance verified with 92% score',
              complianceImpact: 'low',
              framework: 'CCPA'
            }
          ]
        },
        {
          id: '3',
          name: 'Lei Geral de Proteção de Dados (LGPD)',
          region: 'Brazil',
          type: 'privacy',
          status: 'in_progress',
          complianceScore: 78,
          lastAssessment: '2024-01-08',
          nextAssessment: '2024-04-08',
          requirements: [
            {
              id: 'req4',
              title: 'Data Protection Officer',
              description: 'Appoint and maintain a Data Protection Officer',
              category: 'accountability',
              status: 'in_progress',
              priority: 'high',
              dueDate: '2024-03-31',
              assignedTo: 'HR Team',
              evidence: ['DPO job description', 'Recruitment process']
            }
          ],
          documentation: [
            {
              id: 'doc3',
              name: 'LGPD Implementation Plan',
              type: 'procedure',
              version: '1.0',
              lastUpdated: '2024-01-08',
              status: 'draft',
              url: '/docs/lgpd-implementation',
              tags: ['lgpd', 'brazil', 'implementation']
            }
          ],
          auditLogs: [
            {
              id: 'audit3',
              timestamp: '2024-01-08T09:15:00Z',
              action: 'LGPD Gap Analysis',
              user: 'Compliance Team',
              details: 'LGPD compliance gap analysis completed, 78% compliant',
              complianceImpact: 'medium',
              framework: 'LGPD'
            }
          ]
        }
      ];

      const mockRequests: DataSubjectRequest[] = [
        {
          id: '1',
          type: 'access',
          status: 'completed',
          userId: 'user123',
          userEmail: 'user@example.com',
          requestDate: '2024-01-10',
          dueDate: '2024-01-24',
          assignedTo: 'Privacy Team',
          description: 'User requested access to all personal data',
          dataProcessed: ['Profile information', 'Usage analytics', 'Payment history'],
          response: 'Data export provided to user on 2024-01-15'
        },
        {
          id: '2',
          type: 'erasure',
          status: 'in_progress',
          userId: 'user456',
          userEmail: 'user2@example.com',
          requestDate: '2024-01-12',
          dueDate: '2024-01-26',
          assignedTo: 'Data Team',
          description: 'User requested complete data deletion',
          dataProcessed: ['Account data', 'Project files', 'Analytics data'],
          response: 'Data deletion in progress, scheduled for completion on 2024-01-20'
        }
      ];

      const mockAssessments: PrivacyImpactAssessment[] = [
        {
          id: '1',
          title: 'AI Code Analysis Feature',
          description: 'Assessment of privacy impact for AI-powered code analysis',
          dataTypes: ['Code files', 'User preferences', 'Usage patterns'],
          processingPurposes: ['Code quality improvement', 'Personalized suggestions'],
          riskLevel: 'medium',
          status: 'approved',
          createdDate: '2024-01-05',
          lastUpdated: '2024-01-15',
          stakeholders: ['Product Team', 'Legal Team', 'Security Team'],
          recommendations: [
            'Implement data minimization',
            'Add user consent for AI processing',
            'Regular privacy reviews'
          ]
        }
      ];

      const mockRegional: RegionalCompliance[] = [
        {
          region: 'European Union',
          frameworks: [mockFrameworks[0]],
          dataResidency: [
            {
              id: 'dr1',
              region: 'EU',
              dataType: 'Personal Data',
              requirement: 'Data must be stored within EU borders',
              status: 'compliant',
              implementation: 'AWS EU-West-1 region',
              lastVerified: '2024-01-15'
            }
          ],
          localLaws: [
            {
              id: 'law1',
              name: 'GDPR',
              region: 'EU',
              effectiveDate: '2018-05-25',
              description: 'Comprehensive data protection regulation',
              impact: 'High - affects all data processing activities',
              complianceStatus: 'compliant',
              actions: ['Regular audits', 'Staff training', 'Documentation updates']
            }
          ],
          contactInfo: [
            {
              id: 'contact1',
              region: 'EU',
              role: 'Data Protection Officer',
              name: 'Maria Schmidt',
              email: 'dpo@codepal.com',
              phone: '+49 30 12345678',
              responsibilities: ['GDPR compliance', 'Data subject requests', 'Privacy assessments']
            }
          ]
        }
      ];

      setFrameworks(mockFrameworks);
      setDataSubjectRequests(mockRequests);
      setPrivacyAssessments(mockAssessments);
      setRegionalCompliance(mockRegional);
      setLoading(false);
    }, 1000);
  };

  const updateRequirementStatus = async (frameworkId: string, requirementId: string, status: string) => {
    setFrameworks(prev => prev.map(framework => {
      if (framework.id === frameworkId) {
        return {
          ...framework,
          requirements: framework.requirements.map(req => 
            req.id === requirementId ? { ...req, status: status as any } : req
          )
        };
      }
      return framework;
    }));
  };

  const updateRequestStatus = async (requestId: string, status: string) => {
    setDataSubjectRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: status as any } : req
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'implemented':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'non_compliant':
      case 'not_started':
        return 'text-red-600 bg-red-100';
      case 'pending_review':
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Compliance</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">88%</div>
          <p className="text-sm text-gray-600">Average across all frameworks</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Frameworks</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">{frameworks.length}</div>
          <p className="text-sm text-gray-600">Compliance frameworks</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Requests</h3>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {dataSubjectRequests.filter(r => r.status === 'pending' || r.status === 'in_progress').length}
          </div>
          <p className="text-sm text-gray-600">Data subject requests</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessments Due</h3>
          <div className="text-3xl font-bold text-red-600 mb-2">3</div>
          <p className="text-sm text-gray-600">Next 30 days</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Compliance Activities</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {frameworks.flatMap(f => f.auditLogs).slice(0, 5).map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{log.action}</p>
                  <p className="text-sm text-gray-600">{log.details}</p>
                  <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(log.complianceImpact)}`}>
                  {log.complianceImpact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFrameworks = () => (
    <div className="space-y-6">
      {frameworks.map(framework => (
        <div key={framework.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{framework.name}</h3>
                <p className="text-sm text-gray-600">{framework.region}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{framework.complianceScore}%</div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(framework.status)}`}>
                  {framework.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Requirements</h4>
                <div className="space-y-3">
                  {framework.requirements.map(req => (
                    <div key={req.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{req.title}</h5>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(req.priority)}`}>
                            {req.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(req.status)}`}>
                            {req.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{req.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Due: {new Date(req.dueDate).toLocaleDateString()}</span>
                        <span>Assigned: {req.assignedTo}</span>
                      </div>
                      <div className="mt-2">
                        <select
                          value={req.status}
                          onChange={(e) => updateRequirementStatus(framework.id, req.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="not_started">Not Started</option>
                          <option value="in_progress">In Progress</option>
                          <option value="implemented">Implemented</option>
                          <option value="exempt">Exempt</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Documentation</h4>
                <div className="space-y-3">
                  {framework.documentation.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">v{doc.version} • {doc.type}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(doc.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
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

  const renderRequests = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Data Subject Requests</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {dataSubjectRequests.map(request => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request
                    </h4>
                    <p className="text-sm text-gray-600">{request.userEmail}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(request.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Data Processed:</p>
                    <div className="flex flex-wrap gap-1">
                      {request.dataProcessed.map((data, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {data}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Assigned To:</p>
                    <p className="text-sm text-gray-900">{request.assignedTo}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-700 mb-1">Response:</p>
                    <p className="text-sm text-gray-600">{request.response || 'No response yet'}</p>
                  </div>
                  <select
                    value={request.status}
                    onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                    className="ml-4 text-sm border border-gray-300 rounded px-3 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssessments = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Privacy Impact Assessments</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {privacyAssessments.map(assessment => (
              <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{assessment.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(assessment.status)}`}>
                    {assessment.status.replace('_', ' ')}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{assessment.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Data Types:</p>
                    <div className="flex flex-wrap gap-1">
                      {assessment.dataTypes.map((type, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Risk Level:</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(assessment.riskLevel)}`}>
                      {assessment.riskLevel}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Recommendations:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {assessment.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {new Date(assessment.createdDate).toLocaleDateString()}</span>
                  <span>Updated: {new Date(assessment.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegional = () => (
    <div className="space-y-6">
      {regionalCompliance.map(region => (
        <div key={region.region} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{region.region}</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Data Residency Requirements</h4>
                <div className="space-y-3">
                  {region.dataResidency.map(req => (
                    <div key={req.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{req.dataType}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(req.status)}`}>
                          {req.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{req.requirement}</p>
                      <p className="text-xs text-gray-500">Implementation: {req.implementation}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Regional Contacts</h4>
                <div className="space-y-3">
                  {region.contactInfo.map(contact => (
                    <div key={contact.id} className="p-3 border border-gray-200 rounded-lg">
                      <h5 className="font-medium text-gray-900">{contact.name}</h5>
                      <p className="text-sm text-gray-600">{contact.role}</p>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
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

  const renderAudit = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Compliance Audit Log</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {frameworks.flatMap(f => f.auditLogs).map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{log.action}</h4>
                    <span className="text-sm text-gray-500">by {log.user}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(log.timestamp).toLocaleString()} • Framework: {log.framework}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(log.complianceImpact)}`}>
                  {log.complianceImpact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading compliance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">International Compliance Framework</h1>
          <p className="text-gray-600 mt-2">
            Global compliance management, data privacy, and regional regulations
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'frameworks', label: 'Compliance Frameworks' },
              { id: 'requests', label: 'Data Subject Requests' },
              { id: 'assessments', label: 'Privacy Assessments' },
              { id: 'regional', label: 'Regional Compliance' },
              { id: 'audit', label: 'Audit Log' }
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
          {activeTab === 'frameworks' && renderFrameworks()}
          {activeTab === 'requests' && renderRequests()}
          {activeTab === 'assessments' && renderAssessments()}
          {activeTab === 'regional' && renderRegional()}
          {activeTab === 'audit' && renderAudit()}
        </div>
      </div>
    </div>
  );
} 