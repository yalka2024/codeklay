// Quantum Computing Integration for CodePal
// Features: Quantum algorithms, quantum machine learning, quantum cryptography, quantum simulation

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface QuantumAlgorithm {
  id: string;
  name: string;
  type: 'shor' | 'grover' | 'quantum-fourier' | 'quantum-walk' | 'vqe' | 'qaoa' | 'custom';
  status: 'implemented' | 'testing' | 'research' | 'planned';
  description: string;
  complexity: 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n²)' | 'O(2ⁿ)' | 'exponential';
  qubits: number;
  gates: number;
  accuracy: number;
  useCases: string[];
  quantumAdvantage: boolean;
}

interface QuantumML {
  id: string;
  name: string;
  type: 'quantum-neural-network' | 'quantum-kernel' | 'quantum-feature-map' | 'quantum-classifier' | 'quantum-regression';
  status: 'active' | 'training' | 'evaluating' | 'deployed';
  description: string;
  modelSize: number;
  trainingData: number;
  accuracy: number;
  quantumBits: number;
  classicalBits: number;
  hyperparameters: Record<string, any>;
  performance: number;
}

interface QuantumCryptography {
  id: string;
  name: string;
  type: 'qkd' | 'quantum-digital-signature' | 'quantum-commitment' | 'post-quantum-crypto' | 'quantum-key-distribution';
  status: 'implemented' | 'testing' | 'research' | 'standardized';
  description: string;
  securityLevel: '128-bit' | '256-bit' | '512-bit' | 'quantum-resistant';
  keyLength: number;
  transmissionRate: number;
  distance: number;
  protocols: string[];
  certifications: string[];
}

interface QuantumSimulator {
  id: string;
  name: string;
  type: 'noise-free' | 'noisy-intermediate' | 'quantum-dynamics' | 'quantum-chemistry' | 'quantum-optics';
  status: 'available' | 'running' | 'maintenance' | 'upgrading';
  description: string;
  maxQubits: number;
  maxDepth: number;
  noiseModel: string;
  backend: string;
  performance: number;
  queueLength: number;
  supportedGates: string[];
}

interface QuantumJob {
  id: string;
  name: string;
  type: 'algorithm' | 'ml-training' | 'cryptography' | 'simulation' | 'optimization';
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  submittedAt: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  qubits: number;
  shots: number;
  result?: any;
  error?: string;
}

