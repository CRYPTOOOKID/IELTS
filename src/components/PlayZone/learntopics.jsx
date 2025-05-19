import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../../config';

// Add CSS for confetti animation
const confettiStyles = `
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

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in forwards;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.confetti-container.active {
  opacity: 1;
}

.confetti-piece {
  position: absolute;
  top: -20px;
  width: 10px;
  height: 10px;
  opacity: 0.8;
  border-radius: 2px;
  animation: confettiDrop 5s ease-in-out forwards;
}

.bg-red-300 { background-color: #fca5a5; }
.bg-red-400 { background-color: #f87171; }
.bg-red-500 { background-color: #ef4444; }
.bg-red-600 { background-color: #dc2626; }

.bg-blue-300 { background-color: #93c5fd; }
.bg-blue-400 { background-color: #60a5fa; }
.bg-blue-500 { background-color: #3b82f6; }
.bg-blue-600 { background-color: #2563eb; }

.bg-green-300 { background-color: #86efac; }
.bg-green-400 { background-color: #4ade80; }
.bg-green-500 { background-color: #22c55e; }
.bg-green-600 { background-color: #16a34a; }

.bg-yellow-300 { background-color: #fcd34d; }
.bg-yellow-400 { background-color: #fbbf24; }
.bg-yellow-500 { background-color: #f59e0b; }
.bg-yellow-600 { background-color: #d97706; }

.bg-purple-300 { background-color: #c4b5fd; }
.bg-purple-400 { background-color: #a78bfa; }
.bg-purple-500 { background-color: #8b5cf6; }
.bg-purple-600 { background-color: #7c3aed; }

.bg-pink-300 { background-color: #f9a8d4; }
.bg-pink-400 { background-color: #f472b6; }
.bg-pink-500 { background-color: #ec4899; }
.bg-pink-600 { background-color: #db2777; }
`;

