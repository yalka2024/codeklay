import { EnterpriseSecurityService } from './enterprise-security';

export interface GovernanceProposalInput {
  id: string;
  daoId?: string;
  title: string;
  description: string;
  proposer: string;
  tags?: string[];
  historicalOutcomes?: Array<{ result: 'passed' | 'rejected' | 'expired'; forVotes: number; againstVotes: number; abstainVotes: number; quorum: number; createdAt: Date }>;
}

export interface ProposalAnalysis {
  proposalId: string;
  sentimentScore: number; // -1..1
  complexityScore: number; // 0..100
  riskFactors: string[];
  keyEntities: string[];
  topics: string[];
  biasSignals: string[];
  summary: string;
}

export interface OutcomePrediction {
  proposalId: string;
  probabilityPass: number; // 0..1
  probabilityReject: number; // 0..1
  probabilityExpire: number; // 0..1
  confidence: number; // 0..1
  expectedForVotes: number;
  expectedAgainstVotes: number;
  expectedTurnout: number; // 0..1
}

export interface RiskAssessment {
  proposalId: string;
  governanceRisk: number; // 0..100
  technicalRisk: number; // 0..100
  economicRisk: number; // 0..100
  legalRisk: number; // 0..100
  overallRisk: number; // 0..100
  riskNarrative: string;
  recommendations: string[];
}

export interface GovernanceInsight {
  proposalId: string;
  insights: string[];
  recommendedActions: Array<{ action: string; impact: 'low' | 'medium' | 'high'; rationale: string }>;
}

export interface GovernanceAIMetrics {
  id: string;
  timestamp: Date;
  proposalsAnalyzed: number;
  averageSentiment: number;
  averageRisk: number;
  avgConfidence: number;
  predictionsMade: number;
  recommendationsIssued: number;
}

export class AIGovernance {
  private securityService: EnterpriseSecurityService;
  private analyses: Map<string, ProposalAnalysis> = new Map();
  private predictions: Map<string, OutcomePrediction> = new Map();
  private risks: Map<string, RiskAssessment> = new Map();
  private insights: Map<string, GovernanceInsight> = new Map();
  private metrics: Map<string, GovernanceAIMetrics> = new Map();

  constructor(securityService: EnterpriseSecurityService) {
    this.securityService = securityService;
  }

