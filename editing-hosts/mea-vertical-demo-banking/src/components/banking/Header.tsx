'use client';

import type { JSX } from 'react';
import { Text, RichText, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface HeaderFields {
  LogoText?: TextField;
  LogoSubtext?: RichTextField;
  SearchLabel?: TextField;
  MessagesLabel?: TextField;
  ProfileName?: TextField;
  ProfileInitials?: TextField;
}

const defaultFields: HeaderFields = {
  LogoText: { value: 'DEB' },
  LogoSubtext: { value: '<p>DIGITAL EXPERIENCE BANK</p>' },
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
    <div
      key={componentKey(props)}
      className={`deb-header ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.LogoText ? <Text tag="span" field={fields.LogoText} className="deb-header__logo-text" /> : null}
      {fields.LogoSubtext ? <div className="deb-header__logo-subtext"><RichText field={fields.LogoSubtext} /></div> : null}
      {fields.SearchLabel ? <Text tag="span" field={fields.SearchLabel} className="deb-header__search-label" /> : null}
      {fields.MessagesLabel ? <Text tag="span" field={fields.MessagesLabel} className="deb-header__messages-label" /> : null}
      {fields.ProfileName ? <Text tag="span" field={fields.ProfileName} className="deb-header__profile-name" /> : null}
      {fields.ProfileInitials ? <Text tag="span" field={fields.ProfileInitials} className="deb-header__profile-initials" /> : null}
      <div className="deb-header__header-nav">
        <Placeholder name={headerNavPh} rendering={rendering} />
      </div>
    </div>
  );
};
