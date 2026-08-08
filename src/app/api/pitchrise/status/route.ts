import { NextRequest, NextResponse } from "next/server";
import { getPitchRiseIntegrations, verifyPitchRiseUser } from "@/lib/pitchrise";

export async function POST(req: NextRequest) {
  const { idToken } = (await req.json()) as { idToken?: string };
  if (!idToken) {
    return NextResponse.json({ error: "idToken required" }, { status: 400 });
  }

  const [me, integrations] = await Promise.all([
    verifyPitchRiseUser(idToken),
    getPitchRiseIntegrations(idToken),
  ]);

  return NextResponse.json({
    auth: { status: me.status, ok: me.ok, body: me.body },
    integrations: {
      status: integrations.status,
      ok: integrations.ok,
      body: integrations.body,
    },
  });
}
