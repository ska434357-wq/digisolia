/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AdminLeadsDrawer } from './components/AdminLeadsDrawer';
import { ApproachSection } from './components/ApproachSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { QuoteSection } from './components/QuoteSection';
import { ServicesBento } from './components/ServicesBento';
import { TrainingCatalog } from './components/TrainingCatalog';
import { useOfflineLeadQueue } from './hooks/useOfflineLeadQueue';
import { translations } from './i18n/translations';
import type { Language, ServiceId } from './types';

const LANG_STORAGE_KEY = 'digisolia_lang_v1';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'en' || saved === 'fr') return saved;
    } catch {
      // Ignore storage read error
    }
    return 'fr';
  });

  const [selectedService, setSelectedService] = useState<ServiceId>('web');
  const [adminOpen, setAdminOpen] = useState(false);

  const { isOnline, pendingCount, syncMessage, enqueueLead } = useOfflineLeadQueue();

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch {
      // Ignore storage write error
    }

    document.documentElement.lang = language;
    const meta = translations[language].meta;
    document.title = meta.title;

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) {
      descEl.setAttribute('content', meta.description);
    }
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a]">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <main className="flex-1">
        <HeroSection language={language} />
        <ServicesBento language={language} onSelectService={setSelectedService} />
        <TrainingCatalog
          language={language}
          isOnline={isOnline}
          onEnqueueOffline={enqueueLead}
        />
        <ApproachSection language={language} />
        <QuoteSection
          language={language}
          selectedService={selectedService}
          isOnline={isOnline}
          onEnqueueOffline={enqueueLead}
        />
      </main>

      <Footer
        language={language}
        onLanguageChange={setLanguage}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      <OfflineIndicator
        language={language}
        isOnline={isOnline}
        pendingCount={pendingCount}
        syncMessage={syncMessage}
      />

      {adminOpen && (
        <AdminLeadsDrawer language={language} onClose={() => setAdminOpen(false)} />
      )}
    </div>
  );
}
