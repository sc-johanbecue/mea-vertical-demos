"use client";

import type { JSX } from "react";
import {
  Link as SitecoreLink,
  Image as SitecoreImage,
  Text,
} from "@sitecore-content-sdk/nextjs";
import type { KpmgBeyondSolutionSectionItem } from "./kpmg-beyond-solutions-section-shared";
import { useEditingHydrationProps } from "./kpmg-editing-hydration";

export type KpmgBeyondSolutionCardTileProps = {
  item: KpmgBeyondSolutionSectionItem;
  id?: string;
  className?: string;
  componentKey: string;
};

export function KpmgBeyondSolutionCardTile({
  item,
  id,
  className,
  componentKey,
}: KpmgBeyondSolutionCardTileProps): JSX.Element {
  const editingHydration = useEditingHydrationProps();
  const cardFields = item.fields;

  return (
    <SitecoreLink
      key={componentKey}
      {...editingHydration}
      field={cardFields.Link}
      className={[
        "component kpmg-beyond-solution-card mb-9 block w-full max-w-[1059px] no-underline last:mb-0",
        className || "",
      ].join(" ")}
      id={id}
      data-cy="SolutionPage-tile"
    >
      <article className="group flex flex-col overflow-hidden bg-kpmg-card sm:flex-row sm:justify-between">
        <div className="flex flex-col justify-center px-5 py-6 sm:w-[45%] xl:w-[42%]">
          <Text
            tag="p"
            field={cardFields.CategoryLabel}
            className="m-0 text-xs font-semibold uppercase leading-5 text-kpmg-label xl:text-sm"
            data-cy="tile-label"
          />
          <Text
            tag="h3"
            field={cardFields.ArticleTitle}
            className="title mt-3 line-clamp-3 text-base font-semibold leading-6 text-white group-hover:underline xl:text-lg"
            data-cy="tile-title"
          />
          <Text
            tag="p"
            field={cardFields.Summary}
            className="mt-3 line-clamp-4 text-sm leading-6 text-white/80"
            data-cy="tile-summary"
          />
        </div>
        <div className="relative mt-3 w-full shrink-0 bg-kpmg-elevated sm:mt-3 sm:w-[45%] xl:w-[42%]">
          <div className="relative w-full sm:pt-[50%]" data-cy="tile-image">
            <SitecoreImage
              field={cardFields.Image}
              className="block h-auto max-h-none w-full object-contain object-center sm:absolute sm:inset-0 sm:h-full sm:max-h-none sm:object-cover"
            />
            <span className="absolute bottom-3 left-3 bg-kpmg-label px-2 py-1 text-xs font-semibold uppercase tracking-wide text-kpmg-bg">
              SOLUTIONS
            </span>
          </div>
        </div>
      </article>
    </SitecoreLink>
  );
}
