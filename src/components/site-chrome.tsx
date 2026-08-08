import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-cyan-400/20 bg-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <Link href="/learn">Lessons</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/login">Sign in</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-cyan-400/10 py-8 text-center text-sm text-slate-400">
      <p>
        {siteConfig.name} · Hult Cohort Week 4 · Ludwitt/PitchRise integration ·{" "}
        <a className="underline" href={siteConfig.repo}>
          GitHub
        </a>
      </p>
    </footer>
  );
}
