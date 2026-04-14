import type { LocalizedText, Locale, SchoolControl, SchoolRow, SchoolType } from '@/types/data-model/college';

export function isNationalUniversity(school: Pick<SchoolRow, 'school_type'>) {
  return school.school_type === 'national_university';
}

export function isLiberalArtsCollege(school: Pick<SchoolRow, 'school_type'>) {
  return school.school_type === 'liberal_arts_college';
}

export function isPublicSchool(school: Pick<SchoolRow, 'control'>) {
  return school.control === 'public';
}

export function isPrivateSchool(school: Pick<SchoolRow, 'control'>) {
  return school.control === 'private';
}

export function schoolTypeLabel(type: SchoolType, locale: Locale) {
  const map: Record<Locale, Record<SchoolType, string>> = {
    en: {
      national_university: 'National University',
      liberal_arts_college: 'Liberal Arts College',
    },
    zh: {
      national_university: '综合性大学',
      liberal_arts_college: '文理学院',
    },
    ja: {
      national_university: '総合大学',
      liberal_arts_college: 'リベラルアーツ・カレッジ',
    },
  };

  return map[locale][type];
}

export function schoolControlLabel(control: SchoolControl, locale: Locale) {
  const map: Record<Locale, Record<SchoolControl, string>> = {
    en: { public: 'Public', private: 'Private' },
    zh: { public: '公立', private: '私立' },
    ja: { public: '公立', private: '私立' },
  };

  return map[locale][control];
}

export function pickLocalizedText(value: LocalizedText, locale: Locale) {
  return value[locale] ?? value.en;
}

export function formatEnrollment(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US').format(value);
}

export function formatCurrencyUSD(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}
