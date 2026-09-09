import type { NextApiRequest, NextApiResponse } from 'next';
import { parseListParam, searchDocuments } from '@/lib/content-hub/documents';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q, sort, after, first, viewableOnly } = req.query;
    const result = await searchDocuments({
      q: typeof q === 'string' ? q : undefined,
      docTypes: parseListParam(req.query.docTypes),
      categories: parseListParam(req.query.categories),
      topics: parseListParam(req.query.topics),
      media: parseListParam(req.query.media),
      viewableOnly:
        viewableOnly === '1' ||
        viewableOnly === 'true' ||
        (Array.isArray(viewableOnly) && viewableOnly.some((value) => value === '1' || value === 'true')),
      sort: sort === 'title' ? 'title' : 'date',
      after: typeof after === 'string' ? after : undefined,
      first: typeof first === 'string' ? Number(first) : 20,
    });

    res.setHeader('Cache-Control', 'private, max-age=30');
    return res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to search documents';
    return res.status(500).json({ error: message });
  }
}
