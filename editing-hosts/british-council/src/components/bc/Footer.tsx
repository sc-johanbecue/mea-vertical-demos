'use client';

import type { JSX } from 'react';
import { Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { Globe } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface FooterFields {
  WorldwideTitle?: TextField;
  Copyright?: TextField;
  Tagline?: TextField;
  CharityInfo?: TextField;
  ConnectTitle?: TextField;
}

const defaultFields: Required<FooterFields> = {
  WorldwideTitle: { value: 'British Council Worldwide' },
  Copyright: { value: '© 2026 British Council' },
  Tagline: {
    value: "The United Kingdom's international organisation for cultural relations and educational opportunities.",
  },
  CharityInfo: {
    value: 'A registered charity: 209131 (England and Wales) SC037733 (Scotland).',
  },
  ConnectTitle: { value: 'Connect with us' },
};

export type FooterProps = ComponentProps & { fields?: FooterFields };

function Layout(props: FooterProps, extra = ''): JSX.Element {
  const { params, fields: incoming, rendering } = props;
  const fields = { ...defaultFields, ...incoming };
  const dynamicId = params?.DynamicPlaceholderId ?? '';
  const columnsPh = `footer-columns-${dynamicId}`;
  const socialPh = `footer-social-${dynamicId}`;
  const legalPh = `footer-legal-${dynamicId}`;

  return (
    <footer
      key={componentKey(props)}
      className={`bc-footer component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bc-container bc-footer__inner">
        <div className="bc-footer__worldwide">
          <span className="bc-footer__worldwide-icon" aria-hidden="true">
            <Globe size={22} strokeWidth={1.75} />
          </span>
          <Text tag="span" className="bc-footer__worldwide-title" field={fields.WorldwideTitle} />
          <span className="bc-footer__worldwide-plus" aria-hidden="true">
            +
          </span>
        </div>

        <div className="bc-footer__columns">
          {rendering ? <Placeholder name={columnsPh} rendering={rendering} /> : null}
        </div>

        <div className="bc-footer__connect">
          <Text tag="h2" className="bc-footer__connect-title" field={fields.ConnectTitle} />
          <ul className="bc-footer__social">
            {rendering ? <Placeholder name={socialPh} rendering={rendering} /> : null}
          </ul>
        </div>

        <ul className="bc-footer__legal">
          {rendering ? <Placeholder name={legalPh} rendering={rendering} /> : null}
        </ul>

        <div className="bc-footer__meta">
          <Text tag="p" className="bc-footer__copy" field={fields.Copyright} />
          <Text tag="p" className="bc-footer__tagline" field={fields.Tagline} />
          <Text tag="p" className="bc-footer__charity" field={fields.CharityInfo} />
        </div>
      </div>
    </footer>
  );
}

export const Default = (p: FooterProps): JSX.Element => Layout(p);
export const Inversed = (p: FooterProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: FooterProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: FooterProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
