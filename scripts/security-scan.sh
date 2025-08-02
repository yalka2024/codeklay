#!/bin/bash

# CodePal Security Scanning Script
# This script performs comprehensive security scans for the CodePal project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCAN_RESULTS_DIR="security-scan-results"
COMPLIANCE_REPORT_DIR="compliance-reports"
LOG_FILE="security-scan.log"

# Initialize logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

# Create directories
mkdir -p "$SCAN_RESULTS_DIR"
mkdir -p "$COMPLIANCE_REPORT_DIR"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install missing tools
install_tools() {
    log "Checking and installing security tools..."
    
    # Install npm security tools
    if ! command_exists "npm"; then
        error "npm is required but not installed"
        exit 1
    fi
    
    # Install security-related npm packages
    npm install -g npm-audit-resolver
    npm install -g license-checker
    npm install -g npm-license-crawler
    
    # Install Python security tools if Python is available
    if command_exists "python3"; then
        pip3 install bandit safety pip-audit
    fi
    
    success "Security tools installation completed"
}

# Function to run npm security audit
run_npm_audit() {
    log "Running npm security audit..."
    
    if [ -f "package.json" ]; then
        # Run npm audit with different output formats
        npm audit --audit-level=high --json > "$SCAN_RESULTS_DIR/npm-audit-results.json" || true
        npm audit --audit-level=high > "$SCAN_RESULTS_DIR/npm-audit-results.txt" || true
        
        # Check for critical vulnerabilities
        if npm audit --audit-level=critical >/dev/null 2>&1; then
            error "Critical vulnerabilities found in npm dependencies"
            return 1
        else
            success "No critical vulnerabilities found in npm dependencies"
        fi
    else
        warning "No package.json found, skipping npm audit"
    fi
}

# Function to run Snyk security scan
run_snyk_scan() {
    log "Running Snyk security scan..."
    
    if command_exists "snyk"; then
        # Run Snyk test for dependencies
        snyk test --severity-threshold=high --json-file-output="$SCAN_RESULTS_DIR/snyk-dependency-results.json" || true
        
        # Run Snyk monitor for continuous monitoring
        snyk monitor --severity-threshold=high || true
        
        success "Snyk security scan completed"
    else
        warning "Snyk not installed, skipping Snyk scan"
    fi
}

# Function to run license compliance check
run_license_check() {
    log "Running license compliance check..."
    
    if command_exists "license-checker"; then
        # Generate license report
        license-checker --json --out "$SCAN_RESULTS_DIR/license-checker-results.json" || true
        license-checker --summary --out "$SCAN_RESULTS_DIR/license-checker-summary.txt" || true
        
        # Check for problematic licenses
        if grep -i "gpl\|agpl\|lgpl" "$SCAN_RESULTS_DIR/license-checker-summary.txt" >/dev/null 2>&1; then
            warning "Potentially problematic licenses found (GPL, AGPL, LGPL)"
        else
            success "License compliance check completed"
        fi
    else
        warning "license-checker not installed, skipping license check"
    fi
}

# Function to run Python security tools
run_python_security() {
    log "Running Python security scans..."
    
    if command_exists "python3"; then
        # Find Python files
        PYTHON_FILES=$(find . -name "*.py" -not -path "./node_modules/*" -not -path "./venv/*" -not -path "./.venv/*")
        
        if [ -n "$PYTHON_FILES" ]; then
            # Run Bandit security linter
            if command_exists "bandit"; then
                bandit -r . -f json -o "$SCAN_RESULTS_DIR/bandit-results.json" || true
                bandit -r . -f txt -o "$SCAN_RESULTS_DIR/bandit-results.txt" || true
            fi
            
            # Run Safety for dependency vulnerabilities
            if command_exists "safety"; then
                safety check --json --output "$SCAN_RESULTS_DIR/safety-results.json" || true
                safety check --output "$SCAN_RESULTS_DIR/safety-results.txt" || true
            fi
            
            # Run pip-audit
            if command_exists "pip-audit"; then
                pip-audit --format json --output "$SCAN_RESULTS_DIR/pip-audit-results.json" || true
                pip-audit --output "$SCAN_RESULTS_DIR/pip-audit-results.txt" || true
            fi
            
            success "Python security scans completed"
        else
            log "No Python files found, skipping Python security scans"
        fi
    else
        log "Python3 not available, skipping Python security scans"
    fi
}