export default function QuantumComputingIntegration() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'algorithms' | 'ml' | 'cryptography' | 'simulators' | 'jobs'>('overview');
  const [quantumAlgorithms, setQuantumAlgorithms] = useState<QuantumAlgorithm[]>([]);
  const [quantumML, setQuantumML] = useState<QuantumML[]>([]);
  const [quantumCryptography, setQuantumCryptography] = useState<QuantumCryptography[]>([]);
  const [quantumSimulators, setQuantumSimulators] = useState<QuantumSimulator[]>([]);
  const [quantumJobs, setQuantumJobs] = useState<QuantumJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuantumData();
  }, []);

  const loadQuantumData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setQuantumAlgorithms([
        {
          id: 'algo-1',
          name: 'Shor\'s Algorithm',
          type: 'shor',
          status: 'implemented',
          description: 'Quantum algorithm for integer factorization, providing exponential speedup over classical methods',
          complexity: 'O((log n)³)',
          qubits: 2048,
          gates: 1000000,
          accuracy: 0.95,
          useCases: ['cryptography', 'number-theory', 'security'],
          quantumAdvantage: true
        },
        {
          id: 'algo-2',
          name: 'Grover\'s Algorithm',
          type: 'grover',
          status: 'implemented',
          description: 'Quantum search algorithm providing quadratic speedup for unstructured search problems',
          complexity: 'O(√n)',
          qubits: 64,
          gates: 10000,
          accuracy: 0.98,
          useCases: ['database-search', 'optimization', 'pattern-matching'],
          quantumAdvantage: true
        },
        {
          id: 'algo-3',
          name: 'Variational Quantum Eigensolver',
          type: 'vqe',
          status: 'testing',
          description: 'Hybrid quantum-classical algorithm for finding ground state energies of quantum systems',
          complexity: 'O(n²)',
          qubits: 32,
          gates: 5000,
          accuracy: 0.85,
          useCases: ['quantum-chemistry', 'material-science', 'drug-discovery'],
          quantumAdvantage: false
        }
      ]);

      setQuantumML([
        {
          id: 'qml-1',
          name: 'Quantum Neural Network',
          type: 'quantum-neural-network',
          status: 'active',
          description: 'Neural network with quantum layers for enhanced pattern recognition and learning',
          modelSize: 1024,
          trainingData: 10000,
          accuracy: 0.92,
          quantumBits: 16,
          classicalBits: 64,
          hyperparameters: {
            learningRate: 0.001,
            epochs: 100,
            batchSize: 32,
            quantumLayers: 4
          },
          performance: 0.88
        },
        {
          id: 'qml-2',
          name: 'Quantum Kernel Method',
          type: 'quantum-kernel',
          status: 'training',
          description: 'Quantum-enhanced kernel methods for support vector machines and classification',
          modelSize: 512,
          trainingData: 5000,
          accuracy: 0.89,
          quantumBits: 8,
          classicalBits: 32,
          hyperparameters: {
            kernelType: 'quantum-rbf',
            regularization: 0.1,
            quantumDepth: 3
          },
          performance: 0.85
        }
      ]);

      setQuantumCryptography([
        {
          id: 'qcrypto-1',
          name: 'Quantum Key Distribution',
          type: 'qkd',
          status: 'implemented',
          description: 'Secure key exchange protocol using quantum entanglement and measurement',
          securityLevel: 'quantum-resistant',
          keyLength: 256,
          transmissionRate: 1000,
          distance: 100,
          protocols: ['BB84', 'E91', 'B92'],
          certifications: ['NIST', 'ISO27001']
        },
        {
          id: 'qcrypto-2',
          name: 'Post-Quantum Cryptography',
          type: 'post-quantum-crypto',
          status: 'testing',
          description: 'Cryptographic algorithms resistant to attacks from quantum computers',
          securityLevel: '256-bit',
          keyLength: 512,
          transmissionRate: 100,
          distance: 50,
          protocols: ['Lattice-based', 'Code-based', 'Multivariate'],
          certifications: ['NIST-PQC']
        }
      ]);

      setQuantumSimulators([
        {
          id: 'sim-1',
          name: 'Noise-Free Quantum Simulator',
          type: 'noise-free',
          status: 'available',
          description: 'Perfect quantum simulator for algorithm development and testing',
          maxQubits: 64,
          maxDepth: 1000,
          noiseModel: 'none',
          backend: 'qiskit-aer',
          performance: 1.0,
          queueLength: 5,
          supportedGates: ['H', 'X', 'Y', 'Z', 'CNOT', 'SWAP', 'Toffoli']
        },
        {
          id: 'sim-2',
          name: 'Noisy Intermediate-Scale Quantum',
          type: 'noisy-intermediate',
          status: 'available',
          description: 'Realistic quantum simulator with noise models for NISQ devices',
          maxQubits: 32,
          maxDepth: 100,
          noiseModel: 'ibmq_manila',
          backend: 'qiskit-aer',
          performance: 0.75,
          queueLength: 12,
          supportedGates: ['H', 'X', 'Y', 'Z', 'CNOT', 'RZ', 'RX']
        }
      ]);

      setQuantumJobs([
        {
          id: 'job-1',
          name: 'Factor Large Integer',
          type: 'algorithm',
          status: 'completed',
          priority: 'high',
          submittedAt: '2024-01-20T10:00:00Z',
          startedAt: '2024-01-20T10:05:00Z',
          completedAt: '2024-01-20T10:15:00Z',
          duration: 600,
          qubits: 16,
          shots: 1000,
          result: { factors: [3, 7, 11], confidence: 0.95 }
        },
        {
          id: 'job-2',
          name: 'Train Quantum Classifier',
          type: 'ml-training',
          status: 'running',
          priority: 'medium',
          submittedAt: '2024-01-20T11:00:00Z',
          startedAt: '2024-01-20T11:10:00Z',
          qubits: 8,
          shots: 500
        },
        {
          id: 'job-3',
          name: 'Quantum Chemistry Simulation',
          type: 'simulation',
          status: 'queued',
          priority: 'low',
          submittedAt: '2024-01-20T12:00:00Z',
          qubits: 32,
          shots: 2000
        }
      ]);
    } catch (error) {
      console.error('Error loading quantum data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'text-green-600 bg-green-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'available': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'testing': return 'text-yellow-600 bg-yellow-100';
      case 'training': return 'text-blue-600 bg-blue-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'research': return 'text-purple-600 bg-purple-100';
      case 'queued': return 'text-gray-600 bg-gray-100';
      case 'maintenance': return 'text-orange-600 bg-orange-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'O(1)': return 'text-green-600 bg-green-100';
      case 'O(log n)': return 'text-blue-600 bg-blue-100';
      case 'O(n)': return 'text-yellow-600 bg-yellow-100';
      case 'O(n²)': return 'text-orange-600 bg-orange-100';
      case 'O(2ⁿ)': return 'text-red-600 bg-red-100';
      case 'exponential': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quantum Algorithms</p>
              <p className="text-2xl font-bold text-gray-900">{quantumAlgorithms.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">⚛️</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quantum ML Models</p>
              <p className="text-2xl font-bold text-gray-900">{quantumML.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">🧠</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quantum Simulators</p>
              <p className="text-2xl font-bold text-gray-900">{quantumSimulators.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">🔬</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">
                {quantumJobs.filter(j => j.status === 'running' || j.status === 'queued').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Quantum Jobs</h3>
          <div className="space-y-3">
            {quantumJobs.slice(0, 3).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">⚡</span>
                  <div>
                    <p className="font-medium text-gray-900">{job.name}</p>
                    <p className="text-sm text-gray-500">{job.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Simulators</h3>
          <div className="space-y-3">
            {quantumSimulators.filter(s => s.status === 'available').slice(0, 3).map((sim) => (
              <div key={sim.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🔬</span>
                  <div>
                    <p className="font-medium text-gray-900">{sim.name}</p>
                    <p className="text-sm text-gray-500">{sim.maxQubits} qubits</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sim.status)}`}>
                  {sim.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlgorithms = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Quantum Algorithms</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Implement Algorithm
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quantumAlgorithms.map((algo) => (
          <div key={algo.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚛️</span>
                <h3 className="font-semibold text-gray-900">{algo.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(algo.status)}`}>
                {algo.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{algo.description}</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium capitalize">{algo.type.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Complexity:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getComplexityColor(algo.complexity)}`}>
                  {algo.complexity}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Qubits:</span>
                <span className="font-medium">{algo.qubits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Accuracy:</span>
                <span className="font-medium">{(algo.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Quantum Advantage:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${algo.quantumAdvantage ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'}`}>
                  {algo.quantumAdvantage ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Execute
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  Optimize
                </button>
                <button className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors">
                  Benchmark
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderML = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Quantum Machine Learning</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Train Model
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quantumML.map((model) => (
          <div key={model.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🧠</span>
                <h3 className="font-semibold text-gray-900">{model.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(model.status)}`}>
                {model.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{model.description}</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium capitalize">{model.type.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Accuracy:</span>
                <span className="font-medium">{(model.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Quantum Bits:</span>
                <span className="font-medium">{model.quantumBits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Training Data:</span>
                <span className="font-medium">{model.trainingData.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Performance:</span>
                <span className="font-medium">{(model.performance * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Train
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  Evaluate
                </button>
                <button className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors">
                  Deploy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCryptography = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Quantum Cryptography</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Implement Protocol
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quantumCryptography.map((crypto) => (
          <div key={crypto.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔐</span>
                <h3 className="font-semibold text-gray-900">{crypto.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(crypto.status)}`}>
                {crypto.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{crypto.description}</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium capitalize">{crypto.type.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Security Level:</span>
                <span className="font-medium">{crypto.securityLevel}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Key Length:</span>
                <span className="font-medium">{crypto.keyLength} bits</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transmission Rate:</span>
                <span className="font-medium">{crypto.transmissionRate} kbps</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Distance:</span>
                <span className="font-medium">{crypto.distance} km</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Configure
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  Test
                </button>
                <button className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors">
                  Deploy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSimulators = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Quantum Simulators</h2>
        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
          Add Simulator
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quantumSimulators.map((sim) => (
          <div key={sim.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔬</span>
                <h3 className="font-semibold text-gray-900">{sim.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sim.status)}`}>
                {sim.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{sim.description}</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium capitalize">{sim.type.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Max Qubits:</span>
                <span className="font-medium">{sim.maxQubits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Max Depth:</span>
                <span className="font-medium">{sim.maxDepth}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Performance:</span>
                <span className="font-medium">{(sim.performance * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Queue Length:</span>
                <span className="font-medium">{sim.queueLength}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Access
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  Monitor
                </button>
                <button className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors">
                  Configure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Quantum Jobs</h2>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
          Submit Job
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {quantumJobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚡</span>
                <h3 className="font-semibold text-gray-900">{job.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                {job.status}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium capitalize">{job.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Priority:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(job.priority)}`}>
                  {job.priority}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Qubits:</span>
                <span className="font-medium">{job.qubits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shots:</span>
                <span className="font-medium">{job.shots}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Submitted:</span>
                <span className="font-medium">{new Date(job.submittedAt).toLocaleDateString()}</span>
              </div>
              {job.duration && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{job.duration}s</span>
                </div>
              )}
            </div>
            {job.result && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600"><strong>Result:</strong> {JSON.stringify(job.result)}</p>
              </div>
            )}
            {job.error && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-red-600"><strong>Error:</strong> {job.error}</p>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  View Details
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  Cancel
                </button>
                <button className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors">
                  Clone
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quantum data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quantum Computing Integration</h1>
          <p className="mt-2 text-gray-600">
            Harness the power of quantum computing with advanced algorithms, machine learning, cryptography, and simulation capabilities.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'algorithms', name: 'Algorithms', icon: '⚛️' },
                { id: 'ml', name: 'Machine Learning', icon: '🧠' },
                { id: 'cryptography', name: 'Cryptography', icon: '🔐' },
                { id: 'simulators', name: 'Simulators', icon: '🔬' },
                { id: 'jobs', name: 'Jobs', icon: '⚡' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'algorithms' && renderAlgorithms()}
            {activeTab === 'ml' && renderML()}
            {activeTab === 'cryptography' && renderCryptography()}
            {activeTab === 'simulators' && renderSimulators()}
            {activeTab === 'jobs' && renderJobs()}
          </div>
        </div>
      </div>
    </div>
  );
} 