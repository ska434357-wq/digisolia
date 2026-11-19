import { Check, ChevronDown, Globe, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { translations } from '../i18n/translations';
import type { Language } from '../types';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const LANGUAGE_OPTIONS: { code: Language; short: string; label: string }[] = [
  { code: 'fr', short: 'FR', label: 'Français' },
  { code: 'en', short: 'EN', label: 'English' },
];

export const Navbar: React.FC<NavbarProps> = ({ language, onLanguageChange }) => {
  const t = translations[language].nav;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const whatsappQuickUrl = buildWhatsAppUrl(
    language === 'fr'
      ? 'Bonjour DigiSolia, je souhaite parler à un expert pour mon entreprise.'
      : 'Hello DigiSolia, I would like to speak with an expert regarding my business.'
  );

  const navItems = [
    { href: '#services', label: t.services },
    { href: '#formations', label: t.trainings },
    { href: '#apropos', label: t.approach },
    { href: '#devis', label: t.quote },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectLanguage = (code: Language) => {
    onLanguageChange(code);
    setLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#08152d]/95 text-white backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Single-element wordmark */}
        <a
          href="#accueil"
          className="font-display text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf] rounded"
        >
          Digi<span className="text-[#2dd4bf]">Solia</span>
        </a>

        {/* Zone 2: 4 concise single-line text links */}
        <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 py-1 transition-colors duration-150 hover:text-white hover:underline hover:underline-offset-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf] rounded"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Language dropdown + Primary CTA + mobile menu button */}
        <div className="flex items-center gap-3 shrink-0">
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={language === 'fr' ? 'Changer de langue' : 'Switch language'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-2 text-xs font-semibold text-slate-200 transition-colors duration-150 hover:border-white/30 hover:bg-white/10 hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf]"
            >
              <Globe className="h-3.5 w-3.5 text-[#2dd4bf]" aria-hidden="true" />
              <span className="uppercase tracking-wide">{language}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ease-out ${
                  langOpen ? 'rotate-180 text-[#2dd4bf]' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  role="listbox"
                  aria-label={language === 'fr' ? 'Langues disponibles' : 'Available languages'}
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl border border-white/15 bg-[#0c1f40] p-1.5 shadow-xl backdrop-blur-md z-50"
                >
                  {LANGUAGE_OPTIONS.map((option) => {
                    const isSelected = language === option.code;
                    return (
                      <button
                        key={option.code}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelectLanguage(option.code)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-150 whitespace-nowrap ${
                          isSelected
                            ? 'bg-[#163366] text-white'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-semibold text-[#2dd4bf]">
                            {option.short}
                          </span>
                          <span>{option.label}</span>
                        </span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-[#2dd4bf]" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href={whatsappQuickUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#1d4ed8] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf]"
          >
            {t.cta}
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t.menuClose : t.menuOpen}
            className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-slate-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-white/10 bg-[#08152d] px-4 py-4 space-y-2"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href={whatsappQuickUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
            >
              {t.cta}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
