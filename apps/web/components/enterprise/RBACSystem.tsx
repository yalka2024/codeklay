// Enterprise RBAC System for CodePal
// Features: Role-based access control, team management, permission inheritance

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface Role {
  id: string;
  name: string;
  description: string;
  level: number; // 1 = highest (Super Admin), 5 = lowest (Viewer)
  permissions: Permission[];
  inheritsFrom?: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string; // 'project', 'user', 'organization', 'analytics', etc.
  action: string; // 'create', 'read', 'update', 'delete', 'manage'
  scope: 'global' | 'organization' | 'team' | 'project' | 'personal';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization: Organization;
  team?: Team;
  permissions: Permission[];
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: 'free' | 'pro' | 'enterprise';
  settings: OrganizationSettings;
  createdAt: string;
}

interface OrganizationSettings {
  ssoEnabled: boolean;
  mfaRequired: boolean;
  sessionTimeout: number;
  maxUsers: number;
  allowedDomains: string[];
  customRoles: boolean;
}

interface Team {
  id: string;
  name: string;
  description: string;
  organization: Organization;
  members: User[];
  projects: Project[];
  permissions: Permission[];
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  team: Team;
  permissions: Permission[];
  createdAt: string;
}

interface PermissionMatrix {
  [roleName: string]: {
    [resource: string]: {
      [action: string]: boolean;
    };
  };
}

