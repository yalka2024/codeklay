#!/bin/bash

# Comprehensive Test Runner Script for CodePal Project
# This script runs all types of tests with proper configuration and reporting

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TEST_TYPES=("unit" "integration" "e2e" "performance" "security")
COVERAGE_THRESHOLD=80
TIMEOUT=300 # 5 minutes per test type
REPORT_DIR="./test-reports"
COVERAGE_DIR="./coverage"

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

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_deps=()
    
    # Check Node.js
    if ! command_exists node; then
        missing_deps+=("Node.js")
    fi
    
    # Check npm
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    # Check Jest
    if ! npm list jest >/dev/null 2>&1; then
        missing_deps+=("Jest")
    fi
    
    # Check Playwright (for E2E tests)
    if ! command_exists npx && ! npx playwright --version >/dev/null 2>&1; then
        missing_deps+=("Playwright")
    fi
    
    # Check K6 (for performance tests)
    if ! command_exists k6; then
        missing_deps+=("K6")
        print_warning "K6 not found. Performance tests will be skipped."
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_status "Please install missing dependencies and try again."
        exit 1
    fi
    
    print_success "All prerequisites met"
}

# Function to create directories
setup_directories() {
    print_status "Setting up directories..."
    
    mkdir -p "$REPORT_DIR"
    mkdir -p "$COVERAGE_DIR"
    mkdir -p "$REPORT_DIR/unit"
    mkdir -p "$REPORT_DIR/integration"
    mkdir -p "$REPORT_DIR/e2e"
    mkdir -p "$REPORT_DIR/performance"
    mkdir -p "$REPORT_DIR/security"
    
    print_success "Directories created"
}

