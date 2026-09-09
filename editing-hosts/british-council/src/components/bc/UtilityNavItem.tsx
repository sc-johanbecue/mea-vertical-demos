'use client';

import type { JSX } from 'react';
import { Image, Link as SitecoreLink } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { useHeaderNav } from '@/components/bc/header-nav-context';

export interface UtilityNavItemFields {
  Link: LinkField;
  Icon: ImageField;
}

const defaultFields: UtilityNavItemFields = {
  Link: { value: { href: '/', text: 'Utility link' } },
  Icon: { value: { src: '', alt: '' } },
};

export type UtilityNavItemProps = ComponentProps & { fields?: UtilityNavItemFields };

function hasIcon(field?: ImageField): boolean {
  return Boolean(field?.value && 'src' in field.value && field.value.src);
}

function Layout(props: UtilityNavItemProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  const { closeMenu } = useHeaderNav();
  return (
    <li
      key={componentKey(props)}
      className={`bc-utility-item component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {hasIcon(fields.Icon) ? (
        <SitecoreLink field={fields.Link} className="bc-utility-item__link" onClick={() => closeMenu()}>
          <Image field={fields.Icon} />
          <span>{fields.Link?.value?.text}</span>
        </SitecoreLink>
      ) : (
        <SitecoreLink field={fields.Link} className="bc-utility-item__link" onClick={() => closeMenu()} />
      )}
    </li>
  );
}

export const Default = (p: UtilityNavItemProps): JSX.Element => Layout(p);
export const Inversed = (p: UtilityNavItemProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: UtilityNavItemProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: UtilityNavItemProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
