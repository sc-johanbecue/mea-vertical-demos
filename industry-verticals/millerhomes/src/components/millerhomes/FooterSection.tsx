import React, { type JSX } from 'react';
import {
  TextField,
  Text,
  ImageField,
  Image as SitecoreImage,
  LinkField,
  Link as SitecoreLink,
  Placeholder,
  ComponentRendering,
  ComponentParams,
} from '@sitecore-content-sdk/nextjs';

/**
 * FooterSection Component
 * Miller Homes style footer with dark navy background
 *
 * Layout:
 * - Dark navy (#003057) main section with link columns, social icons, and badges
 * - Bottom bar with copyright and legal links
 * - Uses placeholders for link lists (compatible with LinkList component)
 */

interface Fields {
  /** Column titles */
  TitleOne: TextField;
  TitleTwo: TextField;

  /** Social/CTA heading */
  SocialHeading: TextField;

  /** Social links */
  TwitterLink: LinkField;
  FacebookLink: LinkField;
  InstagramLink: LinkField;
  YoutubeLink: LinkField;
  LinkedinLink: LinkField;

  /** Badges */
  TrustpilotBadge: ImageField;
  ConsumerCodeBadge: ImageField;
  TSIBadge: ImageField;
  NewHomesQualityBadge: ImageField;

  /** Bottom bar */
  CopyrightText: TextField;
  PrivacyPolicyLink: LinkField;
  AccessibilityLink: LinkField;
  TermsLink: LinkField;
  CookiePolicyLink: LinkField;
  PrivacySettingsLink: LinkField;
}

const defaultFields: Fields = {
  TitleOne: { value: 'Inspire Me' },
  TitleTwo: { value: 'Miller Homes' },
  SocialHeading: { value: 'Visit our Inspiration Hub' },
  TwitterLink: { value: { href: 'https://twitter.com/millerhomes' } },
  FacebookLink: { value: { href: 'https://facebook.com/millerhomes' } },
  InstagramLink: { value: { href: 'https://instagram.com/millerhomes' } },
  YoutubeLink: { value: { href: 'https://youtube.com/millerhomes' } },
  LinkedinLink: { value: { href: 'https://linkedin.com/company/millerhomes' } },
  TrustpilotBadge: { value: { src: '', alt: 'Trustpilot' } },
  ConsumerCodeBadge: { value: { src: '', alt: 'Consumer Code for Home Builders' } },
  TSIBadge: { value: { src: '', alt: 'TSI Approved Code' } },
  NewHomesQualityBadge: { value: { src: '', alt: 'New Homes Quality Code' } },
  CopyrightText: {
    value: '© Miller Homes Limited 2026 - All rights reserved, Registered in Scotland No. SC255429',
  },
  PrivacyPolicyLink: { value: { href: '/privacy-policy', text: 'Privacy Policy - updated' } },
  AccessibilityLink: { value: { href: '/accessibility', text: 'Accessibility' } },
  TermsLink: { value: { href: '/terms', text: 'Terms & Conditions' } },
  CookiePolicyLink: { value: { href: '/cookies', text: 'Cookie Policy' } },
  PrivacySettingsLink: { value: { href: '#', text: 'Privacy Settings' } },
};

