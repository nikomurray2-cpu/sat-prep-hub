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

interface Recommendation {
  questionType: string;
  section: 'reading-writing' | 'math';
  reason: string;
  averageScore?: number;
  attempts: number;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('quiz-attempts');
    let attempts: QuizAttempt[] = [];
    
    if (stored) {
      try {
        attempts = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse attempts:', e);
      }
    }

    const recs = generateRecommendations(attempts);
    setRecommendations(recs);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>What to Work On</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>Loading...</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <Link href="/analytics" style={backLinkStyle}>← Analytics</Link>
            <h1 style={titleStyle}>What to Work On</h1>
          </div>
        </div>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#111827' }}>
            You're doing great!
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Complete some quizzes to get personalized recommendations.
          </p>
          <Link href="/practice" style={buttonStyle}>
            Start Practicing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <Link href="/analytics" style={backLinkStyle}>← Analytics</Link>
          <h1 style={titleStyle}>What to Work On</h1>
          <p style={subtitleStyle}>Based on your performance, here's where to focus.</p>
        </div>
      </div>

      <div style={contentStyle}>
        <div style={listStyle}>
          {recommendations.map((rec, index) => (
            <div key={rec.questionType} style={recCardStyle}>
              <div style={badgeStyle}>#{index + 1}</div>
              <div style={{ flex: 1 }}>
                <h3 style={recTitleStyle}>{rec.questionType.replace(/-/g, ' ')}</h3>
                <div style={recSectionStyle}>
                  {rec.section === 'reading-writing' ? 'Reading & Writing' : 'Math'}
                </div>
                <p style={recReasonStyle}>{rec.reason}</p>
              </div>
              <Link href={`/practice/${rec.questionType}`} style={practiceLinkStyle}>
                Practice Now →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function generateRecommendations(attempts: QuizAttempt[]): Recommendation[] {
  if (attempts.length === 0) return [];

  // Calculate stats by question type
  const typeStats = new Map<string, {
    questionType: string;
    section: 'reading-writing' | 'math';
    attempts: number;
    totalScore: number;
    proficientCount: number;
  }>();

  attempts.forEach(attempt => {
    if (!typeStats.has(attempt.questionType)) {
      typeStats.set(attempt.questionType, {
        questionType: attempt.questionType,
        section: attempt.section,
        attempts: 0,
        totalScore: 0,
        proficientCount: 0
      });
    }
    const stats = typeStats.get(attempt.questionType)!;
    stats.attempts++;
    stats.totalScore += attempt.score;
    if (attempt.score >= 4) stats.proficientCount++;
  });

  const recommendations: Recommendation[] = [];

  typeStats.forEach(stats => {
    const averageScore = stats.totalScore / stats.attempts;
    const proficiencyRate = (stats.proficientCount / stats.attempts) * 100;

    if (averageScore < 3.5 || proficiencyRate < 50) {
      let reason = '';
      if (averageScore < 3.0) {
        reason = `Average score ${averageScore.toFixed(1)}/5 across ${stats.attempts} attempts. Needs improvement.`;
      } else if (proficiencyRate < 50) {
        reason = `${proficiencyRate.toFixed(0)}% proficiency rate. Practice for consistency.`;
      } else {
        reason = `Average score ${averageScore.toFixed(1)}/5. Room for improvement.`;
      }

      recommendations.push({
        questionType: stats.questionType,
        section: stats.section,
        reason,
        averageScore,
        attempts: stats.attempts
      });
    }
  });

  recommendations.sort((a, b) => {
    if (a.averageScore !== undefined && b.averageScore !== undefined) {
      return a.averageScore - b.averageScore;
    }
    return 0;
  });

  return recommendations.slice(0, 5);
}

// Styles
const containerStyle: CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f9fafb'
};

const headerStyle: CSSProperties = {
  padding: '2rem',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb'
};

const backLinkStyle: CSSProperties = {
  color: '#2563eb',
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  marginBottom: '0.5rem',
  display: 'inline-block'
};

const titleStyle: CSSProperties = {
  fontSize: '2rem',
  fontWeight: 700,
  color: '#111827',
  margin: 0,
  marginBottom: '0.5rem'
};

const subtitleStyle: CSSProperties = {
  fontSize: '1rem',
  color: '#6b7280',
  margin: 0
};

const contentStyle: CSSProperties = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '2rem'
};

const listStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const recCardStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  border: '2px solid #e5e7eb',
  borderRadius: '8px',
  padding: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem'
};

const badgeStyle: CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: '#fef3c7',
  color: '#92400e',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '1.125rem',
  flexShrink: 0
};

const recTitleStyle: CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#111827',
  margin: 0,
  marginBottom: '0.25rem',
  textTransform: 'capitalize'
};

const recSectionStyle: CSSProperties = {
  fontSize: '0.75rem',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontWeight: 600,
  marginBottom: '0.5rem'
};

const recReasonStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: '#4b5563',
  margin: 0,
  lineHeight: 1.5
};

const practiceLinkStyle: CSSProperties = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  textDecoration: 'none',
  borderRadius: '6px',
  fontWeight: 600,
  fontSize: '0.875rem',
  whiteSpace: 'nowrap'
};

const buttonStyle: CSSProperties = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  textDecoration: 'none',
  borderRadius: '6px',
  fontWeight: 600,
  display: 'inline-block'
};

const emptyStateStyle: CSSProperties = {
  textAlign: 'center',
  padding: '4rem 2rem'
};