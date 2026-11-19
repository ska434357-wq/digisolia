import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import React, { useState } from 'react';
import { translations } from '../i18n/translations';
import type { Language } from '../types';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { PWAInstallButton } from './PWAInstallButton';

interface HeroSectionProps {
  language: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ language }) => {
  const t = translations[language].hero;
  const [activeTab, setActiveTab] = useState(0);

  const quickWaUrl = buildWhatsAppUrl(
    language === 'fr'
      ? 'Bonjour DigiSolia, je souhaite discuter d’un projet numérique ou d’une formation IA.'
      : 'Hello DigiSolia, I would like to discuss a digital project or AI training.'
  );

  const tabDetails = [
    {
      summary:
        language === 'fr'
          ? 'Connexion automatisée entre formulaires Web, tableurs CRM et alertes WhatsApp.'
          : 'Automated bridge between web forms, CRM sheets, and instant WhatsApp alerts.',
      rows: t.previewWorkflow,
    },
    {
      summary:
        language === 'fr'
          ? 'Centralisation de vos demandes entrantes avec référence unique et historique.'
          : 'Centralized inbound request tracking with unique reference IDs and audit trail.',
      rows:
        language === 'fr'
          ? [
              'DS-Q-261119 · Faso Distribution — Application Web de stock (Nouveau)',
              'DS-T-261119 · Groupe Horizon — Formation IA Dirigeants (Qualifié)',
              'DS-Q-261118 · Clinique Espoir — Automatisation RDV WhatsApp (En cours)',
            ]
          : [
              'DS-Q-261119 · Faso Distribution — Inventory Web App (New)',
              'DS-T-261119 · Groupe Horizon — Executive AI Training (Qualified)',
              'DS-Q-261118 · Clinique Espoir — WhatsApp Booking Automation (Active)',
            ],
    },
    {
      summary:
        language === 'fr'
          ? 'Parcours structurés sur 2 à 5 jours avec livrables opérationnels pour vos équipes.'
          : 'Structured 2-to-5 day programs with hands-on operational deliverables for your staff.',
      rows:
        language === 'fr'
          ? [
              'Module 1 · Cartographie des tâches à automatiser dans votre PME',
              'Module 2 · Ateliers pratiques sur vos vrais documents financiers & devis',
              'Module 3 · Déploiement sécurisé et suivi post-formation de 30 jours',
            ]
          : [
              'Module 1 · Mapping high-ROI tasks to automate in your SME',
              'Module 2 · Hands-on labs using your real financial & sales files',
              'Module 3 · Safe deployment and 30-day post-training support',
            ],
    },
  ];

  return (
    <section
      id="accueil"
      className="relative overflow-hidden bg-[#08152d] text-white"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 60% 50% at 85% 15%, rgba(37, 99, 235, 0.22), transparent), linear-gradient(150deg, #08152d 0%, #0f254a 65%, #092c46 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 pb-16 sm:pt-8 sm:pb-24">
        {/* Hero utility strip: Regional trust marker + PWA Install */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <p className="text-xs sm:text-sm font-medium text-slate-300 tracking-wide">
            {t.regionalMarker}
          </p>

          <div className="flex items-center gap-3">
            <PWAInstallButton language={language} variant="hero" />
          </div>
        </div>

        {/* 2-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="font-display text-[clamp(2.25rem,4.2vw,3.75rem)] font-extrabold leading-[1.08] tracking-tight text-white">
              {t.headlineStart}
              <span className="text-[#2dd4bf]">{t.headlineAccent}</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-200">
              {t.subheadline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href="#devis"
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-6 py-3.5 text-sm sm:text-base font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#1d4ed8] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf]"
              >
                <span>{t.primaryCta}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <a
                href="#formations"
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-5 py-3.5 text-sm sm:text-base font-semibold text-white transition-colors duration-150 hover:bg-white/10 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf]"
              >
                {t.secondaryCta}
              </a>

              <a
                href={quickWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-3 text-sm font-medium text-[#2dd4bf] transition-colors hover:text-white whitespace-nowrap shrink-0"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>{t.whatsappQuick}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Operations Console Preview */}
          <div className="lg:col-span-5 flex">
            <div className="flex w-full flex-col justify-between rounded-2xl border border-white/15 bg-[#0b1b38]/90 p-5 sm:p-6">
              <div>
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {t.previewTitle}
                  </span>
                  <span className="text-xs font-medium text-[#2dd4bf] whitespace-nowrap shrink-0">
                    {t.previewStatus}
                  </span>
                </div>

                {/* Interactive Tabs */}
                <div className="mt-4 grid grid-cols-3 gap-1 rounded-lg bg-[#071226] p-1">
                  {t.previewTabs.map((tabLabel, idx) => (
                    <button
                      key={tabLabel}
                      type="button"
                      onClick={() => setActiveTab(idx)}
                      className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors whitespace-nowrap truncate ${
                        activeTab === idx
                          ? 'bg-[#163261] text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tabLabel}
                    </button>
                  ))}
                </div>

                <p className="mt-4 text-xs leading-relaxed text-slate-300">
                  {tabDetails[activeTab].summary}
                </p>

                <div className="mt-4 space-y-2.5">
                  {tabDetails[activeTab].rows.map((rowText) => (
                    <div
                      key={rowText}
                      className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-slate-200"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2dd4bf]" aria-hidden="true" />
                      <span>{rowText}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3-metric footer inside preview */}
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
                {t.previewMetrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="font-mono text-sm sm:text-base font-semibold text-white tabular-nums">
                      {metric.value}
                    </div>
                    <div className="mt-0.5 text-[11px] leading-tight text-slate-400">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
