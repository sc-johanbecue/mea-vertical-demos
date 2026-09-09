'use client';

import type { JSX } from 'react';
import { TextField, RichTextField, Text, RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * PepsiCoArticle — long-form health article: title, byline (hardcoded), intro, main body,
 * optional additional rich content, then hardcoded sidebar (desktop), promos, and footer blocks.
 * Sitecore fields: Title, Introduction, Content, AdditionalContent (template field "Additional Content").
 */

export interface PepsiCoArticleFields {
  Title: TextField;
  Introduction: RichTextField;
  Content: RichTextField;
  AdditionalContent: RichTextField;
}

const rteArticleBodyClass = [
  'max-w-none text-base leading-relaxed text-[#333] sm:text-[1.0625rem]',
  '[&_p]:mb-4 [&_p:last-child]:mb-0',
  '[&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-[#222] [&_h2]:first:mt-0',
  '[&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#222]',
  '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:marker:text-[#555]',
  '[&_li]:mb-1',
  '[&_strong]:font-semibold [&_strong]:text-[#222]',
  '[&_a]:font-medium [&_a]:text-[#0079c1] [&_a]:underline [&_a]:decoration-[#0079c1] [&_a]:underline-offset-2',
  '[&_a]:transition-colors hover:[&_a]:text-[#005a93] hover:[&_a]:decoration-[#005a93]',
  '[&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-2 [&_a]:focus-visible:outline-[#0079c1]',
  '[&_img]:my-6 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-sm',
].join(' ');

const rteIntroClass = [
  'max-w-none text-base leading-relaxed text-[#333] sm:text-[1.0625rem]',
  '[&_p]:mb-3 [&_p:last-child]:mb-0',
  '[&_a]:font-medium [&_a]:text-[#0079c1] [&_a]:underline [&_a]:underline-offset-2',
].join(' ');

const defaultFields: PepsiCoArticleFields = {
  Title: { value: 'What are the benefits of physiotherapy?' },
  Introduction: {
    value:
      '<p>Physiotherapy can help you recover from injury, manage pain, and stay active. Here is what to expect and how it could help you.</p>',
  },
  Content: {
    value: `<h2>What is physiotherapy?</h2>
<p>Physiotherapy helps restore movement and function when you are affected by injury, illness or disability.</p>
<h2>Why would I see a physiotherapist?</h2>
<p>You might be referred by a GP or choose to book directly for support with pain, stiffness, or recovery after surgery.</p>
<h2>Six benefits of physiotherapy</h2>
<h3>Relieve pain</h3>
<p>Targeted exercises and manual techniques can reduce discomfort and support healing.</p>
<h3>Improve movement and flexibility</h3>
<p>Your physiotherapist can design a programme to help you move with more confidence.</p>
<ul>
<li>Personalised exercise plans</li>
<li>Education and self-management tips</li>
<li>Guidance on returning to activity safely</li>
</ul>`,
  },
  AdditionalContent: { value: '' },
};

export type PepsiCoArticleProps = ComponentProps & {
  fields: PepsiCoArticleFields;
};

function hasRichText(value: RichTextField | undefined): boolean {
  return Boolean(value?.value && String(value.value).trim().length > 0);
}

export const Default = (props: PepsiCoArticleProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <article
      key={id ?? props.rendering?.uid}
      className={['component pepsico-article w-full bg-white text-[#222]', styles || '']
        .filter(Boolean)
        .join(' ')}
      id={id}
    >
      <div className="mx-auto max-w-[1200px] px-4 pt-6 pb-12 sm:px-6 lg:px-8 lg:pt-8 lg:pb-16">
        <header className="max-w-3xl">
          <Text
            tag="h1"
            field={fields.Title}
            className="m-0 text-[1.75rem] leading-tight font-bold tracking-tight text-[#222] sm:text-[2rem] lg:text-[2.25rem]"
          />

          <div className="mt-5 flex flex-wrap items-start gap-3 border-b border-[#e8ecf0] pb-6">
            <div
              className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#e8ecf0] ring-1 ring-[#dde3ea]"
              aria-hidden
            />
            <div className="min-w-0 flex-1 text-sm leading-snug sm:text-[0.9375rem]">
              <p className="m-0 font-semibold text-[#0079c1]">James Sherriff</p>
              <p className="m-0 mt-0.5 text-[#555]">Specialist Physiotherapist</p>
              <p className="m-0 mt-1 text-[#666]">Published: 23 August 2023</p>
              <p className="m-0 mt-1 text-xs font-medium text-[#0079c1]">Reviewed by PepsiCo</p>
            </div>
          </div>

          {hasRichText(fields.Introduction) ? (
            <div className={`mt-6 ${rteIntroClass}`}>
              <RichText field={fields.Introduction} />
            </div>
          ) : null}
        </header>

        <div className="mt-8 lg:mt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_min(18.5rem,32%)] lg:items-start lg:gap-10 xl:gap-12">
          <div className="min-w-0">
            {hasRichText(fields.Content) ? (
              <div className={rteArticleBodyClass}>
                <RichText field={fields.Content} />
              </div>
            ) : null}
          </div>

          <aside className="mt-10 min-w-0 space-y-8 lg:mt-0">
            <section className="rounded-md border border-[#e8ecf0] bg-white p-4 shadow-sm sm:p-5">
              <h2 className="m-0 text-base font-bold text-[#222]">
                More exercise and fitness articles
              </h2>
              <div className="mt-4 overflow-hidden rounded-sm border border-[#eef1f4]">
                <div className="aspect-16/10 w-full bg-[#e8ecf0]" aria-hidden />
                <div className="p-3">
                  <p className="m-0 text-sm leading-snug font-semibold text-[#222]">
                    10 morning stretches if you are short on time
                  </p>
                  <p className="m-0 mt-2 text-xs text-[#666]">By Alex Fry · 5 min read</p>
                </div>
              </div>
              <ul className="mt-4 space-y-4 border-t border-[#eef1f4] pt-4">
                {[
                  'How to start running safely',
                  'Strength training for beginners',
                  'Yoga for flexibility',
                ].map((title) => (
                  <li key={title} className="flex gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-[#e8ecf0]" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="m-0 text-sm leading-snug font-semibold text-[#222]">{title}</p>
                      <button
                        type="button"
                        className="mt-2 inline-flex items-center rounded border border-[#e91e8c] bg-white px-2.5 py-1 text-xs font-semibold tracking-wide text-[#e91e8c] uppercase transition hover:bg-[#fff5f9]"
                      >
                        View
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-5 w-full rounded-sm bg-[#0079c1] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#006bad]"
              >
                More articles &gt;
              </button>
            </section>

            <section className="rounded-md bg-[#f4f6f8] p-4 sm:p-5">
              <h2 className="m-0 text-base font-bold text-[#222]">
                Did you find our advice helpful?
              </h2>
              <p className="m-0 mt-2 text-sm leading-relaxed text-[#555]">
                We would love to hear your feedback. It only takes a minute.
              </p>
              <button
                type="button"
                className="mt-4 w-full rounded-sm bg-[#0079c1] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#006bad]"
              >
                Complete a short survey &gt;
              </button>
            </section>
          </aside>
        </div>

        <div className={`mt-10 max-w-3xl lg:mt-12 ${rteArticleBodyClass}`}>
          <RichText field={fields.AdditionalContent} />
        </div>

        <section className="mt-10 max-w-3xl border-t border-[#e8ecf0] pt-8 lg:mt-12">
          <div className="flex flex-wrap items-start gap-4">
            <div
              className="h-16 w-16 shrink-0 rounded-full bg-[#e8ecf0] ring-1 ring-[#dde3ea]"
              aria-hidden
            />
            <div className="min-w-0">
              <p className="m-0 text-lg font-bold text-[#222]">James Sherriff</p>
              <p className="m-0 mt-1 text-sm text-[#555]">Specialist Physiotherapist</p>
              <button
                type="button"
                className="mt-4 inline-flex items-center rounded-sm bg-[#0079c1] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#006bad]"
              >
                More by this author &gt;
              </button>
            </div>
          </div>

          <div className="mt-8">
            <p className="m-0 text-sm font-semibold text-[#222]">Share this</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <a
                href="#"
                className="font-medium text-[#0079c1] underline underline-offset-2 hover:text-[#005a93]"
              >
                Twitter
              </a>
              <a
                href="#"
                className="font-medium text-[#0079c1] underline underline-offset-2 hover:text-[#005a93]"
              >
                Facebook
              </a>
              <a
                href="#"
                className="font-medium text-[#0079c1] underline underline-offset-2 hover:text-[#005a93]"
              >
                Copy link
              </a>
            </div>
          </div>

          <p className="m-0 mt-6 text-xs leading-relaxed text-[#666]">
            <span className="font-semibold text-[#444]">Co-author:</span> PepsiCo Health Content
            Team
          </p>

          <details className="mt-4 rounded-sm border border-[#e8ecf0] bg-[#fafbfc] p-3 text-sm">
            <summary className="cursor-pointer font-semibold text-[#0079c1]">Sources</summary>
            <p className="m-0 mt-2 text-xs leading-relaxed text-[#666]">
              References and clinical sources would be listed here for transparency.
            </p>
          </details>
        </section>

        <section className="mt-8 rounded-md border border-[#e2e8ef] bg-[#f4f6f8] p-4 sm:flex sm:items-start sm:gap-4 sm:p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg font-bold text-[#2e7d32] ring-1 ring-[#c8e6c9]">
            ✓
          </div>
          <div>
            <h2 className="m-0 text-base font-bold text-[#222]">About our health information</h2>
            <p className="m-0 mt-2 text-sm leading-relaxed text-[#555]">
              Our pages are written and reviewed by clinical professionals. We aim to meet the PIF
              TICK criteria for trustworthy health information.
            </p>
          </div>
        </section>

        <nav
          className="mt-8 flex flex-wrap gap-x-4 gap-y-2 bg-[#0079c1] px-4 py-3 text-sm font-semibold text-white sm:px-5"
          aria-label="Related topics"
        >
          {[
            'Exercise and fitness',
            'Mental health and wellbeing',
            'Healthy eating',
            'Conditions',
            'Pregnancy',
          ].map((label) => (
            <span key={label} className="cursor-default opacity-95">
              {label}
            </span>
          ))}
        </nav>

        <p className="m-0 mt-6 text-[11px] leading-relaxed text-[#777]">
          This information is for general guidance only and does not replace professional medical
          advice. PepsiCo is not responsible for the content of external sites. Always speak to a
          qualified clinician about your symptoms or treatment options.
        </p>
      </div>
    </article>
  );
};