# Function to run container security scan
run_container_scan() {
    log "Running container security scan..."
    
    if command_exists "docker"; then
        # Check if Dockerfile exists
        if [ -f "Dockerfile" ]; then
            # Build image for scanning
            docker build -t codepal-security-scan .
            
            # Run Trivy scan if available
            if command_exists "trivy"; then
                trivy image --format json --output "$SCAN_RESULTS_DIR/trivy-results.json" codepal-security-scan || true
                trivy image --severity HIGH,CRITICAL codepal-security-scan || true
            fi
            
            # Run Snyk container scan if available
            if command_exists "snyk"; then
                snyk container test codepal-security-scan --severity-threshold=high --json-file-output="$SCAN_RESULTS_DIR/snyk-container-results.json" || true
            fi
            
            # Clean up
            docker rmi codepal-security-scan || true
            
            success "Container security scan completed"
        else
            log "No Dockerfile found, skipping container security scan"
        fi
    else
        log "Docker not available, skipping container security scan"
    fi
}

# Function to run infrastructure security scan
run_infrastructure_scan() {
    log "Running infrastructure security scan..."
    
    # Check for Terraform files
    if [ -d "infrastructure/terraform" ]; then
        cd infrastructure/terraform
        
        # Run Checkov if available
        if command_exists "checkov"; then
            checkov -d . --framework terraform --output json --output-file-path "../../$SCAN_RESULTS_DIR/checkov-results.json" || true
            checkov -d . --framework terraform || true
        fi
        
        # Run Tfsec if available
        if command_exists "tfsec"; then
            tfsec . --format json --out "../../$SCAN_RESULTS_DIR/tfsec-results.json" || true
            tfsec . || true
        fi
        
        # Run Terrascan if available
        if command_exists "terrascan"; then
            terrascan scan -i terraform -d . --format json --output-path "../../$SCAN_RESULTS_DIR/terrascan-results.json" || true
            terrascan scan -i terraform -d . || true
        fi
        
        cd ../..
        success "Infrastructure security scan completed"
    else
        log "No Terraform files found, skipping infrastructure security scan"
    fi
}

