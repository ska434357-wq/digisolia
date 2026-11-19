import { CheckCircle2, RefreshCw, WifiOff } from 'lucide-react';
import React from 'react';
import { translations } from '../i18n/translations';
import type { Language } from '../types';

interface OfflineIndicatorProps {
  language: Language;
  isOnline: boolean;
  pendingCount: number;
  syncMessage: string | null;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  language,
  isOnline,
  pendingCount,
  syncMessage,
}) => {
  const t = translations[language].pwa;

  if (isOnline && pendingCount === 0 && !syncMessage) {
    return null;
  }

  if (!isOnline) {
    return (
      <div
        role="status"
        className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-40 flex items-center gap-3 rounded-xl border border-amber-300/60 bg-amber-950/95 px-4 py-3 text-xs font-medium text-amber-100 shadow-lg backdrop-blur-sm"
      >
        <WifiOff className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
        <span>{t.offlineBanner}</span>
      </div>
    );
  }

  if (pendingCount > 0) {
    return (
      <div
        role="status"
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2.5 rounded-xl border border-sky-300/40 bg-[#08152d] px-4 py-2.5 text-xs font-medium text-sky-100 shadow-lg"
      >
        <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#2dd4bf]" aria-hidden="true" />
        <span>{t.syncingQueue}</span>
      </div>
    );
  }

  if (syncMessage === 'synced') {
    return (
      <div
        role="status"
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2.5 rounded-xl border border-teal-400/40 bg-[#08152d] px-4 py-2.5 text-xs font-medium text-teal-100 shadow-lg"
      >
        <CheckCircle2 className="h-4 w-4 text-[#2dd4bf]" aria-hidden="true" />
        <span>{t.syncedQueue}</span>
      </div>
    );
  }

  return null;
};
