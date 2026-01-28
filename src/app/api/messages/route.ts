/**
 * API Route: Get Messages
 * GET /api/messages?conversationId=xxx&limit=50&before=xxx
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { getMessagesApi } from '@/server/api/messaging/messaging';
import { getContext } from '@/context/context-store';

export async function GET(req: NextRequest) {
  return withRequestContext(req, async () => {
    const context = getContext();
    if (!context.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { searchParams } = new URL(req.url);
      const conversationId = searchParams.get('conversationId');
      const limit = searchParams.get('limit');
      const before = searchParams.get('before');

      if (!conversationId) {
        return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
      }

      const result = await getMessagesApi({
        userId: context.user.id,
        conversationId,
        limit: limit ? parseInt(limit, 10) : undefined,
        before: before || undefined,
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
