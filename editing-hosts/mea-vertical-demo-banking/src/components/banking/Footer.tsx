'use client';

import type { JSX } from 'react';
import { Image, RichText, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { ImageField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface FooterFields {
  Logo?: ImageField;
  Tagline?: RichTextField;
}

const defaultFields: FooterFields = {
  Logo: {
    value: {
      src: '/assets/deb-logo.svg',
      alt: 'Digital Experience Bank',
    },
  },
  Tagline: { value: 'Experience banking. <b>Intelligently.</b>' },
};

export type FooterProps = ComponentProps & { fields?: FooterFields };

export const Default = (props: FooterProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const footerLinksPh = dynamicPlaceholderKey('footer-links', params);

  return (
    <footer key={componentKey(props)} className={`${params?.styles ?? ''}`.trim()} id={params?.RenderingIdentifier}>
      <a className="logo" href="/" aria-label="Digital Experience Bank">
        {fields.Logo ? <Image field={fields.Logo} className="logo-image" /> : null}
      </a>
      {fields.Tagline ? (
        <div className="footer-tagline">
          <RichText field={fields.Tagline} />
        </div>
      ) : null}
      <div>
        <Placeholder name={footerLinksPh} rendering={rendering} />
      </div>
    </footer>
  );
};
