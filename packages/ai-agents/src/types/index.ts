// Core types for CodePal Agentic AI System

export interface AgentConfig {
  id: string;
  name: string;
  type: AgentType;
  enabled: boolean;
  config: Record<string, any>;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type AgentType = 
  | 'codebase-management'
  | 'collaboration-coordinator'
  | 'vr-workflow'
  | 'marketplace-optimization'
  | 'quantum-workflow';

export interface AgentAction {
  id: string;
  agentId: string;
  type: string;
  payload: any;
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';
  userId?: string;
  createdAt: Date;
  executedAt?: Date;
  result?: any;
  error?: string;
}

export interface AgentPermission {
  id: string;
  agentId: string;
  userId: string;
  permissions: string[];
  grantedAt: Date;
  expiresAt?: Date;
}

// Codebase Management Agent Types
export interface CodebaseIssue {
  id: string;
  type: 'bug' | 'dependency' | 'performance' | 'security' | 'code-quality';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  filePath: string;
  lineNumber?: number;
  code: string;
  suggestedFix?: string;
  confidence: number;
  detectedAt: Date;
  status: 'open' | 'in-progress' | 'resolved' | 'ignored';
}

export interface CodeChange {
  file: string;
  content: string;
  type: 'create' | 'update' | 'delete';
  diff?: string;
}

export interface PullRequest {
  id: string;
  repoId: string;
  title: string;
  description: string;
  changes: CodeChange[];
  status: 'draft' | 'open' | 'merged' | 'closed';
  createdAt: Date;
  mergedAt?: Date;
  author: string;
  reviewers: string[];
}

export interface TestResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  coverage?: number;
  duration: number;
}

// Collaboration Coordinator Agent Types
export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'bug-fix' | 'feature' | 'refactor' | 'documentation' | 'testing';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'assigned' | 'in-progress' | 'review' | 'completed';
  assignee?: string;
  requiredSkills: string[];
  estimatedHours: number;
  actualHours?: number;
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  reward: number; // CPAL tokens
}

export interface UserSkill {
  userId: string;
  skill: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  confidence: number;
  lastUsed: Date;
  projectsCompleted: number;
}

export interface CollaborationSession {
  id: string;
  participants: string[];
  tasks: string[];
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'paused' | 'completed';
  metrics: {
    tasksCompleted: number;
    totalRewards: number;
    averageCompletionTime: number;
  };
}

// VR Workflow Agent Types
export interface VRAction {
  id: string;
  type: 'highlight' | 'suggest' | 'apply' | 'navigate' | 'explain';
  nodeId: string;
  suggestion?: string;
  code?: string;
  position?: { x: number; y: number; z: number };
  metadata?: Record<string, any>;
}

export interface VRNode {
  id: string;
  type: 'file' | 'function' | 'class' | 'variable' | 'import';
  name: string;
  code: string;
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  connections: string[];
  metadata: Record<string, any>;
}

export interface VRWorkflow {
  id: string;
  userId: string;
  actions: VRAction[];
  currentNode: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'paused' | 'completed';
}

// Marketplace Optimization Agent Types
export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  author: string;
  price: number;
  trustScore: number;
  qualityScore: number;
  popularity: number;
  downloads: number;
  reviews: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'flagged' | 'removed';
}

export interface MarketplaceMetrics {
  snippetId: string;
  views: number;
  downloads: number;
  purchases: number;
  revenue: number;
  rating: number;
  reviews: number;
  date: Date;
}

export interface PricingOptimization {
  snippetId: string;
  currentPrice: number;
  suggestedPrice: number;
  confidence: number;
  factors: {
    demand: number;
    competition: number;
    quality: number;
    popularity: number;
  };
  timestamp: Date;
}

// Quantum Workflow Agent Types
export interface QuantumAlgorithm {
  id: string;
  name: string;
  type: 'shor' | 'grover' | 'quantum-fourier' | 'quantum-walk' | 'vqe' | 'qaoa' | 'custom';
  description: string;
  code: string;
  qubits: number;
  gates: number;
  complexity: string;
  status: 'draft' | 'testing' | 'optimized' | 'deployed';
  performance: {
    accuracy: number;
    speed: number;
    efficiency: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface QuantumSimulation {
  id: string;
  algorithmId: string;
  input: any;
  output: any;
  qubits: number;
  shots: number;
  backend: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  error?: string;
}

export interface QuantumOptimization {
  algorithmId: string;
  originalCode: string;
  optimizedCode: string;
  improvements: {
    qubitReduction: number;
    gateReduction: number;
    accuracyImprovement: number;
    speedImprovement: number;
  };
  timestamp: Date;
}

// Common Agent Response Types
export interface AgentResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    executionTime: number;
    confidence: number;
    agentId: string;
    timestamp: Date;
  };
}

export interface AgentMetrics {
  agentId: string;
  actionsExecuted: number;
  successRate: number;
  averageResponseTime: number;
  userSatisfaction: number;
  lastActive: Date;
  uptime: number;
}

// Event Types for Agent Communication
export interface AgentEvent {
  id: string;
  type: string;
  agentId: string;
  payload: any;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface AgentNotification {
  id: string;
  userId: string;
  agentId: string;
  type: 'action-required' | 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  action?: {
    type: string;
    payload: any;
  };
  read: boolean;
  createdAt: Date;
} 