import { NextResponse } from "next/server";
import { checkPitchRiseHealth } from "@/lib/pitchrise";

export async function GET() {
  const health = await checkPitchRiseHealth();
  return NextResponse.json({ ok: true, pitchrise: health });
}
