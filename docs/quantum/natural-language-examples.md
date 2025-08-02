# Natural Language to Quantum Code Examples

## 🎯 Overview

This guide provides comprehensive examples of natural language prompts that you can use with CodePal's AI-powered quantum computing features. These prompts demonstrate how to generate quantum circuits, algorithms, and workflows using simple English descriptions.

## 🚀 Getting Started

### Basic Circuit Creation

#### Bell State Circuits
```
"Create a Bell state with 2 qubits"
```
**Generated Code:**
```python
from qiskit import QuantumCircuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure_all()
```

```
"Build a Bell state circuit with 3 qubits"
```
**Generated Code:**
```python
from qiskit import QuantumCircuit
qc = QuantumCircuit(3, 3)
qc.h(0)
qc.cx(0, 1)
qc.cx(1, 2)
qc.measure_all()
```

#### Quantum Teleportation
```
"Create a quantum teleportation circuit"
```
**Generated Code:**
```python
from qiskit import QuantumCircuit
qc = QuantumCircuit(3, 3)
# Alice's qubit (to be teleported)
qc.h(0)
# Bell pair between Alice and Bob
qc.h(1)
qc.cx(1, 2)
# Entangle Alice's qubit with her Bell pair qubit
qc.cx(0, 1)
qc.h(0)
# Measure Alice's qubits
qc.measure([0, 1], [0, 1])
# Apply corrections based on measurement results
qc.cx(1, 2)
qc.cz(0, 2)
qc.measure(2, 2)
```

#### Quantum Fourier Transform
```
"Implement a quantum Fourier transform for 4 qubits"
```
**Generated Code:**
```python
from qiskit import QuantumCircuit
import numpy as np

def qft_rotations(circuit, n):
    if n == 0:
        return circuit
    n -= 1
    circuit.h(n)
    for qubit in range(n):
        circuit.cp(np.pi/2**(n-qubit), qubit, n)
    qft_rotations(circuit, n)

def swap_registers(circuit, n):
    for qubit in range(n//2):
        circuit.swap(qubit, n-qubit-1)
    return circuit

def qft(circuit, n):
    qft_rotations(circuit, n)
    swap_registers(circuit, n)
    return circuit

qc = QuantumCircuit(4, 4)
qft(qc, 4)
qc.measure_all()
```

## 🔬 Advanced Algorithms

### Grover's Algorithm
```
"Implement Grover's search algorithm for finding item 3 in a 4-item database"
```
**Generated Code:**
```python
from qiskit import QuantumCircuit
from qiskit.circuit.library import GroverOperator

def create_oracle(n_qubits, marked_state):
    oracle = QuantumCircuit(n_qubits)
    # Mark the state |11⟩ (item 3)
    oracle.x(0)
    oracle.x(1)
    oracle.ccx(0, 1, 2)
    oracle.x(0)
    oracle.x(1)
    return oracle

def create_diffusion(n_qubits):
    diffusion = QuantumCircuit(n_qubits)
    diffusion.h(range(n_qubits))
    diffusion.x(range(n_qubits))
    diffusion.ccx(0, 1, 2)
    diffusion.x(range(n_qubits))
    diffusion.h(range(n_qubits))
    return diffusion

# Create Grover circuit
n_qubits = 3
oracle = create_oracle(n_qubits, 3)
diffusion = create_diffusion(n_qubits)

qc = QuantumCircuit(n_qubits, n_qubits)
# Initialize superposition
qc.h(range(n_qubits))
# Apply Grover iterations
for _ in range(2):  # Optimal number of iterations
    qc.append(oracle, range(n_qubits))
    qc.append(diffusion, range(n_qubits))
qc.measure_all()
```

### Shor's Algorithm
```
"Create a simplified version of Shor's algorithm for factoring 15"
```
**Generated Code:**
```python
from qiskit import QuantumCircuit
import numpy as np

def create_period_finding_circuit(N, a):
    n_qubits = 4
    qc = QuantumCircuit(2*n_qubits, n_qubits)
    
    # Initialize counting register
    qc.h(range(n_qubits))
    
    # Apply controlled modular exponentiation
    for i in range(n_qubits):
        qc.controlled_modular_exponentiation(a, 2**i, N, 
                                           [i], list(range(n_qubits, 2*n_qubits)))
    
    # Apply inverse QFT
    qc.h(range(n_qubits))
    for i in range(n_qubits):
        for j in range(i+1, n_qubits):
            qc.cp(np.pi/2**(j-i), i, j)
    
    qc.measure(range(n_qubits), range(n_qubits))
    return qc

# Create Shor's algorithm for N=15, a=7
qc = create_period_finding_circuit(15, 7)
```

