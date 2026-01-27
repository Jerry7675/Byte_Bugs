import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JwtService } from '@/server/lib/jwt.service';
import { contextStore } from './context-store';
import type { RequestContext } from './request-context';
import { randomUUID } from 'crypto';

export async function withRequestContext(req: NextRequest, handler: () => Promise<Response>) {
  let user: RequestContext['user'];

  const token =
    req.cookies.get('accessToken')?.value ||
    req.headers.get('authorization')?.replace('Bearer ', '');

  if (token) {
    const payload = JwtService.verify(token);
    if (payload?.id && payload?.role) {
      user = {
        id: payload.id,
        role: payload.role,
        email: payload.email,
      };
    }
  }

  const ctx: RequestContext = {
    prisma,
    user,
    requestId: randomUUID(),
  };

  return contextStore.run(ctx, handler);
}
