// Performance Optimization & CDN for CodePal
// Features: Global content delivery optimization, edge computing, caching strategies, performance monitoring

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface CDNRegion {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'maintenance' | 'offline';
  performance: CDNPerformance;
  cache: CacheMetrics;
  traffic: TrafficMetrics;
  lastUpdated: string;
}

interface CDNPerformance {
  responseTime: number;
  throughput: number;
  availability: number;
  errorRate: number;
  cacheHitRate: number;
  bandwidth: number;
}

interface CacheMetrics {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  cacheSize: number;
  evictions: number;
  hitRate: number;
}

interface TrafficMetrics {
  requestsPerSecond: number;
  dataTransferred: number;
  uniqueVisitors: number;
  peakLoad: number;
  averageLoad: number;
}

interface EdgeComputing {
  id: string;
  name: string;
  location: string;
  type: 'compute' | 'storage' | 'database' | 'cdn';
  status: 'active' | 'scaling' | 'maintenance';
  resources: EdgeResources;
  performance: EdgePerformance;
  lastUpdated: string;
}

interface EdgeResources {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  utilization: ResourceUtilization;
}

interface ResourceUtilization {
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  networkUsage: number;
}

interface EdgePerformance {
  latency: number;
  throughput: number;
  availability: number;
  errorRate: number;
}

interface CachingStrategy {
  id: string;
  name: string;
  type: 'browser' | 'cdn' | 'application' | 'database';
  status: 'active' | 'inactive' | 'testing';
  configuration: CacheConfiguration;
  performance: CachePerformance;
  lastUpdated: string;
}

interface CacheConfiguration {
  ttl: number;
  maxSize: number;
  evictionPolicy: string;
  compression: boolean;
  encryption: boolean;
}

interface CachePerformance {
  hitRate: number;
  missRate: number;
  responseTime: number;
  throughput: number;
  efficiency: number;
}

interface PerformanceMonitoring {
  id: string;
  name: string;
  metric: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface MobileOptimization {
  id: string;
  name: string;
  platform: 'ios' | 'android' | 'web';
  optimization: MobileOptimizationConfig;
  performance: MobilePerformance;
  lastUpdated: string;
}

interface MobileOptimizationConfig {
  imageOptimization: boolean;
  lazyLoading: boolean;
  compression: boolean;
  offlineSupport: boolean;
  pushNotifications: boolean;
}

interface MobilePerformance {
  loadTime: number;
  bundleSize: number;
  memoryUsage: number;
  batteryImpact: number;
  networkEfficiency: number;
}

interface GlobalMetrics {
  totalRequests: number;
  averageResponseTime: number;
  globalAvailability: number;
  cacheEfficiency: number;
  bandwidthUsage: number;
  costSavings: number;
}

export default function PerformanceOptimizationCDN() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'cdn' | 'edge' | 'caching' | 'monitoring' | 'mobile'>('overview');
  const [cdnRegions, setCdnRegions] = useState<CDNRegion[]>([]);
  const [edgeComputing, setEdgeComputing] = useState<EdgeComputing[]>([]);
  const [cachingStrategies, setCachingStrategies] = useState<CachingStrategy[]>([]);
  const [performanceMonitoring, setPerformanceMonitoring] = useState<PerformanceMonitoring[]>([]);
  const [mobileOptimization, setMobileOptimization] = useState<MobileOptimization[]>([]);
  const [globalMetrics, setGlobalMetrics] = useState<GlobalMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockCdnRegions: CDNRegion[] = [
        {
          id: '1',
          name: 'North America East',
          location: 'New York, USA',
          status: 'active',
          performance: {
            responseTime: 45,
            throughput: 1000,
            availability: 99.99,
            errorRate: 0.01,
            cacheHitRate: 92.5,
            bandwidth: 5000
          },
          cache: {
            totalRequests: 1542000,
            cacheHits: 1426350,
            cacheMisses: 115650,
            cacheSize: 500,
            evictions: 1250,
            hitRate: 92.5
          },
          traffic: {
            requestsPerSecond: 1500,
            dataTransferred: 2500000,
            uniqueVisitors: 45000,
            peakLoad: 2000,
            averageLoad: 1200
          },
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Europe West',
          location: 'London, UK',
          status: 'active',
          performance: {
            responseTime: 52,
            throughput: 850,
            availability: 99.98,
            errorRate: 0.02,
            cacheHitRate: 89.2,
            bandwidth: 4200
          },
          cache: {
            totalRequests: 1250000,
            cacheHits: 1115000,
            cacheMisses: 135000,
            cacheSize: 450,
            evictions: 980,
            hitRate: 89.2
          },
          traffic: {
            requestsPerSecond: 1200,
            dataTransferred: 2100000,
            uniqueVisitors: 38000,
            peakLoad: 1600,
            averageLoad: 950
          },
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: '3',
          name: 'Asia Pacific',
          location: 'Tokyo, Japan',
          status: 'active',
          performance: {
            responseTime: 38,
            throughput: 1200,
            availability: 99.97,
            errorRate: 0.03,
            cacheHitRate: 94.1,
            bandwidth: 5800
          },
          cache: {
            totalRequests: 2100000,
            cacheHits: 1976100,
            cacheMisses: 123900,
            cacheSize: 600,
            evictions: 1450,
            hitRate: 94.1
          },
          traffic: {
            requestsPerSecond: 1800,
            dataTransferred: 3200000,
            uniqueVisitors: 62000,
            peakLoad: 2400,
            averageLoad: 1500
          },
          lastUpdated: '2024-01-15T10:00:00Z'
        }
      ];