### Quantum Neural Networks
```
"Create a quantum neural network with 3 qubits and 2 layers"
```
**Generated Code:**
```python
from qiskit import QuantumCircuit
from qiskit.circuit import Parameter
import numpy as np

def create_qnn_layer(n_qubits, layer_params):
    layer = QuantumCircuit(n_qubits)
    
    # Apply rotation gates
    for i in range(n_qubits):
        layer.rx(layer_params[i], i)
        layer.rz(layer_params[i + n_qubits], i)
    
    # Apply entangling gates
    for i in range(n_qubits - 1):
        layer.cx(i, i + 1)
    
    return layer

# Create quantum neural network
n_qubits = 3
n_layers = 2
params_per_layer = 2 * n_qubits

qc = QuantumCircuit(n_qubits, n_qubits)

# Create parameters for each layer
all_params = []
for layer in range(n_layers):
    layer_params = [Parameter(f'θ_{layer}_{i}') for i in range(params_per_layer)]
    all_params.extend(layer_params)
    
    # Add layer to circuit
    qc.append(create_qnn_layer(n_qubits, layer_params), range(n_qubits))

# Add measurement
qc.measure_all()
```

## 🔄 Hybrid Workflows

### Quantum-Classical Optimization
```
"Create a quantum-classical hybrid for portfolio optimization"
```
**Generated Code:**
```python
from qiskit import QuantumCircuit, Aer, execute
from qiskit.algorithms import VQE
from qiskit.algorithms.optimizers import SPSA
from qiskit.circuit.library import TwoLocal
import numpy as np

def create_portfolio_optimization_circuit(n_assets):
    """Create quantum circuit for portfolio optimization"""
    qc = QuantumCircuit(n_assets, n_assets)
    
    # Initialize superposition
    qc.h(range(n_assets))
    
    # Add parameterized rotations
    for i in range(n_assets):
        qc.ry(Parameter(f'θ_{i}'), i)
    
    # Add entangling layers
    for i in range(n_assets - 1):
        qc.cx(i, i + 1)
    
    qc.measure_all()
    return qc

def classical_optimization_step(quantum_result, portfolio_data):
    """Classical optimization step"""
    # Process quantum results
    # Update portfolio weights
    # Return new parameters
    return updated_params

# Create hybrid workflow
n_assets = 4
qc = create_portfolio_optimization_circuit(n_assets)

# Set up VQE
optimizer = SPSA(maxiter=100)
backend = Aer.get_backend('qasm_simulator')

# Define cost function
def cost_function(params):
    # Execute quantum circuit
    job = execute(qc.bind_parameters(params), backend, shots=1000)
    result = job.result()
    counts = result.get_counts()
    
    # Calculate portfolio cost
    return calculate_portfolio_cost(counts, portfolio_data)

# Run hybrid optimization
vqe = VQE(qc, optimizer, quantum_instance=backend)
result = vqe.run()
```

### Quantum-Enhanced Machine Learning
```
"Optimize this classical ML model using quantum annealing"
```
**Generated Code:**
```python
from qiskit import QuantumCircuit
from qiskit.algorithms import QAOA
from qiskit.algorithms.optimizers import COBYLA
import numpy as np

def create_quantum_annealing_circuit(problem_matrix):
    """Create QAOA circuit for optimization"""
    n_qubits = len(problem_matrix)
    qc = QuantumCircuit(n_qubits, n_qubits)
    
    # Initial state
    qc.h(range(n_qubits))
    
    # Problem Hamiltonian
    for i in range(n_qubits):
        for j in range(i+1, n_qubits):
            if problem_matrix[i][j] != 0:
                qc.cx(i, j)
                qc.rz(problem_matrix[i][j], j)
                qc.cx(i, j)
    
    # Mixing Hamiltonian
    for i in range(n_qubits):
        qc.rx(Parameter(f'β_{i}'), i)
    
    qc.measure_all()
    return qc

def optimize_ml_model_with_quantum(classical_model, data):
    """Optimize classical ML model using quantum annealing"""
    
    # Convert ML optimization problem to QUBO
    qubo_matrix = convert_ml_to_qubo(classical_model, data)
    
    # Create quantum circuit
    qc = create_quantum_annealing_circuit(qubo_matrix)
    
    # Run QAOA
    optimizer = COBYLA()
    qaoa = QAOA(qc, optimizer, quantum_instance=backend)
    result = qaoa.run()
    
    # Extract optimized parameters
    optimized_params = result.optimal_parameters
    
    # Apply to classical model
    optimized_model = apply_quantum_optimization(classical_model, optimized_params)
    
    return optimized_model
```

