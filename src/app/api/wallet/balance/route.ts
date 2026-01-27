import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { getWalletBalanceApi } from '@/server/api/wallet/wallet';

export async function GET(req: NextRequest) {
  return withRequestContext(req, async () => {
    const url = new URL(req.url);
    const userId = url.searchParams.get('user_id');
    const result = await getWalletBalanceApi({ userId });
    return NextResponse.json(result);
  });
}
