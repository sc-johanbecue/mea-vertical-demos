import type { NextApiRequest, NextApiResponse } from 'next';
import { getDocumentFacets } from '@/lib/content-hub/documents';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const facets = await getDocumentFacets();
    res.setHeader('Cache-Control', 'private, max-age=60');
    return res.status(200).json(facets);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load facets';
    return res.status(500).json({ error: message });
  }
}
