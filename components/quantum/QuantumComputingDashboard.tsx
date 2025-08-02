'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Play, Square, RefreshCw, Zap, Cpu, Database, TrendingUp } from 'lucide-react';

interface QuantumBackend {
  name: string;
  provider: string;
  type: 'simulator' | 'hardware';
  qubits: number;
  maxDepth: number;
  costPerSecond: number;
  availability: 'available' | 'limited' | 'unavailable';
  features: string[];
}

interface QuantumJob {
  id: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress?: number;
  result?: any;
  error?: string;
  executionTime?: number;
  cost?: number;
  backend: string;
  createdAt: Date;
  completedAt?: Date;
}

interface QuantumCircuit {
  id: string;
  name: string;
  code: string;
  language: 'qiskit' | 'cirq' | 'qsharp';
  qubits: number;
  depth: number;
  gates: number;
  metadata?: Record<string, any>;
}

interface QuantumMetrics {
  totalJobs: number;
  successfulJobs: number;
  failedJobs: number;
  totalCost: number;
  averageExecutionTime: number;
  jobsByBackend: Record<string, number>;
  jobsByStatus: Record<string, number>;
}

export default function QuantumComputingDashboard() {
  const [backends, setBackends] = useState<QuantumBackend[]>([]);
  const [jobs, setJobs] = useState<QuantumJob[]>([]);
  const [metrics, setMetrics] = useState<QuantumMetrics | null>(null);
  const [selectedBackend, setSelectedBackend] = useState<string>('ionq.simulator');
  const [circuitCode, setCircuitCode] = useState<string>('');
  const [circuitName, setCircuitName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Sample quantum circuit templates
  const circuitTemplates = {
    'Bell State': `from qiskit import QuantumCircuit, Aer, execute

# Create a quantum circuit with 2 qubits and 2 classical bits
qc = QuantumCircuit(2, 2)

# Apply Hadamard gate to the first qubit
qc.h(0)

# Apply CNOT gate with control qubit 0 and target qubit 1
qc.cx(0, 1)

# Measure both qubits
qc.measure([0, 1], [0, 1])

print(qc)`,
    
    'Quantum Teleportation': `from qiskit import QuantumCircuit, Aer, execute

# Create a quantum circuit with 3 qubits and 3 classical bits
qc = QuantumCircuit(3, 3)

# Prepare the state to be teleported (qubit 0)
qc.x(0)

# Create Bell pair between qubits 1 and 2
qc.h(1)
qc.cx(1, 2)

# Bell measurement on qubits 0 and 1
qc.cx(0, 1)
qc.h(0)
qc.measure([0, 1], [0, 1])

# Conditional operations on qubit 2
qc.cx(1, 2)
qc.cz(0, 2)

print(qc)`,
    
    'Grover Algorithm': `from qiskit import QuantumCircuit, Aer, execute
from qiskit.circuit.library import GroverOperator

# Create a quantum circuit for Grover's algorithm
n_qubits = 3
qc = QuantumCircuit(n_qubits, n_qubits)

# Apply Hadamard gates to create superposition
for qubit in range(n_qubits):
    qc.h(qubit)

# Apply Grover operator (simplified)
grover_op = GroverOperator(n_qubits)
qc.compose(grover_op, inplace=True)

# Measure all qubits
qc.measure_all()

print(qc)`
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Load backends
      const backendsResponse = await fetch('/api/quantum/azure?action=backends');
      const backendsData = await backendsResponse.json();
      if (backendsData.success) {
        setBackends(backendsData.data);
      }

      // Load jobs
      const jobsResponse = await fetch('/api/quantum/azure?action=jobs');
      const jobsData = await jobsResponse.json();
      if (jobsData.success) {
        setJobs(jobsData.data);
      }

      // Load metrics
      const metricsResponse = await fetch('/api/quantum/azure?action=metrics');
      const metricsData = await metricsResponse.json();
      if (metricsData.success) {
        setMetrics(metricsData.data);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitQuantumJob = async () => {
    if (!circuitCode.trim() || !circuitName.trim()) {
      setError('Please provide both circuit name and code');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // Create circuit object
      const circuit: QuantumCircuit = {
        id: `circuit-${Date.now()}`,
        name: circuitName,
        code: circuitCode,
        language: 'qiskit',
        qubits: countQubits(circuitCode),
        depth: calculateDepth(circuitCode),
        gates: countGates(circuitCode),
        metadata: {}
      };

      const response = await fetch('/api/quantum/azure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_job',
          circuit,
          backend: selectedBackend,
          parameters: {}
        })
      });

      const data = await response.json();
      if (data.success) {
        setCircuitCode('');
        setCircuitName('');
        await loadDashboardData(); // Refresh jobs list
      } else {
        setError(data.error || 'Failed to submit quantum job');
      }
    } catch (err) {
      setError('Failed to submit quantum job');
      console.error('Job submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelJob = async (jobId: string) => {
    try {
      const response = await fetch('/api/quantum/azure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel_job',
          jobId
        })
      });

      const data = await response.json();
      if (data.success) {
        await loadDashboardData(); // Refresh jobs list
      } else {
        setError(data.error || 'Failed to cancel job');
      }
    } catch (err) {
      setError('Failed to cancel job');
      console.error('Job cancellation error:', err);
    }
  };

  const loadTemplate = (templateName: string) => {
    setCircuitName(templateName);
    setCircuitCode(circuitTemplates[templateName as keyof typeof circuitTemplates]);
  };

  // Helper functions for circuit analysis
  const countQubits = (code: string): number => {
    return (code.match(/QuantumCircuit\((\d+)/g) || []).length;
  };

  const calculateDepth = (code: string): number => {
    return (code.match(/\.(h|cx|x|z|y|measure)/g) || []).length;
  };

  const countGates = (code: string): number => {
    return (code.match(/\.(h|cx|x|z|y|measure|barrier)/g) || []).length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'queued': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading quantum dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quantum Computing Dashboard</h1>
          <p className="text-muted-foreground">
            Manage quantum circuits, submit jobs, and monitor Azure Quantum resources
          </p>
        </div>
        <Button onClick={loadDashboardData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submit">Submit Job</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="backends">Backends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalJobs}</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.successfulJobs} successful, {metrics.failedJobs} failed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${metrics.totalCost.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Average: ${(metrics.totalCost / Math.max(metrics.totalJobs, 1)).toFixed(2)} per job
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Execution Time</CardTitle>
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(metrics.averageExecutionTime / 1000).toFixed(1)}s</div>
                  <p className="text-xs text-muted-foreground">
                    Across all completed jobs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics.totalJobs > 0 ? ((metrics.successfulJobs / metrics.totalJobs) * 100).toFixed(1) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.successfulJobs} of {metrics.totalJobs} jobs
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Jobs by Backend</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics?.jobsByBackend && Object.entries(metrics.jobsByBackend).map(([backend, count]) => (
                  <div key={backend} className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium">{backend}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Jobs by Status</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics?.jobsByStatus && Object.entries(metrics.jobsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium capitalize">{status}</span>
                    <Badge className={getStatusColor(status)}>{count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submit Quantum Job</CardTitle>
              <CardDescription>
                Create and submit a quantum circuit to Azure Quantum
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Circuit Name</label>
                  <Input
                    value={circuitName}
                    onChange={(e) => setCircuitName(e.target.value)}
                    placeholder="Enter circuit name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Backend</label>
                  <Select value={selectedBackend} onValueChange={setSelectedBackend}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {backends.map((backend) => (
                        <SelectItem key={backend.name} value={backend.name}>
                          {backend.name} ({backend.provider})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Circuit Code</label>
                <Textarea
                  value={circuitCode}
                  onChange={(e) => setCircuitCode(e.target.value)}
                  placeholder="Enter quantum circuit code (Qiskit, Cirq, or Q#)"
                  rows={10}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {Object.keys(circuitTemplates).map((template) => (
                    <Button
                      key={template}
                      variant="outline"
                      size="sm"
                      onClick={() => loadTemplate(template)}
                    >
                      Load {template}
                    </Button>
                  ))}
                </div>
                <Button onClick={submitQuantumJob} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Submit Job
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quantum Jobs</CardTitle>
              <CardDescription>
                Monitor the status of your quantum computing jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No quantum jobs found
                  </p>
                ) : (
                  jobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Job {job.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            Backend: {job.backend} • Created: {job.createdAt.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                          {job.status === 'running' && job.progress !== undefined && (
                            <Progress value={job.progress} className="w-20" />
                          )}
                          {job.status === 'running' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelJob(job.id)}
                            >
                              <Square className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {job.executionTime && (
                        <p className="text-sm text-muted-foreground">
                          Execution time: {(job.executionTime / 1000).toFixed(2)}s
                          {job.cost && ` • Cost: $${job.cost.toFixed(4)}`}
                        </p>
                      )}
                      
                      {job.error && (
                        <Alert variant="destructive">
                          <AlertDescription>{job.error}</AlertDescription>
                        </Alert>
                      )}
                      
                      {job.result && (
                        <div className="bg-muted p-3 rounded">
                          <p className="text-sm font-medium mb-2">Results:</p>
                          <pre className="text-xs overflow-auto">
                            {JSON.stringify(job.result, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Backends</CardTitle>
              <CardDescription>
                View and manage Azure Quantum backends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {backends.map((backend) => (
                  <div key={backend.name} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{backend.name}</h4>
                      <Badge className={getAvailabilityColor(backend.availability)}>
                        {backend.availability}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Provider: {backend.provider}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Qubits:</span> {backend.qubits}
                      </div>
                      <div>
                        <span className="font-medium">Max Depth:</span> {backend.maxDepth}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {backend.type}
                      </div>
                      <div>
                        <span className="font-medium">Cost:</span> ${backend.costPerSecond}/s
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {backend.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 