// Progress tracker component
const ProgressTracker = ({ currentQuestion, totalQuestions }) => {
  const progressPercentage = Math.round((currentQuestion / totalQuestions) * 100);
  
  return (
    <div className="progress-tracker flex flex-col items-center">
      <div className="progress-text text-sm font-medium text-gray-600 mb-2">
        {currentQuestion} of {totalQuestions}
      </div>
      <div className="progress-bar-container w-36 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="progress-bar-fill h-full bg-blue-600 transition-all duration-300 ease-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
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
              className={`option-button relative flex items-center p-4 mb-3 rounded-lg border-2 transition-all ${
                isSelected ? 'font-semibold' : ''
              } ${
                showCorrectHighlight 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : isIncorrectSelected
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
              onClick={() => handleOptionClick(option)}
              disabled={feedback !== null}
            >
              <div className="flex-1 text-left">{option}</div>
              
              {/* Show checkmark or X icon after answering */}
              {feedback && (
                <div className="flex-shrink-0 ml-2">
                  {isCorrectAnswer && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700">
                      <span className="material-icons" style={{fontSize: '16px'}}>check</span>
                    </span>
                  )}
                  {isIncorrectSelected && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700">
                      <span className="material-icons" style={{fontSize: '16px'}}>close</span>
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
            className={`text-input p-3 w-full rounded-lg border-2 outline-none transition-all ${
              feedback
                ? feedback.isCorrect
                  ? 'border-green-500 bg-green-50 text-black pr-10'
                  : 'border-red-500 bg-red-50 text-black pr-10'
                : 'border-gray-200 focus:border-blue-400 bg-white text-black'
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
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700">
                  <span className="material-icons" style={{fontSize: '16px'}}>check</span>
                </span>
              ) : (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700">
                  <span className="material-icons" style={{fontSize: '16px'}}>close</span>
                </span>
              )}
            </div>
          )}
          
          <button
            type="submit"
            className="submit-button mt-3 px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={textInput.trim() === '' || feedback !== null}
          >
            Submit
          </button>
        </div>
        
        {feedback && !feedback.isCorrect && (
          <div className="wrong-answer-feedback animate-fadeIn">
            <div className="incorrect-answer mb-2 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
              <div className="flex items-center">
                <span className="material-icons text-red-600 mr-2">cancel</span>
                <span className="font-medium text-gray-800">Your answer:</span>
                <span className="ml-2 text-gray-800 font-semibold">{textInput}</span>
              </div>
            </div>
            
            <div className="correct-answer-display p-3 bg-green-50 border-l-4 border-green-500 rounded-md">
              <div className="flex items-center">
                <span className="material-icons text-green-600 mr-2">check_circle</span>
                <span className="font-medium text-gray-800">Correct answer:</span>
                <span className="ml-2 text-gray-800 font-semibold">{feedback.correctAnswer}</span>
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
              className={`option-button relative flex items-center p-4 mb-3 rounded-lg border-2 transition-all ${
                isSelected ? 'font-semibold' : ''
              } ${
                showCorrectHighlight 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : isIncorrectSelected
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
              onClick={() => handleOptionClick(option)}
              disabled={feedback !== null}
            >
              <div className="flex-1 text-left">{option}</div>
              
              {/* Show checkmark or X icon after answering */}
              {feedback && (
                <div className="flex-shrink-0 ml-2">
                  {isCorrectAnswer && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700">
                      <span className="material-icons" style={{fontSize: '16px'}}>check</span>
                    </span>
                  )}
                  {isIncorrectSelected && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700">
                      <span className="material-icons" style={{fontSize: '16px'}}>close</span>
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
    <div className="question-container p-6 bg-white rounded-xl shadow-md">
      <h2 className="question-text text-xl font-medium text-gray-800 mb-5">{question.question}</h2>
      
      {isMultipleChoice && renderMultipleChoice()}
      {isFillInTheBlank && renderFillInTheBlank()}
      {isErrorCorrection && renderErrorCorrection()}
      
      {showProTip && (
        <div className={`pro-tip mt-6 p-4 rounded-lg shadow-sm ${
          feedback?.isCorrect 
            ? 'bg-green-50 border-l-4 border-green-500' 
            : 'bg-amber-50 border-l-4 border-amber-500'
        }`}>
          <div className="pro-tip-header flex items-center mb-2">
            <span className={`material-icons mr-2 ${
              feedback?.isCorrect ? 'text-green-600' : 'text-amber-600'
            }`}>
              {feedback?.isCorrect ? 'check_circle' : 'lightbulb'}
            </span>
            <h3 className="font-semibold">Pro Tip</h3>
          </div>
          <p className="text-gray-700">{question.pro_tip}</p>
        </div>
      )}
      
      <div className="navigation-buttons mt-8 flex items-center justify-between">
        <button
          className="nav-button prev-button px-4 py-2 flex items-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
        >
          <span className="material-icons mr-1">arrow_back</span>
          Previous
        </button>
        
        <ProgressTracker
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
        />
        
        <button
          className="nav-button next-button px-4 py-2 flex items-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          onClick={onNext}
          disabled={!feedback}
        >
          {currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next'}
          <span className="material-icons ml-1">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

// Quiz summary component
const QuizSummary = ({ score, totalQuestions, topicName, onRetry, onBackToTopics }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  let message = '';
  let color = '';
  let icon = '';
  let accentColor = '';
  
  // Set up confetti effect refs
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    // Trigger confetti animation after a short delay
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (percentage >= 90) {
    message = 'Excellent! You\'ve mastered this topic.';
    color = 'text-green-700';
    icon = 'emoji_events';
    accentColor = '#22c55e'; // green-600
  } else if (percentage >= 70) {
    message = 'Good job! You\'re on the right track.';
    color = 'text-blue-700';
    icon = 'thumb_up';
    accentColor = '#3b82f6'; // blue-500
  } else if (percentage >= 50) {
    message = 'Not bad, but there\'s room for improvement.';
    color = 'text-amber-700';
    icon = 'stars';
    accentColor = '#f59e0b'; // amber-500
  } else {
    message = 'You might need to review this topic again.';
    color = 'text-red-700';
    icon = 'school';
    accentColor = '#ef4444'; // red-500
  }
  
  // Confetti pieces with limited colors to match theme
  const renderConfetti = () => {
    // Use a reduced color palette that matches your theme color
    const colorClass = percentage >= 90 
      ? 'bg-green-500' 
      : percentage >= 70 
        ? 'bg-blue-500'
        : percentage >= 50
          ? 'bg-amber-500'
          : 'bg-red-500';
          
    return (
      <div className={`confetti-container ${showConfetti ? 'active' : ''}`}>
        {[...Array(40)].map((_, i) => (
          <div 
            key={i} 
            className="confetti-piece"
            style={{
              animationDelay: `${(i * 0.1) % 5}s`,
              left: `${(i * 2.5) % 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              backgroundColor: accentColor,
              opacity: Math.random() * 0.6 + 0.4,
            }}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="quiz-summary bg-white p-8 rounded-xl shadow-md relative overflow-hidden">
      {percentage >= 70 && renderConfetti()}
      
      <h2 className="summary-title text-2xl font-bold text-center mb-4 text-gray-800">Quiz Completed!</h2>
      <h3 className="topic-name text-xl text-center text-gray-700 mb-6">{topicName}</h3>
      
      <div className="score-display flex justify-center mb-8">
        <div className="score-circle relative flex items-center justify-center w-40 h-40 rounded-full">
          {/* Score circle background */}
          <div className="absolute inset-0 rounded-full bg-gray-100"></div>
          
          {/* Score percentage highlight ring */}
          <svg className="absolute inset-0" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f0f0f0"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={accentColor}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * percentage) / 100}
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000 ease-out"
              style={{ strokeDashoffset: 283 - (283 * percentage) / 100 }}
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="score-percentage text-4xl font-bold text-gray-800">
                {percentage}%
              </div>
              <div className="score-text text-sm text-gray-600 mt-1">
                {score} out of {totalQuestions} correct
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`feedback-message ${color} flex items-center justify-center text-center text-lg mb-8 px-4`}>
        <span className="material-icons mr-2">{icon}</span>
        <span>{message}</span>
      </div>
      
      <div className="summary-buttons">
        <button 
          onClick={onRetry} 
          className="summary-button retry"
        >
          <span className="material-icons">refresh</span>
          Try Again
        </button>
        <button 
          onClick={onBackToTopics}
          className="summary-button flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 border border-blue-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Topics
        </button>
      </div>
    </div>
  );
};

