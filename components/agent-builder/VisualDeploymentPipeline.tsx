'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Stop, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Settings,
  Eye,
  Download,
  Upload,
  RefreshCw,
  GitBranch,
  Cloud,
  Server,
  Database,
  Shield,
  Zap,
  Rocket,
  Package,
  Globe,
  Lock,
  Unlock,
  Users,
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Copy,
  Share2,
  Star,
  Edit3,
  Trash2,
  Save,
  Loader2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  SkipForward,
  Rewind,
  FastForward,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Wifi,
  WifiOff,
  HardDrive,
  Cpu,
  Memory,
  Network,
  Database as DatabaseIcon,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';

// Deployment Stage Types
const DEPLOYMENT_STAGES = [
  {
    id: 'build',
    name: 'Build',
    icon: Package,
    color: 'bg-blue-500',
    description: 'Compile and package application',
    duration: '2-5 minutes',
    required: true
  },
  {
    id: 'test',
    name: 'Test',
    icon: Shield,
    color: 'bg-green-500',
    description: 'Run automated tests',
    duration: '3-8 minutes',
    required: true
  },
  {
    id: 'security-scan',
    name: 'Security Scan',
    icon: Lock,
    color: 'bg-red-500',
    description: 'Vulnerability assessment',
    duration: '1-3 minutes',
    required: false
  },
  {
    id: 'staging',
    name: 'Staging',
    icon: Server,
    color: 'bg-yellow-500',
    description: 'Deploy to staging environment',
    duration: '2-4 minutes',
    required: true
  },
  {
    id: 'e2e-test',
    name: 'E2E Tests',
    icon: Activity,
    color: 'bg-purple-500',
    description: 'End-to-end testing',
    duration: '5-15 minutes',
    required: false
  },
  {
    id: 'production',
    name: 'Production',
    icon: Rocket,
    color: 'bg-indigo-500',
    description: 'Deploy to production',
    duration: '3-7 minutes',
    required: true
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    icon: BarChart3,
    color: 'bg-teal-500',
    description: 'Health checks and monitoring',
    duration: '1-2 minutes',
    required: false
  }
];

// Environment Types
const ENVIRONMENTS = [
  {
    id: 'development',
    name: 'Development',
    icon: Laptop,
    color: 'bg-green-500',
    description: 'Local development environment',
    url: 'http://localhost:3000',
    status: 'active'
  },
  {
    id: 'staging',
    name: 'Staging',
    icon: Server,
    color: 'bg-yellow-500',
    description: 'Pre-production testing environment',
    url: 'https://staging.codepal.com',
    status: 'active'
  },
  {
    id: 'production',
    name: 'Production',
    icon: Cloud,
    color: 'bg-blue-500',
    description: 'Live production environment',
    url: 'https://codepal.com',
    status: 'active'
  },
  {
    id: 'canary',
    name: 'Canary',
    icon: Users,
    color: 'bg-purple-500',
    description: 'Gradual rollout environment',
    url: 'https://canary.codepal.com',
    status: 'inactive'
  }
];

// Deployment Strategy Types
const DEPLOYMENT_STRATEGIES = [
  {
    id: 'rolling',
    name: 'Rolling Update',
    description: 'Gradually replace instances',
    icon: TrendingUp,
    risk: 'low',
    downtime: 'minimal'
  },
  {
    id: 'blue-green',
    name: 'Blue-Green',
    description: 'Switch between two identical environments',
    icon: GitBranch,
    risk: 'medium',
    downtime: 'none'
  },
  {
    id: 'canary',
    name: 'Canary',
    description: 'Gradual rollout to subset of users',
    icon: Users,
    risk: 'low',
    downtime: 'none'
  },
  {
    id: 'recreate',
    name: 'Recreate',
    description: 'Terminate old version and create new',
    icon: RotateCcw,
    risk: 'high',
    downtime: 'significant'
  }
];

interface DeploymentStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  logs: string[];
  error?: string;
  progress: number;
}