## 🎨 Quantum Error Correction

### Surface Code Implementation
```
"Build a quantum error correction circuit using surface codes"
```
**Generated Code:**
```python
from qiskit import QuantumCircuit
import numpy as np

def create_surface_code_circuit(distance):
    """Create surface code circuit for error correction"""
    n_qubits = distance * distance
    qc = QuantumCircuit(n_qubits, n_qubits)
    
    # Data qubits initialization
    for i in range(n_qubits):
        qc.h(i)
    
    # Stabilizer measurements
    for round_num in range(3):  # Multiple rounds for error correction
        # X-type stabilizers
        for i in range(0, distance-1, 2):
            for j in range(0, distance-1, 2):
                qc.cx(i*distance + j, i*distance + j + 1)
                qc.cx(i*distance + j, (i+1)*distance + j)
                qc.cx(i*distance + j + 1, (i+1)*distance + j + 1)
                qc.cx((i+1)*distance + j, (i+1)*distance + j + 1)
        
        # Z-type stabilizers
        for i in range(1, distance-1, 2):
            for j in range(1, distance-1, 2):
                qc.cz(i*distance + j, i*distance + j + 1)
                qc.cz(i*distance + j, (i+1)*distance + j)
                qc.cz(i*distance + j + 1, (i+1)*distance + j + 1)
                qc.cz((i+1)*distance + j, (i+1)*distance + j + 1)
    
    qc.measure_all()
    return qc

# Create surface code for distance 3
qc = create_surface_code_circuit(3)
```

## 🔧 Custom Quantum Operations

### Custom Quantum Gates
```
"Create a custom quantum gate that applies a rotation around the X-axis followed by a CNOT"
```
**Generated Code:**
```python
from qiskit import QuantumCircuit
from qiskit.circuit import Gate
import numpy as np

class CustomGate(Gate):
    def __init__(self, theta, label=None):
        super().__init__("custom", 2, [theta], label=label)
    
    def _define(self):
        qc = QuantumCircuit(2)
        qc.rx(self.params[0], 0)
        qc.cx(0, 1)
        self.definition = qc

# Create custom gate
custom_gate = CustomGate(np.pi/4)

# Use in circuit
qc = QuantumCircuit(2, 2)
qc.append(custom_gate, [0, 1])
qc.measure_all()
```

### Parameterized Circuits
```
"Create a parameterized quantum circuit with 4 qubits that can be optimized"
```
**Generated Code:**
```python
from qiskit import QuantumCircuit
from qiskit.circuit import Parameter
import numpy as np

def create_parameterized_circuit(n_qubits, n_layers):
    """Create a parameterized quantum circuit"""
    qc = QuantumCircuit(n_qubits, n_qubits)
    
    # Create parameters
    params = []
    for layer in range(n_layers):
        for qubit in range(n_qubits):
            params.append(Parameter(f'θ_{layer}_{qubit}'))
    
    param_index = 0
    
    # Add layers
    for layer in range(n_layers):
        # Rotation layer
        for qubit in range(n_qubits):
            qc.rx(params[param_index], qubit)
            param_index += 1
        
        # Entangling layer
        for qubit in range(n_qubits - 1):
            qc.cx(qubit, qubit + 1)
        
        # Final rotation layer
        for qubit in range(n_qubits):
            qc.rz(params[param_index], qubit)
            param_index += 1
    
    qc.measure_all()
    return qc

# Create parameterized circuit
qc = create_parameterized_circuit(4, 3)
```

## 📊 Quantum Machine Learning

### Quantum Feature Map
```
"Create a quantum feature map for kernel-based machine learning"
```
**Generated Code:**
```python
from qiskit import QuantumCircuit
from qiskit.circuit import ParameterVector
import numpy as np

def create_quantum_feature_map(n_qubits, feature_dim):
    """Create quantum feature map circuit"""
    qc = QuantumCircuit(n_qubits)
    
    # Create feature parameters
    x = ParameterVector('x', feature_dim)
    
    # Encode features into quantum circuit
    for i in range(min(n_qubits, feature_dim)):
        qc.rx(x[i], i)
        qc.rz(x[i], i)
    
    # Add entangling layers
    for i in range(n_qubits - 1):
        qc.cx(i, i + 1)
    
    return qc

# Create quantum feature map
n_qubits = 4
feature_dim = 8
feature_map = create_quantum_feature_map(n_qubits, feature_dim)
```

