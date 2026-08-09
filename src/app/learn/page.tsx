import Link from "next/link";
import { GlitchHeading } from "@/components/glitch-heading";
import { NexusPanel } from "@/components/nexus-panel";
import { lessons } from "@/lib/lessons";
import { AuthPanel } from "@/components/auth-panel";

export default function LearnIndexPage() {
  return (
    <div className="space-y-6">
      <AuthPanel />
      <GlitchHeading as="h1" className="text-3xl">
        Module path
      </GlitchHeading>
      <div className="grid gap-4">
        {lessons.map((lesson, index) => (
          <Link key={lesson.id} href={`/learn/${lesson.slug}`} className="block">
            <NexusPanel className="flex items-center justify-between p-5 transition-colors hover:border-[rgba(0,168,255,0.4)]">
              <div>
                <p className="font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-widest text-[var(--dedsec-blue)]">
                  mod_{String(index + 1).padStart(2, "0")} · {lesson.slug}
                </p>
                <h2 className="mt-1 text-xl font-semibold">{lesson.title}</h2>
                <p className="text-sm text-slate-400">{lesson.summary}</p>
              </div>
              <span className="font-[family-name:var(--font-geist-mono)] text-sm text-[var(--dedsec-lime)]">open →</span>
            </NexusPanel>
          </Link>
        ))}
      </div>
    </div>
  );
}
