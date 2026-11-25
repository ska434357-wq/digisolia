import { ArrowRight, Check } from 'lucide-react';
import React from 'react';
import { translations } from '../i18n/translations';
import type { Language } from '../types';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface ApproachSectionProps {
  language: Language;
}

export const ApproachSection: React.FC<ApproachSectionProps> = ({ language }) => {
  const t = translations[language].approach;
  const waHref = buildWhatsAppUrl(
    language === 'fr'
      ? 'Bonjour DigiSolia, j’aimerais planifier un premier échange pour notre PME.'
      : 'Hello DigiSolia, I would like to schedule an initial call for our SME.'
  );

  return (
    <section id="apropos" className="scroll-mt-16 border-t border-slate-200 bg-[#f8fafc] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-sm font-semibold text-[#2563eb]">{t.kicker}</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#08152d]">
              {t.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">{t.description}</p>

            <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
              {t.pillars.map((pillar) => (
                <div key={pillar.num} className="py-5 flex items-start gap-4">
                  <span className="font-mono text-sm font-semibold text-[#0d9488] pt-0.5 tabular-nums">
                    {pillar.num}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-[#08152d]">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{pillar.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex">
            <div className="flex w-full flex-col justify-between rounded-2xl bg-[#08152d] p-8 sm:p-10 text-white">
              <div>
                <p className="font-display text-2xl font-bold tracking-tight text-white">
                  {t.cardTitle}
                </p>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
                  {t.cardText}
                </p>

                <ul className="mt-8 space-y-3 border-t border-white/10 pt-6">
                  {t.cardPoints.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm text-slate-200">
                      <Check className="h-4 w-4 shrink-0 text-[#2dd4bf]" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#0d9488] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf]"
                >
                  <span>{t.cardCta}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
