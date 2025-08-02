#!/bin/bash

# CodePal Elasticity Stress Test Execution Script
# Simulates 50,000 concurrent users performing real-world tasks over 60 minutes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
REPORTS_DIR="$PROJECT_ROOT/reports"
LOGS_DIR="$PROJECT_ROOT/logs"

# Test configuration
ENVIRONMENT=${1:-"staging"}
DURATION=${2:-"3600"} # 60 minutes
CONCURRENT_USERS=${3:-"50000"}
TEST_CONFIG="$SCRIPT_DIR/elasticity-stress-test.yml"

# Create directories
mkdir -p "$REPORTS_DIR"
mkdir -p "$LOGS_DIR"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Artillery is installed
    if ! command -v artillery &> /dev/null; then
        error "Artillery is not installed. Installing..."
        npm install -g artillery
    fi
    
    # Check if Node.js is available
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
        exit 1
    fi
    
    # Check if the test configuration exists
    if [ ! -f "$TEST_CONFIG" ]; then
        error "Test configuration file not found: $TEST_CONFIG"
        exit 1
    fi
    
    # Check if the processor file exists
    if [ ! -f "$SCRIPT_DIR/elasticity-processors.js" ]; then
        error "Processor file not found: $SCRIPT_DIR/elasticity-processors.js"
        exit 1
    fi
    
    success "Prerequisites check completed"
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring infrastructure..."
    
    # Start Prometheus if not running
    if ! docker ps | grep -q prometheus; then
        log "Starting Prometheus..."
        docker run -d --name prometheus \
            -p 9090:9090 \
            -v "$PROJECT_ROOT/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml" \
            prom/prometheus
    fi
    
    # Start Grafana if not running
    if ! docker ps | grep -q grafana; then
        log "Starting Grafana..."
        docker run -d --name grafana \
            -p 3000:3000 \
            -e GF_SECURITY_ADMIN_PASSWORD=admin \
            grafana/grafana
    fi
    
    # Import dashboard
    log "Importing Grafana dashboard..."
    sleep 10 # Wait for Grafana to start
    
    curl -X POST \
        -H "Content-Type: application/json" \
        -d @"$PROJECT_ROOT/monitoring/elasticity-stress-dashboard.json" \
        "http://admin:admin@localhost:3000/api/dashboards/db" || warning "Failed to import dashboard"
    
    success "Monitoring setup completed"
}

# Pre-test validation
pre_test_validation() {
    log "Performing pre-test validation..."
    
    # Check API endpoints
    local api_url=""
    case $ENVIRONMENT in
        "production")
            api_url="https://api.codepal.com"
            ;;
        "staging")
            api_url="https://staging-api.codepal.com"
            ;;
        *)
            api_url="http://localhost:3000"
            ;;
    esac
    
    # Test basic connectivity
    if curl -s --connect-timeout 10 "$api_url/health" > /dev/null; then
        success "API connectivity confirmed"
    else
        error "API connectivity failed"
        exit 1
    fi
    
    # Test authentication endpoint
    if curl -s --connect-timeout 10 "$api_url/auth/login" > /dev/null; then
        success "Authentication endpoint accessible"
    else
        error "Authentication endpoint not accessible"
        exit 1
    fi
    
    # Test agent endpoints
    if curl -s --connect-timeout 10 "$api_url/agents/health" > /dev/null; then
        success "Agent endpoints accessible"
    else
        warning "Agent endpoints not accessible (may be expected in staging)"
    fi
    
    success "Pre-test validation completed"
}

