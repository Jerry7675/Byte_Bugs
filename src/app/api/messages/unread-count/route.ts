/**
 * GET /api/messages/unread-count
 * Get count of unread messages for current user
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { getContext } from '@/context/context-store';

export async function GET(req: NextRequest) {
  return withRequestContext(req, async () => {
    const context = getContext();
    if (!context.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { prisma } = getContext();

      // Count unread messages in all user's conversations
      const unreadCount = await prisma.message.count({
        where: {
          conversation: {
            OR: [{ requesterId: context.user.id }, { receiverId: context.user.id }],
          },
          senderId: { not: context.user.id },
          isRead: false,
          isExpired: false,
        },
      });

      return NextResponse.json({ success: true, data: { count: unreadCount } });
    } catch (error: any) {
      console.error('Get unread count error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  });
}
