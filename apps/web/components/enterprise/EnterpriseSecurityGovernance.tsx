// Enterprise Security & Governance for CodePal
// Features: Advanced RBAC, enterprise authentication, audit logging, data governance, security policies

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  users: number;
  createdAt: string;
  lastModified: string;
  status: 'active' | 'inactive' | 'deprecated';
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'read' | 'write' | 'delete' | 'admin';
  scope: 'global' | 'project' | 'organization' | 'user';
  description: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastLogin: string;
  status: 'active' | 'inactive' | 'suspended';
  permissions: Permission[];
}

interface SSOConfig {
  id: string;
  provider: 'saml' | 'oauth' | 'ldap' | 'azure' | 'okta';
  name: string;
  status: 'active' | 'inactive' | 'configuring';
  domain: string;
  users: number;
  lastSync: string;
  config: SSOConfiguration;
}

interface SSOConfiguration {
  entityId: string;
  ssoUrl: string;
  certificate: string;
  attributes: string[];
  groups: string[];
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure' | 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface DataGovernance {
  id: string;
  policy: string;
  category: 'privacy' | 'security' | 'compliance' | 'retention';
  status: 'active' | 'draft' | 'archived';
  description: string;
  rules: DataRule[];
  lastReview: string;
  nextReview: string;
}

interface DataRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  priority: number;
  status: 'active' | 'inactive';
}

interface SecurityPolicy {
  id: string;
  name: string;
  category: 'access' | 'data' | 'network' | 'application';
  status: 'active' | 'draft' | 'archived';
  description: string;
  rules: SecurityRule[];
  enforcement: 'strict' | 'moderate' | 'flexible';
  lastUpdated: string;
}

interface SecurityRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  priority: number;
  status: 'active' | 'inactive';
}

