'use client';

import type { JSX } from 'react';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ImageField,
  Image as SitecoreImage,
  LinkField,
  Placeholder,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import { resolveKpmgAuth0DisplayName } from '@/lib/kpmg-auth0-account';
import { isKpmgAuth0AuthenticatedUser } from '@/lib/kpmg-auth0-user';
import { ComponentProps } from '@/lib/component-props';
import {
  IconBell,
  IconChevronDown,
  IconClose,
  IconMenu,
  IconSearch,
  IconUser,
  NavIcon,
} from './kpmg-beyond-icons';
import { KpmgBeyondProfileMenu, type KpmgBeyondProfileMenuItem } from './KpmgBeyondProfileMenu';
import { useKpmgBeyondProfileNavigation } from './kpmg-beyond-profile-nav';

export interface KpmgBeyondChromeFields {
  Logo: ImageField;
  ProfileName: TextField;
  ProfilePath: TextField;
  MyAccountLabel: TextField;
  SupportLink: LinkField;
  CookieSettingsLink: LinkField;
  TermsLink: LinkField;
  LogoutLabel: TextField;
}

const defaultFields: KpmgBeyondChromeFields = {
  Logo: { value: { src: '/kpmg-logo.svg', alt: 'KPMG logo' } },
  ProfileName: { value: 'Johan Becue' },
  ProfilePath: { value: '/profile' },
  MyAccountLabel: { value: 'My Account' },
  SupportLink: { value: { href: '/support', text: 'Support' } },
  CookieSettingsLink: { value: { href: '/cookie-settings', text: 'Cookie Settings' } },
  TermsLink: { value: { href: '/terms', text: 'Terms & Conditions' } },
  LogoutLabel: { value: 'Logout' },
};

const defaultNavItems = [
  { label: 'Home', href: '/', icon: 'home' as const },
  { label: 'Events', href: '/events', icon: 'events' as const },
  { label: 'Communities', href: '/communities', icon: 'communities' as const },
  { label: 'Insights Hub', href: '/articles', icon: 'insights' as const },
  { label: 'Solutions', href: '/solutions', icon: 'solutions' as const },
  { label: 'Contact Us', href: '/contact', icon: 'contact' as const },
  { label: 'Referral', href: '/referral', icon: 'referral' as const },
];

export type KpmgBeyondChromeProps = ComponentProps & {
  fields?: KpmgBeyondChromeFields;
};

function linkHref(link: LinkField | undefined, fallback = '#'): string {
  const href = link?.value?.href?.toString().trim();
  return href || fallback;
}

function linkLabel(link: LinkField | undefined, fallback: string): string {
  const text = link?.value?.text?.toString().trim();
  return text || fallback;
}

function fieldLabel(field: TextField | undefined, fallback: string): string {
  const value = field?.value?.toString().trim();
  return value || fallback;
}

