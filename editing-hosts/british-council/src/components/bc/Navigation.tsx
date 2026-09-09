'use client';

import { useRef, useState, type JSX, type KeyboardEvent, type MouseEvent } from 'react';
import {
  Link as SitecoreLink,
  Placeholder,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import type { LinkField } from '@sitecore-content-sdk/nextjs';
import { ChevronDown, Home } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { useHeaderNav } from '@/components/bc/header-nav-context';
import {
  getLinkContent,
  getLinkField,
  isNavLevel,
  isNavRootItem,
  isNavigationFieldMap,
  prepareFields,
  type NavTreeItemFields,
  type NavigationFieldMap,
} from '@/lib/nav-helpers';

export interface NavigationFields {
  HomeLink?: LinkField;
  [key: string]: LinkField | NavTreeItemFields | undefined;
}

const defaultFields: NavigationFields = {
  HomeLink: { value: { href: '/', text: 'Home' } },
};

export type NavigationProps = ComponentProps & { fields?: NavigationFields };

type NavigationListItemProps = {
  fields: NavTreeItemFields;
  handleClick: (event?: MouseEvent<HTMLElement>) => void;
};

function NavigationListItem({ fields, handleClick }: NavigationListItemProps): JSX.Element {
  const { page } = useSitecore();
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const isRootItem = isNavRootItem(fields);
  const isTopLevelPage = isNavLevel(fields, 1);
  const hasChildren = Boolean(fields.Children?.length);
  const hasDropdownMenu = hasChildren && isTopLevelPage;
  const isHome =
    fields.Href === '/' ||
    fields.DisplayName?.toLowerCase() === 'home' ||
    Boolean(fields.Styles?.includes('home'));

  const clickHandler = (event: MouseEvent<HTMLElement>) => {
    handleClick(event);
    setIsActive(false);
  };

  return (
    <li
      ref={dropdownRef}
      tabIndex={0}
      role="menuitem"
      className={[
        'bc-nav-item',
        fields.Styles?.join(' '),
        isHome ? 'bc-nav-item--home is-active' : '',
        hasDropdownMenu && isActive ? 'is-open' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="bc-nav-item__row">
        <SitecoreLink
          field={getLinkField(fields)}
          editable={page.mode.isEditing}
          onClick={clickHandler}
          className="bc-nav-item__link"
        >
          {isHome ? <Home className="bc-nav-item__home-icon" aria-hidden="true" size={18} /> : null}
          {getLinkContent(fields)}
        </SitecoreLink>
        {hasDropdownMenu ? (
          <button
            type="button"
            className="bc-nav-item__toggle"
            aria-label="Toggle submenu"
            aria-haspopup="true"
            aria-expanded={isActive}
            onClick={() => setIsActive((a) => !a)}
            onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsActive((a) => !a);
              }
            }}
          >
            <ChevronDown size={16} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {hasChildren ? (
        <ul
          role="menu"
          className={`bc-nav-item__submenu${isActive || isRootItem ? ' is-open' : ''}`}
          hidden={hasDropdownMenu ? !isActive : undefined}
        >
          {fields.Children!.map((child) => (
            <NavigationListItem key={child.Id} fields={child} handleClick={clickHandler} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function hasLinkValue(field?: LinkField): boolean {
  const v = field?.value as { href?: string; url?: string } | undefined;
  return Boolean(v?.href || v?.url);
}

function PlaceholderNavigation(
  props: NavigationProps,
  extra: string,
  onNavClick: (event?: MouseEvent<HTMLElement>) => void
): JSX.Element {
  const { params, fields = defaultFields, rendering } = props;
  const ph = `nav-items-${params?.DynamicPlaceholderId ?? ''}`;
  const homeLink = (fields.HomeLink as LinkField | undefined) ?? defaultFields.HomeLink!;

  return (
    <nav
      key={componentKey(props)}
      className={`bc-nav component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      aria-label="Primary"
    >
      <ul className="bc-nav__list" role="menubar">
        {hasLinkValue(homeLink) ? (
          <li className="bc-nav-item bc-nav-item--home is-active" role="menuitem">
            <SitecoreLink
              field={homeLink}
              className="bc-nav-item__link"
              aria-label="Home"
              onClick={onNavClick}
            >
              <Home className="bc-nav-item__home-icon" aria-hidden="true" size={18} />
              <span className="bc-nav-item__home-text">Home</span>
            </SitecoreLink>
          </li>
        ) : null}
        {rendering ? <Placeholder name={ph} rendering={rendering} /> : null}
      </ul>
    </nav>
  );
}

function FieldMapNavigation(
  props: NavigationProps,
  fieldMap: NavigationFieldMap,
  extra: string,
  onNavClick: (event?: MouseEvent<HTMLElement>) => void
): JSX.Element {
  const { params } = props;
  const prepared = prepareFields(fieldMap, false);
  const items = Object.values(prepared).filter((item): item is NavTreeItemFields => Boolean(item));

  return (
    <nav
      key={componentKey(props)}
      className={`bc-nav component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      aria-label="Primary"
    >
      <ul className="bc-nav__list" role="menubar">
        {items.map((item) => (
          <NavigationListItem key={item.Id} fields={item} handleClick={onNavClick} />
        ))}
      </ul>
    </nav>
  );
}

function Layout(props: NavigationProps, extra = ''): JSX.Element {
  const { page } = useSitecore();
  const { closeMenu } = useHeaderNav();
  const fields = props.fields ?? defaultFields;

  const handleNavClick = (event?: MouseEvent<HTMLElement>) => {
    if (event && page.mode.isEditing) {
      event.preventDefault();
      return;
    }
    closeMenu();
  };

  if (isNavigationFieldMap(fields)) {
    return FieldMapNavigation(props, fields, extra, handleNavClick);
  }

  return PlaceholderNavigation(props, extra, handleNavClick);
}

export const Default = (p: NavigationProps): JSX.Element => Layout(p);
export const Inversed = (p: NavigationProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: NavigationProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: NavigationProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
