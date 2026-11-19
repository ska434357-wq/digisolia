import { useCallback, useEffect, useState } from 'react';
import type { LeadPayload } from '../types';
import { useOnlineStatus } from './useOnlineStatus';

const QUEUE_STORAGE_KEY = 'digisolia_offline_lead_queue_v1';

export function useOfflineLeadQueue() {
  const isOnline = useOnlineStatus();
  const [pendingCount, setPendingCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as LeadPayload[]) : [];
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  });
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const enqueueLead = useCallback((payload: LeadPayload) => {
    try {
      const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
      const current = raw ? (JSON.parse(raw) as LeadPayload[]) : [];
      const next = [...(Array.isArray(current) ? current : []), payload];
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(next));
      setPendingCount(next.length);
    } catch {
      // Ignore storage quota issues
    }
  }, []);

  const flushQueue = useCallback(async () => {
    if (!navigator.onLine) return;
    let items: LeadPayload[] = [];
    try {
      const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
      items = raw ? (JSON.parse(raw) as LeadPayload[]) : [];
    } catch {
      items = [];
    }
    if (!Array.isArray(items) || items.length === 0) return;

    const remaining: LeadPayload[] = [];
    let syncedAny = false;

    for (const item of items) {
      try {
        const endpoint = item.type === 'training' ? '/api/enrollments' : '/api/leads';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        if (!res.ok) {
          remaining.push(item);
        } else {
          syncedAny = true;
        }
      } catch {
        remaining.push(item);
      }
    }

    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(remaining));
    } catch {
      // Ignore storage error
    }
    setPendingCount(remaining.length);

    if (syncedAny) {
      setSyncMessage('synced');
      setTimeout(() => setSyncMessage(null), 5000);
    }
  }, []);

  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      void flushQueue();
    }
  }, [isOnline, pendingCount, flushQueue]);

  return {
    isOnline,
    pendingCount,
    syncMessage,
    enqueueLead,
    flushQueue,
  };
}
