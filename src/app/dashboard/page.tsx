"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getIdToken, watchAuth } from "@/lib/firebase-client";
import { GlitchHeading } from "@/components/glitch-heading";
import { NexusPanel } from "@/components/nexus-panel";

type MetricsPayload = {
  app_id: string;
  production_listing_url: string;
  integration_route: string;
  pitchrise_api_health: { status?: string };
  metrics: { unique_users: number; qualified_users: number; snapshot_at: string };
};

type LoadState = "loading" | "ready" | "error";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<MetricsPayload | null>(null);
  const [metricsState, setMetricsState] = useState<LoadState>("loading");
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [pitchrise, setPitchrise] = useState<unknown>(null);
  const [pitchriseState, setPitchriseState] = useState<LoadState>("loading");

  const loadMetrics = useCallback(async () => {
    setMetricsState("loading");
    setMetricsError(null);
    try {
      const res = await fetch("/api/metrics", { cache: "no-store" });
      const data = (await res.json()) as MetricsPayload & { error?: string };
      if (!res.ok || !data.metrics) {
        throw new Error(typeof data.error === "string" ? data.error : `HTTP ${res.status}`);
      }
      setMetrics(data);
      setMetricsState("ready");
    } catch (err) {
      setMetrics(null);
      setMetricsState("error");
      setMetricsError(err instanceof Error ? err.message : "Failed to load metrics");
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => loadMetrics());
  }, [loadMetrics]);

  useEffect(() => {
    return watchAuth((user) => setSignedIn(Boolean(user)));
  }, []);

  useEffect(() => {
    if (signedIn !== true) return;

    let cancelled = false;
    (async () => {
      setPitchriseState("loading");
      try {
        const idToken = await getIdToken();
        if (!idToken) {
          if (!cancelled) setPitchriseState("ready");
          return;
        }
        const res = await fetch("/api/pitchrise/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        const data = await res.json();
        if (!cancelled) {
          setPitchrise(data);
          setPitchriseState(res.ok ? "ready" : "error");
        }
      } catch {
        if (!cancelled) setPitchriseState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  return (
    <div className="space-y-6">
      <GlitchHeading as="h1" className="text-3xl">
        Telemetry dashboard
      </GlitchHeading>

      <NexusPanel className="p-6">
        <h2 className="font-[family-name:var(--font-share-tech)] text-xl uppercase tracking-wide">
          Reference API metrics
        </h2>
        {metricsState === "loading" ? (
          <p className="mt-3 text-slate-400">Loading…</p>
        ) : metricsState === "error" ? (
          <div className="mt-3 space-y-3">
            <p className="text-sm text-[var(--dedsec-error)]">
              {"// metrics fetch failed: "}
              {metricsError}
            </p>
            <button type="button" className="nexus-btn nexus-btn--ghost text-sm" onClick={() => void loadMetrics()}>
              Retry
            </button>
          </div>
        ) : metrics ? (
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
        ) : null}
      </NexusPanel>

      <NexusPanel className="p-6">
        <h2 className="font-[family-name:var(--font-share-tech)] text-xl uppercase tracking-wide">
          PitchRise auth status
        </h2>
        {signedIn === null || pitchriseState === "loading" ? (
          <p className="mt-3 text-slate-400">Checking session…</p>
        ) : !signedIn ? (
          <p className="terminal-feed mt-3 text-sm text-slate-300">
            {"// not signed in - "}
            <Link href="/login" className="text-[var(--dedsec-lime)] underline-offset-2 hover:underline">
              open /login
            </Link>{" "}
            to test /api/auth/me and /api/integrations
          </p>
        ) : pitchriseState === "error" ? (
          <p className="mt-3 text-sm text-[var(--dedsec-error)]">
            {"// pitchrise status request failed"}
          </p>
        ) : (
          <pre className="terminal-feed mt-3 max-h-96 overflow-auto">
            {JSON.stringify(pitchrise, null, 2)}
          </pre>
        )}
      </NexusPanel>
    </div>
  );
}
