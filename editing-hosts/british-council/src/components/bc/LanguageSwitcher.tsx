'use client';

import { useCallback, useMemo, type ChangeEvent, type JSX } from 'react';
import { useRouter } from 'next/router';
import { Globe } from 'lucide-react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { localeOptions } from '@/constants/localeOptions';

export type LanguageSwitcherProps = Partial<ComponentProps> & {
  params?: { [key: string]: string };
};

function LanguageSwitcherLayout(props: LanguageSwitcherProps, extra = ''): JSX.Element {
  const { params } = props;
  const router = useRouter();
  const { pathname, asPath, query, locales } = router;
  const { page } = useSitecore();

  const availableLocales = useMemo(() => {
    const allowed = new Set(locales ?? ['en']);
    const fromConfig = localeOptions.filter((l) => allowed.has(l.code));
    if (fromConfig.length) return fromConfig;
    return Array.from(allowed).map((code) => ({
      code,
      label: code.toUpperCase(),
    }));
  }, [locales]);

  const activeLocale = useMemo(() => (page?.locale as string) || router.locale || 'en', [page?.locale, router.locale]);

  const selectedLocale = availableLocales.some((l) => l.code === activeLocale)
    ? activeLocale
    : availableLocales[0]?.code ?? 'en';

  const changeLanguage = useCallback(
    (langCode: string) => {
      if (!pathname || !asPath) return;
      void router.push({ pathname, query }, asPath, { locale: langCode, shallow: false });
    },
    [asPath, pathname, query, router]
  );

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

  const selectId = params?.RenderingIdentifier
    ? `bc-language-select-${params.RenderingIdentifier}`
    : `bc-language-select-${params?.styles?.includes('desktop') ? 'desktop' : 'mobile'}`;

  return (
    <div
      className={`bc-language-switcher component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier || selectId}
    >
      <label className="bc-language-switcher__control" htmlFor={selectId}>
        <Globe className="bc-language-switcher__icon" aria-hidden="true" size={18} />
        <span className="sr-only">Language</span>
        <select
          id={selectId}
          className="bc-language-switcher__select"
          value={selectedLocale}
          onChange={onChange}
          aria-label={`Current language: ${selectedLocale}`}
        >
          {availableLocales.map((language) => (
            <option key={language.code} value={language.code}>
              {language.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export const Default = (p: LanguageSwitcherProps): JSX.Element => LanguageSwitcherLayout(p);
export const Inversed = (p: LanguageSwitcherProps): JSX.Element =>
  LanguageSwitcherLayout(p, 'component--inversed');
export const Animated = (p: LanguageSwitcherProps): JSX.Element =>
  LanguageSwitcherLayout(p, 'component--animated');
export const InversedAnimated = (p: LanguageSwitcherProps): JSX.Element =>
  LanguageSwitcherLayout(p, 'component--inversed component--animated');

export default Default;
