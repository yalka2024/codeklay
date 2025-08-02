'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette,
  Layers,
  Bug,
  Rocket,
  Package,
  Settings,
  Grid,
  List,
  Maximize2,
  Minimize2,
  X,
  ArrowLeft,
  ArrowRight,
  Home,
  Search,
  Filter,
  Star,
  Download,
  Eye,
  Share2,
  Heart,
  MessageSquare,
  Code,
  Brain,
  Zap,
  Shield,
  Users,
  BarChart3,
  GitBranch,
  Monitor,
  Smartphone,
  Cube,
  Atom,
  Plus,
  Minus,
  Copy,
  Edit3,
  Trash2,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Globe,
  Lock,
  Unlock,
  Activity,
  TrendingUp,
  TrendingDown,
  Database,
  Cloud,
  Server,
  Cpu,
  Memory,
  Network,
  Bell,
  BellOff,
  Wifi,
  WifiOff,
  HardDrive,
  Tablet,
  Laptop,
  Desktop,
  Tag,
  Calendar,
  User,
  Award,
  BadgeCheck,
  ExternalLink,
  BookOpen,
  FileText,
  Play,
  Pause,
  Stop,
  RotateCcw,
  SkipForward,
  Rewind,
  FastForward,
  Volume2,
  VolumeX,
  Sparkles,
  Target,
  Lightbulb,
  MousePointer,
  MousePointerClick
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Import the visual tools components
import VisualAgentBuilder from './VisualAgentBuilder';
import VisualWorkflowDesigner from './VisualWorkflowDesigner';
import VisualDebuggingTools from './VisualDebuggingTools';
import VisualDeploymentPipeline from './VisualDeploymentPipeline';
import AgentMarketplace from './AgentMarketplace';

// Tool definitions
const VISUAL_TOOLS = [
  {
    id: 'agent-builder',
    name: 'Visual Agent Builder',
    description: 'Drag-and-drop interface for creating AI agents',
    icon: Palette,
    color: 'bg-blue-500',
    category: 'creation',
    status: 'active',
    features: [
      'Drag-and-drop agent creation',
      'Visual node connections',
      'Real-time configuration',
      'Template library',
      'Agent testing'
    ],
    demo: true
  },
  {
    id: 'workflow-designer',
    name: 'Visual Workflow Designer',
    description: 'Design complex agent workflows with visual tools',
    icon: Layers,
    color: 'bg-green-500',
    category: 'design',
    status: 'active',
    features: [
      'Workflow visualization',
      'Conditional logic',
      'Parallel execution',
      'Template workflows',
      'Execution monitoring'
    ],
    demo: true
  },
  {
    id: 'debugging-tools',
    name: 'Visual Debugging Tools',
    description: 'Advanced debugging interface for agents and workflows',
    icon: Bug,
    color: 'bg-red-500',
    category: 'debugging',
    status: 'active',
    features: [
      'Real-time debugging',
      'Breakpoint management',
      'Variable inspection',
      'Performance profiling',
      'Log analysis'
    ],
    demo: true
  },
  {
    id: 'deployment-pipeline',
    name: 'Visual Deployment Pipeline',
    description: 'Simplified deployment interface with drag-and-drop stages',
    icon: Rocket,
    color: 'bg-purple-500',
    category: 'deployment',
    status: 'active',
    features: [
      'Visual deployment stages',
      'Environment management',
      'Rollback capabilities',
      'Deployment monitoring',
      'Automated testing'
    ],
    demo: true
  },
  {
    id: 'agent-marketplace',
    name: 'Agent Marketplace',
    description: 'Visual marketplace for sharing and discovering agents',
    icon: Package,
    color: 'bg-orange-500',
    category: 'marketplace',
    status: 'active',
    features: [
      'Agent discovery',
      'Rating and reviews',
      'Installation management',
      'Category browsing',
      'Community features'
    ],
    demo: true
  }
];

// Recent projects/workflows
const RECENT_PROJECTS = [
  {
    id: 'project-1',
    name: 'E-commerce Agent Suite',
    type: 'workflow',
    lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'active'
  },
  {
    id: 'project-2',
    name: 'Code Review Automation',
    type: 'agent',
    lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: 'draft'
  },
  {
    id: 'project-3',
    name: 'Customer Support Bot',
    type: 'agent',
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'active'
  },
  {
    id: 'project-4',
    name: 'Data Processing Pipeline',
    type: 'workflow',
    lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: 'archived'
  }
];

