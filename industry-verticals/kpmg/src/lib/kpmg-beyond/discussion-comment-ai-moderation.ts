export type CommentModerationResult =
  | { allowed: true }
  | { allowed: false; reason: string };

type ModerationResponse = {
  allowed?: boolean;
  reason?: string;
};

type AzureOpenAiConfig = {
  apiKey: string;
  deployment: string;
  requestUrl: string;
  requestBody: Record<string, unknown>;
};

const DEFAULT_GUIDELINES =
  'Be respectful and constructive. Do not use profanity, harass individuals, or share confidential information.';

const DEFAULT_CLASSIC_API_VERSION = '2024-08-01-preview';

function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|div|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function resolveGuidelinesText(guidelinesHtml: string | undefined): string {
  const plain = htmlToPlainText(guidelinesHtml?.trim() ?? '');
  return plain || DEFAULT_GUIDELINES;
}

function parseModerationJson(text: string): ModerationResponse | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? trimmed).trim();
  try {
    return JSON.parse(candidate) as ModerationResponse;
  } catch {
    return null;
  }
}

/** Resolves Azure AI Foundry `/openai/v1` base URL from common endpoint formats. */
function resolveFoundryV1BaseUrl(endpoint: string): string {
  const trimmed = endpoint.replace(/\/+$/, '');

  if (trimmed.includes('/api/projects/')) {
    const origin = new URL(trimmed).origin;
    return `${origin}/openai/v1`;
  }

  if (trimmed.endsWith('/openai/v1')) {
    return trimmed;
  }

  if (trimmed.includes('services.ai.azure.com')) {
    return `${trimmed}/openai/v1`;
  }

  return trimmed;
}

function buildChatRequest(
  endpoint: string,
  deployment: string,
  prompt: string
): Pick<AzureOpenAiConfig, 'requestUrl' | 'requestBody'> {
  const messages = [{ role: 'user', content: prompt }];
  const responseFormat = { type: 'json_object' };
  const temperature = 0.1;

  const useFoundryV1 =
    endpoint.includes('/openai/v1') ||
    endpoint.includes('services.ai.azure.com') ||
    endpoint.includes('/api/projects/');

  if (useFoundryV1) {
    const baseUrl = resolveFoundryV1BaseUrl(endpoint);
    return {
      requestUrl: `${baseUrl}/chat/completions`,
      requestBody: {
        model: deployment,
        messages,
        temperature,
        response_format: responseFormat,
      },
    };
  }

  const normalizedEndpoint = endpoint.replace(/\/+$/, '');
  const apiVersion =
    process.env.AZURE_OPENAI_API_VERSION?.trim() || DEFAULT_CLASSIC_API_VERSION;

  return {
    requestUrl:
      `${normalizedEndpoint}/openai/deployments/${encodeURIComponent(deployment)}/chat/completions` +
      `?api-version=${encodeURIComponent(apiVersion)}`,
    requestBody: {
      messages,
      temperature,
      response_format: responseFormat,
    },
  };
}

function getAzureOpenAiConfig(prompt: string): AzureOpenAiConfig | null {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.trim();
  const apiKey = process.env.AZURE_OPENAI_API_KEY?.trim();
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT?.trim();
  if (!endpoint || !apiKey || !deployment) {
    return null;
  }

  const { requestUrl, requestBody } = buildChatRequest(endpoint, deployment, prompt);
  return { apiKey, deployment, requestUrl, requestBody };
}

function buildModerationPrompt(commentBody: string, guidelines: string): string {
  return [
    'You are a community comment moderator for a professional members-only forum.',
    'Review the comment below against these rules:',
    '1. No swearing, profanity, or slurs.',
    '2. No personal attacks, harassment, or bashing of named or identifiable individuals.',
    '3. Must comply with the community guidelines.',
    '',
    'Community guidelines:',
    guidelines,
    '',
    'Comment to review:',
    `"${commentBody.replace(/"/g, '\\"')}"`,
    '',
    'Reply with JSON only (no markdown):',
    '{"allowed": true|false, "reason": "brief, polite user-facing explanation when not allowed; empty string when allowed"}',
  ].join('\n');
}

function unavailableMessage(status?: number): string {
  if (status === 429) {
    return 'Comment verification is temporarily rate-limited. Please wait a moment and try again.';
  }
  return 'We could not verify your comment right now. Please try again in a moment.';
}

function formatCommentRejectionReason(reason: string | undefined): string {
  const trimmed = reason?.trim();
  if (!trimmed) {
    return 'Comment not posted, because it does not meet community guidelines. Please revise it and try again.';
  }
  if (/^comment not posted, because/i.test(trimmed)) {
    return trimmed;
  }
  const detail = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
  return `Comment not posted, because ${detail}`;
}

/** Validates a comment using Azure OpenAI (classic or AI Foundry `/openai/v1`). */
export async function validateDiscussionCommentWithAi(
  commentBody: string,
  guidelinesHtml: string | undefined
): Promise<CommentModerationResult> {
  const guidelines = resolveGuidelinesText(guidelinesHtml);
  const prompt = buildModerationPrompt(commentBody, guidelines);
  const config = getAzureOpenAiConfig(prompt);
  if (!config) {
    return {
      allowed: false,
      reason:
        'Comment moderation is not configured. Set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, and AZURE_OPENAI_DEPLOYMENT in your environment.',
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch(config.requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': config.apiKey,
      },
      signal: controller.signal,
      body: JSON.stringify(config.requestBody),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error(
        '[comment-moderation] Azure OpenAI error',
        response.status,
        config.requestUrl,
        detail
      );
      return {
        allowed: false,
        reason: unavailableMessage(response.status),
      };
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const rawText = payload.choices?.[0]?.message?.content?.trim();
    if (!rawText) {
      return {
        allowed: false,
        reason: unavailableMessage(),
      };
    }

    const parsed = parseModerationJson(rawText);
    if (!parsed || typeof parsed.allowed !== 'boolean') {
      console.error('[comment-moderation] Unexpected Azure OpenAI response', rawText);
      return {
        allowed: false,
        reason: unavailableMessage(),
      };
    }

    if (parsed.allowed) {
      return { allowed: true };
    }

    const reason = parsed.reason?.trim();
    return {
      allowed: false,
      reason: formatCommentRejectionReason(reason),
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        allowed: false,
        reason: 'Comment verification timed out. Please try again.',
      };
    }
    console.error('[comment-moderation] Azure OpenAI request failed', error);
    return {
      allowed: false,
      reason: unavailableMessage(),
    };
  } finally {
    clearTimeout(timeout);
  }
}
