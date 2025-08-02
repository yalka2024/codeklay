import { PluginSystemService, AIPlugin } from '../@backend/api/ai/plugin-system.service';

describe('PluginSystemService', () => {
  let pluginService: PluginSystemService;

  beforeEach(() => {
    pluginService = new PluginSystemService();
  });

  describe('Plugin Registration', () => {
    test('should register a valid plugin', () => {
      const plugin: AIPlugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        description: 'A test plugin',
        version: '1.0.0',
        enabled: true,
        onCodeGen: async () => 'test result'
      };

      expect(() => pluginService.register(plugin)).not.toThrow();
      expect(pluginService.list()).toHaveLength(1);
      expect(pluginService.list()[0].id).toBe('test-plugin');
    });

    test('should not register duplicate plugins', () => {
      const plugin: AIPlugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        description: 'A test plugin',
        version: '1.0.0',
        enabled: true
      };

      pluginService.register(plugin);
      pluginService.register(plugin);
      
      expect(pluginService.list()).toHaveLength(1);
    });

    test('should unregister plugins', () => {
      const plugin: AIPlugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        description: 'A test plugin',
        version: '1.0.0',
        enabled: true
      };

      pluginService.register(plugin);
      expect(pluginService.list()).toHaveLength(1);
      
      pluginService.unregister('test-plugin');
      expect(pluginService.list()).toHaveLength(0);
    });
  });

  describe('Plugin Execution', () => {
    test('should call plugin hooks', async () => {
      const mockHook = jest.fn().mockResolvedValue('test result');
      const plugin: AIPlugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        description: 'A test plugin',
        version: '1.0.0',
        enabled: true,
        onCodeGen: mockHook
      };

      pluginService.register(plugin);
      const result = await pluginService.callHook('onCodeGen', 'test prompt', {});
      
      expect(mockHook).toHaveBeenCalledWith('test prompt', {});
      expect(result).toBe('test result');
    });

    test('should skip disabled plugins', async () => {
      const mockHook = jest.fn().mockResolvedValue('test result');
      const plugin: AIPlugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        description: 'A test plugin',
        version: '1.0.0',
        enabled: false,
        onCodeGen: mockHook
      };

      pluginService.register(plugin);
      const result = await pluginService.callHook('onCodeGen', 'test prompt', {});
      
      expect(mockHook).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    test('should return first non-undefined result', async () => {
      const plugin1: AIPlugin = {
        id: 'plugin-1',
        name: 'Plugin 1',
        description: 'First plugin',
        version: '1.0.0',
        enabled: true,
        onCodeGen: async () => undefined
      };

      const plugin2: AIPlugin = {
        id: 'plugin-2',
        name: 'Plugin 2',
        description: 'Second plugin',
        version: '1.0.0',
        enabled: true,
        onCodeGen: async () => 'second result'
      };

      const plugin3: AIPlugin = {
        id: 'plugin-3',
        name: 'Plugin 3',
        description: 'Third plugin',
        version: '1.0.0',
        enabled: true,
        onCodeGen: async () => 'third result'
      };

      pluginService.register(plugin1);
      pluginService.register(plugin2);
      pluginService.register(plugin3);
      
      const result = await pluginService.callHook('onCodeGen', 'test prompt', {});
      expect(result).toBe('second result');
    });
  });

  describe('Plugin Security', () => {
    test('should scan plugin security', async () => {
      const plugin: AIPlugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        description: 'A test plugin',
        version: '1.0.0',
        enabled: true
      };

      pluginService.register(plugin);
      const scanResult = await pluginService.scanPluginSecurity('test-plugin');
      
      expect(scanResult).toHaveProperty('safe');
      expect(scanResult).toHaveProperty('issues');
      expect(Array.isArray(scanResult.issues)).toBe(true);
    });

    test('should return error for non-existent plugin', async () => {
      const scanResult = await pluginService.scanPluginSecurity('non-existent');
      
      expect(scanResult.safe).toBe(false);
      expect(scanResult.issues).toContain('Plugin not found');
    });
  });

  describe('Sandbox Configuration', () => {
    test('should update sandbox configuration', () => {
      const newConfig = {
        timeoutMs: 10000,
        allowedModules: ['lodash', 'moment']
      };

      pluginService.setSandboxConfig(newConfig);
      const config = pluginService.getSandboxConfig();
      
      expect(config.timeoutMs).toBe(10000);
      expect(config.allowedModules).toEqual(['lodash', 'moment']);
    });

    test('should get current sandbox configuration', () => {
      const config = pluginService.getSandboxConfig();
      
      expect(config).toHaveProperty('timeoutMs');
      expect(config).toHaveProperty('memoryLimitMB');
      expect(config).toHaveProperty('allowedModules');
      expect(config).toHaveProperty('maxExecutionTime');
    });
  });
});

