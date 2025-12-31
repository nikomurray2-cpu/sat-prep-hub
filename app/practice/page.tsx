import Link from "next/link";

type QuestionType = {
  slug: string;
  label: string;
  description: string;
  section: "Reading & Writing" | "Math";
};

const QUESTION_TYPES: QuestionType[] = [
  // Reading & Writing (example set — adjust to your exact official categories)
  { slug: "boundaries", label: "Boundaries", description: "Punctuation, sentence boundaries, and clarity.", section: "Reading & Writing" },
  { slug: "form-structure-sense", label: "Form, Structure, and Sense", description: "Organization, transitions, and coherence.", section: "Reading & Writing" },
  { slug: "information-ideas", label: "Information and Ideas", description: "Main idea, inference, and evidence.", section: "Reading & Writing" },
  { slug: "craft-structure", label: "Craft and Structure", description: "Purpose, tone, and word choice.", section: "Reading & Writing" },

  // Math (example set — adjust to your exact official categories)
  { slug: "algebra", label: "Algebra", description: "Linear equations, systems, and functions.", section: "Math" },
  { slug: "advanced-math", label: "Advanced Math", description: "Quadratics, polynomials, and nonlinear functions.", section: "Math" },
  { slug: "problem-solving-data-analysis", label: "Problem-Solving and Data Analysis", description: "Ratios, rates, probability, and data.", section: "Math" },
  { slug: "geometry-trigonometry", label: "Geometry and Trigonometry", description: "Angles, circles, triangles, trig.", section: "Math" },
];

export default function PracticeLandingPage() {
  const rw = QUESTION_TYPES.filter((q) => q.section === "Reading & Writing");
  const math = QUESTION_TYPES.filter((q) => q.section === "Math");

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "#0f172a", margin: 0 }}>
          Targeted Practice
        </h1>
        <p style={{ color: "#475569", marginTop: 8, marginBottom: 0 }}>
          Choose a question type. Each type has 10 quizzes (5 questions each) with difficulty ramping from 1/5 → 5/5.
        </p>
      </div>

      <Section title="Reading & Writing" items={rw} />
      <div style={{ height: 18 }} />
      <Section title="Math" items={math} />
    </div>
  );
}

function Section({ title, items }: { title: string; items: QuestionType[] }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", margin: 0 }}>{title}</h2>
        <div style={{ color: "#64748b", fontSize: 13, fontWeight: 700 }}>{items.length} types</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {items.map((it) => (
          <Link
            key={it.slug}
            href={`/practice/${it.slug}`}
            style={{
              textDecoration: "none",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: 16,
              display: "block",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 900, color: "#0f172a", fontSize: 16 }}>{it.label}</div>
                <div style={{ color: "#64748b", marginTop: 6, fontSize: 13, lineHeight: 1.4 }}>
                  {it.description}
                </div>
              </div>

              <span
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  border: "1px solid #bfdbfe",
                  padding: "6px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 900,
                  height: "fit-content",
                  whiteSpace: "nowrap",
                }}
              >
                10 quizzes
              </span>
            </div>

            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: "#475569", fontSize: 12, fontWeight: 800 }}>
                Quiz 1–2: 1/5 · … · Quiz 9–10: 5/5
              </div>
              <div style={{ color: "#2563eb", fontWeight: 900, fontSize: 13 }}>Open →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
