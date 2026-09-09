'use client';

import type { JSX } from 'react';
import {
  ImageField,
  LinkField,
  TextField,
  Image as SitecoreImage,
  Link as SitecoreLink,
  Text,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  PEPSICO_FOOTER_COLUMNS,
  renderingPlaceholderHasContent,
} from '@/components/pepsico/corporate/pepsico-corporate-marketing-fallbacks';
import { PEPSICO_CORPORATE } from './pepsico-corporate-tokens';

interface PepsiCoCorporateFooterFields {
  Logo: ImageField;
  FollowUsTitle: TextField;
  SocialFacebookLink: LinkField;
  SocialTwitterLink: LinkField;
  SocialInstagramLink: LinkField;
  SocialLinkedinLink: LinkField;
  SocialYoutubeLink: LinkField;
}

const defaults: PepsiCoCorporateFooterFields = {
  Logo: { value: { src: '', alt: 'PepsiCo' } },
  FollowUsTitle: { value: 'Follow us' },
  SocialFacebookLink: { value: { href: '#', linktype: 'external' } },
  SocialTwitterLink: { value: { href: '#', linktype: 'external' } },
  SocialInstagramLink: { value: { href: '#', linktype: 'external' } },
  SocialLinkedinLink: { value: { href: '#', linktype: 'external' } },
  SocialYoutubeLink: { value: { href: '#', linktype: 'external' } },
};

export type PepsiCoCorporateFooterProps = ComponentProps & {
  fields: PepsiCoCorporateFooterFields;
};

const socialLinks: Array<{ field: keyof PepsiCoCorporateFooterFields; label: string }> = [
  { field: 'SocialFacebookLink', label: 'Facebook' },
  { field: 'SocialTwitterLink', label: 'X' },
  { field: 'SocialInstagramLink', label: 'Instagram' },
  { field: 'SocialLinkedinLink', label: 'LinkedIn' },
  { field: 'SocialYoutubeLink', label: 'YouTube' },
];

export const Default = (props: PepsiCoCorporateFooterProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaults;
  const dph = DynamicPlaceholderId ?? '1';

  const ph = {
    about: `pepsico-corporate-footer-about-${dph}`,
    brands: `pepsico-corporate-footer-brands-${dph}`,
    impact: `pepsico-corporate-footer-impact-${dph}`,
    careers: `pepsico-corporate-footer-careers-${dph}`,
    legal: `pepsico-corporate-footer-legal-${dph}`,
  };

  const showFallbackColumns =
    !renderingPlaceholderHasContent(props.rendering, ph.about) &&
    !renderingPlaceholderHasContent(props.rendering, ph.brands) &&
    !renderingPlaceholderHasContent(props.rendering, ph.impact) &&
    !renderingPlaceholderHasContent(props.rendering, ph.careers);

  return (
    <footer
      key={id}
      className={`component pepsico-corporate-footer pb-10 text-white md:pb-12 ${styles || ''}`}
      id={id}
      style={{ backgroundColor: PEPSICO_CORPORATE.navyDeep }}
    >
      <div className="mx-auto max-w-[min(96rem,100vw)] px-6 pt-10 md:px-8 md:pt-12 lg:pt-14">
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-10 lg:grid-cols-6 lg:gap-x-8">
          <div className="min-w-0 lg:col-span-1">
            {fields.Logo?.value?.src?.trim() ? (
              <SitecoreImage
                field={fields.Logo}
                className="h-10 w-auto object-contain brightness-0 invert md:h-12"
                alt={fields.Logo?.value?.alt || 'PepsiCo'}
              />
            ) : (
              <span className="inline-block text-xl font-black text-white lowercase md:text-2xl">
                pepsi<span className="text-[#C5E86C]">co</span>
              </span>
            )}
          </div>
          {showFallbackColumns ? (
            <>
              {PEPSICO_FOOTER_COLUMNS.map((col) => (
                <div key={col.title} className="min-w-0 lg:col-span-2">
                  <p className="m-0 text-sm font-bold tracking-wide text-white/90 uppercase">
                    {col.title}
                  </p>
                  <ul className="mt-3 list-none space-y-2 p-0 text-sm text-white/80">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/80 no-underline transition hover:text-white"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="min-w-0 lg:col-span-1">
                <Text
                  tag="p"
                  field={fields.FollowUsTitle}
                  className="m-0 text-sm font-bold tracking-wide text-white/90 uppercase"
                />
                <ul className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.map(({ field, label }) => (
                    <li key={field}>
                      <SitecoreLink
                        field={fields[field] as LinkField}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-xs font-bold text-white transition hover:bg-white/10"
                      >
                        {label.charAt(0)}
                      </SitecoreLink>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="min-w-0">
                <Placeholder name={ph.about} rendering={props.rendering} />
              </div>
              <div className="min-w-0">
                <Placeholder name={ph.brands} rendering={props.rendering} />
              </div>
              <div className="min-w-0">
                <Placeholder name={ph.impact} rendering={props.rendering} />
              </div>
              <div className="min-w-0">
                <Placeholder name={ph.careers} rendering={props.rendering} />
              </div>
              <div className="min-w-0">
                <Text
                  tag="p"
                  field={fields.FollowUsTitle}
                  className="m-0 text-sm font-bold tracking-wide text-white/90 uppercase"
                />
                <ul className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.map(({ field, label }) => (
                    <li key={field}>
                      <SitecoreLink
                        field={fields[field] as LinkField}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-xs font-bold text-white transition hover:bg-white/10"
                      >
                        {label.charAt(0)}
                      </SitecoreLink>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[min(96rem,100vw)] border-t border-white/15 px-6 pt-6 md:mt-12 md:px-8">
        <div className="text-[0.8125rem] leading-snug text-white/70">
          <Placeholder name={ph.legal} rendering={props.rendering} />
        </div>
      </div>
    </footer>
  );
};
