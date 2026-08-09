import Link from "next/link";
import { GlitchHeading } from "@/components/glitch-heading";
import { NexusPanel } from "@/components/nexus-panel";
import { siteConfig } from "@/lib/site";
import { lessons } from "@/lib/lessons";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <NexusPanel className="p-8">
        <p className="font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-[0.2em] text-[var(--dedsec-blue)]">
          $ agent-git-lab --init
        </p>
        <GlitchHeading className="mt-3 text-4xl">{siteConfig.name}</GlitchHeading>
        <p className="lesson-prose mt-4 max-w-3xl text-lg">
          {siteConfig.description} Five modules walk beginners through Git commits, branches, remotes,
          pull requests, and an agent-first workflow. Each session fires Ludwitt learning events to the PitchRise
          documented API (<code>/api/webhooks</code>, Firebase ID token) and the cohort reference API embedded in this app
          because the paid ALC developer portal is not used.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/learn" className="nexus-btn">
            Start learning
          </Link>
          <Link href="/dashboard" className="nexus-btn nexus-btn--ghost">
            Telemetry dashboard
          </Link>
        </div>
      </NexusPanel>

      <section className="grid gap-4 md:grid-cols-2">
        {lessons.map((lesson, index) => (
          <Link key={lesson.id} href={`/learn/${lesson.slug}`} className="block">
            <NexusPanel className="p-5 transition-colors hover:border-[rgba(198,255,0,0.45)]">
              <div className="flex items-start justify-between gap-3">
                <span className="chip chip--ready">mod_{String(index + 1).padStart(2, "0")}</span>
                <span className="chip">READY</span>
              </div>
              <h2 className="mt-3 text-xl font-semibold">{lesson.title}</h2>
              <p className="dedsec-muted mt-1 font-[family-name:var(--font-geist-mono)] text-xs">{lesson.slug}</p>
              <p className="mt-2 text-sm text-slate-400">{lesson.summary}</p>
            </NexusPanel>
          </Link>
        ))}
      </section>
    </div>
  );
}
