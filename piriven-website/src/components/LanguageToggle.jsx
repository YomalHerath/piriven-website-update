'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center justify-end mb-4">
      <div className="inline-flex bg-gray-100 rounded-full p-1 shadow-inner">
        <button
          onClick={() => setLang('si')}
          className={`px-4 py-1 rounded-full text-sm ${lang === 'si' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'}`}
        >
          සිංහල
        </button>
        <span className="px-2 text-gray-400">|</span>
        <button
          onClick={() => setLang('en')}
          className={`px-4 py-1 rounded-full text-sm ${lang === 'en' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'}`}
        >
          English
        </button>
      </div>
    </div>
  );
}

