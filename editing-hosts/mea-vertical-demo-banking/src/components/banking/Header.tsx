'use client';

import type { JSX } from 'react';
import { Text, Image, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField } from '@sitecore-content-sdk/nextjs';
import { MagnifyingGlass, ChatCircleDots, CaretDown, List } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface HeaderFields {
  Logo?: ImageField;
  SearchLabel?: TextField;
  MessagesLabel?: TextField;
  ProfileName?: TextField;
  ProfileInitials?: TextField;
}

const defaultFields: HeaderFields = {
  Logo: {
    value: {
      src: '/assets/deb-logo.svg',
      alt: 'Digital Experience Bank',
    },
  },
  SearchLabel: { value: 'Search' },
  MessagesLabel: { value: 'Messages' },
  ProfileName: { value: 'Hi, Sarah' },
  ProfileInitials: { value: 'SA' },
};

export type HeaderProps = ComponentProps & { fields?: HeaderFields };

export const Default = (props: HeaderProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const headerNavPh = dynamicPlaceholderKey('header-nav', params);

  return (
    <header key={componentKey(props)} className={`${params?.styles ?? ''}`.trim()} id={params?.RenderingIdentifier}>
      <div className="header-main">
        <a className="logo" href="/" aria-label="Digital Experience Bank home">
          {fields.Logo ? <Image field={fields.Logo} className="logo-image" /> : null}
        </a>
        <nav aria-label="Primary navigation">
          <Placeholder name={headerNavPh} rendering={rendering} />
        </nav>
        <div className="tools">
          <button type="button" aria-label="Search">
            <MagnifyingGlass size={21} />
            {fields.SearchLabel ? <Text tag="small" field={fields.SearchLabel} /> : null}
          </button>
          <button type="button" aria-label="Messages" className="badge">
            <ChatCircleDots size={22} />
            <b>2</b>
            {fields.MessagesLabel ? <Text tag="small" field={fields.MessagesLabel} /> : null}
          </button>
          <button type="button" className="profile">
            {fields.ProfileInitials ? <Text tag="span" field={fields.ProfileInitials} /> : null}
            {fields.ProfileName ? (
              <em>
                <Text field={fields.ProfileName} />
              </em>
            ) : null}
            <CaretDown size={15} />
          </button>
          <button type="button" className="mobile-menu" aria-label="Open menu">
            <List size={28} />
          </button>
        </div>
      </div>
    </header>
  );
};
