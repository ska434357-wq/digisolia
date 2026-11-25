import { Download, Smartphone, X } from 'lucide-react';
import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { translations } from '../i18n/translations';
import type { Language } from '../types';

interface PWAInstallButtonProps {
  language: Language;
  variant?: 'hero' | 'footer';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  language,
  variant = 'hero',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const tHero = translations[language].hero;
  const tPwa = translations[language].pwa;

  const buttonClasses =
    variant === 'hero'
      ? 'inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/15 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf]'
      : 'inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf]';

  if (isInstallable) {
    return (
      <button type="button" onClick={() => void install()} className={buttonClasses}>
        <Download className="h-3.5 w-3.5 text-[#2dd4bf]" aria-hidden="true" />
        <span>{tHero.installApp}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button type="button" onClick={() => setShowIOSGuide(true)} className={buttonClasses}>
          <Smartphone className="h-3.5 w-3.5 text-[#2dd4bf]" aria-hidden="true" />
          <span>{tHero.installIos}</span>
        </button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowIOSGuide(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setShowIOSGuide(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
          >
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <h3 id="ios-install-title" className="font-display text-lg font-bold text-[#08152d]">
                  {tPwa.iosModalTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label={tPwa.iosClose}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 space-y-2.5 text-sm text-slate-600">
                <p>{tPwa.iosStep1}</p>
                <p>{tPwa.iosStep2}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-lg bg-[#08152d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#10264a]"
              >
                {tPwa.iosClose}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
