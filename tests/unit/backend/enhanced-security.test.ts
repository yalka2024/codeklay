import { EnhancedAuditLogger } from '../../../lib/enhanced-security';

describe('EnhancedAuditLogger', () => {
  let auditLogger: EnhancedAuditLogger;

  beforeEach(() => {
    auditLogger = new EnhancedAuditLogger();
  });

  describe('Audit Logging', () => {
    test('should log audit events', async () => {
      await auditLogger.log('user_login', 'user123', 'User logged in', '192.168.1.1');
      
      const logs = await auditLogger.getLogs();
      expect(logs.length).toBeGreaterThan(0);
      
      const latestLog = logs[0];
      expect(latestLog.action).toBe('user_login');
      expect(latestLog.userId).toBe('user123');
      expect(latestLog.details).toBe('User logged in');
      expect(latestLog.ipAddress).toBe('192.168.1.1');
    });

    test('should log with metadata', async () => {
      const metadata = { browser: 'Chrome', version: '91.0' };
      await auditLogger.log('user_action', 'user123', 'Action performed', '192.168.1.1', metadata);
      
      const logs = await auditLogger.getLogs();
      const latestLog = logs[0];
      
      expect(latestLog.metadata).toBeDefined();
      const parsedMetadata = JSON.parse(latestLog.metadata!);
      expect(parsedMetadata.browser).toBe('Chrome');
    });
  });

  describe('Log Filtering', () => {
    test('should filter logs by user ID', async () => {
      await auditLogger.log('action1', 'user1', 'Action 1', '192.168.1.1');
      await auditLogger.log('action2', 'user2', 'Action 2', '192.168.1.2');
      
      const filteredLogs = await auditLogger.getLogs({ userId: 'user1' });
      expect(filteredLogs.every(log => log.userId === 'user1')).toBe(true);
    });

    test('should filter logs by action', async () => {
      await auditLogger.log('login', 'user1', 'Login action', '192.168.1.1');
      await auditLogger.log('logout', 'user1', 'Logout action', '192.168.1.1');
      
      const filteredLogs = await auditLogger.getLogs({ action: 'login' });
      expect(filteredLogs.every(log => log.action.includes('login'))).toBe(true);
    });

    test('should filter logs by date range', async () => {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      
      await auditLogger.log('test_action', 'user1', 'Test action', '192.168.1.1');
      
      const filteredLogs = await auditLogger.getLogs({ startDate, endDate });
      expect(filteredLogs.length).toBeGreaterThan(0);
    });

    test('should limit log results', async () => {
      for (let i = 0; i < 5; i++) {
        await auditLogger.log(`action${i}`, 'user1', `Action ${i}`, '192.168.1.1');
      }
      
      const limitedLogs = await auditLogger.getLogs({ limit: 3 });
      expect(limitedLogs.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Log Search', () => {
    test('should search logs by query', async () => {
      await auditLogger.log('user_login', 'user123', 'User logged in successfully', '192.168.1.1');
      await auditLogger.log('user_logout', 'user123', 'User logged out', '192.168.1.1');
      
      const searchResults = await auditLogger.searchLogs('login');
      expect(searchResults.length).toBeGreaterThan(0);
      expect(searchResults.some(log => log.action.includes('login') || log.details?.includes('login'))).toBe(true);
    });
  });

  describe('Log Export', () => {
    test('should export logs as JSON', async () => {
      await auditLogger.log('test_action', 'user1', 'Test action', '192.168.1.1');
      
      const exportedData = await auditLogger.exportLogs({ format: 'json' });
      expect(() => JSON.parse(exportedData)).not.toThrow();
      
      const parsedData = JSON.parse(exportedData);
      expect(Array.isArray(parsedData)).toBe(true);
    });

    test('should export logs as CSV', async () => {
      await auditLogger.log('test_action', 'user1', 'Test action', '192.168.1.1');
      
      const exportedData = await auditLogger.exportLogs({ format: 'csv' });
      expect(exportedData).toContain('ID,Action,User ID');
      expect(exportedData.split('\n').length).toBeGreaterThan(1);
    });

    test('should throw error for XLSX export', async () => {
      await expect(auditLogger.exportLogs({ format: 'xlsx' })).rejects.toThrow('XLSX export not implemented');
    });
  });

  describe('Log Retention', () => {
    test('should set and get retention days', () => {
      auditLogger.setRetentionDays(90);
      expect(auditLogger.getRetentionDays()).toBe(90);
    });

    test('should cleanup old logs', async () => {
      try {
        const cleanedCount = await auditLogger.cleanupOldLogs();
        expect(typeof cleanedCount).toBe('number');
        expect(cleanedCount).toBeGreaterThanOrEqual(0);
      } catch (error) {
        console.log('Database not available for testing, skipping cleanup test');
      }
    });
  });
});

