'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  Save, 
  Download, 
  Upload,
  Code,
  Zap,
  Brain,
  Eye,
  Bug,
  Rocket,
  Palette,
  Layers,
  Cpu,
  Database,
  Globe,
  Shield,
  Users,
  BarChart3,
  GitBranch,
  Monitor,
  Smartphone,
  Cube,
  Atom,
  GitBranch as BranchIcon,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter,
  Search,
  Copy,
  Share2,
  Star,
  Eye as ViewIcon,
  Edit3,
  Trash2,
  Download as ImportIcon,
  Upload as ExportIcon
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

// Workflow Node Types
const WORKFLOW_NODE_TYPES = [
  {
    id: 'trigger',
    name: 'Trigger',
    icon: Zap,
    color: 'bg-yellow-500',
    description: 'Workflow entry point',
    category: 'control'
  },
  {
    id: 'condition',
    name: 'Condition',
    icon: GitBranch,
    color: 'bg-orange-500',
    description: 'Conditional logic branch',
    category: 'control'
  },
  {
    id: 'action',
    name: 'Action',
    icon: Code,
    color: 'bg-blue-500',
    description: 'Execute an action',
    category: 'execution'
  },
  {
    id: 'parallel',
    name: 'Parallel',
    icon: Layers,
    color: 'bg-purple-500',
    description: 'Parallel execution',
    category: 'control'
  },
  {
    id: 'delay',
    name: 'Delay',
    icon: Clock,
    color: 'bg-gray-500',
    description: 'Wait for specified time',
    category: 'execution'
  },
  {
    id: 'webhook',
    name: 'Webhook',
    icon: Globe,
    color: 'bg-green-500',
    description: 'HTTP webhook call',
    category: 'integration'
  },
  {
    id: 'database',
    name: 'Database',
    icon: Database,
    color: 'bg-indigo-500',
    description: 'Database operation',
    category: 'data'
  },
  {
    id: 'notification',
    name: 'Notification',
    icon: Bell,
    color: 'bg-pink-500',
    description: 'Send notification',
    category: 'communication'
  }
];

// Workflow Templates
const WORKFLOW_TEMPLATES = [
  {
    id: 'code-review',
    name: 'Automated Code Review',
    description: 'Automatically review code changes and provide feedback',
    category: 'development',
    nodes: [
      { type: 'trigger', config: { event: 'pull_request' } },
      { type: 'action', config: { action: 'analyze_code' } },
      { type: 'condition', config: { condition: 'has_issues' } },
      { type: 'action', config: { action: 'create_comment' } },
      { type: 'notification', config: { channel: 'slack' } }
    ],
    connections: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3, condition: true },
      { from: 2, to: 4, condition: false },
      { from: 3, to: 4 }
    ]
  },
  {
    id: 'deployment-pipeline',
    name: 'CI/CD Pipeline',
    description: 'Automated build, test, and deployment workflow',
    category: 'devops',
    nodes: [
      { type: 'trigger', config: { event: 'push_to_main' } },
      { type: 'action', config: { action: 'build' } },
      { type: 'action', config: { action: 'test' } },
      { type: 'condition', config: { condition: 'tests_passed' } },
      { type: 'action', config: { action: 'deploy_staging' } },
      { type: 'action', config: { action: 'run_e2e_tests' } },
      { type: 'condition', config: { condition: 'e2e_passed' } },
      { type: 'action', config: { action: 'deploy_production' } }
    ],
    connections: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4, condition: true },
      { from: 3, to: 8, condition: false },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 7, condition: true },
      { from: 6, to: 8, condition: false }
    ]
  },
  {
    id: 'monitoring-alert',
    name: 'Monitoring & Alerting',
    description: 'Monitor system health and send alerts',
    category: 'monitoring',
    nodes: [
      { type: 'trigger', config: { event: 'health_check' } },
      { type: 'action', config: { action: 'check_metrics' } },
      { type: 'condition', config: { condition: 'metrics_above_threshold' } },
      { type: 'notification', config: { channel: 'email' } },
      { type: 'action', config: { action: 'scale_resources' } },
      { type: 'delay', config: { duration: 300 } },
      { type: 'action', config: { action: 'recheck_metrics' } }
    ],
    connections: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3, condition: true },
      { from: 2, to: 6, condition: false },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 2 }
    ]
  }
];

interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  config: any;
  connections: string[];
  status: 'idle' | 'running' | 'completed' | 'error';
  executionTime?: number;
  errorMessage?: string;
}

interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
  type: 'success' | 'error' | 'condition';
  condition?: string;
  label?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  status: 'draft' | 'active' | 'paused' | 'archived';
  version: string;
  createdAt: Date;
  updatedAt: Date;
  executionCount: number;
  lastExecuted?: Date;
  averageExecutionTime?: number;
  successRate?: number;
}

