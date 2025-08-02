// Global Infrastructure Setup for CodePal
// Features: Multi-region deployment, global CDN, edge computing, infrastructure management

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface InfrastructureRegion {
  id: string;
  name: string;
  location: string;
  provider: 'aws' | 'gcp' | 'azure' | 'digitalocean' | 'custom';
  status: 'active' | 'deploying' | 'maintenance' | 'offline';
  services: InfrastructureService[];
  performance: RegionPerformance;
  costs: RegionCosts;
  compliance: RegionCompliance;
  lastUpdated: string;
}

interface InfrastructureService {
  id: string;
  name: string;
  type: 'compute' | 'database' | 'storage' | 'cdn' | 'load_balancer' | 'monitoring';
  status: 'healthy' | 'degraded' | 'down' | 'maintenance';
  instances: number;
  capacity: number;
  utilization: number;
  latency: number;
  uptime: number;
  lastCheck: string;
}

interface RegionPerformance {
  latency: number;
  throughput: number;
  errorRate: number;
  availability: number;
  responseTime: number;
  concurrentUsers: number;
}

interface RegionCosts {
  compute: number;
  storage: number;
  bandwidth: number;
  cdn: number;
  total: number;
  currency: string;
  period: 'monthly' | 'quarterly' | 'yearly';
}

interface RegionCompliance {
  dataResidency: boolean;
  encryption: boolean;
  auditLogging: boolean;
  backupRetention: boolean;
  disasterRecovery: boolean;
}

interface CDNConfiguration {
  id: string;
  name: string;
  provider: 'cloudflare' | 'aws_cloudfront' | 'google_cloud_cdn' | 'azure_cdn';
  status: 'active' | 'configuring' | 'maintenance';
  regions: string[];
  cacheHitRate: number;
  bandwidth: number;
  requests: number;
  lastOptimized: string;
}

interface LoadBalancer {
  id: string;
  name: string;
  type: 'application' | 'network' | 'global';
  status: 'active' | 'configuring' | 'maintenance';
  regions: string[];
  healthChecks: HealthCheck[];
  trafficDistribution: TrafficDistribution[];
  lastUpdated: string;
}

interface HealthCheck {
  id: string;
  endpoint: string;
  protocol: 'http' | 'https' | 'tcp';
  port: number;
  interval: number;
  timeout: number;
  healthyThreshold: number;
  unhealthyThreshold: number;
  status: 'healthy' | 'unhealthy' | 'unknown';
  lastCheck: string;
}

interface TrafficDistribution {
  region: string;
  weight: number;
  activeConnections: number;
  requestsPerSecond: number;
  latency: number;
}

interface MonitoringAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  type: 'performance' | 'availability' | 'security' | 'cost';
  title: string;
  description: string;
  region: string;
  service: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

interface DisasterRecovery {
  id: string;
  name: string;
  type: 'backup' | 'replication' | 'failover';
  status: 'active' | 'testing' | 'failed';
  regions: string[];
  lastTest: string;
  nextTest: string;
  rto: number; // Recovery Time Objective in minutes
  rpo: number; // Recovery Point Objective in minutes
}

