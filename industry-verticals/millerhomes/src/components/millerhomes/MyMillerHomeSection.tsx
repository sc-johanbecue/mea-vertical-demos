'use client';

import type { JSX } from 'react';
import {
  TextField,
  ImageField,
  LinkField,
  RichTextField,
  Text,
  RichText,
  Image as SitecoreImage,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * MyMillerHomeSection Component
 * Promotional section for My Miller Home app (Hampton page style)
 *
 * Features:
 * - "Welcome To My Miller Home" heading
 * - Description text
 * - Benefits list
 * - CTA button
 * - Phone mockup image on right
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Description */
  Description: RichTextField;
  /** CTA link */
  CTALink: LinkField;
  /** CTA text */
  CTAText: TextField;
  /** Phone mockup image */
  Image: ImageField;
  /** Dictionary key: MyMillerHome_WelcomeTo */
  WelcomeToText: TextField;
  /** Dictionary key: MyMillerHome_LogoPrefix */
  LogoPrefix: TextField;
  /** Dictionary key: MyMillerHome_LogoMiller */
  LogoMiller: TextField;
  /** Dictionary key: MyMillerHome_LogoHome */
  LogoHome: TextField;
  /** Dictionary key: MyMillerHome_PhoneMockup */
  PhoneMockupText: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'My Miller Home' },
  Description: {
    value:
      '<p>My Miller Home is your personalised app and website where you can:</p><ul><li>Save your favourite homes and developments in My Miller Home to browse at your leisure, while we keep you updated by managing the communications your receive from us as you and find the new home service at the moment you need</li></ul>',
  },
  CTALink: { value: { href: '/my-miller-home' } },
  CTAText: { value: 'Find Out More' },
  Image: { value: { src: '', alt: 'My Miller Home App' } },
  WelcomeToText: { value: 'Welcome To' },
  LogoPrefix: { value: 'My' },
  LogoMiller: { value: 'Miller' },
  LogoHome: { value: 'Home' },
  PhoneMockupText: { value: 'Phone mockup' },
};

export type MyMillerHomeSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: MyMillerHomeSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <div
      className={`component my-miller-home-section bg-[#f5f5f5] py-12 md:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Title */}
            <h2 className="mb-2 text-2xl font-light md:text-3xl">
              <span className="text-[#003057]">
                <Text field={fields.WelcomeToText} />
              </span>
            </h2>
            <h3 className="mb-6 text-3xl font-bold md:text-4xl">
              <span className="text-[#003057]">
                <Text field={fields.LogoPrefix} />
              </span>
              <span className="text-[#003057]">
                {' '}
                <Text field={fields.LogoMiller} />
              </span>
              <span className="text-[#0072CE]">
                {' '}
                <Text field={fields.LogoHome} />
              </span>
            </h3>

            {/* Description */}
            <div className="prose prose-sm mb-6 max-w-none text-[#4a4a4a]">
              <RichText field={fields.Description} />
            </div>

            {/* CTA Button */}
            <SitecoreLink
              field={fields.CTALink}
              className="inline-flex items-center gap-2 rounded border-2 border-[#003057] bg-transparent px-6 py-3 text-sm font-medium text-[#003057] transition-colors hover:bg-[#003057] hover:text-white"
            >
              <Text field={fields.CTAText} />
            </SitecoreLink>
          </div>

          {/* Phone Mockup */}
          <div className="flex-shrink-0 lg:w-1/3">
            <SitecoreImage field={fields.Image} className="mx-auto h-auto w-full max-w-[280px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
