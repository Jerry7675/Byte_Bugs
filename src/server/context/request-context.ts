import type { PrismaClient /* Session, User */ } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

export interface RequestContext {
  prisma: PrismaClient;
  // session: Session | null;
  // user: User | null;
}

/**
 * Looks up a session and user by access token.
 * Returns nulls if not found or invalid.
 */
export async function getSessionAndUserByToken(
  token: string,
): Promise<{ message: string /*session: Session | null; user: User | null }*/ }> {
  // if (!token) return { session: null, user: null };
  // const session = await prisma.session.findUnique({
  //   where: { accessToken: token },
  //   include: { user: true },
  // });
  // if (!session || !session.user) return { session: null, user: null };
  // return { session, user: session.user };
  return { message: 'Function not implemented' /*session: null, user: null */ };
}

// Factory for request context
export async function createRequestContext(token?: string): Promise<RequestContext> {
  // let session: Session | null = null;
  // let user: User | null = null;
  if (token) {
    const result = await getSessionAndUserByToken(token);
    // session = result.session;
    // user = result.user;
  }
  return {
    prisma,
    // session,
    // user,
  };
}
