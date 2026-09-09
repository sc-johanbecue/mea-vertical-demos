'use client';

import { useEffect, useRef, useState, type JSX, type ReactNode } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface PortalCarouselFields {}

export type PortalCarouselProps = ComponentProps & { fields?: PortalCarouselFields };

const AUTO_MS = 5000;

function Layout(props: PortalCarouselProps, extra = ''): JSX.Element {
  const { params, rendering } = props;
  const id = params?.DynamicPlaceholderId ?? '1';
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const slides = track.querySelectorAll('.bc-portal-slide');
      setCount(slides.length);
    };

    measure();
    const observer = new MutationObserver(measure);
    observer.observe(track, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.querySelectorAll('.bc-portal-slide').forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
      slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
  }, [index, count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  useEffect(() => {
    if (count > 0 && index >= count) setIndex(0);
  }, [count, index]);

  return (
    <section
      key={componentKey(props)}
      className={`bc-portal-carousel component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="bc-portal-carousel__viewport">
        <div ref={trackRef} className="bc-portal-carousel__track">
          <Placeholder
            name={`carousel-slides-${id}`}
            rendering={rendering}
            renderEach={(component: ReactNode, slideIndex: number) => (
              <div className="bc-portal-carousel__cell" key={slideIndex} data-slide-index={slideIndex}>
                {component}
              </div>
            )}
          />
        </div>
      </div>
      {count > 1 ? (
        <div className="bc-portal-carousel__dots" role="tablist" aria-label="Carousel slides">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              className={`bc-portal-carousel__dot${i === index ? ' is-active' : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export const Default = (p: PortalCarouselProps): JSX.Element => Layout(p);
export const Inversed = (p: PortalCarouselProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: PortalCarouselProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: PortalCarouselProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