      const mockEdgeComputing: EdgeComputing[] = [
        {
          id: '1',
          name: 'Edge Compute Node',
          location: 'San Francisco, USA',
          type: 'compute',
          status: 'active',
          resources: {
            cpu: 16,
            memory: 64,
            storage: 1000,
            network: 10000,
            utilization: {
              cpuUsage: 65,
              memoryUsage: 72,
              storageUsage: 45,
              networkUsage: 58
            }
          },
          performance: {
            latency: 12,
            throughput: 5000,
            availability: 99.95,
            errorRate: 0.05
          },
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Edge Storage Node',
          location: 'Frankfurt, Germany',
          type: 'storage',
          status: 'active',
          resources: {
            cpu: 8,
            memory: 32,
            storage: 5000,
            network: 5000,
            utilization: {
              cpuUsage: 45,
              memoryUsage: 68,
              storageUsage: 78,
              networkUsage: 42
            }
          },
          performance: {
            latency: 18,
            throughput: 3000,
            availability: 99.92,
            errorRate: 0.08
          },
          lastUpdated: '2024-01-15T10:00:00Z'
        }
      ];

      const mockCachingStrategies: CachingStrategy[] = [
        {
          id: '1',
          name: 'Browser Cache',
          type: 'browser',
          status: 'active',
          configuration: {
            ttl: 3600,
            maxSize: 100,
            evictionPolicy: 'LRU',
            compression: true,
            encryption: false
          },
          performance: {
            hitRate: 85.2,
            missRate: 14.8,
            responseTime: 8,
            throughput: 8000,
            efficiency: 92.1
          },
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'CDN Cache',
          type: 'cdn',
          status: 'active',
          configuration: {
            ttl: 86400,
            maxSize: 1000,
            evictionPolicy: 'TTL',
            compression: true,
            encryption: true
          },
          performance: {
            hitRate: 92.5,
            missRate: 7.5,
            responseTime: 45,
            throughput: 15000,
            efficiency: 96.8
          },
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: '3',
          name: 'Application Cache',
          type: 'application',
          status: 'active',
          configuration: {
            ttl: 1800,
            maxSize: 500,
            evictionPolicy: 'FIFO',
            compression: true,
            encryption: true
          },
          performance: {
            hitRate: 78.9,
            missRate: 21.1,
            responseTime: 25,
            throughput: 12000,
            efficiency: 88.4
          },
          lastUpdated: '2024-01-15T10:00:00Z'
        }
      ];

      const mockPerformanceMonitoring: PerformanceMonitoring[] = [
        {
          id: '1',
          name: 'Response Time',
          metric: 'Average Response Time',
          value: 45,
          unit: 'ms',
          threshold: 100,
          status: 'normal',
          trend: 'down',
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Throughput',
          metric: 'Requests per Second',
          value: 1500,
          unit: 'req/s',
          threshold: 2000,
          status: 'normal',
          trend: 'up',
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: '3',
          name: 'Availability',
          metric: 'Uptime Percentage',
          value: 99.98,
          unit: '%',
          threshold: 99.9,
          status: 'normal',
          trend: 'stable',
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: '4',
          name: 'Cache Hit Rate',
          metric: 'Cache Efficiency',
          value: 92.5,
          unit: '%',
          threshold: 90,
          status: 'normal',
          trend: 'up',
          lastUpdated: '2024-01-15T10:00:00Z'
        }
      ];

