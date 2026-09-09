'use client';

import type { ImageField, LinkField, RichTextField, TextField } from '@sitecore-content-sdk/nextjs';
import { useSitecore } from '@sitecore-content-sdk/nextjs';

export interface KpmgBeyondSolutionPageFields {
  Label: TextField;
  Title: TextField;
  Summary: TextField;
  Image: ImageField;
  Link: LinkField;
  BannerImage: ImageField;
  Body: RichTextField;
  CtaText: TextField;
  CtaLink: LinkField;
}

export const defaultSolutionPageFields: KpmgBeyondSolutionPageFields = {
  Label: { value: 'Customs Self-Filing | Your in-house customs declarations solution' },
  Title: {
    value: 'Automate your customs declarations to streamline compliance, reduce costs, and increase duty/tax savings.',
  },
  Summary: { value: '' },
  Image: { value: { src: '', alt: '' } },
  Link: { value: { href: '#' } },
  BannerImage: { value: { src: '', alt: 'Solution banner' } },
  Body: { value: '<p>Solution details will appear here.</p>' },
  CtaText: { value: 'Book your free assessment today' },
  CtaLink: { value: { href: '#', text: 'Get in touch' } },
};

export function useKpmgBeyondSolutionRouteFields(): KpmgBeyondSolutionPageFields {
  const { page } = useSitecore();
  const routeFields = page.layout?.sitecore?.route?.fields as
    | Partial<KpmgBeyondSolutionPageFields & { CategoryLabel?: TextField }>
    | undefined;

  return {
    Label: routeFields?.CategoryLabel ?? defaultSolutionPageFields.Label,
    Title: routeFields?.Title ?? defaultSolutionPageFields.Title,
    Summary: routeFields?.Summary ?? defaultSolutionPageFields.Summary,
    Image: routeFields?.Image ?? defaultSolutionPageFields.Image,
    Link: routeFields?.Link ?? defaultSolutionPageFields.Link,
    BannerImage: routeFields?.BannerImage ?? defaultSolutionPageFields.BannerImage,
    Body: routeFields?.Body ?? defaultSolutionPageFields.Body,
    CtaText: routeFields?.CtaText ?? defaultSolutionPageFields.CtaText,
    CtaLink: routeFields?.CtaLink ?? defaultSolutionPageFields.CtaLink,
  };
}
