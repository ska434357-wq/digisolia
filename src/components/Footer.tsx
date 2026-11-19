import React from 'react';
import { translations } from '../i18n/translations';
import type { Language } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface FooterProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onLanguageChange,
  onOpenAdmin,
}) => {
  const t = translations[language];

  return (
    <footer className="border-t border-white/10 bg-[#061124] py-10 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <a href="#accueil" className="font-display text-lg font-extrabold tracking-tight text-white">
              Digi<span className="text-[#2dd4bf]">Solia</span>
            </a>
            <p className="mt-1 text-xs text-slate-400">{t.footer.tagline}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <a href="#services" className="hover:text-white transition-colors">
              {t.nav.services}
            </a>
            <a href="#formations" className="hover:text-white transition-colors">
              {t.nav.trainings}
            </a>
            <a href="#apropos" className="hover:text-white transition-colors">
              {t.nav.approach}
            </a>
            <a href="#devis" className="hover:text-white transition-colors">
              {t.nav.quote}
            </a>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-[#2dd4bf] transition-colors"
            >
              {t.admin.linkLabel}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} DigiSolia. {t.footer.rights}</span>
            <span aria-hidden="true">·</span>
            <span>{t.footer.location}</span>
          </div>

          <div className="flex items-center gap-3">
            <PWAInstallButton language={language} variant="footer" />
            <div className="inline-flex items-center gap-1 rounded-md border border-white/15 p-0.5">
              <button
                type="button"
                onClick={() => onLanguageChange('fr')}
                className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                  language === 'fr' ? 'bg-white text-[#08152d]' : 'text-slate-400 hover:text-white'
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                  language === 'en' ? 'bg-white text-[#08152d]' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