# Start monitoring collection
start_monitoring() {
    log "Starting monitoring data collection..."
    
    # Start system monitoring
    (
        while true; do
            # CPU and Memory usage
            top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 >> "$LOGS_DIR/cpu_usage.log"
            free -m | awk 'NR==2{printf "%.2f", $3*100/$2}' >> "$LOGS_DIR/memory_usage.log"
            
            # Network I/O
            cat /proc/net/dev | grep eth0 | awk '{print $2, $10}' >> "$LOGS_DIR/network_io.log"
            
            # Disk I/O
            iostat -x 1 1 | grep -E "(sda|nvme)" | awk '{print $1, $2, $3}' >> "$LOGS_DIR/disk_io.log"
            
            sleep 5
        done
    ) &
    MONITORING_PID=$!
    
    success "Monitoring started (PID: $MONITORING_PID)"
}

# Execute the load test
execute_load_test() {
    log "Starting elasticity stress test..."
    log "Environment: $ENVIRONMENT"
    log "Duration: $DURATION seconds"
    log "Target concurrent users: $CONCURRENT_USERS"
    
    # Set environment variables
    export ARTILLERY_ENVIRONMENT="$ENVIRONMENT"
    export ARTILLERY_DURATION="$DURATION"
    export ARTILLERY_CONCURRENT_USERS="$CONCURRENT_USERS"
    
    # Run Artillery with detailed output
    artillery run \
        --environment "$ENVIRONMENT" \
        --output "$REPORTS_DIR/elasticity-stress-test-results.json" \
        --output "$REPORTS_DIR/elasticity-stress-test-metrics.csv" \
        --output "$REPORTS_DIR/elasticity-stress-test-summary.html" \
        "$TEST_CONFIG" 2>&1 | tee "$LOGS_DIR/artillery.log"
    
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        success "Load test completed successfully"
    else
        error "Load test failed with exit code $exit_code"
        return $exit_code
    fi
}

