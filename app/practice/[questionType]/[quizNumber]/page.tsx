// app/practice/[questionType]/[quizNumber]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Answer {
  id: string;
  text: string;
}

interface Question {
  id: number;
  passage: string;
  question: string;
  answers: Answer[];
}

const saveAttempt = (section: 'reading-writing' | 'math', questionType: string, quizNumber: number, score: number) => {
  const attempt = {
    id: `${Date.now()}-${Math.random()}`,
    date: new Date().toISOString(),
    section,
    questionType,
    quizNumber,
    score,
    totalQuestions: 5
  };
  
  const existing = localStorage.getItem('quiz-attempts');
  const attempts = existing ? JSON.parse(existing) : [];
  attempts.push(attempt);
  localStorage.setItem('quiz-attempts', JSON.stringify(attempts));
};



export default function QuizPage() {
  const params = useParams<{ questionType: string; quizNumber: string }>();
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [markedForReview, setMarkedForReview] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const questions: Question[] = [
    {
      id: 1,
      passage: 'According to a team of neuroeconomists from the University of Zurich, ease of decision making may be linked to communication between two brain regions, the prefrontal cortex and the parietal cortex. Individuals tend to be more decisive if the information flow between the regions is intensified, whereas they make choices more slowly when information flow is _____.',
      question: 'Which choice completes the text with the most logical and precise word or phrase?',
      answers: [
        { id: 'A', text: 'reduced' },
        { id: 'B', text: 'evaluated' },
        { id: 'C', text: 'determined' },
        { id: 'D', text: 'acquired' }
      ]
    },
    {
      id: 2,
      passage: 'Another sample passage for question 2...',
      question: 'What can be inferred from the passage?',
      answers: [
        { id: 'A', text: 'First answer option' },
        { id: 'B', text: 'Second answer option' },
        { id: 'C', text: 'Third answer option' },
        { id: 'D', text: 'Fourth answer option' }
      ]
    },
    {
      id: 3,
      passage: 'Third sample passage...',
      question: 'According to the passage, which statement is true?',
      answers: [
        { id: 'A', text: 'First answer option' },
        { id: 'B', text: 'Second answer option' },
        { id: 'C', text: 'Third answer option' },
        { id: 'D', text: 'Fourth answer option' }
      ]
    },
    {
      id: 4,
      passage: 'Fourth sample passage...',
      question: 'The author primarily uses which technique?',
      answers: [
        { id: 'A', text: 'First answer option' },
        { id: 'B', text: 'Second answer option' },
        { id: 'C', text: 'Third answer option' },
        { id: 'D', text: 'Fourth answer option' }
      ]
    },
    {
      id: 5,
      passage: 'Fifth sample passage...',
      question: 'What is the main purpose of this passage?',
      answers: [
        { id: 'A', text: 'First answer option' },
        { id: 'B', text: 'Second answer option' },
        { id: 'C', text: 'Third answer option' },
        { id: 'D', text: 'Fourth answer option' }
      ]
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerId: string): void => {
    setSelectedAnswer(answerId);
  };

  const handleNext = (): void => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setMarkedForReview(false);
    } else {
      router.push(`/practice/${params.questionType}`);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Top bar */}
      <div style={{
        height: '60px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #d1d5db',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#000000',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            {currentQuestionIndex + 1}
          </div>
          <button
            onClick={() => setMarkedForReview(!markedForReview)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: markedForReview ? '2px solid #000000' : '1px solid #9ca3af',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{markedForReview ? '★' : '☆'}</span>
            Mark for Review
          </button>
        </div>
        <button
          onClick={() => router.push(`/practice/${params.questionType}`)}
          style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}
        >
          ABC
        </button>
      </div>

      {/* Split screen */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Left pane - Passage */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '3rem 2.5rem',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <p style={{
              lineHeight: '1.8',
              fontSize: '1rem',
              color: '#000000',
              margin: 0
            }}>
              {currentQuestion.passage}
            </p>
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{
          width: '1px',
          backgroundColor: '#d1d5db',
          flexShrink: 0
        }} />

        {/* Right pane - Question */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '3rem 2.5rem',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <h3 style={{
              fontWeight: '400',
              marginBottom: '2rem',
              fontSize: '1rem',
              lineHeight: '1.6',
              color: '#000000',
              marginTop: 0
            }}>
              {currentQuestion.question}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentQuestion.answers.map((answer: Answer) => (
                <button
                  key={answer.id}
                  onClick={() => handleAnswerSelect(answer.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    width: '100%',
                    padding: '1rem 1.25rem',
                    backgroundColor: '#ffffff',
                    border: selectedAnswer === answer.id ? '2px solid #000000' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    transition: 'all 0.15s',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: selectedAnswer === answer.id ? '2px solid #000000' : '2px solid #9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    backgroundColor: selectedAnswer === answer.id ? '#000000' : '#ffffff'
                  }}>
                    {selectedAnswer === answer.id && (
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff'
                      }} />
                    )}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flex: 1
                  }}>
                    <span style={{
                      fontWeight: '600',
                      color: '#000000'
                    }}>
                      {answer.id}
                    </span>
                    <span style={{ color: '#000000' }}>
                      {answer.text}
                    </span>
                  </div>
                  {selectedAnswer === answer.id && (
                    <div style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '1.25rem',
                      color: '#000000'
                    }}>
                      ⊕
                    </div>
                  )}
                  <div style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1.25rem',
                    color: '#9ca3af'
                  }}>
                    ⊕
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        height: '70px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #d1d5db',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        flexShrink: 0
      }}>
        <div style={{
          fontSize: '0.875rem',
          color: '#000000',
          fontWeight: '500'
        }}>
          Niko Murray
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '0.625rem 1rem',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>▲</span>
        </div>
        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          style={{
            padding: '0.75rem 2.5rem',
            backgroundColor: selectedAnswer ? '#2563eb' : '#e5e7eb',
            color: selectedAnswer ? '#ffffff' : '#9ca3af',
            border: 'none',
            borderRadius: '6px',
            cursor: selectedAnswer ? 'pointer' : 'not-allowed',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
}