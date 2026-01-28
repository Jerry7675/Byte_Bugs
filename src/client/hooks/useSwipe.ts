import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
  investor?: any;
  startup?: any;
  activityMetrics?: any;
  communityMetrics?: any;
  matchScore?: number;
  matchingCategories?: string[];
}

export function useSwipeProfiles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/swipe/profiles?user_id=${user.id}`);
      const data = await res.json();

      if (res.ok) {
        setProfiles(data);
      } else {
        setError(data.error || 'Failed to fetch profiles');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [user?.id]);

  return { profiles, loading, error, refetch: fetchProfiles };
}

export function useSwipeAction() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const performSwipe = async (profileId: string, action: 'LIKE' | 'DISLIKE' | 'SKIP') => {
    if (!user?.id) throw new Error('Not authenticated');

    setLoading(true);
    try {
      const res = await fetch('/api/swipe/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          profileId,
          action,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to perform swipe');
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  return { performSwipe, loading };
}

export function useSwipeQuota() {
  const { user } = useAuth();
  const [quota, setQuota] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchQuota = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/swipe/quota?user_id=${user.id}`);
      const data = await res.json();

      if (res.ok) {
        setQuota(data);
      }
    } catch (err) {
      console.error('Failed to fetch quota:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuota();
  }, [user?.id]);

  return { quota, loading, refetch: fetchQuota };
}

export function useUndoSkip() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const undoSkip = async () => {
    if (!user?.id) throw new Error('Not authenticated');

    setLoading(true);
    try {
      const res = await fetch('/api/swipe/undo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to undo');
      }

      return data;
    } catch (error: any) {
      console.error('Undo error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { undoSkip, loading };
}

export function useMatches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMatches = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/swipe/matches?user_id=${user.id}`);
      const data = await res.json();

      if (res.ok) {
        setMatches(data);
      }
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [user?.id]);

  return { matches, loading, refetch: fetchMatches };
}

export function useSwipeStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/swipe/stats?user_id=${user.id}`);
      const data = await res.json();

      if (res.ok) {
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user?.id]);

  return { stats, loading, refetch: fetchStats };
}
