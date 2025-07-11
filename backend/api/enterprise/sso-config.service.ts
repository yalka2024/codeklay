import { SSOProviderConfig } from './sso-config.model';

// In-memory store for demo; replace with DB in production
const ssoConfigs: SSOProviderConfig[] = [];

export class SSOConfigService {
  static getProvidersForOrg(orgId: string): SSOProviderConfig[] {
    return ssoConfigs.filter(cfg => cfg.orgId === orgId);
  }

  static addProvider(config: SSOProviderConfig) {
    ssoConfigs.push(config);
    return config;
  }

  static updateProvider(id: string, updates: Partial<SSOProviderConfig>) {
    const idx = ssoConfigs.findIndex(cfg => cfg.id === id);
    if (idx === -1) return null;
    ssoConfigs[idx] = { ...ssoConfigs[idx], ...updates, updatedAt: new Date() };
    return ssoConfigs[idx];
  }

  static removeProvider(id: string) {
    const idx = ssoConfigs.findIndex(cfg => cfg.id === id);
    if (idx === -1) return false;
    ssoConfigs.splice(idx, 1);
    return true;
  }
} 