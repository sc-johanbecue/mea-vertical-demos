'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink } from '@sitecore-content-sdk/nextjs';
import type { LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface TopBarFields {
  PrimaryLink: LinkField;
  SecondaryLink: LinkField;
}

const defaultFields: TopBarFields = {
  PrimaryLink: { value: { href: 'https://www.bma.bm/coin-catalogues/commemorative-coins', text: 'Commemorative Coins' } },
  SecondaryLink: { value: { href: 'https://www.bma.bm/regulated-entities', text: 'Regulated Entities' } },
};

export type TopBarProps = ComponentProps & { fields?: TopBarFields };

export const Default = (props: TopBarProps): JSX.Element => {
  const { params, fields = defaultFields } = props;

  return (
    <div
      key={componentKey(props)}
      className={`bma-topbar ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bma-topbar__inner">
        <SitecoreLink field={fields.PrimaryLink} className="bma-topbar__btn" />
        <SitecoreLink field={fields.SecondaryLink} className="bma-topbar__btn" />
      </div>
    </div>
  );
};
