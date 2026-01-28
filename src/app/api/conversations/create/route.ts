/**
 * API Route: Create Conversation
 * POST /api/conversations/create
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { createConversationApi } from '@/server/api/messaging/messaging';
import { getContext } from '@/context/context-store';

export async function POST(req: NextRequest) {
  return withRequestContext(req, async () => {
    const context = getContext();
    if (!context.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const body = await req.json();
      const { receiverId, pointsCost } = body;

      if (!receiverId) {
        return NextResponse.json({ error: 'receiverId is required' }, { status: 400 });
      }

      const result = await createConversationApi({
        requesterId: context.user.id,
        receiverId,
        pointsCost,
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