export type FooterSectionProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: FooterSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  // Placeholder keys for link lists
  const phKeyOne = `footer-list-first-${DynamicPlaceholderId}`;
  const phKeyTwo = `footer-list-second-${DynamicPlaceholderId}`;

  return (
    <footer className={`component footer-section ${styles || ''}`} id={id}>
      {/* Main Footer Content - Dark Navy Background */}
      <div className="bg-[#003057] py-10 text-white lg:py-14">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            {/* Link Columns */}
            <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
              {/* Column 1 */}
              <div>
                <h3 className="mb-4 text-base font-bold text-white">
                  <Text field={fields.TitleOne} />
                </h3>
                <div className="footer-links">
                  <Placeholder name={phKeyOne} rendering={props.rendering} />
                </div>

                {/* Social Heading & Icons */}
                <div className="mt-6">
                  <h4 className="mb-3 text-sm font-bold text-white">
                    <Text field={fields.SocialHeading} />
                  </h4>
                  <div className="flex items-center gap-4">
                    {fields.TwitterLink?.value?.href && (
                      <SitecoreLink
                        field={fields.TwitterLink}
                        className="text-white transition-colors hover:text-[#00B5E2]"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </SitecoreLink>
                    )}
                    {fields.FacebookLink?.value?.href && (
                      <SitecoreLink
                        field={fields.FacebookLink}
                        className="text-white transition-colors hover:text-[#00B5E2]"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </SitecoreLink>
                    )}
                    {fields.InstagramLink?.value?.href && (
                      <SitecoreLink
                        field={fields.InstagramLink}
                        className="text-white transition-colors hover:text-[#00B5E2]"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </SitecoreLink>
                    )}
                    {fields.YoutubeLink?.value?.href && (
                      <SitecoreLink
                        field={fields.YoutubeLink}
                        className="text-white transition-colors hover:text-[#00B5E2]"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </SitecoreLink>
                    )}
                    {fields.LinkedinLink?.value?.href && (
                      <SitecoreLink
                        field={fields.LinkedinLink}
                        className="text-white transition-colors hover:text-[#00B5E2]"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </SitecoreLink>
                    )}
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div>
                <h3 className="mb-4 text-base font-bold text-white">
                  <Text field={fields.TitleTwo} />
                </h3>
                <div className="footer-links">
                  <Placeholder name={phKeyTwo} rendering={props.rendering} />
                </div>
              </div>
            </div>

            {/* Badges - Right side on desktop, below on mobile */}
            <div className="flex flex-wrap items-start gap-4 lg:ml-auto lg:gap-6">
              <div
                className="trustpilot-widget max-h-[85px] max-w-[150px]"
                data-locale="en-GB"
                data-template-id="53aa8807dec7e10d38f59f32"
                data-businessunit-id="5803fd7b0000ff0005962025"
                data-style-height="150px"
                data-style-width="100%"
                data-theme="dark"
                data-text-color="#ffffff"
              >
                <a
                  href="https://uk.trustpilot.com/review/millerhomes.co.uk"
                  target="_blank"
                  rel="noopener"
                >
                  Trustpilot
                </a>
              </div>
              {fields.ConsumerCodeBadge?.value?.src && (
                <SitecoreImage
                  field={fields.ConsumerCodeBadge}
                  className="h-16 w-auto object-contain"
                />
              )}
              {fields.TSIBadge?.value?.src && (
                <SitecoreImage field={fields.TSIBadge} className="h-16 w-auto object-contain" />
              )}
              {fields.NewHomesQualityBadge?.value?.src && (
                <SitecoreImage
                  field={fields.NewHomesQualityBadge}
                  className="h-16 w-auto object-contain"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Darker Navy */}
      <div className="bg-[#002040] py-5 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 text-xs lg:flex-row lg:items-center lg:justify-between">
            <div className="text-white/80">
              <Text field={fields.CopyrightText} />
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
              {fields.PrivacyPolicyLink?.value?.href && (
                <SitecoreLink
                  field={fields.PrivacyPolicyLink}
                  className="text-white/80 transition-colors hover:text-white"
                />
              )}
              {fields.AccessibilityLink?.value?.href && (
                <SitecoreLink
                  field={fields.AccessibilityLink}
                  className="text-white/80 transition-colors hover:text-white"
                />
              )}
              {fields.TermsLink?.value?.href && (
                <SitecoreLink
                  field={fields.TermsLink}
                  className="text-white/80 transition-colors hover:text-white"
                />
              )}
              {fields.CookiePolicyLink?.value?.href && (
                <SitecoreLink
                  field={fields.CookiePolicyLink}
                  className="text-white/80 transition-colors hover:text-white"
                />
              )}
              {fields.PrivacySettingsLink?.value?.href && (
                <SitecoreLink
                  field={fields.PrivacySettingsLink}
                  className="text-white/80 transition-colors hover:text-white"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Styling for placeholder link lists */}
      <style jsx global>{`
        .footer-links .link-list h3 {
          display: none;
        }
        .footer-links .link-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-links .link-list li {
          margin-bottom: 0.5rem;
        }
        .footer-links .link-list a {
          color: white;
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-links .link-list a:hover {
          color: #00b5e2;
        }
      `}</style>
    </footer>
  );
};
