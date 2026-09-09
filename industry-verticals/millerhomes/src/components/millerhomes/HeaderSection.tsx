'use client';

import React, { type JSX, useState } from 'react';
import {
  TextField,
  Text,
  LinkField,
  Link as SitecoreLink,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * HeaderSection Component
 * Miller Homes style header with utility bar, main navigation, and mobile menu
 *
 * Layout:
 * - Desktop: Top utility bar (gray) + main header with logo, nav (placeholder), CTA
 * - Mobile: Logo left, hamburger menu right
 *
 * Uses placeholder for navigation items (header-nav)
 */

interface Fields {
  LogoLink: LinkField;
  LogoText: TextField;
  LogoTextHighlight: TextField;
  CorporateLink: LinkField;
  LoginLink: LinkField;
  MyMillerHomeLink: LinkField;
  FindHomeButtonText: TextField;
  FindHomeButtonLink: LinkField;
  /** Dictionary key: Header_CloseMenu */
  CloseMenuText: TextField;
  /** Dictionary key: Header_OpenMenu */
  OpenMenuText: TextField;
}

const defaultFields: Fields = {
  LogoLink: { value: { href: '/' } },
  LogoText: { value: 'miller' },
  LogoTextHighlight: { value: 'homes' },
  CorporateLink: { value: { href: '/corporate', text: 'Corporate' } },
  LoginLink: { value: { href: '/login', text: 'Login / Register' } },
  MyMillerHomeLink: { value: { href: '/my-miller-home', text: 'My Miller Home' } },
  FindHomeButtonText: { value: 'Find My New Home' },
  FindHomeButtonLink: { value: { href: '/find-home' } },
  CloseMenuText: { value: 'Close menu' },
  OpenMenuText: { value: 'Open menu' },
};

export type HeaderSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HeaderSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Placeholder for navigation items
  const phHeaderNav = `header-nav-${DynamicPlaceholderId}`;

  return (
    <header
      className={`component header-section sticky top-0 z-40 bg-white ${styles || ''}`}
      id={id}
    >
      {/* Top utility bar - Desktop only */}
      <div className="bg-background-accent hidden border-b border-gray-200 lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-end gap-8 py-2 text-sm">
            {fields.CorporateLink?.value?.href && (
              <SitecoreLink
                field={fields.CorporateLink}
                className="text-[#003057] transition-colors hover:text-[#0072CE]"
              />
            )}
            {fields.LoginLink?.value?.href && (
              <SitecoreLink
                field={fields.LoginLink}
                className="text-[#003057] transition-colors hover:text-[#0072CE]"
              />
            )}
            {fields.MyMillerHomeLink?.value?.href && (
              <SitecoreLink
                field={fields.MyMillerHomeLink}
                className="flex items-center gap-2 text-[#003057] transition-colors hover:text-[#0072CE]"
              >
                <svg
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32px"
                  height="32px"
                  viewBox="0 0 32 32"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {' '}
                  <g
                    transform="translate(0.000000,36.000000) scale(0.100000,-0.100000)"
                    fill="#000000"
                    stroke="none"
                  >
                    {' '}
                    <path d="M108 255 l-48 -35 0 -70 0 -70 45 0 c25 0 45 5 45 10 0 6 -13 10 -30 10 -30 0 -30 0 -30 59 0 55 2 60 35 85 33 25 37 26 57 12 37 -26 57 -19 23 9 -16 13 -34 24 -40 24 -5 0 -31 -15 -57 -34z" />{' '}
                    <path d="M203 204 c-8 -22 10 -49 32 -49 22 0 40 27 32 49 -8 21 -56 21 -64 0z m47 -19 c0 -8 -7 -15 -15 -15 -8 0 -15 7 -15 15 0 8 7 15 15 15 8 0 15 -7 15 -15z" />{' '}
                    <path d="M183 130 c-13 -6 -23 -18 -23 -30 0 -18 6 -20 75 -20 59 0 75 3 75 14 0 37 -74 57 -127 36z m97 -20 c11 -7 -3 -10 -45 -10 -42 0 -56 3 -45 10 8 5 29 10 45 10 17 0 37 -5 45 -10z" />{' '}
                  </g>{' '}
                </svg>
                {fields.MyMillerHomeLink?.value?.text}
              </SitecoreLink>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between lg:h-22">
          {/* Logo */}
          <div className="shrink-0">
            <SitecoreLink field={fields.LogoLink} className="block">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold tracking-tight text-[#00B5E2] lg:text-3xl">
                  <Text field={fields.LogoText} />
                </span>
                <span className="text-2xl font-light tracking-tight text-[#003057] lg:text-3xl">
                  <Text field={fields.LogoTextHighlight} />
                </span>
              </div>
            </SitecoreLink>
          </div>

          {/* Desktop Navigation - Placeholder */}
          <nav className="hidden items-center gap-1 lg:flex">
            <div className="header-nav-wrapper flex items-center">
              <Placeholder name={phHeaderNav} rendering={props.rendering} />
            </div>
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            {fields.FindHomeButtonLink?.value?.href && (
              <SitecoreLink
                field={fields.FindHomeButtonLink}
                className="inline-flex items-center gap-2 bg-[#8B7355] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#7a6549]"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                <Text field={fields.FindHomeButtonText} />
              </SitecoreLink>
            )}
          </div>

          {/* Mobile Menu Button - Custom hamburger icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 p-2 lg:hidden"
            aria-label={
              isMobileMenuOpen
                ? (fields.CloseMenuText?.value as string)
                : (fields.OpenMenuText?.value as string)
            }
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6 text-[#003057]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <>
                <span className="block h-0.5 w-6 bg-[#00B5E2]" />
                <span className="block h-0.5 w-6 bg-[#00B5E2]" />
                <span className="block h-0.5 w-6 bg-[#003057]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white shadow-lg lg:hidden">
          <div className="container mx-auto px-4 py-4">
            {/* Navigation from placeholder */}
            <nav className="mobile-nav-wrapper">
              <Placeholder name={phHeaderNav} rendering={props.rendering} />
            </nav>

            {/* Mobile utility links */}
            <div className="mt-4 flex flex-col gap-2 border-t border-gray-200 pt-4">
              {fields.CorporateLink?.value?.href && (
                <SitecoreLink
                  field={fields.CorporateLink}
                  className="py-2 text-sm text-[#003057] hover:text-[#0072CE]"
                />
              )}
              {fields.LoginLink?.value?.href && (
                <SitecoreLink
                  field={fields.LoginLink}
                  className="py-2 text-sm text-[#003057] hover:text-[#0072CE]"
                />
              )}
              {fields.MyMillerHomeLink?.value?.href && (
                <SitecoreLink
                  field={fields.MyMillerHomeLink}
                  className="flex items-center gap-2 py-2 text-sm text-[#003057] hover:text-[#0072CE]"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </SitecoreLink>
              )}
            </div>

            {/* Mobile CTA */}
            {fields.FindHomeButtonLink?.value?.href && (
              <SitecoreLink
                field={fields.FindHomeButtonLink}
                className="mt-4 flex items-center justify-center gap-2 bg-[#8B7355] px-5 py-3 text-sm font-medium text-white hover:bg-[#7a6549]"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                <Text field={fields.FindHomeButtonText} />
              </SitecoreLink>
            )}
          </div>
        </div>
      )}

      {/* Global styles for navigation placeholder content */}
      <style jsx global>{`
        .header-nav-wrapper > * {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .header-nav-wrapper a,
        .header-nav-wrapper button {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #003057;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.5rem 1rem;
          transition: color 0.2s;
        }
        .header-nav-wrapper a:hover,
        .header-nav-wrapper button:hover {
          color: #0072ce;
        }
        .mobile-nav-wrapper a,
        .mobile-nav-wrapper button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #003057;
          font-weight: 500;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .mobile-nav-wrapper a:hover,
        .mobile-nav-wrapper button:hover {
          color: #0072ce;
        }
      `}</style>
    </header>
  );
};