### Quantum Kernel
```
"Implement a quantum kernel for support vector machines"
```
**Generated Code:**
```python
from qiskit import QuantumCircuit, Aer, execute
from qiskit.circuit import ParameterVector
import numpy as np

def create_quantum_kernel_circuit(n_qubits):
    """Create quantum kernel circuit"""
    qc = QuantumCircuit(n_qubits)
    
    # Feature encoding
    x = ParameterVector('x', n_qubits)
    y = ParameterVector('y', n_qubits)
    
    # Encode first data point
    for i in range(n_qubits):
        qc.rx(x[i], i)
        qc.rz(x[i], i)
    
    # Add entangling layer
    for i in range(n_qubits - 1):
        qc.cx(i, i + 1)
    
    # Encode second data point (inverse)
    for i in range(n_qubits - 1, -1, -1):
        qc.rz(-y[i], i)
        qc.rx(-y[i], i)
    
    return qc

def quantum_kernel(x1, x2, n_qubits=4):
    """Calculate quantum kernel between two data points"""
    qc = create_quantum_kernel_circuit(n_qubits)
    
    # Bind parameters
    params = np.concatenate([x1, x2])
    qc = qc.bind_parameters(params)
    
    # Execute circuit
    backend = Aer.get_backend('statevector_simulator')
    job = execute(qc, backend)
    result = job.result()
    statevector = result.get_statevector()
    
    # Calculate kernel value (overlap with |0...0⟩)
    kernel_value = abs(statevector[0])**2
    
    return kernel_value

# Example usage
x1 = np.array([0.1, 0.2, 0.3, 0.4])
x2 = np.array([0.5, 0.6, 0.7, 0.8])
kernel_value = quantum_kernel(x1, x2)
```

## 🎯 Best Practices

### Prompt Engineering Tips

1. **Be Specific**: Instead of "create a quantum circuit", use "create a Bell state circuit with 3 qubits"

2. **Specify Parameters**: Include specific values like "implement Grover's algorithm for 8 items"

3. **Mention Constraints**: Add constraints like "optimize for minimum depth" or "use only single-qubit gates"

4. **Request Explanations**: Ask for "explain the circuit step by step" or "add comments to the code"

### Example Prompts with Best Practices

```
"Create a quantum circuit that implements a 3-qubit Bell state with detailed comments explaining each step"
```

```
"Optimize this quantum circuit for minimum depth while maintaining the same functionality"
```

```
"Create a parameterized quantum circuit with 5 qubits that can be used for variational quantum eigensolver"
```

```
"Implement quantum error correction using the surface code with distance 3 and explain the stabilizer measurements"
```

## 🔍 Troubleshooting

### Common Issues and Solutions

**Issue**: "Generated circuit is too complex"
**Solution**: "Create a simplified version of this quantum circuit with fewer qubits"

**Issue**: "Circuit doesn't match expected behavior"
**Solution**: "Debug this quantum circuit step by step and explain where it might be going wrong"

**Issue**: "Performance is too slow"
**Solution**: "Optimize this quantum circuit for faster execution on noisy quantum hardware"

**Issue**: "Need to understand the circuit better"
**Solution**: "Add detailed comments and create a visualization of this quantum circuit"

## 📚 Advanced Examples

### Quantum Chemistry
```
"Create a quantum circuit for simulating the hydrogen molecule using VQE"
```

### Quantum Finance
```
"Implement a quantum algorithm for option pricing using amplitude estimation"
```

### Quantum Cryptography
```
"Create a quantum key distribution protocol using BB84"
```

### Quantum Sensing
```
"Design a quantum sensor circuit for measuring magnetic fields"
```

## 🎉 Conclusion

These natural language examples demonstrate the power of CodePal's AI-powered quantum development features. By using descriptive prompts, you can generate complex quantum circuits, algorithms, and workflows without needing to write quantum code from scratch.

Remember to:
- Start with simple circuits and gradually increase complexity
- Use specific parameters and constraints
- Request explanations and comments for better understanding
- Experiment with different prompt variations
- Combine multiple prompts for complex workflows

Happy quantum programming! 🚀 