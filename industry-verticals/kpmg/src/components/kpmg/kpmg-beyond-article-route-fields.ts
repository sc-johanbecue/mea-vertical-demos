"use client";

import type {
  ImageField,
  Item,
  LinkField,
  RichTextField,
  TextField,
} from "@sitecore-content-sdk/nextjs";
import { useSitecore } from "@sitecore-content-sdk/nextjs";
import type { KpmgBeyondArticleCardFields } from "./KpmgBeyondArticleCard";

export interface KpmgBeyondArticlePageFields extends KpmgBeyondArticleCardFields {
  ArticleTitle: TextField;
  BannerImage: ImageField;
  Body: RichTextField;
  ReadingTime: TextField;
  CtaText: TextField;
  CtaLink: LinkField;
  AuthorName: TextField;
  AuthorTitle: TextField;
  AuthorImage: ImageField;
  RelatedArticles?: Item[];
}

export const defaultArticlePageFields: KpmgBeyondArticlePageFields = {
  CategoryLabel: { value: "LEADERSHIP AND PERSONAL DEVELOPMENT" },
  DateLabel: { value: "20 July 2023" },
  ArticleTitle: { value: "What boards need to know about pass-through voting" },
  Summary: {
    value:
      "Pass-through voting is an emerging development in equity stewardship that allows asset owners to direct how their shares are voted.",
  },
  Image: { value: { src: "", alt: "" } },
  Link: { value: { href: "#" } },
  IsOnDemandEvent: { value: "" },
  BannerImage: { value: { src: "", alt: "Article banner" } },
  Body: {
    value:
      "<h2>What is pass-through voting?</h2><p>Pass-through voting allows asset owners to direct how their shares are voted on key corporate matters.</p>",
  },
  ReadingTime: { value: "7 min read" },
  CtaText: {
    value:
      "Join our Board Leadership Centre community to continue the conversation",
  },
  CtaLink: { value: { href: "#", text: "Connect now" } },
  AuthorName: { value: "Sophie Gaultier-Gaillard" },
  AuthorTitle: { value: "Head of Strategy, Board Leadership Centre" },
  AuthorImage: { value: { src: "", alt: "" } },
  RelatedArticles: [],
};

function resolveArticleRouteFields(
  routeFields?: Partial<KpmgBeyondArticlePageFields>,
): KpmgBeyondArticlePageFields {
  return {
    CategoryLabel:
      routeFields?.CategoryLabel ?? defaultArticlePageFields.CategoryLabel,
    DateLabel: routeFields?.DateLabel ?? defaultArticlePageFields.DateLabel,
    ArticleTitle:
      routeFields?.ArticleTitle ?? defaultArticlePageFields.ArticleTitle,
    Summary: routeFields?.Summary ?? defaultArticlePageFields.Summary,
    Image: routeFields?.Image ?? defaultArticlePageFields.Image,
    Link: routeFields?.Link ?? defaultArticlePageFields.Link,
    IsOnDemandEvent:
      routeFields?.IsOnDemandEvent ?? defaultArticlePageFields.IsOnDemandEvent,
    Discover: routeFields?.Discover,
    Recommended: routeFields?.Recommended,
    BannerImage:
      routeFields?.BannerImage ?? defaultArticlePageFields.BannerImage,
    Body: routeFields?.Body ?? defaultArticlePageFields.Body,
    ReadingTime:
      routeFields?.ReadingTime ?? defaultArticlePageFields.ReadingTime,
    CtaText: routeFields?.CtaText ?? defaultArticlePageFields.CtaText,
    CtaLink: routeFields?.CtaLink ?? defaultArticlePageFields.CtaLink,
    AuthorName: routeFields?.AuthorName ?? defaultArticlePageFields.AuthorName,
    AuthorTitle:
      routeFields?.AuthorTitle ?? defaultArticlePageFields.AuthorTitle,
    AuthorImage:
      routeFields?.AuthorImage ?? defaultArticlePageFields.AuthorImage,
    RelatedArticles:
      routeFields?.RelatedArticles ?? defaultArticlePageFields.RelatedArticles,
  };
}

export type KpmgBeyondArticleFieldProps = {
  fields?: Partial<KpmgBeyondArticlePageFields>;
  rendering?: { fields?: Partial<KpmgBeyondArticlePageFields> };
};

