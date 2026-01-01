'use client';

import { useEffect, useState, CSSProperties } from 'react';
import Link from 'next/link';

interface QuizAttempt {
  id: string;
  date: string;
  section: 'reading-writing' | 'math';
  questionType: string;
  quizNumber: number;
  score: number;
  totalQuestions: number;
}

export default function AnalyticsPage() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('quiz-attempts');
    if (stored) {
      try {
        setAttempts(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse attempts:', e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Analytics</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>Loading...</p>
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Analytics</h1>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#111827' }}>
            No data yet
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '1rem' }}>
            Complete some targeted practice quizzes to see your analytics.
          </p>
          <Link href="/practice" style={buttonStyle}>
            Start Practicing
          </Link>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalAttempts = attempts.length;
  const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
  const averageScore = totalScore / totalAttempts;
  const proficientCount = attempts.filter(a => a.score >= 4).length;
  const proficiencyRate = (proficientCount / totalAttempts) * 100;

  // By section
  const rwAttempts = attempts.filter(a => a.section === 'reading-writing');
  const mathAttempts = attempts.filter(a => a.section === 'math');
  
  const rwAvg = rwAttempts.length > 0 
    ? rwAttempts.reduce((sum, a) => sum + a.score, 0) / rwAttempts.length 
    : 0;
  const mathAvg = mathAttempts.length > 0 
    ? mathAttempts.reduce((sum, a) => sum + a.score, 0) / mathAttempts.length 
    : 0;

  // Recent activity
  const recent = [...attempts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Analytics</h1>
        <Link href="/recommendations" style={buttonStyle}>
          What to Work On →
        </Link>
      </div>

      <div style={contentStyle}>
        {/* Overall Stats */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Overall Performance</h2>
          <div style={gridStyle}>
            <div style={cardStyle}>
              <div style={labelStyle}>Total Quizzes</div>
              <div style={valueStyle}>{totalAttempts}</div>
            </div>
            <div style={cardStyle}>
              <div style={labelStyle}>Average Score</div>
              <div style={valueStyle}>
                {averageScore.toFixed(1)}
                <span style={{ fontSize: '1.5rem', color: '#6b7280' }}>/5</span>
              </div>
            </div>
            <div style={cardStyle}>
              <div style={labelStyle}>Proficiency Rate</div>
              <div style={valueStyle}>
                {proficiencyRate.toFixed(0)}
                <span style={{ fontSize: '1.5rem', color: '#6b7280' }}>%</span>
              </div>
              <div style={subtextStyle}>
                {proficientCount} of {totalAttempts} proficient (4+/5)
              </div>
            </div>
          </div>
        </section>

        {/* By Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>By Section</h2>
          <div style={gridStyle}>
            <div style={cardStyle}>
              <div style={labelStyle}>Reading & Writing</div>
              <div style={valueStyle}>
                {rwAvg.toFixed(1)}
                <span style={{ fontSize: '1.5rem', color: '#6b7280' }}>/5</span>
              </div>
              <div style={subtextStyle}>{rwAttempts.length} attempts</div>
            </div>
            <div style={cardStyle}>
              <div style={labelStyle}>Math</div>
              <div style={valueStyle}>
                {mathAvg.toFixed(1)}
                <span style={{ fontSize: '1.5rem', color: '#6b7280' }}>/5</span>
              </div>
              <div style={subtextStyle}>{mathAttempts.length} attempts</div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Recent Activity</h2>
          <div style={listStyle}>
            {recent.map(attempt => (
              <div key={attempt.id} style={listItemStyle}>
                <div style={{ flex: 1 }}>
                  <div style={itemTitleStyle}>
                    {attempt.questionType.replace(/-/g, ' ')} - Quiz {attempt.quizNumber}
                  </div>
                  <div style={itemMetaStyle}>
                    {new Date(attempt.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div style={{
                  ...scoreStyle,
                  backgroundColor: attempt.score >= 4 ? '#dcfce7' : '#fee2e2',
                  color: attempt.score >= 4 ? '#166534' : '#991b1b'
                }}>
                  {attempt.score}/5
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// Styles
const containerStyle: CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f9fafb'
};

const headerStyle: CSSProperties = {
  padding: '2rem',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const titleStyle: CSSProperties = {
  fontSize: '2rem',
  fontWeight: 700,
  color: '#111827',
  margin: 0
};

const buttonStyle: CSSProperties = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  textDecoration: 'none',
  borderRadius: '6px',
  fontWeight: 600,
  fontSize: '0.875rem',
  display: 'inline-block'
};

const contentStyle: CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem'
};

const sectionStyle: CSSProperties = {
  marginBottom: '3rem'
};

const sectionTitleStyle: CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#111827',
  marginBottom: '1rem'
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1rem'
};

const cardStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '1.5rem'
};

const labelStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: '#6b7280',
  marginBottom: '0.5rem',
  fontWeight: 500
};

const valueStyle: CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 700,
  color: '#111827',
  lineHeight: 1.2
};

const subtextStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: '#6b7280',
  marginTop: '0.5rem'
};

const listStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  overflow: 'hidden'
};

const listItemStyle: CSSProperties = {
  padding: '1rem 1.5rem',
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const itemTitleStyle: CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#111827',
  textTransform: 'capitalize',
  marginBottom: '0.25rem'
};

const itemMetaStyle: CSSProperties = {
  fontSize: '0.75rem',
  color: '#6b7280'
};

const scoreStyle: CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  fontWeight: 700,
  fontSize: '0.875rem'
};

const emptyStateStyle: CSSProperties = {
  textAlign: 'center',
  padding: '4rem 2rem'
};