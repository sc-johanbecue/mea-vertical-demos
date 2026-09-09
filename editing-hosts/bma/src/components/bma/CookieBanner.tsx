'use client';

import type { JSX, MouseEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Link as SitecoreLink, RichText, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { LinkField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

const STORAGE_KEY = 'bma-cookie-consent';

export interface CookieBannerFields {
  Body: RichTextField;
  PolicyLink: LinkField;
}

const defaultFields: CookieBannerFields = {
  Body: { value: '<p>We use cookies to improve your experience on our website.</p>' },
  PolicyLink: { value: { href: '/privacy', text: 'Privacy policy' } },
};

export type CookieBannerProps = ComponentProps & { fields?: CookieBannerFields };

export const Default = (props: CookieBannerProps): JSX.Element | null => {
  const { params, fields = defaultFields } = props;
  const { page } = useSitecore();
  const isEditing = page?.mode?.isEditing ?? false;
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (isEditing) {
      setDismissed(false);
      return;
    }
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === 'accepted');
    } catch {
      setDismissed(false);
    }
  }, [isEditing]);

  const dismiss = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!isEditing) {
        try {
          localStorage.setItem(STORAGE_KEY, 'accepted');
        } catch {
          /* ignore */
        }
      }
      setDismissed(true);
    },
    [isEditing],
  );

  if (dismissed && !isEditing) return null;

  return (
    <div
      key={componentKey(props)}
      className={`bma-cookie ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="bma-cookie__inner">
        <div className="bma-cookie__body">
          <RichText field={fields.Body} />
          <SitecoreLink field={fields.PolicyLink} className="bma-cookie__policy" />
        </div>
        <button type="button" className="bma-cookie__dismiss" onClick={dismiss}>
          Accept
        </button>
      </div>
    </div>
  );
};
