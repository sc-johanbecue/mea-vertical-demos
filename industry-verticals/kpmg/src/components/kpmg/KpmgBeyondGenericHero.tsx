'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { Image, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  fileSrc,
  genericCtaClassName,
  imageAlt,
  imageSrc,
  joinHref,
  linkText,
  loginHref,
} from './kpmg-beyond-generic-shared';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export interface KpmgBeyondGenericHeroFields {
  HeroImage: ImageField;
  HeroVideo: LinkField;
  SocialProofText: TextField;
  SecondaryJoinLink: LinkField;
  SecondaryLoginLink: LinkField;
}

const defaultFields: KpmgBeyondGenericHeroFields = {
  HeroImage: { value: { src: '', alt: 'Beyond platform graphic' } },
  HeroVideo: { value: { href: '' } },
  SocialProofText: { value: 'Sign up and join 4,000+ business leaders.' },
  SecondaryJoinLink: { value: { href: '/join', text: 'Join Beyond' } },
  SecondaryLoginLink: { value: { href: '/auth/login', text: 'Login' } },
};

export type KpmgBeyondGenericHeroProps = ComponentProps & {
  fields: KpmgBeyondGenericHeroFields;
};

export const Default = (props: KpmgBeyondGenericHeroProps): JSX.Element => {
  const fields = props.fields || defaultFields;
  const editingHydration = useEditingHydrationProps();
  const { page } = useSitecore();
  const isEditing = Boolean(page.mode?.isEditing);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const heroSrc = imageSrc(fields.HeroImage);
  const videoSrc = fileSrc(fields.HeroVideo);
  const canPlayVideo = Boolean(videoSrc) && !isEditing;
  const fullWidthMediaClassName =
    'relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2';

  const heroImage = heroSrc ? (
    <Image
      field={fields.HeroImage}
      className="block h-auto w-full"
      alt={imageAlt(fields.HeroImage, 'Beyond platform graphic')}
    />
  ) : (
    <div
      className="flex h-[220px] w-full items-center justify-center border border-white/10 bg-kpmg-elevated xl:h-[320px]"
      aria-hidden
    >
      <div className="h-32 w-32 rounded-full bg-gradient-to-br from-kpmg-purple to-kpmg-label opacity-80" />
    </div>
  );

  return (
    <section
      {...editingHydration}
      data-cy="generic-hero"
      className="component kpmg-beyond-generic-hero relative overflow-hidden bg-kpmg-bg px-5 pb-16 pt-4 xl:px-8 xl:pb-24 xl:pt-6"
    >
      <div className="relative mx-auto max-w-[1200px] text-center">
        <div className="mt-4 xl:mt-8">
          {isVideoPlaying && videoSrc ? (
            <div className={fullWidthMediaClassName} data-cy="generic-hero-video">
              <video
                className="block h-auto w-full"
                controls
                autoPlay
                playsInline
                src={videoSrc}
              />
              <button
                type="button"
                className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/60 px-3 py-1 text-sm text-white transition-colors hover:bg-black/80"
                onClick={() => setIsVideoPlaying(false)}
                aria-label="Close video"
              >
                Close
              </button>
            </div>
          ) : (
            <div className={fullWidthMediaClassName} data-cy="generic-hero-media">
              {canPlayVideo ? (
                <button
                  type="button"
                  className="group block w-full cursor-pointer border-0 bg-transparent p-0"
                  onClick={() => setIsVideoPlaying(true)}
                  aria-label="Play hero video"
                  data-cy="generic-hero-video-trigger"
                >
                  <span className="relative block overflow-hidden">
                    {heroImage}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-kpmg-bg">
                        ▶
                      </span>
                    </span>
                  </span>
                </button>
              ) : (
                heroImage
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
