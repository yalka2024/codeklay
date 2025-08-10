import { EnterpriseSecurityService } from './enterprise-security';

export type ServiceCategory =
  | 'api'
  | 'ai'
  | 'quantum'
  | 'blockchain'
  | 'edge'
  | 'iot'
  | 'analytics'
  | 'infra';

export interface RegisteredService {
  id: string;
  name: string;
  version: string;
  category: ServiceCategory;
  endpoint?: string;
  registeredAt: Date;
  lastHealth?: ServiceHealth;
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  latencyMs: number;
  timestamp: Date;
  notes?: string;
}

export interface ConfigValidationResult {
  ok: boolean;
  missingKeys: string[];
  invalidValues: string[];
  timestamp: Date;
}

export interface ReadinessReport {
  timestamp: Date;
  totalServices: number;
  healthyServices: number;
  degradedServices: number;
  unhealthyServices: number;
  requiredEnvPresent: boolean;
  missingEnvKeys: string[];
}

export class FinalIntegration {
  private auditFactory: EnterpriseSecurityService['getAudit'];
  private services: Map<string, RegisteredService> = new Map();
  private lastConfigValidation: ConfigValidationResult | null = null;

  constructor(securityService: EnterpriseSecurityService) {
    this.auditFactory = securityService.getAudit.bind(securityService);
  }

  async registerService(
    name: string,
    version: string,
    category: ServiceCategory,
    endpoint?: string
  ): Promise<RegisteredService> {
    const id = `svc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const svc: RegisteredService = {
      id,
      name,
      version,
      category,
      endpoint,
      registeredAt: new Date(),
    };
    this.services.set(id, svc);

    await (await this.auditFactory()).logEvent({
      userId: 'system',
      action: 'final_integration_register_service',
      resource: 'final-integration',
      ip: '127.0.0.1',
      userAgent: 'system',
      metadata: { id, name, version, category, endpoint },
      severity: 'low',
    });

    return svc;
  }

  async runHealthChecks(): Promise<{ services: RegisteredService[]; summary: ReadinessReport }> {
    const now = new Date();
    const updated: RegisteredService[] = [];

    for (const svc of this.services.values()) {
      // Lightweight synthetic health check (can be extended to do fetches to svc.endpoint)
      const simulatedLatency = Math.round(20 + Math.random() * 60);
      const status: ServiceHealth['status'] = simulatedLatency < 50 ? 'healthy' : simulatedLatency < 120 ? 'degraded' : 'unhealthy';
      const health: ServiceHealth = { status, latencyMs: simulatedLatency, timestamp: now };
      const merged: RegisteredService = { ...svc, lastHealth: health };
      this.services.set(svc.id, merged);
      updated.push(merged);

      await (await this.auditFactory()).logEvent({
        userId: 'system',
        action: 'final_integration_health_check',
        resource: 'final-integration',
        ip: '127.0.0.1',
        userAgent: 'system',
        metadata: { id: svc.id, name: svc.name, status: health.status, latencyMs: health.latencyMs },
        severity: health.status === 'healthy' ? 'low' : health.status === 'degraded' ? 'medium' : 'high',
      });
    }

    const summary = this.generateReadinessReportInternal();
    return { services: updated, summary };
  }

  async validateConfiguration(env: Record<string, string | undefined>): Promise<ConfigValidationResult> {
    const requiredKeys = [
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'DATABASE_URL',
      // Add more as your deployment requires
    ];

    const missingKeys: string[] = [];
    const invalidValues: string[] = [];

    for (const key of requiredKeys) {
      const val = env[key];
      if (!val) missingKeys.push(key);
      else if (key === 'NEXTAUTH_URL' && !/^https?:\/\//.test(val)) invalidValues.push(key);
      else if (key === 'NEXTAUTH_SECRET' && val.length < 16) invalidValues.push(key);
    }

    const ok = missingKeys.length === 0 && invalidValues.length === 0;
    const result: ConfigValidationResult = { ok, missingKeys, invalidValues, timestamp: new Date() };
    this.lastConfigValidation = result;

    await (await this.auditFactory()).logEvent({
      userId: 'system',
      action: 'final_integration_validate_config',
      resource: 'final-integration',
      ip: '127.0.0.1',
      userAgent: 'system',
      metadata: { ok, missingKeys, invalidValues },
      severity: ok ? 'low' : 'high',
    });

    return result;
  }

  async generateReadinessReport(env?: Record<string, string | undefined>): Promise<ReadinessReport> {
    if (env) await this.validateConfiguration(env);
    return this.generateReadinessReportInternal();
  }

  getServices(): RegisteredService[] {
    return Array.from(this.services.values());
  }

  private generateReadinessReportInternal(): ReadinessReport {
    const healthCounts = { healthy: 0, degraded: 0, unhealthy: 0 };
    for (const svc of this.services.values()) {
      const st = svc.lastHealth?.status || 'degraded';
      if (st === 'healthy') healthCounts.healthy += 1;
      else if (st === 'degraded') healthCounts.degraded += 1;
      else healthCounts.unhealthy += 1;
    }

    const missing = this.lastConfigValidation?.missingKeys ?? [];
    const invalid = this.lastConfigValidation?.invalidValues ?? [];
    const requiredEnvPresent = (this.lastConfigValidation?.ok ?? true) && missing.length === 0 && invalid.length === 0;

    return {
      timestamp: new Date(),
      totalServices: this.services.size,
      healthyServices: healthCounts.healthy,
      degradedServices: healthCounts.degraded,
      unhealthyServices: healthCounts.unhealthy,
      requiredEnvPresent,
      missingEnvKeys: [...missing, ...invalid],
    };
  }
}