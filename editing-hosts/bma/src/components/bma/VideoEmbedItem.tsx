'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface VideoEmbedItemFields {
  Title: TextField;
  VideoUrl: TextField;
}

const defaultFields: VideoEmbedItemFields = {
  Title: { value: 'Video title' },
  VideoUrl: { value: '' },
};

export type VideoEmbedItemProps = ComponentProps & { fields?: VideoEmbedItemFields };

function toEmbedUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.replace(/^\//, '').split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname.startsWith('/embed/')) {
        return `https://www.youtube.com${url.pathname}${url.search}`;
      }
      const id = url.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts[0] === 'shorts' && parts[1]) {
        return `https://www.youtube.com/embed/${parts[1]}`;
      }
    }
  } catch {
    /* fall through */
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return `https://www.youtube.com/embed/${value}`;
  }

  return null;
}

export const Default = (props: VideoEmbedItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const title = fields.Title?.value?.toString().trim() || '';
  const rawUrl = fields.VideoUrl?.value?.toString() || '';
  const embedUrl = toEmbedUrl(rawUrl);
  const iframeTitle = title || 'Video';

  return (
    <article
      key={componentKey(props)}
      className={`bma-video-item ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {title ? <Text tag="h3" className="bma-video-item__title" field={fields.Title} /> : null}
      <div className="bma-video-item__frame">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={iframeTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className="bma-video-item__empty">Add a YouTube URL</div>
        )}
      </div>
    </article>
  );
};
