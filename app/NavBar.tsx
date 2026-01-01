import Link from 'next/link';
import { CSSProperties } from 'react';

export default function NavBar() {
  return (
    <nav style={navStyle}>
      <Link href="/" style={logoStyle}>
        SAT Prep Hub
      </Link>
      <div style={linksContainerStyle}>
        <Link href="/" style={linkStyle}>
          Practice Tests
        </Link>
        <Link href="/practice" style={linkStyle}>
          Targeted Practice
        </Link>
        <Link href="/analytics" style={linkStyle}>
          Analytics
        </Link>
        <Link href="/recommendations" style={linkStyle}>
          What To Work On
        </Link>
      </div>
    </nav>
  );
}

const navStyle: CSSProperties = {
  padding: '1rem 2rem',
  borderBottom: '1px solid #e5e7eb',
  backgroundColor: '#ffffff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const logoStyle: CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: '#2563eb',
  textDecoration: 'none'
};

const linksContainerStyle: CSSProperties = {
  display: 'flex',
  gap: '2rem',
  alignItems: 'center'
};

const linkStyle: CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#111827',
  textDecoration: 'none'
};