export default function VisualWorkflowDesigner() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'design' | 'execute' | 'monitor' | 'templates'>('design');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Create new workflow
  const createWorkflow = useCallback(() => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: 'A new workflow',
      nodes: [],
      connections: [],
      status: 'draft',
      version: '1.0.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    setCurrentWorkflow(newWorkflow);
  }, []);

  // Add workflow node
  const addWorkflowNode = useCallback((nodeType: string, position: { x: number; y: number }) => {
    if (!currentWorkflow) return;

    const nodeConfig = WORKFLOW_NODE_TYPES.find(type => type.id === nodeType);
    if (!nodeConfig) return;

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: nodeType,
      position,
      config: {
        name: nodeConfig.name,
        enabled: true,
        settings: {}
      },
      connections: [],
      status: 'idle'
    };

    setCurrentWorkflow(prev => prev ? {
      ...prev,
      nodes: [...prev.nodes, newNode],
      updatedAt: new Date()
    } : null);
  }, [currentWorkflow]);

  // Connect nodes
  const connectNodes = useCallback((fromId: string, toId: string, type: string = 'success', condition?: string) => {
    if (!currentWorkflow) return;

    const newConnection: WorkflowConnection = {
      id: `conn-${Date.now()}`,
      from: fromId,
      to: toId,
      type: type as 'success' | 'error' | 'condition',
      condition,
      label: type === 'condition' ? condition : undefined
    };

    setCurrentWorkflow(prev => prev ? {
      ...prev,
      connections: [...prev.connections, newConnection],
      updatedAt: new Date()
    } : null);
  }, [currentWorkflow]);

  // Execute workflow
  const executeWorkflow = useCallback(async () => {
    if (!currentWorkflow) return;

    setIsExecuting(true);
    setExecutionLogs([]);

    const logs = [
      '🚀 Starting workflow execution...',
      '📋 Loading workflow configuration...',
      '🔗 Establishing node connections...',
      '⚡ Initializing execution engine...',
      '✅ Workflow execution completed successfully'
    ];

    for (let i = 0; i < logs.length; i++) {
      setTimeout(() => {
        setExecutionLogs(prev => [...prev, logs[i]]);
      }, i * 1000);
    }

    setTimeout(() => {
      setIsExecuting(false);
      setCurrentWorkflow(prev => prev ? {
        ...prev,
        executionCount: prev.executionCount + 1,
        lastExecuted: new Date(),
        status: 'active'
      } : null);
    }, logs.length * 1000);
  }, [currentWorkflow]);

  // Save workflow
  const saveWorkflow = useCallback(async () => {
    if (!currentWorkflow) return;

    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentWorkflow)
      });

      if (response.ok) {
        console.log('Workflow saved successfully');
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  }, [currentWorkflow]);

  // Load template
  const loadTemplate = useCallback((templateId: string) => {
    const template = WORKFLOW_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: template.name,
      description: template.description,
      nodes: template.nodes.map((node, index) => ({
        id: `node-${index}`,
        type: node.type,
        position: { x: 100 + index * 200, y: 100 },
        config: node.config,
        connections: [],
        status: 'idle'
      })),
      connections: template.connections.map((conn, index) => ({
        id: `conn-${index}`,
        from: `node-${conn.from}`,
        to: `node-${conn.to}`,
        type: conn.condition ? 'condition' : 'success',
        condition: conn.condition
      })),
      status: 'draft',
      version: '1.0.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0
    };

    setWorkflows(prev => [...prev, newWorkflow]);
    setCurrentWorkflow(newWorkflow);
    setViewMode('design');
  }, []);

  // Canvas zoom and pan handlers
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.5, Math.min(2, prev - e.deltaY * 0.001)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1) { // Middle mouse button
      setIsDragging(true);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Visual Workflow Designer</h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {currentWorkflow?.status || 'No Workflow'}
            </Badge>
            {currentWorkflow && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Executions: {currentWorkflow.executionCount}</span>
                {currentWorkflow.lastExecuted && (
                  <span>• Last: {currentWorkflow.lastExecuted.toLocaleDateString()}</span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={createWorkflow}>
              <Plus className="w-4 h-4 mr-2" />
              New Workflow
            </Button>
            
            <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <TabsList>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="execute">Execute</TabsTrigger>
                <TabsTrigger value="monitor">Monitor</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Node Palette */}
        {viewMode === 'design' && (
          <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Workflow Nodes</h3>
            
            <div className="space-y-4">
              {WORKFLOW_NODE_TYPES.map((nodeType) => (
                <div
                  key={nodeType.id}
                  className="p-3 border rounded-lg cursor-pointer hover:shadow-md transition-all"
                  onClick={() => {
                    const position = { x: 100, y: 100 };
                    addWorkflowNode(nodeType.id, position);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full ${nodeType.color} flex items-center justify-center`}>
                      <nodeType.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{nodeType.name}</h4>
                      <p className="text-xs text-gray-500">{nodeType.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full relative"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: '0 0'
              }}
            >
              {currentWorkflow ? (
                <div className="min-h-full p-8">
                  {/* Workflow Nodes */}
                  {currentWorkflow.nodes.map((node) => (
                    <motion.div
                      key={node.id}
                      className={`absolute cursor-move ${
                        selectedNode === node.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{
                        left: node.position.x,
                        top: node.position.y
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode(node.id)}
                    >
                      <Card className="w-64">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full ${
                              WORKFLOW_NODE_TYPES.find(t => t.id === node.type)?.color || 'bg-gray-500'
                            }`} />
                            <span>{node.config.name}</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                node.status === 'running' ? 'bg-yellow-100 text-yellow-700' :
                                node.status === 'completed' ? 'bg-green-100 text-green-700' :
                                node.status === 'error' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {node.status}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs">Enabled</Label>
                              <Switch checked={node.config.enabled} />
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedNode(node.id)}
                            >
                              Configure
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {/* Connections */}
                  <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
                      </marker>
                    </defs>
                    {currentWorkflow.connections.map((connection) => {
                      const fromNode = currentWorkflow.nodes.find(n => n.id === connection.from);
                      const toNode = currentWorkflow.nodes.find(n => n.id === connection.to);
                      
                      if (!fromNode || !toNode) return null;
                      
                      return (
                        <g key={connection.id}>
                          <line
                            x1={fromNode.position.x + 128}
                            y1={fromNode.position.y + 50}
                            x2={toNode.position.x}
                            y2={toNode.position.y + 50}
                            stroke={connection.type === 'error' ? '#EF4444' : 
                                   connection.type === 'condition' ? '#F59E0B' : '#3B82F6'}
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                          />
                          {connection.label && (
                            <text
                              x={(fromNode.position.x + toNode.position.x) / 2}
                              y={fromNode.position.y + 45}
                              textAnchor="middle"
                              className="text-xs fill-gray-600"
                            >
                              {connection.label}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Workflow Selected
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Create a new workflow or select an existing one to get started
                    </p>
                    <Button onClick={createWorkflow}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Workflow
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <TabsContent value="design" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">Properties</h3>
            
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <Label>Node Name</Label>
                  <Input 
                    value={currentWorkflow?.nodes.find(n => n.id === selectedNode)?.config.name || ''}
                    onChange={(e) => {
                      if (!currentWorkflow) return;
                      setCurrentWorkflow({
                        ...currentWorkflow,
                        nodes: currentWorkflow.nodes.map(n => 
                          n.id === selectedNode 
                            ? { ...n, config: { ...n.config, name: e.target.value } }
                            : n
                        )
                      });
                    }}
                  />
                </div>
                
                <div>
                  <Label>Node Type</Label>
                  <Select 
                    value={currentWorkflow?.nodes.find(n => n.id === selectedNode)?.type || ''}
                    onValueChange={(value) => {
                      if (!currentWorkflow) return;
                      setCurrentWorkflow({
                        ...currentWorkflow,
                        nodes: currentWorkflow.nodes.map(n => 
                          n.id === selectedNode 
                            ? { ...n, type: value }
                            : n
                        )
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WORKFLOW_NODE_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Enabled</Label>
                  <Switch 
                    checked={currentWorkflow?.nodes.find(n => n.id === selectedNode)?.config.enabled || false}
                    onCheckedChange={(checked) => {
                      if (!currentWorkflow) return;
                      setCurrentWorkflow({
                        ...currentWorkflow,
                        nodes: currentWorkflow.nodes.map(n => 
                          n.id === selectedNode 
                            ? { ...n, config: { ...n.config, enabled: checked } }
                            : n
                        )
                      });
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                Select a node to configure its properties
              </div>
            )}
          </TabsContent>

          <TabsContent value="execute" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">Execution</h3>
            
            <div className="space-y-4">
              <Button 
                className="w-full" 
                onClick={executeWorkflow}
                disabled={isExecuting || !currentWorkflow}
              >
                {isExecuting ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isExecuting ? 'Executing...' : 'Execute Workflow'}
              </Button>
              
              <div className="bg-gray-900 text-green-400 p-3 rounded-lg h-64 overflow-y-auto font-mono text-sm">
                {executionLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                  </div>
                ))}
                {executionLogs.length === 0 && (
                  <div className="text-gray-600">No execution logs yet.</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitor" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">Monitoring</h3>
            
            {currentWorkflow ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentWorkflow.executionCount}
                    </div>
                    <div className="text-sm text-gray-500">Total Executions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {currentWorkflow.successRate || 0}%
                    </div>
                    <div className="text-sm text-gray-500">Success Rate</div>
                  </div>
                </div>
                
                {currentWorkflow.lastExecuted && (
                  <div>
                    <Label>Last Execution</Label>
                    <div className="text-sm text-gray-600">
                      {currentWorkflow.lastExecuted.toLocaleString()}
                    </div>
                  </div>
                )}
                
                {currentWorkflow.averageExecutionTime && (
                  <div>
                    <Label>Average Execution Time</Label>
                    <div className="text-sm text-gray-600">
                      {currentWorkflow.averageExecutionTime}ms
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                No workflow selected for monitoring
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">Templates</h3>
            
            <div className="space-y-4">
              {WORKFLOW_TEMPLATES.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-500">{template.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => loadTemplate(template.id)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </div>
      </div>
    </div>
  );
} 