# Collect metrics and generate report
generate_report() {
    log "Generating comprehensive test report..."
    
    # Create report directory
    local report_dir="$REPORTS_DIR/elasticity-stress-test-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$report_dir"
    
    # Copy all results
    cp "$REPORTS_DIR"/elasticity-stress-test-* "$report_dir/"
    cp "$LOGS_DIR"/*.log "$report_dir/"
    
    # Generate summary report
    cat > "$report_dir/summary.md" << EOF
# CodePal Elasticity Stress Test Report

## Test Configuration
- **Environment**: $ENVIRONMENT
- **Duration**: $DURATION seconds
- **Target Concurrent Users**: $CONCURRENT_USERS
- **Test Date**: $(date)

## Test Scenarios
1. **Real-time Code Completion** (25% weight)
2. **Agent Handoff Coordination** (20% weight)
3. **Cross-Platform Optimization** (15% weight)
4. **Repository Operations** (20% weight)
5. **Real-time Collaboration** (20% weight)

## Validation Metrics

### Autoscaling Behavior
- ECS CPU utilization threshold: 70%
- ECS Memory utilization threshold: 80%
- Vercel response time threshold: 2000ms
- Redis throughput threshold: 10000 ops/sec
- PostgreSQL replica lag threshold: 1000ms

### Error Recovery
- Agent handoff failure rate threshold: 5%
- Retry logic accuracy threshold: 95%
- Zod validation errors threshold: 1%
- Redis cache hit rate threshold: 80%

### Latency Thresholds
- P95 API response time: 250ms
- P99 API response time: 500ms
- Frontend JS idle time: 100ms
- Agent handoff latency: 1000ms

### Observability Checkpoints
- Prometheus alert response time: 30ms
- Grafana panel refresh rate: 5s
- Datadog trace completion rate: 95%
- Cloudflare worker execution time: 100ms

### Agent Audit Focus
#### MetaAgent Coordination
- Deconfliction success rate: 95%
- Message queue throughput: 1000 msgs/sec
- Handoff delay: 500ms

#### CrossPlatformOptimizationAgent
- Strategy adaptation latency: 200ms
- Performance uplift delta: 10%
- DOM mutation time: 50ms

## Files Generated
- \`elasticity-stress-test-results.json\`: Detailed test results
- \`elasticity-stress-test-metrics.csv\`: Metrics in CSV format
- \`elasticity-stress-test-summary.html\`: HTML summary report
- \`artillery.log\`: Artillery execution log
- \`cpu_usage.log\`: CPU utilization during test
- \`memory_usage.log\`: Memory utilization during test
- \`network_io.log\`: Network I/O metrics
- \`disk_io.log\`: Disk I/O metrics

## Next Steps
1. Review the generated reports
2. Analyze performance bottlenecks
3. Optimize based on findings
4. Re-run test after optimizations
EOF
    
    # Generate JSON summary
    cat > "$report_dir/metrics-summary.json" << EOF
{
  "test_configuration": {
    "environment": "$ENVIRONMENT",
    "duration": $DURATION,
    "concurrent_users": $CONCURRENT_USERS,
    "test_date": "$(date -Iseconds)"
  },
  "validation_metrics": {
    "autoscaling": {
      "ecs_cpu_threshold": 70,
      "ecs_memory_threshold": 80,
      "vercel_response_threshold": 2000,
      "redis_throughput_threshold": 10000,
      "postgresql_lag_threshold": 1000
    },
    "error_recovery": {
      "handoff_failure_threshold": 5,
      "retry_accuracy_threshold": 95,
      "zod_errors_threshold": 1,
      "cache_hit_threshold": 80
    },
    "latency": {
      "p95_response_threshold": 250,
      "p99_response_threshold": 500,
      "frontend_idle_threshold": 100,
      "handoff_latency_threshold": 1000
    },
    "observability": {
      "prometheus_response_threshold": 30,
      "grafana_refresh_threshold": 5,
      "datadog_completion_threshold": 95,
      "cloudflare_execution_threshold": 100
    },
    "agent_audit": {
      "meta_agent": {
        "deconfliction_threshold": 95,
        "queue_throughput_threshold": 1000,
        "handoff_delay_threshold": 500
      },
      "cross_platform_agent": {
        "adaptation_latency_threshold": 200,
        "uplift_delta_threshold": 10,
        "dom_mutation_threshold": 50
      }
    }
  }
}
EOF
    
    success "Report generated in: $report_dir"
    echo "Report location: $report_dir"
}

# Cleanup function
cleanup() {
    log "Performing cleanup..."
    
    # Stop monitoring
    if [ ! -z "$MONITORING_PID" ]; then
        kill $MONITORING_PID 2>/dev/null || true
    fi
    
    # Stop containers if they were started by this script
    if [ "$ENVIRONMENT" = "staging" ]; then
        docker stop prometheus grafana 2>/dev/null || true
        docker rm prometheus grafana 2>/dev/null || true
    fi
    
    success "Cleanup completed"
}

# Main execution
main() {
    log "Starting CodePal Elasticity Stress Test"
    log "========================================"
    
    # Set up trap for cleanup
    trap cleanup EXIT
    
    # Execute test phases
    check_prerequisites
    setup_monitoring
    pre_test_validation
    start_monitoring
    execute_load_test
    generate_report
    
    success "Elasticity stress test completed successfully!"
    log "Check the reports directory for detailed results."
}

# Help function
show_help() {
    echo "Usage: $0 [environment] [duration] [concurrent_users]"
    echo ""
    echo "Parameters:"
    echo "  environment        - Test environment (staging, production) [default: staging]"
    echo "  duration          - Test duration in seconds [default: 3600]"
    echo "  concurrent_users  - Target concurrent users [default: 50000]"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Run with defaults"
    echo "  $0 staging 1800 10000               # 30min test with 10k users"
    echo "  $0 production 7200 100000           # 2hr test with 100k users"
    echo ""
    echo "Environment Variables:"
    echo "  ARTILLERY_ENVIRONMENT     - Override environment"
    echo "  ARTILLERY_DURATION        - Override duration"
    echo "  ARTILLERY_CONCURRENT_USERS - Override concurrent users"
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    *)
        main
        ;;
esac 