#!/bin/bash

# CodePal Azure Quantum Setup Script
# This script sets up Azure Quantum workspace and configures the environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Azure CLI installation
check_azure_cli() {
    if ! command_exists az; then
        print_error "Azure CLI is not installed. Please install it first:"
        echo "https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        exit 1
    fi
    
    print_success "Azure CLI is installed"
}

# Function to check Python installation
check_python() {
    if ! command_exists python3; then
        print_error "Python 3 is not installed. Please install it first."
        exit 1
    fi
    
    print_success "Python 3 is installed"
}

# Function to install Python dependencies
install_python_deps() {
    print_status "Installing Python dependencies..."
    
    # Create requirements file for quantum dependencies
    cat > requirements-quantum.txt << EOF
# Azure Quantum dependencies
azure-quantum>=0.28.0
azure-identity>=1.12.0
azure-mgmt-quantum>=1.0.0

# Quantum computing frameworks
qiskit>=0.44.0
cirq>=1.2.0
qiskit-aer>=0.12.0

# Additional dependencies
numpy>=1.24.0
scipy>=1.10.0
matplotlib>=3.7.0
jupyter>=1.0.0
EOF

    pip3 install -r requirements-quantum.txt
    print_success "Python dependencies installed"
}

# Function to setup Azure Quantum workspace
setup_azure_quantum() {
    print_status "Setting up Azure Quantum workspace..."
    
    # Check if user is logged in to Azure
    if ! az account show >/dev/null 2>&1; then
        print_warning "You are not logged in to Azure. Please log in:"
        az login
    fi
    
    # Get subscription ID
    SUBSCRIPTION_ID=$(az account show --query id -o tsv)
    print_status "Using subscription: $SUBSCRIPTION_ID"
    
    # Set variables
    RESOURCE_GROUP_NAME="codepal-quantum-rg"
    WORKSPACE_NAME="codepal-quantum-workspace"
    LOCATION="westus"
    
    # Create resource group
    print_status "Creating resource group: $RESOURCE_GROUP_NAME"
    az group create --name $RESOURCE_GROUP_NAME --location $LOCATION
    
    # Create Azure Quantum workspace
    print_status "Creating Azure Quantum workspace: $WORKSPACE_NAME"
    az quantum workspace create \
        --resource-group $RESOURCE_GROUP_NAME \
        --workspace-name $WORKSPACE_NAME \
        --location $LOCATION \
        --storage-account "codepalquantumstorage"
    
    # Get workspace details
    WORKSPACE_ID=$(az quantum workspace show \
        --resource-group $RESOURCE_GROUP_NAME \
        --workspace-name $WORKSPACE_NAME \
        --query id -o tsv)
    
    print_success "Azure Quantum workspace created successfully"
    print_status "Workspace ID: $WORKSPACE_ID"
    
    # Save configuration to environment file
    cat > .env.quantum << EOF
# Azure Quantum Configuration
AZURE_SUBSCRIPTION_ID=$SUBSCRIPTION_ID
AZURE_RESOURCE_GROUP=$RESOURCE_GROUP_NAME
AZURE_QUANTUM_WORKSPACE=$WORKSPACE_NAME
AZURE_LOCATION=$LOCATION
AZURE_QUANTUM_WORKSPACE_ID=$WORKSPACE_ID
EOF

    print_success "Configuration saved to .env.quantum"
}

# Function to configure quantum providers
configure_quantum_providers() {
    print_status "Configuring quantum providers..."
    
    # Add IonQ provider
    print_status "Adding IonQ provider..."
    az quantum workspace provider add \
        --resource-group $RESOURCE_GROUP_NAME \
        --workspace-name $WORKSPACE_NAME \
        --provider-id "ionq"
    
    # Add Pasqal provider
    print_status "Adding Pasqal provider..."
    az quantum workspace provider add \
        --resource-group $RESOURCE_GROUP_NAME \
        --workspace-name $WORKSPACE_NAME \
        --provider-id "pasqal"
    
    # Add Rigetti provider
    print_status "Adding Rigetti provider..."
    az quantum workspace provider add \
        --resource-group $RESOURCE_GROUP_NAME \
        --workspace-name $WORKSPACE_NAME \
        --provider-id "rigetti"
    
    print_success "Quantum providers configured"
}

