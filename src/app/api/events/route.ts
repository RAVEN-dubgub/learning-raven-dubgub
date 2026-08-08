import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  recordReferenceEvent,
  verifyLaunchToken,
} from "@/lib/ludwitt-reference";
import { verifyFirebaseIdToken } from "@/lib/firebase-server";
import {
  postPitchRiseWebhook,
  verifyPitchRiseUser,
  type LearningEventName,
} from "@/lib/pitchrise";

const bodySchema = z.object({
  event: z.enum([
    "lesson_started",
    "lesson_completed",
    "quiz_submitted",
    "session_heartbeat",
  ]),
  session_id: z.string().min(1),
  lesson_id: z.string().optional(),
  score: z.number().optional(),
  idToken: z.string().optional(),
  launchToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { event, session_id, lesson_id, score, idToken, launchToken } =
      parsed.data;
    const metadata = {
      lesson_id,
      score,
      app: "learning-raven-dubgub",
    };

    let userId = "anonymous";
    let email = "anonymous@local";
    let pitchrise: { ok: boolean; status: number; body: unknown } | null = null;

    if (idToken) {
      const me = await verifyPitchRiseUser(idToken);
      if (me.ok && me.body && typeof me.body === "object") {
        const data = me.body as { user?: { uid?: string; email?: string } };
        userId = data.user?.uid ?? userId;
        email = data.user?.email ?? email;
      } else {
        const firebaseUser = await verifyFirebaseIdToken(idToken);
        if (firebaseUser) {
          userId = firebaseUser.uid;
          email = firebaseUser.email;
        }
      }
      pitchrise = await postPitchRiseWebhook(idToken, {
        event: event as LearningEventName,
        session_id,
        metadata,
      });
    } else if (launchToken) {
      const { payload } = await verifyLaunchToken(launchToken);
      userId = payload.sub;
      email = payload.email;
    }

    const reference = await recordReferenceEvent({
      event,
      userId,
      sessionId: session_id,
      email,
      metadata,
    });

    return NextResponse.json({
      ok: true,
      reference,
      pitchrise: pitchrise
        ? { status: pitchrise.status, accepted: pitchrise.ok, body: pitchrise.body }
        : { skipped: true, reason: "No Firebase ID token supplied" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "event failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
