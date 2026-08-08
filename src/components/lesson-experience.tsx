"use client";

import { useMemo, useState } from "react";
import type { Lesson } from "@/lib/lessons";
import { getIdToken } from "@/lib/firebase-client";

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
    const data = await res.json();
    setEvents((prev) => [...prev, `${event} → ${res.status}`]);
    return data;
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
      <div className="holo-panel p-6">
        <p className="holo-muted text-sm">{lesson.minutes} min · {lesson.summary}</p>
        <h1 className="mt-2 text-3xl font-semibold">{lesson.title}</h1>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-slate-300">
          {lesson.objectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>

      {!started ? (
        <button type="button" className="holo-btn" onClick={startLesson}>
          Start lesson
        </button>
      ) : (
        <>
          <div className="holo-panel space-y-4 p-6">
            {lesson.content.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-slate-200">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="holo-panel space-y-4 p-6">
            <h2 className="text-xl font-semibold">Quick check</h2>
            {lesson.quiz.map((q) => (
              <fieldset key={q.id} className="space-y-2">
                <legend className="font-medium">{q.prompt}</legend>
                {q.choices.map((choice, idx) => (
                  <label key={choice} className="flex items-center gap-2 text-sm">
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
                  <p className="text-sm text-cyan-200/90">{q.explanation}</p>
                ) : null}
              </fieldset>
            ))}
            {!submitted ? (
              <button
                type="button"
                className="holo-btn"
                onClick={submitQuiz}
                disabled={lesson.quiz.some((q) => answers[q.id] === undefined)}
              >
                Submit quiz
              </button>
            ) : (
              <p className="text-cyan-200">
                Score {score}/{lesson.quiz.length} · events recorded
              </p>
            )}
          </div>
        </>
      )}

      {events.length ? (
        <div className="holo-panel p-4 text-xs text-slate-400">
          <p className="mb-2 font-semibold text-slate-300">Integration log</p>
          {events.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
