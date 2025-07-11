'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Shield, Activity, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  adminUsers: number;
  totalAPIKeys: number;
  activePlugins: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const user = session.user as any;
    if (user?.role !== 'admin') {
      router.push('/auth/error?error=AccessDenied');
      return;
    }

    fetchAdminData();
  }, [session, status, router]);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        const usersWithDates = data.users.map((user: any) => ({
          ...user,
          createdAt: new Date().toISOString(), // Mock date for now
        }));
        setUsers(usersWithDates);
        
        // Calculate stats
        const totalUsers = usersWithDates.length;
        const adminUsers = usersWithDates.filter((u: any) => u.role === 'admin').length;
        const totalAPIKeys = usersWithDates.reduce((sum: number, u: any) => sum + (u._count?.apiKeys || 0), 0);
        
        setStats({
          totalUsers,
          adminUsers,
          totalAPIKeys,
          activePlugins: 8, // Mock for now
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch admin data',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch admin data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        
        toast({
          title: 'Success',
          description: `User role updated to ${newRole}`,
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update user role',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user as any;
  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and platform settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Admin Access
          </Badge>
          <Button variant="outline" onClick={() => router.push('/analytics')}>
            <Activity className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.adminUsers}</div>
              <p className="text-xs text-muted-foreground">
                Platform administrators
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Keys</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAPIKeys}</div>
              <p className="text-xs text-muted-foreground">
                Active API keys
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Plugins</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activePlugins}</div>
              <p className="text-xs text-muted-foreground">
                Installed plugins
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage user accounts and roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => updateUserRole(user.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 