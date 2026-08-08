"use client";

import { useEffect, useState } from "react";
import { getIdToken } from "@/lib/firebase-client";

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
      <h1 className="text-3xl font-semibold">Integration dashboard</h1>
      <div className="holo-panel p-6">
        <h2 className="text-xl font-semibold">Reference API metrics</h2>
        {!metrics ? (
          <p className="mt-3 text-slate-400">Loading…</p>
        ) : (
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div><dt className="holo-muted">App ID</dt><dd className="font-mono">{metrics.app_id}</dd></div>
            <div><dt className="holo-muted">Production listing URL</dt><dd>{metrics.production_listing_url}</dd></div>
            <div><dt className="holo-muted">Qualified users</dt><dd>{metrics.metrics.qualified_users}</dd></div>
            <div><dt className="holo-muted">Snapshot</dt><dd>{metrics.metrics.snapshot_at}</dd></div>
            <div className="md:col-span-2"><dt className="holo-muted">Route</dt><dd>{metrics.integration_route}</dd></div>
            <div><dt className="holo-muted">PitchRise health</dt><dd>{metrics.pitchrise_api_health?.status ?? "unknown"}</dd></div>
          </dl>
        )}
      </div>

      <div className="holo-panel p-6">
        <h2 className="text-xl font-semibold">PitchRise auth status</h2>
        <pre className="mt-3 overflow-auto rounded-lg bg-black/40 p-4 text-xs text-slate-300">
          {pitchrise ? JSON.stringify(pitchrise, null, 2) : "Sign in to test /api/auth/me and /api/integrations."}
        </pre>
      </div>
    </div>
  );
}
