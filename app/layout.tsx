import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "SAT Prep Hub",
  description: "Elite SAT preparation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Inter, Arial, sans-serif",
          backgroundColor: "#f1f5f9",
        }}
      >
        {/* Top Navigation */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 40px", // ↓ reduced
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "white",
          }}
        >
          {/* Left: Branding + Tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px", // ↓ reduced
            }}
          >
            {/* Branding */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "18px", // ↓ reduced
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  width: "36px", // ↓ reduced
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "7px",
                  fontSize: "14px",
                }}
              >
                SAT
              </span>
              <span style={{ color: "#0f172a" }}>Prep Hub</span>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "32px", // ↓ reduced
              }}
            >
              <span style={activeTab}>Practice Tests</span>

              <Link href="/practice" style={navLinkStyle}>
                Targeted Practice
              </Link>

              <Link href="/analytics" style={navLinkStyle}>
                Analytics
              </Link>

              <Link href="/recommendations" style={navLinkStyle}>
                What To Work On
              </Link>
            </div>
          </div>

          {/* Right: Auth */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={loginButton}>Log in</button>
            <button style={signupButton}>Sign up</button>
          </div>
        </nav>

        {/* Page Content */}
        <main
          style={{
            padding: "28px 40px", // ↓ reduced
            minHeight: "100vh",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}

const navLinkStyle = {
  textDecoration: "none",
  color: "#0f172a",
  fontWeight: 600,
  fontSize: "14px", // ↓ reduced
  whiteSpace: "nowrap",
};

const activeTab = {
  backgroundColor: "#2563eb",
  color: "white",
  padding: "6px 14px", // ↓ reduced
  borderRadius: "7px",
  fontWeight: 700,
  fontSize: "14px",
  whiteSpace: "nowrap",
};

const loginButton = {
  background: "transparent",
  border: "1px solid #2563eb",
  color: "#2563eb",
  padding: "6px 14px", // ↓ reduced
  borderRadius: "6px",
  fontWeight: 500,
  fontSize: "13px",
  cursor: "pointer",
};

const signupButton = {
  background: "#2563eb",
  border: "none",
  color: "white",
  padding: "6px 14px",
  borderRadius: "6px",
  fontWeight: 600,
  fontSize: "13px",
  cursor: "pointer",
};
