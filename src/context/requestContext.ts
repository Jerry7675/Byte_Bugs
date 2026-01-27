import { PrismaClient } from '../lib/prisma.type';

export interface RequestContext {
  requestId: string;
  user?: {
    id: string;
    role: string;
  };
  db: PrismaClient;
}
