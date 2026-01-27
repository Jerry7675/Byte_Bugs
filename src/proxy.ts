import { NextRequest, NextResponse } from 'next/server';
import { JwtService, JwtPayload } from './server/lib/jwt.service';

const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/otp',
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip auth for public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  let accessToken: string | null = null;
  let payload: JwtPayload | null = null;

  // Try to get access token from cookies
  accessToken = req.cookies.get('accessToken')?.value || null;
  if (accessToken) {
    payload = JwtService.verify(accessToken);
  }

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Pass payload via custom headers for downstream routes
  const response = NextResponse.next();
  response.headers.set('x-user-id', payload.id);
  if (payload.role) response.headers.set('x-user-role', payload.role);

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
