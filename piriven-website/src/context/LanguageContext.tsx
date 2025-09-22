'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Lang } from '@/lib/i18n';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LanguageContext = createContext<Ctx | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Start with a stable default for SSR to avoid hydration mismatches
  const [lang, setLang] = useState<Lang>('si');

  // On mount, sync with saved preference (if any)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang') as Lang | null;
      if (saved && (saved === 'si' || saved === 'en')) setLang(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('lang', lang); } catch {}
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle: () => setLang((prev) => (prev === 'si' ? 'en' : 'si')) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
