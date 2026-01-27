// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { JwtService, JwtPayload } from './server/lib/jwt.service';

const PUBLIC_ROUTES = ['/api/auth/login', '/api/swagger', '/api/docs'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip auth for public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const payload: JwtPayload | null = JwtService.verify(token);

  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  // Pass payload via custom headers for downstream routes
  const response = NextResponse.next();
  response.headers.set('x-user-id', payload.userId);
  if (payload.role) response.headers.set('x-user-role', payload.role);

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
