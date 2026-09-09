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
import { faFacebookF, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ComponentProps } from '@/lib/component-props';

/**
 * Brand footer (Walkers, Lays, etc.) — centered stack: logo, social icons, LinkList placeholder, copyright.
 * Desktop: social icons in a row; links in a row. Mobile: social + links stacked; divider before copyright.
 */

interface PepsiCoFooterFields {
  Logo: ImageField;
  CopyrightLine: TextField;
  SocialXLink: LinkField;
  SocialFacebookLink: LinkField;
  SocialYoutubeLink: LinkField;
}

const defaultFooterFields: PepsiCoFooterFields = {
  Logo: { value: { src: '', alt: 'Brand logo' } },
  CopyrightLine: { value: '© 2026 WALKERS' },
  SocialXLink: { value: { href: '#', linktype: 'external' } },
  SocialFacebookLink: { value: { href: '#', linktype: 'external' } },
  SocialYoutubeLink: { value: { href: '#', linktype: 'external' } },
};

export type PepsiCoFooterProps = ComponentProps & {
  fields: PepsiCoFooterFields;
};

type SocialItem = {
  icon: IconDefinition;
  link: LinkField;
  label: string;
};

function SocialIconButton({ icon, link, label }: SocialItem) {
  const href = link?.value?.href?.trim();
  if (!href) return null;

  return (
    <SitecoreLink
      field={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-white transition-colors duration-200 hover:text-[#e41e0f] md:h-14 md:w-14"
    >
      <FontAwesomeIcon
        icon={icon}
        className="text-[1.75rem] leading-none md:text-[3rem]"
        aria-hidden
      />
    </SitecoreLink>
  );
}

export const Default = (props: PepsiCoFooterProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFooterFields;
  const linksPh = `pepsico-footer-links-${DynamicPlaceholderId ?? '1'}`;

  const socials: SocialItem[] = [
    { icon: faXTwitter, link: fields.SocialXLink, label: 'X' },
    { icon: faFacebookF, link: fields.SocialFacebookLink, label: 'Facebook' },
    { icon: faYoutube, link: fields.SocialYoutubeLink, label: 'YouTube' },
  ];

  return (
    <footer
      className={[
        'component pepsico-footer bg-[#1a1a1a] px-6 py-12 text-white md:py-14',
        styles || '',
      ].join(' ')}
      id={id}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <SitecoreImage
          field={fields.Logo}
          className="mb-8 h-auto w-[min(12rem,70vw)] max-w-[220px] object-contain md:mb-10"
          alt={fields.Logo?.value?.alt ?? 'Brand logo'}
        />

        <nav
          className="mb-8 flex flex-col items-center gap-5 md:mb-10 md:flex-row md:justify-center md:gap-8"
          aria-label="Social media"
        >
          {socials.map((item) => (
            <SocialIconButton key={item.label} {...item} />
          ))}
        </nav>

        <div className="pepsico-footer__links-slot mb-8 w-full md:mb-10">
          <Placeholder name={linksPh} rendering={props.rendering} />
        </div>

        <hr
          className="mb-6 w-full max-w-xs border-0 border-t border-white/25 md:hidden"
          aria-hidden
        />

        <Text
          tag="p"
          field={fields.CopyrightLine}
          className="m-0 text-sm font-semibold tracking-wide text-white uppercase md:text-[0.9375rem]"
        />
      </div>
    </footer>
  );
};
