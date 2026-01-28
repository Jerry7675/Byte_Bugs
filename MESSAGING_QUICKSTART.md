# 🚀 Quick Start - Real-Time Messaging

## Installation (One-Time Setup)

```bash
# 1. Install dependencies
pnpm add ws @types/ws date-fns tsx

# 2. Run migration
pnpm prisma migrate dev

# 3. Update package.json scripts
{
  "dev": "tsx server.ts",
  "start": "NODE_ENV=production tsx server.ts"
}

# 4. Start server
pnpm dev
```

## Usage in Components

### 1. Send a Message

```typescript
import { useMessages } from '@/client/hooks/useMessaging';

function ChatComponent({ conversationId, token, userId }) {
  const { messages, sendMessage, loading } = useMessages(conversationId, token);

  const handleSend = async () => {
    // Regular message
    await sendMessage('Hello!');

    // Disappearing message (expires in 24 hours)
    await sendMessage('Secret!', 24);
  };

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

### 2. List Conversations

```typescript
import { useConversations } from '@/client/hooks/useMessaging';

function ConversationList({ userId }) {
  const { conversations, loading } = useConversations();

  return (
    <div>
      {conversations.map(conv => (
        <div key={conv.id}>
          {/* Display conversation */}
        </div>
      ))}
    </div>
  );
}
```

### 3. Create Conversation

```typescript
import { createConversation } from '@/client/api/messaging-api';

const handleStartChat = async (receiverId: string) => {
  const result = await createConversation({
    receiverId,
    pointsCost: 0,
  });

  if (result.success) {
    // Navigate to conversation
  }
};
```

### 4. Check Quota

```typescript
import { useQuotaStatus } from '@/client/hooks/useMessaging';

function QuotaWidget() {
  const { quota } = useQuotaStatus();

  return (
    <div>
      {quota?.remainingFree} free messages left today
      {quota?.requiresPoints && ` (${quota.pointsPerMessage} points/msg after)`}
    </div>
  );
}
```

## Key Features

### ✅ Disappearing Messages

```typescript
// Message expires in 1 hour (minimum)
await sendMessage('This will self-destruct', 1);

// Message expires in 7 days
await sendMessage('Week-long message', 168);

// Regular message (never expires)
await sendMessage('Permanent message');
```

### ✅ Daily Quota

- **20 free messages/day** per user
- Resets automatically at midnight
- After limit: **10 points** per message
- Insufficient points = message blocked

### ✅ Real-Time Updates

- Messages appear instantly via WebSocket
- Auto-reconnect on disconnect
- Typing indicators (optional)
- Read receipts

## API Endpoints

```typescript
// Get conversations
GET /api/conversations

// Create conversation
POST /api/conversations/create
{ receiverId, pointsCost }

// Get messages
GET /api/messages?conversationId=xxx&limit=50

// Send message
POST /api/messages/send
{ conversationId, content, expirationHours }

// Mark as read
POST /api/messages/read
{ conversationId, messageIds }

// Check quota
GET /api/messages/quota
```

## WebSocket Connection

```typescript
// Automatic in useMessages hook
const ws = new WebSocket(`ws://localhost:3000/api/ws/messages?token=${jwt}`);

// Join conversation
ws.send(JSON.stringify({ type: 'join', conversationId }));

// Listen for messages
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'new_message') {
    // Handle new message
  }
};
```

## Troubleshooting

### ❌ WebSocket not connecting

→ Use `tsx server.ts`, not `next dev`

### ❌ "Insufficient points" error

→ Check wallet balance: `GET /api/wallet/balance`

### ❌ Quota not resetting

→ Quota resets at midnight automatically

### ❌ Messages not appearing

→ Check WebSocket connection status

## File Locations

- **Service**: `src/server/services/messaging/messaging.service.ts`
- **WebSocket**: `src/server/lib/websocket-server.ts`
- **Hooks**: `src/client/hooks/useMessaging.ts`
- **Components**: `src/components/messaging/`
- **Page**: `src/app/(main)/messages/page.tsx`

## Environment

No new env vars needed! Uses existing:

- `DATABASE_URL`
- `JWT_SECRET`
- `APP_SALT`

---

**Full documentation**: See `MESSAGING_SETUP.md` and `MESSAGING_IMPLEMENTATION.md`
