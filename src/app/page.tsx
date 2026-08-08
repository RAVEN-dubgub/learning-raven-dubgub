import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { lessons } from "@/lib/lessons";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="holo-panel p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">Week 4 · Ludwitt learning</p>
        <h1 className="mt-3 text-4xl font-semibold">{siteConfig.name}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
          {siteConfig.description} Five short lessons walk beginners through Git commits, branches, remotes,
          pull requests, and an agent-first workflow. Each session fires Ludwitt learning events to the PitchRise
          documented API (`/api/webhooks`, Firebase ID token) and the cohort reference API embedded in this app
          because the paid ALC developer portal is not used.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/learn" className="holo-btn">
            Start learning
          </Link>
          <Link href="/dashboard" className="holo-btn">
            Metrics dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {lessons.map((lesson) => (
          <Link key={lesson.id} href={`/learn/${lesson.slug}`} className="holo-panel block p-5 hover:border-cyan-300/40">
            <h2 className="text-xl font-semibold">{lesson.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{lesson.summary}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
