export type Lang = 'en' | 'si';

function normalize(value?: string | null): string {
  return value && value.trim() ? value : '';
}

export function preferLanguage(
  english?: string | null,
  sinhala?: string | null,
  lang: Lang = 'en'
): string {
  const primary = lang === 'si' ? normalize(sinhala) : normalize(english);
  if (primary) {
    return primary;
  }
  const fallback = lang === 'si' ? normalize(english) : normalize(sinhala);
  return fallback;
}

export function localizeField<T extends Record<string, unknown>>(
  entry: T,
  baseKey: string,
  lang: Lang,
): string {
  const english = entry[baseKey];
  const sinhala = entry[`${baseKey}_si`];
  const englishText = typeof english === 'string' ? english : null;
  const sinhalaText = typeof sinhala === 'string' ? sinhala : null;
  return preferLanguage(englishText, sinhalaText, lang);
}

export function localizeOptional<T extends Record<string, unknown>>(
  entry: T | null | undefined,
  baseKey: string,
  lang: Lang,
): string {
  if (!entry) return '';
  return localizeField(entry, baseKey, lang);
}

export function hasSinhalaText(text?: string | null): boolean {
  if (!text) return false;
  return /[\u0D80-\u0DFF]/.test(text);
}

export function detectAvailableLang(entry: Record<string, unknown>, baseKey: string): Lang {
  const sinhala = entry[`${baseKey}_si`];
  return typeof sinhala === 'string' && sinhala.trim() ? 'si' : 'en';
}