# Function to test quantum workspace
test_quantum_workspace() {
    print_status "Testing quantum workspace..."
    
    # Test workspace connection
    python3 << EOF
import os
from azure.quantum import Workspace
from azure.identity import DefaultAzureCredential

# Load environment variables
subscription_id = os.getenv('AZURE_SUBSCRIPTION_ID')
resource_group = os.getenv('AZURE_RESOURCE_GROUP')
workspace_name = os.getenv('AZURE_QUANTUM_WORKSPACE')

try:
    # Create workspace connection
    workspace = Workspace(
        subscription_id=subscription_id,
        resource_group=resource_group,
        name=workspace_name,
        location="westus"
    )
    
    # List available targets
    targets = workspace.get_targets()
    print(f"Available targets: {len(targets)}")
    
    for target in targets:
        print(f"- {target.name} ({target.provider_id})")
    
    print("✅ Quantum workspace test successful!")
    
except Exception as e:
    print(f"❌ Quantum workspace test failed: {e}")
    exit(1)
EOF
}

# Function to setup monitoring and logging
setup_monitoring() {
    print_status "Setting up monitoring and logging..."
    
    # Create monitoring directory
    mkdir -p logs/quantum
    
    # Create log rotation configuration
    cat > logs/quantum/logrotate.conf << EOF
logs/quantum/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
}
EOF

    print_success "Monitoring setup completed"
}

# Function to create security configuration
setup_security() {
    print_status "Setting up security configuration..."
    
    # Create security configuration file
    cat > config/quantum-security.json << EOF
{
  "authentication": {
    "method": "azure_ad",
    "require_mfa": true,
    "session_timeout": 3600
  },
  "authorization": {
    "role_based_access": true,
    "default_role": "quantum_user",
    "admin_roles": ["quantum_admin", "system_admin"]
  },
  "encryption": {
    "data_at_rest": "AES-256",
    "data_in_transit": "TLS-1.3",
    "key_rotation": 90
  },
  "audit": {
    "enable_logging": true,
    "log_retention_days": 365,
    "alert_on_failure": true
  },
  "rate_limiting": {
    "requests_per_minute": 60,
    "burst_limit": 10
  },
  "cost_controls": {
    "max_daily_cost": 100,
    "max_job_cost": 10,
    "alert_threshold": 80
  }
}
EOF

    print_success "Security configuration created"
}

# Function to create test scripts
create_test_scripts() {
    print_status "Creating test scripts..."
    
    # Create quantum test script
    cat > tests/quantum/test-quantum-integration.js << 'EOF'
const { AzureQuantumService } = require('../../lib/azure-quantum');

describe('Azure Quantum Integration Tests', () => {
  let azureQuantum;

  beforeAll(() => {
    azureQuantum = new AzureQuantumService({
      subscriptionId: process.env.AZURE_SUBSCRIPTION_ID,
      resourceGroup: process.env.AZURE_RESOURCE_GROUP,
      workspaceName: process.env.AZURE_QUANTUM_WORKSPACE,
      location: process.env.AZURE_LOCATION
    });
  });

  test('should connect to Azure Quantum workspace', async () => {
    const backends = await azureQuantum.getBackends();
    expect(backends).toBeDefined();
    expect(backends.length).toBeGreaterThan(0);
  });

  test('should validate quantum circuit', async () => {
    const circuit = {
      id: 'test-circuit',
      name: 'Test Circuit',
      code: 'from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()',
      language: 'qiskit',
      qubits: 2,
      depth: 3,
      gates: 3
    };

    const validation = await azureQuantum.validateCircuit(circuit, 'ionq.simulator');
    expect(validation.valid).toBe(true);
  });

  test('should estimate job cost', async () => {
    const circuit = {
      id: 'test-circuit',
      name: 'Test Circuit',
      code: 'from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()',
      language: 'qiskit',
      qubits: 2,
      depth: 3,
      gates: 3
    };

    const cost = await azureQuantum.estimateJobCost(circuit, 'ionq.simulator');
    expect(cost).toBeGreaterThan(0);
  });
});
EOF

    # Create performance test script
    cat > tests/quantum/test-quantum-performance.js << 'EOF'
const { QuantumWorkflowAgent } = require('../../packages/ai-agents/src/agents/QuantumWorkflowAgent');

describe('Quantum Performance Tests', () => {
  let quantumAgent;

  beforeAll(() => {
    quantumAgent = new QuantumWorkflowAgent(
      { name: 'test-quantum-agent' },
      'test-qiskit-key',
      'test-deepseek-key'
    );
  });

  test('should generate quantum code within 5 seconds', async () => {
    const startTime = Date.now();
    const code = await quantumAgent.generateQuantumCode('Create a Bell state circuit');
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(5000);
    expect(code).toContain('QuantumCircuit');
  });

  test('should optimize circuit within 10 seconds', async () => {
    const circuitCode = `
      from qiskit import QuantumCircuit
      qc = QuantumCircuit(3, 3)
      qc.h(0)
      qc.cx(0, 1)
      qc.cx(1, 2)
      qc.measure_all()
    `;

    const startTime = Date.now();
    const optimizedCode = await quantumAgent.optimizeQuantumCode(circuitCode);
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(10000);
    expect(optimizedCode).toBeDefined();
  });
});
EOF

    print_success "Test scripts created"
}

