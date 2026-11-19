import { CheckCircle2, Mail, MessageCircle, X } from 'lucide-react';
import React, { useState } from 'react';
import { translations } from '../i18n/translations';
import type { Language, LeadPayload, TrainingProgram } from '../types';
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  formatTrainingWhatsAppMessage,
} from '../utils/whatsapp';

interface TrainingEnrollmentModalProps {
  program: TrainingProgram;
  language: Language;
  isOnline: boolean;
  onEnqueueOffline: (payload: LeadPayload) => void;
  onClose: () => void;
}

export const TrainingEnrollmentModal: React.FC<TrainingEnrollmentModalProps> = ({
  program,
  language,
  isOnline,
  onEnqueueOffline,
  onClose,
}) => {
  const t = translations[language].trainings.modal;
  const quoteErr = translations[language].quote.form.validationError;

  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [participantsCount, setParticipantsCount] = useState(1);
  const [preferredFormat, setPreferredFormat] = useState<string>(t.formats[0]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedRef, setSavedRef] = useState<{ id: string; offline: boolean } | null>(null);

  const validate = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const digits = phone.replace(/[^\d]/g, '');
    const phoneOk = digits.length >= 8 && digits.length <= 16;
    return fullName.trim().length >= 2 && emailOk && phoneOk;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validate()) {
      setErrorMsg(quoteErr);
      return;
    }

    const payload: LeadPayload = {
      type: 'training',
      fullName: fullName.trim(),
      company: company.trim(),
      phone: phone.trim(),
      email: email.trim(),
      service: 'ai_training',
      budget: program.priceFcfa,
      timeline: program.nextSession[language],
      message: `Inscription formation : ${program.title[language]}`,
      trainingId: program.id,
      trainingTitle: program.title[language],
      participantsCount,
      preferredFormat,
      language,
    };

    if (!isOnline) {
      onEnqueueOffline(payload);
      setSavedRef({ id: 'OFFLINE-QUEUE', offline: true });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error('Server rejected enrollment');
      }
      const data = (await res.json()) as { id: string };
      setSavedRef({ id: data.id, offline: false });
    } catch {
      onEnqueueOffline(payload);
      setSavedRef({ id: 'LOCAL-QUEUE', offline: true });
    } finally {
      setSubmitting(false);
    }
  };

  const waText = formatTrainingWhatsAppMessage({
    language,
    trainingTitle: program.title[language],
    fullName: fullName.trim(),
    company: company.trim(),
    participantsCount,
    preferredFormat,
    phone: phone.trim(),
    email: email.trim(),
  });

  const waHref = buildWhatsAppUrl(waText);
  const mailHref = buildMailtoUrl(
    `[DigiSolia] ${t.title} — ${program.title[language]}`,
    waText
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="training-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm overflow-y-auto"
    >
      <div className="my-8 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-slate-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-semibold text-[#0d9488]">{program.durationLabel[language]} · {program.priceLabel[language]}</p>
            <h3 id="training-modal-title" className="mt-1 font-display text-xl font-bold text-[#08152d]">
              {program.title[language]}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {savedRef ? (
          <div className="mt-6 space-y-5">
            <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0d9488]" aria-hidden="true" />
                <div>
                  <h4 className="font-display text-base font-bold text-[#08152d]">
                    {t.successTitle}
                  </h4>
                  <p className="mt-1 text-xs font-mono text-slate-600 tabular-nums">
                    Ref: {savedRef.id}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {savedRef.offline ? t.successOffline : t.successSaved}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0d9488] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0f766e]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>{t.openWhatsApp}</span>
              </a>
              <a
                href={mailHref}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>{t.openEmail}</span>
              </a>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              {t.close}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <p className="text-sm text-slate-600">{t.subtitle}</p>

            {errorMsg && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.company}
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.phone} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+226 70 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.email} *
                </label>
                <input
                  type="email"
                  required
                  placeholder="nom@entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.participants}
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={participantsCount}
                  onChange={(e) => setParticipantsCount(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.format}
                </label>
                <select
                  value={preferredFormat}
                  onChange={(e) => setPreferredFormat(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                >
                  {t.formats.map((fmt) => (
                    <option key={fmt} value={fmt}>
                      {fmt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-60"
              >
                {submitting ? t.submitting : t.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
