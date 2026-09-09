import type { NextApiRequest, NextApiResponse } from 'next';
import { createAuth0User } from '@/lib/auth0-management';

type RegisterRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  company?: string;
  sector?: string;
  jobRole?: string;
  businessPostcode?: string;
  annualTurnover?: string;
  topicPreferences?: string[];
  acceptTerms?: boolean;
  marketingOptIn?: boolean;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const domain = process.env.AUTH0_DOMAIN;
  if (!domain) {
    return res.status(503).json({ error: 'Auth0 is not configured.' });
  }

  const body = (req.body ?? {}) as RegisterRequest;

  const firstName = body.firstName?.trim() ?? '';
  const lastName = body.lastName?.trim() ?? '';
  const email = body.email?.trim().toLowerCase() ?? '';
  const password = body.password ?? '';
  const confirmPassword = body.confirmPassword ?? '';

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  if (!body.acceptTerms) {
    return res.status(400).json({ error: 'You must accept the terms to register.' });
  }

  const topicPreferences = Array.isArray(body.topicPreferences)
    ? body.topicPreferences.map((entry) => String(entry).trim()).filter(Boolean)
    : [];

  const result = await createAuth0User(domain, {
    email,
    password,
    given_name: firstName,
    family_name: lastName,
    name: [firstName, lastName].filter(Boolean).join(' '),
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      company: body.company?.trim() ?? '',
      sector: body.sector?.trim() ?? '',
      job_role: body.jobRole?.trim() ?? '',
      business_postcode: body.businessPostcode?.trim() ?? '',
      annual_turnover: body.annualTurnover?.trim() ?? '',
      topic_preferences: topicPreferences,
      marketing: {
        subscribe_emails: Boolean(body.marketingOptIn),
        marketing_emails: Boolean(body.marketingOptIn),
      },
    },
  });

  if (!result.ok) {
    return res.status(result.status).json({ error: result.message });
  }

  return res.status(200).json({ ok: true, userId: result.userId });
}
