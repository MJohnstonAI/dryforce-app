import "server-only";

type VerificationResult = {
  ok: boolean;
  reason?: string;
};

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 4000;
const RETRY_DELAY_MS = 250;
const MAX_RETRIES = 1;
const MAX_INFLIGHT = 25;

let inflight = 0;

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
  let attempt = 0;
  let lastError: unknown;

  while (attempt <= MAX_RETRIES) {
    try {
      return await fetchWithTimeout(url, options, TIMEOUT_MS);
    } catch (error) {
      lastError = error;
      if (attempt === MAX_RETRIES) break;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)));
      attempt += 1;
    }
  }

  throw lastError;
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string,
): Promise<VerificationResult> {
  if (!token) {
    return { ok: false, reason: "missing-token" };
  }

  const secret =
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ?? process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { ok: false, reason: "missing-secret" };
  }

  if (inflight >= MAX_INFLIGHT) {
    return { ok: false, reason: "busy" };
  }

  inflight += 1;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) {
      body.set("remoteip", remoteIp);
    }

    const response = await fetchWithRetry(VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      return { ok: false, reason: "verify-failed" };
    }

    const data = (await response.json()) as { success?: boolean };
    if (!data?.success) {
      return { ok: false, reason: "invalid" };
    }

    return { ok: true };
  } catch {
    return { ok: false, reason: "error" };
  } finally {
    inflight -= 1;
  }
}
