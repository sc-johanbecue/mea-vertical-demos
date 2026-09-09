"use client";

import type {
  ImageField,
  Item,
  LinkField,
  RichTextField,
  TextField,
} from "@sitecore-content-sdk/nextjs";
import { useSitecore } from "@sitecore-content-sdk/nextjs";
import type { ComponentProps } from "@/lib/component-props";
import type { KpmgBeyondEventCardFields } from "./KpmgBeyondEventCard";

export interface KpmgBeyondEventPageFields extends KpmgBeyondEventCardFields {
  IsOnDemandEvent: TextField;
  Location: TextField;
  Duration: TextField;
  DateDisplay: TextField;
  Body: RichTextField;
  JoinLink: LinkField;
  CancelRegistrationLabel: TextField;
  RegisteredMessage: TextField;
  SpeakersBody?: RichTextField;
  RelatedEvents?: Item[];
}

export const defaultEventPageFields: KpmgBeyondEventPageFields = {
  CategoryLabel: { value: "SUSTAINABILITY" },
  Time: { value: "12.00 PM" },
  EventTitle: {
    value:
      "Sustainability reporting & assurance webinar: what should be on your radar?",
  },
  Summary: { value: "" },
  Image: { value: { src: "", alt: "Event" } },
  Link: { value: { href: "#" } },
  EventDay: { value: "10" },
  EventMonth: { value: "JUN" },
  IsOnDemandEvent: { value: "" },
  Location: { value: "Virtual" },
  Duration: { value: "1h" },
  DateDisplay: { value: "June 10, 2026 at 12.00 PM" },
  Body: {
    value:
      "<p>Join our specialists for practical guidance on sustainability reporting and assurance.</p>",
  },
  JoinLink: { value: { href: "#", text: "Join now" } },
  CancelRegistrationLabel: { value: "Cancel registration" },
  RegisteredMessage: {
    value:
      "Thank you for registering. Please check your email for confirmation.",
  },
  SpeakersBody: { value: "" },
  RelatedEvents: [],
};

function isOnDemandField(value: TextField | undefined): boolean {
  const normalized = String(value?.value ?? "")
    .trim()
    .toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function resolveEventRouteFields(
  routeFields?: Partial<KpmgBeyondEventPageFields>,
): KpmgBeyondEventPageFields {
  return {
    CategoryLabel:
      routeFields?.CategoryLabel ?? defaultEventPageFields.CategoryLabel,
    Time: routeFields?.Time ?? defaultEventPageFields.Time,
    EventTitle: routeFields?.EventTitle ?? defaultEventPageFields.EventTitle,
    Summary: routeFields?.Summary ?? defaultEventPageFields.Summary,
    Image: routeFields?.Image ?? defaultEventPageFields.Image,
    Link: routeFields?.Link ?? defaultEventPageFields.Link,
    EventDay: routeFields?.EventDay ?? defaultEventPageFields.EventDay,
    EventMonth: routeFields?.EventMonth ?? defaultEventPageFields.EventMonth,
    IsOnDemandEvent:
      routeFields?.IsOnDemandEvent ?? defaultEventPageFields.IsOnDemandEvent,
    Location: routeFields?.Location ?? defaultEventPageFields.Location,
    Duration: routeFields?.Duration ?? defaultEventPageFields.Duration,
    DateDisplay: routeFields?.DateDisplay ?? defaultEventPageFields.DateDisplay,
    Body: routeFields?.Body ?? defaultEventPageFields.Body,
    JoinLink: routeFields?.JoinLink ?? defaultEventPageFields.JoinLink,
    CancelRegistrationLabel:
      routeFields?.CancelRegistrationLabel ??
      defaultEventPageFields.CancelRegistrationLabel,
    RegisteredMessage:
      routeFields?.RegisteredMessage ??
      defaultEventPageFields.RegisteredMessage,
    SpeakersBody:
      routeFields?.SpeakersBody ?? defaultEventPageFields.SpeakersBody,
    RelatedEvents:
      routeFields?.RelatedEvents ?? defaultEventPageFields.RelatedEvents,
  };
}

function resolveEventLayoutFields(
  props: ComponentProps & { fields?: Partial<KpmgBeyondEventPageFields> },
): Partial<KpmgBeyondEventPageFields> | undefined {
  const fromProps = props.fields as
    | Partial<KpmgBeyondEventPageFields>
    | undefined;
  const fromRendering = props.rendering?.fields as
    | Partial<KpmgBeyondEventPageFields>
    | undefined;
  if (!fromProps && !fromRendering) {
    return undefined;
  }
  return { ...fromRendering, ...fromProps };
}

export function useKpmgBeyondEventPageFields(
  props: ComponentProps & { fields?: Partial<KpmgBeyondEventPageFields> },
): KpmgBeyondEventPageFields {
  const { page } = useSitecore();
  const routeFields = page.layout?.sitecore?.route?.fields as
    | Partial<KpmgBeyondEventPageFields>
    | undefined;
  const layoutFields = resolveEventLayoutFields(props);

  if (layoutFields && Object.keys(layoutFields).length > 0) {
    return resolveEventRouteFields({ ...routeFields, ...layoutFields });
  }

  return resolveEventRouteFields(routeFields);
}

export function useKpmgBeyondEventRouteFields(): KpmgBeyondEventPageFields {
  const { page } = useSitecore();
  const routeFields = page.layout?.sitecore?.route?.fields as
    | Partial<KpmgBeyondEventPageFields>
    | undefined;
  return resolveEventRouteFields(routeFields);
}

export function isEventOnDemandFromFields(
  fields: KpmgBeyondEventPageFields,
): boolean {
  return isOnDemandField(fields.IsOnDemandEvent);
}

export function mapItemToEventCardFields(
  item: Item,
): KpmgBeyondEventPageFields {
  const fields = item.fields ?? {};
  return resolveEventRouteFields({
    CategoryLabel: fields.CategoryLabel as TextField,
    Time: fields.Time as TextField,
    EventTitle: (fields.Title as TextField) ?? {
      value: item.displayName ?? item.name ?? "",
    },
    Summary: fields.Summary as TextField,
    Image: fields.Image as ImageField,
    Link: (fields.Link as LinkField) ?? { value: { href: item.url ?? "#" } },
    EventDay: fields.EventDay as TextField,
    EventMonth: fields.EventMonth as TextField,
    IsOnDemandEvent: fields.IsOnDemandEvent as TextField,
    Location: fields.Location as TextField,
    Duration: fields.Duration as TextField,
    DateDisplay: fields.DateDisplay as TextField,
    Body: fields.Body as RichTextField,
    JoinLink: fields.JoinLink as LinkField,
    CancelRegistrationLabel: fields.CancelRegistrationLabel as TextField,
    RegisteredMessage: fields.RegisteredMessage as TextField,
    SpeakersBody: fields.SpeakersBody as RichTextField,
    RelatedEvents: fields.RelatedEvents as Item[] | undefined,
  });
}

export function parseRelatedEventIds(related: unknown): string[] {
  if (Array.isArray(related)) {
    return (related as Item[])
      .map((item) => item?.id?.replace(/[{}-]/g, "").toLowerCase() ?? "")
      .filter(Boolean);
  }

  if (related && typeof related === "object" && "value" in related) {
    const value = (related as { value?: unknown }).value;
    if (typeof value === "string") {
      return value
        .split("|")
        .map((id) => id.trim())
        .filter(Boolean);
    }
  }

  return [];
}
