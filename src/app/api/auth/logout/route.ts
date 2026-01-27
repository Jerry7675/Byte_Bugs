import { NextRequest, NextResponse } from 'next/server';
import { logoutUser } from '../../../../server/api/auth';
import { withRequestContext } from '@/context/init-request-context';

export async function POST(req: NextRequest) {
  return withRequestContext(req, async () => {
    try {
      const body = await req.json();
      const { userId, sessionId } = body;
      const result = await logoutUser({ userId, sessionId });
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  });
}
