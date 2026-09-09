'use client';

import type { JSX } from 'react';
import { useCallback, useRef, useState } from 'react';
import { Image, Link as SitecoreLink, Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Menu, X, LogIn, UserPlus, ChevronDown } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { HeaderNavProvider, useHeaderNav } from '@/components/bc/header-nav-context';
import { Default as LanguageSwitcher } from '@/components/bc/LanguageSwitcher';
import { Default as NavigationIcons } from '@/components/bc/NavigationIcons';
import {
  HeaderProfileMenu,
  type HeaderProfileMenuItem,
} from '@/components/bc/HeaderProfileMenu';
import {
  buildLoginUrl,
  buildLogoutUrl,
  resolveDisplayName,
} from '@/lib/auth0-profile';
import { isAuth0AuthenticatedUser } from '@/lib/auth0-user';

export interface HeaderFields {
  Logo?: ImageField;
  LogoLink?: LinkField;
  SearchLink?: LinkField;
  LoginLink?: LinkField;
  RegisterLink?: LinkField;
}

const defaultFields: Required<HeaderFields> = {
  Logo: { value: { src: '', alt: 'British Council' } },
  LogoLink: { value: { href: '/', text: 'British Council' } },
  SearchLink: { value: { href: '/search', text: 'Search' } },
  LoginLink: { value: { href: '/auth/login', text: 'Login' } },
  RegisterLink: { value: { href: '/register', text: 'Register' } },
};

export type HeaderProps = ComponentProps & { fields?: HeaderFields };

function hasLinkValue(field?: LinkField): boolean {
  const v = field?.value as { href?: string; url?: string } | undefined;
  return Boolean(v?.href || v?.url);
}

const PROFILE_MENU_ITEMS = (logoutHref: string): HeaderProfileMenuItem[] => [
  { key: 'my-account', label: 'My Account', href: '/Portal/Profile' },
  { key: 'digital-library', label: 'Digital Library', href: '/Portal' },
  { key: 'cookie-settings', label: 'Cookie Settings', href: '/cookie-settings' },
  { key: 'terms', label: 'Terms & Conditions', href: '/terms' },
  { key: 'logout', label: 'Logout', href: logoutHref },
];

function HeaderAuthActions({ fields }: { fields: Required<HeaderFields> }): JSX.Element {
  const { page } = useSitecore();
  const { user, isLoading } = useUser();
  const editing = page?.mode?.isEditing;
  const loginText = fields.LoginLink?.value?.text?.toString() || 'Login';
  const registerText = fields.RegisterLink?.value?.text?.toString() || 'Register';
  const registerHref =
    (fields.RegisterLink?.value as { href?: string; url?: string } | undefined)?.href ||
    (fields.RegisterLink?.value as { href?: string; url?: string } | undefined)?.url ||
    '/register';
  const [profileOpen, setProfileOpen] = useState(false);
  const profileAnchorRef = useRef<HTMLDivElement>(null);
  const closeProfileMenu = useCallback(() => setProfileOpen(false), []);

  if (editing || isLoading || !isAuth0AuthenticatedUser(user)) {
    return (
      <div className="bc-header__auth">
        <a href={buildLoginUrl('/Portal')} className="bc-header__auth-action">
          <LogIn className="bc-header__auth-icon" aria-hidden="true" size={18} />
          <span className="bc-header__auth-label">{loginText}</span>
        </a>
        <a href={registerHref} className="bc-header__auth-action">
          <UserPlus className="bc-header__auth-icon" aria-hidden="true" size={18} />
          <span className="bc-header__auth-label">{registerText}</span>
        </a>
      </div>
    );
  }

  const displayName = resolveDisplayName(user);

  return (
    <div
      ref={profileAnchorRef}
      className="bc-header__auth bc-header__auth--signed-in"
    >
      <button
        type="button"
        className="bc-header__auth-action bc-header__profile-toggle"
        aria-label="Open account menu"
        aria-expanded={profileOpen}
        aria-haspopup="menu"
        onClick={() => setProfileOpen((open) => !open)}
      >
        <span className="bc-header__auth-label">{displayName}</span>
        <ChevronDown
          className={`bc-header__auth-icon bc-header__profile-chevron${profileOpen ? ' is-open' : ''}`}
          aria-hidden="true"
          size={18}
        />
      </button>
      <HeaderProfileMenu
        items={PROFILE_MENU_ITEMS(buildLogoutUrl('/'))}
        open={profileOpen}
        onClose={closeProfileMenu}
        anchorRef={profileAnchorRef}
      />
    </div>
  );
}

