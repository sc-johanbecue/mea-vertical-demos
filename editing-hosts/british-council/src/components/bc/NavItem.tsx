'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type JSX,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { useHeaderNav } from '@/components/bc/header-nav-context';
import { getMegaMenuChildren, type MegaMenuLink } from '@/constants/bcMegaMenu';

export interface NavItemFields {
  Link: LinkField;
  IsActive: TextField;
}

const defaultFields: NavItemFields = {
  Link: { value: { href: '/', text: 'Nav item' } },
  IsActive: { value: '' },
};

export type NavItemProps = ComponentProps & { fields?: NavItemFields };

function linkHref(field?: LinkField): string {
  const v = field?.value as { href?: string; url?: string; text?: string } | undefined;
  return v?.href || v?.url || '';
}

function linkText(field?: LinkField): string {
  return String(field?.value?.text || '');
}

function SubmenuList({
  items,
  submenuId,
  onNavigate,
}: {
  items: MegaMenuLink[];
  submenuId: string;
  onNavigate: () => void;
}): JSX.Element {
  return (
    <ul id={submenuId} className="bc-nav-item__submenu" role="menu">
      {items.map((child) => (
        <li key={`${child.href}-${child.text}`} className="bc-nav-item__subitem" role="none">
          <a href={child.href} className="bc-nav-item__sublink" role="menuitem" onClick={onNavigate}>
            {child.text}
          </a>
          {child.children?.length ? (
            <ul className="bc-nav-item__submenu bc-nav-item__submenu--nested" role="menu">
              {child.children.map((nested) => (
                <li key={`${nested.href}-${nested.text}`} className="bc-nav-item__subitem" role="none">
                  <a
                    href={nested.href}
                    className="bc-nav-item__sublink"
                    role="menuitem"
                    onClick={onNavigate}
                  >
                    {nested.text}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function Layout(props: NavItemProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  const fieldActive = Boolean(fields.IsActive?.value);
  const { closeMenu, isMenuOpen } = useHeaderNav();
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);
  const submenuId = useId();

  const href = linkHref(fields.Link);
  const text = linkText(fields.Link);
  const children = getMegaMenuChildren(href, text);
  const hasChildren = children.length > 0;

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (event: Event) => {
      if (!itemRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isMenuOpen) setIsOpen(false);
  }, [isMenuOpen]);

  const onNavigate = () => {
    setIsOpen(false);
    closeMenu();
  };

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen((v) => !v);
  };

  return (
    <li
      ref={itemRef}
      key={componentKey(props)}
      className={`bc-nav-item component ${fieldActive ? 'is-active' : ''} ${isOpen ? 'is-open' : ''} ${hasChildren ? 'has-children' : ''} ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      role="none"
      onMouseEnter={hasChildren ? open : undefined}
      onMouseLeave={hasChildren ? close : undefined}
    >
      <div className="bc-nav-item__row">
        <SitecoreLink
          field={fields.Link}
          className="bc-nav-item__link"
          role="menuitem"
          aria-haspopup={hasChildren ? 'true' : undefined}
          aria-expanded={hasChildren ? isOpen : undefined}
          aria-controls={hasChildren ? submenuId : undefined}
          onClick={(e: MouseEvent<HTMLAnchorElement>) => {
            if (hasChildren && window.matchMedia('(max-width: 900px)').matches) {
              e.preventDefault();
              setIsOpen((v) => !v);
              return;
            }
            onNavigate();
          }}
        />
        {hasChildren ? (
          <button
            type="button"
            className="bc-nav-item__toggle"
            aria-label={`Toggle ${text || 'submenu'}`}
            aria-expanded={isOpen}
            aria-controls={submenuId}
            onClick={toggle}
            onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOpen((v) => !v);
              }
            }}
          >
            <span className="bc-nav-item__chevron" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <Text tag="span" className="sr-only" field={fields.IsActive} />
      {hasChildren ? <SubmenuList items={children} submenuId={submenuId} onNavigate={onNavigate} /> : null}
    </li>
  );
}

export const Default = (p: NavItemProps): JSX.Element => Layout(p);
export const Inversed = (p: NavItemProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: NavItemProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: NavItemProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
