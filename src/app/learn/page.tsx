import Link from "next/link";
import { lessons } from "@/lib/lessons";
import { AuthPanel } from "@/components/auth-panel";

export default function LearnIndexPage() {
  return (
    <div className="space-y-6">
      <AuthPanel />
      <h1 className="text-3xl font-semibold">Lesson path</h1>
      <div className="grid gap-4">
        {lessons.map((lesson, index) => (
          <Link
            key={lesson.id}
            href={`/learn/${lesson.slug}`}
            className="holo-panel flex items-center justify-between p-5"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-cyan-300/70">Lesson {index + 1}</p>
              <h2 className="text-xl font-semibold">{lesson.title}</h2>
              <p className="text-sm text-slate-400">{lesson.summary}</p>
            </div>
            <span className="text-sm text-cyan-200">Open →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
