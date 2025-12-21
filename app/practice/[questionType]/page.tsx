import Link from "next/link";

export default function QuestionTypePage({
  params,
}: {
  params: { questionType: string };
}) {
  const slug = params?.questionType ?? "";
const label = slug ? pretty(slug) : "Practice";


  const quizzes = Array.from({ length: 10 }).map((_, i) => {
    const quizNumber = i + 1;
    const difficulty = difficultyForQuiz(quizNumber);
    return { quizNumber, difficulty };
  });

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 6 }}>
        {label}
      </h1>
      <p style={{ color: "#475569", marginBottom: 16 }}>
        10 quizzes · 5 questions each · difficulty ramps up as you progress.
      </p>

      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 14,
          marginBottom: 18,
        }}
      >
        <div style={{ fontWeight: 900, color: "#0f172a", marginBottom: 6 }}>
          Difficulty Schedule
        </div>
        <div style={{ color: "#475569", fontSize: 14 }}>
          Quiz 1–2: 1/5 · Quiz 3–4: 2/5 · Quiz 5–6: 3/5 · Quiz 7–8: 4/5 · Quiz 9–10: 5/5
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {quizzes.map((q) => (
          <div
            key={q.quizNumber}
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 900, color: "#0f172a" }}>Quiz {q.quizNumber}</div>
              <span
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  border: "1px solid #bfdbfe",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 900,
                }}
              >
                {q.difficulty}/5
              </span>
            </div>

            <div style={{ marginTop: 10, color: "#64748b", fontSize: 13 }}>
              5 questions · timed · summary + analytics after completion
            </div>

            <Link
  href={`/practice/${params.questionType}/${q.quizNumber}`}
  style={{ textDecoration: "none" }}
>
  <button
    style={{
      marginTop: 12,
      width: "100%",
      padding: "10px 12px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: 10,
      fontWeight: 900,
      cursor: "pointer",
    }}
  >
    Start Quiz
  </button>
</Link>

          </div>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        <Link href="/practice" style={{ color: "#2563eb", fontWeight: 800, textDecoration: "none" }}>
          ← Back to Targeted Practice
        </Link>
      </div>
    </div>
  );
}

function difficultyForQuiz(n: number) {
  if (n <= 2) return 1;
  if (n <= 4) return 2;
  if (n <= 6) return 3;
  if (n <= 8) return 4;
  return 5;
}

function pretty(slug: string) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}
