import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import { siteConfig } from "./site";

const BLOCKED_HANDLES = ["raven-dubgub", "rogersuperbuilderalpha"];

export async function ensureAppRegistration() {
  const existing = await prisma.appRegistration.findFirst();
  if (existing) return existing;

  const appId = randomUUID();
  const apiKey = `lk_${randomUUID().replace(/-/g, "")}`;
  const jwtSecret = randomUUID();
  const launchUrl = `${siteConfig.url}/launch`;

  return prisma.appRegistration.create({
    data: {
      appId,
      apiKey,
      jwtSecret,
      title: siteConfig.name,
      topic: siteConfig.topic,
      launchUrl,
      repoUrl: siteConfig.repo,
    },
  });
}

export function authenticateReferenceKey(header: string | null) {
  if (!header?.startsWith("Bearer ")) return null;
  const key = header.slice(7).trim();
  return prisma.appRegistration.findFirst({ where: { apiKey: key } });
}

export function isBlockedUser(userId: string, email: string) {
  const hay = `${userId} ${email}`.toLowerCase();
  return BLOCKED_HANDLES.some((h) => hay.includes(h));
}

export async function verifyLaunchToken(token: string) {
  const app = await ensureAppRegistration();
  const payload = jwt.verify(token, app.jwtSecret) as {
    sub: string;
    email: string;
    app_id: string;
    exp: number;
  };
  if (payload.app_id !== app.appId) {
    throw new Error("app_id mismatch");
  }
  return { app, payload };
}

export async function createLaunchToken(userId: string, email: string) {
  const app = await ensureAppRegistration();
  const token = jwt.sign(
    { sub: userId, email, app_id: app.appId },
    app.jwtSecret,
    { expiresIn: "1h" }
  );
  return { token, launchUrl: `${app.launchUrl}?token=${token}`, appId: app.appId };
}

export async function recordReferenceEvent(input: {
  event: string;
  userId: string;
  sessionId: string;
  email: string;
  metadata?: Record<string, unknown>;
}) {
  const learner = await prisma.learner.upsert({
    where: { firebaseUid: input.userId },
    create: {
      firebaseUid: input.userId,
      email: input.email,
      displayName: input.email.split("@")[0],
    },
    update: { email: input.email },
  });

  const session = await prisma.learningSession.upsert({
    where: { id: input.sessionId },
    create: {
      id: input.sessionId,
      learnerId: learner.id,
      source: "reference",
    },
    update: {},
  });

  const counted = !isBlockedUser(input.userId, input.email);

  await prisma.learningEvent.create({
    data: {
      sessionId: session.id,
      learnerId: learner.id,
      event: input.event,
      metadata: (input.metadata ?? {}) as object,
      counted,
    },
  });

  return { accepted: true, counted };
}

export async function getReferenceMetrics() {
  const learners = await prisma.learningEvent.findMany({
    where: {
      counted: true,
      event: { in: ["lesson_started", "lesson_completed", "quiz_submitted"] },
    },
    select: { learnerId: true },
    distinct: ["learnerId"],
  });

  return {
    unique_users: learners.length,
    qualified_users: learners.length,
    snapshot_at: new Date().toISOString(),
  };
}
