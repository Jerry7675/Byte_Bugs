# 🎯 SWIPE MATCHING SYSTEM - COMPLETE

## 📦 WHAT WAS DELIVERED

A complete Tinder-like swipe matching system for connecting investors with startups and vice versa.

### Core Features ✅

- ✅ **Swipe functionality** (Like, Dislike, Skip)
- ✅ **Daily quota system** (10 free swipes per day)
- ✅ **Points-based system** (5 points per swipe after quota)
- ✅ **Undo functionality** (10 points to undo last skip, 5-minute window)
- ✅ **Smart matching algorithm** (category-based scoring)
- ✅ **Match notifications** (instant match popup)
- ✅ **Profile discovery** (excludes already swiped profiles)
- ✅ **Matches page** (view all mutual matches)
- ✅ **Swipe statistics** (track likes, dislikes, matches)
- ✅ **Wallet integration** (seamless points deduction)

### Architecture ✅

- ✅ Follows existing folder structure
- ✅ Extends Prisma schema safely
- ✅ Reuses existing auth/wallet services
- ✅ Server-trusted logic (no client enforcement)
- ✅ Transaction-based consistency
- ✅ Indexed for performance

---

## 🗂️ FILE STRUCTURE

```
prisma/
  schema.prisma                              # Added SwipeInteraction, SwipeQuota, ProfileMatch models

src/
  server/
    services/
      swipe/
        swipe.service.ts                     # Core business logic
    api/
      swipe/
        swipe.ts                             # API layer

  app/
    api/
      swipe/
        profiles/route.ts                    # GET potential profiles
        action/route.ts                      # POST swipe action
        undo/route.ts                        # POST undo skip
        matches/route.ts                     # GET user matches
        quota/route.ts                       # GET quota status
        stats/route.ts                       # GET swipe stats

    (main)/
      swipe/
        page.tsx                             # Main swipe page
        matches/
          page.tsx                           # Matches listing page

  components/
    swipe/
      SwipeCard.tsx                          # Swipeable card component
      SwipeQuotaDisplay.tsx                  # Quota display component
      index.ts                               # Barrel export

  client/
    hooks/
      useSwipe.ts                            # Client hooks for swipe functionality
```

---

## 🎯 DATABASE SCHEMA

### SwipeInteraction

Records every swipe action (like, dislike, skip).

```prisma
model SwipeInteraction {
  id                String      @id @default(uuid())
  swiperId          String      // Who swiped
  swipedProfileId   String      // Who was swiped on
  action            SwipeAction // LIKE, DISLIKE, SKIP
  createdAt         DateTime    @default(now())

  @@unique([swiperId, swipedProfileId]) // Prevent duplicate swipes
}

enum SwipeAction {
  LIKE
  DISLIKE
  SKIP
}
```

### SwipeQuota

Tracks daily swipe limits and last skipped profile for undo.

```prisma
model SwipeQuota {
  id                   String   @id @default(uuid())
  userId               String   @unique
  swipesToday          Int      @default(0)
  quotaDate            DateTime @default(now())
  lastSkippedProfileId String?  // For undo functionality
  lastSkipTime         DateTime?
  dailyFreeLimit       Int      @default(10)
  pointsPerSwipe       Int      @default(5)
  pointsPerUndo        Int      @default(10)
}
```

### ProfileMatch

Created when both users like each other.

```prisma
model ProfileMatch {
  id         String   @id @default(uuid())
  user1Id    String
  user2Id    String
  matchedAt  DateTime @default(now())
  isActive   Boolean  @default(true)

  @@unique([user1Id, user2Id])
}
```

---

## 🔄 DATA FLOW

### Swipe Flow

```
1. User loads /swipe page
2. Fetch potential profiles (opposite role, not already swiped)
3. Profiles sorted by category match score
4. User swipes (drag or button click)
5. Check quota:
   - If < 10 swipes today: Free
   - If >= 10: Deduct 5 points
6. Create SwipeInteraction record
7. If action is LIKE:
   - Check for reciprocal like
   - If exists: Create ProfileMatch
   - Show match notification
8. Move to next profile
```

### Undo Flow

```
1. User clicks Undo button (only if last action was SKIP)
2. Check if within 5-minute window
3. Check wallet balance (need 10 points)
4. Delete SwipeInteraction record
5. Deduct 10 points
6. Clear lastSkippedProfileId
7. Return to previous profile
```

