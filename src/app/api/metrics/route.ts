import { NextResponse } from "next/server";
import {
  ensureAppRegistration,
  getReferenceMetrics,
} from "@/lib/ludwitt-reference";
import { checkPitchRiseHealth } from "@/lib/pitchrise";

export async function GET() {
  const [app, metrics, health] = await Promise.all([
    ensureAppRegistration(),
    getReferenceMetrics(),
    checkPitchRiseHealth().catch(() => ({ status: "unknown" })),
  ]);

  return NextResponse.json({
    app_id: app.appId,
    production_listing_url: process.env.NEXT_PUBLIC_SITE_URL,
    integration_route: "PitchRise documented API + embedded cohort reference API (developer portal blocked; no ALC bypass)",
    pitchrise_api_health: health,
    metrics,
  });
}
