/**
 * API Route: Mark Messages as Read
 * POST /api/messages/read
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { markMessagesAsReadApi } from '@/server/api/messaging/messaging';
import { getContext } from '@/context/context-store';

export async function POST(req: NextRequest) {
  return withRequestContext(req, async () => {
    const context = getContext();
    if (!context.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const body = await req.json();
      const { conversationId, messageIds } = body;

      if (!conversationId) {
        return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
      }

      const result = await markMessagesAsReadApi({
        userId: context.user.id,
        conversationId,
        messageIds,
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
