// Cloud Platform & DevOps Integration for CodePal
// Features: AWS, Google Cloud, Azure, Kubernetes, Docker, Terraform, serverless platforms

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface CloudProvider {
  id: string;
  name: string;
  type: 'aws' | 'gcp' | 'azure' | 'digitalocean';
  status: 'connected' | 'disconnected' | 'error';
  regions: CloudRegion[];
  services: CloudService[];
  costs: CloudCosts;
  lastSync: string;
}

interface CloudRegion {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'maintenance' | 'offline';
  services: string[];
  latency: number;
  costs: number;
}

interface CloudService {
  id: string;
  name: string;
  type: 'compute' | 'storage' | 'database' | 'network' | 'security' | 'monitoring';
  status: 'running' | 'stopped' | 'error' | 'maintenance';
  instances: number;
  utilization: number;
  costs: number;
  lastUpdated: string;
}

interface CloudCosts {
  total: number;
  compute: number;
  storage: number;
  network: number;
  database: number;
  currency: string;
  period: 'monthly' | 'quarterly' | 'yearly';
}

interface KubernetesCluster {
  id: string;
  name: string;
  provider: string;
  version: string;
  status: 'active' | 'updating' | 'error' | 'maintenance';
  nodes: K8sNode[];
  namespaces: K8sNamespace[];
  workloads: K8sWorkload[];
  lastSync: string;
}

interface K8sNode {
  id: string;
  name: string;
  status: 'ready' | 'not_ready' | 'unknown';
  cpu: number;
  memory: number;
  pods: number;
  version: string;
}

interface K8sNamespace {
  id: string;
  name: string;
  status: 'active' | 'terminating';
  pods: number;
  services: number;
  deployments: number;
}

interface K8sWorkload {
  id: string;
  name: string;
  type: 'deployment' | 'service' | 'ingress' | 'configmap' | 'secret';
  namespace: string;
  status: 'running' | 'pending' | 'failed' | 'stopped';
  replicas: number;
  available: number;
  lastUpdated: string;
}

interface DockerEnvironment {
  id: string;
  name: string;
  type: 'local' | 'remote' | 'swarm' | 'kubernetes';
  status: 'running' | 'stopped' | 'error';
  containers: DockerContainer[];
  images: DockerImage[];
  volumes: DockerVolume[];
  networks: DockerNetwork[];
  lastSync: string;
}

interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'exited' | 'paused';
  ports: string[];
  volumes: string[];
  cpu: number;
  memory: number;
  createdAt: string;
}

interface DockerImage {
  id: string;
  name: string;
  tag: string;
  size: number;
  createdAt: string;
  lastUsed: string;
}

interface DockerVolume {
  id: string;
  name: string;
  driver: string;
  size: number;
  mountpoint: string;
  status: 'active' | 'inactive';
}

interface DockerNetwork {
  id: string;
  name: string;
  driver: string;
  subnet: string;
  containers: number;
  status: 'active' | 'inactive';
}

interface TerraformWorkspace {
  id: string;
  name: string;
  status: 'active' | 'locked' | 'error';
  resources: TerraformResource[];
  state: TerraformState;
  runs: TerraformRun[];
  lastSync: string;
}

interface TerraformResource {
  id: string;
  name: string;
  type: string;
  status: 'created' | 'updated' | 'destroyed' | 'error';
  provider: string;
  lastModified: string;
}

interface TerraformState {
  version: string;
  resources: number;
  outputs: number;
  lastUpdated: string;
}

interface TerraformRun {
  id: string;
  type: 'plan' | 'apply' | 'destroy';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime: string;
  duration: number;
  changes: number;
}

interface ServerlessPlatform {
  id: string;
  name: string;
  provider: 'aws_lambda' | 'gcp_functions' | 'azure_functions' | 'vercel' | 'netlify';
  status: 'active' | 'inactive' | 'error';
  functions: ServerlessFunction[];
  events: ServerlessEvent[];
  costs: number;
  lastSync: string;
}

interface ServerlessFunction {
  id: string;
  name: string;
  runtime: string;
  status: 'active' | 'inactive' | 'error';
  invocations: number;
  duration: number;
  errors: number;
  memory: number;
  lastInvoked: string;
}