### Matching Algorithm

```
1. Get current user's role and categories
2. Find profiles with opposite role
3. Exclude already swiped profiles
4. Calculate match score:
   - +1 for each matching category
5. Sort by:
   - Primary: Match score (higher first)
   - Secondary: Activity score
6. Return top 20 profiles
```

---

## 🛠️ API ENDPOINTS

### GET `/api/swipe/profiles`

Get potential profiles to swipe on.

**Query Params:**

- `user_id` (required): Current user ID
- `limit` (optional): Max profiles to return (default: 20)

**Response:**

```json
[
  {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "role": "INVESTOR",
    "investor": { ... },
    "matchScore": 3,
    "matchingCategories": ["TECHNOLOGY", "SEED", "AI"]
  }
]
```

### POST `/api/swipe/action`

Perform a swipe action.

**Body:**

```json
{
  "userId": "uuid",
  "profileId": "uuid",
  "action": "LIKE" | "DISLIKE" | "SKIP"
}
```

**Response:**

```json
{
  "swipe": { ... },
  "match": { ... } // Only if mutual like
}
```

### POST `/api/swipe/undo`

Undo last skip action.

**Body:**

```json
{
  "userId": "uuid"
}
```

**Response:**

```json
{
  "unskippedProfile": { ... },
  "pointsSpent": 10
}
```

### GET `/api/swipe/matches`

Get user's matches.

**Query Params:**

- `user_id` (required)

**Response:**

```json
[
  {
    "matchId": "uuid",
    "matchedAt": "2024-01-28T...",
    "otherUser": { ... }
  }
]
```

### GET `/api/swipe/quota`

Get current quota status.

**Query Params:**

- `user_id` (required)

**Response:**

```json
{
  "swipesToday": 5,
  "remainingFree": 5,
  "dailyFreeLimit": 10,
  "requiresPoints": false,
  "pointsPerSwipe": 5,
  "pointsPerUndo": 10,
  "canUndo": true,
  "lastSkipTime": "2024-01-28T..."
}
```

### GET `/api/swipe/stats`

Get swipe statistics.

**Query Params:**

- `user_id` (required)

**Response:**

```json
{
  "totalSwipes": 50,
  "likes": 25,
  "dislikes": 15,
  "skips": 10,
  "matchesCount": 8,
  "likeRate": "50.0"
}
```

---

## 💻 CLIENT USAGE

### Swipe Page

```tsx
import { useSwipeProfiles, useSwipeAction, useSwipeQuota } from '@/client/hooks/useSwipe';

function SwipePage() {
  const { profiles, loading, refetch } = useSwipeProfiles();
  const { performSwipe, loading: swipeLoading } = useSwipeAction();
  const { quota, refetch: refetchQuota } = useSwipeQuota();

  const handleSwipe = async (profileId: string, action: 'LIKE' | 'DISLIKE' | 'SKIP') => {
    const result = await performSwipe(profileId, action);
    if (result.match) {
      // Show match notification
    }
    refetchQuota();
    refetch();
  };

  return (
    // ... UI
  );
}
```

### Matches Page

```tsx
import { useMatches } from '@/client/hooks/useSwipe';

function MatchesPage() {
  const { matches, loading, refetch } = useMatches();

  return (
    <div>
      {matches.map((match) => (
        <MatchCard key={match.matchId} match={match} />
      ))}
    </div>
  );
}
```

---

## ⚙️ CONFIGURATION

### Quota Limits

Edit in `src/server/services/swipe/swipe.service.ts`:

```typescript
const DAILY_FREE_SWIPES = 10; // Free swipes per day
const POINTS_PER_SWIPE = 5; // Points cost after quota
const POINTS_PER_UNDO = 10; // Points cost for undo
```

### Undo Time Window

Currently set to 5 minutes. Edit in `swipe.service.ts`:

```typescript
// Line ~265
if (now.getTime() - skipTime.getTime() > 5 * 60 * 1000) {
  throw new Error('Undo window expired (5 minutes)');
}
```

---

## 🎨 UI FEATURES

### Swipe Card

