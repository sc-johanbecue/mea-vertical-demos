import type { JSX } from 'react';
import { LinkField, Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';

export interface NavItemFields {
  Id: string;
  DisplayName: string;
  Title: TextField;
  NavigationTitle: TextField;
  Href: string;
  Querystring: string;
  Children?: NavItemFields[];
  Styles: string[];
}

export type NavigationFieldMap = Record<string, NavItemFields>;

export const isNavLevel = (fields: NavItemFields, level: number): boolean => {
  return Array.isArray(fields.Styles) && fields.Styles.includes(`level${level}`);
};

export const isNavRootItem = (fields: NavItemFields): boolean => {
  const isFlatLevel =
    Array.isArray(fields.Styles) && fields.Styles.some((style) => style.startsWith('flat-level'));

  return isNavLevel(fields, 0) && !isFlatLevel;
};

export const getLinkContent = (fields: NavItemFields): JSX.Element | string => {
  const textField = fields.NavigationTitle || fields.Title;
  if (textField) {
    return <Text field={textField} />;
  }

  return fields.DisplayName;
};

export const getLinkField = (fields: NavItemFields): LinkField => ({
  value: {
    href: fields.Href,
    title:
      fields.NavigationTitle?.value?.toString() ??
      fields.Title?.value?.toString() ??
      fields.DisplayName,
    querystring: fields.Querystring,
  },
});

export const prepareFields = (fields: NavigationFieldMap, center = false): NavigationFieldMap => {
  const result: NavigationFieldMap = {};
  const entries = Object.entries(fields).filter(([, value]) => Boolean(value));

  if (entries.length === 1 && isNavRootItem(entries[0][1])) {
    const rootItem = entries[0][1];
    const children = rootItem.Children || [];
    const flattenedChildren = [...children];

    if (center) {
      const middleIndex = Math.floor(children.length / 2);
      flattenedChildren.splice(middleIndex, 0, { ...rootItem, Children: undefined });
    } else {
      flattenedChildren.unshift({ ...rootItem, Children: undefined });
    }

    flattenedChildren.forEach((item, idx) => {
      result[String(idx)] = item;
    });
  } else {
    entries.forEach(([key, item]) => {
      result[key] = item;
    });
  }

  return result;
};

export const topLevelNavItems = (fields: NavigationFieldMap): NavItemFields[] => {
  return Object.values(prepareFields(fields, false)).filter((item): item is NavItemFields => Boolean(item));
};
