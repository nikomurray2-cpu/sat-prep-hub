// components/NavBar.tsx (or wherever your NavBar is located)
import Link from 'next/link';

export default function NavBar() {
  return (
    <nav style={{ 
      padding: '1rem 2rem', 
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#ffffff'
    }}>
      <Link 
        href="/"
        style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#111827',
          textDecoration: 'none',
          cursor: 'pointer'
        }}
      >
        Practice Tests
      </Link>
    </nav>
  );
};