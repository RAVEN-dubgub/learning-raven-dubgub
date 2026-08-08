export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
};

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  objectives: string[];
  content: string[];
  quiz: QuizQuestion[];
};

export const lessons: Lesson[] = [
  {
    id: "intro-git",
    slug: "why-git-exists",
    title: "Why Git exists",
    summary: "Snapshots, history, and why agents still need version control.",
    minutes: 8,
    objectives: [
      "Explain commits as snapshots",
      "Describe why branches matter for experiments",
      "Connect Git history to safe agent edits",
    ],
    content: [
      "Git tracks snapshots of your project over time. Each snapshot is a commit with a message describing what changed.",
      "When an AI agent edits files, Git lets you review diffs, roll back mistakes, and prove what shipped in a PR.",
      "Think of Git as an undo stack that also powers collaboration: everyone shares the same timeline of changes.",
    ],
    quiz: [
      {
        id: "q1",
        prompt: "What is a Git commit?",
        choices: [
          "A live deploy to production",
          "A named snapshot of project files",
          "A GitHub issue comment",
          "A npm package version",
        ],
        answerIndex: 1,
        explanation: "A commit records a snapshot of tracked files at a point in time.",
      },
      {
        id: "q2",
        prompt: "Why is Git useful with AI coding agents?",
        choices: [
          "It removes the need for code review",
          "It guarantees zero bugs",
          "It preserves history and enables rollback/review",
          "It replaces documentation",
        ],
        answerIndex: 2,
        explanation: "Agents can move fast; Git keeps humans in control via diffs and revert paths.",
      },
    ],
  },
  {
    id: "commits-branches",
    slug: "commits-and-branches",
    title: "Commits & branches",
    summary: "Stage, commit, and branch without fear.",
    minutes: 10,
    objectives: [
      "Use git status and git diff",
      "Create a feature branch",
      "Write meaningful commit messages",
    ],
    content: [
      "`git status` shows what changed. `git add` stages files; `git commit` saves the snapshot.",
      "Branches let you experiment in isolation. `git switch -c feature/x` creates a safe workspace.",
      "Good commit messages explain intent: what changed and why — agents can draft them, you approve.",
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Which command creates a new branch and switches to it?",
        choices: ["git merge", "git switch -c", "git remote add", "git log --oneline"],
        answerIndex: 1,
        explanation: "`git switch -c <name>` creates and checks out a branch.",
      },
    ],
  },
  {
    id: "remotes",
    slug: "remotes-and-push",
    title: "Remotes & push",
    summary: "Connect local work to GitHub.",
    minutes: 10,
    objectives: [
      "Define origin remote",
      "Push a branch to GitHub",
      "Understand upstream tracking",
    ],
    content: [
      "A remote is a shared copy of your repo — usually `origin` on GitHub.",
      "`git push -u origin my-branch` publishes commits and sets upstream tracking.",
      "Never push secrets; use `.env.local` and `.gitignore` — agents should be reminded in prompts.",
    ],
    quiz: [
      {
        id: "q1",
        prompt: "What does `git push -u origin feature` do?",
        choices: [
          "Deletes the branch locally",
          "Publishes commits and sets upstream",
          "Creates a pull request automatically",
          "Runs CI tests",
        ],
        answerIndex: 1,
        explanation: "Push sends commits; `-u` records upstream for future pulls/pushes.",
      },
    ],
  },
  {
    id: "pull-requests",
    slug: "pull-requests",
    title: "Pull requests",
    summary: "Ship work through reviewable PRs.",
    minutes: 12,
    objectives: [
      "Open a PR with summary and test plan",
      "Link production URL in PR body",
      "Respond to review feedback",
    ],
    content: [
      "Pull requests are the cohort submission unit: branch → PR → review → merge.",
      "Include production URL, integration notes, and a test plan checklist.",
      "Keep PRs focused; agents can help draft bodies — you verify facts before merge.",
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Hult cohort submissions are delivered as…",
        choices: ["Email attachments", "Merged GitHub pull requests", "Discord messages", "PDF uploads"],
        answerIndex: 1,
        explanation: "Submissions are proof-of-work PRs merged to the cohort repo.",
      },
    ],
  },
  {
    id: "agent-workflow",
    slug: "agent-first-workflow",
    title: "Agent-first workflow",
    summary: "Prompt, verify, commit, PR — the loop.",
    minutes: 12,
    objectives: [
      "Run smoke tests before merge",
      "Document agent usage in submissions",
      "Integrate learning events with Ludwitt API",
    ],
    content: [
      "Agent-first does not mean agent-only: you own verification, deploy URLs, and secrets hygiene.",
      "Learning apps must fire Ludwitt events (`lesson_started`, `lesson_completed`, `quiz_submitted`).",
      "This app integrates PitchRise Firebase auth plus the cohort reference API when the developer portal is blocked.",
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Which Ludwitt event fires when a learner finishes a lesson?",
        choices: ["session_heartbeat", "lesson_completed", "deploy_started", "oauth_refresh"],
        answerIndex: 1,
        explanation: "`lesson_completed` marks successful lesson completion for metrics.",
      },
    ],
  },
];

export function getLesson(slug: string) {
  return lessons.find((l) => l.slug === slug);
}
