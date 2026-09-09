'use client';

import type { JSX } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { Image, Text } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  genericCtaClassName,
  imageAlt,
  imageSrc,
  joinHref,
  linkText,
  loginHref,
} from './kpmg-beyond-generic-shared';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export interface KpmgBeyondGenericHeaderFields {
  Logo: ImageField;
  LoginLink: LinkField;
  JoinLink: LinkField;
}

const defaultFields: KpmgBeyondGenericHeaderFields = {
  Logo: { value: { src: '', alt: 'KPMG' } },
  LoginLink: { value: { href: '/auth/login', text: 'Login' } },
  JoinLink: { value: { href: '/join', text: 'Join Beyond' } },
};

export type KpmgBeyondGenericHeaderProps = ComponentProps & {
  fields: KpmgBeyondGenericHeaderFields;
};

export const Default = (props: KpmgBeyondGenericHeaderProps): JSX.Element => {
  const fields = props.fields || defaultFields;
  const editingHydration = useEditingHydrationProps();
  const logoSrc = imageSrc(fields.Logo);

  useEffect(() => {
    document.body.classList.add('kpmg-beyond-marketing-layout');
    return () => {
      document.body.classList.remove('kpmg-beyond-marketing-layout');
    };
  }, []);

  return (
    <header
      {...editingHydration}
      data-cy="generic-header"
      className="component kpmg-beyond-generic-header sticky top-0 z-50 border-b border-white/10 bg-kpmg-bg/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 xl:px-8">
        <div className="flex items-center">
          {logoSrc ? (
            <Image field={fields.Logo} className="h-8 w-auto xl:h-10" />
          ) : (
            <span className="text-xl font-bold tracking-wide text-white xl:text-2xl">KPMG</span>
          )}
        </div>
        <div className="flex items-center gap-3 xl:gap-4">
          <Link
            href={loginHref(fields.LoginLink)}
            className="rounded-full px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-white/10 xl:px-6 xl:text-base"
            data-cy="generic-header-login"
          >
            {linkText(fields.LoginLink, 'Login')}
          </Link>
          <Link
            href={joinHref(fields.JoinLink)}
            className={genericCtaClassName('solid', 'px-5 py-2 text-sm xl:px-8 xl:text-base')}
            data-cy="generic-header-join"
          >
            {linkText(fields.JoinLink, 'Join Beyond')}
          </Link>
        </div>
      </div>
    </header>
  );
};
