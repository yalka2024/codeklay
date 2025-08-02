import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://test:test@localhost:5432/testdb',
    },
  },
});

export default async function globalSetup() {
  try {
    await prisma.$connect();
    console.log('Test database connected successfully');
    
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Global setup failed:', error);
    process.exit(1);
  }
}
