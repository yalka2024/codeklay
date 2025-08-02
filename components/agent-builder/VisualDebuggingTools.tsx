'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  StepForward, 
  StepBack, 
  RotateCcw,
  Bug,
  Eye,
  Search,
  Filter,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  BarChart3,
  Cpu,
  Memory,
  Network,
  Database,
  Code,
  Terminal,
  Layers,
  GitBranch,
  Zap,
  Brain,
  Globe,
  Shield,
  Users,
  Monitor,
  Smartphone,
  Cube,
  Atom,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Copy,
  Download,
  Upload,
  RefreshCw,
  StopCircle,
  SkipForward,
  Rewind,
  FastForward,
  Volume2,
  VolumeX,
  Trash2
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

// Debug Session Types
interface DebugSession {
  id: string;
  name: string;
  type: 'agent' | 'workflow' | 'system';
  status: 'running' | 'paused' | 'stopped' | 'completed' | 'error';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  breakpoints: Breakpoint[];
  callStack: CallStackFrame[];
  variables: Variable[];
  logs: DebugLog[];
  performance: PerformanceMetrics;
}

interface Breakpoint {
  id: string;
  line: number;
  column: number;
  file: string;
  condition?: string;
  enabled: boolean;
  hitCount: number;
}

interface CallStackFrame {
  id: string;
  function: string;
  file: string;
  line: number;
  column: number;
  variables: Variable[];
}

interface Variable {
  name: string;
  value: any;
  type: string;
  scope: 'local' | 'global' | 'parameter';
  isWatched: boolean;
}

interface DebugLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  metadata?: any;
}

interface PerformanceMetrics {
  cpu: number;
  memory: number;
  network: number;
  database: number;
  responseTime: number;
  throughput: number;
}

// Mock data for demonstration
const MOCK_DEBUG_SESSIONS: DebugSession[] = [
  {
    id: 'session-1',
    name: 'Codebase Management Agent Debug',
    type: 'agent',
    status: 'running',
    startTime: new Date(Date.now() - 300000), // 5 minutes ago
    breakpoints: [
      { id: 'bp-1', line: 45, column: 12, file: 'CodebaseManagementAgent.ts', enabled: true, hitCount: 3 },
      { id: 'bp-2', line: 67, column: 8, file: 'CodebaseManagementAgent.ts', enabled: true, hitCount: 1 }
    ],
    callStack: [
      { id: 'cs-1', function: 'analyzeCode', file: 'CodebaseManagementAgent.ts', line: 45, column: 12, variables: [] },
      { id: 'cs-2', function: 'detectIssues', file: 'IssueDetector.ts', line: 23, column: 5, variables: [] }
    ],
    variables: [
      { name: 'codeContent', value: 'function example() { return true; }', type: 'string', scope: 'local', isWatched: true },
      { name: 'issues', value: [], type: 'array', scope: 'local', isWatched: false },
      { name: 'confidence', value: 0.95, type: 'number', scope: 'local', isWatched: true }
    ],
    logs: [
      { id: 'log-1', timestamp: new Date(), level: 'info', message: 'Starting code analysis', source: 'CodebaseManagementAgent' },
      { id: 'log-2', timestamp: new Date(), level: 'debug', message: 'Parsing code structure', source: 'CodeParser' },
      { id: 'log-3', timestamp: new Date(), level: 'warning', message: 'Potential memory leak detected', source: 'MemoryAnalyzer' }
    ],
    performance: {
      cpu: 45,
      memory: 67,
      network: 12,
      database: 23,
      responseTime: 150,
      throughput: 1250
    }
  }
];