export default function EnterpriseSecurityGovernance() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'rbac' | 'sso' | 'audit' | 'governance' | 'policies'>('overview');
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [ssoConfigs, setSsoConfigs] = useState<SSOConfig[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [dataGovernance, setDataGovernance] = useState<DataGovernance[]>([]);
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockRoles: Role[] = [
        {
          id: '1',
          name: 'System Administrator',
          description: 'Full system access and management capabilities',
          permissions: [
            { id: '1', name: 'User Management', resource: 'users', action: 'admin', scope: 'global', description: 'Full user management access' },
            { id: '2', name: 'System Configuration', resource: 'system', action: 'admin', scope: 'global', description: 'System configuration access' }
          ],
          users: 3,
          createdAt: '2024-01-15',
          lastModified: '2024-03-20',
          status: 'active'
        },
        {
          id: '2',
          name: 'Project Manager',
          description: 'Project management and team coordination',
          permissions: [
            { id: '3', name: 'Project Management', resource: 'projects', action: 'write', scope: 'project', description: 'Project management access' },
            { id: '4', name: 'Team Management', resource: 'teams', action: 'write', scope: 'project', description: 'Team management access' }
          ],
          users: 12,
          createdAt: '2024-01-20',
          lastModified: '2024-03-15',
          status: 'active'
        },
        {
          id: '3',
          name: 'Developer',
          description: 'Development and code management access',
          permissions: [
            { id: '5', name: 'Code Access', resource: 'code', action: 'write', scope: 'project', description: 'Code repository access' },
            { id: '6', name: 'Deployment', resource: 'deployment', action: 'write', scope: 'project', description: 'Deployment access' }
          ],
          users: 45,
          createdAt: '2024-01-25',
          lastModified: '2024-03-10',
          status: 'active'
        }
      ];

      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@company.com',
          role: 'System Administrator',
          department: 'IT',
          lastLogin: '2024-03-20T10:30:00Z',
          status: 'active',
          permissions: mockRoles[0].permissions
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          role: 'Project Manager',
          department: 'Engineering',
          lastLogin: '2024-03-20T09:15:00Z',
          status: 'active',
          permissions: mockRoles[1].permissions
        },
        {
          id: '3',
          name: 'Mike Chen',
          email: 'mike.chen@company.com',
          role: 'Developer',
          department: 'Engineering',
          lastLogin: '2024-03-20T08:45:00Z',
          status: 'active',
          permissions: mockRoles[2].permissions
        }
      ];

      const mockSSOConfigs: SSOConfig[] = [
        {
          id: '1',
          provider: 'saml',
          name: 'Company SSO',
          status: 'active',
          domain: 'company.com',
          users: 150,
          lastSync: '2024-03-20T06:00:00Z',
          config: {
            entityId: 'https://company.com/saml',
            ssoUrl: 'https://sso.company.com/saml/login',
            certificate: '-----BEGIN CERTIFICATE-----...',
            attributes: ['email', 'name', 'department', 'groups'],
            groups: ['developers', 'managers', 'admins']
          }
        },
        {
          id: '2',
          provider: 'oauth',
          name: 'Google Workspace',
          status: 'active',
          domain: 'company.com',
          users: 45,
          lastSync: '2024-03-20T05:30:00Z',
          config: {
            entityId: 'https://accounts.google.com',
            ssoUrl: 'https://accounts.google.com/oauth/authorize',
            certificate: '',
            attributes: ['email', 'name', 'picture'],
            groups: ['google-users']
          }
        }
      ];

      const mockAuditLogs: AuditLog[] = [
        {
          id: '1',
          timestamp: '2024-03-20T10:30:00Z',
          user: 'john.smith@company.com',
          action: 'USER_LOGIN',
          resource: 'authentication',
          details: 'Successful login via SSO',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'success',
          severity: 'low'
        },
        {
          id: '2',
          timestamp: '2024-03-20T10:25:00Z',
          user: 'sarah.johnson@company.com',
          action: 'PERMISSION_GRANTED',
          resource: 'projects',
          details: 'Granted write access to Project Alpha',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          status: 'success',
          severity: 'medium'
        },
        {
          id: '3',
          timestamp: '2024-03-20T10:20:00Z',
          user: 'unknown@company.com',
          action: 'LOGIN_FAILED',
          resource: 'authentication',
          details: 'Invalid credentials attempt',
          ipAddress: '203.0.113.50',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'failure',
          severity: 'high'
        }
      ];

      const mockDataGovernance: DataGovernance[] = [
        {
          id: '1',
          policy: 'Data Retention Policy',
          category: 'retention',
          status: 'active',
          description: 'Defines how long different types of data should be retained',
          rules: [
            { id: '1', name: 'User Data Retention', condition: 'user_data', action: 'retain_2_years', priority: 1, status: 'active' },
            { id: '2', name: 'Log Data Retention', condition: 'log_data', action: 'retain_90_days', priority: 2, status: 'active' }
          ],
          lastReview: '2024-02-15',
          nextReview: '2024-05-15'
        },
        {
          id: '2',
          policy: 'Privacy Protection Policy',
          category: 'privacy',
          status: 'active',
          description: 'Ensures compliance with privacy regulations',
          rules: [
            { id: '3', name: 'PII Encryption', condition: 'pii_data', action: 'encrypt_at_rest', priority: 1, status: 'active' },
            { id: '4', name: 'Data Access Control', condition: 'sensitive_data', action: 'require_approval', priority: 2, status: 'active' }
          ],
          lastReview: '2024-03-01',
          nextReview: '2024-06-01'
        }
      ];

      const mockSecurityPolicies: SecurityPolicy[] = [
        {
          id: '1',
          name: 'Access Control Policy',
          category: 'access',
          status: 'active',
          description: 'Defines access control requirements for all systems',
          rules: [
            { id: '1', name: 'Multi-Factor Authentication', condition: 'all_users', action: 'require_mfa', priority: 1, status: 'active' },
            { id: '2', name: 'Session Timeout', condition: 'user_sessions', action: 'timeout_8_hours', priority: 2, status: 'active' }
          ],
          enforcement: 'strict',
          lastUpdated: '2024-03-15'
        },
        {
          id: '2',
          name: 'Data Security Policy',
          category: 'data',
          status: 'active',
          description: 'Ensures data security and protection',
          rules: [
            { id: '3', name: 'Data Encryption', condition: 'all_data', action: 'encrypt_transit', priority: 1, status: 'active' },
            { id: '4', name: 'Backup Encryption', condition: 'backup_data', action: 'encrypt_backup', priority: 2, status: 'active' }
          ],
          enforcement: 'strict',
          lastUpdated: '2024-03-10'
        }
      ];

      setRoles(mockRoles);
      setUsers(mockUsers);
      setPermissions(mockRoles.flatMap(role => role.permissions));
      setSsoConfigs(mockSSOConfigs);
      setAuditLogs(mockAuditLogs);
      setDataGovernance(mockDataGovernance);
      setSecurityPolicies(mockSecurityPolicies);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'deprecated': return 'text-yellow-600 bg-yellow-100';
      case 'configuring': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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

  const renderOverview = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          <p className="text-sm text-blue-700">Active enterprise users</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Active Roles</h3>
          <p className="text-3xl font-bold text-green-600">{roles.filter(r => r.status === 'active').length}</p>
          <p className="text-sm text-green-700">RBAC roles configured</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">SSO Providers</h3>
          <p className="text-3xl font-bold text-purple-600">{ssoConfigs.filter(s => s.status === 'active').length}</p>
          <p className="text-sm text-purple-700">Active SSO configurations</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900">Security Policies</h3>
          <p className="text-3xl font-bold text-orange-600">{securityPolicies.filter(p => p.status === 'active').length}</p>
          <p className="text-sm text-orange-700">Active security policies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Audit Events</h3>
          <div className="space-y-3">
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{log.action}</p>
                  <p className="text-sm text-gray-600">{log.user} • {log.resource}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                  {log.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Governance Status</h3>
          <div className="space-y-3">
            {dataGovernance.map(policy => (
              <div key={policy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{policy.policy}</p>
                  <p className="text-sm text-gray-600">{policy.category} • {policy.rules.length} rules</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                  {policy.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRBAC = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Roles & Permissions</h3>
          <div className="space-y-4">
            {roles.map(role => (
              <div key={role.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{role.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(role.status)}`}>
                    {role.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{role.users} users</span>
                  <span>Last modified: {new Date(role.lastModified).toLocaleDateString()}</span>
                </div>
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h5>
                  <div className="space-y-1">
                    {role.permissions.map(permission => (
                      <div key={permission.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{permission.name}</span>
                        <span className="text-gray-500">{permission.action} on {permission.resource}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{user.role} • {user.department}</span>
                  <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSSO = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">SSO Configuration</h3>
      <div className="space-y-6">
        {ssoConfigs.map(config => (
          <div key={config.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{config.name}</h4>
                <p className="text-sm text-gray-600">{config.provider.toUpperCase()} • {config.domain}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(config.status)}`}>
                {config.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Users</p>
                <p className="text-lg font-semibold text-gray-900">{config.users}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Sync</p>
                <p className="text-sm text-gray-900">{new Date(config.lastSync).toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Attributes</p>
                <p className="text-sm text-gray-900">{config.config.attributes.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-2">Configuration Details</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Entity ID:</span>
                  <span className="text-gray-900 font-mono">{config.config.entityId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SSO URL:</span>
                  <span className="text-gray-900 font-mono">{config.config.ssoUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Groups:</span>
                  <span className="text-gray-900">{config.config.groups.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAudit = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Log</h3>
      <div className="space-y-3">
        {auditLogs.map(log => (
          <div key={log.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                  {log.severity}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.status === 'success' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                  {log.status}
                </span>
              </div>
              <span className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
            </div>
            
            <div className="mb-2">
              <p className="font-medium text-gray-900">{log.action}</p>
              <p className="text-sm text-gray-600">{log.details}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500">
              <div>User: {log.user}</div>
              <div>Resource: {log.resource}</div>
              <div>IP: {log.ipAddress}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGovernance = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Governance</h3>
      <div className="space-y-6">
        {dataGovernance.map(policy => (
          <div key={policy.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{policy.policy}</h4>
                <p className="text-sm text-gray-600">{policy.category} • {policy.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(policy.status)}`}>
                {policy.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Review</p>
                <p className="text-sm text-gray-900">{policy.lastReview}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Next Review</p>
                <p className="text-sm text-gray-900">{policy.nextReview}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-2">Rules ({policy.rules.length})</h5>
              <div className="space-y-2">
                {policy.rules.map(rule => (
                  <div key={rule.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{rule.name}</p>
                      <p className="text-xs text-gray-600">{rule.condition} → {rule.action}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Priority: {rule.priority}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rule.status)}`}>
                        {rule.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPolicies = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Policies</h3>
      <div className="space-y-6">
        {securityPolicies.map(policy => (
          <div key={policy.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{policy.name}</h4>
                <p className="text-sm text-gray-600">{policy.category} • {policy.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(policy.status)}`}>
                  {policy.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  policy.enforcement === 'strict' ? 'text-red-600 bg-red-100' : 
                  policy.enforcement === 'moderate' ? 'text-yellow-600 bg-yellow-100' : 
                  'text-green-600 bg-green-100'
                }`}>
                  {policy.enforcement}
                </span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-2">Rules ({policy.rules.length})</h5>
              <div className="space-y-2">
                {policy.rules.map(rule => (
                  <div key={rule.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{rule.name}</p>
                      <p className="text-xs text-gray-600">{rule.condition} → {rule.action}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Priority: {rule.priority}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rule.status)}`}>
                        {rule.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              Last updated: {new Date(policy.lastUpdated).toLocaleDateString()}
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
          <p className="mt-4 text-gray-600">Loading enterprise security data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Security & Governance</h1>
          <p className="text-gray-600 mt-2">
            Advanced role-based access control, enterprise authentication, audit logging, and security policies
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'rbac', label: 'RBAC' },
              { id: 'sso', label: 'SSO' },
              { id: 'audit', label: 'Audit Log' },
              { id: 'governance', label: 'Data Governance' },
              { id: 'policies', label: 'Security Policies' }
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
          {activeTab === 'rbac' && renderRBAC()}
          {activeTab === 'sso' && renderSSO()}
          {activeTab === 'audit' && renderAudit()}
          {activeTab === 'governance' && renderGovernance()}
          {activeTab === 'policies' && renderPolicies()}
        </div>
      </div>
    </div>
  );
} 