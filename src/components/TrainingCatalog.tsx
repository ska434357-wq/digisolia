import { Calendar, Check, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';
import { TRAINING_PROGRAMS } from '../data/catalog';
import { translations } from '../i18n/translations';
import type { Language, LeadPayload, TrainingAudience, TrainingProgram } from '../types';
import { TrainingEnrollmentModal } from './TrainingEnrollmentModal';

interface TrainingCatalogProps {
  language: Language;
  isOnline: boolean;
  onEnqueueOffline: (payload: LeadPayload) => void;
}

export const TrainingCatalog: React.FC<TrainingCatalogProps> = ({
  language,
  isOnline,
  onEnqueueOffline,
}) => {
  const t = translations[language].trainings;
  const [audienceFilter, setAudienceFilter] = useState<TrainingAudience>('all');
  const [expandedId, setExpandedId] = useState<string | null>(TRAINING_PROGRAMS[0].id);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);

  const visiblePrograms =
    audienceFilter === 'all'
      ? TRAINING_PROGRAMS
      : TRAINING_PROGRAMS.filter((p) => p.audience === audienceFilter);

  return (
    <section id="formations" className="scroll-mt-16 border-t border-slate-200 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#0d9488]">{t.kicker}</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#08152d]">
              {t.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">{t.subtitle}</p>
          </div>

          {/* Interactive Filter Segmented Control */}
          <div
            role="tablist"
            aria-label={t.kicker}
            className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1 self-start lg:self-auto"
          >
            {t.filters.map((filter) => {
              const active = audienceFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setAudienceFilter(filter.id as TrainingAudience)}
                  className={`rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white text-[#08152d] shadow-xs'
                      : 'text-slate-600 hover:text-[#08152d]'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {visiblePrograms.map((program) => {
            const isExpanded = expandedId === program.id;
            return (
              <article
                key={program.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 sm:p-8"
              >
                <div>
                  {/* Zero-pill clean metadata line with typographic separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="text-[#0d9488] font-semibold">{program.levelLabel[language]}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{program.durationLabel[language]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{program.formatLabel[language]}</span>
                  </div>

                  <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-[#08152d]">
                    {program.title[language]}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {program.summary[language]}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-y border-slate-200/80 py-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                      <Calendar className="h-3.5 w-3.5 text-[#2563eb]" aria-hidden="true" />
                      <span>{program.nextSession[language]}</span>
                    </span>
                    <span className="font-mono font-semibold text-[#08152d] tabular-nums">
                      {program.priceLabel[language]}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="mt-5 space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-[#08152d]">
                          {t.programModulesTitle}
                        </h4>
                        <ol className="mt-2 space-y-1.5 text-sm text-slate-700">
                          {program.modules[language].map((mod, idx) => (
                            <li key={mod} className="flex items-start gap-2">
                              <span className="font-mono text-xs font-semibold text-slate-400 mt-0.5 tabular-nums">
                                0{idx + 1}.
                              </span>
                              <span>{mod}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="border-t border-slate-200/80 pt-4">
                        <h4 className="text-xs font-semibold text-[#08152d]">
                          {t.outcomesTitle}
                        </h4>
                        <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                          {program.outcomes[language].map((outcome) => (
                            <li key={outcome} className="flex items-start gap-2">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0d9488]" aria-hidden="true" />
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : program.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#08152d]"
                  >
                    <span>{isExpanded ? t.hideDetailsBtn : t.detailsBtn}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProgram(program)}
                    className="inline-flex items-center justify-center rounded-lg bg-[#08152d] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#10264a] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                  >
                    {t.enrollBtn}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {selectedProgram && (
        <TrainingEnrollmentModal
          program={selectedProgram}
          language={language}
          isOnline={isOnline}
          onEnqueueOffline={onEnqueueOffline}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </section>
  );
};
