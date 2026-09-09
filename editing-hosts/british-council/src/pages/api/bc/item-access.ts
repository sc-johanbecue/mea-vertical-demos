import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchItemAccessFields } from '@/lib/bc-item-access';
import { hasBcAccessRules, userCanAccessFields } from '@/lib/bc-access';
import { getAuth0Session } from '@/lib/auth0-session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const path = typeof req.query.path === 'string' ? req.query.path : '';
  const id = typeof req.query.id === 'string' ? req.query.id : '';
  const language = typeof req.query.language === 'string' ? req.query.language : undefined;

  if (!path && !id) {
    return res.status(400).json({ error: 'path or id is required' });
  }

  const fields = await fetchItemAccessFields({ path, id, language });
  const session = await getAuth0Session(req);
  const allowed = userCanAccessFields(session?.user, fields);

  return res.status(200).json({
    allowed,
    hasRules: hasBcAccessRules(fields),
    fields,
  });
}
