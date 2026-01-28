import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { undoLastSkipApi } from '@/server/api/swipe/swipe';

export async function POST(req: NextRequest) {
  return withRequestContext(req, async () => {
    try {
      const data = await req.json();

      if (!data.userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
      }

      const result = await undoLastSkipApi(data);
      return NextResponse.json(result);
    } catch (error: any) {
      return NextResponse.json({ error: error.message || 'Failed to undo' }, { status: 500 });
    }
  });
}
