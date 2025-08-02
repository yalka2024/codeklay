import React from 'react';
import QuantumComputingDashboard from '@/components/quantum/QuantumComputingDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Cpu, Database, TrendingUp, Globe, Shield, Users } from 'lucide-react';

export default function QuantumComputingPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Quantum Computing with CodePal
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience the future of computing with our integrated quantum development platform. 
          Write, simulate, and run quantum algorithms with AI assistance and Azure Quantum integration.
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="secondary" className="text-sm">
            <Zap className="h-3 w-3 mr-1" />
            Azure Quantum
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <Cpu className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <Database className="h-3 w-3 mr-1" />
            Real-time Simulation
          </Badge>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <CardTitle>Azure Quantum Integration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Seamlessly connect to Microsoft Azure Quantum for access to real quantum hardware 
              and simulators from leading providers like IonQ, Pasqal, and Rigetti.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Cpu className="h-5 w-5 text-blue-600" />
              <CardTitle>AI-Powered Quantum Development</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Use AI to generate quantum circuits from natural language, optimize algorithms, 
              and get intelligent suggestions for quantum error correction.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-green-600" />
              <CardTitle>Real-time Simulation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Test your quantum algorithms instantly with our high-performance simulators. 
              Get immediate feedback and performance metrics before running on real hardware.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <CardTitle>Performance Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Monitor quantum job performance, track costs, and analyze execution metrics 
              with comprehensive dashboards and real-time monitoring.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-indigo-600" />
              <CardTitle>Multi-Language Support</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Write quantum code in Qiskit, Cirq, or Q#. Our platform automatically 
              translates and optimizes your code for different quantum backends.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-600" />
              <CardTitle>Secure & Reliable</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Enterprise-grade security with Azure AD integration, encrypted job submissions, 
              and secure access to quantum resources with role-based permissions.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Supported Backends */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Quantum Backends</CardTitle>
          <CardDescription>
            Access a wide range of quantum computing resources through Azure Quantum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold">IonQ</h4>
              <p className="text-sm text-muted-foreground">Trapped Ion Qubits</p>
              <Badge variant="outline" className="mt-2">40 Qubits</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold">Pasqal</h4>
              <p className="text-sm text-muted-foreground">Neutral Atoms</p>
              <Badge variant="outline" className="mt-2">100 Qubits</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold">Rigetti</h4>
              <p className="text-sm text-muted-foreground">Superconducting</p>
              <Badge variant="outline" className="mt-2">80 Qubits</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold">Simulators</h4>
              <p className="text-sm text-muted-foreground">Error-Free Testing</p>
              <Badge variant="outline" className="mt-2">Unlimited</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started with Quantum Computing</CardTitle>
          <CardDescription>
            Follow these steps to start your quantum computing journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold">Choose a Template</h4>
                <p className="text-sm text-muted-foreground">
                  Start with pre-built quantum circuit templates like Bell State, 
                  Quantum Teleportation, or Grover's Algorithm.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold">Customize Your Circuit</h4>
                <p className="text-sm text-muted-foreground">
                  Modify the quantum circuit using our AI-powered code editor 
                  with syntax highlighting and real-time validation.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold">Simulate & Test</h4>
                <p className="text-sm text-muted-foreground">
                  Run your circuit on simulators first to verify correctness 
                  and estimate performance before using real quantum hardware.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h4 className="font-semibold">Deploy to Hardware</h4>
                <p className="text-sm text-muted-foreground">
                  Submit your job to real quantum hardware through Azure Quantum 
                  and monitor execution progress in real-time.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Quantum Computing Dashboard</h2>
            <p className="text-muted-foreground">
              Manage your quantum circuits, monitor jobs, and analyze performance
            </p>
          </div>
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            View Documentation
          </Button>
        </div>
        <QuantumComputingDashboard />
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Explore Quantum Computing?</h3>
            <p className="text-purple-100 max-w-2xl mx-auto">
              Join thousands of developers who are already building the future with quantum computing. 
              Start with our free tier and scale up as you grow.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary" size="lg">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-purple-600">
                View Pricing
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 