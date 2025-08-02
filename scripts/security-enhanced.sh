#!/bin/bash

set -e

echo "🔒 Running Enhanced Security Audit..."

mkdir -p security-results

echo "📦 Running npm audit..."
npm audit --audit-level=high --json > security-results/npm-audit.json || true

echo "🔍 Checking dependencies..."
if command -v dependency-check &> /dev/null; then
    dependency-check --project "CodePal" --scan . --format JSON --out security-results/dependency-check.json || true
fi

echo "🔐 Scanning for secrets..."
if command -v gitleaks &> /dev/null; then
    gitleaks detect --source . --report-format json --report-path security-results/gitleaks.json || true
fi

echo "🛡️ Running custom security checks..."
node -e "
const fs = require('fs');
const path = require('path');

const securityIssues = [];

// Check for hardcoded secrets patterns
const secretPatterns = [
    /password\s*=\s*['\"][^'\"]+['\"]/gi,
    /api[_-]?key\s*=\s*['\"][^'\"]+['\"]/gi,
    /secret\s*=\s*['\"][^'\"]+['\"]/gi,
    /token\s*=\s*['\"][^'\"]+['\"]/gi,
];

function scanFile(filePath) {
    if (path.extname(filePath).match(/\.(js|ts|jsx|tsx|json)$/)) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            secretPatterns.forEach((pattern, index) => {
                const matches = content.match(pattern);
                if (matches) {
                    securityIssues.push({
                        file: filePath,
                        issue: 'Potential hardcoded secret',
                        pattern: index,
                        matches: matches.length
                    });
                }
            });
        } catch (error) {
            // Skip files that can't be read
        }
    }
}

function scanDirectory(dir) {
    try {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                scanDirectory(fullPath);
            } else if (stat.isFile()) {
                scanFile(fullPath);
            }
        });
    } catch (error) {
        // Skip directories that can't be read
    }
}

scanDirectory('.');

fs.writeFileSync('security-results/custom-scan.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    issues: securityIssues,
    summary: {
        totalIssues: securityIssues.length,
        filesScanned: securityIssues.length > 0 ? [...new Set(securityIssues.map(i => i.file))].length : 0
    }
}, null, 2));

console.log(\`Custom security scan complete. Found \${securityIssues.length} potential issues.\`);
"

echo "📊 Generating security summary..."
node -e "
const fs = require('fs');

const reports = {};
const reportFiles = [
    'npm-audit.json',
    'dependency-check.json',
    'gitleaks.json',
    'custom-scan.json'
];

reportFiles.forEach(file => {
    const filePath = \`security-results/\${file}\`;
    if (fs.existsSync(filePath)) {
        try {
            reports[file] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            console.warn(\`Failed to parse \${file}: \${error.message}\`);
        }
    }
});

const summary = {
    timestamp: new Date().toISOString(),
    reports: Object.keys(reports),
    summary: {
        npmAuditIssues: reports['npm-audit.json']?.metadata?.vulnerabilities?.total || 0,
        customIssues: reports['custom-scan.json']?.summary?.totalIssues || 0,
        gitleaksIssues: Array.isArray(reports['gitleaks.json']) ? reports['gitleaks.json'].length : 0
    }
};

fs.writeFileSync('security-results/summary.json', JSON.stringify(summary, null, 2));

console.log('Security audit complete!');
console.log(\`Results saved in security-results/ directory\`);
console.log(\`Summary: \${JSON.stringify(summary.summary, null, 2)}\`);
"

echo "✅ Enhanced security audit completed!"
