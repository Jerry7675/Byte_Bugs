/**
 * API Route: Get Conversations
 * GET /api/conversations
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { getConversationsApi } from '@/server/api/messaging/messaging';
import { getContext } from '@/context/context-store';

export async function GET(req: NextRequest) {
  return withRequestContext(req, async () => {
    const context = getContext();
    if (!context.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const result = await getConversationsApi({
        userId: context.user.id,
      });

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(result);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 },
      );
    }
  });
}
