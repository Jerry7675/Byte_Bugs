import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { getWalletTransactionsApi } from '@/server/api/wallet/wallet';

export async function GET(req: NextRequest) {
  return withRequestContext(req, async () => {
    const url = new URL(req.url);
    const userId = url.searchParams.get('user_id');
    const filters = {
      type: url.searchParams.get('type'),
      date: url.searchParams.get('date'),
      source: url.searchParams.get('source'),
    };
    const result = await getWalletTransactionsApi({ userId, ...filters });
    return NextResponse.json(result);
  });
}
