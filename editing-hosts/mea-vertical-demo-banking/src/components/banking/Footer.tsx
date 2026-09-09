'use client';

import type { JSX } from 'react';
import { Text, RichText, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface FooterFields {
  LogoText?: TextField;
  LogoSubtext?: RichTextField;
  Tagline?: RichTextField;
}

const defaultFields: FooterFields = {
  LogoText: { value: 'LogoText' },
  LogoSubtext: { value: '<p>LogoSubtext</p>' },
  Tagline: { value: '<p>Tagline</p>' },
};

export type FooterProps = ComponentProps & { fields?: FooterFields };

export const Default = (props: FooterProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const footerLinksPh = dynamicPlaceholderKey('footer-links', params);

  return (
    <div
      key={componentKey(props)}
      className={`deb-footer ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.LogoText ? <Text tag="span" field={fields.LogoText} className="deb-footer__logo-text" /> : null}
      {fields.LogoSubtext ? <div className="deb-footer__logo-subtext"><RichText field={fields.LogoSubtext} /></div> : null}
      {fields.Tagline ? <div className="deb-footer__tagline"><RichText field={fields.Tagline} /></div> : null}
      <div className="deb-footer__footer-links">
        <Placeholder name={footerLinksPh} rendering={rendering} />
      </div>
    </div>
  );
};