export default function GlobalInfrastructureSetup() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'regions' | 'cdn' | 'loadbalancers' | 'monitoring' | 'disaster'>('overview');
  const [regions, setRegions] = useState<InfrastructureRegion[]>([]);
  const [cdnConfigs, setCdnConfigs] = useState<CDNConfiguration[]>([]);
  const [loadBalancers, setLoadBalancers] = useState<LoadBalancer[]>([]);
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [disasterRecovery, setDisasterRecovery] = useState<DisasterRecovery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInfrastructureData();
  }, []);

  const loadInfrastructureData = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockRegions: InfrastructureRegion[] = [
        {
          id: '1',
          name: 'US East (N. Virginia)',
          location: 'us-east-1',
          provider: 'aws',
          status: 'active',
          services: [
            {
              id: 's1',
              name: 'EC2 Compute',
              type: 'compute',
              status: 'healthy',
              instances: 24,
              capacity: 100,
              utilization: 65,
              latency: 45,
              uptime: 99.99,
              lastCheck: '2024-01-15T10:00:00Z'
            },
            {
              id: 's2',
              name: 'RDS Database',
              type: 'database',
              status: 'healthy',
              instances: 8,
              capacity: 50,
              utilization: 40,
              latency: 12,
              uptime: 99.95,
              lastCheck: '2024-01-15T10:00:00Z'
            }
          ],
          performance: {
            latency: 45,
            throughput: 1000,
            errorRate: 0.01,
            availability: 99.99,
            responseTime: 120,
            concurrentUsers: 5000
          },
          costs: {
            compute: 2500,
            storage: 800,
            bandwidth: 1200,
            cdn: 300,
            total: 4800,
            currency: 'USD',
            period: 'monthly'
          },
          compliance: {
            dataResidency: true,
            encryption: true,
            auditLogging: true,
            backupRetention: true,
            disasterRecovery: true
          },
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Europe (Frankfurt)',
          location: 'eu-central-1',
          provider: 'aws',
          status: 'active',
          services: [
            {
              id: 's3',
              name: 'EC2 Compute',
              type: 'compute',
              status: 'healthy',
              instances: 16,
              capacity: 80,
              utilization: 55,
              latency: 65,
              uptime: 99.98,
              lastCheck: '2024-01-15T10:00:00Z'
            }
          ],
          performance: {
            latency: 65,
            throughput: 800,
            errorRate: 0.02,
            availability: 99.98,
            responseTime: 150,
            concurrentUsers: 3000
          },
          costs: {
            compute: 1800,
            storage: 600,
            bandwidth: 900,
            cdn: 250,
            total: 3550,
            currency: 'EUR',
            period: 'monthly'
          },
          compliance: {
            dataResidency: true,
            encryption: true,
            auditLogging: true,
            backupRetention: true,
            disasterRecovery: true
          },
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: '3',
          name: 'Asia Pacific (Tokyo)',
          location: 'ap-northeast-1',
          provider: 'aws',
          status: 'deploying',
          services: [
            {
              id: 's4',
              name: 'EC2 Compute',
              type: 'compute',
              status: 'degraded',
              instances: 8,
              capacity: 40,
              utilization: 30,
              latency: 85,
              uptime: 99.90,
              lastCheck: '2024-01-15T10:00:00Z'
            }
          ],
          performance: {
            latency: 85,
            throughput: 500,
            errorRate: 0.05,
            availability: 99.90,
            responseTime: 200,
            concurrentUsers: 1500
          },
          costs: {
            compute: 1200,
            storage: 400,
            bandwidth: 600,
            cdn: 200,
            total: 2400,
            currency: 'USD',
            period: 'monthly'
          },
          compliance: {
            dataResidency: true,
            encryption: true,
            auditLogging: true,
            backupRetention: false,
            disasterRecovery: false
          },
          lastUpdated: '2024-01-15T10:00:00Z'
        }
      ];

      const mockCDN: CDNConfiguration[] = [
        {
          id: '1',
          name: 'Global CDN',
          provider: 'cloudflare',
          status: 'active',
          regions: ['us-east-1', 'eu-central-1', 'ap-northeast-1'],
          cacheHitRate: 92.5,
          bandwidth: 5000,
          requests: 1000000,
          lastOptimized: '2024-01-15T08:00:00Z'
        }
      ];

      const mockLoadBalancers: LoadBalancer[] = [
        {
          id: '1',
          name: 'Global Application Load Balancer',
          type: 'application',
          status: 'active',
          regions: ['us-east-1', 'eu-central-1'],
          healthChecks: [
            {
              id: 'hc1',
              endpoint: '/health',
              protocol: 'https',
              port: 443,
              interval: 30,
              timeout: 5,
              healthyThreshold: 2,
              unhealthyThreshold: 3,
              status: 'healthy',
              lastCheck: '2024-01-15T10:00:00Z'
            }
          ],
          trafficDistribution: [
            {
              region: 'us-east-1',
              weight: 60,
              activeConnections: 3000,
              requestsPerSecond: 500,
              latency: 45
            },
            {
              region: 'eu-central-1',
              weight: 40,
              activeConnections: 2000,
              requestsPerSecond: 300,
              latency: 65
            }
          ],
          lastUpdated: '2024-01-15T10:00:00Z'
        }
      ];

      const mockAlerts: MonitoringAlert[] = [
        {
          id: '1',
          severity: 'warning',
          type: 'performance',
          title: 'High Latency in Tokyo Region',
          description: 'Response time exceeded 200ms threshold',
          region: 'ap-northeast-1',
          service: 'EC2 Compute',
          timestamp: '2024-01-15T09:30:00Z',
          status: 'active'
        },
        {
          id: '2',
          severity: 'info',
          type: 'cost',
          title: 'Bandwidth Usage Alert',
          description: 'CDN bandwidth usage approaching 80% of limit',
          region: 'global',
          service: 'Global CDN',
          timestamp: '2024-01-15T08:15:00Z',
          status: 'acknowledged'
        }
      ];

      const mockDisasterRecovery: DisasterRecovery[] = [
        {
          id: '1',
          name: 'Database Replication',
          type: 'replication',
          status: 'active',
          regions: ['us-east-1', 'eu-central-1'],
          lastTest: '2024-01-10T14:00:00Z',
          nextTest: '2024-01-24T14:00:00Z',
          rto: 15,
          rpo: 5
        },
        {
          id: '2',
          name: 'Application Failover',
          type: 'failover',
          status: 'active',
          regions: ['us-east-1', 'eu-central-1'],
          lastTest: '2024-01-08T10:00:00Z',
          nextTest: '2024-01-22T10:00:00Z',
          rto: 30,
          rpo: 10
        }
      ];

      setRegions(mockRegions);
      setCdnConfigs(mockCDN);
      setLoadBalancers(mockLoadBalancers);
      setAlerts(mockAlerts);
      setDisasterRecovery(mockDisasterRecovery);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'deploying':
      case 'configuring':
        return 'text-yellow-600 bg-yellow-100';
      case 'maintenance':
      case 'degraded':
        return 'text-orange-600 bg-orange-100';
      case 'offline':
      case 'down':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'info':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Uptime</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">99.96%</div>
          <p className="text-sm text-gray-600">Last 30 days</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Regions</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">{regions.filter(r => r.status === 'active').length}</div>
          <p className="text-sm text-gray-600">of {regions.length} total</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Latency</h3>
          <div className="text-3xl font-bold text-purple-600 mb-2">65ms</div>
          <p className="text-sm text-gray-600">Average response time</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Cost</h3>
          <div className="text-3xl font-bold text-orange-600 mb-2">$10,750</div>
          <p className="text-sm text-gray-600">Infrastructure costs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Regional Performance</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {regions.map(region => (
                <div key={region.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{region.name}</h4>
                    <p className="text-sm text-gray-600">{region.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">{region.performance.availability}%</div>
                    <div className="text-sm text-gray-600">{region.performance.latency}ms</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {alerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                    <p className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegions = () => (
    <div className="space-y-6">
      {regions.map(region => (
        <div key={region.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{region.name}</h3>
                <p className="text-sm text-gray-600">{region.location} • {region.provider.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(region.status)}`}>
                  {region.status}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  ${region.costs.total.toLocaleString()}/{region.costs.period}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Services</h4>
                <div className="space-y-3">
                  {region.services.map(service => (
                    <div key={service.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{service.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Instances:</span>
                          <span className="ml-1 font-medium">{service.instances}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Utilization:</span>
                          <span className="ml-1 font-medium">{service.utilization}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Latency:</span>
                          <span className="ml-1 font-medium">{service.latency}ms</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Uptime:</span>
                          <span className="ml-1 font-medium">{service.uptime}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Performance</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Availability</span>
                      <span className="font-medium">{region.performance.availability}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${region.performance.availability}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-medium">{region.performance.responseTime}ms</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (region.performance.responseTime / 300) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Concurrent Users</span>
                      <span className="font-medium">{region.performance.concurrentUsers.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Compliance</h4>
                <div className="space-y-2">
                  {Object.entries(region.compliance).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${value ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                        {value ? 'Yes' : 'No'}
                      </span>
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

  const renderCDN = () => (
    <div className="space-y-6">
      {cdnConfigs.map(cdn => (
        <div key={cdn.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{cdn.name}</h3>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(cdn.status)}`}>
                {cdn.status}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Cache Hit Rate</h4>
                <div className="text-2xl font-bold text-blue-600">{cdn.cacheHitRate}%</div>
                <p className="text-sm text-gray-600">Performance metric</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Bandwidth</h4>
                <div className="text-2xl font-bold text-green-600">{cdn.bandwidth} GB</div>
                <p className="text-sm text-gray-600">Data transferred</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Requests</h4>
                <div className="text-2xl font-bold text-purple-600">{cdn.requests.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Total requests</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Regions</h4>
                <div className="text-2xl font-bold text-orange-600">{cdn.regions.length}</div>
                <p className="text-sm text-gray-600">Active regions</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Coverage Regions</h4>
              <div className="flex flex-wrap gap-2">
                {cdn.regions.map(region => (
                  <span key={region} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLoadBalancers = () => (
    <div className="space-y-6">
      {loadBalancers.map(lb => (
        <div key={lb.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{lb.name}</h3>
                <p className="text-sm text-gray-600">{lb.type} Load Balancer</p>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(lb.status)}`}>
                {lb.status}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Health Checks</h4>
                <div className="space-y-3">
                  {lb.healthChecks.map(check => (
                    <div key={check.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{check.endpoint}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(check.status)}`}>
                          {check.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Protocol:</span>
                          <span className="ml-1 font-medium">{check.protocol.toUpperCase()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Port:</span>
                          <span className="ml-1 font-medium">{check.port}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Interval:</span>
                          <span className="ml-1 font-medium">{check.interval}s</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Check:</span>
                          <span className="ml-1 font-medium">{new Date(check.lastCheck).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Traffic Distribution</h4>
                <div className="space-y-3">
                  {lb.trafficDistribution.map(dist => (
                    <div key={dist.region} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{dist.region}</h5>
                        <span className="text-sm font-medium">{dist.weight}%</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Active Connections:</span>
                          <span className="font-medium">{dist.activeConnections.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Requests/sec:</span>
                          <span className="font-medium">{dist.requestsPerSecond}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Latency:</span>
                          <span className="font-medium">{dist.latency}ms</span>
                        </div>
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

  const renderMonitoring = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Infrastructure Alerts</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Region: {alert.region}</span>
                    <span>Service: {alert.service}</span>
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(alert.status)}`}>
                    {alert.status}
                  </span>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Acknowledge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDisasterRecovery = () => (
    <div className="space-y-6">
      {disasterRecovery.map(dr => (
        <div key={dr.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{dr.name}</h3>
                <p className="text-sm text-gray-600">{dr.type} Recovery</p>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(dr.status)}`}>
                {dr.status}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">RTO</h4>
                <div className="text-2xl font-bold text-blue-600">{dr.rto} min</div>
                <p className="text-sm text-gray-600">Recovery Time Objective</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">RPO</h4>
                <div className="text-2xl font-bold text-green-600">{dr.rpo} min</div>
                <p className="text-sm text-gray-600">Recovery Point Objective</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Last Test</h4>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(dr.lastTest).toLocaleDateString()}
                </div>
                <p className="text-sm text-gray-600">Test completed</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Next Test</h4>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(dr.nextTest).toLocaleDateString()}
                </div>
                <p className="text-sm text-gray-600">Scheduled test</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Coverage Regions</h4>
              <div className="flex flex-wrap gap-2">
                {dr.regions.map(region => (
                  <span key={region} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {region}
                  </span>
                ))}
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
          <p className="mt-4 text-gray-600">Loading infrastructure data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Global Infrastructure Setup</h1>
          <p className="text-gray-600 mt-2">
            Multi-region deployment, global CDN, edge computing, and infrastructure management
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'regions', label: 'Regions' },
              { id: 'cdn', label: 'CDN' },
              { id: 'loadbalancers', label: 'Load Balancers' },
              { id: 'monitoring', label: 'Monitoring' },
              { id: 'disaster', label: 'Disaster Recovery' }
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
          {activeTab === 'regions' && renderRegions()}
          {activeTab === 'cdn' && renderCDN()}
          {activeTab === 'loadbalancers' && renderLoadBalancers()}
          {activeTab === 'monitoring' && renderMonitoring()}
          {activeTab === 'disaster' && renderDisasterRecovery()}
        </div>
      </div>
    </div>
  );
} 