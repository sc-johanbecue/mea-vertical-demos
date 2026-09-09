import React, { type JSX } from 'react';
import {
  TextField,
  Text,
  RichTextField,
  RichText,
  ImageField,
  Image as SitecoreImage,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * FeatureSection Component
 * "With you every step of the way" section with image and text
 *
 * Features:
 * - Mobile: Image on top, light gray content area below with styled title, description, CTA
 * - Desktop: Full-width background image with white content card overlay on left
 * - Title: "With you every" in cyan, "step of the way" in dark blue
 */

interface Fields {
  BackgroundImage: ImageField;
  TitlePart1: TextField;
  TitlePart2: TextField;
  Description: RichTextField;
  CTAText: TextField;
  CTALink: LinkField;
}

const defaultFields: Fields = {
  BackgroundImage: { value: { src: '', alt: 'Feature' } },
  TitlePart1: { value: 'With you every' },
  TitlePart2: { value: 'step of the way' },
  Description: {
    value:
      "<p>We continue caring long after your dream home has been built, you've got the keys and have settled in. We're there when you need us because it's important to us that you're not just satisfied but are delighted living in your new Miller home. We have 90 years worth of customers that we have learned from and we are still listening.</p>",
  },
  CTAText: { value: 'Find out more' },
  CTALink: { value: { href: '/why-miller-homes' } },
};

export type FeatureSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: FeatureSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <section className={`component feature-section ${styles || ''}`} id={id}>
      {/* Mobile/Tablet: Stacked layout */}
      <div className="lg:hidden">
        {/* Image - Full width */}
        <div className="aspect-4/3 w-full">
          {fields.BackgroundImage?.value?.src ? (
            <SitecoreImage field={fields.BackgroundImage} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>

        {/* Content - Light gray background */}
        <div className="space-y-4 bg-[#e8eef2] p-6">
          <h2 className="text-3xl md:text-4xl">
            <span className="font-light text-[#00B5E2] italic">
              <Text field={fields.TitlePart1} />
            </span>
            <br />
            <span className="font-semibold text-[#003057]">
              <Text field={fields.TitlePart2} />
            </span>
          </h2>

          <div className="text-sm leading-relaxed text-[#003057]">
            <RichText field={fields.Description} />
          </div>

          <div>
            <SitecoreLink
              field={fields.CTALink}
              className="inline-block bg-[#003057] px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#002040]"
            >
              <Text field={fields.CTAText} />
            </SitecoreLink>
          </div>
        </div>
      </div>

      {/* Desktop: Image background with overlaid content card */}
      <div className="relative hidden lg:block">
        {/* Full-width background image */}
        <div className="relative h-112.5 w-full xl:h-125">
          {fields.BackgroundImage?.value?.src ? (
            <SitecoreImage
              field={fields.BackgroundImage}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 h-full w-full bg-gray-200" />
          )}
        </div>

        {/* Content card overlay */}
        <div className="absolute inset-0 z-10 mx-auto max-w-screen-2xl px-4">
          <div className="flex h-full items-center lg:max-w-md">
            <div className="space-y-5 bg-white p-8">
              <h2 className="text-4xl xl:text-5xl">
                <Text
                  tag="span"
                  className="font-light text-[#00B5E2] italic"
                  field={fields.TitlePart1}
                />
                <br />

                <Text
                  tag="span"
                  className="font-semibold text-[#004b91]"
                  field={fields.TitlePart2}
                />
              </h2>
              <RichText
                className="text-sm leading-relaxed text-[#004b91]"
                field={fields.Description}
              />

              <div>
                <SitecoreLink
                  field={fields.CTALink}
                  className="inline-block bg-[#003057] px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#002040]"
                >
                  <Text field={fields.CTAText} />
                </SitecoreLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
