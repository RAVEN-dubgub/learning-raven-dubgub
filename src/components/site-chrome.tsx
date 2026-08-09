import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { NavLinks } from "@/components/nav-links";

export function SiteHeader() {
  return (
    <header className="dedsec-header">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <Image src="/dedsec/mark-agl.svg" alt="" width={32} height={32} className="shrink-0" />
          <span className="font-[family-name:var(--font-share-tech)] text-sm uppercase tracking-wider text-[var(--dedsec-lime)]">
            {siteConfig.name}
          </span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="dedsec-footer py-8 text-center text-sm text-slate-400">
      <p className="font-[family-name:var(--font-geist-mono)] text-xs">
        {siteConfig.name} · Hult Week 4 · Ludwitt/PitchRise ·{" "}
        <a className="text-[var(--dedsec-blue)] underline-offset-2 hover:underline" href={siteConfig.repo}>
          GitHub
        </a>
      </p>
      <p className="dedsec-muted mt-2 text-[0.65rem]">
        UI inspired by hacker OS aesthetics. Original assets only; no Ubisoft trademarks shipped.
      </p>
    </footer>
  );
}
