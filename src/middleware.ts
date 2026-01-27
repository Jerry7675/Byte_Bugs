import { NextRequest, NextResponse } from 'next/server';
import { JwtService, JwtPayload } from './server/lib/jwt.service';

const PUBLIC_ROUTES = ['/api/auth/login', '/api/swagger', '/api/docs'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip auth for public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  let accessToken: string | null = null;
  let payload: JwtPayload | null = null;

  // Try to get access token from Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    accessToken = authHeader.slice(7);
    payload = JwtService.verify(accessToken);
  }

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
