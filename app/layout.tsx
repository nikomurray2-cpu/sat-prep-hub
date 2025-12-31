import "./globals.css";
import NavBar from "./NavBar";

const NAV_HEIGHT = 64;

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
        <NavBar />

        <main
          style={{
            padding: "28px 40px",
            paddingTop: 28 + NAV_HEIGHT, // ✅ push content below fixed nav
            minHeight: "100vh",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
