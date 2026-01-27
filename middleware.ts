import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret';

//auth for /api
export async function middleware(req: NextRequest) {
  // Allow unauthenticated access to login route
  if (req.nextUrl.pathname === '/api/auth/login' || req.nextUrl.pathname === '/api/swagger-ui') {
    return NextResponse.next();
  }
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const jwtToken = authHeader.slice(7);
  try {
    jwt.verify(jwtToken, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
