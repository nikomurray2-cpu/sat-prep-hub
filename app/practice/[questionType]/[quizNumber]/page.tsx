import QuizClient, { QuizQuestion } from "./QuizClient";

export default function Page({
  params,
}: {
  params: { questionType?: string; quizNumber?: string };
}) {
  const questionTypeSlug = params?.questionType ?? "boundaries";
  const quizNumber = Math.min(10, Math.max(1, parseInt(params?.quizNumber ?? "1", 10)));

  const questionTypeLabel = pretty(questionTypeSlug);

  // IMPORTANT: must always be exactly 5 questions for the targeted quizzes
  const questions: QuizQuestion[] = getPlaceholderQuestions(questionTypeSlug, quizNumber);

  return (
    <QuizClient
      questionTypeLabel={questionTypeLabel}
      quizNumber={quizNumber}
      questions={questions}
    />
  );
}

function pretty(slug?: string) {
  if (!slug) return "Practice";
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function getPlaceholderQuestions(questionType: string, quizNumber: number): QuizQuestion[] {
  return [
    {
      id: `${questionType}-${quizNumber}-1`,
      passage:
        "According to a team of neuroeconomists, ease of decision making may be linked to communication between brain regions. Individuals tend to be more decisive when the information flow between the regions is intensified, whereas they make choices more slowly when information flow is _____.",
      prompt: "Which choice completes the text with the most logical and precise word or phrase?",
      choices: ["reduced", "evaluated", "determined", "acquired"],
      correctIndex: 0,
    },
    {
      id: `${questionType}-${quizNumber}-2`,
      passage:
        "In a study of sleep habits, researchers found that students who kept a consistent bedtime reported better focus during morning classes.",
      prompt: "Which choice best states the central idea of the text?",
      choices: [
        "Consistent sleep schedules are linked to better focus.",
        "Morning classes are harder than afternoon classes.",
        "Most students sleep too little.",
        "Focus depends only on diet.",
      ],
      correctIndex: 0,
    },
    {
      id: `${questionType}-${quizNumber}-3`,
      passage:
        "A museum displayed a newly restored painting. Visitors noted that colors once thought dull now appeared vivid.",
      prompt: "Which choice is most strongly supported by the text?",
      choices: [
        "The painting was created recently.",
        "Restoration can reveal original visual details.",
        "Visitors prefer modern art.",
        "The museum removed old paintings.",
      ],
      correctIndex: 1,
    },
    {
      id: `${questionType}-${quizNumber}-4`,
      passage:
        "The author introduces a claim, provides a counterexample, and then refines the claim to account for the new evidence.",
      prompt: "What is the main purpose of this structure?",
      choices: [
        "To confuse the reader",
        "To provide entertainment",
        "To strengthen an argument by revising it",
        "To list unrelated observations",
      ],
      correctIndex: 2,
    },
    {
      id: `${questionType}-${quizNumber}-5`,
      passage:
        "The town expanded its bus routes; _____, more residents began commuting without cars.",
      prompt: "Which transition best fits the context?",
      choices: ["however", "as a result", "for example", "in contrast"],
      correctIndex: 1,
    },
  ];
}