      const mockMobileOptimization: MobileOptimization[] = [
        {
          id: '1',
          name: 'iOS Optimization',
          platform: 'ios',
          optimization: {
            imageOptimization: true,
            lazyLoading: true,
            compression: true,
            offlineSupport: true,
            pushNotifications: true
          },
          performance: {
            loadTime: 850,
            bundleSize: 2.5,
            memoryUsage: 45,
            batteryImpact: 12,
            networkEfficiency: 92
          },
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Android Optimization',
          platform: 'android',
          optimization: {
            imageOptimization: true,
            lazyLoading: true,
            compression: true,
            offlineSupport: true,
            pushNotifications: true
          },
          performance: {
            loadTime: 920,
            bundleSize: 2.8,
            memoryUsage: 52,
            batteryImpact: 15,
            networkEfficiency: 89
          },
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: '3',
          name: 'Mobile Web Optimization',
          platform: 'web',
          optimization: {
            imageOptimization: true,
            lazyLoading: true,
            compression: true,
            offlineSupport: false,
            pushNotifications: false
          },
          performance: {
            loadTime: 1100,
            bundleSize: 1.8,
            memoryUsage: 38,
            batteryImpact: 8,
            networkEfficiency: 95
          },
          lastUpdated: '2024-01-15T10:00:00Z'
        }
      ];

      const mockGlobalMetrics: GlobalMetrics = {
        totalRequests: 4892000,
        averageResponseTime: 45,
        globalAvailability: 99.98,
        cacheEfficiency: 92.5,
        bandwidthUsage: 7800000,
        costSavings: 125000
      };