# Function to run Kubernetes security scan
run_kubernetes_scan() {
    log "Running Kubernetes security scan..."
    
    # Check for Kubernetes manifests
    if [ -d "infrastructure/kubernetes" ]; then
        # Run Kubesec if available
        if command_exists "kubesec"; then
            mkdir -p "$SCAN_RESULTS_DIR/kubesec-results"
            for file in infrastructure/kubernetes/*.yaml; do
                if [ -f "$file" ]; then
                    kubesec scan "$file" > "$SCAN_RESULTS_DIR/kubesec-results/$(basename "$file" .yaml).json" || true
                fi
            done
        fi
        
        # Run Polaris if available
        if command_exists "polaris"; then
            polaris audit --audit-path infrastructure/kubernetes --format json --output-file "$SCAN_RESULTS_DIR/polaris-results.json" || true
            polaris audit --audit-path infrastructure/kubernetes || true
        fi
        
        success "Kubernetes security scan completed"
    else
        log "No Kubernetes manifests found, skipping Kubernetes security scan"
    fi
}

# Function to run secrets detection
run_secrets_detection() {
    log "Running secrets detection..."
    
    # Run TruffleHog if available
    if command_exists "trufflehog"; then
        trufflehog --only-verified --json . > "$SCAN_RESULTS_DIR/trufflehog-results.json" || true
        trufflehog --only-verified . || true
    fi
    
    # Run GitGuardian if available
    if command_exists "ggshield"; then
        ggshield scan path . --json "$SCAN_RESULTS_DIR/gitguardian-results.json" || true
        ggshield scan path . || true
    fi
    
    # Run Gitleaks if available
    if command_exists "gitleaks"; then
        gitleaks detect --source . --report-format json --report "$SCAN_RESULTS_DIR/gitleaks-results.json" || true
        gitleaks detect --source . || true
    fi
    
    success "Secrets detection completed"
}

# Function to generate security report
generate_security_report() {
    log "Generating security report..."
    
    # Create summary report
    cat > "$SCAN_RESULTS_DIR/security-summary.md" << EOF
# CodePal Security Scan Summary

**Scan Date:** $(date)
**Project:** CodePal
**Branch:** $(git branch --show-current 2>/dev/null || echo "unknown")

## Scan Results

### Dependency Vulnerabilities
- **npm audit:** $(if [ -f "$SCAN_RESULTS_DIR/npm-audit-results.json" ]; then echo "Completed"; else echo "Not available"; fi)
- **Snyk:** $(if [ -f "$SCAN_RESULTS_DIR/snyk-dependency-results.json" ]; then echo "Completed"; else echo "Not available"; fi)

### License Compliance
- **License Checker:** $(if [ -f "$SCAN_RESULTS_DIR/license-checker-results.json" ]; then echo "Completed"; else echo "Not available"; fi)

### Container Security
- **Trivy:** $(if [ -f "$SCAN_RESULTS_DIR/trivy-results.json" ]; then echo "Completed"; else echo "Not available"; fi)
- **Snyk Container:** $(if [ -f "$SCAN_RESULTS_DIR/snyk-container-results.json" ]; then echo "Completed"; else echo "Not available"; fi)

### Infrastructure Security
- **Checkov:** $(if [ -f "$SCAN_RESULTS_DIR/checkov-results.json" ]; then echo "Completed"; else echo "Not available"; fi)
- **Tfsec:** $(if [ -f "$SCAN_RESULTS_DIR/tfsec-results.json" ]; then echo "Completed"; else echo "Not available"; fi)
- **Terrascan:** $(if [ -f "$SCAN_RESULTS_DIR/terrascan-results.json" ]; then echo "Completed"; else echo "Not available"; fi)

### Kubernetes Security
- **Kubesec:** $(if [ -d "$SCAN_RESULTS_DIR/kubesec-results" ]; then echo "Completed"; else echo "Not available"; fi)
- **Polaris:** $(if [ -f "$SCAN_RESULTS_DIR/polaris-results.json" ]; then echo "Completed"; else echo "Not available"; fi)

### Secrets Detection
- **TruffleHog:** $(if [ -f "$SCAN_RESULTS_DIR/trufflehog-results.json" ]; then echo "Completed"; else echo "Not available"; fi)
- **GitGuardian:** $(if [ -f "$SCAN_RESULTS_DIR/gitguardian-results.json" ]; then echo "Completed"; else echo "Not available"; fi)
- **Gitleaks:** $(if [ -f "$SCAN_RESULTS_DIR/gitleaks-results.json" ]; then echo "Completed"; else echo "Not available"; fi)

## Recommendations

1. Review all identified vulnerabilities
2. Update dependencies with security patches
3. Address any license compliance issues
4. Implement security fixes for infrastructure
5. Remove any detected secrets from codebase

## Next Steps

- Schedule regular security scans
- Implement automated security testing in CI/CD
- Conduct security training for development team
- Establish security incident response procedures

EOF
    
    success "Security report generated: $SCAN_RESULTS_DIR/security-summary.md"
}

# Function to check for critical issues
check_critical_issues() {
    log "Checking for critical security issues..."
    
    CRITICAL_ISSUES=0
    
    # Check npm audit for critical issues
    if [ -f "$SCAN_RESULTS_DIR/npm-audit-results.json" ]; then
        if jq -e '.metadata.vulnerabilities.critical > 0' "$SCAN_RESULTS_DIR/npm-audit-results.json" >/dev/null 2>&1; then
            error "Critical npm vulnerabilities detected"
            CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
        fi
    fi
    
    # Check Snyk for critical issues
    if [ -f "$SCAN_RESULTS_DIR/snyk-dependency-results.json" ]; then
        if jq -e '.vulnerabilities[] | select(.severity == "critical")' "$SCAN_RESULTS_DIR/snyk-dependency-results.json" >/dev/null 2>&1; then
            error "Critical Snyk vulnerabilities detected"
            CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
        fi
    fi
    
    # Check for secrets
    if [ -f "$SCAN_RESULTS_DIR/trufflehog-results.json" ]; then
        if jq -e '.results | length > 0' "$SCAN_RESULTS_DIR/trufflehog-results.json" >/dev/null 2>&1; then
            error "Secrets detected in codebase"
            CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
        fi
    fi
    
    if [ $CRITICAL_ISSUES -eq 0 ]; then
        success "No critical security issues detected"
        return 0
    else
        error "$CRITICAL_ISSUES critical security issue(s) detected"
        return 1
    fi
}

# Main execution
main() {
    log "Starting CodePal security scan..."
    
    # Install tools
    install_tools
    
    # Run security scans
    run_npm_audit
    run_snyk_scan
    run_license_check
    run_python_security
    run_container_scan
    run_infrastructure_scan
    run_kubernetes_scan
    run_secrets_detection
    
    # Generate report
    generate_security_report
    
    # Check for critical issues
    if check_critical_issues; then
        success "Security scan completed successfully"
        log "Results available in: $SCAN_RESULTS_DIR/"
        exit 0
    else
        error "Security scan completed with critical issues"
        log "Review results in: $SCAN_RESULTS_DIR/"
        exit 1
    fi
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --install      Install security tools only"
        echo "  --report       Generate report from existing results"
        echo ""
        echo "Examples:"
        echo "  $0              Run full security scan"
        echo "  $0 --install    Install security tools"
        echo "  $0 --report     Generate report from existing results"
        exit 0
        ;;
    --install)
        install_tools
        exit 0
        ;;
    --report)
        generate_security_report
        check_critical_issues
        exit 0
        ;;
    "")
        main
        ;;
    *)
        error "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac 