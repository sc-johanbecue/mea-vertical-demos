'use client';

import { useEffect, useRef, useState, type JSX } from 'react';
import { Text, Image, Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField } from '@sitecore-content-sdk/nextjs';
import { MagnifyingGlass, ChatCircleDots, CaretDown, List } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';
import { useDemoNotify } from '@/lib/demo-notify';

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

const profileMenuItems = ['My accounts', 'Preferences', 'Sign out'] as const;

export type HeaderProps = ComponentProps & { fields?: HeaderFields };

export const Default = (props: HeaderProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const headerNavPh = dynamicPlaceholderKey('header-nav', params);
  const { page } = useSitecore();
  const isEditing = Boolean(page?.mode?.isEditing);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { notify, Toast } = useDemoNotify();

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [menuOpen]);

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
          {isEditing ? (
            <>
              <button type="button" aria-label="Search" disabled>
                <MagnifyingGlass size={21} />
                {fields.SearchLabel ? <Text tag="small" field={fields.SearchLabel} /> : null}
              </button>
              <button type="button" className="header-login" disabled>
                Log in
              </button>
              <button type="button" className="header-cta" disabled>
                Open an account
              </button>
              <button type="button" className="mobile-menu" aria-label="Open menu" disabled>
                <List size={28} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                aria-label="Search"
                onClick={() => notify('Search will be part of the next prototype stage.')}
              >
                <MagnifyingGlass size={21} />
                {fields.SearchLabel ? <Text tag="small" field={fields.SearchLabel} /> : null}
              </button>
              <button
                type="button"
                aria-label="Messages"
                className="badge"
                onClick={() => notify('You have 2 unread messages from your relationship manager.')}
              >
                <ChatCircleDots size={22} />
                <b>2</b>
                {fields.MessagesLabel ? <Text tag="small" field={fields.MessagesLabel} /> : null}
              </button>
              <button
                type="button"
                className="profile"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen((open) => !open)}
              >
                {fields.ProfileInitials ? <Text tag="span" field={fields.ProfileInitials} /> : null}
                {fields.ProfileName ? (
                  <em>
                    <Text field={fields.ProfileName} />
                  </em>
                ) : null}
                <CaretDown size={15} />
              </button>
              <button
                type="button"
                className="mobile-menu"
                aria-label="Open menu"
                onClick={() => setMenuOpen((open) => !open)}
              >
                <List size={28} />
              </button>
            </>
          )}
        </div>
      </div>
      {!isEditing && menuOpen ? (
        <div className="menu-popover" role="menu" ref={menuRef}>
          {profileMenuItems.map((item) => (
            <button
              type="button"
              key={item}
              role="menuitem"
              onClick={() => {
                notify(`${item} will be part of the next prototype stage.`);
                setMenuOpen(false);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
      <Toast />
    </header>
  );
};
