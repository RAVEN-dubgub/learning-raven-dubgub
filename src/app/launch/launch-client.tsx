"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { NexusPanel } from "@/components/nexus-panel";

export default function LaunchClient() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [status, setStatus] = useState("Validating Ludwitt launch token…");

  useEffect(() => {
    if (!token) {
      setStatus("Missing token. Launch from the reference API or cohort launcher.");
      return;
    }

    sessionStorage.setItem("ludwitt_launch_token", token);
    setStatus("Token stored. Redirecting to lessons…");
    router.replace("/learn");
  }, [token, router]);

  return (
    <NexusPanel className="p-8">
      <h1 className="font-[family-name:var(--font-share-tech)] text-2xl uppercase tracking-wide">Launch</h1>
      <p className="mt-3 font-[family-name:var(--font-geist-mono)] text-sm text-slate-300">{status}</p>
    </NexusPanel>
  );
}
