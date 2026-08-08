import { NextRequest, NextResponse } from "next/server";
import { authenticateReferenceKey, getReferenceMetrics } from "@/lib/ludwitt-reference";

export async function GET(req: NextRequest) {
  const app = await authenticateReferenceKey(req.headers.get("authorization"));
  if (!app) {
    return NextResponse.json({ error: "invalid api key" }, { status: 401 });
  }

  const metrics = await getReferenceMetrics();
  return NextResponse.json({
    app_id: app.appId,
    ...metrics,
  });
}
