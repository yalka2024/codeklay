import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://test:test@localhost:5432/testdb',
    },
  },
});

export default async function globalTeardown() {
  try {
    await prisma.$connect();
    console.log('Cleaning up test database');
    await prisma.$disconnect();
  } catch (error) {
    console.error('Global teardown failed:', error);
  }
}
