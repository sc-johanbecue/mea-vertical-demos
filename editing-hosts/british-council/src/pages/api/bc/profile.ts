import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from '@auth0/nextjs-auth0/types';
import {
  fetchManagementUserProfile,
  invalidateAuth0ManagementProfileCache,
} from '@/lib/auth0-enrich-user';
import { patchAuth0ManagementUser } from '@/lib/auth0-management';
import { getAuth0Session } from '@/lib/auth0-session';

type UpdateProfileRequest = {
  company?: string;
  sector?: string;
  jobRole?: string;
  businessPostcode?: string;
  annualTurnover?: string;
  topicPreferences?: string[];
  marketingOptIn?: boolean;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getAuth0Session(req);
  const user = session?.user;
  const domain = process.env.AUTH0_DOMAIN;

  if (!user?.sub || !domain) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const managementProfile = await fetchManagementUserProfile(domain, user.sub, {
      bypassCache: true,
    });
    const enrichedUser: User = {
      ...user,
      ...(managementProfile?.user_metadata
        ? { user_metadata: managementProfile.user_metadata }
        : {}),
      ...(managementProfile?.app_metadata ? { app_metadata: managementProfile.app_metadata } : {}),
    };
    return res.status(200).json(enrichedUser);
  }

  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'GET, PATCH');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = (req.body ?? {}) as UpdateProfileRequest;
  const existingMetadata = asRecord((user as User & { user_metadata?: unknown }).user_metadata);
  const managementProfile = await fetchManagementUserProfile(domain, user.sub, {
    bypassCache: true,
  });
  const nextMetadata: Record<string, unknown> = {
    ...existingMetadata,
    ...asRecord(managementProfile?.user_metadata),
  };

  if (body.company !== undefined) nextMetadata.company = body.company.trim();
  if (body.sector !== undefined) nextMetadata.sector = body.sector.trim();
  if (body.jobRole !== undefined) nextMetadata.job_role = body.jobRole.trim();
  if (body.businessPostcode !== undefined) {
    nextMetadata.business_postcode = body.businessPostcode.trim();
  }
  if (body.annualTurnover !== undefined) {
    nextMetadata.annual_turnover = body.annualTurnover.trim();
  }
  if (Array.isArray(body.topicPreferences)) {
    nextMetadata.topic_preferences = body.topicPreferences
      .map((entry) => String(entry).trim())
      .filter(Boolean);
  }
  if (body.marketingOptIn !== undefined) {
    nextMetadata.marketing = {
      ...asRecord(nextMetadata.marketing),
      subscribe_emails: Boolean(body.marketingOptIn),
      marketing_emails: Boolean(body.marketingOptIn),
    };
  }

  const result = await patchAuth0ManagementUser(domain, user.sub, {
    user_metadata: nextMetadata,
  });

  if (!result.ok) {
    return res.status(result.status).json({ error: result.message });
  }

  invalidateAuth0ManagementProfileCache(user.sub);
  return res.status(200).json({ ok: true });
}
