import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { performSwipeApi } from '@/server/api/swipe/swipe';

export async function POST(req: NextRequest) {
  return withRequestContext(req, async () => {
    const data = await req.json();
    const result = await performSwipeApi(data);
    return NextResponse.json(result);
  });
}
