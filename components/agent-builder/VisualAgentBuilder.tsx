'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
  Atom
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

// Agent Node Types
const AGENT_TYPES = [
  {
    id: 'codebase',
    name: 'Codebase Management',
    icon: GitBranch,
    color: 'bg-blue-500',
    description: 'Monitors repositories and detects issues',
    category: 'core'
  },
  {
    id: 'collaboration',
    name: 'Collaboration Coordinator',
    icon: Users,
    color: 'bg-green-500',
    description: 'Manages team coordination and task assignment',
    category: 'core'
  },
  {
    id: 'marketplace',
    name: 'Marketplace Optimization',
    icon: BarChart3,
    color: 'bg-purple-500',
    description: 'Optimizes marketplace pricing and quality',
    category: 'advanced'
  },
  {
    id: 'vr',
    name: 'VR Workflow',
    icon: Cube,
    color: 'bg-orange-500',
    description: 'Manages VR/AR code visualization',
    category: 'advanced'
  },
  {
    id: 'quantum',
    name: 'Quantum Workflow',
    icon: Atom,
    color: 'bg-indigo-500',
    description: 'Optimizes quantum algorithms',
    category: 'advanced'
  },
  {
    id: 'cross-platform',
    name: 'Cross-Platform Optimization',
    icon: Smartphone,
    color: 'bg-teal-500',
    description: 'Optimizes code for multiple platforms',
    category: 'advanced'
  },
  {
    id: 'meta',
    name: 'Meta Agent',
    icon: Brain,
    color: 'bg-pink-500',
    description: 'Coordinates all other agents',
    category: 'meta'
  }
];

// Action Types
const ACTION_TYPES = [
  { id: 'monitor', name: 'Monitor', icon: Eye, color: 'bg-blue-100 text-blue-700' },
  { id: 'analyze', name: 'Analyze', icon: Brain, color: 'bg-green-100 text-green-700' },
  { id: 'optimize', name: 'Optimize', icon: Zap, color: 'bg-yellow-100 text-yellow-700' },
  { id: 'fix', name: 'Fix', icon: Bug, color: 'bg-red-100 text-red-700' },
  { id: 'deploy', name: 'Deploy', icon: Rocket, color: 'bg-purple-100 text-purple-700' },
  { id: 'test', name: 'Test', icon: Monitor, color: 'bg-indigo-100 text-indigo-700' }
];

interface AgentNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  config: any;
  connections: string[];
}

interface AgentWorkflow {
  id: string;
  name: string;
  description: string;
  nodes: AgentNode[];
  connections: Array<{ from: string; to: string; type: string }>;
  status: 'draft' | 'testing' | 'deployed' | 'archived';
}

export default function VisualAgentBuilder() {
  const [workflows, setWorkflows] = useState<AgentWorkflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<AgentWorkflow | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'design' | 'debug' | 'deploy'>('design');
  const canvasRef = useRef<HTMLDivElement>(null);

  // Create new workflow
  const createWorkflow = useCallback(() => {
    const newWorkflow: AgentWorkflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Agent Workflow',
      description: 'A new agent workflow',
      nodes: [],
      connections: [],
      status: 'draft'
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    setCurrentWorkflow(newWorkflow);
  }, []);

  // Add agent node
  const addAgentNode = useCallback((agentType: string, position: { x: number; y: number }) => {
    if (!currentWorkflow) return;

    const agentConfig = AGENT_TYPES.find(type => type.id === agentType);
    if (!agentConfig) return;

    const newNode: AgentNode = {
      id: `node-${Date.now()}`,
      type: agentType,
      position,
      config: {
        name: agentConfig.name,
        enabled: true,
        permissions: ['read', 'write'],
        settings: {}
      },
      connections: []
    };

    setCurrentWorkflow(prev => prev ? {
      ...prev,
      nodes: [...prev.nodes, newNode]
    } : null);
  }, [currentWorkflow]);

  // Handle drag end for nodes
  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination || !currentWorkflow) return;

    const { source, destination } = result;

    if (source.droppableId === 'agent-palette' && destination.droppableId === 'canvas') {
      // Adding new agent from palette
      const agentType = source.droppableId === 'agent-palette' ? source.index : destination.index;
      const agentConfig = AGENT_TYPES[agentType];
      
      if (agentConfig) {
        const rect = canvasRef.current?.getBoundingClientRect();
        const position = {
          x: destination.x - (rect?.left || 0),
          y: destination.y - (rect?.top || 0)
        };
        addAgentNode(agentConfig.id, position);
      }
    } else if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
      // Moving existing node
      const updatedNodes = [...currentWorkflow.nodes];
      const [movedNode] = updatedNodes.splice(source.index, 1);
      updatedNodes.splice(destination.index, 0, movedNode);
      
      setCurrentWorkflow(prev => prev ? {
        ...prev,
        nodes: updatedNodes
      } : null);
    }
  }, [currentWorkflow, addAgentNode]);

  // Connect nodes
  const connectNodes = useCallback((fromId: string, toId: string, type: string = 'data') => {
    if (!currentWorkflow) return;

    const newConnection = { from: fromId, to: toId, type };
    setCurrentWorkflow(prev => prev ? {
      ...prev,
      connections: [...prev.connections, newConnection]
    } : null);
  }, [currentWorkflow]);

  // Save workflow
  const saveWorkflow = useCallback(async () => {
    if (!currentWorkflow) return;

    try {
      // Save to backend
      const response = await fetch('/api/agent-workflows', {
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

  // Test workflow
  const testWorkflow = useCallback(async () => {
    if (!currentWorkflow) return;

    setIsDebugging(true);
    setDebugLogs([]);

    // Simulate workflow execution
    const logs = [
      '🚀 Starting workflow test...',
      '📋 Loading agent configurations...',
      '🔗 Establishing agent connections...',
      '⚡ Initializing agents...',
      '✅ All agents initialized successfully',
      '🔄 Running workflow simulation...',
      '📊 Collecting performance metrics...',
      '✅ Workflow test completed successfully'
    ];

    for (let i = 0; i < logs.length; i++) {
      setTimeout(() => {
        setDebugLogs(prev => [...prev, logs[i]]);
      }, i * 500);
    }

    setTimeout(() => {
      setIsDebugging(false);
    }, logs.length * 500);
  }, [currentWorkflow]);

  // Deploy workflow
  const deployWorkflow = useCallback(async () => {
    if (!currentWorkflow) return;

    try {
      const response = await fetch('/api/agent-workflows/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentWorkflow)
      });

      if (response.ok) {
        setCurrentWorkflow(prev => prev ? { ...prev, status: 'deployed' } : null);
        console.log('Workflow deployed successfully');
      }
    } catch (error) {
      console.error('Error deploying workflow:', error);
    }
  }, [currentWorkflow]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Visual Agent Builder</h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {currentWorkflow?.status || 'No Workflow'}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={createWorkflow}>
              <Plus className="w-4 h-4 mr-2" />
              New Workflow
            </Button>
            
            <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <TabsList>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="debug">Debug</TabsTrigger>
                <TabsTrigger value="deploy">Deploy</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Agent Palette */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Agent Palette</h3>
          
          <Droppable droppableId="agent-palette" isDropDisabled>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {AGENT_TYPES.map((agent, index) => (
                  <Draggable key={agent.id} draggableId={agent.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-3 border rounded-lg cursor-move transition-all ${
                          snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full ${agent.color} flex items-center justify-center`}>
                            <agent.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{agent.name}</h4>
                            <p className="text-xs text-gray-500">{agent.description}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex flex-col">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="canvas">
              {(provided) => (
                <div
                  ref={(el) => {
                    provided.innerRef(el);
                    canvasRef.current = el;
                  }}
                  {...provided.droppableProps}
                  className="flex-1 bg-gray-50 p-6 overflow-auto relative"
                >
                  {currentWorkflow ? (
                    <div className="min-h-full">
                      {/* Workflow Nodes */}
                      {currentWorkflow.nodes.map((node, index) => (
                        <Draggable key={node.id} draggableId={node.id} index={index}>
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`absolute cursor-move ${
                                snapshot.isDragging ? 'z-50' : 'z-10'
                              }`}
                              style={{
                                left: node.position.x,
                                top: node.position.y,
                                ...provided.draggableProps.style
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Card className="w-64 shadow-lg">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded-full ${
                                      AGENT_TYPES.find(t => t.id === node.type)?.color || 'bg-gray-500'
                                    }`} />
                                    <span>{node.config.name}</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs">Status</Label>
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
                          )}
                        </Draggable>
                      ))}
                      
                      {/* Connections */}
                      {currentWorkflow.connections.map((connection, index) => (
                        <svg
                          key={index}
                          className="absolute inset-0 pointer-events-none"
                          style={{ zIndex: 5 }}
                        >
                          <line
                            x1={currentWorkflow.nodes.find(n => n.id === connection.from)?.position.x || 0}
                            y1={currentWorkflow.nodes.find(n => n.id === connection.from)?.position.y || 0}
                            x2={currentWorkflow.nodes.find(n => n.id === connection.to)?.position.x || 0}
                            y2={currentWorkflow.nodes.find(n => n.id === connection.to)?.position.y || 0}
                            stroke="#3B82F6"
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                          />
                        </svg>
                      ))}
                      
                      {provided.placeholder}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Cube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <TabsContent value="design" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">Properties</h3>
            
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <Label>Agent Name</Label>
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
                  <Label>Permissions</Label>
                  <div className="space-y-2">
                    {['read', 'write', 'execute', 'admin'].map(perm => (
                      <div key={perm} className="flex items-center space-x-2">
                        <Switch 
                          checked={currentWorkflow?.nodes.find(n => n.id === selectedNode)?.config.permissions.includes(perm)}
                          onCheckedChange={(checked) => {
                            if (!currentWorkflow) return;
                            setCurrentWorkflow({
                              ...currentWorkflow,
                              nodes: currentWorkflow.nodes.map(n => 
                                n.id === selectedNode 
                                  ? { 
                                      ...n, 
                                      config: { 
                                        ...n.config, 
                                        permissions: checked 
                                          ? [...n.config.permissions, perm]
                                          : n.config.permissions.filter(p => p !== perm)
                                      } 
                                    }
                                  : n
                              )
                            });
                          }}
                        />
                        <Label className="text-sm">{perm}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Select a node to configure its properties
              </div>
            )}
          </TabsContent>

          <TabsContent value="debug" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">Debug Console</h3>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={testWorkflow}
                  disabled={isDebugging || !currentWorkflow}
                >
                  {isDebugging ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isDebugging ? 'Testing...' : 'Test Workflow'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setDebugLogs([])}
                >
                  Clear
                </Button>
              </div>
              
              <div className="bg-gray-900 text-green-400 p-3 rounded-lg h-64 overflow-y-auto font-mono text-sm">
                {debugLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                  </div>
                ))}
                {debugLogs.length === 0 && (
                  <div className="text-gray-600">No logs yet. Run a test to see debug output.</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="deploy" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">Deployment</h3>
            
            <div className="space-y-4">
              <div>
                <Label>Environment</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Deployment Strategy</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rolling">Rolling Update</SelectItem>
                    <SelectItem value="blue-green">Blue-Green</SelectItem>
                    <SelectItem value="canary">Canary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={deployWorkflow}
                  disabled={!currentWorkflow}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy Workflow
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={saveWorkflow}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </div>
    </div>
  );
} 