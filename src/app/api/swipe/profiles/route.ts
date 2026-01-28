import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { getPotentialProfilesApi } from '@/server/api/swipe/swipe';

export async function GET(req: NextRequest) {
  return withRequestContext(req, async () => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const limit = searchParams.get('limit');

    if (!userId) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 });
    }

    const result = await getPotentialProfilesApi({
      userId,
      limit: limit ? parseInt(limit) : 20,
    });
    return NextResponse.json(result);
  });
}
