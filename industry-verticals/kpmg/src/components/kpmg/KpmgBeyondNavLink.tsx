'use client';

import type { JSX } from 'react';
import { LinkField, Link as SitecoreLink, Text, TextField } from '@sitecore-content-sdk/nextjs';
import { usePathname } from 'next/navigation';
import { ComponentProps } from '@/lib/component-props';
import { NavIcon, type NavIconId } from './kpmg-beyond-icons';

export interface KpmgBeyondNavLinkFields {
  Label: TextField;
  Link: LinkField;
  /** home | events | communities | insights | solutions | contact | referral */
  Icon: TextField;
}

const defaultFields: KpmgBeyondNavLinkFields = {
  Label: { value: 'Home' },
  Link: { value: { href: '/' } },
  Icon: { value: 'home' },
};

export type KpmgBeyondNavLinkProps = ComponentProps & {
  fields: KpmgBeyondNavLinkFields;
};

function isActivePath(pathname: string, href: string): boolean {
  if (!href || href === '#') return false;
  const path = href.split('?')[0].replace(/\/$/, '') || '/';
  const current = pathname.replace(/\/$/, '') || '/';
  if (path === '/') return current === '/' || current === '';
  return current === path || current.startsWith(`${path}/`);
}

export const Default = (props: KpmgBeyondNavLinkProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const pathname = usePathname();
  const href = fields.Link?.value?.href ?? '/';
  const active = isActivePath(pathname, href);
  const iconId = (fields.Icon?.value?.toString().toLowerCase() || 'home') as NavIconId;
  const componentKey = props.rendering?.uid ?? id ?? 'nav-link';

  return (
    <SitecoreLink
      key={componentKey}
      field={fields.Link}
      className={`block no-underline ${styles || ''}`}
      id={id}
    >
      {/* Desktop: icon above label */}
      <div
        className={[
          'hidden border-l-4 xl:flex xl:h-[100px] xl:flex-col xl:items-center xl:justify-center',
          active ? 'border-kpmg-accent' : 'border-transparent',
        ].join(' ')}
      >
        <div className="flex flex-col items-center">
          <NavIcon id={iconId} active={active} />
          <Text
            tag="span"
            field={fields.Label}
            className={[
              'mt-0 max-w-[100px] text-center text-sm leading-tight',
              active ? 'font-bold text-white' : 'font-normal text-white',
            ].join(' ')}
          />
        </div>
      </div>

      {/* Mobile drawer: icon left, label right */}
      <div
        className={[
          'flex h-[60px] items-center border-l-4 xl:hidden',
          active ? 'border-kpmg-accent' : 'border-transparent',
        ].join(' ')}
      >
        <span className="ml-10 flex w-9 shrink-0 justify-center">
          <NavIcon id={iconId} active={active} />
        </span>
        <Text
          tag="span"
          field={fields.Label}
          className={['ml-10 text-lg text-white', active ? 'font-bold' : 'font-normal'].join(' ')}
        />
      </div>
    </SitecoreLink>
  );
};
