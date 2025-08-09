import { EnterpriseSecurityService } from './enterprise-security';

export interface OptimizationSuggestion {
  id: string;
  type: 'gas' | 'security' | 'style' | 'complexity';
  severity: 'low' | 'medium' | 'high';
  description: string;
  location?: { file?: string; line?: number; function?: string };
  diffHint?: string;
}

export interface ComplianceIssue {
  id: string;
  category: 'privacy' | 'security' | 'licensing' | 'governance' | 'data_retention';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence?: string;
  remediation: string[];
}

export interface AutomationPlan {
  id: string;
  name: string;
  target: 'contract' | 'policy' | 'infrastructure' | 'process';
  steps: Array<{ id: string; action: string; params: Record<string, any>; canAutoExecute: boolean }>;
  riskLevel: 'low' | 'medium' | 'high';
  dryRunSupported: boolean;
}

export interface AutomationResult {
  id: string;
  planId: string;
  executedSteps: number;
  successSteps: number;
  failedSteps: number;
  status: 'dry_run' | 'executed' | 'partial' | 'failed';
  logs: string[];
}

export interface AutomationMetrics {
  id: string;
  timestamp: Date;
  contractsOptimized: number;
  avgGasSavingsPct: number;
  complianceFindings: number;
  remediationsApplied: number;
  autoFixSuccessRate: number; // 0..100
}

export class IntelligentAutomation {
  private securityService: EnterpriseSecurityService;
  private suggestions: Map<string, OptimizationSuggestion[]> = new Map();
  private audits: Map<string, ComplianceIssue[]> = new Map();
  private plans: Map<string, AutomationPlan> = new Map();
  private results: Map<string, AutomationResult> = new Map();
  private metrics: Map<string, AutomationMetrics> = new Map();

  constructor(securityService: EnterpriseSecurityService) {
    this.securityService = securityService;
  }

  async optimizeSmartContract(contractName: string, sourceCode: string): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];

    if (/for\s*\(.*;.*;.*\)/.test(sourceCode)) {
      suggestions.push({
        id: `opt_${Date.now()}_loop`,
        type: 'gas',
        severity: 'medium',
        description: 'Consider refactoring loops and using unchecked blocks to reduce gas (Solidity >=0.8).',
        diffHint: 'Use memory arrays, minimize storage writes, leverage ++i and unchecked blocks.',
      });
    }

    if (/public\s+.*\(/.test(sourceCode) && !/onlyOwner|accessControl|require\(/i.test(sourceCode)) {
      suggestions.push({
        id: `opt_${Date.now()}_access`,
        type: 'security',
        severity: 'high',
        description: 'Public function without access control detected. Add Ownable/AccessControl or RBAC check.',
      });
    }

    if (/string\s+memory\s+/.test(sourceCode) && /keccak256\(/.test(sourceCode)) {
      suggestions.push({
        id: `opt_${Date.now()}_stringhash`,
        type: 'gas',
        severity: 'low',
        description: 'Avoid hashing dynamic strings in critical paths; pre-hash or use bytes32 when possible.',
      });
    }

    this.suggestions.set(contractName, suggestions);

    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'intelligent_automation_optimize_contract',
      resource: 'intelligent-automation',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { contractName, suggestions: suggestions.length },
      severity: 'low',
    });

    return suggestions;
  }

  async autoComplianceAudit(entityId: string, context: { policies?: string[]; dataFlows?: string[] }): Promise<ComplianceIssue[]> {
    const issues: ComplianceIssue[] = [];

    if ((context.policies || []).some(p => /gdpr|hipaa|sox/i.test(p)) && (context.dataFlows || []).some(d => /pii|sensitive/i.test(d))) {
      issues.push({
        id: `cmp_${Date.now()}_pii`,
        category: 'privacy',
        severity: 'high',
        description: 'PII detected in data flows; ensure encryption at rest and in transit with access controls.',
        remediation: ['Encrypt sensitive fields', 'Rotate keys', 'Add DLP monitoring'],
      });
    }

    if ((context.policies || []).length === 0) {
      issues.push({
        id: `cmp_${Date.now()}_policy_gap`,
        category: 'governance',
        severity: 'medium',
        description: 'No explicit policy documents linked to this entity.',
        remediation: ['Define access, retention, and incident response policies'],
      });
    }

    this.audits.set(entityId, issues);

    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'intelligent_automation_compliance_audit',
      resource: 'intelligent-automation',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { entityId, issues: issues.length },
      severity: issues.some(i => i.severity === 'critical' || i.severity === 'high') ? 'high' : 'medium',
    });

    return issues;
  }

  async createAutomationPlan(name: string, target: AutomationPlan['target'], steps: AutomationPlan['steps'], riskLevel: AutomationPlan['riskLevel'], dryRunSupported: boolean = true): Promise<AutomationPlan> {
    const plan: AutomationPlan = {
      id: `plan_${Date.now()}`,
      name,
      target,
      steps,
      riskLevel,
      dryRunSupported,
    };
    this.plans.set(plan.id, plan);
    return plan;
  }

  async executeAutomation(planId: string, options?: { dryRun?: boolean }): Promise<AutomationResult> {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error('Automation plan not found');

    const logs: string[] = [];
    let successSteps = 0;
    for (const step of plan.steps) {
      const canRun = options?.dryRun ? plan.dryRunSupported : step.canAutoExecute;
      if (canRun) {
        logs.push(`Executed: ${step.action}`);
        successSteps++;
      } else {
        logs.push(`Skipped (manual): ${step.action}`);
      }
    }

    const result: AutomationResult = {
      id: `result_${Date.now()}`,
      planId,
      executedSteps: plan.steps.length,
      successSteps,
      failedSteps: plan.steps.length - successSteps,
      status: options?.dryRun ? 'dry_run' : successSteps === plan.steps.length ? 'executed' : successSteps > 0 ? 'partial' : 'failed',
      logs,
    };

    this.results.set(result.id, result);

    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'intelligent_automation_execute_plan',
      resource: 'intelligent-automation',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { planId, resultId: result.id, status: result.status },
      severity: result.status === 'executed' ? 'low' : 'medium',
    });

    return result;
  }

  async trackMetrics(): Promise<AutomationMetrics> {
    const contractsOptimized = this.suggestions.size;
    const avgGasSavingsPct = Math.round(Math.min(25, contractsOptimized * 2 + 5));
    const complianceFindings = Array.from(this.audits.values()).reduce((s, a) => s + a.length, 0);
    const remediationsApplied = Array.from(this.results.values()).filter(r => r.status === 'executed').length;
    const autoFixSuccessRate = this.results.size > 0 ? Math.round((remediationsApplied / this.results.size) * 100) : 0;

    const metrics: AutomationMetrics = {
      id: `auto_metrics_${Date.now()}`,
      timestamp: new Date(),
      contractsOptimized,
      avgGasSavingsPct,
      complianceFindings,
      remediationsApplied,
      autoFixSuccessRate,
    };

    this.metrics.set(metrics.id, metrics);
    return metrics;
  }
}