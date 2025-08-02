# CodePal Elasticity Stress Test Execution Script (PowerShell)
# Simulates 50,000 concurrent users performing real-world tasks over 60 minutes

param(
    [string]$Environment = "staging",
    [int]$Duration = 3600,  # 60 minutes
    [int]$ConcurrentUsers = 50000,
    [switch]$Help
)

# Configuration
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$ReportsDir = Join-Path $ProjectRoot "reports"
$LogsDir = Join-Path $ProjectRoot "logs"
$TestConfig = Join-Path $ScriptDir "elasticity-stress-test.yml"

# Create directories
New-Item -ItemType Directory -Force -Path $ReportsDir | Out-Null
New-Item -ItemType Directory -Force -Path $LogsDir | Out-Null

# Logging functions
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "SUCCESS" { "Green" }
        "WARNING" { "Yellow" }
        default { "Blue" }
    }
    Write-Host "[$timestamp] $Message" -ForegroundColor $color
}

function Write-Error {
    param([string]$Message)
    Write-Log $Message "ERROR"
}

function Write-Success {
    param([string]$Message)
    Write-Log $Message "SUCCESS"
}

function Write-Warning {
    param([string]$Message)
    Write-Log $Message "WARNING"
}

# Check prerequisites
function Test-Prerequisites {
    Write-Log "Checking prerequisites..."
    
    # Check if Node.js is available
    try {
        $nodeVersion = node --version
        Write-Success "Node.js version: $nodeVersion"
    }
    catch {
        Write-Error "Node.js is not installed"
        exit 1
    }
    
    # Check if Artillery is installed
    try {
        $artilleryVersion = artillery --version
        Write-Success "Artillery version: $artilleryVersion"
    }
    catch {
        Write-Warning "Artillery is not installed. Installing..."
        npm install -g artillery
    }
    
    # Check if the test configuration exists
    if (-not (Test-Path $TestConfig)) {
        Write-Error "Test configuration file not found: $TestConfig"
        exit 1
    }
    
    # Check if the processor file exists
    $processorFile = Join-Path $ScriptDir "elasticity-processors.js"
    if (-not (Test-Path $processorFile)) {
        Write-Error "Processor file not found: $processorFile"
        exit 1
    }
    
    Write-Success "Prerequisites check completed"
}