export default function VisualDebuggingTools() {
  const [sessions, setSessions] = useState<DebugSession[]>(MOCK_DEBUG_SESSIONS);
  const [currentSession, setCurrentSession] = useState<DebugSession | null>(MOCK_DEBUG_SESSIONS[0]);
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugMode, setDebugMode] = useState<'step' | 'continue' | 'pause'>('continue');
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<string | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
  const [logFilter, setLogFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'debug' | 'monitor' | 'profiler' | 'logs'>('debug');
  const [autoScroll, setAutoScroll] = useState(true);
  const [logLevels, setLogLevels] = useState<Set<string>>(new Set(['info', 'warning', 'error', 'debug']));
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Debug controls
  const startDebugging = useCallback(() => {
    setIsDebugging(true);
    setCurrentSession(prev => prev ? { ...prev, status: 'running' } : null);
  }, []);

  const pauseDebugging = useCallback(() => {
    setIsDebugging(false);
    setCurrentSession(prev => prev ? { ...prev, status: 'paused' } : null);
  }, []);

  const stopDebugging = useCallback(() => {
    setIsDebugging(false);
    setCurrentSession(prev => prev ? { ...prev, status: 'stopped' } : null);
  }, []);

  const stepOver = useCallback(() => {
    // Simulate stepping over
    console.log('Step over executed');
  }, []);

  const stepInto = useCallback(() => {
    // Simulate stepping into
    console.log('Step into executed');
  }, []);

  const stepOut = useCallback(() => {
    // Simulate stepping out
    console.log('Step out executed');
  }, []);

  // Breakpoint management
  const toggleBreakpoint = useCallback((breakpointId: string) => {
    setCurrentSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        breakpoints: prev.breakpoints.map(bp => 
          bp.id === breakpointId ? { ...bp, enabled: !bp.enabled } : bp
        )
      };
    });
  }, []);

  const addBreakpoint = useCallback((line: number, column: number, file: string) => {
    const newBreakpoint: Breakpoint = {
      id: `bp-${Date.now()}`,
      line,
      column,
      file,
      enabled: true,
      hitCount: 0
    };

    setCurrentSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        breakpoints: [...prev.breakpoints, newBreakpoint]
      };
    });
  }, []);

  // Variable watching
  const toggleVariableWatch = useCallback((variableName: string) => {
    setCurrentSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        variables: prev.variables.map(v => 
          v.name === variableName ? { ...v, isWatched: !v.isWatched } : v
        )
      };
    });
  }, []);

  // Log filtering
  const toggleLogLevel = useCallback((level: string) => {
    setLogLevels(prev => {
      const newLevels = new Set(prev);
      if (newLevels.has(level)) {
        newLevels.delete(level);
      } else {
        newLevels.add(level);
      }
      return newLevels;
    });
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSession?.logs, autoScroll]);

  // Performance monitoring
  const [performanceData, setPerformanceData] = useState<PerformanceMetrics[]>([]);

  useEffect(() => {
    if (viewMode === 'profiler' && currentSession) {
      const interval = setInterval(() => {
        setPerformanceData(prev => [
          ...prev.slice(-50), // Keep last 50 data points
          {
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            network: Math.random() * 100,
            database: Math.random() * 100,
            responseTime: Math.random() * 500,
            throughput: Math.random() * 2000
          }
        ]);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [viewMode, currentSession]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Visual Debugging Tools</h1>
            <Badge variant="outline" className={`${
              currentSession?.status === 'running' ? 'bg-green-50 text-green-700' :
              currentSession?.status === 'paused' ? 'bg-yellow-50 text-yellow-700' :
              currentSession?.status === 'error' ? 'bg-red-50 text-red-700' :
              'bg-gray-50 text-gray-700'
            }`}>
              {currentSession?.status || 'No Session'}
            </Badge>
            {currentSession && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000)}s</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Debug Controls */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={isDebugging ? pauseDebugging : startDebugging}
                disabled={!currentSession}
              >
                {isDebugging ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isDebugging ? 'Pause' : 'Start'}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={stopDebugging}
                disabled={!currentSession}
              >
                <StopCircle className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={stepOver}
                disabled={!isDebugging}
              >
                <StepForward className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={stepInto}
                disabled={!isDebugging}
              >
                <StepForward className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={stepOut}
                disabled={!isDebugging}
              >
                <StepBack className="w-4 h-4" />
              </Button>
            </div>
            
            <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <TabsList>
                <TabsTrigger value="debug">Debug</TabsTrigger>
                <TabsTrigger value="monitor">Monitor</TabsTrigger>
                <TabsTrigger value="profiler">Profiler</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Sessions & Breakpoints */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <TabsContent value="debug" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">Debug Sessions</h3>
            
            <div className="space-y-2 mb-6">
              {sessions.map((session) => (
                <Card 
                  key={session.id} 
                  className={`cursor-pointer transition-all ${
                    currentSession?.id === session.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                  }`}
                  onClick={() => setCurrentSession(session)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{session.name}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          session.status === 'running' ? 'bg-green-100 text-green-700' :
                          session.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                          session.status === 'error' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {session.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{session.type}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h4 className="font-semibold mb-3">Breakpoints</h4>
            <div className="space-y-2">
              {currentSession?.breakpoints.map((breakpoint) => (
                <div
                  key={breakpoint.id}
                  className={`p-2 border rounded cursor-pointer transition-all ${
                    selectedBreakpoint === breakpoint.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedBreakpoint(breakpoint.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        breakpoint.enabled ? 'bg-red-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-sm font-mono">
                        {breakpoint.file}:{breakpoint.line}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">{breakpoint.hitCount}</span>
                      <Switch
                        size="sm"
                        checked={breakpoint.enabled}
                        onCheckedChange={() => toggleBreakpoint(breakpoint.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitor" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">System Monitor</h3>
            
            {currentSession && (
              <div className="space-y-4">
                <div>
                  <Label>CPU Usage</Label>
                  <Progress value={currentSession.performance.cpu} className="mt-1" />
                  <div className="text-xs text-gray-500 mt-1">{currentSession.performance.cpu}%</div>
                </div>
                
                <div>
                  <Label>Memory Usage</Label>
                  <Progress value={currentSession.performance.memory} className="mt-1" />
                  <div className="text-xs text-gray-500 mt-1">{currentSession.performance.memory}%</div>
                </div>
                
                <div>
                  <Label>Network I/O</Label>
                  <Progress value={currentSession.performance.network} className="mt-1" />
                  <div className="text-xs text-gray-500 mt-1">{currentSession.performance.network}%</div>
                </div>
                
                <div>
                  <Label>Database Load</Label>
                  <Progress value={currentSession.performance.database} className="mt-1" />
                  <div className="text-xs text-gray-500 mt-1">{currentSession.performance.database}%</div>
                </div>
              </div>
            )}
          </TabsContent>
        </div>

        {/* Center Panel - Main Debug View */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TabsContent value="debug" className="flex-1 flex overflow-hidden">
            {/* Call Stack */}
            <div className="w-1/2 border-r border-gray-200 p-4 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Call Stack</h3>
              
              <div className="space-y-2">
                {currentSession?.callStack.map((frame, index) => (
                  <Card key={frame.id} className="cursor-pointer hover:shadow-md transition-all">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-gray-500">#{index}</span>
                          <span className="font-medium text-sm">{frame.function}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {frame.variables.length} vars
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {frame.file}:{frame.line}:{frame.column}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Variables */}
            <div className="w-1/2 p-4 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Variables</h3>
              
              <div className="space-y-2">
                {currentSession?.variables.map((variable) => (
                  <div
                    key={variable.name}
                    className={`p-3 border rounded cursor-pointer transition-all ${
                      selectedVariable === variable.name ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedVariable(variable.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{variable.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {variable.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {variable.scope}
                        </Badge>
                      </div>
                      <Switch
                        size="sm"
                        checked={variable.isWatched}
                        onCheckedChange={() => toggleVariableWatch(variable.name)}
                      />
                    </div>
                    <div className="mt-2 text-sm font-mono text-gray-600 break-all">
                      {typeof variable.value === 'object' 
                        ? JSON.stringify(variable.value, null, 2)
                        : String(variable.value)
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profiler" className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Performance Profiler</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gray-100 rounded flex items-end justify-center space-x-1 p-2">
                    {performanceData.slice(-20).map((data, index) => (
                      <div
                        key={index}
                        className="bg-blue-500 rounded-t"
                        style={{ 
                          width: '4px', 
                          height: `${data.cpu}%`,
                          minHeight: '2px'
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gray-100 rounded flex items-end justify-center space-x-1 p-2">
                    {performanceData.slice(-20).map((data, index) => (
                      <div
                        key={index}
                        className="bg-green-500 rounded-t"
                        style={{ 
                          width: '4px', 
                          height: `${data.memory}%`,
                          minHeight: '2px'
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Response Time (ms)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gray-100 rounded flex items-end justify-center space-x-1 p-2">
                    {performanceData.slice(-20).map((data, index) => (
                      <div
                        key={index}
                        className="bg-yellow-500 rounded-t"
                        style={{ 
                          width: '4px', 
                          height: `${(data.responseTime / 500) * 100}%`,
                          minHeight: '2px'
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Throughput (req/s)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gray-100 rounded flex items-end justify-center space-x-1 p-2">
                    {performanceData.slice(-20).map((data, index) => (
                      <div
                        key={index}
                        className="bg-purple-500 rounded-t"
                        style={{ 
                          width: '4px', 
                          height: `${(data.throughput / 2000) * 100}%`,
                          minHeight: '2px'
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Debug Logs</h3>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Switch
                    checked={autoScroll}
                    onCheckedChange={setAutoScroll}
                  />
                  <Label className="text-sm">Auto-scroll</Label>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Label className="text-sm">Log Levels:</Label>
                {['info', 'warning', 'error', 'debug'].map((level) => (
                  <div key={level} className="flex items-center space-x-1">
                    <Checkbox
                      checked={logLevels.has(level)}
                      onCheckedChange={() => toggleLogLevel(level)}
                    />
                    <Label className="text-sm capitalize">{level}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {currentSession?.logs
                  .filter(log => logLevels.has(log.level))
                  .filter(log => 
                    searchTerm === '' || 
                    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    log.source.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((log) => (
                    <div
                      key={log.id}
                      className={`p-2 rounded font-mono text-sm ${
                        log.level === 'error' ? 'bg-red-50 text-red-700' :
                        log.level === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                        log.level === 'debug' ? 'bg-blue-50 text-blue-700' :
                        'bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs opacity-75">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              log.level === 'error' ? 'border-red-300 text-red-700' :
                              log.level === 'warning' ? 'border-yellow-300 text-yellow-700' :
                              log.level === 'debug' ? 'border-blue-300 text-blue-700' :
                              'border-gray-300 text-gray-700'
                            }`}
                          >
                            {log.level.toUpperCase()}
                          </Badge>
                          <span className="text-xs opacity-75">{log.source}</span>
                        </div>
                      </div>
                      <div className="mt-1">{log.message}</div>
                    </div>
                  ))}
                <div ref={logsEndRef} />
              </div>
            </div>
          </TabsContent>
        </div>

        {/* Right Panel - Properties & Actions */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <TabsContent value="debug" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">Properties</h3>
            
            {selectedBreakpoint && (
              <div className="space-y-4">
                <div>
                  <Label>Breakpoint Condition</Label>
                  <Input 
                    placeholder="Enter condition (e.g., count > 5)"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Hit Count</Label>
                  <div className="text-sm text-gray-600 mt-1">
                    {currentSession?.breakpoints.find(bp => bp.id === selectedBreakpoint)?.hitCount || 0} hits
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Breakpoint
                </Button>
              </div>
            )}
            
            {selectedVariable && (
              <div className="space-y-4">
                <div>
                  <Label>Variable Value</Label>
                  <Textarea 
                    placeholder="Enter new value"
                    className="mt-1 font-mono text-sm"
                    rows={4}
                  />
                </div>
                
                <Button variant="outline" className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Value
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="monitor" className="mt-0">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Metrics
              </Button>
              
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Alert Settings
              </Button>
            </div>
          </TabsContent>
        </div>
      </div>
    </div>
  );
} 