"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { getIdToken, logoutFirebase, watchAuth } from "@/lib/firebase-client";

export function useFirebaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return watchAuth((next) => {
      setUser(next);
      setLoading(false);
    });
  }, []);

  return { user, loading, getIdToken, logout: logoutFirebase };
}

export function AuthPanel() {
  const { user, loading, logout } = useFirebaseUser();

  if (loading) {
    return (
      <p className="dedsec-muted font-[family-name:var(--font-geist-mono)] text-sm">
        {"// checking pitch-rise session…"}
      </p>
    );
  }
  if (!user) {
    return (
      <p className="dedsec-muted font-[family-name:var(--font-geist-mono)] text-sm">
        {"// sign in at /login to sync learning events with PitchRise Firebase"}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="chip chip--ready">{user.email}</span>
      <button type="button" className="nexus-btn nexus-btn--ghost text-sm" onClick={() => logout()}>
        Sign out
      </button>
    </div>
  );
}
