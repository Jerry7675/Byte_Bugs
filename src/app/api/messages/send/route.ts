/**
 * API Route: Send Message
 * POST /api/messages/send
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { sendMessageApi } from '@/server/api/messaging/messaging';
import { getContext } from '@/context/context-store';

export async function POST(req: NextRequest) {
  return withRequestContext(req, async () => {
    const context = getContext();
    if (!context.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const body = await req.json();
      const { conversationId, content, expirationHours } = body;

      if (!conversationId || !content) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const result = await sendMessageApi({
        userId: context.user.id,
        conversationId,
        content,
        expirationHours,
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
