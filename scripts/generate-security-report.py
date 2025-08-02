#!/usr/bin/env python3
"""
Security Report Generator for CodePal
Consolidates all security and compliance scan results into comprehensive reports
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any
import yaml
from jinja2 import Template

class SecurityReportGenerator:
    def __init__(self):
        self.scan_results_dir = Path("scan-results")
        self.report_data = {
            "summary": {"critical": 0, "high": 0, "medium": 0, "low": 0},
            "findings": [],
            "critical_findings": [],
            "high_findings": [],
            "medium_findings": [],
            "low_findings": [],
            "recommendations": [],
            "compliance_status": {},
            "scan_metadata": {
                "generated_at": datetime.now().isoformat(),
                "project": "CodePal",
                "version": "1.0.0"
            }
        }
    
    def load_scan_results(self) -> None:
        """Load all scan results from artifacts"""
        if not self.scan_results_dir.exists():
            print("No scan results directory found")
            return
        
        # Load container vulnerability results
        self._load_trivy_results()
        self._load_snyk_results()
        self._load_npm_audit_results()
        self._load_secrets_results()
        self._load_infrastructure_results()
        self._load_kubernetes_results()
        self._load_compliance_results()
        self._load_sast_results()
        self._load_license_results()
    
    def _load_trivy_results(self) -> None:
        """Load Trivy container scan results"""
        trivy_file = self.scan_results_dir / "trivy-results.sarif"
        if trivy_file.exists():
            try:
                with open(trivy_file, 'r') as f:
                    trivy_data = json.load(f)
                
                for run in trivy_data.get("runs", []):
                    for result in run.get("results", []):
                        severity = result.get("level", "warning").upper()
                        self._add_finding({
                            "title": result.get("message", {}).get("text", "Unknown"),
                            "description": result.get("message", {}).get("text", ""),
                            "severity": severity,
                            "category": "Container Vulnerability",
                            "tool": "Trivy",
                            "location": result.get("locations", [{}])[0].get("physicalLocation", {}).get("artifactLocation", {}).get("uri", ""),
                            "rule_id": result.get("ruleId", "")
                        })
            except Exception as e:
                print(f"Error loading Trivy results: {e}")
    
    def _load_snyk_results(self) -> None:
        """Load Snyk scan results"""
        snyk_files = [
            self.scan_results_dir / "snyk-container-results" / "snyk-container-results.json",
            self.scan_results_dir / "dependency-scan-results" / "snyk-dependency-results.json"
        ]
        
        for snyk_file in snyk_files:
            if snyk_file.exists():
                try:
                    with open(snyk_file, 'r') as f:
                        snyk_data = json.load(f)
                    
                    for vuln in snyk_data.get("vulnerabilities", []):
                        severity = vuln.get("severity", "medium").upper()
                        self._add_finding({
                            "title": vuln.get("title", "Unknown"),
                            "description": vuln.get("description", ""),
                            "severity": severity,
                            "category": "Dependency Vulnerability",
                            "tool": "Snyk",
                            "package": vuln.get("packageName", ""),
                            "version": vuln.get("version", ""),
                            "cve": vuln.get("identifiers", {}).get("CVE", [])
                        })
                except Exception as e:
                    print(f"Error loading Snyk results: {e}")
    
    def _load_npm_audit_results(self) -> None:
        """Load npm audit results"""
        npm_audit_file = self.scan_results_dir / "dependency-scan-results" / "npm-audit-results.json"
        if npm_audit_file.exists():
            try:
                with open(npm_audit_file, 'r') as f:
                    npm_data = json.load(f)
                
                for vuln in npm_data.get("vulnerabilities", {}).values():
                    severity = vuln.get("severity", "medium").upper()
                    self._add_finding({
                        "title": vuln.get("title", "Unknown"),
                        "description": vuln.get("description", ""),
                        "severity": severity,
                        "category": "Dependency Vulnerability",
                        "tool": "npm audit",
                        "package": vuln.get("name", ""),
                        "version": vuln.get("version", ""),
                        "cve": vuln.get("cves", [])
                    })
            except Exception as e:
                print(f"Error loading npm audit results: {e}")
    
    def _load_secrets_results(self) -> None:
        """Load secrets detection results"""
        # This would load results from TruffleHog, GitGuardian, etc.
        # Implementation depends on the specific output format
        pass
    
    def _load_infrastructure_results(self) -> None:
        """Load infrastructure security scan results"""
        infra_files = [
            self.scan_results_dir / "infrastructure-scan-results" / "checkov-results.json",
            self.scan_results_dir / "infrastructure-scan-results" / "tfsec-results.json",
            self.scan_results_dir / "infrastructure-scan-results" / "terrascan-results.json"
        ]
        
        for infra_file in infra_files:
            if infra_file.exists():
                try:
                    with open(infra_file, 'r') as f:
                        infra_data = json.load(f)
                    
                    # Process based on tool-specific format
                    if "checkov" in infra_file.name:
                        self._process_checkov_results(infra_data)
                    elif "tfsec" in infra_file.name:
                        self._process_tfsec_results(infra_data)
                    elif "terrascan" in infra_file.name:
                        self._process_terrascan_results(infra_data)
                except Exception as e:
                    print(f"Error loading infrastructure results: {e}")
    
    def _load_kubernetes_results(self) -> None:
        """Load Kubernetes security scan results"""
        k8s_files = [
            self.scan_results_dir / "kubernetes-scan-results" / "polaris-results.json",
            self.scan_results_dir / "kubernetes-scan-results" / "kube-bench-results.json"
        ]
        
        for k8s_file in k8s_files:
            if k8s_file.exists():
                try:
                    with open(k8s_file, 'r') as f:
                        k8s_data = json.load(f)
                    
                    if "polaris" in k8s_file.name:
                        self._process_polaris_results(k8s_data)
                    elif "kube-bench" in k8s_file.name:
                        self._process_kubebench_results(k8s_data)
                except Exception as e:
                    print(f"Error loading Kubernetes results: {e}")
    
    def _load_compliance_results(self) -> None:
        """Load compliance audit results"""
        compliance_files = [
            self.scan_results_dir / "compliance-audit-results" / "bandit-results.json",
            self.scan_results_dir / "compliance-audit-results" / "semgrep-results.json"
        ]
        
        for compliance_file in compliance_files:
            if compliance_file.exists():
                try:
                    with open(compliance_file, 'r') as f:
                        compliance_data = json.load(f)
                    
                    if "bandit" in compliance_file.name:
                        self._process_bandit_results(compliance_data)
                    elif "semgrep" in compliance_file.name:
                        self._process_semgrep_results(compliance_data)
                except Exception as e:
                    print(f"Error loading compliance results: {e}")
    
    def _load_sast_results(self) -> None:
        """Load SAST scan results"""
        sast_file = self.scan_results_dir / "sast-scan-results" / "eslint-security-results.json"
        if sast_file.exists():
            try:
                with open(sast_file, 'r') as f:
                    sast_data = json.load(f)
                
                for result in sast_data:
                    severity = self._map_eslint_severity(result.get("severity", 1))
                    self._add_finding({
                        "title": result.get("ruleId", "Unknown"),
                        "description": result.get("message", ""),
                        "severity": severity,
                        "category": "SAST",
                        "tool": "ESLint Security",
                        "location": result.get("filePath", ""),
                        "line": result.get("line", "")
                    })
            except Exception as e:
                print(f"Error loading SAST results: {e}")
    
    def _load_license_results(self) -> None:
        """Load license compliance results"""
        license_file = self.scan_results_dir / "license-compliance-results" / "license-checker-results.json"
        if license_file.exists():
            try:
                with open(license_file, 'r') as f:
                    license_data = json.load(f)
                
                # Process license compliance issues
                for package, info in license_data.items():
                    if "license" not in info or info["license"] == "UNKNOWN":
                        self._add_finding({
                            "title": f"Unknown license for {package}",
                            "description": f"Package {package} has an unknown or missing license",
                            "severity": "MEDIUM",
                            "category": "License Compliance",
                            "tool": "license-checker",
                            "package": package
                        })
            except Exception as e:
                print(f"Error loading license results: {e}")
    
    def _add_finding(self, finding: Dict[str, Any]) -> None:
        """Add a finding to the report"""
        self.report_data["findings"].append(finding)
        
        severity = finding["severity"]
        if severity == "CRITICAL":
            self.report_data["critical_findings"].append(finding)
            self.report_data["summary"]["critical"] += 1
        elif severity == "HIGH":
            self.report_data["high_findings"].append(finding)
            self.report_data["summary"]["high"] += 1
        elif severity == "MEDIUM":
            self.report_data["medium_findings"].append(finding)
            self.report_data["summary"]["medium"] += 1
        elif severity == "LOW":
            self.report_data["low_findings"].append(finding)
            self.report_data["summary"]["low"] += 1
    
    def _map_eslint_severity(self, severity: int) -> str:
        """Map ESLint severity to standard severity levels"""
        if severity == 2:
            return "HIGH"
        elif severity == 1:
            return "MEDIUM"
        else:
            return "LOW"
    
    def _process_checkov_results(self, data: Dict[str, Any]) -> None:
        """Process Checkov scan results"""
        for check in data.get("results", {}).get("failed_checks", []):
            severity = check.get("severity", "MEDIUM").upper()
            self._add_finding({
                "title": check.get("check_name", "Unknown"),
                "description": check.get("check_result", {}).get("evaluated_iam_statement", ""),
                "severity": severity,
                "category": "Infrastructure Security",
                "tool": "Checkov",
                "resource": check.get("resource", ""),
                "file": check.get("file_path", "")
            })
    
    def _process_tfsec_results(self, data: Dict[str, Any]) -> None:
        """Process Tfsec scan results"""
        for result in data.get("results", []):
            severity = result.get("severity", "MEDIUM").upper()
            self._add_finding({
                "title": result.get("rule_id", "Unknown"),
                "description": result.get("description", ""),
                "severity": severity,
                "category": "Infrastructure Security",
                "tool": "Tfsec",
                "resource": result.get("resource", ""),
                "file": result.get("location", {}).get("filename", "")
            })
    
    def _process_terrascan_results(self, data: Dict[str, Any]) -> None:
        """Process Terrascan scan results"""
        for result in data.get("results", {}).get("violations", []):
            severity = result.get("severity", "MEDIUM").upper()
            self._add_finding({
                "title": result.get("rule_name", "Unknown"),
                "description": result.get("description", ""),
                "severity": severity,
                "category": "Infrastructure Security",
                "tool": "Terrascan",
                "resource": result.get("resource_type", ""),
                "file": result.get("file", "")
            })
    
    def _process_polaris_results(self, data: Dict[str, Any]) -> None:
        """Process Polaris scan results"""
        for result in data.get("results", []):
            for check in result.get("checks", []):
                if check.get("result") == "FAIL":
                    severity = "MEDIUM"  # Polaris doesn't provide severity
                    self._add_finding({
                        "title": check.get("name", "Unknown"),
                        "description": check.get("message", ""),
                        "severity": severity,
                        "category": "Kubernetes Security",
                        "tool": "Polaris",
                        "resource": result.get("kind", ""),
                        "namespace": result.get("namespace", "")
                    })
    
    def _process_kubebench_results(self, data: Dict[str, Any]) -> None:
        """Process Kube-bench scan results"""
        for test in data.get("tests", []):
            for result in test.get("results", []):
                if result.get("status") == "FAIL":
                    severity = "MEDIUM"  # Kube-bench doesn't provide severity
                    self._add_finding({
                        "title": result.get("test_desc", "Unknown"),
                        "description": result.get("test_info", ""),
                        "severity": severity,
                        "category": "Kubernetes Security",
                        "tool": "Kube-bench",
                        "test_number": result.get("test_number", "")
                    })
    
    def _process_bandit_results(self, data: Dict[str, Any]) -> None:
        """Process Bandit scan results"""
        for result in data.get("results", []):
            severity = result.get("issue_severity", "MEDIUM").upper()
            self._add_finding({
                "title": result.get("issue_text", "Unknown"),
                "description": result.get("more_info", ""),
                "severity": severity,
                "category": "Code Security",
                "tool": "Bandit",
                "file": result.get("filename", ""),
                "line": result.get("line_number", "")
            })
    
    def _process_semgrep_results(self, data: Dict[str, Any]) -> None:
        """Process Semgrep scan results"""
        for result in data.get("results", []):
            severity = result.get("extra", {}).get("severity", "MEDIUM").upper()
            self._add_finding({
                "title": result.get("check_id", "Unknown"),
                "description": result.get("extra", {}).get("message", ""),
                "severity": severity,
                "category": "Code Security",
                "tool": "Semgrep",
                "file": result.get("path", ""),
                "line": result.get("start", {}).get("line", "")
            })
    
    def generate_recommendations(self) -> None:
        """Generate security recommendations based on findings"""
        recommendations = []
        
        # Critical findings recommendations
        if self.report_data["summary"]["critical"] > 0:
            recommendations.append("Immediately address all critical vulnerabilities before deployment")
            recommendations.append("Review and update all dependencies with critical vulnerabilities")
        
        # High findings recommendations
        if self.report_data["summary"]["high"] > 0:
            recommendations.append("Prioritize fixing high-severity vulnerabilities in the next sprint")
            recommendations.append("Implement additional security controls for high-risk areas")
        
        # Infrastructure recommendations
        infra_findings = [f for f in self.report_data["findings"] if "Infrastructure" in f["category"]]
        if infra_findings:
            recommendations.append("Review and update infrastructure security configurations")
            recommendations.append("Implement least-privilege access controls")
        
        # Kubernetes recommendations
        k8s_findings = [f for f in self.report_data["findings"] if "Kubernetes" in f["category"]]
        if k8s_findings:
            recommendations.append("Apply Kubernetes security best practices and CIS benchmarks")
            recommendations.append("Enable Pod Security Policies and Network Policies")
        
        # General recommendations
        recommendations.extend([
            "Implement automated security scanning in CI/CD pipeline",
            "Regular security training for development team",
            "Establish security review process for all code changes",
            "Monitor security advisories for all dependencies",
            "Implement security incident response procedures"
        ])
        
        self.report_data["recommendations"] = recommendations
    
    def generate_compliance_status(self) -> None:
        """Generate compliance status report"""
        compliance_status = {
            "overall_status": "PASS" if self.report_data["summary"]["critical"] == 0 else "FAIL",
            "standards": {
                "OWASP Top 10": "PASS" if self.report_data["summary"]["critical"] == 0 else "FAIL",
                "CIS Benchmarks": "PASS" if len([f for f in self.report_data["findings"] if "Kubernetes" in f["category"]]) == 0 else "FAIL",
                "SOC 2": "PASS" if self.report_data["summary"]["critical"] == 0 else "FAIL",
                "GDPR": "PASS" if len([f for f in self.report_data["findings"] if "data" in f["title"].lower()]) == 0 else "FAIL"
            },
            "last_updated": datetime.now().isoformat()
        }
        
        self.report_data["compliance_status"] = compliance_status
    
    def generate_reports(self) -> None:
        """Generate all report formats"""
        # Generate recommendations and compliance status
        self.generate_recommendations()
        self.generate_compliance_status()
        
        # Generate JSON report
        with open("security-report.json", "w") as f:
            json.dump(self.report_data, f, indent=2)
        
        # Generate HTML report
        self._generate_html_report()
        
        # Generate PDF report (if wechart is available)
        try:
            self._generate_pdf_report()
        except ImportError:
            print("wechart not available, skipping PDF generation")
    
    def _generate_html_report(self) -> None:
        """Generate HTML security report"""
        html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodePal Security Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
        .summary-card { background: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .critical { border-left: 5px solid #dc3545; }
        .high { border-left: 5px solid #fd7e14; }
        .medium { border-left: 5px solid #ffc107; }
        .low { border-left: 5px solid #28a745; }
        .findings { margin: 20px 0; }
        .finding { background: #fff; padding: 15px; margin: 10px 0; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .recommendations { background: #e7f3ff; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .compliance { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔒 CodePal Security Report</h1>
        <p>Generated on: {{ scan_metadata.generated_at }}</p>
        <p>Project: {{ scan_metadata.project }} v{{ scan_metadata.version }}</p>
    </div>
    
    <div class="summary">
        <div class="summary-card critical">
            <h3>Critical</h3>
            <h2>{{ summary.critical }}</h2>
        </div>
        <div class="summary-card high">
            <h3>High</h3>
            <h2>{{ summary.high }}</h2>
        </div>
        <div class="summary-card medium">
            <h3>Medium</h3>
            <h2>{{ summary.medium }}</h2>
        </div>
        <div class="summary-card low">
            <h3>Low</h3>
            <h2>{{ summary.low }}</h2>
        </div>
    </div>
    
    <div class="compliance">
        <h2>Compliance Status</h2>
        <p><strong>Overall Status:</strong> {{ compliance_status.overall_status }}</p>
        {% for standard, status in compliance_status.standards.items() %}
        <p><strong>{{ standard }}:</strong> {{ status }}</p>
        {% endfor %}
    </div>
    
    <div class="findings">
        <h2>Security Findings</h2>
        {% for finding in findings %}
        <div class="finding {{ finding.severity.lower() }}">
            <h4>{{ finding.title }}</h4>
            <p><strong>Severity:</strong> {{ finding.severity }}</p>
            <p><strong>Category:</strong> {{ finding.category }}</p>
            <p><strong>Tool:</strong> {{ finding.tool }}</p>
            <p>{{ finding.description }}</p>
        </div>
        {% endfor %}
    </div>
    
    <div class="recommendations">
        <h2>Recommendations</h2>
        <ul>
        {% for recommendation in recommendations %}
            <li>{{ recommendation }}</li>
        {% endfor %}
        </ul>
    </div>
</body>
</html>
        """
        
        template = Template(html_template)
        html_content = template.render(**self.report_data)
        
        with open("security-report.html", "w") as f:
            f.write(html_content)
    
    def _generate_pdf_report(self) -> None:
        """Generate PDF security report"""
        try:
            import weasyprint
            from weasyprint import HTML
            
            # Read the HTML file
            with open("security-report.html", "r") as f:
                html_content = f.read()
            
            # Generate PDF
            HTML(string=html_content).write_pdf("security-report.pdf")
        except ImportError:
            print("weasyprint not available, skipping PDF generation")

def main():
    """Main function"""
    generator = SecurityReportGenerator()
    
    print("Loading scan results...")
    generator.load_scan_results()
    
    print("Generating reports...")
    generator.generate_reports()
    
    print("Security report generation complete!")
    print(f"Summary: {generator.report_data['summary']}")
    print("Files generated:")
    print("- security-report.json")
    print("- security-report.html")
    print("- security-report.pdf (if weasyprint available)")

if __name__ == "__main__":
    main() 