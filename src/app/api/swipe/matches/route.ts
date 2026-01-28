import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { getUserMatchesApi } from '@/server/api/swipe/swipe';

export async function GET(req: NextRequest) {
  return withRequestContext(req, async () => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 });
    }

    const result = await getUserMatchesApi({ userId });
    return NextResponse.json(result);
  });
}
