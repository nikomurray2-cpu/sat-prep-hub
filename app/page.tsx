export default function HomePage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Login Required Banner (FULL WIDTH, LEFT ALIGNED) */}
      <div
        style={{
              display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "10px",
    padding: "14px 18px", // ↓ reduced
    marginBottom: "28px",
  }}
>
  <span style={{ fontSize: "20px" }}>👤</span>
  <div>
    <div
      style={{
        fontWeight: 600,
        color: "#1e40af",
        marginBottom: "2px",
        fontSize: "14px", // ↓ reduced
      }}
    >
      Login Required
    </div>
    <div style={{ color: "#334155", fontSize: "14px" }}>
            Please log in to take practice tests and track your progress.
          </div>
        </div>
      </div>

      {/* Centered Title */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "6px",
          }}
        >
          SAT Practice Tests
        </h1>

        <p
          style={{
            fontSize: "17px",
            color: "#475569",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          Full-length practice tests to prepare for the SAT with post-test
          analytics and a personalized plan to improve.
        </p>
      </div>

      {/* Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        <span style={{ fontSize: "18px", color: "#2563eb" }}>➜</span>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#0f172a",
          }}
        >
          Available Practice Tests
        </h2>
      </div>

      {/* Practice Tests Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "32px",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              background: "white",
              borderRadius: "14px",
              padding: "28px",
              border: "1px solid #e5e7eb",
            }}
          >
            {/* Available Badge */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                backgroundColor: "#e0f2fe",
                color: "#2563eb",
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: "999px",
              }}
            >
              Available
            </div>

            <h3
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#0f172a",
                marginBottom: "12px",
              }}
            >
              Practice Test {i + 1}
            </h3>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "15px",
                color: "#64748b",
                marginBottom: "20px",
              }}
            >
              <span>🕒</span>
              <span>2 h 14 m · 98 questions</span>
            </div>

            <button
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Log in to start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