// Demo component for interactive preview
const DemoPreview = ({ tool }: { tool: any }) => {
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const demoSteps = [
    { title: 'Initializing...', icon: Loader2 },
    { title: 'Loading Interface...', icon: MousePointer },
    { title: 'Connecting Nodes...', icon: GitBranch },
    { title: 'Testing Configuration...', icon: CheckCircle },
    { title: 'Demo Complete!', icon: Sparkles }
  ];

  const startDemo = () => {
    setIsDemoActive(true);
    setDemoStep(0);
    
    const interval = setInterval(() => {
      setDemoStep(prev => {
        if (prev >= demoSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Interactive Demo: {tool.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Experience the visual tools in action
        </p>
      </div>

      {!isDemoActive ? (
        <div className="text-center">
          <Button 
            onClick={startDemo}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Interactive Demo
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            {demoSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`p-2 rounded-full ${
                    index <= demoStep 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {index < demoSteps.length - 1 && (
                    <div className={`w-8 h-0.5 ${
                      index < demoStep ? 'bg-green-400' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              {demoSteps[demoStep].title}
            </p>
          </div>

          {demoStep === demoSteps.length - 1 && (
            <div className="text-center">
              <Button 
                onClick={() => setIsDemoActive(false)}
                variant="outline"
                className="mt-2"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart Demo
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface VisualToolsHubProps {
  className?: string;
}

export default function VisualToolsHub({ className = '' }: VisualToolsHubProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDemo, setShowDemo] = useState<string | null>(null);

  // Filter tools based on search and category
  const filteredTools = VISUAL_TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Open tool in fullscreen
  const openTool = useCallback((toolId: string) => {
    setActiveTool(toolId);
    setIsFullscreen(true);
  }, []);

  // Close fullscreen tool
  const closeTool = useCallback(() => {
    setActiveTool(null);
    setIsFullscreen(false);
  }, []);

  // Render the active tool component
  const renderActiveTool = () => {
    switch (activeTool) {
      case 'agent-builder':
        return <VisualAgentBuilder />;
      case 'workflow-designer':
        return <VisualWorkflowDesigner />;
      case 'debugging-tools':
        return <VisualDebuggingTools />;
      case 'deployment-pipeline':
        return <VisualDeploymentPipeline />;
      case 'agent-marketplace':
        return <AgentMarketplace />;
      default:
        return null;
    }
  };

  // Get categories for filter
  const categories = Array.from(new Set(VISUAL_TOOLS.map(tool => tool.category)));

  if (isFullscreen && activeTool) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={closeTool}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
            <h1 className="text-xl font-semibold">
              {VISUAL_TOOLS.find(t => t.id === activeTool)?.name}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={closeTool}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {renderActiveTool()}
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Visual Tools Hub
              </h1>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {filteredTools.length} Tools Available
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  >
                    {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch to {viewMode === 'grid' ? 'list' : 'grid'} view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search visual tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Welcome to Visual Tools Hub</h2>
              </div>
              <p className="text-blue-100 text-lg">
                Experience the future of AI development with our interactive visual tools. 
                Drag, drop, and create powerful agents and workflows with ease.
              </p>
            </div>
          </motion.div>

          {/* Tools Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            <AnimatePresence>
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-lg ${tool.color} text-white`}>
                            <tool.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={tool.status === 'active' ? 'default' : 'secondary'}
                          className="ml-2"
                        >
                          {tool.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {tool.features.slice(0, 3).map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {tool.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{tool.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => openTool(tool.id)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Maximize2 className="w-4 h-4 mr-2" />
                            Open Tool
                          </Button>
                          
                          {tool.demo && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowDemo(showDemo === tool.id ? null : tool.id)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Demo
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">4.8</span>
                        </div>
                      </div>

                      {showDemo === tool.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4"
                        >
                          <DemoPreview tool={tool} />
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Recent Projects */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {RECENT_PROJECTS.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{project.name}</h4>
                      <Badge 
                        variant={project.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{project.type}</p>
                    <p className="text-xs text-gray-500">
                      {project.lastModified.toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 