interface ServerlessEvent {
  id: string;
  name: string;
  type: 'http' | 'cron' | 'queue' | 'database';
  status: 'active' | 'inactive' | 'error';
  triggers: number;
  lastTriggered: string;
}

export default function CloudPlatformDevOpsIntegration() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'cloud' | 'kubernetes' | 'docker' | 'terraform' | 'serverless'>('overview');
  const [cloudProviders, setCloudProviders] = useState<CloudProvider[]>([]);
  const [k8sClusters, setK8sClusters] = useState<KubernetesCluster[]>([]);
  const [dockerEnvs, setDockerEnvs] = useState<DockerEnvironment[]>([]);
  const [terraformWorkspaces, setTerraformWorkspaces] = useState<TerraformWorkspace[]>([]);
  const [serverlessPlatforms, setServerlessPlatforms] = useState<ServerlessPlatform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDevOpsData();
  }, []);

  const loadDevOpsData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockCloudProviders: CloudProvider[] = [
        {
          id: '1',
          name: 'AWS',
          type: 'aws',
          status: 'connected',
          regions: [
            { id: '1', name: 'us-east-1', location: 'N. Virginia', status: 'active', services: ['EC2', 'S3', 'RDS'], latency: 45, costs: 2500 },
            { id: '2', name: 'eu-west-1', location: 'Ireland', status: 'active', services: ['EC2', 'S3'], latency: 65, costs: 1800 }
          ],
          services: [
            { id: '1', name: 'EC2', type: 'compute', status: 'running', instances: 24, utilization: 65, costs: 1200, lastUpdated: '2024-01-15T10:00:00Z' },
            { id: '2', name: 'S3', type: 'storage', status: 'running', instances: 8, utilization: 40, costs: 300, lastUpdated: '2024-01-15T10:00:00Z' }
          ],
          costs: { total: 3500, compute: 1200, storage: 300, network: 200, database: 1800, currency: 'USD', period: 'monthly' },
          lastSync: '2024-01-15T10:00:00Z'
        }
      ];

      const mockK8sClusters: KubernetesCluster[] = [
        {
          id: '1',
          name: 'production-cluster',
          provider: 'AWS EKS',
          version: '1.24',
          status: 'active',
          nodes: [
            { id: '1', name: 'node-1', status: 'ready', cpu: 80, memory: 70, pods: 12, version: '1.24' },
            { id: '2', name: 'node-2', status: 'ready', cpu: 65, memory: 60, pods: 10, version: '1.24' }
          ],
          namespaces: [
            { id: '1', name: 'default', status: 'active', pods: 8, services: 3, deployments: 5 },
            { id: '2', name: 'monitoring', status: 'active', pods: 4, services: 2, deployments: 3 }
          ],
          workloads: [
            { id: '1', name: 'codepal-api', type: 'deployment', namespace: 'default', status: 'running', replicas: 3, available: 3, lastUpdated: '2024-01-15T10:00:00Z' }
          ],
          lastSync: '2024-01-15T10:00:00Z'
        }
      ];

      const mockDockerEnvs: DockerEnvironment[] = [
        {
          id: '1',
          name: 'Development Environment',
          type: 'local',
          status: 'running',
          containers: [
            { id: '1', name: 'codepal-api', image: 'codepal/api:latest', status: 'running', ports: ['3000:3000'], volumes: ['api-data'], cpu: 25, memory: 512, createdAt: '2024-01-15T08:00:00Z' }
          ],
          images: [
            { id: '1', name: 'codepal/api', tag: 'latest', size: 450, createdAt: '2024-01-15T08:00:00Z', lastUsed: '2024-01-15T10:00:00Z' }
          ],
          volumes: [
            { id: '1', name: 'api-data', driver: 'local', size: 1024, mountpoint: '/var/lib/docker/volumes/api-data', status: 'active' }
          ],
          networks: [
            { id: '1', name: 'codepal-network', driver: 'bridge', subnet: '172.18.0.0/16', containers: 3, status: 'active' }
          ],
          lastSync: '2024-01-15T10:00:00Z'
        }
      ];

      const mockTerraformWorkspaces: TerraformWorkspace[] = [
        {
          id: '1',
          name: 'production-infrastructure',
          status: 'active',
          resources: [
            { id: '1', name: 'aws_instance.web', type: 'aws_instance', status: 'created', provider: 'aws', lastModified: '2024-01-15T10:00:00Z' }
          ],
          state: { version: '1.0', resources: 15, outputs: 5, lastUpdated: '2024-01-15T10:00:00Z' },
          runs: [
            { id: '1', type: 'apply', status: 'completed', startTime: '2024-01-15T09:00:00Z', endTime: '2024-01-15T09:15:00Z', duration: 900, changes: 3 }
          ],
          lastSync: '2024-01-15T10:00:00Z'
        }
      ];

      const mockServerlessPlatforms: ServerlessPlatform[] = [
        {
          id: '1',
          name: 'AWS Lambda',
          provider: 'aws_lambda',
          status: 'active',
          functions: [
            { id: '1', name: 'api-gateway-handler', runtime: 'nodejs18.x', status: 'active', invocations: 15000, duration: 250, errors: 5, memory: 512, lastInvoked: '2024-01-15T10:00:00Z' }
          ],
          events: [
            { id: '1', name: 'api-gateway-trigger', type: 'http', status: 'active', triggers: 15000, lastTriggered: '2024-01-15T10:00:00Z' }
          ],
          costs: 150,
          lastSync: '2024-01-15T10:00:00Z'
        }
      ];

      setCloudProviders(mockCloudProviders);
      setK8sClusters(mockK8sClusters);
      setDockerEnvs(mockDockerEnvs);
      setTerraformWorkspaces(mockTerraformWorkspaces);
      setServerlessPlatforms(mockServerlessPlatforms);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
      case 'running':
      case 'ready':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'disconnected':
      case 'stopped':
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      case 'error':
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'updating':
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cloud Providers</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">{cloudProviders.filter(p => p.status === 'connected').length}</div>
          <p className="text-sm text-gray-600">Connected providers</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">K8s Clusters</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">{k8sClusters.filter(k => k.status === 'active').length}</div>
          <p className="text-sm text-gray-600">Active clusters</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Docker Containers</h3>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {dockerEnvs.flatMap(d => d.containers).filter(c => c.status === 'running').length}
          </div>
          <p className="text-sm text-gray-600">Running containers</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Cloud Cost</h3>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            ${cloudProviders.reduce((sum, p) => sum + p.costs.total, 0).toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">Total cloud costs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Cloud Services</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {cloudProviders.flatMap(p => p.services).slice(0, 5).map(service => (
                <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.type} service</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">${service.costs}/mo</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Serverless Functions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {serverlessPlatforms.flatMap(s => s.functions).slice(0, 5).map(func => (
                <div key={func.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{func.name}</h4>
                    <p className="text-sm text-gray-600">{func.runtime}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(func.status)}`}>
                      {func.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{func.invocations} invocations</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCloud = () => (
    <div className="space-y-6">
      {cloudProviders.map(provider => (
        <div key={provider.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                <p className="text-sm text-gray-600">Cloud Provider</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(provider.status)}`}>
                  {provider.status}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  ${provider.costs.total.toLocaleString()}/{provider.costs.period}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Regions</h4>
                <div className="space-y-3">
                  {provider.regions.map(region => (
                    <div key={region.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{region.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(region.status)}`}>
                          {region.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{region.location}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Latency:</span>
                          <span className="ml-1 font-medium">{region.latency}ms</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Cost:</span>
                          <span className="ml-1 font-medium">${region.costs}/mo</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Services</h4>
                <div className="space-y-3">
                  {provider.services.map(service => (
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
                          <span className="text-gray-500">Cost:</span>
                          <span className="ml-1 font-medium">${service.costs}/mo</span>
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

  const renderKubernetes = () => (
    <div className="space-y-6">
      {k8sClusters.map(cluster => (
        <div key={cluster.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{cluster.name}</h3>
                <p className="text-sm text-gray-600">{cluster.provider} • v{cluster.version}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(cluster.status)}`}>
                  {cluster.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Nodes</h4>
                <div className="space-y-3">
                  {cluster.nodes.map(node => (
                    <div key={node.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{node.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(node.status)}`}>
                          {node.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">CPU:</span>
                          <span className="ml-1 font-medium">{node.cpu}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Memory:</span>
                          <span className="ml-1 font-medium">{node.memory}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Pods:</span>
                          <span className="ml-1 font-medium">{node.pods}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Namespaces</h4>
                <div className="space-y-3">
                  {cluster.namespaces.map(ns => (
                    <div key={ns.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{ns.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ns.status)}`}>
                          {ns.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Pods:</span>
                          <span className="ml-1 font-medium">{ns.pods}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Services:</span>
                          <span className="ml-1 font-medium">{ns.services}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Workloads</h4>
                <div className="space-y-3">
                  {cluster.workloads.map(workload => (
                    <div key={workload.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{workload.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(workload.status)}`}>
                          {workload.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{workload.type}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Replicas:</span>
                          <span className="ml-1 font-medium">{workload.available}/{workload.replicas}</span>
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

  const renderDocker = () => (
    <div className="space-y-6">
      {dockerEnvs.map(env => (
        <div key={env.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{env.name}</h3>
                <p className="text-sm text-gray-600">{env.type} environment</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(env.status)}`}>
                  {env.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Containers</h4>
                <div className="space-y-3">
                  {env.containers.map(container => (
                    <div key={container.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{container.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(container.status)}`}>
                          {container.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{container.image}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">CPU:</span>
                          <span className="ml-1 font-medium">{container.cpu}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Memory:</span>
                          <span className="ml-1 font-medium">{container.memory}MB</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Images</h4>
                <div className="space-y-3">
                  {env.images.map(image => (
                    <div key={image.id} className="p-3 border border-gray-200 rounded-lg">
                      <h5 className="font-medium text-gray-900">{image.name}:{image.tag}</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <span className="ml-1 font-medium">{image.size}MB</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <span className="ml-1 font-medium">{new Date(image.createdAt).toLocaleDateString()}</span>
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

  const renderTerraform = () => (
    <div className="space-y-6">
      {terraformWorkspaces.map(workspace => (
        <div key={workspace.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{workspace.name}</h3>
                <p className="text-sm text-gray-600">Terraform Workspace</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(workspace.status)}`}>
                  {workspace.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Resources</h4>
                <div className="space-y-3">
                  {workspace.resources.map(resource => (
                    <div key={resource.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{resource.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(resource.status)}`}>
                          {resource.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{resource.type}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Recent Runs</h4>
                <div className="space-y-3">
                  {workspace.runs.map(run => (
                    <div key={run.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{run.type}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(run.status)}`}>
                          {run.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <span className="ml-1 font-medium">{Math.round(run.duration / 60)}m</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Changes:</span>
                          <span className="ml-1 font-medium">{run.changes}</span>
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

  const renderServerless = () => (
    <div className="space-y-6">
      {serverlessPlatforms.map(platform => (
        <div key={platform.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
                <p className="text-sm text-gray-600">Serverless Platform</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(platform.status)}`}>
                  {platform.status}
                </span>
                <p className="text-sm text-gray-600 mt-1">${platform.costs}/mo</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Functions</h4>
                <div className="space-y-3">
                  {platform.functions.map(func => (
                    <div key={func.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{func.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(func.status)}`}>
                          {func.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{func.runtime}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Invocations:</span>
                          <span className="ml-1 font-medium">{func.invocations.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <span className="ml-1 font-medium">{func.duration}ms</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Events</h4>
                <div className="space-y-3">
                  {platform.events.map(event => (
                    <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{event.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{event.type} trigger</p>
                      <div className="text-sm">
                        <span className="text-gray-500">Triggers:</span>
                        <span className="ml-1 font-medium">{event.triggers.toLocaleString()}</span>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading DevOps data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cloud Platform & DevOps Integration</h1>
          <p className="text-gray-600 mt-2">
            AWS, Google Cloud, Azure, Kubernetes, Docker, Terraform, and serverless platforms
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'cloud', label: 'Cloud Providers' },
              { id: 'kubernetes', label: 'Kubernetes' },
              { id: 'docker', label: 'Docker' },
              { id: 'terraform', label: 'Terraform' },
              { id: 'serverless', label: 'Serverless' }
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
          {activeTab === 'cloud' && renderCloud()}
          {activeTab === 'kubernetes' && renderKubernetes()}
          {activeTab === 'docker' && renderDocker()}
          {activeTab === 'terraform' && renderTerraform()}
          {activeTab === 'serverless' && renderServerless()}
        </div>
      </div>
    </div>
  );
} 