- **Drag to swipe**: Drag left (dislike) or right (like)
- **Visual feedback**: Red "NOPE" on left, Green "LIKE" on right
- **Card animations**: Smooth transitions using Framer Motion
- **Profile info**: Photo, name, bio, categories, match score
- **Verification badge**: Shows if user is verified
- **Match highlighting**: Matching categories highlighted in purple

### Action Buttons

- **❌ Dislike**: Red button
- **⏭️ Skip**: Yellow button (can be undone)
- **❤️ Like**: Green button

### Quota Display

- **Progress bar**: Visual representation of daily quota
- **Points info**: Shows when points are required
- **Undo button**: Available if last action was skip (within 5 min)

### Match Modal

- **🎉 Celebration**: Shown when mutual match occurs
- **Quick actions**: Keep swiping or view matches
- **Match details**: Shows matched user info

---

## 🔐 SECURITY

✅ **Server-side validation**: All quota checks on server  
✅ **Duplicate prevention**: Unique constraint on swipe pairs  
✅ **Transaction safety**: Atomic operations for swipes + points  
✅ **Authentication required**: All endpoints require user ID  
✅ **Balance verification**: Check before deducting points

---

## 📊 PERFORMANCE

### Optimizations

✅ **Database indexes** on swiperId, swipedProfileId, matchedAt  
✅ **Efficient queries** (exclude already swiped, limit results)  
✅ **Smart sorting** (category match first, then activity score)  
✅ **Lazy loading** (fetch more when running low)  
✅ **Client-side caching** (React hooks manage state)

### Scalability

- Current: Single-query profile fetching ✅
- Future: Add pagination for large user bases
- Future: Cache popular profiles in Redis

---

## 🚀 GETTING STARTED

1. **Migration already applied**: `20260128141449_add_swipe_matching_system`
2. **Navigate to swipe page**: Visit `/swipe`
3. **Start swiping**: Drag cards or use buttons
4. **View matches**: Click "Matches" button or visit `/swipe/matches`
5. **Check stats**: Stats shown on swipe page

---

## 🎯 USER FLOW

### For Investors

1. Visit `/swipe`
2. See startup profiles (sorted by matching investment categories)
3. Swipe right (like), left (dislike), or skip
4. Get 10 free swipes per day
5. After quota: 5 points per swipe
6. When startup also likes you: Instant match!
7. View matches in `/swipe/matches`
8. Start conversations with matches

### For Startups

1. Visit `/swipe`
2. See investor profiles (sorted by matching funding categories)
3. Same swipe mechanics as investors
4. Match with interested investors
5. Connect and discuss funding opportunities

---

## 🐛 TROUBLESHOOTING

### "Insufficient points" error?

→ Check wallet balance: `GET /api/wallet/balance`  
→ Purchase more points via wallet page

### Quota not resetting?

→ Quota resets automatically at midnight (check quotaDate)

### Can't undo skip?

→ Undo only works for last skip action  
→ Must be within 5-minute window  
→ Costs 10 points

### No profiles showing?

→ May have swiped on all available profiles  
→ More profiles will appear as new users join  
→ Try refreshing later

### Match not appearing?

→ Both users must like each other  
→ Check `/swipe/matches` page  
→ Matches are instant upon mutual like

---

## 📈 FUTURE ENHANCEMENTS

### Potential Features

- [ ] Advanced filtering (location, investment range, etc.)
- [ ] "Super like" feature (costs more points, notifies recipient)
- [ ] Profile boost (pay to show profile to more users)
- [ ] Match suggestions based on ML
- [ ] In-app messaging from matches page
- [ ] Video profiles
- [ ] Profile verification requirements for swiping
- [ ] Block/report functionality
- [ ] Match expiration (72-hour window to message)
- [ ] Analytics dashboard (conversion rates, popular categories)

---

## 📞 SUPPORT

For issues or questions:

1. Check browser console for errors
2. Verify database schema matches expected
3. Check API responses for error messages
4. Ensure wallet has sufficient balance for paid swipes
5. Review quota status via `/api/swipe/quota`

---

## ✅ SUMMARY

The swipe matching system is **fully implemented and ready to use**. It provides a modern, Tinder-like experience for connecting investors with startups, complete with:

- Smart matching algorithm
- Daily quota system with points integration
- Undo functionality
- Real-time match notifications
- Beautiful, responsive UI
- Comprehensive statistics tracking

All features are production-ready and integrated with the existing authentication and wallet systems! 🎉