export const Default = (props: KpmgBeyondChromeProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields ?? defaultFields;
  const navPh = `kpmg-beyond-nav-${DynamicPlaceholderId ?? '1'}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuAnchorRef = useRef<HTMLDivElement>(null);
  const mobileProfileMenuAnchorRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeProfileMenu = useCallback(() => setProfileMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, closeMenu]);

  const hasNavPlaceholder = Boolean(props.rendering?.placeholders?.[navPh]);
  const componentKey = id ?? props.rendering?.uid ?? 'kpmg-beyond-chrome';
  const profilePath = fields.ProfilePath?.value?.toString().trim() || '/profile';
  const { isLoading, logoutUrl, openProfile, user } = useKpmgBeyondProfileNavigation(profilePath);
  const isLoggedIn = isKpmgAuth0AuthenticatedUser(user);
  const displayName = isLoggedIn
    ? resolveKpmgAuth0DisplayName(user) || fields.ProfileName?.value?.toString() || ''
    : '';

  const profileMenuItems = useMemo((): KpmgBeyondProfileMenuItem[] => {
    return [
      {
        key: 'my-account',
        label: fieldLabel(fields.MyAccountLabel, 'My Account'),
        href: profilePath,
      },
      {
        key: 'support',
        label: linkLabel(fields.SupportLink, 'Support'),
        href: linkHref(fields.SupportLink, '/support'),
      },
      {
        key: 'cookie-settings',
        label: linkLabel(fields.CookieSettingsLink, 'Cookie Settings'),
        href: linkHref(fields.CookieSettingsLink, '/cookie-settings'),
      },
      {
        key: 'terms',
        label: linkLabel(fields.TermsLink, 'Terms & Conditions'),
        href: linkHref(fields.TermsLink, '/terms'),
      },
      {
        key: 'logout',
        label: fieldLabel(fields.LogoutLabel, 'Logout'),
        href: logoutUrl,
      },
    ];
  }, [fields, logoutUrl, profilePath]);

  const toggleProfileMenu = useCallback(() => {
    if (isLoading) {
      return;
    }

    if (!isLoggedIn) {
      openProfile();
      return;
    }

    setProfileMenuOpen((open) => !open);
  }, [isLoading, isLoggedIn, openProfile]);

  const handleMobileProfileClick = useCallback(() => {
    if (isLoading) {
      return;
    }

    if (!isLoggedIn) {
      closeMenu();
      openProfile();
      return;
    }

    setProfileMenuOpen((open) => !open);
  }, [closeMenu, isLoading, isLoggedIn, openProfile]);

  return (
    <Fragment key={componentKey}>
      {/* Sticky left sidebar — desktop only */}
      <aside
        className={[
          'component kpmg-beyond-sidebar fixed top-0 left-0 z-1200 hidden h-full flex-col overflow-y-auto border-r border-black/10 bg-kpmg-bg xl:flex',
          'w-[247px] 2xl:w-[318px]',
          styles || '',
        ].join(' ')}
        id={id ? `${id}-sidebar` : undefined}
        aria-label="Main navigation"
      >
        <div className="mt-0 2xl:mt-5">
          {hasNavPlaceholder ? (
            <Placeholder name={navPh} rendering={props.rendering} />
          ) : (
            defaultNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex h-[100px] flex-col items-center justify-center border-l-4 border-transparent no-underline hover:border-kpmg-accent/50"
              >
                <NavIcon id={item.icon} />
                <span className="mt-2 max-w-[100px] text-center text-sm text-white">{item.label}</span>
              </a>
            ))
          )}
        </div>
      </aside>

      {/* Fixed top header */}
      <header
        className="fixed top-0 right-0 left-0 z-1300 h-16 bg-kpmg-bg xl:left-[247px] xl:h-[100px] 2xl:left-[318px]"
        data-cy="topBar"
      >
        <div className="flex h-full items-center justify-between px-5 xl:px-8 xl:pr-10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-white xl:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="kpmg-beyond-mobile-menu"
              onClick={menuOpen ? closeMenu : openMenu}
            >
              {menuOpen ? <IconClose /> : <IconMenu />}
            </button>
            <Link href="/" className="inline-flex items-center text-white no-underline xl:ml-0">
              <SitecoreImage
                field={fields.Logo}
                className="h-[35px] w-[65px] object-contain brightness-0 invert xl:h-[43px] xl:w-20"
              />
            </Link>
          </div>

          <div className="flex items-center gap-5 text-white">
            <button
              type="button"
              className="inline-flex cursor-pointer border-0 bg-transparent p-0 text-white"
              aria-label="Search"
            >
              <IconSearch />
            </button>
            <button
              type="button"
              className="mr-5 inline-flex cursor-pointer border-0 bg-transparent p-0 text-white"
              aria-label="Notifications"
            >
              <IconBell />
            </button>
            <div ref={mobileProfileMenuAnchorRef} className="relative xl:hidden">
              <button
                type="button"
                className="inline-flex cursor-pointer border-0 bg-transparent p-0 text-white"
                aria-label="Profile"
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                onClick={handleMobileProfileClick}
              >
                <IconUser />
              </button>
              <KpmgBeyondProfileMenu
                items={profileMenuItems}
                open={profileMenuOpen && isLoggedIn}
                onClose={closeProfileMenu}
                anchorRef={mobileProfileMenuAnchorRef}
                className="mt-2"
              />
            </div>
            <div ref={profileMenuAnchorRef} className="relative hidden items-center xl:flex">
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-7 border-0 bg-transparent p-0 text-white"
                aria-label="Open profile menu"
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                onClick={toggleProfileMenu}
              >
                <span className="text-lg font-bold text-white">{displayName}</span>
                <IconChevronDown className={profileMenuOpen ? 'rotate-180' : ''} />
              </button>
              <KpmgBeyondProfileMenu
                items={profileMenuItems}
                open={profileMenuOpen && isLoggedIn}
                onClose={closeProfileMenu}
                anchorRef={profileMenuAnchorRef}
                className="mt-3"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      {menuOpen ? (
        <>
          <div
            className="fixed inset-0 z-1150 bg-black/50 xl:hidden"
            aria-hidden
            onClick={closeMenu}
          />
          <aside
            id="kpmg-beyond-mobile-menu"
            className="fixed top-0 left-0 z-1200 flex h-full w-[min(85%,320px)] flex-col bg-kpmg-bg xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
              <button
                type="button"
                className="inline-flex border-0 bg-transparent p-0 text-white"
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <IconClose />
              </button>
              <Link
                href="/"
                className="absolute left-1/2 -translate-x-1/2 text-white no-underline"
                onClick={closeMenu}
              >
                <SitecoreImage
                  field={fields.Logo}
                  className="h-[35px] w-[65px] object-contain brightness-0 invert"
                />
              </Link>
              <div className="flex items-center gap-4 text-white">
                <IconSearch />
                <IconBell />
                <button
                  type="button"
                  className="inline-flex border-0 bg-transparent p-0 text-white"
                  aria-label="Profile"
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="menu"
                  onClick={handleMobileProfileClick}
                >
                  <IconUser />
                </button>
              </div>
            </div>
            <nav className="mt-5 flex-1 overflow-y-auto">
              {hasNavPlaceholder ? (
                <Placeholder name={navPh} rendering={props.rendering} />
              ) : (
                defaultNavItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex h-[60px] items-center border-l-4 border-kpmg-accent no-underline"
                    onClick={closeMenu}
                  >
                    <span className="ml-10 flex w-9 justify-center">
                      <NavIcon id={item.icon} active />
                    </span>
                    <span className="ml-10 text-lg font-bold text-white">{item.label}</span>
                  </a>
                ))
              )}
            </nav>
          </aside>
        </>
      ) : null}
    </Fragment>
  );
};
