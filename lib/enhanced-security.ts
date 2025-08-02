import { PrismaClient } from '@prisma/client';

export interface AuditLog {
  id: string;
  action: string;
  userId?: string;
  details?: string;
  timestamp: Date;
  ipAddress: string;
  metadata?: string;
}

export interface AuditLogFilter {
  userId?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  ipAddress?: string;
  limit?: number;
  offset?: number;
}

export interface AuditLogExportOptions {
  format: 'json' | 'csv' | 'xlsx';
  filter?: AuditLogFilter;
  includeMetadata?: boolean;
}

export class EnhancedAuditLogger {
  private logs: AuditLog[] = [];
  private prisma: PrismaClient;
  private retentionDays: number = 365;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async log(action: string, userId?: string, details?: string, ipAddress?: string, metadata?: any) {
    const auditLog: AuditLog = {
      id: Date.now().toString(),
      action,
      userId,
      details,
      timestamp: new Date(),
      ipAddress: ipAddress || 'unknown',
      metadata: metadata ? JSON.stringify(metadata) : undefined
    };
    
    this.logs.push(auditLog);
    
    try {
      await this.prisma.auditLog.create({
        data: {
          action,
          userId,
          details,
          ipAddress: ipAddress || 'unknown',
          metadata: metadata ? JSON.stringify(metadata) : undefined,
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('Failed to persist audit log:', error);
    }
    
    console.log('Audit Log:', auditLog);
  }

  async getLogs(filter?: AuditLogFilter): Promise<AuditLog[]> {
    try {
      const where: any = {};
      
      if (filter?.userId) where.userId = filter.userId;
      if (filter?.action) where.action = { contains: filter.action };
      if (filter?.ipAddress) where.ipAddress = filter.ipAddress;
      if (filter?.startDate || filter?.endDate) {
        where.timestamp = {};
        if (filter.startDate) where.timestamp.gte = filter.startDate;
        if (filter.endDate) where.timestamp.lte = filter.endDate;
      }

      const logs = await this.prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: filter?.limit || 100,
        skip: filter?.offset || 0
      });

      return logs.map(log => ({
        id: log.id,
        action: log.action,
        userId: log.userId || undefined,
        details: log.details || undefined,
        timestamp: log.timestamp,
        ipAddress: log.ipAddress,
        metadata: log.metadata
      }));
    } catch (error) {
      console.error('Failed to retrieve audit logs:', error);
      return this.logs.filter(log => {
        if (filter?.userId && log.userId !== filter.userId) return false;
        if (filter?.action && !log.action.includes(filter.action)) return false;
        if (filter?.ipAddress && log.ipAddress !== filter.ipAddress) return false;
        if (filter?.startDate && log.timestamp < filter.startDate) return false;
        if (filter?.endDate && log.timestamp > filter.endDate) return false;
        return true;
      }).slice(filter?.offset || 0, (filter?.offset || 0) + (filter?.limit || 100));
    }
  }

  async searchLogs(query: string, filter?: AuditLogFilter): Promise<AuditLog[]> {
    try {
      const where: any = {
        OR: [
          { action: { contains: query } },
          { details: { contains: query } },
          { userId: { contains: query } }
        ]
      };

      if (filter?.userId) where.userId = filter.userId;
      if (filter?.startDate || filter?.endDate) {
        where.timestamp = {};
        if (filter.startDate) where.timestamp.gte = filter.startDate;
        if (filter.endDate) where.timestamp.lte = filter.endDate;
      }

      const logs = await this.prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: filter?.limit || 100,
        skip: filter?.offset || 0
      });

      return logs.map(log => ({
        id: log.id,
        action: log.action,
        userId: log.userId || undefined,
        details: log.details || undefined,
        timestamp: log.timestamp,
        ipAddress: log.ipAddress,
        metadata: log.metadata
      }));
    } catch (error) {
      console.error('Failed to search audit logs:', error);
      return [];
    }
  }

  async exportLogs(options: AuditLogExportOptions): Promise<string> {
    const logs = await this.getLogs(options.filter);
    
    switch (options.format) {
      case 'json':
        return JSON.stringify(logs, null, 2);
      case 'csv':
        return this.convertToCSV(logs);
      case 'xlsx':
        return this.convertToXLSX(logs);
      default:
        throw new Error('Unsupported export format');
    }
  }

  private convertToCSV(logs: AuditLog[]): string {
    if (logs.length === 0) return '';
    
    const headers = ['ID', 'Action', 'User ID', 'Details', 'Timestamp', 'IP Address'];
    const csvRows = [headers.join(',')];
    
    logs.forEach(log => {
      const row = [
        log.id,
        log.action,
        log.userId || '',
        (log.details || '').replace(/,/g, ';'),
        log.timestamp.toISOString(),
        log.ipAddress
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  private convertToXLSX(logs: AuditLog[]): string {
    throw new Error('XLSX export not implemented - requires additional dependencies');
  }

  async cleanupOldLogs(): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);

      const result = await this.prisma.auditLog.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate
          }
        }
      });

      console.log(`Cleaned up ${result.count} old audit logs`);
      return result.count;
    } catch (error) {
      console.error('Failed to cleanup old audit logs:', error);
      return 0;
    }
  }

  setRetentionDays(days: number) {
    this.retentionDays = days;
  }

  getRetentionDays(): number {
    return this.retentionDays;
  }
}
