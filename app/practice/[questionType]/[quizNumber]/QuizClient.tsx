"use client";

import React, { useEffect, useRef, useState } from "react";

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

export default function QuizClient({ questions }: { questions: QuizQuestion[] }) {
  const total = questions.length;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);

  const passageRef = useRef<HTMLDivElement | null>(null);
  const q = questions[index];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    setSelected(null);
    setChecked(false);
  }, [index]);

  function applyHighlight() {
    if (!highlightMode) return;
    const root = passageRef.current;
    if (!root) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    if (range.collapsed) return;

    const common = range.commonAncestorContainer;
    const commonEl =
      common.nodeType === Node.ELEMENT_NODE ? (common as Element) : common.parentElement;
    if (!commonEl || !root.contains(commonEl)) return;

    const mark = document.createElement("mark");
    mark.style.backgroundColor = "#ffe58f";
    mark.style.color = "#000";

    try {
      range.surroundContents(mark);
      sel.removeAllRanges();
    } catch {
      sel.removeAllRanges();
    }
  }

  const topBarStyle: React.CSSProperties = {
    position: "fixed",
    top: APP_NAV_HEIGHT,
    left: 0,
    right: 0,
    height: TOP_BAR_HEIGHT,
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    zIndex: 50,
  };

  const contentStyle: React.CSSProperties = {
    position: "absolute",
    top: APP_NAV_HEIGHT + TOP_BAR_HEIGHT,
    bottom: BOTTOM_BAR_HEIGHT,
    left: 0,
    right: 0,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    overflow: "hidden",
    background: "#fff",
  };

  const paneStyle: React.CSSProperties = {
    height: "100%",
    overflowY: "auto",
    padding: 24,
    background: "#fff",
  };

  const bottomBarStyle: React.CSSProperties = {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    height: BOTTOM_BAR_HEIGHT,
    background: "#fff",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    zIndex: 50,
  };

  const topBtnStyle: React.CSSProperties = {
    height: 36,
    padding: "0 12px",
    borderRadius: 8,
    border: "1px solid #000",
    background: "#fff",
    color: "#000",
    fontWeight: 700,
    cursor: "pointer",
  };

  const toggleBtnStyle: React.CSSProperties = {
    ...topBtnStyle,
    background: highlightMode ? "#000" : "#fff",
    color: highlightMode ? "#fff" : "#000",
  };

  const navBtnStyle: React.CSSProperties = {
    height: 44,
    padding: "0 18px",
    borderRadius: 999,
    border: "2px solid #111",
    background: "#fff",
    color: "#000",
    fontWeight: 800,
    cursor: "pointer",
  };

  const primaryBtnStyle: React.CSSProperties = {
    ...navBtnStyle,
    background: "#2563eb",
    borderColor: "#2563eb",
    color: "#fff",
  };

  return (
    <div id="bluebook-quiz-root" style={{ height: "100vh", width: "100vw" }}>
      {/* ✅ NUCLEAR RESET: revert all global styles inside quiz */}
      <style>{`
        #bluebook-quiz-root {
          all: revert !important;
          position: relative !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
          background: #ffffff !important;
          color: #000000 !important;
          color-scheme: light !important;
          font-family: Arial, Helvetica, sans-serif !important;
          isolation: isolate !important;
        }

        #bluebook-quiz-root * {
          box-sizing: border-box !important;
          color: #000000 !important;
          background-color: #ffffff !important;
          opacity: 1 !important;
          filter: none !important;
          text-shadow: none !important;
          -webkit-text-fill-color: #000000 !important;
        }

        #bluebook-quiz-root mark {
          background: #ffe58f !important;
          color: #000 !important;
        }
      `}</style>

      {/* Top bar */}
      <div style={topBarStyle}>
        <div style={{ fontWeight: 900 }}>Targeted Practice</div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" style={toggleBtnStyle} onClick={() => setHighlightMode((v) => !v)}>
            Highlight
          </button>

          <button type="button" style={topBtnStyle} onClick={() => history.back()}>
            Save &amp; Exit
          </button>
        </div>
      </div>

      {/* Split panes */}
      <div style={contentStyle}>
        {/* Passage */}
        <div
          ref={passageRef}
          onMouseUp={applyHighlight}
          style={{
            ...paneStyle,
            borderRight: "1px solid #e5e7eb",
            fontSize: 18,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            cursor: highlightMode ? "text" : "default",
          }}
        >
          {q.passage}
        </div>

        {/* Question */}
        <div style={paneStyle}>
          <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 16 }}>{q.prompt}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {q.choices.map((c, i) => {
              const correct = checked && i === q.correctIndex;
              const wrong = checked && selected === i && i !== q.correctIndex;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelected(i)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: 16,
                    borderRadius: 14,
                    border: "2px solid #000",
                    background: correct ? "#ecfdf5" : wrong ? "#fef2f2" : "#fff",
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: 650,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: "2px solid #000",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      flex: "0 0 auto",
                      background: "#fff",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ flex: "1 1 auto" }}>{c}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={bottomBarStyle}>
        <div style={{ width: 200 }} />

        <div
          style={{
            background: "#111",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 999,
            fontWeight: 800,
          }}
        >
          Question {index + 1} of {total}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            style={navBtnStyle}
            onClick={() => {
              if (index === 0) return;
              setIndex(index - 1);
            }}
          >
            Back
          </button>

          <button
            type="button"
            style={{
              ...primaryBtnStyle,
              cursor: selected === null ? "not-allowed" : "pointer",
            }}
            onClick={() => {
              if (selected === null) return;
              setChecked(true);
            }}
          >
            Check
          </button>

          <button
            type="button"
            style={primaryBtnStyle}
            onClick={() => {
              if (index === total - 1) return;
              setIndex(index + 1);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