  async analyzeProposal(input: GovernanceProposalInput): Promise<ProposalAnalysis> {
    // Simple heuristic-based NLP-style analysis (simulated)
    const lower = (input.title + ' ' + input.description).toLowerCase();
    const sentimentScore = this.estimateSentiment(lower);
    const complexityScore = Math.min(100, Math.round(input.description.length / 20));
    const topics = this.extractTopics(lower);
    const keyEntities = this.extractEntities(lower);
    const biasSignals = this.detectBiasSignals(lower);
    const riskFactors = this.deriveRiskFactors(topics, biasSignals);
    const summary = this.generateAbstractiveSummary(input.title, input.description);

    const analysis: ProposalAnalysis = {
      proposalId: input.id,
      sentimentScore,
      complexityScore,
      riskFactors,
      keyEntities,
      topics,
      biasSignals,
      summary,
    };

    this.analyses.set(input.id, analysis);

    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'ai_governance_analyze_proposal',
      resource: 'ai-governance',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { proposalId: input.id, topics, sentimentScore, complexityScore },
      severity: 'low',
    });

    return analysis;
  }

  async predictVoteOutcome(input: GovernanceProposalInput): Promise<OutcomePrediction> {
    const past = input.historicalOutcomes || [];
    const passRate = past.length > 0 ? past.filter(p => p.result === 'passed').length / past.length : 0.5;
    const avgForVotes = past.length > 0 ? past.reduce((s, p) => s + p.forVotes, 0) / past.length : 1000;
    const avgAgainst = past.length > 0 ? past.reduce((s, p) => s + p.againstVotes, 0) / past.length : 500;
    const turnout = past.length > 0 ? past.reduce((s, p) => s + (p.forVotes + p.againstVotes + p.abstainVotes) / Math.max(p.quorum, 1), 0) / past.length : 0.6;

    const probabilityPass = Math.min(0.95, Math.max(0.05, passRate * 0.8 + 0.1));
    const probabilityReject = Math.min(0.9, Math.max(0.05, 1 - probabilityPass - 0.05));
    const probabilityExpire = 1 - probabilityPass - probabilityReject;
    const confidence = Math.min(0.9, 0.5 + (past.length / 20));

    const prediction: OutcomePrediction = {
      proposalId: input.id,
      probabilityPass,
      probabilityReject,
      probabilityExpire,
      confidence,
      expectedForVotes: Math.round(avgForVotes * (0.9 + Math.random() * 0.2)),
      expectedAgainstVotes: Math.round(avgAgainst * (0.9 + Math.random() * 0.2)),
      expectedTurnout: turnout,
    };

    this.predictions.set(input.id, prediction);

    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'ai_governance_predict_outcome',
      resource: 'ai-governance',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { proposalId: input.id, confidence, probabilityPass },
      severity: 'low',
    });

    return prediction;
  }

  async assessRisk(input: GovernanceProposalInput): Promise<RiskAssessment> {
    const analysis = this.analyses.get(input.id) || (await this.analyzeProposal(input));
    const technicalRisk = analysis.topics.includes('upgrade') || analysis.topics.includes('contract') ? 65 : 35;
    const governanceRisk = analysis.biasSignals.length > 0 ? 55 : 30;
    const economicRisk = analysis.topics.includes('treasury') ? 60 : 25;
    const legalRisk = analysis.topics.includes('license') ? 40 : 20;
    const overallRisk = Math.round(0.35 * technicalRisk + 0.3 * governanceRisk + 0.25 * economicRisk + 0.1 * legalRisk);

    const recommendations = this.generateRiskRecommendations({ technicalRisk, governanceRisk, economicRisk, legalRisk, overallRisk });

    const risk: RiskAssessment = {
      proposalId: input.id,
      governanceRisk,
      technicalRisk,
      economicRisk,
      legalRisk,
      overallRisk,
      riskNarrative: `Overall risk is ${overallRisk}/100. Primary drivers: ${analysis.topics.slice(0, 3).join(', ') || 'general governance'}.` ,
      recommendations,
    };

    this.risks.set(input.id, risk);

    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'ai_governance_risk_assessed',
      resource: 'ai-governance',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { proposalId: input.id, overallRisk },
      severity: 'medium',
    });

    return risk;
  }

  async generateInsights(input: GovernanceProposalInput): Promise<GovernanceInsight> {
    const analysis = this.analyses.get(input.id) || (await this.analyzeProposal(input));
    const risk = this.risks.get(input.id) || (await this.assessRisk(input));

    const insights = [
      `Proposal sentiment is ${(analysis.sentimentScore * 100).toFixed(0)}% which may affect voter engagement.`,
      `Complexity score is ${analysis.complexityScore}/100; consider a concise explainer for members.`,
      `Top topics detected: ${analysis.topics.slice(0, 5).join(', ') || 'general governance'}.`,
    ];

    const recommendedActions: GovernanceInsight['recommendedActions'] = [
      { action: 'Publish executive summary and FAQs', impact: 'high', rationale: 'Reduce complexity and increase turnout' },
      { action: 'Hold community call', impact: 'medium', rationale: 'Address concerns and clarify scope' },
      { action: 'Add risk mitigation clauses', impact: 'high', rationale: `Lower overall risk (${risk.overallRisk}/100)` },
    ];

    const insight: GovernanceInsight = {
      proposalId: input.id,
      insights,
      recommendedActions,
    };

    this.insights.set(input.id, insight);

    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'ai_governance_generated_insights',
      resource: 'ai-governance',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { proposalId: input.id, actions: recommendedActions.length },
      severity: 'low',
    });

    return insight;
  }

  async trackMetrics(): Promise<GovernanceAIMetrics> {
    const values = Array.from(this.predictions.values());
    const avgConfidence = values.length > 0 ? values.reduce((s, p) => s + p.confidence, 0) / values.length : 0;

    const metrics: GovernanceAIMetrics = {
      id: `gov_ai_metrics_${Date.now()}`,
      timestamp: new Date(),
      proposalsAnalyzed: this.analyses.size,
      averageSentiment: this.analyses.size > 0 ? Array.from(this.analyses.values()).reduce((s, a) => s + a.sentimentScore, 0) / this.analyses.size : 0,
      averageRisk: this.risks.size > 0 ? Array.from(this.risks.values()).reduce((s, r) => s + r.overallRisk, 0) / this.risks.size : 0,
      avgConfidence,
      predictionsMade: this.predictions.size,
      recommendationsIssued: this.insights.size,
    };

    this.metrics.set(metrics.id, metrics);
    return metrics;
  }

  // Simple helpers (simulated ML/NLP pipelines)
  private estimateSentiment(text: string): number {
    const positive = ['improve', 'optimize', 'increase', 'upgrade', 'benefit', 'reduce risk'];
    const negative = ['risk', 'vulnerability', 'downgrade', 'decrease', 'issue', 'bug'];
    let score = 0;
    for (const p of positive) if (text.includes(p)) score += 1;
    for (const n of negative) if (text.includes(n)) score -= 1;
    return Math.max(-1, Math.min(1, score / 5));
  }

  private extractTopics(text: string): string[] {
    const topics = ['treasury', 'governance', 'upgrade', 'contract', 'license', 'staking', 'fees', 'rewards', 'security'];
    return topics.filter(t => text.includes(t));
  }

  private extractEntities(text: string): string[] {
    const matches = text.match(/[a-z0-9]{40,}/g) || [];
    return matches.slice(0, 5);
  }

  private detectBiasSignals(text: string): string[] {
    const signals = ['must', 'guarantee', 'always', 'never', 'only'];
    return signals.filter(s => text.includes(s));
  }

  private deriveRiskFactors(topics: string[], bias: string[]): string[] {
    const factors = new Set<string>();
    topics.forEach(t => factors.add(`topic:${t}`));
    bias.forEach(b => factors.add(`bias:${b}`));
    return Array.from(factors);
  }

  private generateAbstractiveSummary(title: string, description: string): string {
    const trimmed = description.split(/\s+/).slice(0, 60).join(' ');
    return `${title}. ${trimmed}${description.length > trimmed.length ? '…' : ''}`;
  }

  private generateRiskRecommendations(r: { technicalRisk: number; governanceRisk: number; economicRisk: number; legalRisk: number; overallRisk: number }): string[] {
    const recs: string[] = [];
    if (r.technicalRisk > 50) recs.push('Perform external smart contract audit');
    if (r.governanceRisk > 45) recs.push('Introduce longer discussion period and clarify scope');
    if (r.economicRisk > 45) recs.push('Cap treasury exposure and add contingency reserves');
    if (r.legalRisk > 35) recs.push('Seek legal review for licensing/compliance');
    if (r.overallRisk > 60) recs.push('Add veto/pausing safeguards and staged rollout');
    return recs;
  }
}