# Function to run unit tests
run_unit_tests() {
    print_status "Running unit tests..."
    
    local start_time=$(date +%s)
    local output_file="$REPORT_DIR/unit/unit-test-results.txt"
    local coverage_file="$COVERAGE_DIR/unit-coverage.json"
    
    if timeout $TIMEOUT npm run test:unit > "$output_file" 2>&1; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        # Extract coverage information
        if [ -f "$coverage_file" ]; then
            local coverage=$(node -e "
                const fs = require('fs');
                const coverage = JSON.parse(fs.readFileSync('$coverage_file', 'utf8'));
                console.log(coverage.total.lines.pct);
            " 2>/dev/null || echo "0")
            
            print_success "Unit tests completed in ${duration}s (Coverage: ${coverage}%)"
            
            if (( $(echo "$coverage < $COVERAGE_THRESHOLD" | bc -l) )); then
                print_warning "Unit test coverage (${coverage}%) is below threshold (${COVERAGE_THRESHOLD}%)"
            fi
        else
            print_success "Unit tests completed in ${duration}s"
        fi
        
        return 0
    else
        print_error "Unit tests failed"
        cat "$output_file"
        return 1
    fi
}

# Function to run integration tests
run_integration_tests() {
    print_status "Running integration tests..."
    
    local start_time=$(date +%s)
    local output_file="$REPORT_DIR/integration/integration-test-results.txt"
    
    # Check if database is available
    if ! timeout 10 npm run db:health-check >/dev/null 2>&1; then
        print_warning "Database not available, skipping integration tests"
        return 0
    fi
    
    if timeout $TIMEOUT npm run test:integration > "$output_file" 2>&1; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        print_success "Integration tests completed in ${duration}s"
        return 0
    else
        print_error "Integration tests failed"
        cat "$output_file"
        return 1
    fi
}

# Function to run E2E tests
run_e2e_tests() {
    print_status "Running E2E tests..."
    
    local start_time=$(date +%s)
    local output_file="$REPORT_DIR/e2e/e2e-test-results.txt"
    
    # Check if application is running
    if ! timeout 10 curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        print_warning "Application not running, starting development server..."
        npm run dev &
        local dev_pid=$!
        
        # Wait for server to start
        sleep 10
        
        # Check if server started successfully
        if ! kill -0 $dev_pid 2>/dev/null; then
            print_error "Failed to start development server"
            return 1
        fi
    fi
    
    if timeout $TIMEOUT npm run test:e2e > "$output_file" 2>&1; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        print_success "E2E tests completed in ${duration}s"
        
        # Kill development server if we started it
        if [ ! -z "$dev_pid" ]; then
            kill $dev_pid 2>/dev/null || true
        fi
        
        return 0
    else
        print_error "E2E tests failed"
        cat "$output_file"
        
        # Kill development server if we started it
        if [ ! -z "$dev_pid" ]; then
            kill $dev_pid 2>/dev/null || true
        fi
        
        return 1
    fi
}

# Function to run performance tests
run_performance_tests() {
    print_status "Running performance tests..."
    
    if ! command_exists k6; then
        print_warning "K6 not found, skipping performance tests"
        return 0
    fi
    
    local start_time=$(date +%s)
    local output_file="$REPORT_DIR/performance/performance-test-results.txt"
    
    # Check if application is running
    if ! timeout 10 curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        print_warning "Application not running, skipping performance tests"
        return 0
    fi
    
    if timeout $TIMEOUT k6 run tests/performance/load-test.js > "$output_file" 2>&1; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        print_success "Performance tests completed in ${duration}s"
        return 0
    else
        print_error "Performance tests failed"
        cat "$output_file"
        return 1
    fi
}

# Function to run security tests
run_security_tests() {
    print_status "Running security tests..."
    
    if ! command_exists k6; then
        print_warning "K6 not found, skipping security tests"
        return 0
    fi
    
    local start_time=$(date +%s)
    local output_file="$REPORT_DIR/security/security-test-results.txt"
    
    # Check if application is running
    if ! timeout 10 curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        print_warning "Application not running, skipping security tests"
        return 0
    fi
    
    if timeout $TIMEOUT k6 run tests/security/security-test.js > "$output_file" 2>&1; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        print_success "Security tests completed in ${duration}s"
        return 0
    else
        print_error "Security tests failed"
        cat "$output_file"
        return 1
    fi
}

# Function to generate test report
generate_report() {
    print_status "Generating test report..."
    
    local report_file="$REPORT_DIR/test-report.html"
    local summary_file="$REPORT_DIR/test-summary.txt"
    
    # Create summary
    {
        echo "CodePal Test Report"
        echo "=================="
        echo "Generated: $(date)"
        echo ""
        
        echo "Test Results Summary:"
        echo "-------------------"
        
        for test_type in "${TEST_TYPES[@]}"; do
            local result_file="$REPORT_DIR/$test_type/${test_type}-test-results.txt"
            if [ -f "$result_file" ]; then
                if grep -q "FAIL\|Error\|failed" "$result_file"; then
                    echo "❌ $test_type tests: FAILED"
                else
                    echo "✅ $test_type tests: PASSED"
                fi
            else
                echo "⚠️  $test_type tests: SKIPPED"
            fi
        done
        
        echo ""
        echo "Coverage Summary:"
        echo "----------------"
        
        if [ -f "$COVERAGE_DIR/unit-coverage.json" ]; then
            local coverage=$(node -e "
                const fs = require('fs');
                const coverage = JSON.parse(fs.readFileSync('$COVERAGE_DIR/unit-coverage.json', 'utf8'));
                console.log('Unit Tests: ' + coverage.total.lines.pct + '%');
            " 2>/dev/null || echo "Unit Tests: N/A")
            echo "$coverage"
        fi
        
        echo ""
        echo "Detailed reports available in: $REPORT_DIR"
        echo "Coverage reports available in: $COVERAGE_DIR"
        
    } > "$summary_file"
    
    # Create HTML report
    cat > "$report_file" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>CodePal Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
        .test-type { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .passed { border-left: 5px solid #4CAF50; }
        .failed { border-left: 5px solid #f44336; }
        .skipped { border-left: 5px solid #ff9800; }
        pre { background: #f5f5f5; padding: 10px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CodePal Test Report</h1>
        <p>Generated: $(date)</p>
    </div>
    
    <div class="test-type">
        <h2>Unit Tests</h2>
        <pre>$(cat "$REPORT_DIR/unit/unit-test-results.txt" 2>/dev/null || echo "No unit test results available")</pre>
    </div>
    
    <div class="test-type">
        <h2>Integration Tests</h2>
        <pre>$(cat "$REPORT_DIR/integration/integration-test-results.txt" 2>/dev/null || echo "No integration test results available")</pre>
    </div>
    
    <div class="test-type">
        <h2>E2E Tests</h2>
        <pre>$(cat "$REPORT_DIR/e2e/e2e-test-results.txt" 2>/dev/null || echo "No E2E test results available")</pre>
    </div>
    
    <div class="test-type">
        <h2>Performance Tests</h2>
        <pre>$(cat "$REPORT_DIR/performance/performance-test-results.txt" 2>/dev/null || echo "No performance test results available")</pre>
    </div>
    
    <div class="test-type">
        <h2>Security Tests</h2>
        <pre>$(cat "$REPORT_DIR/security/security-test-results.txt" 2>/dev/null || echo "No security test results available")</pre>
    </div>
</body>
</html>
EOF
    
    print_success "Test report generated: $report_file"
    print_success "Test summary: $summary_file"
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up..."
    
    # Kill any background processes
    jobs -p | xargs -r kill
    
    # Remove temporary files
    rm -f .jest-cache/*
    
    print_success "Cleanup completed"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS] [TEST_TYPES...]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -c, --coverage      Run with coverage reporting"
    echo "  -v, --verbose       Enable verbose output"
    echo "  -t, --timeout SEC   Set timeout for each test type (default: 300)"
    echo "  -r, --report        Generate HTML report"
    echo "  --no-cleanup        Skip cleanup after tests"
    echo ""
    echo "Test Types:"
    echo "  unit                Run unit tests only"
    echo "  integration         Run integration tests only"
    echo "  e2e                 Run E2E tests only"
    echo "  performance         Run performance tests only"
    echo "  security            Run security tests only"
    echo "  all                 Run all test types (default)"
    echo ""
    echo "Examples:"
    echo "  $0                  # Run all tests"
    echo "  $0 unit             # Run unit tests only"
    echo "  $0 -c unit e2e      # Run unit and E2E tests with coverage"
    echo "  $0 -v --report      # Run all tests with verbose output and HTML report"
}

# Main execution
main() {
    local test_types_to_run=()
    local enable_coverage=false
    local verbose=false
    local generate_html_report=false
    local skip_cleanup=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -c|--coverage)
                enable_coverage=true
                shift
                ;;
            -v|--verbose)
                verbose=true
                shift
                ;;
            -t|--timeout)
                TIMEOUT="$2"
                shift 2
                ;;
            -r|--report)
                generate_html_report=true
                shift
                ;;
            --no-cleanup)
                skip_cleanup=true
                shift
                ;;
            unit|integration|e2e|performance|security|all)
                if [ "$1" = "all" ]; then
                    test_types_to_run=("${TEST_TYPES[@]}")
                else
                    test_types_to_run+=("$1")
                fi
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Default to all tests if none specified
    if [ ${#test_types_to_run[@]} -eq 0 ]; then
        test_types_to_run=("${TEST_TYPES[@]}")
    fi
    
    # Set up trap for cleanup
    if [ "$skip_cleanup" = false ]; then
        trap cleanup EXIT
    fi
    
    print_status "Starting CodePal test suite..."
    print_status "Test types to run: ${test_types_to_run[*]}"
    print_status "Timeout per test type: ${TIMEOUT}s"
    
    # Check prerequisites
    check_prerequisites
    
    # Setup directories
    setup_directories
    
    # Track overall success
    local overall_success=true
    local failed_tests=()
    
    # Run tests
    for test_type in "${test_types_to_run[@]}"; do
        print_status "Running $test_type tests..."
        
        case $test_type in
            unit)
                if ! run_unit_tests; then
                    overall_success=false
                    failed_tests+=("unit")
                fi
                ;;
            integration)
                if ! run_integration_tests; then
                    overall_success=false
                    failed_tests+=("integration")
                fi
                ;;
            e2e)
                if ! run_e2e_tests; then
                    overall_success=false
                    failed_tests+=("e2e")
                fi
                ;;
            performance)
                if ! run_performance_tests; then
                    overall_success=false
                    failed_tests+=("performance")
                fi
                ;;
            security)
                if ! run_security_tests; then
                    overall_success=false
                    failed_tests+=("security")
                fi
                ;;
        esac
    done
    
    # Generate report if requested
    if [ "$generate_html_report" = true ]; then
        generate_report
    fi
    
    # Print summary
    echo ""
    echo "========================================"
    echo "Test Suite Summary"
    echo "========================================"
    
    if [ "$overall_success" = true ]; then
        print_success "All tests passed!"
        echo "✅ Test suite completed successfully"
    else
        print_error "Some tests failed: ${failed_tests[*]}"
        echo "❌ Test suite completed with failures"
        exit 1
    fi
    
    echo ""
    echo "Reports available in: $REPORT_DIR"
    if [ "$enable_coverage" = true ]; then
        echo "Coverage reports available in: $COVERAGE_DIR"
    fi
}

# Run main function with all arguments
main "$@" 