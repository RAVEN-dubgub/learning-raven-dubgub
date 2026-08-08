import { siteConfig } from "./site";

export type LearningEventName =
  | "lesson_started"
  | "lesson_completed"
  | "quiz_submitted"
  | "session_heartbeat";

export type PitchRiseEventPayload = {
  event: LearningEventName;
  session_id: string;
  metadata?: Record<string, unknown>;
};

export async function pitchriseFetch(
  path: string,
  idToken: string,
  init?: RequestInit
) {
  const url = `${siteConfig.pitchriseApi}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { ok: res.ok, status: res.status, body };
}

export async function verifyPitchRiseUser(idToken: string) {
  return pitchriseFetch("/auth/me", idToken, { method: "GET" });
}

export async function postPitchRiseWebhook(
  idToken: string,
  payload: PitchRiseEventPayload
) {
  return pitchriseFetch("/webhooks", idToken, {
    method: "POST",
    body: JSON.stringify({
      type: "learning_event",
      ...payload,
    }),
  });
}

export async function getPitchRiseIntegrations(idToken: string) {
  return pitchriseFetch("/integrations", idToken, { method: "GET" });
}

export async function checkPitchRiseHealth() {
  const res = await fetch(`${siteConfig.pitchriseApi}/health`, {
    next: { revalidate: 60 },
  });
  return res.json() as Promise<{ status: string; timestamp: string }>;
}
