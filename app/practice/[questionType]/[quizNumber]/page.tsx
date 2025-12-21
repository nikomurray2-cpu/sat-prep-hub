import QuizClient from "./QuizClient";

export default function Page({
  params,
}: {
  params: { questionType: string; quizNumber: string };
}) {
  const questionType = params.questionType;
  const quizNumber = clampInt(params.quizNumber, 1, 10, 1);

  return <QuizClient questionType={questionType} quizNumber={quizNumber} />;
}

function clampInt(value: string, min: number, max: number, fallback: number) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}