      setCdnRegions(mockCdnRegions);
      setEdgeComputing(mockEdgeComputing);
      setCachingStrategies(mockCachingStrategies);
      setPerformanceMonitoring(mockPerformanceMonitoring);
      setMobileOptimization(mockMobileOptimization);
      setGlobalMetrics(mockGlobalMetrics);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'normal':
        return 'text-green-600 bg-green-100';
      case 'maintenance':
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'offline':
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'scaling':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'stable':
        return '→';
      default:
        return '→';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Requests</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {(globalMetrics?.totalRequests / 1000000).toFixed(1)}M
          </div>
          <p className="text-sm text-gray-600">Total requests today</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg Response Time</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {globalMetrics?.averageResponseTime}ms
          </div>
          <p className="text-sm text-gray-600">Global average</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Availability</h3>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {globalMetrics?.globalAvailability}%
          </div>
          <p className="text-sm text-gray-600">Global uptime</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost Savings</h3>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            ${(globalMetrics?.costSavings / 1000).toFixed(0)}K
          </div>
          <p className="text-sm text-gray-600">This month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">CDN Performance</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {cdnRegions.slice(0, 3).map(region => (
                <div key={region.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{region.name}</h4>
                    <p className="text-sm text-gray-600">{region.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{region.performance.responseTime}ms</div>
                    <div className="text-sm text-gray-600">{region.performance.cacheHitRate}% cache hit</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {performanceMonitoring.slice(0, 4).map(metric => (
                <div key={metric.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{metric.name}</h4>
                    <p className="text-sm text-gray-600">{metric.metric}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {metric.value} {metric.unit}
                      </span>
                      <span className="ml-2">{getTrendIcon(metric.trend)}</span>
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

  const renderCDN = () => (
    <div className="space-y-6">
      {cdnRegions.map(region => (
        <div key={region.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{region.name}</h3>
                <p className="text-sm text-gray-600">{region.location}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(region.status)}`}>
                  {region.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-medium">{region.performance.responseTime}ms</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Throughput</span>
                      <span className="font-medium">{region.performance.throughput} MB/s</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Availability</span>
                      <span className="font-medium">{region.performance.availability}%</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Cache Hit Rate</span>
                      <span className="font-medium">{region.performance.cacheHitRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Cache Statistics</h4>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Total Requests:</span>
                        <span className="ml-1 font-medium">{(region.cache.totalRequests / 1000000).toFixed(1)}M</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Cache Hits:</span>
                        <span className="ml-1 font-medium">{(region.cache.cacheHits / 1000000).toFixed(1)}M</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Hit Rate:</span>
                        <span className="ml-1 font-medium">{region.cache.hitRate}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Cache Size:</span>
                        <span className="ml-1 font-medium">{region.cache.cacheSize}GB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Traffic Analysis</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Requests/sec</span>
                      <span className="font-medium">{region.traffic.requestsPerSecond.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Data Transferred</span>
                      <span className="font-medium">{(region.traffic.dataTransferred / 1000000).toFixed(1)}GB</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Unique Visitors</span>
                      <span className="font-medium">{region.traffic.uniqueVisitors.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Peak Load</span>
                      <span className="font-medium">{region.traffic.peakLoad.toLocaleString()}</span>
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

  const renderEdge = () => (
    <div className="space-y-6">
      {edgeComputing.map(edge => (
        <div key={edge.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{edge.name}</h3>
                <p className="text-sm text-gray-600">{edge.location} - {edge.type}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(edge.status)}`}>
                  {edge.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Resource Utilization</h4>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">CPU Usage</span>
                      <span className="font-medium">{edge.resources.utilization.cpuUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${edge.resources.utilization.cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Memory Usage</span>
                      <span className="font-medium">{edge.resources.utilization.memoryUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${edge.resources.utilization.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Storage Usage</span>
                      <span className="font-medium">{edge.resources.utilization.storageUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${edge.resources.utilization.storageUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Network Usage</span>
                      <span className="font-medium">{edge.resources.utilization.networkUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full" 
                        style={{ width: `${edge.resources.utilization.networkUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Latency</span>
                      <span className="font-medium">{edge.performance.latency}ms</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Throughput</span>
                      <span className="font-medium">{edge.performance.throughput} MB/s</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Availability</span>
                      <span className="font-medium">{edge.performance.availability}%</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Error Rate</span>
                      <span className="font-medium">{edge.performance.errorRate}%</span>
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

  const renderCaching = () => (
    <div className="space-y-6">
      {cachingStrategies.map(strategy => (
        <div key={strategy.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{strategy.name}</h3>
                <p className="text-sm text-gray-600">{strategy.type} caching strategy</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(strategy.status)}`}>
                  {strategy.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Configuration</h4>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">TTL:</span>
                        <span className="ml-1 font-medium">{strategy.configuration.ttl}s</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Max Size:</span>
                        <span className="ml-1 font-medium">{strategy.configuration.maxSize}MB</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Eviction:</span>
                        <span className="ml-1 font-medium">{strategy.configuration.evictionPolicy}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Compression:</span>
                        <span className="ml-1 font-medium">{strategy.configuration.compression ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Performance</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Hit Rate</span>
                      <span className="font-medium">{strategy.performance.hitRate}%</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-medium">{strategy.performance.responseTime}ms</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Throughput</span>
                      <span className="font-medium">{strategy.performance.throughput} req/s</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Efficiency</span>
                      <span className="font-medium">{strategy.performance.efficiency}%</span>
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

  const renderMonitoring = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Performance Monitoring Dashboard</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMonitoring.map(metric => (
              <div key={metric.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{metric.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>
                
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value} {metric.unit}
                  </div>
                  <div className="text-sm text-gray-600">{metric.metric}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Threshold: {metric.threshold} {metric.unit}</div>
                  <div className="text-lg">{getTrendIcon(metric.trend)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobile = () => (
    <div className="space-y-6">
      {mobileOptimization.map(optimization => (
        <div key={optimization.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{optimization.name}</h3>
                <p className="text-sm text-gray-600">{optimization.platform} platform optimization</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Optimization Features</h4>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Image Optimization:</span>
                        <span className="ml-1 font-medium">{optimization.optimization.imageOptimization ? 'Enabled' : 'Disabled'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Lazy Loading:</span>
                        <span className="ml-1 font-medium">{optimization.optimization.lazyLoading ? 'Enabled' : 'Disabled'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Compression:</span>
                        <span className="ml-1 font-medium">{optimization.optimization.compression ? 'Enabled' : 'Disabled'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Offline Support:</span>
                        <span className="ml-1 font-medium">{optimization.optimization.offlineSupport ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Load Time</span>
                      <span className="font-medium">{optimization.performance.loadTime}ms</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Bundle Size</span>
                      <span className="font-medium">{optimization.performance.bundleSize}MB</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Memory Usage</span>
                      <span className="font-medium">{optimization.performance.memoryUsage}MB</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Network Efficiency</span>
                      <span className="font-medium">{optimization.performance.networkEfficiency}%</span>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Performance Optimization & CDN</h1>
          <p className="text-gray-600 mt-2">
            Global content delivery optimization, edge computing, caching strategies, and performance monitoring
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'cdn', label: 'CDN Regions' },
              { id: 'edge', label: 'Edge Computing' },
              { id: 'caching', label: 'Caching Strategies' },
              { id: 'monitoring', label: 'Performance Monitoring' },
              { id: 'mobile', label: 'Mobile Optimization' }
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
          {activeTab === 'cdn' && renderCDN()}
          {activeTab === 'edge' && renderEdge()}
          {activeTab === 'caching' && renderCaching()}
          {activeTab === 'monitoring' && renderMonitoring()}
          {activeTab === 'mobile' && renderMobile()}
        </div>
      </div>
    </div>
  );
} 