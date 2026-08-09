import { Suspense } from "react";
import { NexusPanel } from "@/components/nexus-panel";
import LaunchClient from "./launch-client";

export default function LaunchPage() {
  return (
    <Suspense
      fallback={
        <NexusPanel className="p-8">
          <p className="font-[family-name:var(--font-geist-mono)] text-sm">Loading launch…</p>
        </NexusPanel>
      }
    >
      <LaunchClient />
    </Suspense>
  );
}
