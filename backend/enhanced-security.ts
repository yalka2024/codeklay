import { PrismaClient } from '@prisma/client';

export class EnhancedAuditLogger {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
}
