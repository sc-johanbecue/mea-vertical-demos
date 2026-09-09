import { NextResponse } from 'next/server';
import { createAuth0User } from '@/lib/auth0-management';

export const dynamic = 'force-dynamic';

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

export async function POST(request: Request) {
  const domain = process.env.AUTH0_DOMAIN;
  if (!domain) {
    return NextResponse.json({ error: 'Auth0 is not configured.' }, { status: 503 });
  }

  let body: RegisterRequest;
  try {
    body = (await request.json()) as RegisterRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const firstName = body.firstName?.trim() ?? '';
  const lastName = body.lastName?.trim() ?? '';
  const email = body.email?.trim().toLowerCase() ?? '';
  const password = body.password ?? '';
  const confirmPassword = body.confirmPassword ?? '';

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
  }

  if (!body.acceptTerms) {
    return NextResponse.json({ error: 'You must accept the terms to register.' }, { status: 400 });
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
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json({ ok: true, userId: result.userId });
}
