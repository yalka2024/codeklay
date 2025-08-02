'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
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
  Maximize2,
  Minimize2,
  Copy,
  Edit3,
  Trash2,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Settings,
  Globe,
  Lock,
  Unlock,
  Activity,
  TrendingUp,
  TrendingDown,
  Package,
  Rocket,
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
  Database as DatabaseIcon,
  Monitor as MonitorIcon,
  Smartphone as SmartphoneIcon,
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
  Grid,
  List
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

// Agent Categories
const AGENT_CATEGORIES = [
  {
    id: 'codebase',
    name: 'Codebase Management',
    icon: GitBranch,
    color: 'bg-blue-500',
    description: 'Repository monitoring and code analysis',
    count: 24
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    icon: Users,
    color: 'bg-green-500',
    description: 'Team coordination and task management',
    count: 18
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    icon: BarChart3,
    color: 'bg-purple-500',
    description: 'Marketplace optimization and analytics',
    count: 12
  },
  {
    id: 'vr',
    name: 'VR/AR',
    icon: Cube,
    color: 'bg-orange-500',
    description: 'Virtual and augmented reality workflows',
    count: 8
  },
  {
    id: 'quantum',
    name: 'Quantum',
    icon: Atom,
    color: 'bg-indigo-500',
    description: 'Quantum computing and algorithms',
    count: 6
  },
  {
    id: 'security',
    name: 'Security',
    icon: Shield,
    color: 'bg-red-500',
    description: 'Security scanning and vulnerability detection',
    count: 15
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    icon: Monitor,
    color: 'bg-teal-500',
    description: 'System monitoring and alerting',
    count: 22
  },
  {
    id: 'mobile',
    name: 'Mobile',
    icon: Smartphone,
    color: 'bg-pink-500',
    description: 'Mobile app development and testing',
    count: 14
  }
];

// Mock Agent Data
const MOCK_AGENTS = [
  {
    id: 'codebase-analyzer-pro',
    name: 'Codebase Analyzer Pro',
    description: 'Advanced code analysis with AI-powered insights and automated issue detection',
    author: 'CodePal Team',
    authorAvatar: '/api/placeholder/32/32',
    category: 'codebase',
    version: '2.1.0',
    rating: 4.8,
    reviewCount: 156,
    downloads: 2847,
    price: 0,
    isVerified: true,
    isFeatured: true,
    tags: ['code-analysis', 'ai', 'automation', 'quality'],
    features: [
      'AI-powered code analysis',
      'Automated issue detection',
      'Performance optimization suggestions',
      'Security vulnerability scanning',
      'Code quality metrics'
    ],
    requirements: {
      minVersion: '1.0.0',
      dependencies: ['@codepal/core', '@codepal/ai'],
      permissions: ['read', 'write', 'analyze']
    },
    screenshots: [
      '/api/placeholder/400/250',
      '/api/placeholder/400/250',
      '/api/placeholder/400/250'
    ],
    documentation: 'https://docs.codepal.com/agents/codebase-analyzer-pro',
    repository: 'https://github.com/codepal/codebase-analyzer-pro',
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    status: 'active'
  },
  {
    id: 'team-collaboration-hub',
    name: 'Team Collaboration Hub',
    description: 'Comprehensive team collaboration with smart task assignment and progress tracking',
    author: 'DevTeam Solutions',
    authorAvatar: '/api/placeholder/32/32',
    category: 'collaboration',
    version: '1.5.2',
    rating: 4.6,
    reviewCount: 89,
    downloads: 1234,
    price: 29.99,
    isVerified: true,
    isFeatured: false,
    tags: ['collaboration', 'team', 'task-management', 'productivity'],
    features: [
      'Smart task assignment',
      'Real-time collaboration',
      'Progress tracking',
      'Team analytics',
      'Integration with popular tools'
    ],
    requirements: {
      minVersion: '1.0.0',
      dependencies: ['@codepal/core'],
      permissions: ['read', 'write', 'collaborate']
    },
    screenshots: [
      '/api/placeholder/400/250',
      '/api/placeholder/400/250'
    ],
    documentation: 'https://docs.codepal.com/agents/team-collaboration-hub',
    repository: 'https://github.com/devteam/team-collaboration-hub',
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'active'
  },
  {
    id: 'marketplace-optimizer',
    name: 'Marketplace Optimizer',
    description: 'AI-powered marketplace optimization with demand prediction and dynamic pricing',
    author: 'MarketAI Labs',
    authorAvatar: '/api/placeholder/32/32',
    category: 'marketplace',
    version: '1.2.1',
    rating: 4.9,
    reviewCount: 203,
    downloads: 3456,
    price: 49.99,
    isVerified: true,
    isFeatured: true,
    tags: ['marketplace', 'ai', 'optimization', 'pricing', 'analytics'],
    features: [
      'Demand prediction',
      'Dynamic pricing optimization',
      'Quality assessment',
      'Market trend analysis',
      'Performance metrics'
    ],
    requirements: {
      minVersion: '1.0.0',
      dependencies: ['@codepal/core', '@codepal/ai', '@codepal/analytics'],
      permissions: ['read', 'write', 'analyze', 'optimize']
    },
    screenshots: [
      '/api/placeholder/400/250',
      '/api/placeholder/400/250',
      '/api/placeholder/400/250',
      '/api/placeholder/400/250'
    ],
    documentation: 'https://docs.codepal.com/agents/marketplace-optimizer',
    repository: 'https://github.com/marketai/marketplace-optimizer',
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: 'active'
  },
  {
    id: 'vr-code-visualizer',
    name: 'VR Code Visualizer',
    description: 'Immersive 3D code visualization for better understanding of complex codebases',
    author: 'VRDev Studios',
    authorAvatar: '/api/placeholder/32/32',
    category: 'vr',
    version: '0.9.5',
    rating: 4.3,
    reviewCount: 67,
    downloads: 892,
    price: 79.99,
    isVerified: false,
    isFeatured: false,
    tags: ['vr', 'visualization', '3d', 'code-analysis', 'immersive'],
    features: [
      '3D code visualization',
      'Immersive navigation',
      'Code structure exploration',
      'Collaborative VR sessions',
      'Gesture controls'
    ],
    requirements: {
      minVersion: '1.0.0',
      dependencies: ['@codepal/core', '@codepal/vr', 'three.js'],
      permissions: ['read', 'visualize', 'collaborate']
    },
    screenshots: [
      '/api/placeholder/400/250',
      '/api/placeholder/400/250'
    ],
    documentation: 'https://docs.codepal.com/agents/vr-code-visualizer',
    repository: 'https://github.com/vrdev/vr-code-visualizer',
    lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    status: 'beta'
  }
];

