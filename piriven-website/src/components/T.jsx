'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { preferLanguage } from '@/lib/i18n';

export default function T({ text, textSi, as: As = 'span', className = '', children }) {
  const { lang } = useLanguage();
  const english = text ?? (typeof children === 'string' ? children : '');
  const localized = preferLanguage(english, textSi, lang);
  if (localized) {
    return <As className={className}>{localized}</As>;
  }
  return <As className={className}>{children}</As>;
}
