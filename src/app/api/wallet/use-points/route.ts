import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { usePointsApi } from '@/server/api/wallet/wallet';

export async function POST(req: NextRequest) {
  return withRequestContext(req, async () => {
    const data = await req.json();
    const result = await usePointsApi(data);
    return NextResponse.json(result);
  });
}
