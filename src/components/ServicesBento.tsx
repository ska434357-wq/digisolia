import { ArrowUpRight, Check } from 'lucide-react';
import React from 'react';
import { translations } from '../i18n/translations';
import type { Language, ServiceId } from '../types';

interface ServicesBentoProps {
  language: Language;
  onSelectService: (service: ServiceId) => void;
}

export const ServicesBento: React.FC<ServicesBentoProps> = ({ language, onSelectService }) => {
  const t = translations[language].services;

  // Ordered editorial numbering 01..04 with asymmetric 3-column bento spans
  // Item 0 (Web) -> col-span-2, Item 1 (Automation) -> col-span-1? Better:
  // Row 1: 01 (Web, col-span-2) + 02 (Automation, col-span-1 -> wait let's give 01 & 04 col-span-2, or 01 & 02 both prominent!)
  // Let's map: index 0 -> lg:col-span-2, index 1 -> lg:col-span-1, index 2 -> lg:col-span-1, index 3 -> lg:col-span-2
  const spanClasses = ['lg:col-span-2', 'lg:col-span-1', 'lg:col-span-1', 'lg:col-span-2'];

  const handleChooseService = (serviceId: ServiceId) => {
    onSelectService(serviceId);
    const target = document.getElementById('devis');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="scroll-mt-16 bg-[#f8fafc] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#2563eb]">
            {t.kicker}
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#08152d]">
            {t.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">{t.subtitle}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {t.items.map((service, index) => (
            <article
              key={service.id}
              className={`${spanClasses[index]} flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 transition-transform duration-150 hover:-translate-y-0.5`}
            >
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
                  <span className="font-mono text-sm font-semibold text-[#0d9488] tabular-nums">
                    {service.num}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{service.meta}</span>
                </div>

                <h3 className="mt-5 font-display text-xl sm:text-2xl font-bold tracking-tight text-[#08152d]">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-slate-100 pt-5">
                  {service.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0d9488]" aria-hidden="true" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-2">
                <button
                  type="button"
                  onClick={() => handleChooseService(service.id)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563eb] transition-colors hover:text-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded"
                >
                  <span>{t.actionLabel}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