export function useKpmgBeyondArticleRouteFields(): KpmgBeyondArticlePageFields {
  const { page } = useSitecore();
  const routeFields = page.layout?.sitecore?.route?.fields as
    | Partial<KpmgBeyondArticlePageFields>
    | undefined;
  return resolveArticleRouteFields(routeFields);
}

/** Prefer rendering/layout fields (editable in Pages) with route fields as fallback. */
export function useKpmgBeyondArticlePageFields(
  props?: KpmgBeyondArticleFieldProps,
): KpmgBeyondArticlePageFields {
  const routeFields = useKpmgBeyondArticleRouteFields();
  const layoutFields = props?.fields;
  const renderingFields = props?.rendering?.fields;

  return {
    CategoryLabel:
      layoutFields?.CategoryLabel ??
      renderingFields?.CategoryLabel ??
      routeFields.CategoryLabel,
    DateLabel:
      layoutFields?.DateLabel ??
      renderingFields?.DateLabel ??
      routeFields.DateLabel,
    ArticleTitle:
      layoutFields?.ArticleTitle ??
      renderingFields?.ArticleTitle ??
      routeFields.ArticleTitle,
    Summary:
      layoutFields?.Summary ?? renderingFields?.Summary ?? routeFields.Summary,
    Image: layoutFields?.Image ?? renderingFields?.Image ?? routeFields.Image,
    Link: layoutFields?.Link ?? renderingFields?.Link ?? routeFields.Link,
    IsOnDemandEvent:
      layoutFields?.IsOnDemandEvent ??
      renderingFields?.IsOnDemandEvent ??
      routeFields.IsOnDemandEvent,
    Discover:
      layoutFields?.Discover ??
      renderingFields?.Discover ??
      routeFields.Discover,
    Recommended:
      layoutFields?.Recommended ??
      renderingFields?.Recommended ??
      routeFields.Recommended,
    BannerImage:
      layoutFields?.BannerImage ??
      renderingFields?.BannerImage ??
      routeFields.BannerImage,
    Body: layoutFields?.Body ?? renderingFields?.Body ?? routeFields.Body,
    ReadingTime:
      layoutFields?.ReadingTime ??
      renderingFields?.ReadingTime ??
      routeFields.ReadingTime,
    CtaText:
      layoutFields?.CtaText ?? renderingFields?.CtaText ?? routeFields.CtaText,
    CtaLink:
      layoutFields?.CtaLink ?? renderingFields?.CtaLink ?? routeFields.CtaLink,
    AuthorName:
      layoutFields?.AuthorName ??
      renderingFields?.AuthorName ??
      routeFields.AuthorName,
    AuthorTitle:
      layoutFields?.AuthorTitle ??
      renderingFields?.AuthorTitle ??
      routeFields.AuthorTitle,
    AuthorImage:
      layoutFields?.AuthorImage ??
      renderingFields?.AuthorImage ??
      routeFields.AuthorImage,
    RelatedArticles:
      layoutFields?.RelatedArticles ??
      renderingFields?.RelatedArticles ??
      routeFields.RelatedArticles,
  };
}

export function parseRelatedArticleIds(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw
      .map((entry) => {
        if (entry && typeof entry === "object" && "id" in entry) {
          return String((entry as { id?: string }).id ?? "").trim();
        }
        return "";
      })
      .filter(Boolean);
  }

  if (raw && typeof raw === "object" && "value" in raw) {
    const value = (raw as { value?: unknown }).value;
    if (typeof value === "string") {
      return value
        .split("|")
        .map((id) => id.trim())
        .filter(Boolean);
    }
  }

  return [];
}

export function mapItemToArticleCardFields(
  item: Item,
): KpmgBeyondArticleCardFields {
  const fields = item.fields ?? {};
  return {
    CategoryLabel: (fields.CategoryLabel as TextField) ?? { value: "" },
    DateLabel: (fields.DateLabel as TextField) ?? { value: "" },
    ArticleTitle: (fields.ArticleTitle as TextField) ?? {
      value: item.displayName ?? item.name ?? "",
    },
    Summary: (fields.Summary as TextField) ?? { value: "" },
    Image: (fields.Image as ImageField) ?? { value: { src: "", alt: "" } },
    Link: (fields.Link as LinkField) ?? { value: { href: item.url ?? "#" } },
    IsOnDemandEvent: (fields.IsOnDemandEvent as TextField) ?? { value: "" },
    Discover: fields.Discover as TextField | undefined,
    Recommended: fields.Recommended as TextField | undefined,
  };
}
