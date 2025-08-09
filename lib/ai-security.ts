import { EnterpriseSecurityService } from './enterprise-security';

export interface SecurityEvent {
  id: string;
  type: 'auth' | 'api' | 'blockchain' | 'defi' | 'system' | 'governance';
  userId?: string;
  ip?: string;
  userAgent?: string;
  resource?: string;
  action?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AnomalyDetectionResult {
  windowStart: Date;
  windowEnd: Date;
  totalEvents: number;
  anomalies: Array<{ id: string; reason: string; score: number }>;
  anomalyRate: number; // 0..1
}

export interface ThreatScore {
  score: number; // 0..100
  level: 'low' | 'medium' | 'high' | 'critical';
  contributors: string[];
  narrative: string;
}

export interface MitigationRecommendation {
  id: string;
  action: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  rationale: string;
}

export interface SecurityAIMetrics {
  id: string;
  timestamp: Date;
  eventsProcessed: number;
  anomaliesDetected: number;
  avgThreatScore: number;
  recommendationsIssued: number;
}

export class AISecurity {
  private securityService: EnterpriseSecurityService;
  private metrics: Map<string, SecurityAIMetrics> = new Map();

  constructor(securityService: EnterpriseSecurityService) {
    this.securityService = securityService;
  }

  async detectAnomalies(events: SecurityEvent[], options?: { threshold?: number }): Promise<AnomalyDetectionResult> {
    const threshold = options?.threshold ?? 0.9; // 90th percentile heuristic
    const scores = events.map(e => this.eventRiskScore(e));
    const cutoff = this.percentile(scores, threshold);

    const anomalies = events
      .map((e, i) => ({ id: e.id, reason: this.anomalyReason(e), score: scores[i] }))
      .filter(x => x.score >= cutoff);

    const result: AnomalyDetectionResult = {
      windowStart: events.length > 0 ? events[0].timestamp : new Date(),
      windowEnd: events.length > 0 ? events[events.length - 1].timestamp : new Date(),
      totalEvents: events.length,
      anomalies,
      anomalyRate: events.length > 0 ? anomalies.length / events.length : 0,
    };

    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'ai_security_detect_anomalies',
      resource: 'ai-security',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { total: events.length, anomalies: anomalies.length },
      severity: anomalies.length > 0 ? 'high' : 'low',
    });

    return result;
  }

  async scoreThreat(events: SecurityEvent[]): Promise<ThreatScore> {
    const base = events.reduce((sum, e) => sum + this.eventRiskScore(e), 0) / Math.max(events.length, 1);
    const score = Math.round(Math.min(100, base * 20 + (events.length > 50 ? 15 : 0)));
    const level = score >= 80 ? 'critical' : score >= 60 ? 'high' : score >= 40 ? 'medium' : 'low';

    const contributors = Array.from(new Set(events.map(e => e.type)));

    const narrative = `Threat score is ${score}/100 (${level}). Notable contributors: ${contributors.join(', ') || 'none'}.`;

    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'ai_security_score_threat',
      resource: 'ai-security',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { score, level, contributors },
      severity: level === 'critical' ? 'critical' : 'medium',
    });

    return { score, level, contributors, narrative };
  }

  async recommendMitigations(score: ThreatScore): Promise<MitigationRecommendation[]> {
    const recs: MitigationRecommendation[] = [];
    if (score.level === 'critical' || score.level === 'high') {
      recs.push({ id: `mit_${Date.now()}_1`, action: 'Enable emergency pause', impact: 'high', effort: 'low', rationale: 'Stop blast radius while triaging incident' });
      recs.push({ id: `mit_${Date.now()}_2`, action: 'Rotate credentials and invalidate sessions', impact: 'high', effort: 'medium', rationale: 'Reduce account takeover risk' });
      recs.push({ id: `mit_${Date.now()}_3`, action: 'Increase logging level and enable IP/device rate limits', impact: 'medium', effort: 'low', rationale: 'Improve observability and slow down attackers' });
    } else if (score.level === 'medium') {
      recs.push({ id: `mit_${Date.now()}_4`, action: 'Require MFA for privileged actions', impact: 'high', effort: 'medium', rationale: 'Reduce privilege escalation risk' });
      recs.push({ id: `mit_${Date.now()}_5`, action: 'Add anomaly alerts to on-call rotation', impact: 'medium', effort: 'low', rationale: 'Reduce detection time' });
    } else {
      recs.push({ id: `mit_${Date.now()}_6`, action: 'Schedule periodic security review', impact: 'low', effort: 'low', rationale: 'Maintain baseline posture' });
    }

    await this.securityService.getAudit().logEvent({
      userId: 'system',
      action: 'ai_security_recommend_mitigations',
      resource: 'ai-security',
      ip: 'localhost',
      userAgent: 'system',
      metadata: { threatLevel: score.level, recommendations: recs.length },
      severity: 'low',
    });

    return recs;
  }

  async trackMetrics(processedEvents: number, detectedAnomalies: number, avgThreat: number, issuedRecommendations: number): Promise<SecurityAIMetrics> {
    const metrics: SecurityAIMetrics = {
      id: `sec_ai_metrics_${Date.now()}`,
      timestamp: new Date(),
      eventsProcessed: processedEvents,
      anomaliesDetected: detectedAnomalies,
      avgThreatScore: avgThreat,
      recommendationsIssued: issuedRecommendations,
    };

    this.metrics.set(metrics.id, metrics);
    return metrics;
  }

  private eventRiskScore(e: SecurityEvent): number {
    const base = e.severity === 'critical' ? 5 : e.severity === 'high' ? 3 : e.severity === 'medium' ? 2 : 1;
    const modifiers = [e.type === 'auth' && e.action === 'failed_login' ? 2 : 0, e.type === 'api' && e.action === 'rate_limit' ? 1.5 : 0, e.type === 'blockchain' ? 1.2 : 0];
    return base + modifiers.reduce((s, m) => s + (m as number), 0);
  }

  private percentile(values: number[], p: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const idx = Math.floor(p * (sorted.length - 1));
    return sorted[Math.max(0, Math.min(sorted.length - 1, idx))];
  }

  private anomalyReason(e: SecurityEvent): string {
    if (e.type === 'auth' && e.action === 'failed_login') return 'Failed login spike';
    if (e.type === 'api' && e.action === 'rate_limit') return 'API rate limit triggered';
    if (e.type === 'blockchain') return 'Unusual blockchain activity';
    if (e.severity === 'critical') return 'Critical severity signal';
    return 'Outlier event characteristics';
  }
}