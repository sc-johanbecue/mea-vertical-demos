'use client';

import React, { type JSX } from 'react';
import {
  TextField,
  ImageField,
  LinkField,
  Text,
  Image as JssImage,
  Link as JssLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface BulletPoint {
  fields: {
    Text: TextField;
  };
}

interface Fields {
  Heading: TextField;
  BulletPoints: BulletPoint[];
  ButtonText: TextField;
  ButtonLink: LinkField;
  BottomLinkText: TextField;
  BottomLink: LinkField;
  PhoneImage: ImageField;
  /** Dictionary key: EmailSignup_InputPlaceholder */
  InputPlaceholder: TextField;
  /** Dictionary key: EmailSignup_EmailLabel */
  EmailLabel: TextField;
}

const defaultFields: Fields = {
  Heading: { value: 'Stay up to date with your new home journey' },
  BulletPoints: [
    { fields: { Text: { value: 'Save your favourite homes' } } },
    { fields: { Text: { value: 'Track development news and updates' } } },
    { fields: { Text: { value: 'Receive exclusive offers and promotions' } } },
  ],
  ButtonText: { value: 'Register Now' },
  ButtonLink: { value: { href: '/register' } },
  BottomLinkText: { value: 'Already have an account? Sign in' },
  BottomLink: { value: { href: '/login' } },
  PhoneImage: { value: { src: '', alt: 'Mobile App Preview' } },
  InputPlaceholder: { value: 'Email address' },
  EmailLabel: { value: 'Email address' },
};

export type EmailSignupCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: EmailSignupCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <div className={`component email-signup-card ${styles}`} id={id}>
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
        {/* Phone Mockups - Left Side */}
        <div className="flex w-full shrink-0 justify-center lg:w-1/2">
          <div className="relative w-full max-w-md">
            <JssImage field={fields.PhoneImage} className="h-auto w-full object-contain" />
          </div>
        </div>

        {/* Content - Right Side */}
        <div className="flex-1 text-white">
          {/* Heading */}
          <h2 className="mb-6 text-2xl leading-tight font-bold md:text-3xl lg:text-4xl">
            <Text field={fields.Heading} />
          </h2>

          {/* Bullet Points */}
          <ul className="mb-8 space-y-3">
            {fields.BulletPoints?.map((bullet, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1.5 text-white">•</span>
                <span className="text-sm text-white/90 md:text-base">
                  <Text field={bullet.fields.Text} />
                </span>
              </li>
            ))}
          </ul>

          {/* Email Input */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-white">
              {fields.EmailLabel?.value}
            </label>
            <input
              type="email"
              placeholder={fields.InputPlaceholder?.value as string}
              className="text-foreground placeholder:text-muted-foreground focus:ring-secondary w-full max-w-md rounded bg-white px-4 py-3 focus:ring-2 focus:outline-none"
            />
          </div>

          {/* CTA Button */}
          <JssLink
            field={fields.ButtonLink}
            className="inline-block min-w-50 rounded bg-[#0072CE] px-8 py-3 text-center font-semibold text-white transition-colors hover:bg-[#005ba3]"
          >
            <Text field={fields.ButtonText} />
          </JssLink>
        </div>
      </div>

      {/* Bottom Link */}
      <div className="mt-8 border-t border-white/20 pt-4 text-center">
        <JssLink
          field={fields.BottomLink}
          className="text-sm font-medium text-white underline transition-colors hover:text-white/80"
        >
          <Text field={fields.BottomLinkText} />
        </JssLink>
      </div>
    </div>
  );
};
