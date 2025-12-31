// app/recommendations/page.tsx
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
  priority: number; // 1 = highest
  averageScore?: number;
  proficiencyRate?: number;
  attempts: number;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load attempts from localStorage
    const stored = localStorage.getItem('quiz-attempts');
    let attempts: QuizAttempt[] = [];
    
    if (stored) {
      try {
        attempts = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse quiz attempts:', e);
      }
    }

    // Generate recommendations
    const recs = generateRecommendations(attempts);
    setRecommendations(recs);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>What to Work On</h1>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <Link href="/analytics" style={backLinkStyle}>
              ← Analytics
            </Link>
            <h1 style={titleStyle}>What to Work On</h1>
          </div>
        </div>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#111827' }}>
            You're doing great!
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Either you haven't started practicing yet, or your performance is strong across all question types.
          </p>
          <Link href="/practice" style={linkButtonStyle}>
            Continue Practicing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <Link href="/analytics" style={backLinkStyle}>
            ← Analytics
          </Link>
          <h1 style={titleStyle}>What to Work On</h1>
          <p style={subtitleStyle}>
            Based on your performance, here's where to focus next.
          </p>
        </div>
      </div>

      <div style={contentStyle}>
        <div style={recommendationsListStyle}>
          {recommendations.map((rec, index) => (
            <div key={rec.questionType} style={recommendationCardStyle}>
              <div style={priorityBadgeStyle}>#{index + 1}</div>
              <div style={{ flex: 1 }}>
                <h3 style={recTitleStyle}>
                  {rec.questionType.replace(/-/g, ' ')}
                </h3>
                <div style={recSectionStyle}>
                  {rec.section === 'reading-writing' ? 'Reading & Writing' : 'Math'}
                </div>
                <p style={recReasonStyle}>{rec.reason}</p>
              </div>
              <Link
                href={`/practice/${rec.questionType}`}
                style={practiceLinkStyle}
              >
                Practice Now →
              </Link>
            </div>
          ))}
        </div>

        <div style={tipsBoxStyle}>
          <h3 style={tipsHeaderStyle}>💡 Tips for Improvement</h3>
          <ul style={tipsListStyle}>
            <li style={tipItemStyle}>
              Focus on one question type at a time until you reach proficiency (4+/5 consistently).
            </li>
            <li style={tipItemStyle}>
              Complete at least 3-5 quizzes per question type to build pattern recognition.
            </li>
            <li style={tipItemStyle}>
              Review incorrect answers carefully — understanding mistakes is key to improvement.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function generateRecommendations(attempts: QuizAttempt[]): Recommendation[] {
  if (attempts.length === 0) return [];

  // All possible question types (you'll need to define these based on your actual types)
  const allQuestionTypes = [
    { type: 'words-in-context', section: 'reading-writing' as const },
    { type: 'text-structure', section: 'reading-writing' as const },
    { type: 'cross-text-connections', section: 'reading-writing' as const },
    { type: 'central-ideas', section: 'reading-writing' as const },
    { type: 'command-of-evidence', section: 'reading-writing' as const },
    { type: 'linear-equations', section: 'math' as const },
    { type: 'linear-functions', section: 'math' as const },
    { type: 'systems-of-equations', section: 'math' as const },
    { type: 'equivalent-expressions', section: 'math' as const }
  ];

  // Calculate stats for each attempted question type
  const typeStatsMap = new Map<string, {
    questionType: string;
    section: 'reading-writing' | 'math';
    attempts: number;
    totalScore: number;
    proficientCount: number;
    scores: number[];
  }>();

  attempts.forEach(attempt => {
    const key = attempt.questionType;
    if (!typeStatsMap.has(key)) {
      typeStatsMap.set(key, {
        questionType: attempt.questionType,
        section: attempt.section,
        attempts: 0,
        totalScore: 0,
        proficientCount: 0,
        scores: []
      });
    }
    const stats = typeStatsMap.get(key)!;
    stats.attempts++;
    stats.totalScore += attempt.score;
    stats.scores.push(attempt.score);
    if (attempt.score >= 4) stats.proficientCount++;
  });

  const recommendations: Recommendation[] = [];

  // Priority 1: Lowest average score (attempted types)
  typeStatsMap.forEach(stats => {
    const averageScore = stats.totalScore / stats.attempts;
    const proficiencyRate = (stats.proficientCount / stats.attempts) * 100;

    // Recommend if average score is below 3.5 OR proficiency rate is below 50%
    if (averageScore < 3.5 || proficiencyRate < 50) {
      let reason = '';
      if (averageScore < 3.0) {
        reason = `Average score ${averageScore.toFixed(1)}/5 across ${stats.attempts} ${stats.attempts === 1 ? 'attempt' : 'attempts'}. Needs significant improvement.`;
      } else if (proficiencyRate < 50) {
        reason = `${proficiencyRate.toFixed(0)}% proficiency rate across ${stats.attempts} ${stats.attempts === 1 ? 'attempt' : 'attempts'}. Practice for consistency.`;
      } else {
        reason = `Average score ${averageScore.toFixed(1)}/5 across ${stats.attempts} ${stats.attempts === 1 ? 'attempt' : 'attempts'}. Room for improvement.`;
      }

      recommendations.push({
        questionType: stats.questionType,
        section: stats.section,
        reason,
        priority: averageScore < 3.0 ? 1 : 2,
        averageScore,
        proficiencyRate,
        attempts: stats.attempts
      });
    }
  });

  // Priority 3: Not attempted yet
  const attemptedTypes = new Set(Array.from(typeStatsMap.keys()));
  allQuestionTypes.forEach(({ type, section }) => {
    if (!attemptedTypes.has(type)) {
      recommendations.push({
        questionType: type,
        section,
        reason: 'Not yet attempted. Start here to establish a baseline.',
        priority: 3,
        attempts: 0
      });
    }
  });

  // Sort by priority (lowest first), then by average score (lowest first)
  recommendations.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    if (a.averageScore !== undefined && b.averageScore !== undefined) {
      return a.averageScore - b.averageScore;
    }
    return 0;
  });

  // Return top 5 recommendations
  return recommendations.slice(0, 5);
}

// Styles
const containerStyle: CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f9fafb'
};

const headerStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  padding: '2rem'
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

const recommendationsListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginBottom: '2rem'
};

const recommendationCardStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  border: '2px solid #e5e7eb',
  borderRadius: '8px',
  padding: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem'
};

const priorityBadgeStyle: CSSProperties = {
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

const tipsBoxStyle: CSSProperties = {
  backgroundColor: '#eff6ff',
  border: '1px solid #bfdbfe',
  borderRadius: '8px',
  padding: '1.5rem'
};

const tipsHeaderStyle: CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: 600,
  color: '#1e40af',
  margin: 0,
  marginBottom: '1rem'
};

const tipsListStyle: CSSProperties = {
  margin: 0,
  paddingLeft: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};

const tipItemStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: '#1e40af',
  lineHeight: 1.6
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
  borderRadius: '6px'
};