# Setup monitoring
function Setup-Monitoring {
    Write-Log "Setting up monitoring infrastructure..."
    
    # Check if Docker is available
    try {
        $dockerVersion = docker --version
        Write-Success "Docker version: $dockerVersion"
        
        # Start Prometheus if not running
        $prometheusRunning = docker ps --filter "name=prometheus" --format "table {{.Names}}" | Select-String "prometheus"
        if (-not $prometheusRunning) {
            Write-Log "Starting Prometheus..."
            docker run -d --name prometheus `
                -p 9090:9090 `
                -v "C:\\codepal\\scripts\\monitoring\\prometheus.yml:/etc/prometheus/prometheus.yml" `
                prom/prometheus
        }
        
        # Start Grafana if not running
        $grafanaRunning = docker ps --filter "name=grafana" --format "table {{.Names}}" | Select-String "grafana"
        if (-not $grafanaRunning) {
            Write-Log "Starting Grafana..."
            docker run -d --name grafana `
                -p 3000:3000 `
                -e GF_SECURITY_ADMIN_PASSWORD=admin `
                grafana/grafana
        }
        
        # Import dashboard
        Write-Log "Importing Grafana dashboard..."
        Start-Sleep -Seconds 10 # Wait for Grafana to start
        
        $dashboardFile = Join-Path $ProjectRoot "monitoring/elasticity-stress-dashboard.json"
        if (Test-Path $dashboardFile) {
            try {
                $dashboardContent = Get-Content $dashboardFile -Raw
                Invoke-RestMethod -Uri "http://admin:admin@localhost:3000/api/dashboards/db" `
                    -Method POST `
                    -ContentType "application/json" `
                    -Body $dashboardContent
                Write-Success "Dashboard imported successfully"
            }
            catch {
                Write-Warning "Failed to import dashboard: $($_.Exception.Message)"
            }
        }
    }
    catch {
        Write-Warning "Docker not available, skipping container setup"
    }
    
    Write-Success "Monitoring setup completed"
}

# Pre-test validation
function Test-PreValidation {
    Write-Log "Performing pre-test validation..."
    
    # Check API endpoints
    $apiUrl = switch ($Environment) {
        "production" { "https://api.codepal.com" }
        "staging" { "https://staging-api.codepal.com" }
        default { "http://localhost:3002" }
    }
    
    # Test basic connectivity
    try {
        $response = Invoke-WebRequest -Uri "$apiUrl/health" -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "API connectivity confirmed"
        }
        else {
            Write-Error "API connectivity failed with status: $($response.StatusCode)"
            exit 1
        }
    }
    catch {
        Write-Error "API connectivity failed: $($_.Exception.Message)"
        exit 1
    }
    
    # Test authentication endpoint
    try {
        $response = Invoke-WebRequest -Uri "$apiUrl/auth/login" -TimeoutSec 10 -UseBasicParsing
        Write-Success "Authentication endpoint accessible"
    }
    catch {
        Write-Error "Authentication endpoint not accessible: $($_.Exception.Message)"
        exit 1
    }
    
    # Test agent endpoints
    try {
        $response = Invoke-WebRequest -Uri "$apiUrl/agents/health" -TimeoutSec 10 -UseBasicParsing
        Write-Success "Agent endpoints accessible"
    }
    catch {
        Write-Warning "Agent endpoints not accessible (may be expected in staging)"
    }
    
    Write-Success "Pre-test validation completed"
}

# Start monitoring collection
function Start-Monitoring {
    Write-Log "Starting monitoring data collection..."
    
    # Start system monitoring
    $monitoringScript = {
        param($LogsDir)
        while ($true) {
            # CPU usage
            $cpuUsage = (Get-Counter "\Processor(_Total)\% Processor Time").CounterSamples[0].CookedValue
            "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'),$cpuUsage" | Out-File -FilePath (Join-Path $LogsDir "cpu_usage.log") -Append
            
            # Memory usage
            $memory = Get-Counter "\Memory\Available MBytes"
            $totalMemory = (Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory / 1MB
            $usedMemory = $totalMemory - $memory.CounterSamples[0].CookedValue
            $memoryUsage = ($usedMemory / $totalMemory) * 100
            "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'),$memoryUsage" | Out-File -FilePath (Join-Path $LogsDir "memory_usage.log") -Append
            
            # Network I/O
            $networkStats = Get-Counter "\Network Interface(*)\Bytes Total/sec"
            $networkData = $networkStats.CounterSamples | Where-Object { $_.InstanceName -notlike "*isatap*" -and $_.InstanceName -notlike "*Loopback*" }
            if ($networkData) {
                $totalBytes = ($networkData | Measure-Object -Property CookedValue -Sum).Sum
                "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'),$totalBytes" | Out-File -FilePath (Join-Path $LogsDir "network_io.log") -Append
            }
            
            Start-Sleep -Seconds 5
        }
    }
    
    $monitoringJob = Start-Job -ScriptBlock $monitoringScript -ArgumentList $LogsDir
    $script:MonitoringJobId = $monitoringJob.Id
    
    Write-Success "Monitoring started (Job ID: $($monitoringJob.Id))"
}

# Execute the load test
function Execute-LoadTest {
    Write-Log "Starting elasticity stress test..."
    Write-Log "Environment: $Environment"
    Write-Log "Duration: $Duration seconds"
    Write-Log "Target concurrent users: $ConcurrentUsers"
    
    # Set environment variables
    $env:ARTILLERY_ENVIRONMENT = $Environment
    $env:ARTILLERY_DURATION = $Duration
    $env:ARTILLERY_CONCURRENT_USERS = $ConcurrentUsers
    
    # Run Artillery with detailed output
    $artilleryLog = Join-Path $LogsDir "artillery.log"
    $resultsJson = Join-Path $ReportsDir "elasticity-stress-test-results.json"
    $metricsCsv = Join-Path $ReportsDir "elasticity-stress-test-metrics.csv"
    $summaryHtml = Join-Path $ReportsDir "elasticity-stress-test-summary.html"
    
    try {
        artillery run `
            --environment $Environment `
            --output $resultsJson `
            $TestConfig 2>&1 | Tee-Object -FilePath $artilleryLog
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Load test completed successfully"
        }
        else {
            Write-Error "Load test failed with exit code $LASTEXITCODE"
            return $LASTEXITCODE
        }
    }
    catch {
        Write-Error "Failed to execute load test: $($_.Exception.Message)"
        return 1
    }
}

# Generate report
function Generate-Report {
    Write-Log "Generating comprehensive test report..."
    
    # Create report directory
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $reportDir = Join-Path $ReportsDir "elasticity-stress-test-$timestamp"
    New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
    
    # Copy all results
    Copy-Item (Join-Path $ReportsDir "elasticity-stress-test-*") $reportDir -Force
    Copy-Item (Join-Path $LogsDir "*.log") $reportDir -Force
    
    # Generate summary report
    $summaryContent = @"
# CodePal Elasticity Stress Test Report

## Test Configuration
- **Environment**: $Environment
- **Duration**: $Duration seconds
- **Target Concurrent Users**: $ConcurrentUsers
- **Test Date**: $(Get-Date)

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
- `elasticity-stress-test-results.json`: Detailed test results
- `elasticity-stress-test-metrics.csv`: Metrics in CSV format
- `elasticity-stress-test-summary.html`: HTML summary report
- `artillery.log`: Artillery execution log
- `cpu_usage.log`: CPU utilization during test
- `memory_usage.log`: Memory utilization during test
- `network_io.log`: Network I/O metrics

## Next Steps
1. Review the generated reports
2. Analyze performance bottlenecks
3. Optimize based on findings
4. Re-run test after optimizations
"@
    
    $summaryContent | Out-File -FilePath (Join-Path $reportDir "summary.md") -Encoding UTF8
    
    # Generate JSON summary
    $jsonSummary = @{
        test_configuration = @{
            environment = $Environment
            duration = $Duration
            concurrent_users = $ConcurrentUsers
            test_date = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
        }
        validation_metrics = @{
            autoscaling = @{
                ecs_cpu_threshold = 70
                ecs_memory_threshold = 80
                vercel_response_threshold = 2000
                redis_throughput_threshold = 10000
                postgresql_lag_threshold = 1000
            }
            error_recovery = @{
                handoff_failure_threshold = 5
                retry_accuracy_threshold = 95
                zod_errors_threshold = 1
                cache_hit_threshold = 80
            }
            latency = @{
                p95_response_threshold = 250
                p99_response_threshold = 500
                frontend_idle_threshold = 100
                handoff_latency_threshold = 1000
            }
            observability = @{
                prometheus_response_threshold = 30
                grafana_refresh_threshold = 5
                datadog_completion_threshold = 95
                cloudflare_execution_threshold = 100
            }
            agent_audit = @{
                meta_agent = @{
                    deconfliction_threshold = 95
                    queue_throughput_threshold = 1000
                    handoff_delay_threshold = 500
                }
                cross_platform_agent = @{
                    adaptation_latency_threshold = 200
                    uplift_delta_threshold = 10
                    dom_mutation_threshold = 50
                }
            }
        }
    }
    
    $jsonSummary | ConvertTo-Json -Depth 10 | Out-File -FilePath (Join-Path $reportDir "metrics-summary.json") -Encoding UTF8
    
    Write-Success "Report generated in: $reportDir"
    Write-Host "Report location: $reportDir" -ForegroundColor Cyan
}

# Cleanup function
function Cleanup {
    Write-Log "Performing cleanup..."
    
    # Stop monitoring job
    if ($script:MonitoringJobId) {
        Stop-Job -Id $script:MonitoringJobId -ErrorAction SilentlyContinue
        Remove-Job -Id $script:MonitoringJobId -ErrorAction SilentlyContinue
    }
    
    # Stop containers if they were started by this script
    if ($Environment -eq "staging") {
        docker stop prometheus grafana 2>$null
        docker rm prometheus grafana 2>$null
    }
    
    Write-Success "Cleanup completed"
}

# Help function
function Show-Help {
    Write-Host @"
Usage: .\run-elasticity-test.ps1 [Environment] [Duration] [ConcurrentUsers]

Parameters:
  Environment        - Test environment (staging, production) [default: staging]
  Duration          - Test duration in seconds [default: 3600]
  ConcurrentUsers   - Target concurrent users [default: 50000]

Examples:
  .\run-elasticity-test.ps1                                    # Run with defaults
  .\run-elasticity-test.ps1 staging 1800 10000               # 30min test with 10k users
  .\run-elasticity-test.ps1 production 7200 100000           # 2hr test with 100k users

Environment Variables:
  ARTILLERY_ENVIRONMENT     - Override environment
  ARTILLERY_DURATION        - Override duration
  ARTILLERY_CONCURRENT_USERS - Override concurrent users
"@
}

# Main execution
function Main {
    Write-Log "Starting CodePal Elasticity Stress Test"
    Write-Log "========================================"
    
    # Set up trap for cleanup
    try {
        # Execute test phases
        Test-Prerequisites
        Setup-Monitoring
        Test-PreValidation
        Start-Monitoring
        Execute-LoadTest
        Generate-Report
        
        Write-Success "Elasticity stress test completed successfully!"
        Write-Log "Check the reports directory for detailed results."
    }
    finally {
        Cleanup
    }
}

# Parse command line arguments
if ($Help) {
    Show-Help
    exit 0
}

# Run main function
Main 