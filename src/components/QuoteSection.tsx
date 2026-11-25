import { Check, CheckCircle2, Copy, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { translations } from '../i18n/translations';
import type { Language, LeadPayload, ServiceId } from '../types';
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  DIGISOLIA_CONTACT,
  formatQuoteWhatsAppMessage,
} from '../utils/whatsapp';

interface QuoteSectionProps {
  language: Language;
  selectedService: ServiceId;
  serviceSelectTrigger: number;
  isOnline: boolean;
  onEnqueueOffline: (payload: LeadPayload) => void;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({
  language,
  selectedService,
  serviceSelectTrigger,
  isOnline,
  onEnqueueOffline,
}) => {
  const t = translations[language].quote;
  const f = t.form;

  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState<ServiceId>(selectedService);
  const [budgetIndex, setBudgetIndex] = useState(1);
  const [timelineIndex, setTimelineIndex] = useState(1);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState<{
    refId: string;
    offline: boolean;
    waUrl: string;
    mailUrl: string;
    summaryText: string;
  } | null>(null);

  useEffect(() => {
    setService(selectedService);
    if (serviceSelectTrigger > 0) {
      setSubmitted(null);
      setErrorMsg(null);
    }
  }, [selectedService, serviceSelectTrigger]);

  const budget = f.budgets[budgetIndex] ?? f.budgets[0];
  const timeline = f.timelines[timelineIndex] ?? f.timelines[0];

  const getValidationError = (): string | null => {
    if (fullName.trim().length < 2) {
      return language === 'fr'
        ? 'Veuillez renseigner votre nom complet (au moins 2 caractères).'
        : 'Please enter your full name (at least 2 characters).';
    }
    const digits = phone.replace(/[^\d]/g, '');
    if (digits.length < 8 || digits.length > 16) {
      return language === 'fr'
        ? 'Veuillez saisir un numéro de téléphone / WhatsApp valide (au moins 8 chiffres).'
        : 'Please enter a valid phone / WhatsApp number (at least 8 digits).';
    }
    if (email.trim().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return language === 'fr'
        ? 'L’adresse email saisie semble invalide (ou laissez le champ vide).'
        : 'The email address looks invalid (or leave the field blank).';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validationError = getValidationError();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    const cleanMessage =
      message.trim() ||
      (language === 'en'
        ? `Quote request for ${f.services[service]} (${budget}, ${timeline})`
        : `Demande de devis pour ${f.services[service]} (${budget}, ${timeline})`);

    const payload: LeadPayload = {
      type: 'quote',
      fullName: fullName.trim(),
      company: company.trim(),
      phone: phone.trim(),
      email: email.trim(),
      service,
      budget,
      timeline,
      message: cleanMessage,
      language,
    };

    const formattedText = formatQuoteWhatsAppMessage({
      language,
      fullName: payload.fullName,
      company: payload.company,
      phone: payload.phone,
      email: payload.email,
      service: payload.service,
      budget: payload.budget,
      timeline: payload.timeline,
      message: payload.message,
    });

    const waUrl = buildWhatsAppUrl(formattedText);
    const mailUrl = buildMailtoUrl(
      `[DigiSolia] ${f.services[service]} — ${payload.fullName}`,
      formattedText
    );

    if (!isOnline) {
      onEnqueueOffline(payload);
      setSubmitted({
        refId: 'OFFLINE-QUEUE',
        offline: true,
        waUrl,
        mailUrl,
        summaryText: formattedText,
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        if (res.status === 400) {
          setErrorMsg(f.validationError);
          return;
        }
        throw new Error('Failed to save lead');
      }
      const data = (await res.json()) as { id: string };
      setSubmitted({
        refId: data.id,
        offline: false,
        waUrl,
        mailUrl,
        summaryText: formattedText,
      });
    } catch {
      onEnqueueOffline(payload);
      setSubmitted({
        refId: 'LOCAL-QUEUE',
        offline: true,
        waUrl,
        mailUrl,
        summaryText: formattedText,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopySummary = async () => {
    if (!submitted) return;
    try {
      await navigator.clipboard.writeText(submitted.summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback ignored if clipboard permission unavailable
    }
  };

  const resetForm = () => {
    setSubmitted(null);
    setFullName('');
    setCompany('');
    setPhone('');
    setEmail('');
    setMessage('');
    setErrorMsg(null);
    setCopied(false);
  };

  const directWaUrl = buildWhatsAppUrl(
    language === 'fr'
      ? 'Bonjour DigiSolia, je souhaite obtenir des informations sur vos services.'
      : 'Hello DigiSolia, I would like to get information about your services.'
  );

  return (
    <section id="devis" className="scroll-mt-16 bg-[#08152d] py-20 sm:py-24 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Direct Contacts */}
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-[#2dd4bf]">{t.kicker}</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {t.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">{t.subtitle}</p>

            <div className="mt-8 space-y-4">
              <div className="rounded-xl border border-white/15 bg-white/[0.04] p-5">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <Phone className="h-4 w-4 text-[#2dd4bf]" aria-hidden="true" />
                  <span>{t.directPhonesTitle}</span>
                </div>
                <div className="mt-2.5 space-y-1 font-mono text-sm text-slate-200 tabular-nums">
                  <div>
                    <a href="tel:+22670478322" className="hover:text-[#2dd4bf]">
                      {DIGISOLIA_CONTACT.phonePrimary}
                    </a>
                  </div>
                  <div>
                    <a href="tel:+22676127809" className="hover:text-[#2dd4bf]">
                      {DIGISOLIA_CONTACT.phoneSecondary}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/[0.04] p-5">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <MessageCircle className="h-4 w-4 text-[#2dd4bf]" aria-hidden="true" />
                  <span>{t.directWhatsappTitle}</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-300">{t.directWhatsappDesc}</p>
                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#2dd4bf] hover:underline"
                >
                  {t.directWhatsappBtn}
                </a>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/[0.04] p-5">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <Mail className="h-4 w-4 text-[#2dd4bf]" aria-hidden="true" />
                  <span>{t.directEmailTitle}</span>
                </div>
                <a
                  href={`mailto:${DIGISOLIA_CONTACT.email}`}
                  className="mt-2 inline-block text-sm text-slate-200 hover:text-[#2dd4bf]"
                >
                  {DIGISOLIA_CONTACT.email}
                </a>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{DIGISOLIA_CONTACT.city}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quote Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-slate-900 shadow-xl">
              {submitted ? (
                <div className="space-y-5 py-2">
                  <div className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50/70 p-5">
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#0d9488]" aria-hidden="true" />
                    <div>
                      <h3 className="font-display text-xl font-bold text-[#08152d]">
                        {f.successTitle}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-slate-600 tabular-nums">
                        {f.successRef}: {submitted.refId}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-700">
                        {submitted.offline ? f.successOfflineDesc : f.successDesc}
                      </p>
                    </div>
                  </div>

                  <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-xs leading-relaxed text-slate-700">
                    {submitted.summaryText}
                  </pre>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={submitted.waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0d9488] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0f766e]"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      <span>{f.sendWhatsappBtn}</span>
                    </a>
                    <a
                      href={submitted.mailUrl}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      <span>{f.sendEmailBtn}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => void handleCopySummary()}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-[#0d9488]" aria-hidden="true" />
                      ) : (
                        <Copy className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span>
                        {copied
                          ? language === 'fr'
                            ? 'Copié'
                            : 'Copied'
                          : language === 'fr'
                            ? 'Copier'
                            : 'Copy'}
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-[#08152d] hover:underline"
                  >
                    {f.newRequestBtn}
                  </button>
                </div>
              ) : (
                <form noValidate onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-display text-xl font-bold text-[#08152d]">{f.title}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quote-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {f.fullName}
                      </label>
                      <input
                        id="quote-name"
                        type="text"
                        required
                        placeholder={f.fullNamePlaceholder}
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errorMsg) setErrorMsg(null);
                        }}
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                      />
                    </div>

                    <div>
                      <label htmlFor="quote-company" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {f.company}
                      </label>
                      <input
                        id="quote-company"
                        type="text"
                        placeholder={f.companyPlaceholder}
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quote-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {f.phone}
                      </label>
                      <input
                        id="quote-phone"
                        type="tel"
                        required
                        placeholder={f.phonePlaceholder}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errorMsg) setErrorMsg(null);
                        }}
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                      />
                    </div>

                    <div>
                      <label htmlFor="quote-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {f.email}
                      </label>
                      <input
                        id="quote-email"
                        type="email"
                        placeholder={f.emailPlaceholder}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMsg) setErrorMsg(null);
                        }}
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="quote-service" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {f.service}
                    </label>
                    <select
                      id="quote-service"
                      value={service}
                      onChange={(e) => setService(e.target.value as ServiceId)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                    >
                      <option value="web">{f.services.web}</option>
                      <option value="mobile">{f.services.mobile}</option>
                      <option value="automation">{f.services.automation}</option>
                      <option value="ai_training">{f.services.ai_training}</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quote-budget" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {f.budget}
                      </label>
                      <select
                        id="quote-budget"
                        value={budgetIndex}
                        onChange={(e) => setBudgetIndex(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                      >
                        {f.budgets.map((b, idx) => (
                          <option key={b} value={idx}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="quote-timeline" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {f.timeline}
                      </label>
                      <select
                        id="quote-timeline"
                        value={timelineIndex}
                        onChange={(e) => setTimelineIndex(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                      >
                        {f.timelines.map((tl, idx) => (
                          <option key={tl} value={idx}>
                            {tl}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="quote-message" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {f.message}
                    </label>
                    <textarea
                      id="quote-message"
                      rows={3}
                      placeholder={f.messagePlaceholder}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                    />
                  </div>

                  {errorMsg && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
                    >
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-lg bg-[#2563eb] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                  >
                    {submitting ? f.submitting : f.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
