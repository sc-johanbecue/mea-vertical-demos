'use client';

import type { AnchorHTMLAttributes, JSX, ReactNode } from 'react';
import { Link } from '@sitecore-content-sdk/nextjs';
import type { LinkField } from '@sitecore-content-sdk/nextjs';
import { hasLinkField, normalizeLinkField } from '@/lib/component-utils';

type FieldLinkProps = {
  field?: LinkField;
  className?: string;
  /** When true (default), Sitecore link text is shown alongside children (e.g. icons). */
  showText?: boolean;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>;

/**
 * Sitecore General Link helper:
 * - normalizes url → href so Content SDK does not treat the field as empty
 * - keeps field text visible when an icon/child is present
 */
export const FieldLink = ({
  field,
  className,
  showText = true,
  children,
  ...rest
}: FieldLinkProps): JSX.Element | null => {
  const normalized = normalizeLinkField(field);
  if (!normalized || !hasLinkField(normalized)) return null;

  return (
    <Link
      field={normalized}
      className={className}
      showLinkTextWithChildrenPresent={showText}
      {...rest}
    >
      {children}
    </Link>
  );
};
