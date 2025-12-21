import Link from "next/link";

const RW_TYPES = [
  "Boundaries",
  "Form, Structure, and Sense",
  "Transitions",
  "Rhetorical Synthesis",
  "Words in Context",
  "Text Structure and Purpose",
  "Cross-Text Connections",
  "Command of Evidence",
  "Inferences",
  "Central Ideas and Details",
];

const MATH_TYPES = [
  "Linear equations in one variable",
  "Linear functions",
  "Linear equations in two variables",
  "Systems of two linear equations in two variables",
  "Linear inequalities in one or two variables",
  "Equivalent expressions",
  "Nonlinear equations in one variable and systems of equations in two variables",
  "Nonlinear functions",
  "Ratios, rates, proportional relationships, and units",
  "Percentages",
  "One-variable data: Distributions and measures of center and spread",
  "Two-variable data: Models and scatterplots",
  "Probability and conditional probability",
  "Inference from sample statistics and margin of error",
  "Evaluating statistical claims: Observational studies and experiments",
  "Area and volume",
  "Lines, angles, and triangles",
  "Right triangles and trigonometry",
  "Circles",
];

export default function PracticeLandingPage() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
        Targeted Practice
      </h1>
      <p style={{ color: "#475569", marginBottom: 24 }}>
        Choose a question type. Each type has 10 quizzes (5 questions each). Difficulty increases:
        1–2 = 1/5, 3–4 = 2/5, 5–6 = 3/5, 7–8 = 4/5, 9–10 = 5/5.
      </p>

      <Section title="Reading & Writing" items={RW_TYPES} />
      <div style={{ height: 28 }} />
      <Section title="Math" items={MATH_TYPES} />
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 14 }}>
        {title}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {items.map((t) => {
          const slug = slugify(t);
          return (
            <div
              key={t}
              style={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{t}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                10 quizzes · 5 questions each
              </div>

              <Link href={`/practice/${slug}`} style={{ textDecoration: "none" }}>
                <button
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  View Quizzes
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
