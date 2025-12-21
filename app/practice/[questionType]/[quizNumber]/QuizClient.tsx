"use client";

import React, { useEffect, useState } from "react";

export type QuizQuestion = {
  id: string;
  passage: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
};

const APP_NAV_HEIGHT = 64;
const TOP_BAR_HEIGHT = 64;
const BOTTOM_BAR_HEIGHT = 76;

export default function QuizClient({
  questions,
}: {
  questions: QuizQuestion[];
}) {
  const total = questions.length;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const q = questions[index];

  // Lock page scroll (Bluebook behavior)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  return (
    <div style={styles.page}>
      {/* TOP BAR */}
      <div style={styles.topBar}>
        <div>
          <div style={styles.title}>Targeted Practice</div>
          <div style={styles.directions}>Directions ▾</div>
        </div>
        <div style={styles.topActions}>
          <span style={styles.action}>Highlight</span>
          <span style={styles.action}>Save & Exit</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>
        <div style={styles.leftPane}>
          <p style={styles.passage}>{q.passage}</p>
        </div>

        <div style={styles.divider} />

        <div style={styles.rightPane}>
          <div style={styles.questionHeader}>
            <div style={styles.qNumber}>{index + 1}</div>
            <span style={styles.mark}>Mark for Review</span>
            <span style={styles.report}>Report</span>
          </div>

          <h2 style={styles.prompt}>{q.prompt}</h2>

          {q.choices.map((choice, i) => {
            const isSelected = selected === i;
            const isCorrect = checked && i === q.correctIndex;
            const isWrong = checked && isSelected && i !== q.correctIndex;

            return (
              <div
                key={i}
                style={{
                  ...styles.choice,
                  borderColor: isCorrect
                    ? "#16a34a"
                    : isWrong
                    ? "#dc2626"
                    : "#111",
                  background: isSelected ? "#f5f5f5" : "#fff",
                }}
                onClick={() => {
                  if (!checked) setSelected(i);
                }}
              >
                <div style={styles.choiceLeft}>
                  <div style={styles.letter}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span>{choice}</span>
                </div>
                <div style={styles.cross}>✕</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div style={styles.bottomBar}>
        <span style={styles.name}>Niko Murray</span>

        <div style={styles.progress}>
          Question {index + 1} of {total}
        </div>

        <div style={styles.buttons}>
          <button
            style={styles.secondary}
            disabled={index === 0}
            onClick={() => {
              setIndex((i) => i - 1);
              setSelected(null);
              setChecked(false);
            }}
          >
            Back
          </button>

          <button
            style={styles.primary}
            disabled={selected === null}
            onClick={() => setChecked(true)}
          >
            Check
          </button>

          <button
            style={styles.primary}
            onClick={() => {
              if (index < total - 1) {
                setIndex((i) => i + 1);
                setSelected(null);
                setChecked(false);
              }
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {
  page: {
    height: "100vh",
    background: "#fff",
  },

  topBar: {
    position: "fixed",
    top: APP_NAV_HEIGHT,
    left: 0,
    right: 0,
    height: TOP_BAR_HEIGHT,
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    background: "#fff",
    zIndex: 50,
  },

  title: {
    fontWeight: 800,
    fontSize: 18,
  },

  directions: {
    fontWeight: 700,
    cursor: "pointer",
  },

  topActions: {
    display: "flex",
    gap: 20,
    fontWeight: 700,
  },

  action: {
    cursor: "pointer",
  },

  main: {
    position: "absolute",
    top: APP_NAV_HEIGHT + TOP_BAR_HEIGHT,
    bottom: BOTTOM_BAR_HEIGHT,
    left: 0,
    right: 0,
    display: "grid",
    gridTemplateColumns: "1fr 12px 1fr",
    overflow: "hidden",
  },

  leftPane: {
    padding: 24,
    overflowY: "auto",
  },

  rightPane: {
    padding: 24,
    overflowY: "auto",
  },

  divider: {
    background: "#f3f4f6",
    borderLeft: "1px solid #e5e7eb",
    borderRight: "1px solid #e5e7eb",
  },

  passage: {
    fontSize: 18,
    lineHeight: 1.7,
    color: "#111",
  },

  questionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    borderBottom: "2px dashed #111",
    paddingBottom: 10,
    marginBottom: 14,
    fontWeight: 700,
  },

  qNumber: {
    width: 34,
    height: 34,
    background: "#111",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },

  mark: {
    cursor: "pointer",
  },

  report: {
    marginLeft: "auto",
    cursor: "pointer",
  },

  prompt: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 16,
  },

  choice: {
    border: "2px solid #111",
    borderRadius: 10,
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    cursor: "pointer",
  },

  choiceLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  letter: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "2px solid #111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
  },

  cross: {
    fontWeight: 800,
  },

  bottomBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_BAR_HEIGHT,
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    background: "#fff",
    zIndex: 50,
  },

  name: {
    fontWeight: 700,
  },

  progress: {
    background: "#111",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 12,
    fontWeight: 800,
  },

  buttons: {
    display: "flex",
    gap: 12,
  },

  primary: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: 999,
    fontWeight: 800,
    cursor: "pointer",
  },

  secondary: {
    background: "#fff",
    color: "#111",
    border: "2px solid #111",
    padding: "12px 20px",
    borderRadius: 999,
    fontWeight: 800,
    cursor: "pointer",
  },
};
