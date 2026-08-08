import { notFound } from "next/navigation";
import { getLesson } from "@/lib/lessons";
import { LessonExperience } from "@/components/lesson-experience";
import { AuthPanel } from "@/components/auth-panel";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  return (
    <div className="space-y-6">
      <AuthPanel />
      <LessonExperience lesson={lesson} />
    </div>
  );
}
