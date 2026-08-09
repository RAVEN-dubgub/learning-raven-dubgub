"use client";

import { useMemo, useState } from "react";
import type { Lesson } from "@/lib/lessons";
import { getIdToken } from "@/lib/firebase-client";
import { GlitchHeading } from "@/components/glitch-heading";
import { NexusPanel } from "@/components/nexus-panel";

function sessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sess_${Date.now()}`;
}

export function LessonExperience({ lesson }: { lesson: Lesson }) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const sid = useMemo(() => sessionId(), []);

  async function fire(event: string, extra?: Record<string, unknown>) {
    const idToken = await getIdToken();
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        session_id: sid,
        lesson_id: lesson.id,
        idToken: idToken ?? undefined,
        ...extra,
      }),
    });
    setEvents((prev) => [...prev, `[${res.ok ? "OK" : "ERR"}] ${event} → ${res.status}`]);
    return res.json();
  }

  async function startLesson() {
    setStarted(true);
    await fire("lesson_started");
  }

  async function submitQuiz() {
    const score = lesson.quiz.reduce((acc, q) => {
      return acc + (answers[q.id] === q.answerIndex ? 1 : 0);
    }, 0);
    await fire("quiz_submitted", { score });
    await fire("lesson_completed", { score });
    setSubmitted(true);
  }

  const score = lesson.quiz.reduce((acc, q) => {
    return acc + (answers[q.id] === q.answerIndex ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-6">
      <NexusPanel className="p-6">
        <p className="dedsec-muted font-[family-name:var(--font-geist-mono)] text-sm">
          {lesson.minutes} min · {lesson.summary}
        </p>
        <GlitchHeading as="h1" className="mt-2 text-3xl">
          {lesson.title}
        </GlitchHeading>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-slate-300">
          {lesson.objectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </NexusPanel>

      {!started ? (
        <button type="button" className="nexus-btn" onClick={startLesson}>
          Execute module
        </button>
      ) : (
        <>
          <NexusPanel className="space-y-4 p-6">
            {lesson.content.map((paragraph) => (
              <p key={paragraph} className="lesson-prose">
                {paragraph}
              </p>
            ))}
          </NexusPanel>

          <NexusPanel className="space-y-4 p-6">
            <h2 className="font-[family-name:var(--font-share-tech)] text-xl uppercase tracking-wide">
              Quick check
            </h2>
            {lesson.quiz.map((q) => (
              <fieldset key={q.id} className="space-y-2 border-0 p-0">
                <legend className="mb-2 font-medium">{q.prompt}</legend>
                {q.choices.map((choice, idx) => (
                  <label key={choice} className="quiz-option text-sm">
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === idx}
                      onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                    />
                    {choice}
                  </label>
                ))}
                {submitted ? (
                  <p className="text-sm text-[var(--dedsec-blue)]">{q.explanation}</p>
                ) : null}
              </fieldset>
            ))}
            {!submitted ? (
              <button
                type="button"
                className="nexus-btn"
                onClick={submitQuiz}
                disabled={lesson.quiz.some((q) => answers[q.id] === undefined)}
              >
                Submit quiz
              </button>
            ) : (
              <p className="font-[family-name:var(--font-geist-mono)] text-[var(--dedsec-lime)]">
                score {score}/{lesson.quiz.length} · events recorded
              </p>
            )}
          </NexusPanel>
        </>
      )}

      {events.length ? (
        <NexusPanel className="p-4">
          <p className="mb-2 font-[family-name:var(--font-geist-mono)] text-xs font-semibold uppercase tracking-wider text-slate-300">
            Integration telemetry
          </p>
          <div className="terminal-feed">
            {events.map((line) => (
              <div key={line} className={line.startsWith("[OK]") ? "ok" : "err"}>
                {line}
              </div>
            ))}
          </div>
        </NexusPanel>
      ) : null}
    </div>
  );
}
