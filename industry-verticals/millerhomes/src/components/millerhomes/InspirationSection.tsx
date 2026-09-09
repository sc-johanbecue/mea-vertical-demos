import React, { type JSX } from 'react';
import {
  TextField,
  Text,
  RichTextField,
  RichText,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * InspirationSection Component
 * "It's time to get inspired" section with video background
 *
 * Features:
 * - Mobile/Tablet: Video on top, stacked content below (centered)
 * - Desktop: Autoplay video background with white content card overlay on left
 * - Title split: "It's time to" in blue italic, "get inspired" in dark blue bold
 * - Video: autoplay, loop, muted, playsInline
 */

interface Fields {
  /** Video (autoplay, loop, muted) - used on all breakpoints */
  Video: LinkField;
  TitlePart1: TextField;
  TitleHighlight: TextField;
  Description: RichTextField;
  CTAText: TextField;
  CTALink: LinkField;
}

const defaultFields: Fields = {
  Video: { value: { src: '', title: 'Inspiration Video' } },
  TitlePart1: { value: "It's time to" },
  TitleHighlight: { value: 'get inspired' },
  Description: {
    value:
      '<p>Our Inspiration Hub has everything you need to get planning for your new home. From interior design tips and house tours to buyer guides and financial calculators, the Inspiration Hub has all this and more to help you start your new adventure.</p>',
  },
  CTAText: { value: 'Visit our Inspiration Hub' },
  CTALink: { value: { href: '/inspiration-hub' } },
};

export type InspirationSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: InspirationSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <section className={`component inspiration-section ${styles || ''}`} id={id}>
      {/* Mobile/Tablet: Stacked layout */}
      <div className="lg:hidden">
        {/* Video - Full width */}
        <div className="aspect-video w-full overflow-hidden">
          <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
            <source src={fields.Video.value?.href as string} type="video/mp4" />
            {"Sorry, your browser doesn't support embedded videos."}
          </video>
        </div>

        {/* Content - Centered text */}
        <div className="space-y-4 bg-white p-6">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl md:text-4xl">
              <span className="font-light text-[#0072CE] italic">
                <Text field={fields.TitlePart1} />
              </span>{' '}
              <span className="font-semibold text-[#003057]">
                <Text field={fields.TitleHighlight} />
              </span>
            </h2>

            <div className="text-foreground-light text-sm leading-relaxed">
              <RichText field={fields.Description} />
            </div>
          </div>

          <div className="flex flex-col">
            <SitecoreLink
              field={fields.CTALink}
              className="bg-[#003057] px-6 py-3.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#002040]"
            >
              <Text field={fields.CTAText} />
            </SitecoreLink>
          </div>
        </div>
      </div>

      {/* Desktop: Video background with overlaid content card */}
      <div className="relative hidden lg:block">
        {/* Full-width background video */}
        <div className="relative h-125 w-full overflow-hidden">
          <video
            width="1920"
            height="563"
            className="absolute inset-0 h-full w-full scale-105 object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={fields.Video.value.href} type="video/mp4" />
            {"Sorry, your browser doesn't support embedded videos."}
          </video>
        </div>

        {/* Content card overlay */}
        <div className="absolute inset-0 z-10 mx-auto max-w-screen-2xl px-4">
          <div className="flex h-full items-center lg:max-w-108">
            <div className="space-y-6 bg-white p-8">
              <div className="space-y-4 text-left">
                <h2 className="text-4xl xl:text-5xl">
                  <span className="font-light text-[#0072CE] italic">
                    <Text field={fields.TitlePart1} />
                  </span>
                  <br />
                  <span className="font-semibold text-[#003057]">
                    <Text field={fields.TitleHighlight} />
                  </span>
                </h2>

                <div className="text-foreground-light text-sm leading-relaxed">
                  <RichText field={fields.Description} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <SitecoreLink
                  field={fields.CTALink}
                  className="bg-[#003057] px-6 py-3.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#002040]"
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
