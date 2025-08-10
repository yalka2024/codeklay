import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';
import { AIGovernance } from '@/lib/ai-governance';
import { IntelligentAutomation } from '@/lib/intelligent-automation';
import { AISecurity, SecurityEvent } from '@/lib/ai-security';

const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const aiGovernance = new AIGovernance(securityService);
const automation = new IntelligentAutomation(securityService);
const aiSecurity = new AISecurity(securityService);

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;

    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'ai_operation',
        resource: 'ai-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action },
        severity: 'medium',
      });
    }

    let response: any;

    switch (action) {
      // Governance AI
      case 'analyze_proposal':
        response = { success: true, analysis: await aiGovernance.analyzeProposal(data) };
        break;
      case 'predict_outcome':
        response = { success: true, prediction: await aiGovernance.predictVoteOutcome(data) };
        break;
      case 'assess_risk':
        response = { success: true, risk: await aiGovernance.assessRisk(data) };
        break;
      case 'generate_insights':
        response = { success: true, insights: await aiGovernance.generateInsights(data) };
        break;

      // Intelligent Automation
      case 'optimize_contract':
        response = { success: true, suggestions: await automation.optimizeSmartContract(data.contractName, data.sourceCode) };
        break;
      case 'compliance_audit':
        response = { success: true, issues: await automation.autoComplianceAudit(data.entityId, data.context || {}) };
        break;
      case 'create_automation_plan':
        response = { success: true, plan: await automation.createAutomationPlan(data.name, data.target, data.steps, data.riskLevel, data.dryRunSupported) };
        break;
      case 'execute_automation':
        response = { success: true, result: await automation.executeAutomation(data.planId, { dryRun: !!data.dryRun }) };
        break;

      // Security AI
      case 'detect_anomalies':
        response = { success: true, anomalies: await aiSecurity.detectAnomalies(data.events as SecurityEvent[]) };
        break;
      case 'score_threat':
        response = { success: true, threat: await aiSecurity.scoreThreat(data.events as SecurityEvent[]) };
        break;
      case 'mitigation_recommendations':
        response = { success: true, recommendations: await aiSecurity.recommendMitigations(data.threat) };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'ai_operation_success',
        resource: 'ai-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action, success: response.success },
        severity: 'low',
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI API Error:', error);
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;

    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'ai_operation_error',
        resource: 'ai-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        severity: 'high',
      });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const governance = await aiGovernance.trackMetrics();
    const automationMetrics = await automation.trackMetrics();
    const securityMetrics = await aiSecurity.trackMetrics(0, 0, 0, 0);

    return NextResponse.json({ success: true, governance, automation: automationMetrics, security: securityMetrics });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}