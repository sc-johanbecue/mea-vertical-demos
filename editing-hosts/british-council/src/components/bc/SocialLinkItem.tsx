'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface SocialLinkItemFields {
  Link: LinkField;
  Platform: TextField;
}

const defaultFields: SocialLinkItemFields = {
  Link: { value: { href: '/', text: 'Social' } },
  Platform: { value: 'X' },
};

export type SocialLinkItemProps = ComponentProps & { fields?: SocialLinkItemFields };

type PlatformKey = 'x' | 'facebook' | 'linkedin' | 'youtube' | 'instagram' | 'tiktok';

function normalizePlatform(platform: string): PlatformKey {
  const key = platform.trim().toLowerCase();
  if (key === 'twitter' || key === 'x') return 'x';
  if (key === 'facebook') return 'facebook';
  if (key === 'linkedin') return 'linkedin';
  if (key === 'youtube') return 'youtube';
  if (key === 'instagram') return 'instagram';
  if (key === 'tiktok') return 'tiktok';
  return 'x';
}

function SocialIcon({ platform }: { platform: PlatformKey }): JSX.Element {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true as const };
  switch (platform) {
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.4V9.41c0-2.37 1.4-3.69 3.56-3.69 1.03 0 2.12.19 2.12.19v2.34h-1.2c-1.18 0-1.55.74-1.55 1.5v1.8h2.64l-.42 2.9h-2.22V22c4.78-.75 8.44-4.91 8.44-9.93z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...common}>
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...common}>
          <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.75 15.57V8.43L15.82 12l-6.07 3.57z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...common}>
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.52.01-4.76.07-2.25.1-3.3 1.15-3.4 3.4-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.1 2.24 1.16 3.3 3.4 3.4 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c2.25-.1 3.3-1.16 3.4-3.4.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.1-2.25-1.16-3.3-3.4-3.4-1.24-.06-1.61-.07-4.76-.07zm0 3.06a4.98 4.98 0 1 1 0 9.96 4.98 4.98 0 0 1 0-9.96zm0 8.16a3.18 3.18 0 1 0 0-6.36 3.18 3.18 0 0 0 0 6.36zm6.24-8.4a1.16 1.16 0 1 1-2.32 0 1.16 1.16 0 0 1 2.32 0z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg {...common}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.16 15.3 6.34 6.34 0 0 0 9.5 21.64a6.34 6.34 0 0 0 6.34-6.34V8.87a8.2 8.2 0 0 0 4.79 1.52V6.94a4.84 4.84 0 0 1-1.04-.25z" />
        </svg>
      );
    case 'x':
    default:
      return (
        <svg {...common}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
  }
}

function Layout(props: SocialLinkItemProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  const platform = String(fields.Platform?.value || fields.Link?.value?.text || 'Social');
  const key = normalizePlatform(platform);

  return (
    <li
      key={componentKey(props)}
      className={`bc-social-item component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <SitecoreLink
        field={fields.Link}
        className="bc-social-item__link"
        aria-label={platform}
        target="_blank"
        rel="noopener noreferrer"
      >
        <SocialIcon platform={key} />
        <Text tag="span" className="sr-only" field={fields.Platform} />
      </SitecoreLink>
    </li>
  );
}

export const Default = (p: SocialLinkItemProps): JSX.Element => Layout(p);
export const Inversed = (p: SocialLinkItemProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: SocialLinkItemProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: SocialLinkItemProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