// Static topic data mapped directly from the API
const topicDataMap = {
  "1": {
    "topicId": 1, 
    "topicName": "Subject-Verb Agreement", 
    "questions": [
      {
        "options": ["A) is", "B) are", "C) was", "D) be"], 
        "correct_answer": "B) are", 
        "pro_tip": "When you have a compound subject joined by 'and', it usually takes a plural verb. 'The manager and the assistant' are two separate individuals acting as the subject.", 
        "type": "multiple_choice", 
        "question": "The manager and the assistant ____ responsible for organizing the upcoming conference."
      }, 
      {
        "options": ["A) are", "B) is", "C) were", "D) being"], 
        "correct_answer": "B) is", 
        "pro_tip": "Collective nouns like 'team' are generally treated as singular when referring to the group as a unit. Here, 'team' acts as a single entity determined to win.", 
        "type": "multiple_choice", 
        "question": "The team, despite facing several challenges, ____ determined to win the championship."
      }, 
      {
        "options": ["A) is", "B) are", "C) was", "D) has"], 
        "correct_answer": "B) are", 
        "pro_tip": "In 'there is/are' constructions, the verb agrees with the noun that follows 'there'. In this case, 'documents' is plural, so we use 'are'.", 
        "type": "multiple_choice", 
        "question": "There ____ several important documents missing from this file cabinet."
      }, 
      {
        "options": ["A) are", "B) is", "C) were", "D) been"], 
        "correct_answer": "B) is", 
        "pro_tip": "Indefinite pronouns like 'each', 'everyone', 'someone', 'nobody' are singular and take a singular verb. 'Each of the participants' refers to individuals within the group, but 'each' itself is singular.", 
        "type": "multiple_choice", 
        "question": "Each of the participants ____ required to submit their feedback after the workshop."
      }, 
      {
        "options": ["A) has", "B) have", "C) are", "D) were"], 
        "correct_answer": "A) has", 
        "pro_tip": "With 'neither/nor' and 'either/or', the verb agrees with the noun closest to it. 'Winds' is plural, but 'rain' is closer to the verb, and 'rain' is singular, hence 'has'.", 
        "type": "multiple_choice", 
        "question": "Neither the heavy rain nor the strong winds ____ stopped the outdoor concert."
      }, 
      {
        "options": ["A) are", "B) is", "C) were", "D) being"], 
        "correct_answer": "B) is", 
        "pro_tip": "When phrases like 'not', 'as well as', 'along with', 'in addition to' are used, they don't change the number of the subject. The subject remains 'quality', which is singular, thus 'is' is correct.", 
        "type": "multiple_choice", 
        "question": "The quality of the ingredients, not the price, ____ the most important factor for this restaurant."
      }, 
      {
        "correct_answer": "goes", 
        "pro_tip": "Phrases like 'along with', 'as well as', 'together with' do not change the number of the subject. The subject is 'neighbor' (singular), so the verb should be singular ('goes').", 
        "type": "fill_in_the_blank", 
        "question": "My neighbor, along with his two dogs, ____ (go) for a walk in the park every morning."
      }, 
      {
        "correct_answer": "are", 
        "pro_tip": "In 'here is/are' constructions, the verb agrees with the noun that follows 'here'. 'Keys' is plural, so we use 'are'.", 
        "type": "fill_in_the_blank", 
        "question": "Here ____ (be) the keys you were looking for."
      }, 
      {
        "correct_answer": "needs", 
        "pro_tip": "Indefinite pronouns like 'everything', 'something', 'nothing' are singular and require a singular verb. 'Everything' is singular, so the verb is 'needs'.", 
        "type": "fill_in_the_blank", 
        "question": "Everything in the kitchen ____ (need) to be cleaned after the party."
      }, 
      {
        "correct_answer": "meets", 
        "pro_tip": "Collective nouns like 'committee' can be singular or plural depending on context. Here, 'committee' is acting as a single unit performing the action of meeting, so a singular verb 'meets' is appropriate.", 
        "type": "fill_in_the_blank", 
        "question": "The committee ____ (meet) once a month to discuss project updates."
      }, 
      {
        "correct_answer": "are", 
        "pro_tip": "With 'either/or', the verb agrees with the noun closest to it. 'Dogs' is closer to the verb and is plural, so the verb should be plural ('are').", 
        "type": "fill_in_the_blank", 
        "question": "Either the cat or the dogs ____ (be) responsible for knocking over the vase."
      }, 
      {
        "options": ["A) which were delivered", "B) which are delivered", "C) are now", "D) No error"], 
        "correct_answer": "A) which were delivered", 
        "pro_tip": "The subject 'boxes' is plural, so the relative pronoun 'which' should refer back to a plural subject, requiring the plural verb 'were' instead of 'was'.", 
        "type": "error_correction", 
        "question": "The boxes, which was delivered yesterday, is now in the storage room."
      }, 
      {
        "options": ["A) has their own set", "B) have his own set", "C) has its own set", "D) No error"], 
        "correct_answer": "A) has their own set", 
        "pro_tip": "The indefinite pronoun 'Each' is singular and requires a singular verb. Therefore, 'have' should be corrected to 'has' to agree with 'Each of the students'.", 
        "type": "error_correction", 
        "question": "Each of the students have their own set of textbooks for the course."
      }, 
      {
        "options": ["A) There are many reasons", "B) There is much reason", "C) There have many reasons", "D) No error"], 
        "correct_answer": "A) There are many reasons", 
        "pro_tip": "In 'there is/are' constructions, the verb agrees with the noun following 'there'. 'Reasons' is plural, so 'is' should be corrected to 'are'.", 
        "type": "error_correction", 
        "question": "There is many reasons why people choose to live in the countryside."
      }, 
      {
        "options": ["A) is attending", "B) were attending", "C) was attending", "D) No error"], 
        "correct_answer": "A) is attending", 
        "pro_tip": "The phrase 'as well as the managers' does not change the subject 'CEO', which is singular. Therefore, the verb should agree with 'CEO' and be singular, 'is attending' instead of 'are attending'.", 
        "type": "error_correction", 
        "question": "The CEO, as well as the managers, are attending the international business summit."
      }
    ]
  }
};

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
  
  // Inject confetti CSS
  useEffect(() => {
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.textContent = confettiStyles;
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
          throw new Error('Invalid topic ID');
        }
        
        // Use embedded data for topic ID 1
        if (id === 1 && topicDataMap["1"]) {
          console.log('Using embedded data for topic ID 1');
          setTopic(topicDataMap["1"]);
          setQuestions(topicDataMap["1"].questions);
          setApiStatus('embedded');
          setLoading(false);
          return;
        }
        
        // Always try the API call first - let the catch block handle any failures
        try {
          // Set timeout to prevent hanging requests
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout
          
          const response = await fetch(`${config.apiBaseUrl}/id/${id}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            },
            signal: controller.signal
          });
          
          // Clear the timeout
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch topic data: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Validate the data structure
          if (data && data.topicId && data.topicName && Array.isArray(data.questions)) {
            console.log('API data successfully received for topic:', data.topicName);
            setTopic(data);
            setQuestions(data.questions);
            setApiStatus('success');
            setLoading(false);
            return;
          } else {
            console.warn('API returned invalid data structure:', data);
            throw new Error('Invalid data structure received from API');
          }
        } catch (apiError) {
          // Log the error details for debugging
          console.warn('API request failed:', apiError.toString());
          
          // Classify the error type for logging purposes
          if (apiError.name === 'AbortError') {
            console.warn('API request timed out after 5 seconds');
            setApiStatus('timeout');
          } else if (apiError.toString().includes('Content Security Policy')) {
            console.warn('Content Security Policy blocked the API request');
            setApiStatus('csp-blocked');
          } else {
            setApiStatus('failed');
          }
          
          // Always use mock data as fallback, regardless of error type
          useMockData(id);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in topic fetching process:', err);
        setError(err.message || 'Failed to load topic data');
        setApiStatus('error');
        setLoading(false);
      }
    };
    
    // Helper function to use mock data
    const useMockData = (id) => {
      // Get the topic name
      const topicName = topicNames[id-1] || "Grammar Topic";
      
      // Create a mock data object with the correct structure
      const mockData = {
        topicId: id,
        topicName: topicName,
        questions: []
      };
      
      // Use the switch statement to provide topic-specific mock data
      switch(id) {
        case 2: // Verb Tenses (Basic)
          mockData.questions = [
            {
              question: "She _____ to the store every Saturday.",
              type: "multiple_choice",
              correct_answer: "A. goes",
              pro_tip: "Present Simple tense is used for habitual actions or routines. 'Every Saturday' indicates a regular, repeated action.",
              options: ["A. goes", "B. is going", "C. went", "D. has gone"]
            },
            {
              question: "They _____ dinner when I arrived.",
              type: "multiple_choice",
              correct_answer: "A. were eating",
              pro_tip: "Past Continuous tense is used for an action that was in progress at a specific point in the past ('when I arrived').",
              options: ["A. were eating", "B. ate", "C. had eaten", "D. have eaten"]
            },
            {
              question: "I _____ (finish) my assignment by tomorrow evening.",
              type: "fill_in_the_blank",
              correct_answer: "will have finished",
              pro_tip: "Future Perfect tense is used to express an action that will be completed before a specific point in the future ('by tomorrow evening')."
            }
          ];
          break;
          
        case 3: // Verb Tenses (Advanced)
          mockData.questions = [
            {
              question: "By the time we reach the summit, we ________ for ten hours straight.",
              type: "multiple_choice",
              correct_answer: "B. will have been hiking",
              pro_tip: "Future Perfect Continuous tense is used to describe an action that will continue up to a certain point in the future. It emphasizes the duration of the activity.",
              options: ["A. will be hiking", "B. will have been hiking", "C. will hike", "D. are hiking"]
            },
            {
              question: "I ________ to learn Italian for years, but I never seem to find the time.",
              type: "multiple_choice",
              correct_answer: "B. have been wanting",
              pro_tip: "Present Perfect Continuous tense expresses an action that started in the past and continues up to the present. It highlights the ongoing desire over a period of time.",
              options: ["A. am wanting", "B. have been wanting", "C. want", "D. wanted"]
            },
            {
              question: "When I arrived at the cinema, the movie ________ (already/start).",
              type: "fill_in_the_blank",
              correct_answer: "had already started",
              pro_tip: "Past Perfect is used to show that an action was completed before another action in the past. It clarifies the sequence of events."
            }
          ];
          break;
          
        default:
          // For other topics, create generic questions
          mockData.questions = [
            {
              question: `Sample multiple choice question for ${topicName}?`,
              type: "multiple_choice",
              correct_answer: "A. Option 1",
              pro_tip: `This is a sample question for ${topicName}. Mock data is being used due to API restrictions.`,
              options: ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"]
            },
            {
              question: `Sample fill-in-the-blank question for ${topicName}.`,
              type: "fill_in_the_blank",
              correct_answer: "answer",
              pro_tip: `This is a sample fill-in-the-blank question for ${topicName}.`
            },
            {
              question: `Identify the error in this sentence for ${topicName}.`,
              type: "error_correction",
              correct_answer: "A. Corrected version",
              pro_tip: `Look for grammar errors in the sentence related to ${topicName}.`,
              options: ["A. Corrected version", "B. Incorrect version 2", "C. Incorrect version 3", "D. No error"]
            }
          ];
      }
      
      setTopic(mockData);
      setQuestions(mockData.questions);
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
            className="retry-button bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            <span className="material-icons mr-1" style={{fontSize: '16px'}}>refresh</span>
            Try Again
          </button>
          <button 
            onClick={handleBackToTopics} 
            className="back-button flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors text-blue-700 font-medium"
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
  
  // Show CSP info banner if applicable
  const isCspIssue = apiStatus === 'csp-blocked';

  // Get current topic name
  const topicName = topic?.topicName || topicNames[parseInt(topicId, 10) - 1] || 'Grammar Topic';
  
  return (
    <div className="learn-topics-container">
      <header className="topics-header">
        <button 
          onClick={handleBackToTopics}
          className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors text-blue-700 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Learn
        </button>
        <h1 className="topic-title">{topicName}</h1>
      </header>
      
      {isCspIssue && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="material-icons text-amber-500">info</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>Using sample data due to browser security restrictions.</strong>
              </p>
              <p className="text-sm mt-1 text-amber-600">
                Your browser's security settings (Content Security Policy) prevented access to the API. 
                Sample questions are being displayed instead.
              </p>
            </div>
          </div>
        </div>
      )}
      
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