export default function RBACSystem() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionMatrix, setPermissionMatrix] = useState<PermissionMatrix>({});

  // Load RBAC data
  useEffect(() => {
    loadRBACData();
  }, []);

  const loadRBACData = async () => {
    setIsLoading(true);
    try {
      // Load roles
      const rolesResponse = await fetch('/api/enterprise/roles');
      if (rolesResponse.ok) {
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);
      }

      // Load users
      const usersResponse = await fetch('/api/enterprise/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
      }

      // Load teams
      const teamsResponse = await fetch('/api/enterprise/teams');
      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        setTeams(teamsData);
      }

      // Load organizations
      const orgsResponse = await fetch('/api/enterprise/organizations');
      if (orgsResponse.ok) {
        const orgsData = await orgsResponse.json();
        setOrganizations(orgsData);
      }

      // Generate permission matrix
      generatePermissionMatrix();
    } catch (error) {
      console.error('Failed to load RBAC data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePermissionMatrix = () => {
    const matrix: PermissionMatrix = {};
    
    roles.forEach(role => {
      matrix[role.name] = {};
      role.permissions.forEach(permission => {
        if (!matrix[role.name][permission.resource]) {
          matrix[role.name][permission.resource] = {};
        }
        matrix[role.name][permission.resource][permission.action] = true;
      });
    });

    setPermissionMatrix(matrix);
  };

  // Role Management
  const createRole = async (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/enterprise/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData)
      });

      if (response.ok) {
        const newRole = await response.json();
        setRoles(prev => [...prev, newRole]);
        generatePermissionMatrix();
      }
    } catch (error) {
      console.error('Failed to create role:', error);
    }
  };

  const updateRole = async (roleId: string, updates: Partial<Role>) => {
    try {
      const response = await fetch(`/api/enterprise/roles/${roleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedRole = await response.json();
        setRoles(prev => prev.map(role => role.id === roleId ? updatedRole : role));
        generatePermissionMatrix();
      }
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const deleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role? This will affect all users with this role.')) {
      return;
    }

    try {
      const response = await fetch(`/api/enterprise/roles/${roleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setRoles(prev => prev.filter(role => role.id !== roleId));
        generatePermissionMatrix();
      }
    } catch (error) {
      console.error('Failed to delete role:', error);
    }
  };

  // User Management
  const assignRoleToUser = async (userId: string, roleId: string) => {
    try {
      const response = await fetch(`/api/enterprise/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
      }
    } catch (error) {
      console.error('Failed to assign role:', error);
    }
  };

  const bulkAssignRole = async (userIds: string[], roleId: string) => {
    try {
      const response = await fetch('/api/enterprise/users/bulk-assign-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds, roleId })
      });

      if (response.ok) {
        const updatedUsers = await response.json();
        setUsers(prev => prev.map(user => {
          const updatedUser = updatedUsers.find((u: User) => u.id === user.id);
          return updatedUser || user;
        }));
      }
    } catch (error) {
      console.error('Failed to bulk assign role:', error);
    }
  };

  // Permission Management
  const addPermissionToRole = async (roleId: string, permission: Permission) => {
    try {
      const response = await fetch(`/api/enterprise/roles/${roleId}/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permission)
      });

      if (response.ok) {
        const updatedRole = await response.json();
        setRoles(prev => prev.map(role => role.id === roleId ? updatedRole : role));
        generatePermissionMatrix();
      }
    } catch (error) {
      console.error('Failed to add permission:', error);
    }
  };

  const removePermissionFromRole = async (roleId: string, permissionId: string) => {
    try {
      const response = await fetch(`/api/enterprise/roles/${roleId}/permissions/${permissionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedRole = await response.json();
        setRoles(prev => prev.map(role => role.id === roleId ? updatedRole : role));
        generatePermissionMatrix();
      }
    } catch (error) {
      console.error('Failed to remove permission:', error);
    }
  };

  // Get role level color
  const getRoleLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'text-red-500'; // Super Admin
      case 2: return 'text-orange-500'; // Admin
      case 3: return 'text-blue-500'; // Manager
      case 4: return 'text-green-500'; // Developer
      case 5: return 'text-gray-500'; // Viewer
      default: return 'text-gray-400';
    }
  };

  // Get permission scope color
  const getPermissionScopeColor = (scope: string) => {
    switch (scope) {
      case 'global': return 'bg-red-100 text-red-800';
      case 'organization': return 'bg-blue-100 text-blue-800';
      case 'team': return 'bg-green-100 text-green-800';
      case 'project': return 'bg-yellow-100 text-yellow-800';
      case 'personal': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const RBACOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">Total Roles</h3>
          <div className="text-3xl font-bold text-blue-400">{roles.length}</div>
          <p className="text-gray-400 text-sm">System + Custom</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">Active Users</h3>
          <div className="text-3xl font-bold text-green-400">
            {users.filter(u => u.status === 'active').length}
          </div>
          <p className="text-gray-400 text-sm">of {users.length} total</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">Teams</h3>
          <div className="text-3xl font-bold text-purple-400">{teams.length}</div>
          <p className="text-gray-400 text-sm">Active teams</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">Organizations</h3>
          <div className="text-3xl font-bold text-orange-400">{organizations.length}</div>
          <p className="text-gray-400 text-sm">Multi-tenant</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-4">Role Distribution</h3>
          <div className="space-y-3">
            {roles.map(role => (
              <div key={role.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getRoleLevelColor(role.level).replace('text-', 'bg-')}`}></div>
                  <span className="text-gray-300">{role.name}</span>
                  {role.isSystem && (
                    <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">System</span>
                  )}
                </div>
                <span className="text-gray-400 text-sm">
                  {users.filter(u => u.role.id === role.id).length} users
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {users.slice(0, 5).map(user => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <div className="text-gray-300 font-medium">{user.name}</div>
                  <div className="text-gray-400 text-sm">{user.email}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${getRoleLevelColor(user.role.level)}`}>
                    {user.role.name}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {new Date(user.lastActive).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const RoleManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Role Management</h3>
        <button
          onClick={() => setActiveTab('create-role')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Create New Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => (
          <div
            key={role.id}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => setSelectedRole(role)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className={`text-lg font-semibold ${getRoleLevelColor(role.level)}`}>
                  {role.name}
                </h4>
                <p className="text-gray-400 text-sm">{role.description}</p>
              </div>
              {role.isSystem && (
                <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">System</span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Level:</span>
                <span className="text-gray-300">{role.level}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Permissions:</span>
                <span className="text-gray-300">{role.permissions.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Users:</span>
                <span className="text-gray-300">
                  {users.filter(u => u.role.id === role.id).length}
                </span>
              </div>
            </div>

            {!role.isSystem && (
              <div className="flex items-center space-x-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRole(role);
                    setActiveTab('edit-role');
                  }}
                  className="flex-1 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRole(role.id);
                  }}
                  className="flex-1 px-3 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const UserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">User Management</h3>
        <div className="flex items-center space-x-2">
          <select className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600">
            <option value="">Filter by Role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
            Bulk Actions
          </button>
        </div>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl border border-white border-opacity-20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-300 py-3 px-4">User</th>
                <th className="text-left text-gray-300 py-3 px-4">Role</th>
                <th className="text-left text-gray-300 py-3 px-4">Organization</th>
                <th className="text-left text-gray-300 py-3 px-4">Team</th>
                <th className="text-left text-gray-300 py-3 px-4">Status</th>
                <th className="text-left text-gray-300 py-3 px-4">Last Active</th>
                <th className="text-left text-gray-300 py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-white hover:bg-opacity-5">
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-gray-300 font-medium">{user.name}</div>
                      <div className="text-gray-400 text-xs">{user.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm ${getRoleLevelColor(user.role.level)}`}>
                      {user.role.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{user.organization.name}</td>
                  <td className="py-3 px-4 text-gray-300">{user.team?.name || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.status === 'active' ? 'bg-green-900 text-green-200' :
                      user.status === 'inactive' ? 'bg-gray-900 text-gray-200' :
                      'bg-red-900 text-red-200'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {new Date(user.lastActive).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setActiveTab('edit-user');
                        }}
                        className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setActiveTab('permissions');
                        }}
                        className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded"
                      >
                        Permissions
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PermissionMatrix = () => (
    <div className="space-y-6">
      <h3 className="text-white font-semibold">Permission Matrix</h3>
      
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl border border-white border-opacity-20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-300 py-3 px-4">Role</th>
                <th className="text-left text-gray-300 py-3 px-4">Projects</th>
                <th className="text-left text-gray-300 py-3 px-4">Users</th>
                <th className="text-left text-gray-300 py-3 px-4">Analytics</th>
                <th className="text-left text-gray-300 py-3 px-4">Settings</th>
                <th className="text-left text-gray-300 py-3 px-4">API</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.id} className="border-b border-gray-800">
                  <td className="py-3 px-4">
                    <span className={`font-medium ${getRoleLevelColor(role.level)}`}>
                      {role.name}
                    </span>
                  </td>
                  {['project', 'user', 'analytics', 'settings', 'api'].map(resource => (
                    <td key={resource} className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {['create', 'read', 'update', 'delete'].map(action => (
                          <div
                            key={action}
                            className={`w-3 h-3 rounded ${
                              permissionMatrix[role.name]?.[resource]?.[action]
                                ? 'bg-green-500'
                                : 'bg-gray-600'
                            }`}
                            title={`${action} ${resource}`}
                          />
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading RBAC system...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Enterprise RBAC System</h1>
        <p className="text-gray-300">Role-based access control and team management for enterprise organizations</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-2 mb-8">
        <div className="flex space-x-2">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'roles', label: 'Roles', icon: '👥' },
            { id: 'users', label: 'Users', icon: '👤' },
            { id: 'permissions', label: 'Permissions', icon: '🔐' },
            { id: 'teams', label: 'Teams', icon: '🏢' },
            { id: 'organizations', label: 'Organizations', icon: '🏛️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
        {activeTab === 'overview' && <RBACOverview />}
        {activeTab === 'roles' && <RoleManagement />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'permissions' && <PermissionMatrix />}
        {activeTab === 'teams' && (
          <div className="text-gray-300">
            Team management interface will be implemented here.
          </div>
        )}
        {activeTab === 'organizations' && (
          <div className="text-gray-300">
            Organization management interface will be implemented here.
          </div>
        )}
      </div>
    </div>
  );
} 