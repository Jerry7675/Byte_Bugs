import { prisma } from '@/lib/prisma';

export interface RequestContext {
  prisma: typeof prisma;
  user?: {
    id: string;
    role: string;
    email?: string;
  };
  requestId: string;
}
