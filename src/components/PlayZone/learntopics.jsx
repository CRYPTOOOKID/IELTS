import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../../config';

// Enhanced CSS for modern design and animations
const modernStyles = `
@keyframes confettiDrop {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

@keyframes confettiExplode {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.8) rotate(360deg);
    opacity: 0;
  }
}

@keyframes scoreReveal {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(34, 197, 94, 0.6);
  }
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes slideInUp {
  0% { opacity: 0; transform: translateY(50px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-slideInUp {
  animation: slideInUp 0.8s ease-out forwards;
}

.animate-scoreReveal {
  animation: scoreReveal 1s ease-out forwards;
}

.animate-pulseGlow {
  animation: pulseGlow 2s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.confetti-container.active {
  opacity: 1;
}

.confetti-piece {
  position: absolute;
  width: 12px;
  height: 12px;
  opacity: 0.9;
  border-radius: 3px;
  animation: confettiDrop 4s ease-in-out forwards;
}

.confetti-burst {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: confettiExplode 2s ease-out forwards;
}

/* Modern glassmorphism background */
.learn-topics-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e1b4b 0%, #7c3aed 50%, #1e40af 100%);
  position: relative;
  overflow: hidden;
}

.learn-topics-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.topics-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 10;
}

.topic-title {
  background: linear-gradient(135deg, #06ffa5, #22d3ee, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 3rem;
  font-weight: 900;
  text-align: center;
  padding: 2rem 0;
  text-shadow: 0 0 40px rgba(34, 211, 238, 0.6), 0 0 80px rgba(6, 255, 165, 0.4);
  filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.5));
}

.topics-main {
  position: relative;
  z-index: 10;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
}

.question-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  max-width: 800px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.question-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #22d3ee, #3b82f6, #8b5cf6);
  border-radius: 24px 24px 0 0;
}

.quiz-summary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  max-width: 600px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  margin: 2rem;
  color: white;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #22d3ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Progress tracker component
const ProgressTracker = ({ currentQuestion, totalQuestions }) => {
  const progressPercentage = Math.round((currentQuestion / totalQuestions) * 100);
  
  return (
    <div className="progress-tracker flex flex-col items-center">
      <div className="progress-text text-sm font-semibold text-white mb-3">
        Question {currentQuestion} of {totalQuestions}
      </div>
      <div className="progress-bar-container w-44 h-4 bg-gray-800/60 rounded-full overflow-hidden backdrop-blur-sm border-2 border-cyan-400/50 shadow-lg">
        <div 
          className="progress-bar-fill h-full bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 transition-all duration-500 ease-out rounded-full shadow-xl" 
          style={{ 
            width: `${progressPercentage}%`,
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.6)'
          }}
        ></div>
      </div>
      <div className="text-sm font-medium text-cyan-200 mt-2">{progressPercentage}% Complete</div>
    </div>
  );
};

// Question component that handles multiple choice and fill-in-the-blank questions
const Question = ({ question, onAnswerSubmit, onNext, onPrevious, currentQuestionIndex, totalQuestions }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showProTip, setShowProTip] = useState(false);
  
  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setTextInput('');
    setFeedback(null);
    setShowProTip(false);
  }, [question]);
  
  if (!question) {
    return (
      <div className="question-skeleton">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded mb-2 w-2/3"></div>
          <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded mb-2 w-2/3"></div>
        </div>
      </div>
    );
  }
  
  const isMultipleChoice = question.type === 'multiple_choice';
  const isFillInTheBlank = question.type === 'fill_in_the_blank';
  const isErrorCorrection = question.type === 'error_correction';
  
  const handleOptionClick = (option) => {
    if (feedback) return; // Prevent changing after submission
    
    setSelectedOption(option);
    const isCorrect = option === question.correct_answer;
    setFeedback({
      isCorrect,
      correctAnswer: question.correct_answer
    });
    setShowProTip(true);
    onAnswerSubmit(isCorrect);
  };
  
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (feedback) return; // Prevent resubmission
    
    const userAnswer = textInput.trim().toLowerCase();
    const correctAnswer = question.correct_answer.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    
    setFeedback({
      isCorrect,
      correctAnswer: question.correct_answer
    });
    setShowProTip(true);
    onAnswerSubmit(isCorrect);
  };
  
  const renderMultipleChoice = () => {
    return (
      <div className="options-container">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrectAnswer = option === question.correct_answer;
          const isCorrectSelected = isSelected && isCorrectAnswer;
          const isIncorrectSelected = isSelected && !isCorrectAnswer;
          const showCorrectHighlight = feedback && isCorrectAnswer;

          return (
            <button
              key={index}
              className={`option-button relative flex items-center p-5 mb-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                isSelected ? 'font-bold' : 'font-semibold'
              } ${
                showCorrectHighlight 
                  ? 'border-emerald-300 bg-emerald-400/30 text-emerald-50 shadow-xl shadow-emerald-400/40' 
                  : isIncorrectSelected
                    ? 'border-red-300 bg-red-400/30 text-red-50 shadow-xl shadow-red-400/40'
                    : 'border-cyan-300/60 bg-white/15 text-white hover:border-cyan-300 hover:bg-cyan-400/25 hover:shadow-xl hover:shadow-cyan-400/30 backdrop-blur-sm'
              }`}
              onClick={() => handleOptionClick(option)}
              disabled={feedback !== null}
            >
              <div className="flex-1 text-left">{option}</div>
              
              {/* Show checkmark or X icon after answering */}
              {feedback && (
                <div className="flex-shrink-0 ml-3">
                  {isCorrectAnswer && (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-400/40 text-emerald-100 border-2 border-emerald-300 shadow-lg">
                      <span className="material-icons" style={{fontSize: '20px'}}>check</span>
                    </span>
                  )}
                  {isIncorrectSelected && (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-400/40 text-red-100 border-2 border-red-300 shadow-lg">
                      <span className="material-icons" style={{fontSize: '20px'}}>close</span>
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };
  
  const renderFillInTheBlank = () => {
    return (
      <form onSubmit={handleTextSubmit} className="fill-in-blank-container">
        <div className="input-container relative mb-4">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your answer here..."
            className={`text-input p-4 w-full rounded-xl border-2 outline-none transition-all duration-300 backdrop-blur-sm ${
              feedback
                ? feedback.isCorrect
                  ? 'border-emerald-300 bg-emerald-400/30 text-white pr-12 placeholder-emerald-200 shadow-lg shadow-emerald-400/25'
                  : 'border-red-300 bg-red-400/30 text-white pr-12 placeholder-red-200 shadow-lg shadow-red-400/25'
                : 'border-cyan-300/60 focus:border-cyan-300 bg-white/15 text-white placeholder-white/60 focus:bg-white/25 focus:shadow-lg focus:shadow-cyan-400/20'
            }`}
            disabled={feedback !== null}
            style={{ 
              fontWeight: 500,
              color: 'black',
              '::placeholder': {
                color: '#666'
              }
            }}
          />
          
          {/* Status icon */}
          {feedback && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {feedback.isCorrect ? (
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-400/40 text-emerald-100 border-2 border-emerald-300 shadow-lg">
                  <span className="material-icons" style={{fontSize: '18px'}}>check</span>
                </span>
              ) : (
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-400/40 text-red-100 border-2 border-red-300 shadow-lg">
                  <span className="material-icons" style={{fontSize: '18px'}}>close</span>
                </span>
              )}
            </div>
          )}
          
          <button
            type="submit"
            className="submit-button mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 text-white hover:from-cyan-300 hover:to-blue-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 border border-cyan-300/50"
            disabled={textInput.trim() === '' || feedback !== null}
            style={{
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)'
            }}
          >
            Submit Answer
          </button>
        </div>
        
        {feedback && !feedback.isCorrect && (
          <div className="wrong-answer-feedback animate-fadeIn">
            <div className="incorrect-answer mb-3 p-4 bg-red-400/30 border-l-4 border-red-300 rounded-xl backdrop-blur-sm shadow-lg shadow-red-400/20">
              <div className="flex items-center">
                <span className="material-icons text-red-100 mr-3">cancel</span>
                <span className="font-semibold text-white">Your answer:</span>
                <span className="ml-2 text-red-100 font-bold">{textInput}</span>
              </div>
            </div>
            
            <div className="correct-answer-display p-4 bg-emerald-400/30 border-l-4 border-emerald-300 rounded-xl backdrop-blur-sm shadow-lg shadow-emerald-400/20">
              <div className="flex items-center">
                <span className="material-icons text-emerald-100 mr-3">check_circle</span>
                <span className="font-semibold text-white">Correct answer:</span>
                <span className="ml-2 text-emerald-100 font-bold">{feedback.correctAnswer}</span>
              </div>
            </div>
          </div>
        )}
      </form>
    );
  };

  const renderErrorCorrection = () => {
    return (
      <div className="options-container">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrectAnswer = option === question.correct_answer;
          const isCorrectSelected = isSelected && isCorrectAnswer;
          const isIncorrectSelected = isSelected && !isCorrectAnswer;
          const showCorrectHighlight = feedback && isCorrectAnswer;

          return (
            <button
              key={index}
              className={`option-button relative flex items-center p-5 mb-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                isSelected ? 'font-bold' : 'font-semibold'
              } ${
                showCorrectHighlight 
                  ? 'border-emerald-300 bg-emerald-400/30 text-emerald-50 shadow-xl shadow-emerald-400/40' 
                  : isIncorrectSelected
                    ? 'border-red-300 bg-red-400/30 text-red-50 shadow-xl shadow-red-400/40'
                    : 'border-cyan-300/60 bg-white/15 text-white hover:border-cyan-300 hover:bg-cyan-400/25 hover:shadow-xl hover:shadow-cyan-400/30 backdrop-blur-sm'
              }`}
              onClick={() => handleOptionClick(option)}
              disabled={feedback !== null}
            >
              <div className="flex-1 text-left">{option}</div>
              
              {/* Show checkmark or X icon after answering */}
              {feedback && (
                <div className="flex-shrink-0 ml-3">
                  {isCorrectAnswer && (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-400/40 text-emerald-100 border-2 border-emerald-300 shadow-lg">
                      <span className="material-icons" style={{fontSize: '20px'}}>check</span>
                    </span>
                  )}
                  {isIncorrectSelected && (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-400/40 text-red-100 border-2 border-red-300 shadow-lg">
                      <span className="material-icons" style={{fontSize: '20px'}}>close</span>
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="question-container p-8 animate-fadeIn">
      <h2 className="question-text text-2xl font-bold text-white mb-6 leading-relaxed drop-shadow-lg">{question.question}</h2>
      
      {isMultipleChoice && renderMultipleChoice()}
      {isFillInTheBlank && renderFillInTheBlank()}
      {isErrorCorrection && renderErrorCorrection()}
      
      {showProTip && (
        <div className={`pro-tip mt-8 p-6 rounded-xl backdrop-blur-sm border-l-4 shadow-xl animate-slideInUp ${
          feedback?.isCorrect 
            ? 'bg-emerald-400/30 border-emerald-300 shadow-emerald-400/20' 
            : 'bg-amber-400/30 border-amber-300 shadow-amber-400/20'
        }`}>
          <div className="pro-tip-header flex items-center mb-3">
            <span className={`material-icons mr-3 text-xl ${
              feedback?.isCorrect ? 'text-emerald-100' : 'text-amber-100'
            }`}>
              {feedback?.isCorrect ? 'check_circle' : 'lightbulb'}
            </span>
            <h3 className="font-bold text-white text-lg">Pro Tip</h3>
          </div>
          <p className="text-white font-medium leading-relaxed">{question.pro_tip}</p>
        </div>
      )}
      
      <div className="navigation-buttons mt-10 flex items-center justify-between">
        <button
          className="nav-button prev-button px-6 py-3 flex items-center bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-xl hover:from-purple-300 hover:to-purple-400 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 border border-purple-300/50"
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
          style={{
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
          }}
        >
          <span className="material-icons mr-2">arrow_back</span>
          Previous
        </button>
        
        <ProgressTracker
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
        />
        
        <button
          className="nav-button next-button px-6 py-3 flex items-center bg-gradient-to-r from-cyan-400 to-blue-400 text-white rounded-xl hover:from-cyan-300 hover:to-blue-300 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 border border-cyan-300/50"
          onClick={onNext}
          disabled={!feedback}
          style={{
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)'
          }}
        >
          {currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next'}
          <span className="material-icons ml-2">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

// Enhanced Quiz summary component with modern design and confetti
const QuizSummary = ({ score, totalQuestions, topicName, onRetry, onBackToTopics }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [scoreAnimated, setScoreAnimated] = useState(false);
  
  let message = '';
  let messageColor = '';
  let icon = '';
  let accentColor = '';
  let gradientFrom = '';
  let gradientTo = '';
  
  if (percentage >= 90) {
    message = '🎉 Outstanding! You\'ve mastered this topic!';
    messageColor = 'text-emerald-200';
    icon = 'emoji_events';
    accentColor = '#10b981'; // emerald-500
    gradientFrom = '#10b981'; // emerald-500
    gradientTo = '#059669'; // emerald-600
  } else if (percentage >= 70) {
    message = '👏 Great job! You\'re doing excellent!';
    messageColor = 'text-cyan-200';
    icon = 'thumb_up';
    accentColor = '#06b6d4'; // cyan-500
    gradientFrom = '#06b6d4'; // cyan-500
    gradientTo = '#0891b2'; // cyan-600
  } else if (percentage >= 50) {
    message = '💪 Good effort! Keep practicing to improve!';
    messageColor = 'text-amber-200';
    icon = 'stars';
    accentColor = '#f59e0b'; // amber-500
    gradientFrom = '#f59e0b'; // amber-500
    gradientTo = '#d97706'; // amber-600
  } else {
    message = '📚 Keep studying! You\'ll get better with practice!';
    messageColor = 'text-red-200';
    icon = 'school';
    accentColor = '#ef4444'; // red-500
    gradientFrom = '#ef4444'; // red-500
    gradientTo = '#dc2626'; // red-600
  }
  
  useEffect(() => {
    // Trigger animations in sequence
    const timer1 = setTimeout(() => setScoreAnimated(true), 500);
    const timer2 = setTimeout(() => setShowBurst(true), 800);
    const timer3 = setTimeout(() => setShowConfetti(true), 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  
  // Enhanced confetti with multiple types
  const renderConfetti = () => {
    const colors = [accentColor, '#22d3ee', '#8b5cf6', '#f59e0b', '#10b981'];
    
    return (
      <div className={`confetti-container ${showConfetti ? 'active' : ''}`}>
        {/* Falling confetti */}
        {[...Array(60)].map((_, i) => (
          <div 
            key={`fall-${i}`}
            className="confetti-piece"
            style={{
              animationDelay: `${(i * 0.05) % 3}s`,
              left: `${(i * 1.67) % 100}%`,
              top: `-${Math.random() * 100}px`,
              width: `${Math.random() * 8 + 6}px`,
              height: `${Math.random() * 8 + 6}px`,
              backgroundColor: colors[i % colors.length],
              opacity: Math.random() * 0.8 + 0.4,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        ))}
        
        {/* Burst confetti from center */}
        {showBurst && [...Array(30)].map((_, i) => (
          <div 
            key={`burst-${i}`}
            className="confetti-burst"
            style={{
              animationDelay: `${i * 0.02}s`,
              left: '50%',
              top: '50%',
              backgroundColor: colors[i % colors.length],
              transform: `translate(-50%, -50%) rotate(${i * 12}deg) translateY(-${Math.random() * 200 + 100}px)`,
            }}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="quiz-summary animate-fadeIn relative overflow-hidden">
      {percentage >= 50 && renderConfetti()}
      
      {/* Floating background elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
      
      <div className="relative z-10 p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 animate-float">
            <span className="material-icons text-white text-2xl">{icon}</span>
          </div>
          <h2 className="summary-title text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
          <h3 className="topic-name text-xl text-white/80">{topicName}</h3>
        </div>
        
        <div className="score-display flex justify-center mb-10">
          <div className={`score-circle relative flex items-center justify-center w-48 h-48 ${scoreAnimated ? 'animate-scoreReveal' : 'opacity-0'}`}>
            {/* Glowing background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20"></div>
            
            {/* Animated progress ring */}
            <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={`url(#gradient-${percentage})`}
                strokeWidth="6"
                strokeDasharray="264"
                strokeDashoffset={scoreAnimated ? 264 - (264 * percentage) / 100 : 264}
                strokeLinecap="round"
                className="transition-all duration-2000 ease-out"
                style={{
                  filter: `drop-shadow(0 0 10px ${accentColor}40)`,
                }}
              />
              <defs>
                <linearGradient id={`gradient-${percentage}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={gradientFrom} />
                  <stop offset="100%" stopColor={gradientTo} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Score content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="score-percentage text-5xl font-bold text-white mb-1" style={{
                  background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {scoreAnimated ? percentage : 0}%
                </div>
                <div className="score-text text-sm text-white/70">
                  {score} out of {totalQuestions} correct
                </div>
              </div>
            </div>
            
            {/* Pulse effect for high scores */}
            {percentage >= 90 && scoreAnimated && (
              <div className="absolute inset-0 rounded-full animate-pulseGlow"></div>
            )}
          </div>
        </div>
        
        <div className={`feedback-message ${messageColor} flex items-center justify-center text-center text-xl mb-10 px-6 animate-slideInUp`}>
          <span className="text-2xl mr-3">{message}</span>
        </div>
        
        <div className="summary-buttons flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onRetry} 
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <span className="material-icons">refresh</span>
            Try Again
          </button>
          <button 
            onClick={onBackToTopics}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Topics
          </button>
        </div>
      </div>
    </div>
  );
};

// Removed static topic data - now fetching all data from API

const LearnTopics = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [apiStatus, setApiStatus] = useState('pending');
  const [requestSent, setRequestSent] = useState(false); // Track if API request has been sent
  
  // Debug logging for state changes
  useEffect(() => {
    console.log(`📊 Questions state updated: ${questions.length} questions`);
    if (questions.length > 0) {
      console.log('📊 First question:', questions[0]);
      console.log('📊 Last question:', questions[questions.length - 1]);
    }
  }, [questions]);
  
  useEffect(() => {
    console.log(`📊 Topic state updated:`, topic);
  }, [topic]);
  
  // List of topic names
  const topicNames = [
    "Subject-Verb Agreement",
    "Verb Tenses (Basic)",
    "Verb Tenses (Advanced)",
    "Pronoun Agreement and Case",
    "Articles (a, an, the)",
    "Punctuation",
    "Sentence Structure (Clauses and Phrases)",
    "Sentence Structure (Sentence Types)",
    "Modifiers (Adjectives and Adverbs)",
    "Prepositions and Prepositional Phrases",
    "Conjunctions",
    "Word Order (Syntax)",
    "Active and Passive Voice",
    "Gerunds and Infinitives",
    "Participles",
    "Countable and Uncountable Nouns",
    "Determiners",
    "Modal Verbs",
    "Reported Speech (Indirect Speech)",
    "Conditional Sentences (If-Clauses)",
    "Phrasal Verbs"
  ];
  
  // Inject modern styles
  useEffect(() => {
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.textContent = modernStyles;
    document.head.appendChild(styleEl);
    
    // Cleanup
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  // Fetch questions for the selected topic - only run once when component mounts
  useEffect(() => {
    // If we've already sent a request, don't send another one
    if (requestSent) {
      return;
    }
    
    const fetchTopic = async () => {
      try {
        setLoading(true);
        setApiStatus('pending');
        setRequestSent(true); // Mark that we've sent a request
        
        const id = parseInt(topicId, 10);
        if (isNaN(id) || id < 1 || id > 21) {
          throw new Error('Invalid topic ID. Please select a topic between 1 and 21.');
        }
        
        console.log(`Fetching topic data for ID: ${id}`);
        
        // Try direct API call first, then fallback to CORS proxy if needed
        let apiUrl = `${config.apiBaseUrl}/id/${id}`;
        console.log(`API URL: ${apiUrl}`);
        
        // Set timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
        
        let response;
        try {
          // Try direct API call first
          response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            },
            mode: 'cors',
            signal: controller.signal
          });
        } catch (corsError) {
          console.warn('Direct API call failed, trying with CORS proxy:', corsError);
          // Try with allorigins CORS proxy
          const corsProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
          console.log(`Trying CORS proxy URL: ${corsProxyUrl}`);
          
          const proxyResponse = await fetch(corsProxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            },
            signal: controller.signal
          });
          
          if (!proxyResponse.ok) {
            throw new Error(`CORS proxy failed: ${proxyResponse.status}`);
          }
          
          const proxyData = await proxyResponse.json();
          // allorigins returns the actual response in the 'contents' field
          const actualData = JSON.parse(proxyData.contents);
          
          // Create a mock response object for consistency
          response = {
            ok: true,
            status: 200,
            json: async () => actualData
          };
        }
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch topic data: HTTP ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Raw API response:', data);
        console.log('Response data type:', typeof data);
        console.log('Questions array:', data.questions);
        console.log('Questions array type:', typeof data.questions);
        console.log('Is questions an array?', Array.isArray(data.questions));
        
        // Validate the data structure
        if (data && data.topicId && data.topicName && Array.isArray(data.questions)) {
          console.log(`✅ API data successfully received for topic: ${data.topicName}`);
          console.log(`✅ Number of questions received: ${data.questions.length}`);
          console.log('✅ Setting topic and questions in state...');
          
          setTopic(data);
          setQuestions(data.questions);
          setApiStatus('success');
          setLoading(false);
          
          console.log('✅ State updated successfully');
          return;
        } else {
          console.error('❌ API returned invalid data structure:', data);
          console.error('❌ Missing fields:', {
            hasTopicId: !!data.topicId,
            hasTopicName: !!data.topicName,
            hasQuestions: !!data.questions,
            questionsIsArray: Array.isArray(data.questions)
          });
          throw new Error('Invalid data structure received from API. Expected topicId, topicName, and questions array.');
        }
        
      } catch (err) {
        console.error('Error fetching topic data:', err);
        
        // Classify the error type for better error handling
        if (err.name === 'AbortError') {
          setError('Request timed out. Please check your internet connection and try again.');
          setApiStatus('timeout');
        } else if (err.toString().includes('Content Security Policy')) {
          setError('Browser security settings prevented the request. Please try refreshing the page.');
          setApiStatus('csp-blocked');
        } else if (err.toString().includes('Failed to fetch')) {
          setError('Network error. Please check your internet connection and try again.');
          setApiStatus('network-error');
        } else {
          setError(err.message || 'Failed to load topic data. Please try again.');
          setApiStatus('error');
        }
        
        setLoading(false);
      }
    };


    if (topicId) {
      fetchTopic();
    }
  }, [topicId, requestSent]); // Only depend on topicId and requestSent
  
  // Reset request status when topic changes
  useEffect(() => {
    setRequestSent(false);
  }, [topicId]);
  
  const handleAnswerSubmit = (isCorrect) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
  };
  
  const handleBackToTopics = () => {
    navigate('/play-zone/learn');
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading questions...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <span className="material-icons">error</span>
        <h3 className="text-lg font-semibold text-red-600 mb-2">Unable to Load Topic</h3>
        <p className="mb-4">{error}</p>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setRequestSent(false);
              setError(null);
              setLoading(true);
            }} 
            className="retry-button bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="material-icons mr-2" style={{fontSize: '18px'}}>refresh</span>
            Try Again
          </button>
          <button 
            onClick={handleBackToTopics} 
            className="back-button flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Topics
          </button>
        </div>
      </div>
    );
  }
  
  // Get current topic name
  const topicName = topic?.topicName || topicNames[parseInt(topicId, 10) - 1] || 'Grammar Topic';
  
  return (
    <div className="learn-topics-container">
      <header className="topics-header">
        <button 
          onClick={handleBackToTopics}
          className="absolute top-8 left-8 flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Learn
        </button>
        <h1 className="topic-title">{topicName}</h1>
      </header>
      
      <main className="topics-main">
        {quizCompleted ? (
          <QuizSummary
            score={score}
            totalQuestions={questions.length}
            topicName={topicName}
            onRetry={handleRetry}
            onBackToTopics={handleBackToTopics}
          />
        ) : (
          <Question
            question={questions[currentQuestionIndex]}
            onAnswerSubmit={handleAnswerSubmit}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
        )}
      </main>
    </div>
  );
};

export default LearnTopics;
