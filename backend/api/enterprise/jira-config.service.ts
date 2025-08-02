// In-memory store for demo; replace with DB in production
const jiraConfigs: any[] = [];

export class JiraConfigService {
  static getConfigForOrg(orgId: string) {
    return jiraConfigs.find(cfg => cfg.orgId === orgId) || null;
  }
  static addConfig(config: any) {
    jiraConfigs.push(config);
    return config;
  }
  static updateConfig(id: string, updates: Partial<any>) {
    const idx = jiraConfigs.findIndex(cfg => cfg.id === id);
    if (idx === -1) return null;
    jiraConfigs[idx] = { ...jiraConfigs[idx], ...updates, updatedAt: new Date() };
    return jiraConfigs[idx];
  }
  static removeConfig(id: string) {
    const idx = jiraConfigs.findIndex(cfg => cfg.id === id);
    if (idx === -1) return false;
    jiraConfigs.splice(idx, 1);
    return true;
  }
} 