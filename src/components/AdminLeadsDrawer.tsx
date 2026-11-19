import { Download, Lock, RefreshCw, Trash2, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { translations } from '../i18n/translations';
import type { Language, LeadRecord, LeadStatus } from '../types';

interface AdminLeadsDrawerProps {
  language: Language;
  onClose: () => void;
}

const ADMIN_TOKEN_KEY = 'digisolia_admin_token';

export const AdminLeadsDrawer: React.FC<AdminLeadsDrawerProps> = ({ language, onClose }) => {
  const t = translations[language].admin;

  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(ADMIN_TOKEN_KEY));
  const [accessCode, setAccessCode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [typeFilter, setTypeFilter] = useState<'all' | 'quote' | 'training'>('all');

  const fetchLeads = useCallback(async (authToken: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        setToken(null);
        return;
      }
      const data = (await res.json()) as { leads: LeadRecord[] };
      setLeads(data.leads || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      void fetchLeads(token);
    }
  }, [token, fetchLeads]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode }),
      });
      if (!res.ok) {
        setAuthError(t.invalidCode);
        return;
      }
      const data = (await res.json()) as { token: string };
      sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      setToken(data.token);
    } catch {
      setAuthError(t.invalidCode);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    if (!token) return;
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    await fetch(`/api/admin/leads/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Type',
      'Status',
      'FullName',
      'Company',
      'Phone',
      'Email',
      'Service',
      'Budget',
      'Timeline',
      'TrainingTitle',
      'Participants',
      'Format',
      'CreatedAt',
    ];
    const escapeCell = (val: unknown) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const rows = leads.map((l) =>
      [
        l.id,
        l.type,
        l.status,
        l.fullName,
        l.company,
        l.phone,
        l.email,
        l.service,
        l.budget,
        l.timeline,
        l.trainingTitle || '',
        l.participantsCount || '',
        l.preferredFormat || '',
        l.createdAt,
      ]
        .map(escapeCell)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digisolia-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLeads =
    typeFilter === 'all' ? leads : leads.filter((l) => l.type === typeFilter);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/75 backdrop-blur-xs"
    >
      <div className="flex h-full w-full max-w-3xl flex-col bg-white text-slate-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h3 id="admin-drawer-title" className="font-display text-lg font-bold text-[#08152d]">
              {t.title}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{t.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeBtn}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!token ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-[#f8fafc] p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#08152d]">
                <Lock className="h-4 w-4 text-[#2563eb]" aria-hidden="true" />
                <span>{t.codeLabel}</span>
              </div>
              {authError && (
                <p className="text-xs font-medium text-red-600">{authError}</p>
              )}
              <input
                type="password"
                required
                placeholder={t.codePlaceholder}
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#2563eb] focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#08152d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#10264a]"
              >
                {t.loginBtn}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-4">
                <div className="font-mono text-2xl font-bold text-[#08152d] tabular-nums">{leads.length}</div>
                <div className="mt-1 text-xs text-slate-500">{t.statsTotal}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-4">
                <div className="font-mono text-2xl font-bold text-[#2563eb] tabular-nums">
                  {leads.filter((l) => l.type === 'quote').length}
                </div>
                <div className="mt-1 text-xs text-slate-500">{t.statsQuotes}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-4">
                <div className="font-mono text-2xl font-bold text-[#0d9488] tabular-nums">
                  {leads.filter((l) => l.type === 'training').length}
                </div>
                <div className="mt-1 text-xs text-slate-500">{t.statsTrainings}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-4">
                <div className="font-mono text-2xl font-bold text-amber-600 tabular-nums">
                  {leads.filter((l) => l.status === 'new').length}
                </div>
                <div className="mt-1 text-xs text-slate-500">{t.statsNew}</div>
              </div>
            </div>

            {/* Filter & Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
                {(['all', 'quote', 'training'] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTypeFilter(tf)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                      typeFilter === tf ? 'bg-white text-[#08152d] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {tf === 'all' ? t.statsTotal : tf === 'quote' ? t.statsQuotes : t.statsTrainings}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void fetchLeads(token)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>{t.refresh}</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  disabled={leads.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#08152d] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#10264a] disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{t.exportCsv}</span>
                </button>
              </div>
            </div>

            {/* Leads List */}
            {filteredLeads.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
                {t.empty}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono font-semibold text-[#08152d] tabular-nums">{lead.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{lead.type === 'training' ? t.statsTrainings : t.statsQuotes}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={lead.status}
                          onChange={(e) => void handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          aria-label="Lead status"
                          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-800"
                        >
                          <option value="new">{t.statuses.new}</option>
                          <option value="contacted">{t.statuses.contacted}</option>
                          <option value="qualified">{t.statuses.qualified}</option>
                          <option value="archived">{t.statuses.archived}</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => void handleDelete(lead.id)}
                          aria-label={t.deleteConfirm}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm font-bold text-[#08152d]">
                      {lead.fullName} {lead.company ? `— ${lead.company}` : ''}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span className="font-mono tabular-nums">{lead.phone}</span>
                      <span>{lead.email}</span>
                      {lead.budget && <span>{lead.budget}</span>}
                    </div>

                    {lead.trainingTitle && (
                      <div className="text-xs font-medium text-[#0d9488]">
                        {lead.trainingTitle} ({lead.participantsCount || 1} pers. · {lead.preferredFormat})
                      </div>
                    )}

                    {lead.message && (
                      <p className="text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-2">
                        {lead.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