interface Agent {
  id: string;
  name: string;
  description: string;
  author: string;
  authorAvatar: string;
  category: string;
  version: string;
  rating: number;
  reviewCount: number;
  downloads: number;
  price: number;
  isVerified: boolean;
  isFeatured: boolean;
  tags: string[];
  features: string[];
  requirements: {
    minVersion: string;
    dependencies: string[];
    permissions: string[];
  };
  screenshots: string[];
  documentation: string;
  repository: string;
  lastUpdated: Date;
  status: 'active' | 'beta' | 'deprecated';
}

interface Review {
  id: string;
  agentId: string;
  author: string;
  authorAvatar: string;
  rating: number;
  title: string;
  comment: string;
  date: Date;
  helpful: number;
}

export default function AgentMarketplace() {
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'price'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isInstalling, setIsInstalling] = useState<string | null>(null);
  const [installedAgents, setInstalledAgents] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showReviews, setShowReviews] = useState(false);

  // Filter and sort agents
  const filteredAgents = agents
    .filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
      
      const matchesPrice = priceFilter === 'all' || 
                          (priceFilter === 'free' && agent.price === 0) ||
                          (priceFilter === 'paid' && agent.price > 0);
      
      const matchesRating = agent.rating >= ratingFilter;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.lastUpdated.getTime() - a.lastUpdated.getTime();
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });

  // Install agent
  const installAgent = useCallback(async (agentId: string) => {
    setIsInstalling(agentId);
    
    // Simulate installation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setInstalledAgents(prev => new Set([...prev, agentId]));
    setIsInstalling(null);
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((agentId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(agentId)) {
        newFavorites.delete(agentId);
      } else {
        newFavorites.add(agentId);
      }
      return newFavorites;
    });
  }, []);

  // Share agent
  const shareAgent = useCallback((agent: Agent) => {
    const shareData = {
      title: agent.name,
      text: agent.description,
      url: `${window.location.origin}/marketplace/agent/${agent.id}`
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Agent Marketplace</h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {filteredAgents.length} Agents
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            <Tabs value="marketplace" className="hidden">
              <TabsList>
                <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                <TabsTrigger value="installed">Installed</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {AGENT_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={priceFilter} onValueChange={(value: any) => setPriceFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Categories */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          
          <div className="space-y-2">
            {AGENT_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedCategory === category.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full ${category.color} flex items-center justify-center`}>
                    <category.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{category.name}</h4>
                    <p className="text-xs text-gray-500">{category.count} agents</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold mb-3">Quick Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Agents:</span>
                <span className="font-medium">{agents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Free Agents:</span>
                <span className="font-medium">{agents.filter(a => a.price === 0).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Verified:</span>
                <span className="font-medium">{agents.filter(a => a.isVerified).length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Agent Grid/List */}
        <div className="flex-1 p-6 overflow-y-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <Card 
                  key={agent.id} 
                  className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => setSelectedAgent(agent)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full ${
                          AGENT_CATEGORIES.find(c => c.id === agent.category)?.color || 'bg-gray-500'
                        } flex items-center justify-center`}>
                          {AGENT_CATEGORIES.find(c => c.id === agent.category)?.icon && (
                            <AGENT_CATEGORIES.find(c => c.id === agent.category)!.icon className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-base">{agent.name}</CardTitle>
                          <p className="text-xs text-gray-500">by {agent.author}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {agent.isVerified && (
                          <BadgeCheck className="w-4 h-4 text-blue-500" />
                        )}
                        {agent.isFeatured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {agent.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{agent.rating}</span>
                        <span className="text-xs text-gray-500">({agent.reviewCount})</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {agent.downloads.toLocaleString()} downloads
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {agent.price === 0 ? 'Free' : `$${agent.price}`}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          v{agent.version}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(agent.id);
                          }}
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              favorites.has(agent.id) ? 'text-red-500 fill-current' : ''
                            }`} 
                          />
                        </Button>
                        
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            installAgent(agent.id);
                          }}
                          disabled={isInstalling === agent.id || installedAgents.has(agent.id)}
                        >
                          {isInstalling === agent.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : installedAgents.has(agent.id) ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAgents.map((agent) => (
                <Card 
                  key={agent.id} 
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => setSelectedAgent(agent)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full ${
                        AGENT_CATEGORIES.find(c => c.id === agent.category)?.color || 'bg-gray-500'
                      } flex items-center justify-center`}>
                        {AGENT_CATEGORIES.find(c => c.id === agent.category)?.icon && (
                          <AGENT_CATEGORIES.find(c => c.id === agent.category)!.icon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">{agent.name}</h3>
                          {agent.isVerified && (
                            <BadgeCheck className="w-4 h-4 text-blue-500" />
                          )}
                          {agent.isFeatured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>by {agent.author}</span>
                          <span>v{agent.version}</span>
                          <span>{agent.downloads.toLocaleString()} downloads</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{agent.rating}</span>
                            <span>({agent.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {agent.price === 0 ? 'Free' : `$${agent.price}`}
                        </Badge>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(agent.id);
                          }}
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              favorites.has(agent.id) ? 'text-red-500 fill-current' : ''
                            }`} 
                          />
                        </Button>
                        
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            installAgent(agent.id);
                          }}
                          disabled={isInstalling === agent.id || installedAgents.has(agent.id)}
                        >
                          {isInstalling === agent.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : installedAgents.has(agent.id) ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel - Agent Details */}
        <div className="w-96 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          {selectedAgent ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-10 h-10 rounded-full ${
                      AGENT_CATEGORIES.find(c => c.id === selectedAgent.category)?.color || 'bg-gray-500'
                    } flex items-center justify-center`}>
                      {AGENT_CATEGORIES.find(c => c.id === selectedAgent.category)?.icon && (
                        <AGENT_CATEGORIES.find(c => c.id === selectedAgent.category)!.icon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{selectedAgent.name}</h2>
                      <p className="text-sm text-gray-500">by {selectedAgent.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {selectedAgent.isVerified && (
                      <BadgeCheck className="w-5 h-5 text-blue-500" />
                    )}
                    {selectedAgent.isFeatured && (
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{selectedAgent.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{selectedAgent.rating}</span>
                    <span className="text-sm text-gray-500">({selectedAgent.reviewCount} reviews)</span>
                  </div>
                  <Badge variant="outline">
                    {selectedAgent.price === 0 ? 'Free' : `$${selectedAgent.price}`}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Button
                    className="flex-1"
                    onClick={() => installAgent(selectedAgent.id)}
                    disabled={isInstalling === selectedAgent.id || installedAgents.has(selectedAgent.id)}
                  >
                    {isInstalling === selectedAgent.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : installedAgents.has(selectedAgent.id) ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {isInstalling === selectedAgent.id ? 'Installing...' : 
                     installedAgents.has(selectedAgent.id) ? 'Installed' : 'Install'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => toggleFavorite(selectedAgent.id)}
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        favorites.has(selectedAgent.id) ? 'text-red-500 fill-current' : ''
                      }`} 
                    />
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => shareAgent(selectedAgent)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <ul className="space-y-1">
                  {selectedAgent.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedAgent.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Min Version:</span>
                    <span className="ml-2">{selectedAgent.requirements.minVersion}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Dependencies:</span>
                    <div className="mt-1">
                      {selectedAgent.requirements.dependencies.map((dep) => (
                        <Badge key={dep} variant="outline" className="text-xs mr-1">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Links</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={selectedAgent.documentation} target="_blank" rel="noopener noreferrer">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Documentation
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={selectedAgent.repository} target="_blank" rel="noopener noreferrer">
                      <Code className="w-4 h-4 mr-2" />
                      Repository
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Select an agent to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 