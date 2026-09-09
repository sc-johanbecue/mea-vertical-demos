import { NextResponse } from 'next/server';
import type { User } from '@auth0/nextjs-auth0/types';
import { logAuth0UserDebug } from '@/lib/auth0-debug';
import { patchAuth0ManagementUser } from '@/lib/auth0-management';
import type {
  KpmgAuth0MarketingPrefs,
  KpmgAuth0NotificationPrefs,
} from '@/lib/kpmg-auth0-account';
import { getKpmgAuth0Session } from '@/lib/kpmg-auth0-session';

type ProfileTab = 'profile' | 'topics' | 'notifications' | 'marketing';

type UpdateProfileRequest = {
  tab: ProfileTab;
  profile?: {
    firstName?: string;
    lastName?: string;
    company?: string;
    sector?: string;
    jobRole?: string;
    businessPostcode?: string;
    annualTurnover?: string;
  };
  topicPreferences?: string[];
  notifications?: Partial<KpmgAuth0NotificationPrefs>;
  marketing?: Partial<KpmgAuth0MarketingPrefs>;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function GET() {
  const session = await getKpmgAuth0Session();
  if (!session) {
    logAuth0UserDebug('profile-api/unauthenticated', null);
    return new NextResponse(null, { status: 401 });
  }

  logAuth0UserDebug('profile-api/response', session.user);
  return NextResponse.json(session.user);
}

export async function PATCH(request: Request) {
  const session = await getKpmgAuth0Session();
  const user = session?.user;
  const domain = process.env.AUTH0_DOMAIN;

  if (!user?.sub || !domain) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: UpdateProfileRequest;
  try {
    body = (await request.json()) as UpdateProfileRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.tab) {
    return NextResponse.json({ error: 'Missing tab' }, { status: 400 });
  }

  const existingMetadata = asRecord((user as User & { user_metadata?: unknown }).user_metadata);
  const nextMetadata: Record<string, unknown> = { ...existingMetadata };

  const patch: {
    given_name?: string;
    family_name?: string;
    name?: string;
    user_metadata?: Record<string, unknown>;
  } = {};

  if (body.tab === 'profile' && body.profile) {
    const firstName = body.profile.firstName?.trim() ?? '';
    const lastName = body.profile.lastName?.trim() ?? '';

    if (firstName) {
      patch.given_name = firstName;
      nextMetadata.first_name = firstName;
    }
    if (lastName) {
      patch.family_name = lastName;
      nextMetadata.last_name = lastName;
    }
    if (firstName || lastName) {
      patch.name = [firstName, lastName].filter(Boolean).join(' ');
    }

    if (body.profile.company !== undefined) nextMetadata.company = body.profile.company;
    if (body.profile.sector !== undefined) nextMetadata.sector = body.profile.sector;
    if (body.profile.jobRole !== undefined) {
      nextMetadata.job_role = body.profile.jobRole;
    }
    if (body.profile.businessPostcode !== undefined) {
      nextMetadata.business_postcode = body.profile.businessPostcode;
    }
    if (body.profile.annualTurnover !== undefined) {
      nextMetadata.annual_turnover = body.profile.annualTurnover;
    }
  }

  if (body.tab === 'topics' && body.topicPreferences) {
    nextMetadata.topic_preferences = body.topicPreferences;
  }

  if (body.tab === 'notifications' && body.notifications) {
    nextMetadata.notifications = {
      ...asRecord(existingMetadata.notifications),
      ...body.notifications,
    };
  }

  if (body.tab === 'marketing' && body.marketing) {
    nextMetadata.marketing = {
      ...asRecord(existingMetadata.marketing),
      ...body.marketing,
    };
  }

  patch.user_metadata = nextMetadata;

  const result = await patchAuth0ManagementUser(domain, user.sub, patch);
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json({ ok: true });
}
