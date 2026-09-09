'use client';

import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useState,
  type JSX,
  type ReactNode,
} from 'react';
import { Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey, hasLink } from '@/lib/component-utils';

export interface HeroCarouselFields {
  Title: TextField;
  SearchPlaceholder: TextField;
  SearchAction: LinkField;
}

const defaultFields: HeroCarouselFields = {
  Title: { value: 'Bermuda Monetary Authority' },
  SearchPlaceholder: { value: 'Search…' },
  SearchAction: { value: { href: '/search', text: 'Search' } },
};

export type HeroCarouselProps = ComponentProps & { fields?: HeroCarouselFields };

function flattenSlides(nodes: ReactNode): ReactNode[] {
  return Children.toArray(nodes).flatMap((child) => {
    if (!isValidElement(child)) return [child];
    const kids = (child.props as { children?: ReactNode } | null)?.children;
    if (kids && Children.count(kids) > 1 && typeof child.type !== 'function') {
      return flattenSlides(kids);
    }
    return [child];
  });
}

function HeroSlides({
  components,
  index,
  onCount,
}: {
  components: ReactNode;
  index: number;
  onCount: (count: number) => void;
}): JSX.Element {
  const slides = useMemo(() => flattenSlides(components), [components]);

  useEffect(() => {
    onCount(slides.length);
  }, [onCount, slides.length]);

  return (
    <>
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`bma-hero__slide-wrap ${i === index ? 'is-active' : ''}`.trim()}
          aria-hidden={i !== index}
        >
          {slide}
        </div>
      ))}
    </>
  );
}

export const Default = (props: HeroCarouselProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const slidesPh = dynamicPlaceholderKey('hero-slides', params);
  const [index, setIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const placeholder = fields.SearchPlaceholder?.value?.toString() || 'Search…';
  const searchHref = fields.SearchAction?.value?.href?.toString() || '#';

  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slideCount);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [slideCount]);

  useEffect(() => {
    if (index >= slideCount && slideCount > 0) setIndex(0);
  }, [index, slideCount]);

  return (
    <section
      key={componentKey(props)}
      className={`bma-hero ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bma-hero__slides">
        <Placeholder
          name={slidesPh}
          rendering={rendering}
          render={(components) => (
            <HeroSlides components={components} index={index} onCount={setSlideCount} />
          )}
        />
      </div>

      <div className="bma-hero__overlay">
        <div className="bma-hero__content">
          <Text tag="h1" className="bma-hero__title" field={fields.Title} />
          <form
            className="bma-hero__search"
            action={searchHref}
            method="get"
            role="search"
            onSubmit={(event) => {
              if (!hasLink(fields.SearchAction?.value)) {
                event.preventDefault();
              }
            }}
          >
            <label className="u-sr-only" htmlFor="bma-hero-search">
              Search
            </label>
            <input
              id="bma-hero-search"
              className="bma-hero__search-input"
              type="search"
              name="q"
              placeholder={placeholder}
            />
            <button type="submit" className="bma-hero__search-submit">
              Search
            </button>
          </form>
        </div>
      </div>

      {slideCount > 1 ? (
        <div className="bma-hero__dots" role="tablist" aria-label="Hero slides">
          {Array.from({ length: slideCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`bma-hero__dot ${i === index ? 'is-active' : ''}`.trim()}
              aria-label={`Show slide ${i + 1}`}
              aria-selected={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
};
