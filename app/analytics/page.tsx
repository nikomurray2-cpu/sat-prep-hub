// app/analytics/page.tsx
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

interface QuestionTypeStats {
  questionType: string;
  section: 'reading-writing' | 'math';
  attempts: number;
  totalScore: number;
  averageScore: number;
  proficientCount: number;
  proficiencyRate: number;
}

export default function AnalyticsPage() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load attempts from localStorage
    const stored = localStorage.getItem('quiz-attempts');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAttempts(parsed);
      } catch (e) {
        console.error('Failed to parse quiz attempts:', e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Analytics</h1>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Analytics</h1>
        </div>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#111827' }}>
            No data yet
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Complete some targeted practice quizzes to see your analytics.
          </p>
          <Link href="/practice" style={linkButtonStyle}>
            Start Practicing
          </Link>
        </div>
      </div>
    );
  }

  // Calculate overall stats
  const totalAttempts = attempts.length;
  const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
  const averageScore = totalScore / totalAttempts;
  const proficientAttempts = attempts.filter(a => a.score >= 4).length;
  const proficiencyRate = (proficientAttempts / totalAttempts) * 100;

  // Calculate stats by section
  const readingWritingAttempts = attempts.filter(a => a.section === 'reading-writing');
  const mathAttempts = attempts.filter(a => a.section === 'math');

  const rwAverage = readingWritingAttempts.length > 0
    ? readingWritingAttempts.reduce((sum, a) => sum + a.score, 0) / readingWritingAttempts.length
    : 0;
  const mathAverage = mathAttempts.length > 0
    ? mathAttempts.reduce((sum, a) => sum + a.score, 0) / mathAttempts.length
    : 0;

  const rwProficient = readingWritingAttempts.filter(a => a.score >= 4).length;
  const mathProficient = mathAttempts.filter(a => a.score >= 4).length;

  const rwProficiencyRate = readingWritingAttempts.length > 0
    ? (rwProficient / readingWritingAttempts.length) * 100
    : 0;
  const mathProficiencyRate = mathAttempts.length > 0
    ? (mathProficient / mathAttempts.length) * 100
    : 0;

  // Calculate stats by question type
  const typeStatsMap = new Map<string, QuestionTypeStats>();
  attempts.forEach(attempt => {
    const key = attempt.questionType;
    if (!typeStatsMap.has(key)) {
      typeStatsMap.set(key, {
        questionType: attempt.questionType,
        section: attempt.section,
        attempts: 0,
        totalScore: 0,
        averageScore: 0,
        proficientCount: 0,
        proficiencyRate: 0
      });
    }
    const stats = typeStatsMap.get(key)!;
    stats.attempts++;
    stats.totalScore += attempt.score;
    if (attempt.score >= 4) stats.proficientCount++;
  });

  const typeStats = Array.from(typeStatsMap.values()).map(stats => ({
    ...stats,
    averageScore: stats.totalScore / stats.attempts,
    proficiencyRate: (stats.proficientCount / stats.attempts) * 100
  })).sort((a, b) => b.averageScore - a.averageScore);

  // Recent activity (last 10)
  const recentAttempts = [...attempts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Analytics</h1>
        <Link href="/recommendations" style={secondaryButtonStyle}>
          What to Work On →
        </Link>
      </div>

      <div style={contentStyle}>
        {/* Overall Performance */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Overall Performance</h2>
          <div style={cardGridStyle}>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Total Quizzes</div>
              <div style={statValueStyle}>{totalAttempts}</div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Average Score</div>
              <div style={statValueStyle}>
                {averageScore.toFixed(1)}<span style={{ fontSize: '1.5rem', color: '#6b7280' }}>/5</span>
              </div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Proficiency Rate</div>
              <div style={statValueStyle}>
                {proficiencyRate.toFixed(0)}<span style={{ fontSize: '1.5rem', color: '#6b7280' }}>%</span>
              </div>
              <div style={statSubtextStyle}>{proficientAttempts} of {totalAttempts} proficient (4+/5)</div>
            </div>
          </div>
        </section>

        {/* Section Breakdown */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>By Section</h2>
          <div style={cardGridStyle}>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Reading & Writing</div>
              <div style={statValueStyle}>
                {rwAverage.toFixed(1)}<span style={{ fontSize: '1.5rem', color: '#6b7280' }}>/5</span>
              </div>
              <div style={statSubtextStyle}>
                {readingWritingAttempts.length} attempts · {rwProficiencyRate.toFixed(0)}% proficient
              </div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Math</div>
              <div style={statValueStyle}>
                {mathAverage.toFixed(1)}<span style={{ fontSize: '1.5rem', color: '#6b7280' }}>/5</span>
              </div>
              <div style={statSubtextStyle}>
                {mathAttempts.length} attempts · {mathProficiencyRate.toFixed(0)}% proficient
              </div>
            </div>
          </div>
        </section>

        {/* Question Type Performance */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>By Question Type</h2>
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRowStyle}>
                  <th style={tableHeaderCellStyle}>Question Type</th>
                  <th style={tableHeaderCellStyle}>Section</th>
                  <th style={tableHeaderCellStyle}>Attempts</th>
                  <th style={tableHeaderCellStyle}>Avg Score</th>
                  <th style={tableHeaderCellStyle}>Proficiency</th>
                  <th style={tableHeaderCellStyle}></th>
                </tr>
              </thead>
              <tbody>
                {typeStats.map(stat => (
                  <tr key={stat.questionType} style={tableRowStyle}>
                    <td style={tableCellStyle}>
                      <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>
                        {stat.questionType.replace(/-/g, ' ')}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{ textTransform: 'capitalize' }}>
                        {stat.section === 'reading-writing' ? 'R&W' : 'Math'}
                      </span>
                    </td>
                    <td style={tableCellStyle}>{stat.attempts}</td>
                    <td style={tableCellStyle}>
                      <span style={{ fontWeight: 600 }}>{stat.averageScore.toFixed(1)}</span>/5
                    </td>
                    <td style={tableCellStyle}>{stat.proficiencyRate.toFixed(0)}%</td>
                    <td style={tableCellStyle}>
                      <Link
                        href={`/practice/${stat.questionType}`}
                        style={tableLinkStyle}
                      >
                        Practice →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Activity */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Recent Activity</h2>
          <div style={activityListStyle}>
            {recentAttempts.map(attempt => (
              <div key={attempt.id} style={activityItemStyle}>
                <div style={{ flex: 1 }}>
                  <div style={activityTitleStyle}>
                    {attempt.questionType.replace(/-/g, ' ')} - Quiz {attempt.quizNumber}
                  </div>
                  <div style={activityMetaStyle}>
                    {new Date(attempt.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                    {' · '}
                    {attempt.section === 'reading-writing' ? 'Reading & Writing' : 'Math'}
                  </div>
                </div>
                <div style={{
                  ...activityScoreStyle,
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
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  padding: '2rem',
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

const secondaryButtonStyle: CSSProperties = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  textDecoration: 'none',
  borderRadius: '6px',
  fontWeight: 600,
  fontSize: '0.875rem'
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

const cardGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1rem'
};

const statCardStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '1.5rem'
};

const statLabelStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: '#6b7280',
  marginBottom: '0.5rem',
  fontWeight: 500
};

const statValueStyle: CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 700,
  color: '#111827',
  lineHeight: 1.2
};

const statSubtextStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: '#6b7280',
  marginTop: '0.5rem'
};

const tableContainerStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  overflow: 'hidden'
};

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse'
};

const tableHeaderRowStyle: CSSProperties = {
  backgroundColor: '#f9fafb',
  borderBottom: '1px solid #e5e7eb'
};

const tableHeaderCellStyle: CSSProperties = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const tableRowStyle: CSSProperties = {
  borderBottom: '1px solid #e5e7eb'
};

const tableCellStyle: CSSProperties = {
  padding: '1rem',
  fontSize: '0.875rem',
  color: '#111827'
};

const tableLinkStyle: CSSProperties = {
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '0.875rem'
};

const activityListStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  overflow: 'hidden'
};

const activityItemStyle: CSSProperties = {
  padding: '1rem 1.5rem',
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const activityTitleStyle: CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#111827',
  textTransform: 'capitalize',
  marginBottom: '0.25rem'
};

const activityMetaStyle: CSSProperties = {
  fontSize: '0.75rem',
  color: '#6b7280'
};

const activityScoreStyle: CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  fontWeight: 700,
  fontSize: '0.875rem'
};

const emptyStateStyle: CSSProperties = {
  textAlign: 'center',
  padding: '4rem 2rem',
  maxWidth: '500px',
  margin: '0 auto'
};

const linkButtonStyle: CSSProperties = {
  display: 'inline-block',
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  textDecoration: 'none',
  borderRadius: '6px',
  fontWeight: 600
};