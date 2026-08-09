"use client";

import { useEffect, useState } from "react";
import { getIdToken } from "@/lib/firebase-client";
import { GlitchHeading } from "@/components/glitch-heading";
import { NexusPanel } from "@/components/nexus-panel";

type MetricsPayload = {
  app_id: string;
  production_listing_url: string;
  integration_route: string;
  pitchrise_api_health: { status?: string };
  metrics: { unique_users: number; qualified_users: number; snapshot_at: string };
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<MetricsPayload | null>(null);
  const [pitchrise, setPitchrise] = useState<unknown>(null);

  useEffect(() => {
    fetch("/api/metrics")
      .then((r) => r.json())
      .then(setMetrics)
      .catch(() => setMetrics(null));
  }, []);

  useEffect(() => {
    (async () => {
      const idToken = await getIdToken();
      if (!idToken) return;
      const res = await fetch("/api/pitchrise/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      setPitchrise(await res.json());
    })();
  }, []);

  return (
    <div className="space-y-6">
      <GlitchHeading as="h1" className="text-3xl">
        Telemetry dashboard
      </GlitchHeading>

      <NexusPanel className="p-6">
        <h2 className="font-[family-name:var(--font-share-tech)] text-xl uppercase tracking-wide">
          Reference API metrics
        </h2>
        {!metrics ? (
          <p className="mt-3 text-slate-400">Loading…</p>
        ) : (
          <dl className="mt-4 grid gap-3 font-[family-name:var(--font-geist-mono)] text-sm md:grid-cols-2">
            <div>
              <dt className="dedsec-muted text-xs uppercase">app_id</dt>
              <dd className="mt-1 break-all">{metrics.app_id}</dd>
            </div>
            <div>
              <dt className="dedsec-muted text-xs uppercase">production_listing_url</dt>
              <dd className="mt-1 break-all">{metrics.production_listing_url}</dd>
            </div>
            <div>
              <dt className="dedsec-muted text-xs uppercase">qualified_users</dt>
              <dd className="mt-1 text-[var(--dedsec-lime)]">{metrics.metrics.qualified_users}</dd>
            </div>
            <div>
              <dt className="dedsec-muted text-xs uppercase">snapshot_at</dt>
              <dd className="mt-1">{metrics.metrics.snapshot_at}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="dedsec-muted text-xs uppercase">integration_route</dt>
              <dd className="mt-1">{metrics.integration_route}</dd>
            </div>
            <div>
              <dt className="dedsec-muted text-xs uppercase">pitchrise_health</dt>
              <dd className="mt-1">{metrics.pitchrise_api_health?.status ?? "unknown"}</dd>
            </div>
          </dl>
        )}
      </NexusPanel>

      <NexusPanel className="p-6">
        <h2 className="font-[family-name:var(--font-share-tech)] text-xl uppercase tracking-wide">
          PitchRise auth status
        </h2>
        <pre className="terminal-feed mt-3 max-h-96 overflow-auto">
          {pitchrise ? JSON.stringify(pitchrise, null, 2) : "// sign in to test /api/auth/me and /api/integrations"}
        </pre>
      </NexusPanel>
    </div>
  );
}