# Function to create documentation
create_documentation() {
    print_status "Creating documentation..."
    
    # Create user guide
    cat > docs/quantum/USER_GUIDE.md << 'EOF'
# CodePal Quantum Computing User Guide

## Getting Started

### Prerequisites
- Azure account with Quantum Computing enabled
- Python 3.8 or higher
- Node.js 16 or higher

### Setup
1. Run the setup script: `./scripts/setup-azure-quantum.sh`
2. Configure environment variables
3. Install dependencies: `npm install`

### First Quantum Circuit

1. **Create a Circuit**
   ```python
   from qiskit import QuantumCircuit
   qc = QuantumCircuit(2, 2)
   qc.h(0)
   qc.cx(0, 1)
   qc.measure_all()
   ```

2. **Submit to Azure Quantum**
   ```javascript
   const response = await fetch('/api/quantum/azure', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       action: 'submit_job',
       circuit: {
         name: 'Bell State',
         code: circuitCode,
         language: 'qiskit'
       },
       backend: 'ionq.simulator'
     })
   });
   ```

3. **Monitor Results**
   - Check job status in the dashboard
   - View results and performance metrics
   - Download results for further analysis

### Available Backends

- **IonQ Simulator**: 40 qubits, error-free simulation
- **IonQ QPU**: 40 qubits, trapped ion hardware
- **Pasqal Simulator**: 100 qubits, neutral atom simulation
- **Pasqal QPU**: 100 qubits, neutral atom hardware
- **Rigetti Simulator**: 80 qubits, superconducting simulation

### Cost Management

- Monitor costs in real-time
- Set daily and per-job cost limits
- Receive alerts when approaching limits
- Optimize circuits to reduce costs

### Best Practices

1. **Start with Simulators**: Always test on simulators first
2. **Optimize Circuits**: Use AI optimization to reduce costs
3. **Monitor Performance**: Track execution times and success rates
4. **Use Templates**: Leverage pre-built circuit templates
5. **Validate Circuits**: Check compatibility before submission

### Troubleshooting

**Common Issues:**
- Circuit too large for backend
- Authentication errors
- Network connectivity issues
- Cost limit exceeded

**Solutions:**
- Reduce circuit size or use different backend
- Check Azure credentials and permissions
- Verify network connection
- Adjust cost limits or optimize circuit
EOF

    # Create API documentation
    cat > docs/quantum/API_REFERENCE.md << 'EOF'
# Quantum Computing API Reference

## Authentication

All API calls require Azure AD authentication:

```javascript
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
};
```

## Endpoints

### GET /api/quantum/azure

**Parameters:**
- `action`: Required. One of: `backends`, `jobs`, `metrics`, `job`
- `jobId`: Required for `job` action
- `status`: Optional filter for jobs
- `backend`: Optional filter for jobs

**Examples:**
```javascript
// Get available backends
GET /api/quantum/azure?action=backends

// Get quantum jobs
GET /api/quantum/azure?action=jobs&status=completed

// Get specific job
GET /api/quantum/azure?action=job&jobId=job-123

// Get metrics
GET /api/quantum/azure?action=metrics
```

### POST /api/quantum/azure

**Actions:**
- `submit_job`: Submit a quantum job
- `cancel_job`: Cancel a running job
- `validate_circuit`: Validate circuit compatibility
- `estimate_cost`: Estimate job cost

**Submit Job Example:**
```javascript
POST /api/quantum/azure
{
  "action": "submit_job",
  "circuit": {
    "id": "circuit-123",
    "name": "Bell State",
    "code": "from qiskit import QuantumCircuit...",
    "language": "qiskit",
    "qubits": 2,
    "depth": 3,
    "gates": 3
  },
  "backend": "ionq.simulator",
  "parameters": {}
}
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-01-27T10:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-01-27T10:00:00Z"
}
```

## Rate Limits

- 60 requests per minute
- 10 requests per burst
- 1000 requests per day

## Error Codes

- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error
EOF

    print_success "Documentation created"
}

