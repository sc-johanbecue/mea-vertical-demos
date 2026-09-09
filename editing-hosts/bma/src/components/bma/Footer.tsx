'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Placeholder, RichText, Text } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, RichTextField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';
import { FieldImage } from '@/lib/field-image';

export interface FooterFields {
  Logo: ImageField;
  AddressTitle: TextField;
  AddressBody: RichTextField;
  MailingTitle: TextField;
  MailingBody: RichTextField;
  ContactTitle: TextField;
  ContactBody: RichTextField;
  AlertsTitle: TextField;
  AlertsIntro: TextField;
  SubscribeLink: LinkField;
  Copyright: TextField;
  PrivacyLink: LinkField;
  TermsLink: LinkField;
  SitemapLink: LinkField;
}

const defaultFields: FooterFields = {
  Logo: { value: { src: '', alt: 'Bermuda Monetary Authority' } },
  AddressTitle: { value: 'Address' },
  AddressBody: { value: '<p>Address details</p>' },
  MailingTitle: { value: 'Mailing Address' },
  MailingBody: { value: '<p>Mailing address</p>' },
  ContactTitle: { value: 'Contact Us' },
  ContactBody: { value: '<p>Contact details</p>' },
  AlertsTitle: { value: 'E-Alerts' },
  AlertsIntro: { value: 'Sign up for Our E-Alert Service' },
  SubscribeLink: { value: { href: '#', text: 'Subscribe' } },
  Copyright: { value: '© Copyright 2026 Bermuda Monetary Authority' },
  PrivacyLink: { value: { href: '#', text: 'Privacy Policy' } },
  TermsLink: { value: { href: '#', text: 'Terms & Conditions' } },
  SitemapLink: { value: { href: '#', text: 'Site Map' } },
};

export type FooterProps = ComponentProps & { fields?: FooterFields };

export const Default = (props: FooterProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const socialPh = dynamicPlaceholderKey('footer-social-links', params);

  return (
    <footer
      key={componentKey(props)}
      className={`bma-footer ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bma-footer__main">
        <div className="bma-footer__inner">
          <div className="bma-footer__logo-col">
            <FieldImage field={fields.Logo} mode="contain" className="bma-footer__logo" />
          </div>

          <div className="bma-footer__address-col">
            <div className="bma-footer__block">
              <Text tag="h3" className="bma-footer__heading" field={fields.AddressTitle} />
              <RichText className="bma-footer__body" field={fields.AddressBody} />
            </div>
            <div className="bma-footer__block">
              <Text tag="h3" className="bma-footer__heading" field={fields.MailingTitle} />
              <RichText className="bma-footer__body" field={fields.MailingBody} />
            </div>
          </div>

          <div className="bma-footer__contact-col">
            <div className="bma-footer__block">
              <Text tag="h3" className="bma-footer__heading" field={fields.ContactTitle} />
              <RichText className="bma-footer__body" field={fields.ContactBody} />
            </div>
            <div className="bma-footer__block bma-footer__alerts">
              <Text tag="h3" className="bma-footer__heading" field={fields.AlertsTitle} />
              <Text tag="p" className="bma-footer__intro" field={fields.AlertsIntro} />
              <SitecoreLink field={fields.SubscribeLink} className="bma-footer__subscribe" />
            </div>
          </div>

          <div className="bma-footer__social-col" aria-label="Social links">
            <Placeholder name={socialPh} rendering={rendering} />
          </div>
        </div>
      </div>

      <div className="bma-footer__bottom">
        <div className="bma-footer__bottom-inner">
          <ul className="bma-footer__legal-list">
            <li>
              <Text tag="span" field={fields.Copyright} />
            </li>
            <li>
              <SitecoreLink field={fields.PrivacyLink} className="bma-footer__legal-link" />
            </li>
            <li>
              <SitecoreLink field={fields.TermsLink} className="bma-footer__legal-link" />
            </li>
          </ul>
          <div className="bma-footer__sitemap">
            <SitecoreLink field={fields.SitemapLink} className="bma-footer__sitemap-link" />
          </div>
        </div>
      </div>
    </footer>
  );
};
