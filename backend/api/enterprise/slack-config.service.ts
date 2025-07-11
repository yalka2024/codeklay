// In-memory store for demo; replace with DB in production
const slackConfigs: any[] = [];

export class SlackConfigService {
  static getConfigForOrg(orgId: string) {
    return slackConfigs.find(cfg => cfg.orgId === orgId) || null;
  }
  static addConfig(config: any) {
    slackConfigs.push(config);
    return config;
  }
  static updateConfig(id: string, updates: Partial<any>) {
    const idx = slackConfigs.findIndex(cfg => cfg.id === id);
    if (idx === -1) return null;
    slackConfigs[idx] = { ...slackConfigs[idx], ...updates, updatedAt: new Date() };
    return slackConfigs[idx];
  }
  static removeConfig(id: string) {
    const idx = slackConfigs.findIndex(cfg => cfg.id === id);
    if (idx === -1) return false;
    slackConfigs.splice(idx, 1);
    return true;
  }
} 