interface Deployment {
  id: string;
  name: string;
  version: string;
  environment: string;
  strategy: string;
  stages: DeploymentStage[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'rolled-back';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  triggeredBy: string;
  commitHash: string;
  branch: string;
  rollbackVersion?: string;
}

interface Environment {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  health: number;
  instances: number;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
  };
  metrics: {
    responseTime: number;
    throughput: number;
    errorRate: number;
  };
}

export default function VisualDeploymentPipeline() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [currentDeployment, setCurrentDeployment] = useState<Deployment | null>(null);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('staging');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('rolling');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'pipeline' | 'environments' | 'history' | 'monitoring'>('pipeline');
  const [autoDeploy, setAutoDeploy] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  // Create new deployment
  const createDeployment = useCallback(() => {
    const newDeployment: Deployment = {
      id: `deployment-${Date.now()}`,
      name: `Deployment ${new Date().toLocaleDateString()}`,
      version: '1.0.0',
      environment: selectedEnvironment,
      strategy: selectedStrategy,
      stages: DEPLOYMENT_STAGES.map(stage => ({
        id: stage.id,
        name: stage.name,
        status: 'pending',
        logs: [],
        progress: 0
      })),
      status: 'pending',
      startTime: new Date(),
      triggeredBy: 'Current User',
      commitHash: 'abc123',
      branch: 'main'
    };

    setDeployments(prev => [...prev, newDeployment]);
    setCurrentDeployment(newDeployment);
  }, [selectedEnvironment, selectedStrategy]);

  // Start deployment
  const startDeployment = useCallback(async () => {
    if (!currentDeployment) return;

    setIsDeploying(true);
    setDeploymentLogs([]);
    setCurrentDeployment(prev => prev ? { ...prev, status: 'running' } : null);

    // Simulate deployment process
    for (let i = 0; i < currentDeployment.stages.length; i++) {
      const stage = currentDeployment.stages[i];
      
      // Update stage status
      setCurrentDeployment(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          stages: prev.stages.map((s, index) => 
            index === i ? { ...s, status: 'running', startTime: new Date() } : s
          )
        };
      });

      // Simulate stage execution
      const logs = [
        `🚀 Starting ${stage.name} stage...`,
        `📋 Executing ${stage.name} tasks...`,
        `✅ ${stage.name} stage completed successfully`
      ];

      for (let j = 0; j < logs.length; j++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDeploymentLogs(prev => [...prev, logs[j]]);
        
        // Update progress
        setCurrentDeployment(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            stages: prev.stages.map((s, index) => 
              index === i ? { ...s, progress: ((j + 1) / logs.length) * 100 } : s
            )
          };
        });
      }

      // Complete stage
      setCurrentDeployment(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          stages: prev.stages.map((s, index) => 
            index === i ? { 
              ...s, 
              status: 'completed', 
              endTime: new Date(),
              progress: 100
            } : s
          )
        };
      });
    }

    // Complete deployment
    setCurrentDeployment(prev => prev ? { 
      ...prev, 
      status: 'completed', 
      endTime: new Date() 
    } : null);
    setIsDeploying(false);
  }, [currentDeployment]);

  // Rollback deployment
  const rollbackDeployment = useCallback(() => {
    if (!currentDeployment) return;

    setCurrentDeployment(prev => prev ? { 
      ...prev, 
      status: 'rolled-back',
      rollbackVersion: '0.9.0'
    } : null);
  }, [currentDeployment]);

  // Environment health monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setEnvironments(prev => prev.map(env => ({
        ...env,
        health: Math.max(0, Math.min(100, env.health + (Math.random() - 0.5) * 10)),
        resources: {
          cpu: Math.max(0, Math.min(100, env.resources.cpu + (Math.random() - 0.5) * 5)),
          memory: Math.max(0, Math.min(100, env.resources.memory + (Math.random() - 0.5) * 3)),
          disk: Math.max(0, Math.min(100, env.resources.disk + (Math.random() - 0.5) * 2))
        },
        metrics: {
          responseTime: Math.max(50, Math.min(500, env.metrics.responseTime + (Math.random() - 0.5) * 50)),
          throughput: Math.max(100, Math.min(2000, env.metrics.throughput + (Math.random() - 0.5) * 100)),
          errorRate: Math.max(0, Math.min(5, env.metrics.errorRate + (Math.random() - 0.5) * 0.5))
        }
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Visual Deployment Pipeline</h1>
            <Badge variant="outline" className={`${
              currentDeployment?.status === 'running' ? 'bg-blue-50 text-blue-700' :
              currentDeployment?.status === 'completed' ? 'bg-green-50 text-green-700' :
              currentDeployment?.status === 'failed' ? 'bg-red-50 text-red-700' :
              'bg-gray-50 text-gray-700'
            }`}>
              {currentDeployment?.status || 'No Deployment'}
            </Badge>
            {currentDeployment && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{currentDeployment.duration ? `${Math.floor(currentDeployment.duration / 1000)}s` : 'Running...'}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={autoDeploy}
                onCheckedChange={setAutoDeploy}
              />
              <Label className="text-sm">Auto Deploy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
              <Label className="text-sm">Notifications</Label>
            </div>
            
            <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <TabsList>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                <TabsTrigger value="environments">Environments</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Configuration */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <TabsContent value="pipeline" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">Deployment Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <Label>Environment</Label>
                <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENVIRONMENTS.map((env) => (
                      <SelectItem key={env.id} value={env.id}>
                        <div className="flex items-center space-x-2">
                          <env.icon className="w-4 h-4" />
                          <span>{env.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Deployment Strategy</Label>
                <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPLOYMENT_STRATEGIES.map((strategy) => (
                      <SelectItem key={strategy.id} value={strategy.id}>
                        <div className="flex items-center space-x-2">
                          <strategy.icon className="w-4 h-4" />
                          <span>{strategy.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Version</Label>
                <Input placeholder="1.0.0" />
              </div>
              
              <div>
                <Label>Branch</Label>
                <Input placeholder="main" />
              </div>
              
              <div className="space-y-2">
                <Label>Deployment Stages</Label>
                {DEPLOYMENT_STAGES.map((stage) => (
                  <div key={stage.id} className="flex items-center space-x-2">
                    <Checkbox 
                      defaultChecked={stage.required}
                      disabled={stage.required}
                    />
                    <Label className="text-sm">{stage.name}</Label>
                    {stage.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={createDeployment}
                  disabled={isDeploying}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Deployment
                </Button>
                
                {currentDeployment && (
                  <Button 
                    className="w-full" 
                    onClick={startDeployment}
                    disabled={isDeploying}
                  >
                    {isDeploying ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Rocket className="w-4 h-4 mr-2" />
                    )}
                    {isDeploying ? 'Deploying...' : 'Start Deployment'}
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="environments" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">Environment Status</h3>
            
            <div className="space-y-4">
              {ENVIRONMENTS.map((env) => (
                <Card key={env.id} className="cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <env.icon className="w-4 h-4" />
                        <h4 className="font-medium">{env.name}</h4>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          env.status === 'active' ? 'bg-green-100 text-green-700' :
                          env.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {env.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs">Health</Label>
                        <Progress value={85} className="mt-1" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">CPU:</span>
                          <span className="ml-1">45%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Memory:</span>
                          <span className="ml-1">67%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </div>

        {/* Center Panel - Pipeline Visualization */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TabsContent value="pipeline" className="flex-1 p-6 overflow-y-auto">
            {currentDeployment ? (
              <div className="space-y-6">
                {/* Deployment Header */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">{currentDeployment.name}</h2>
                      <p className="text-gray-500">Version {currentDeployment.version} • {currentDeployment.environment}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {currentDeployment.strategy}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={rollbackDeployment}
                        disabled={currentDeployment.status !== 'completed'}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Rollback
                      </Button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Overall Progress</span>
                      <span>{Math.round(currentDeployment.stages.filter(s => s.status === 'completed').length / currentDeployment.stages.length * 100)}%</span>
                    </div>
                    <Progress 
                      value={currentDeployment.stages.filter(s => s.status === 'completed').length / currentDeployment.stages.length * 100} 
                    />
                  </div>
                </div>

                {/* Pipeline Stages */}
                <div className="grid grid-cols-1 gap-4">
                  {currentDeployment.stages.map((stage, index) => (
                    <Card 
                      key={stage.id}
                      className={`cursor-pointer transition-all ${
                        selectedStage === stage.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedStage(stage.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              stage.status === 'completed' ? 'bg-green-500' :
                              stage.status === 'running' ? 'bg-blue-500' :
                              stage.status === 'failed' ? 'bg-red-500' :
                              'bg-gray-300'
                            }`}>
                              {stage.status === 'completed' ? (
                                <CheckCircle className="w-5 h-5 text-white" />
                              ) : stage.status === 'running' ? (
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                              ) : stage.status === 'failed' ? (
                                <XCircle className="w-5 h-5 text-white" />
                              ) : (
                                <Clock className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{stage.name}</h3>
                              <p className="text-sm text-gray-500">
                                {stage.status === 'completed' && stage.duration 
                                  ? `${Math.floor(stage.duration / 1000)}s`
                                  : DEPLOYMENT_STAGES.find(s => s.id === stage.id)?.duration
                                }
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                stage.status === 'completed' ? 'bg-green-100 text-green-700' :
                                stage.status === 'running' ? 'bg-blue-100 text-blue-700' :
                                stage.status === 'failed' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {stage.status}
                            </Badge>
                            {index < currentDeployment.stages.length - 1 && (
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        {stage.status === 'running' && (
                          <div className="mt-3">
                            <Progress value={stage.progress} />
                          </div>
                        )}
                        
                        {stage.error && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                            <div className="flex items-center space-x-2 text-red-700">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="text-sm font-medium">Error</span>
                            </div>
                            <p className="text-sm text-red-600 mt-1">{stage.error}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Rocket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Active Deployment
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Create a new deployment to get started
                  </p>
                  <Button onClick={createDeployment}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Deployment
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="monitoring" className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Environment Monitoring</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ENVIRONMENTS.map((env) => (
                <Card key={env.id}>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <env.icon className="w-4 h-4" />
                      <span>{env.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs">Health</Label>
                        <Progress value={85} className="mt-1" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Response Time</Label>
                          <div className="text-lg font-semibold">245ms</div>
                        </div>
                        <div>
                          <Label className="text-xs">Throughput</Label>
                          <div className="text-lg font-semibold">1.2k req/s</div>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs">Error Rate</Label>
                        <div className="text-lg font-semibold text-green-600">0.2%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </div>

        {/* Right Panel - Logs & Details */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <TabsContent value="pipeline" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">Deployment Logs</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-900 text-green-400 p-3 rounded-lg h-64 overflow-y-auto font-mono text-sm">
                {deploymentLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                  </div>
                ))}
                {deploymentLogs.length === 0 && (
                  <div className="text-gray-600">No deployment logs yet.</div>
                )}
              </div>
              
              {selectedStage && (
                <div className="space-y-3">
                  <h4 className="font-medium">Stage Details</h4>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2">
                        {currentDeployment?.stages.find(s => s.id === selectedStage)?.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Progress:</span>
                      <span className="ml-2">
                        {currentDeployment?.stages.find(s => s.id === selectedStage)?.progress || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="environments" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
              
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Environment Settings
              </Button>
              
              <Button variant="outline" className="w-full">
                <Activity className="w-4 h-4 mr-2" />
                Health Check
              </Button>
            </div>
          </TabsContent>
        </div>
      </div>
    </div>
  );
} 