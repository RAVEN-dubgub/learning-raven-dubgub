import { Suspense } from "react";
import LaunchClient from "./launch-client";

export default function LaunchPage() {
  return (
    <Suspense fallback={<div className="holo-panel p-8">Loading launch…</div>}>
      <LaunchClient />
    </Suspense>
  );
}