function HeaderChrome({ extra = '', ...props }: HeaderProps & { extra?: string }): JSX.Element {
  const { params, rendering } = props;
  const fields = { ...defaultFields, ...props.fields };
  const dynamicId = params?.DynamicPlaceholderId ?? '1';
  const utilityPh = `header-utility-links-${dynamicId}`;
  const navPh = `header-navigation-${dynamicId}`;
  const { isMenuOpen, toggleMenu, closeMenu } = useHeaderNav();

  return (
    <header
      className={`bc-header component ${isMenuOpen ? 'is-menu-open' : ''} ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier || componentKey(props)}
    >
      <div className="bc-header__inner">
        <div className="bc-header__top">
          {hasLinkValue(fields.LogoLink) ? (
            <SitecoreLink field={fields.LogoLink} className="bc-header__logo" onClick={closeMenu}>
              <Image field={fields.Logo} imageParams={{ h: 48 }} />
            </SitecoreLink>
          ) : (
            <span className="bc-header__logo">
              <Image field={fields.Logo} imageParams={{ h: 48 }} />
            </span>
          )}

          <div className="bc-header__top-actions">
            <LanguageSwitcher params={{ styles: 'bc-header__lang bc-header__lang--mobile' }} />
            <NavigationIcons
              fields={{ SearchPage: fields.SearchLink }}
              params={{ styles: 'bc-header__search bc-header__search--mobile' }}
              showSearchPanel={false}
            />
          </div>
        </div>

        <div className="bc-header__menu-bar">
          <span className="bc-header__menu-label">Menu</span>
          <button
            type="button"
            className="bc-header__menu-toggle"
            aria-expanded={isMenuOpen}
            aria-controls="bc-header-panel"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
          </button>
        </div>

        <div className="bc-header__support">
          <LanguageSwitcher params={{ styles: 'bc-header__lang bc-header__lang--desktop' }} />
          <ul className="bc-header__utility">
            {rendering ? <Placeholder name={utilityPh} rendering={rendering} /> : null}
          </ul>
          <HeaderAuthActions fields={fields} />
          <NavigationIcons
            fields={{ SearchPage: fields.SearchLink }}
            params={{ styles: 'bc-header__search bc-header__search--desktop' }}
            showSearchPanel
          />
        </div>

        <div id="bc-header-panel" className={`bc-header__panel${isMenuOpen ? ' is-open' : ''}`}>
          <div className="bc-header__panel-primary">
            {rendering ? <Placeholder name={navPh} rendering={rendering} /> : null}
          </div>
          <div className="bc-header__panel-auth">
            <HeaderAuthActions fields={fields} />
          </div>
        </div>
      </div>
    </header>
  );
}

export const Default = (p: HeaderProps): JSX.Element => (
  <HeaderNavProvider>
    <HeaderChrome {...p} />
  </HeaderNavProvider>
);
export const Inversed = (p: HeaderProps): JSX.Element => (
  <HeaderNavProvider>
    <HeaderChrome {...p} extra="component--inversed" />
  </HeaderNavProvider>
);
export const Animated = (p: HeaderProps): JSX.Element => (
  <HeaderNavProvider>
    <HeaderChrome {...p} extra="component--animated" />
  </HeaderNavProvider>
);
export const InversedAnimated = (p: HeaderProps): JSX.Element => (
  <HeaderNavProvider>
    <HeaderChrome {...p} extra="component--inversed component--animated" />
  </HeaderNavProvider>
);
