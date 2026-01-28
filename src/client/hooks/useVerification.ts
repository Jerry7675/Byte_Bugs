/**
 * React hooks for Verification System
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getMyVerificationStages,
  getVerificationSummary,
  getActivityMetrics,
  getCommunityMetrics,
  recalculateActivityScore,
  recalculateTrustScore,
  submitVerificationStage,
  type VerificationStageData,
  type VerificationSummary,
  type ActivityMetrics,
  type CommunityMetrics,
} from '@/client/api/verification-api';

/**
 * Hook to get and manage verification stages
 */
export function useVerificationStages() {
  const [stages, setStages] = useState<VerificationStageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyVerificationStages();
      if (response.success) {
        setStages(response.data);
      } else {
        setError('Failed to fetch verification stages');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  return { stages, loading, error, refetch: fetchStages };
}

/**
 * Hook to get verification summary
 */
export function useVerificationSummary() {
  const [summary, setSummary] = useState<VerificationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVerificationSummary();
      if (response.success) {
        setSummary(response.data);
      } else {
        setError('Failed to fetch verification summary');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
}

/**
 * Hook to get activity metrics
 */
export function useActivityMetrics() {
  const [metrics, setMetrics] = useState<ActivityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recalculating, setRecalculating] = useState(false);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getActivityMetrics();
      if (response.success) {
        setMetrics(response.data);
      } else {
        setError('Failed to fetch activity metrics');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const recalculate = useCallback(async () => {
    try {
      setRecalculating(true);
      setError(null);
      const response = await recalculateActivityScore();
      if (response.success) {
        setMetrics(response.data);
      } else {
        setError('Failed to recalculate activity score');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setRecalculating(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, recalculating, recalculate, refetch: fetchMetrics };
}

/**
 * Hook to get community metrics
 */
export function useCommunityMetrics() {
  const [metrics, setMetrics] = useState<CommunityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recalculating, setRecalculating] = useState(false);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCommunityMetrics();
      if (response.success) {
        setMetrics(response.data);
      } else {
        setError('Failed to fetch community metrics');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const recalculate = useCallback(async () => {
    try {
      setRecalculating(true);
      setError(null);
      const response = await recalculateTrustScore();
      if (response.success) {
        setMetrics(response.data);
      } else {
        setError('Failed to recalculate trust score');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setRecalculating(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, recalculating, recalculate, refetch: fetchMetrics };
}

/**
 * Hook to submit verification stage
 */
export function useSubmitVerification() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (data: {
      type: 'IDENTITY' | 'ROLE' | 'ACTIVITY' | 'COMMUNITY';
      metadata: Record<string, any>;
    }) => {
      try {
        setSubmitting(true);
        setError(null);
        const response = await submitVerificationStage(data);
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.error || 'Failed to submit verification');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  return { submit, submitting, error };
}
