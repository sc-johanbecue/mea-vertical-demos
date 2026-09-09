'use client';

import type { JSX } from 'react';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface PageUtilityActionsFields {
  ShowShare: TextField;
  ShowPrint: TextField;
  ShowEmail: TextField;
}

const defaultFields: PageUtilityActionsFields = {
  ShowShare: { value: '1' },
  ShowPrint: { value: '1' },
  ShowEmail: { value: '1' },
};

export type PageUtilityActionsProps = ComponentProps & { fields?: PageUtilityActionsFields };

function isEnabled(field?: TextField): boolean {
  const value = String(field?.value ?? '')
    .trim()
    .toLowerCase();
  return value === '1' || value === 'true' || value === 'yes';
}

export const Default = (props: PageUtilityActionsProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const showShare = isEnabled(fields.ShowShare);
  const showPrint = isEnabled(fields.ShowPrint);
  const showEmail = isEnabled(fields.ShowEmail);

  const share = () => {
    const nav = typeof window !== 'undefined' ? window.navigator : undefined;
    if (nav && typeof nav.share === 'function') {
      void nav.share({ title: document.title, url: window.location.href });
      return;
    }
    void nav?.clipboard?.writeText(window.location.href);
  };

  const printPage = () => window.print();

  const emailPage = () => {
    const subject = encodeURIComponent(document.title);
    const body = encodeURIComponent(window.location.href);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div
      key={componentKey(props)}
      className={`bma-page-actions ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {showShare ? (
        <button type="button" className="bma-page-actions__btn" onClick={share}>
          <span className="bma-page-actions__icon bma-page-actions__icon--share" aria-hidden="true" />
          Share
        </button>
      ) : null}
      {showPrint ? (
        <button type="button" className="bma-page-actions__btn" onClick={printPage}>
          <span className="bma-page-actions__icon bma-page-actions__icon--print" aria-hidden="true" />
          Print
        </button>
      ) : null}
      {showEmail ? (
        <button type="button" className="bma-page-actions__btn" onClick={emailPage}>
          <span className="bma-page-actions__icon bma-page-actions__icon--email" aria-hidden="true" />
          Email
        </button>
      ) : null}
    </div>
  );
};
