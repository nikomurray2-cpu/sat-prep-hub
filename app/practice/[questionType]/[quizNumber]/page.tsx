import QuizClient from "./QuizClient";

export default function Page({
  params,
}: {
  params: { questionType?: string; quizNumber?: string };
}) {
  const questionTypeSlug = params?.questionType ?? "boundaries";
  const quizNumber = clampInt(params?.quizNumber, 1, 10, 1);

  const questions = getPlaceholderQuestions(questionTypeSlug, quizNumber);

  return <QuizClient questions={questions} />;
}

function clampInt(
  value: string | undefined,
  min: number,
  max: number,
  fallback: number
) {
  const n = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function getPlaceholderQuestions(questionType: string, quizNumber: number) {
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