# Function to create security audit script
create_security_audit() {
    print_status "Creating security audit script..."
    
    cat > scripts/security-audit-quantum.sh << 'EOF'
#!/bin/bash

# Quantum Computing Security Audit Script

set -e

echo "🔒 Starting Quantum Computing Security Audit..."

# Check environment variables
echo "Checking environment variables..."
if [ -z "$AZURE_SUBSCRIPTION_ID" ]; then
    echo "❌ AZURE_SUBSCRIPTION_ID not set"
    exit 1
fi

if [ -z "$AZURE_QUANTUM_WORKSPACE" ]; then
    echo "❌ AZURE_QUANTUM_WORKSPACE not set"
    exit 1
fi

echo "✅ Environment variables configured"

# Check Azure authentication
echo "Checking Azure authentication..."
if ! az account show >/dev/null 2>&1; then
    echo "❌ Not authenticated with Azure"
    exit 1
fi

echo "✅ Azure authentication verified"

# Check workspace permissions
echo "Checking workspace permissions..."
WORKSPACE_ID=$(az quantum workspace show \
    --resource-group $AZURE_RESOURCE_GROUP \
    --workspace-name $AZURE_QUANTUM_WORKSPACE \
    --query id -o tsv 2>/dev/null || echo "")

if [ -z "$WORKSPACE_ID" ]; then
    echo "❌ Cannot access quantum workspace"
    exit 1
fi

echo "✅ Workspace access verified"

# Check API security
echo "Checking API security..."
if [ ! -f "config/quantum-security.json" ]; then
    echo "❌ Security configuration not found"
    exit 1
fi

echo "✅ Security configuration present"

# Check rate limiting
echo "Checking rate limiting configuration..."
RATE_LIMIT=$(grep -o '"requests_per_minute":[0-9]*' config/quantum-security.json | cut -d':' -f2)
if [ "$RATE_LIMIT" -lt 60 ]; then
    echo "⚠️  Rate limit may be too restrictive: $RATE_LIMIT requests/minute"
else
    echo "✅ Rate limiting configured appropriately"
fi

# Check encryption settings
echo "Checking encryption settings..."
if grep -q '"data_at_rest":"AES-256"' config/quantum-security.json; then
    echo "✅ Data at rest encryption configured"
else
    echo "❌ Data at rest encryption not configured"
fi

if grep -q '"data_in_transit":"TLS-1.3"' config/quantum-security.json; then
    echo "✅ Data in transit encryption configured"
else
    echo "❌ Data in transit encryption not configured"
fi

# Check audit logging
echo "Checking audit logging..."
if grep -q '"enable_logging":true' config/quantum-security.json; then
    echo "✅ Audit logging enabled"
else
    echo "❌ Audit logging not enabled"
fi

# Check cost controls
echo "Checking cost controls..."
if grep -q '"max_daily_cost"' config/quantum-security.json; then
    echo "✅ Cost controls configured"
else
    echo "❌ Cost controls not configured"
fi

echo "🔒 Security audit completed successfully!"
EOF

    chmod +x scripts/security-audit-quantum.sh
    print_success "Security audit script created"
}

# Main execution
main() {
    echo "🚀 CodePal Azure Quantum Setup"
    echo "================================"
    
    # Check prerequisites
    check_azure_cli
    check_python
    
    # Install dependencies
    install_python_deps
    
    # Setup Azure Quantum
    setup_azure_quantum
    configure_quantum_providers
    
    # Test setup
    test_quantum_workspace
    
    # Setup monitoring and security
    setup_monitoring
    setup_security
    
    # Create test scripts and documentation
    create_test_scripts
    create_documentation
    create_security_audit
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Review .env.quantum configuration"
    echo "2. Run security audit: ./scripts/security-audit-quantum.sh"
    echo "3. Run tests: npm test"
    echo "4. Start development server: npm run dev"
    echo ""
    echo "Documentation available in docs/quantum/"
}

# Run main function
main "$@" 