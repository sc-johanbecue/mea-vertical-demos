import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';

export interface NavTreeItemFields {
  Id: string;
  DisplayName: string;
  Title?: TextField;
  NavigationTitle?: TextField;
  Href: string;
  Querystring?: string;
  Children?: NavTreeItemFields[];
  Styles?: string[];
}

export type NavigationFieldMap = Record<string, NavTreeItemFields>;

export const isNavLevel = (fields: NavTreeItemFields, level: number): boolean =>
  Array.isArray(fields.Styles) && fields.Styles.includes(`level${level}`);

export const isNavRootItem = (fields: NavTreeItemFields): boolean => {
  const isFlatLevel =
    Array.isArray(fields.Styles) && fields.Styles.some((style) => style.startsWith('flat-level'));
  return isNavLevel(fields, 0) && !isFlatLevel;
};

export const getLinkContent = (fields: NavTreeItemFields): JSX.Element | string => {
  const textField = fields.NavigationTitle || fields.Title;
  if (textField) return <Text field={textField} />;
  return fields.DisplayName;
};

export const getLinkField = (fields: NavTreeItemFields): LinkField => ({
  value: {
    href: fields.Href,
    title:
      fields.NavigationTitle?.value?.toString() ??
      fields.Title?.value?.toString() ??
      fields.DisplayName,
    querystring: fields.Querystring,
    text: fields.DisplayName,
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

export const topLevelNavItems = (fields: NavigationFieldMap): NavTreeItemFields[] =>
  Object.values(prepareFields(fields, false)).filter((item): item is NavTreeItemFields => Boolean(item));

export const isNavigationFieldMap = (fields: unknown): fields is NavigationFieldMap => {
  if (!fields || typeof fields !== 'object') return false;
  return Object.values(fields as Record<string, unknown>).some(
    (v) => v && typeof v === 'object' && 'Href' in (v as object) && 'Id' in (v as object)
  );
};
