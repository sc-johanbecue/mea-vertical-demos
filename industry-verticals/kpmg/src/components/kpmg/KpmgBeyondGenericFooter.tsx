'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { Image, Text } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { imageSrc, linkHref, linkText } from './kpmg-beyond-generic-shared';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export interface KpmgBeyondGenericFooterFields {
  PrivacyLink: LinkField;
  LegalLink: LinkField;
  LegalText: TextField;
  Logo: ImageField;
}

const defaultFields: KpmgBeyondGenericFooterFields = {
  PrivacyLink: { value: { href: '/privacy', text: 'Privacy' } },
  LegalLink: { value: { href: '/legal', text: 'Legal' } },
  LegalText: {
    value:
      '© 2026 KPMG LLP, a UK limited liability partnership and a member firm of the KPMG global organisation of independent member firms affiliated with KPMG International Limited, a private English company limited by guarantee. All rights reserved.',
  },
  Logo: { value: { src: '', alt: 'KPMG' } },
};

export type KpmgBeyondGenericFooterProps = ComponentProps & {
  fields: KpmgBeyondGenericFooterFields;
};

export const Default = (props: KpmgBeyondGenericFooterProps): JSX.Element => {
  const fields = props.fields || defaultFields;
  const editingHydration = useEditingHydrationProps();
  const logoSrc = imageSrc(fields.Logo);

  return (
    <footer
      {...editingHydration}
      data-cy="generic-footer"
      className="component kpmg-beyond-generic-footer border-t border-white/10 px-5 py-10 xl:px-8"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap gap-4 text-sm text-kpmg-label">
          <Link href={linkHref(fields.PrivacyLink, '/privacy')} className="text-kpmg-label no-underline hover:underline">
            {linkText(fields.PrivacyLink, 'Privacy')}
          </Link>
          <Link href={linkHref(fields.LegalLink, '/legal')} className="text-kpmg-label no-underline hover:underline">
            {linkText(fields.LegalLink, 'Legal')}
          </Link>
        </div>
        <Text
          tag="p"
          field={fields.LegalText}
          className="mt-6 max-w-[980px] text-xs leading-6 text-white/50 xl:text-sm"
        />
        <div className="mt-8">
          {logoSrc ? (
            <Image field={fields.Logo} className="h-8 w-auto opacity-80" />
          ) : (
            <span className="text-lg font-bold text-white/80">KPMG</span>
          )}
        </div>
      </div>
    </footer>
  );
};
