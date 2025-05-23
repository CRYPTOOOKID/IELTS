import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToeflReadingContext } from './ToeflReadingContext';
import { Button } from '../../ui/button';
import './ToeflReading.css';

const ToeflReadingFeedback = () => {
  const navigate = useNavigate();
  const {
    passages,
    userAnswers,
    resetTest,
    testCompleted,
    getCorrectAnswerForScoring
  } = useToeflReadingContext();

  const [animatedScore, setAnimatedScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  if (!testCompleted) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-message">Processing your results...</p>
      </div>
    );
  }

  // Calculate score with support for different question types
  const calculateScore = () => {
    let correctAnswers = 0;
    let totalQuestions = 0;

    passages.forEach(passage => {
      passage.questions.forEach(question => {
        totalQuestions++;
        const userAnswer = userAnswers[question.id];
        const correctAnswer = getCorrectAnswerForScoring(question);
        
        if (question.type === 'PROSE_SUMMARY') {
          // For prose summary, check if user selected exactly the 3 correct answers
          if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
            const userSet = new Set(userAnswer);
            const correctSet = new Set(correctAnswer);
            if (userSet.size === correctSet.size && 
                [...correctSet].every(answer => userSet.has(answer))) {
              correctAnswers++;
            }
          }
        } else if (question.type === 'FILL_IN_A_TABLE') {
          // For table questions, check if all categorizations are correct
          if (typeof userAnswer === 'object' && question.statementsToCategorize) {
            let allCorrect = true;
            question.statementsToCategorize.forEach((statement, index) => {
              if (userAnswer[index] !== statement.correctCategoryIndex) {
                allCorrect = false;
              }
            });
            if (allCorrect) {
              correctAnswers++;
            }
          }
        } else {
          // For standard questions, compare directly
          if (userAnswer === correctAnswer) {
            correctAnswers++;
          }
        }
      });
    });

    return {
      correct: correctAnswers,
      total: totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100)
    };
  };

  const score = calculateScore();

  // Animate score on load
  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const increment = score.percentage / 50;
      const scoreAnimation = setInterval(() => {
        current += increment;
        if (current >= score.percentage) {
          current = score.percentage;
          clearInterval(scoreAnimation);
          if (score.percentage >= 80) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
          }
        }
        setAnimatedScore(Math.round(current));
      }, 20);
    }, 500);

    return () => clearTimeout(timer);
  }, [score.percentage]);

  const getScoreBand = (percentage) => {
    if (percentage >= 95) return { 
      band: 'Outstanding', 
      color: '#8b5cf6', 
      bgColor: 'bg-purple-50',
      icon: 'emoji_events',
      stars: 5,
      message: 'Exceptional performance! You\'re ready for the real TOEFL!'
    };
    if (percentage >= 85) return { 
      band: 'Excellent', 
      color: '#059669', 
      bgColor: 'bg-green-50',
      icon: 'star',
      stars: 4,
      message: 'Great job! You have strong reading comprehension skills.'
    };
    if (percentage >= 75) return { 
      band: 'Good', 
      color: '#3b82f6', 
      bgColor: 'bg-blue-50',
      icon: 'thumb_up',
      stars: 3,
      message: 'Well done! Keep practicing to reach excellence.'
    };
    if (percentage >= 65) return { 
      band: 'Fair', 
      color: '#f59e0b', 
      bgColor: 'bg-yellow-50',
      icon: 'trending_up',
      stars: 2,
      message: 'You\'re on the right track! Focus on weak areas.'
    };
    return { 
      band: 'Needs Work', 
      color: '#ef4444', 
      bgColor: 'bg-red-50',
      icon: 'school',
      stars: 1,
      message: 'Keep practicing! Every expert was once a beginner.'
    };
  };

  const scoreBand = getScoreBand(score.percentage);

  const formatUserAnswer = (question, userAnswer) => {
    if (userAnswer === undefined) return 'No answer selected';
    
    switch (question.type) {
      case 'PROSE_SUMMARY':
        if (Array.isArray(userAnswer)) {
          return userAnswer
            .map(index => `${String.fromCharCode(65 + index)}. ${question.options[index]}`)
            .join(', ');
        }
        return 'No answer selected';
        
      case 'FILL_IN_A_TABLE':
        if (typeof userAnswer === 'object') {
          return question.statementsToCategorize
            .map((statement, index) => 
              `"${statement.statement}" → ${question.tableCategories[userAnswer[index]] || 'Not categorized'}`
            )
            .join('; ');
        }
        return 'No answer selected';
        
      default:
        return `${String.fromCharCode(65 + userAnswer)}. ${question.options[userAnswer]}`;
    }
  };

  const formatCorrectAnswer = (question) => {
    const correctAnswer = getCorrectAnswerForScoring(question);
    
    switch (question.type) {
      case 'PROSE_SUMMARY':
        if (Array.isArray(correctAnswer)) {
          return correctAnswer
            .map(index => `${String.fromCharCode(65 + index)}. ${question.options[index]}`)
            .join(', ');
        }
        return 'N/A';
        
      case 'FILL_IN_A_TABLE':
        return question.statementsToCategorize
          .map(statement => 
            `"${statement.statement}" → ${question.tableCategories[statement.correctCategoryIndex]}`
          )
          .join('; ');
          
      default:
        if (typeof question.correctAnswer === 'string') {
          const answerIndex = question.correctAnswer.charCodeAt(0) - 65;
          return `${question.correctAnswer}. ${question.options[answerIndex]}`;
        }
        return `${String.fromCharCode(65 + correctAnswer)}. ${question.options[correctAnswer]}`;
    }
  };

  const isAnswerCorrect = (question, userAnswer) => {
    const correctAnswer = getCorrectAnswerForScoring(question);
    
    switch (question.type) {
      case 'PROSE_SUMMARY':
        if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
          const userSet = new Set(userAnswer);
          const correctSet = new Set(correctAnswer);
          return userSet.size === correctSet.size && 
                 [...correctSet].every(answer => userSet.has(answer));
        }
        return false;
        
      case 'FILL_IN_A_TABLE':
        if (typeof userAnswer === 'object' && question.statementsToCategorize) {
          return question.statementsToCategorize.every((statement, index) => 
            userAnswer[index] === statement.correctCategoryIndex
          );
        }
        return false;
        
      default:
        return userAnswer === correctAnswer;
    }
  };

  function getQuestionTypeStats() {
    const typeStats = {};
    
    passages.forEach(passage => {
      passage.questions.forEach(question => {
        if (!typeStats[question.type]) {
          typeStats[question.type] = { correct: 0, total: 0 };
        }
        
        typeStats[question.type].total++;
        
        const userAnswer = userAnswers[question.id];
        if (isAnswerCorrect(question, userAnswer)) {
          typeStats[question.type].correct++;
        }
      });
    });
    
    return Object.entries(typeStats).map(([type, stats]) => ({
      type,
      ...stats,
      percentage: Math.round((stats.correct / stats.total) * 100)
    }));
  }

  function getWorstPerformingTypes() {
    return getQuestionTypeStats()
      .filter(stat => stat.percentage < 60)
      .map(stat => stat.type);
  }

  const handleBackToHome = () => {
    navigate('/toefl-skills');
  };

  return (
    <div className="modern-feedback-fullscreen">
      {/* Back to Home Button */}
      <div className="back-to-home">
        <Button
          onClick={handleBackToHome}
          className="back-button"
          variant="outline"
        >
          <span className="material-icons">arrow_back</span>
          Back to Home
        </Button>
      </div>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="confetti">🎉</div>
          <div className="celebration-text">Outstanding Performance!</div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="feedback-main-container">
        {/* Left Section - Score and Skills */}
        <div className="feedback-left-section">
          {/* Hero Section */}
          <div className="feedback-hero-compact">
            <div className="hero-content-compact">
              <div className="achievement-icon-compact">
                <span className="material-icons" style={{ color: scoreBand.color }}>
                  {scoreBand.icon}
                </span>
              </div>
              <h1 className="hero-title-compact">Test Complete!</h1>
              <p className="hero-subtitle-compact">{scoreBand.message}</p>
              
              {/* Star Rating */}
              <div className="star-rating-compact">
                {[...Array(5)].map((_, index) => (
                  <span 
                    key={index} 
                    className={`star ${index < scoreBand.stars ? 'filled' : 'empty'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Score Dashboard */}
          <div className="score-dashboard-compact">
            <div className="score-card-compact">
              <div className="score-visual-compact">
                <div className="score-circle-compact">
                  <svg className="score-circle-bg" viewBox="0 0 36 36">
                    <path
                      className="circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="circle"
                      strokeDasharray={`${animatedScore}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      style={{ stroke: scoreBand.color }}
                    />
                  </svg>
                  <div className="score-text">
                    <span className="score-number-compact">{animatedScore}%</span>
                    <span className="score-label-compact">Overall Score</span>
                  </div>
                </div>
              </div>
              
              <div className="score-breakdown-compact">
                <div className="breakdown-item-compact">
                  <div className="breakdown-icon-compact">
                    <span className="material-icons">check_circle</span>
                  </div>
                  <div className="breakdown-content-compact">
                    <span className="breakdown-number-compact">{score.correct}</span>
                    <span className="breakdown-label-compact">Correct</span>
                  </div>
                </div>
                
                <div className="breakdown-item-compact">
                  <div className="breakdown-icon-compact">
                    <span className="material-icons">quiz</span>
                  </div>
                  <div className="breakdown-content-compact">
                    <span className="breakdown-number-compact">{score.total}</span>
                    <span className="breakdown-label-compact">Total</span>
                  </div>
                </div>
                
                <div className="breakdown-item-compact">
                  <div className="breakdown-icon-compact">
                    <span className="material-icons">grade</span>
                  </div>
                  <div className="breakdown-content-compact">
                    <span className="breakdown-number-compact">{scoreBand.band}</span>
                    <span className="breakdown-label-compact">Performance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Analysis */}
          <div className="skills-analysis-compact">
            <h2 className="section-title-compact">
              <span className="material-icons">analytics</span>
              Skills Analysis
            </h2>
            
            <div className="skills-grid-compact">
              {getQuestionTypeStats().map((stat, index) => (
                <div key={stat.type} className="skill-card-compact">
                  <div className="skill-header-compact">
                    <div className="skill-icon-compact">
                      <span className="material-icons">
                        {stat.type.includes('VOCABULARY') ? 'translate' :
                         stat.type.includes('INFERENCE') ? 'psychology' :
                         stat.type.includes('SUMMARY') ? 'summarize' :
                         stat.type.includes('TABLE') ? 'table_chart' :
                         'quiz'}
                      </span>
                    </div>
                    <h3 className="skill-name-compact">{stat.type.replace(/_/g, ' ')}</h3>
                  </div>
                  
                  <div className="skill-score-compact">
                    <div className="skill-percentage-compact" style={{ color: stat.percentage >= 70 ? '#059669' : '#ef4444' }}>
                      {stat.percentage}%
                    </div>
                    <div className="skill-fraction-compact">{stat.correct}/{stat.total}</div>
                  </div>
                  
                  <div className="skill-progress-compact">
                    <div 
                      className="skill-progress-fill-compact"
                      style={{ 
                        width: `${stat.percentage}%`,
                        backgroundColor: stat.percentage >= 70 ? '#059669' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  
                  <div className="skill-status-compact">
                    {stat.percentage >= 90 ? (
                      <span className="status-excellent">
                        <span className="material-icons">star</span>
                        Excellent
                      </span>
                    ) : stat.percentage >= 70 ? (
                      <span className="status-good">
                        <span className="material-icons">thumb_up</span>
                        Good
                      </span>
                    ) : (
                      <span className="status-needs-work">
                        <span className="material-icons">trending_up</span>
                        Needs Practice
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Tips */}
          <div className="improvement-section-compact">
            <h2 className="section-title-compact">
              <span className="material-icons">lightbulb</span>
              Personalized Tips
            </h2>
            
            <div className="tips-grid-compact">
              {score.percentage < 70 && (
                <div className="tip-card-compact">
                  <div className="tip-icon-compact">
                    <span className="material-icons">library_books</span>
                  </div>
                  <h3>Daily Reading Practice</h3>
                  <p>Read academic passages daily to improve comprehension speed and accuracy.</p>
                </div>
              )}
              
              {score.percentage < 80 && (
                <div className="tip-card-compact">
                  <div className="tip-icon-compact">
                    <span className="material-icons">timer</span>
                  </div>
                  <h3>Time Management</h3>
                  <p>Practice timing yourself - aim for 17-18 minutes per passage including all questions.</p>
                </div>
              )}
              
              <div className="tip-card-compact">
                <div className="tip-icon-compact">
                  <span className="material-icons">psychology</span>
                </div>
                <h3>Question Strategy</h3>
                <p>Learn specific strategies for each question type. Practice identifying keywords.</p>
              </div>
              
              {getWorstPerformingTypes().map(type => (
                <div key={type} className="tip-card-compact">
                  <div className="tip-icon-compact">
                    <span className="material-icons">target</span>
                  </div>
                  <h3>Focus: {type.replace(/_/g, ' ')}</h3>
                  <p>This question type needs extra attention. Practice identifying key information.</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="action-section-compact">
            <Button
              onClick={resetTest}
              className="action-button-compact primary"
            >
              <span className="material-icons">refresh</span>
              Take Another Test
            </Button>
          </div>
        </div>

        {/* Right Section - Detailed Review with Fixed Container */}
        <div className="feedback-right-section">
          <div className="question-review-fixed">
            <h2 className="section-title-fixed">
              <span className="material-icons">rate_review</span>
              Detailed Review
            </h2>
            
            <div className="questions-scroll-container">
              {passages.map((passage, passageIndex) => (
                <div key={passage.id} className="passage-review-fixed">
                  <div className="passage-header-fixed">
                    <span className="material-icons">article</span>
                    <h3>Passage {passageIndex + 1}: {passage.title}</h3>
                  </div>
                  
                  <div className="questions-grid-fixed">
                    {passage.questions.map((question, questionIndex) => {
                      const userAnswer = userAnswers[question.id];
                      const isCorrect = isAnswerCorrect(question, userAnswer);
                      const globalQuestionNumber = passages
                        .slice(0, passageIndex)
                        .reduce((total, p) => total + p.questions.length, 0) + questionIndex + 1;

                      return (
                        <div key={question.id} className={`question-card-fixed ${isCorrect ? 'correct' : 'incorrect'}`}>
                          <div className="question-header-fixed">
                            <div className="question-number-badge-fixed">
                              Q{globalQuestionNumber}
                            </div>
                            <div className="question-type-badge-fixed">
                              {question.type.replace(/_/g, ' ')}
                            </div>
                            <div className={`result-badge-fixed ${isCorrect ? 'correct' : 'incorrect'}`}>
                              <span className="material-icons">
                                {isCorrect ? 'check_circle' : 'cancel'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="question-content-fixed">
                            <p className="question-text-fixed">{question.question}</p>
                            
                            <div className="answers-comparison-fixed">
                              <div className="answer-block-fixed">
                                <span className="answer-label-fixed">Your Answer:</span>
                                <span className={`answer-text-fixed ${isCorrect ? 'correct' : 'incorrect'}`}>
                                  {formatUserAnswer(question, userAnswer)}
                                </span>
                              </div>
                              
                              {!isCorrect && (
                                <div className="answer-block-fixed">
                                  <span className="answer-label-fixed">Correct Answer:</span>
                                  <span className="answer-text-fixed correct">
                                    {formatCorrectAnswer(question)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToeflReadingFeedback; 