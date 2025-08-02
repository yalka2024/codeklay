export interface AIPlugin {
  id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  // Plugin hooks
  onCodeGen?: (prompt: string, context: any) => Promise<string | undefined>;
  onReview?: (code: string, context: any) => Promise<string | undefined>;
  onChat?: (messages: any[], context: any) => Promise<string | undefined>;
  // Add more hooks as needed
}

export class PluginSystemService {
  private plugins: AIPlugin[] = [];

  register(plugin: AIPlugin) {
    if (!this.plugins.find(p => p.id === plugin.id)) {
      this.plugins.push(plugin);
    }
  }

  unregister(id: string) {
    this.plugins = this.plugins.filter(p => p.id !== id);
  }

  list(): AIPlugin[] {
    return this.plugins;
  }

  // Call all plugins for a given hook, return first non-undefined result
  async callHook(hook: keyof AIPlugin, ...args: any[]): Promise<string | undefined> {
    for (const plugin of this.plugins) {
      if (plugin.enabled && typeof plugin[hook] === 'function') {
        const result = await (plugin[hook] as any)(...args);
        if (result !== undefined) return result;
      }
    }
    return undefined;
  }
} 