'use client';

import type { JSX } from 'react';
import {
  TextField,
  ImageField,
  LinkField,
  RichTextField,
  Text,
  Image as SitecoreImage,
  Link as SitecoreLink,
  RichText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { usePepsiCoHeroDesktopBg } from '@/components/pepsico/pepsico-hero-desktop-bg-context';

export interface PepsiCoHeroCardFields {
  Image: ImageField;
  Heading: TextField;
  Description: RichTextField;
  Cta: LinkField;
}

const defaultFields: PepsiCoHeroCardFields = {
  Image: { value: { src: '', alt: '' } },
  Heading: { value: 'Health insurance benefits for all the family' },
  Description: {
    value:
      '<p>Our health insurance supports your family with dental care, mental health services and around the clock advice. And with PepsiCo Family+, pay for one child under 20 and we&rsquo;ll cover the rest with an extra 10% off family cover &Dagger;</p>',
  },
  Cta: { value: { href: '#', text: 'Get a health insurance quote' } },
};

export type PepsiCoHeroCardProps = ComponentProps & {
  fields: PepsiCoHeroCardFields;
};

export const Default = (props: PepsiCoHeroCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles: paramStyles } = props.params;
  const fields = props.fields || defaultFields;
  const inDesktopBgHero = usePepsiCoHeroDesktopBg();

  return (
    <div
      key={id ?? props.rendering?.uid}
      className={`component pepsico-hero-card w-full min-w-0 ${paramStyles || ''}`.trim()}
      id={id}
    >
      <article
        className={
          inDesktopBgHero
            ? [
                'flex w-full min-w-0 flex-col overflow-hidden rounded-[1.25rem]',
                'lg:min-h-0 lg:flex-row lg:items-center lg:rounded-xl',
              ].join(' ')
            : [
                'flex w-full min-w-0 flex-col overflow-hidden rounded-[1.25rem] bg-white',
                'shadow-[0_2px_8px_rgba(0,43,92,0.06),0_4px_20px_rgba(0,43,92,0.08)]',
                'lg:min-h-55 lg:flex-row lg:rounded-[1.125rem]',
                'lg:bg-[linear-gradient(90deg,#f8f9fb_0%,#f3f5f7_45%,#e9ecf1_100%)]',
                'lg:shadow-[0_2px_8px_rgba(0,43,92,0.07),0_6px_24px_rgba(0,43,92,0.1)]',
              ].join(' ')
        }
      >
        <div
          className={
            inDesktopBgHero
              ? [
                  'pepsico-hero-card__media relative aspect-16/10 w-full shrink-0 overflow-hidden rounded-t-[1.25rem] bg-[#e8ecf0]',
                  'lg:my-4 lg:mr-2 lg:ml-5 lg:aspect-4/3 lg:h-auto lg:min-h-0 lg:w-41 lg:shrink-0 lg:rounded-xl',
                ].join(' ')
              : [
                  'pepsico-hero-card__media relative aspect-16/10 w-full shrink-0 overflow-hidden bg-[#e8ecf0]',
                  'lg:aspect-auto lg:min-h-full lg:w-[40%] lg:max-w-[40%] lg:flex-[0_0_40%] lg:self-stretch',
                  'lg:rounded-none lg:rounded-tl-[1.125rem] lg:rounded-bl-[1.125rem]',
                ].join(' ')
          }
        >
          <SitecoreImage
            field={fields.Image}
            className={
              inDesktopBgHero
                ? 'block h-full w-full object-cover object-center lg:aspect-4/3 lg:max-h-31 lg:min-h-0'
                : 'block h-full w-full object-cover object-center lg:min-h-full'
            }
          />
        </div>
        <div
          className={
            inDesktopBgHero
              ? [
                  'pepsico-hero-card__body flex min-w-0 flex-col items-stretch px-6 text-left sm:px-7',
                  'lg:flex-1 lg:justify-center lg:px-6 lg:pr-7 lg:pl-3',
                  'xl:px-7 xl:pb-2',
                ].join(' ')
              : [
                  'pepsico-hero-card__body flex min-w-0 flex-col items-stretch px-6 pt-6 pb-5 text-left sm:px-7',
                  'lg:flex-1 lg:justify-center lg:px-8 lg:pt-8 lg:pr-9 lg:pb-8 lg:pl-8',
                  'lg:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.35)_70%,rgba(255,255,255,0.55)_100%)]',
                  'xl:px-10 xl:pb-9',
                ].join(' ')
          }
        >
          <Text
            tag="h3"
            field={fields.Heading}
            className={[
              'm-0 text-xl leading-snug font-bold tracking-tight',
              inDesktopBgHero ? 'text-[#1a1a1a] lg:text-[#002b5c]' : 'text-[#1a1a1a]',
              'lg:leading-tight',
            ].join(' ')}
          />
          <RichText
            className={[
              'mt-1 text-sm leading-normal font-normal text-[#5c5c5c]',
              '[&_a]:font-medium [&_a]:text-[#0079c1] [&_a]:underline [&_a]:underline-offset-2',
              '[&_p]:mb-2 [&_p:last-child]:mb-0',
              'lg:leading-normal',
            ].join(' ')}
            field={fields.Description}
          />
          {fields.Cta?.value?.href ? (
            <SitecoreLink
              field={fields.Cta}
              className={[
                'mt-1 flex w-full items-center justify-between gap-3 rounded-lg border-0 bg-[#0079c1]',
                'px-5 py-3 text-[0.9375rem] leading-snug font-bold text-white no-underline transition-colors',
                'hover:bg-[#0065a3] hover:text-white',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002b5c]',
                'lg:w-auto lg:justify-start lg:self-start lg:px-6 lg:py-3',
              ].join(' ')}
            >
              <span className="min-w-0 flex-1 text-left lg:flex-none lg:text-left">
                {fields.Cta?.value?.text}
              </span>
              <svg
                className="h-5 w-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </SitecoreLink>
          ) : null}
        </div>
      </article>
    </div>
  );
};
