# Real-Time Messaging System - Setup Guide

## Overview

A complete real-time messaging system with:

- WebSocket-based real-time delivery
- Disappearing messages (user-defined expiration, min 1 hour)
- Daily free quota (20 messages/day/user)
- Points deduction after quota exceeded
- Login-time cleanup of expired messages
- NO background timers or cron jobs

## Prerequisites

1. Install required dependencies:

```bash
pnpm add ws @types/ws date-fns
pnpm add -D tsx
```

## Database Migration

1. Create a new migration:

```bash
pnpm prisma migrate dev --name add_messaging_features
```

This will:

- Add `expiresAt`, `isExpired`, `isRead`, `readAt` fields to Message model
- Create MessageQuota model for daily quota tracking
- Add proper indexes for performance

## Server Configuration

### 1. Update package.json Scripts

Replace your current dev/start scripts with:

```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "next build",
    "start": "NODE_ENV=production tsx server.ts"
  }
}
```

### 2. Environment Variables (optional)

No new environment variables needed. The system uses existing:

- `DATABASE_URL` - PostgreSQL connection
- `APP_SALT` - For password hashing
- `JWT_SECRET` - For WebSocket authentication

## File Structure

### Created Files:

**Services:**

- `src/server/services/messaging/messaging.service.ts` - Core business logic
- `src/server/services/messaging/index.ts` - Service exports

**WebSocket:**

- `src/server/lib/websocket-server.ts` - WebSocket server implementation
- `server.ts` - Custom server entry point

**API Routes:**

- `src/app/api/messages/route.ts` - GET messages
- `src/app/api/messages/send/route.ts` - POST send message
- `src/app/api/messages/read/route.ts` - POST mark as read
- `src/app/api/messages/quota/route.ts` - GET quota status
- `src/app/api/conversations/route.ts` - GET conversations
- `src/app/api/conversations/create/route.ts` - POST create conversation
- `src/server/api/messaging/messaging.ts` - Server-side API functions

**Client:**

- `src/client/api/messaging-api.ts` - Client API calls
- `src/client/hooks/useMessaging.ts` - React hooks

**UI Components:**

- `src/components/messaging/ChatInterface.tsx` - Main chat view
- `src/components/messaging/ConversationsList.tsx` - Conversations sidebar
- `src/components/messaging/QuotaDisplay.tsx` - Quota status display
- `src/app/(main)/messages/page.tsx` - Messages page

**Modified Files:**

- `prisma/schema.prisma` - Extended with messaging features
- `src/server/services/auth/authService.ts` - Added login cleanup hook

## How It Works

### 1. Message Sending Flow

```
User sends message → API validates quota → Checks points if needed →
Saves to DB → Broadcasts via WebSocket → Updates local state
```

### 2. Quota Management

- Each user gets 20 FREE messages per day
- After free limit, 10 points deducted per message
- Quota resets automatically at midnight (no cron needed)
- Quota checked on each message send

### 3. Disappearing Messages

- User can set expiration (min 1 hour)
- Stored as absolute timestamp in DB
- Messages marked as expired on:
  - User login (cleanup hook)
  - Message fetch (filtered out)
- NO background timers/workers

### 4. Real-Time Delivery

- WebSocket connection authenticated via JWT token
- Users join conversation "rooms"
- Messages broadcast to all participants
- Automatic reconnection on disconnect

## Usage Examples

### Start a Conversation

```typescript
import { createConversation } from '@/client/api/messaging-api';

const result = await createConversation({
  receiverId: 'user-123',
  pointsCost: 0,
});
```

### Send a Message

```typescript
import { sendMessage } from '@/client/api/messaging-api';

// Regular message
await sendMessage({
  conversationId: 'conv-123',
  content: 'Hello!',
});

// Disappearing message
await sendMessage({
  conversationId: 'conv-123',
  content: 'This will expire',
  expirationHours: 24, // Expires in 24 hours
});
```

### Use in React Components

```typescript
import { useMessages } from '@/client/hooks/useMessaging';

function ChatView({ conversationId, token, userId }) {
  const { messages, sendMessage, loading } = useMessages(conversationId, token);

  // Messages auto-update via WebSocket
  // Send with: await sendMessage('Hello!', 24);
}
```

## API Endpoints

### Messages

- `GET /api/messages?conversationId={id}&limit={n}&before={msgId}` - Fetch messages
- `POST /api/messages/send` - Send message
- `POST /api/messages/read` - Mark as read
- `GET /api/messages/quota` - Get quota status

### Conversations

- `GET /api/conversations` - Get all conversations
- `POST /api/conversations/create` - Create new conversation

### WebSocket

- `ws://localhost:3000/api/ws/messages?token={jwt}` - Real-time connection

## Running the Application

1. Generate Prisma client (already done):

```bash
pnpm prisma generate
```

2. Run migrations:

```bash
pnpm prisma migrate dev
```

3. Start development server:

```bash
pnpm dev
```

The server will start at `http://localhost:3000` with WebSocket support at `ws://localhost:3000/api/ws/messages`

## Important Notes

### Security

- All quota/points logic is server-side only
- WebSocket connections require JWT authentication
- User can only access their own conversations
- Messages validated for length (max 5000 chars)

### Performance

- Indexes added for: conversationId, expiresAt, senderId
- Messages paginated (50 per page)
- WebSocket reconnection handles temporary disconnects

### Quota System

- Resets automatically by date comparison (no cron)
- Points deducted atomically with message creation
- Transaction ensures consistency

### Expiration System

- Cleanup on user login (passive)
- Filtered on fetch (never return expired)
- Soft delete (isExpired flag) preserves history

## Testing

### Test Message Quota

1. Send 20 messages (should be free)
2. 21st message should require points
3. Check quota: `GET /api/messages/quota`

### Test Disappearing Messages

1. Send message with `expirationHours: 1`
2. Wait 1+ hours
3. Login again - message should be marked expired
4. Fetch messages - expired message not returned

### Test Real-Time

1. Open two browser windows
2. Login as different users in each
3. Start conversation
4. Send message from one
5. Should appear instantly in other window

## Troubleshooting

### WebSocket not connecting

- Check that `server.ts` is being used (not `next dev`)
- Verify JWT token is valid
- Check browser console for errors

### Messages not appearing

- Check WebSocket connection status
- Verify user is participant in conversation
- Check API response for errors

### Quota not working

- Verify PointsWallet exists for user
- Check transaction logs in database
- Ensure quota date is being reset

## TODO for Production

1. Add message encryption (at rest and in transit)
2. Add file/image attachment support
3. Add typing indicators persistence
4. Add message search functionality
5. Add conversation archiving
6. Add push notifications for offline users
7. Add rate limiting for message sending
8. Add WebSocket connection pooling/clustering
9. Consider Redis for WebSocket scaling
10. Add message delivery status (sent/delivered/read)

## Schema Reference

### Message Model

```prisma
model Message {
  id             String        @id @default(uuid())
  conversationId String
  senderId       String
  content        String
  expiresAt      DateTime?     // Optional expiration
  isExpired      Boolean       @default(false)
  isRead         Boolean       @default(false)
  readAt         DateTime?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}
```

### MessageQuota Model

```prisma
model MessageQuota {
  id                String   @id @default(uuid())
  userId            String   @unique
  messagesSentToday Int      @default(0)
  quotaDate         DateTime @default(now())
  dailyFreeLimit    Int      @default(20)
  pointsPerMessage  Int      @default(10)
}
```

## Support

For issues or questions:

1. Check browser/server console for errors
2. Verify database schema matches expected
3. Check WebSocket connection in Network tab
4. Review API responses for error messages
