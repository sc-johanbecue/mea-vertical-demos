'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { genericCtaClassName, joinHref, linkText } from './kpmg-beyond-generic-shared';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export interface KpmgBeyondGenericFooterCtaFields {
  LeftHeading: TextField;
  RightText: TextField;
  JoinLink: LinkField;
}

const defaultFields: KpmgBeyondGenericFooterCtaFields = {
  LeftHeading: { value: 'Be a part of Beyond. Where leaders belong.' },
  RightText: {
    value: 'Sign up to Beyond and unleash the full potential of your business.',
  },
  JoinLink: { value: { href: '/join', text: 'Join Beyond' } },
};

export type KpmgBeyondGenericFooterCtaProps = ComponentProps & {
  fields: KpmgBeyondGenericFooterCtaFields;
};

export const Default = (props: KpmgBeyondGenericFooterCtaProps): JSX.Element => {
  const fields = props.fields || defaultFields;
  const editingHydration = useEditingHydrationProps();

  return (
    <section
      {...editingHydration}
      data-cy="generic-footer-cta"
      className="component kpmg-beyond-generic-footer-cta border-t border-white/10 bg-kpmg-elevated px-5 py-16 xl:px-8 xl:py-20"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 xl:grid-cols-2 xl:items-center xl:gap-12">
        <Text
          tag="h2"
          field={fields.LeftHeading}
          className="m-0 text-[28px] font-semibold leading-tight text-white xl:text-[40px]"
        />
        <div>
          <Text tag="p" field={fields.RightText} className="m-0 text-base leading-7 text-white/80 xl:text-lg" />
          <Link
            href={joinHref(fields.JoinLink)}
            className={genericCtaClassName('solid', 'mt-6')}
            data-cy="generic-footer-cta-join"
          >
            {linkText(fields.JoinLink, 'Join Beyond')}
          </Link>
        </div>
      </div>
    </section>
  );
};
