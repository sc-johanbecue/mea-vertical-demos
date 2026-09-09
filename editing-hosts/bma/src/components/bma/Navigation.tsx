'use client';

import { useEffect, useRef, useState, type JSX } from 'react';
import { Link as SitecoreLink, Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey, placeholderHasItems } from '@/lib/component-utils';
import { FieldImage } from '@/lib/field-image';

export interface NavigationFields {
  Link: LinkField;
  Description: TextField;
  Image: ImageField;
}

const defaultFields: NavigationFields = {
  Link: { value: { href: '#', text: 'Navigation' } },
  Description: { value: '' },
  Image: { value: { src: '', alt: '' } },
};

export type NavigationProps = ComponentProps & { fields?: NavigationFields };

const CLOSE_DELAY_MS = 160;

export const Default = (props: NavigationProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const childrenPh = dynamicPlaceholderKey('nav-children', params);
  const label = fields.Link?.value?.text?.toString().trim() || 'Menu';
  const hasIntro = Boolean(fields.Description?.value || fields.Image?.value?.src);
  const hasChildren = placeholderHasItems(rendering, childrenPh);
  const hasPanel = hasChildren || hasIntro;

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const openPanel = () => {
    if (!hasPanel) return;
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, CLOSE_DELAY_MS);
  };

  return (
    <div
      key={componentKey(props)}
      className={`bma-nav ${open && hasPanel ? 'bma-nav--open' : ''} ${!hasPanel ? 'bma-nav--link-only' : ''} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      onMouseEnter={openPanel}
      onMouseLeave={scheduleClose}
    >
      <div className="bma-nav__trigger">
        <SitecoreLink field={fields.Link} className="bma-nav__link" />
        {hasPanel ? (
          <button
            type="button"
            className="bma-nav__toggle"
            aria-expanded={open}
            aria-label={`${open ? 'Collapse' : 'Expand'} ${label} menu`}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {hasPanel ? (
        <div className="bma-nav__panel" hidden={!open}>
          <div className="bma-nav__panel-inner">
            {hasIntro ? (
              <div className="bma-nav__intro">
                {fields.Image?.value?.src ? (
                  <FieldImage field={fields.Image} mode="cover" className="bma-nav__image" />
                ) : null}
                {fields.Link?.value?.text ? (
                  <h5 className="bma-nav__intro-title">{fields.Link.value.text}</h5>
                ) : null}
                {fields.Description?.value ? (
                  <Text tag="p" className="bma-nav__description" field={fields.Description} />
                ) : null}
              </div>
            ) : null}
            <div className={`bma-nav__children ${hasChildren ? '' : 'bma-nav__children--empty'}`.trim()}>
              <Placeholder name={childrenPh} rendering={rendering} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
