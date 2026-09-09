'use client';

import type { JSX } from 'react';
import { Image as SitecoreImage, ImageField, Placeholder } from '@sitecore-content-sdk/nextjs';
import { Globe, Menu, Search, X } from 'lucide-react';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/shadcn/components/ui/drawer';
import { ComponentProps } from '@/lib/component-props';
import { extractMediaUrl } from '@/helpers/extractMediaUrl';
import { PEPSICO_CORPORATE } from './pepsico-corporate-tokens';

export interface PepsiCoCorporateHeaderFields {
  Logo?: ImageField;
  LanguageLabel?: { value?: string };
}

export type PepsiCoCorporateHeaderProps = ComponentProps & {
  fields?: PepsiCoCorporateHeaderFields;
};

function CorporateLogo({ logoField }: { logoField?: ImageField }): JSX.Element {
  const src = logoField?.value?.src?.trim();
  if (src) {
    return (
      <a href="/" className="inline-flex items-center no-underline">
        <SitecoreImage
          field={logoField}
          className="h-9 w-auto object-contain md:h-10"
          alt={logoField?.value?.alt || 'PepsiCo'}
        />
      </a>
    );
  }

  return (
    <a href="/" className="inline-flex items-center no-underline" aria-label="PepsiCo home">
      <span className="text-[1.35rem] font-black tracking-tight text-[#004C97] lowercase md:text-2xl">
        pepsi<span className="text-[#F58220]">co</span>
      </span>
    </a>
  );
}

export const Default = (props: PepsiCoCorporateHeaderProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles: paramStyles, DynamicPlaceholderId } = props.params;
  const suffix = DynamicPlaceholderId ?? '1';
  const navPh = `pepsico-corporate-header-nav-${suffix}`;
  const languageLabel = props.fields?.LanguageLabel?.value?.trim() || 'EN';

  const logoSrc = extractMediaUrl(props.params.Logo);
  const logoField: ImageField | undefined =
    props.fields?.Logo?.value?.src || props.fields?.Logo?.value?.srcset
      ? props.fields.Logo
      : logoSrc
        ? { value: { src: logoSrc, alt: 'PepsiCo' } }
        : undefined;

  const desktopBar = (
    <div className="hidden w-full lg:block">
      <div className="mx-auto flex max-w-[min(90rem,100vw)] items-center gap-8 px-6 py-4 xl:gap-12">
        <CorporateLogo logoField={logoField} />
        <nav className="min-w-0 flex-1" aria-label="Main">
          <Placeholder name={navPh} rendering={props.rendering} />
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#1a1a1a] transition hover:bg-black/5"
          >
            <Search className="h-5 w-5 stroke-[1.8]" />
          </button>
          <button
            type="button"
            aria-label="Change language"
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-[#1a1a1a] transition hover:bg-black/5"
          >
            <Globe className="h-5 w-5 stroke-[1.6]" />
            <span>{languageLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <header
      key={id ?? props.rendering?.uid}
      className={`component pepsico-corporate-header sticky top-0 z-100 w-full border-b border-black/5 bg-white ${paramStyles || ''}`.trim()}
      id={id}
    >
      {desktopBar}

      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:hidden">
        <CorporateLogo logoField={logoField} />
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#1a1a1a] hover:bg-black/5"
          >
            <Search className="h-6 w-6 stroke-[1.7]" />
          </button>
          <button
            type="button"
            aria-label="Change language"
            className="inline-flex h-11 items-center gap-1 rounded-full px-2 text-sm font-semibold text-[#1a1a1a] hover:bg-black/5"
          >
            <Globe className="h-6 w-6 stroke-[1.6]" />
            <span>{languageLabel}</span>
          </button>
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#1a1a1a] hover:bg-black/5"
              >
                <Menu className="h-7 w-7 stroke-[1.7]" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="h-full! max-h-full! w-[min(100%,20rem)]! max-w-full! rounded-none border-0 bg-white p-0">
              <div className="flex h-full min-h-dvh flex-col">
                <div
                  className="flex items-center justify-between border-b px-4 py-3"
                  style={{ borderColor: 'rgba(0,0,0,0.08)' }}
                >
                  <CorporateLogo logoField={logoField} />
                  <DrawerClose asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5"
                      style={{ color: PEPSICO_CORPORATE.blue }}
                    >
                      <X className="h-7 w-7 stroke-[1.9]" />
                    </button>
                  </DrawerClose>
                </div>
                <div className="min-h-0 flex-1 overflow-auto py-4">
                  <Placeholder name={navPh} rendering={props.rendering} />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
};

export default Default;
