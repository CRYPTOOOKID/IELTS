import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

// Add CSS for the cup animation
const cupCSS = `
  @keyframes liquid-fill {
    0% { height: 0%; }
    100% { height: var(--fill-level); }
  }
  
  @keyframes cup-shine {
    0% { opacity: 0.4; transform: translateX(-100%); }
    100% { opacity: 0; transform: translateX(100%); }
  }
`;

const questions = [
  {
    id: 1,
    text: "I like pizza ______ I don't like mushrooms.",
    choices: ["but", "because", "when", "then"],
    answer: "but"
  },
  {
    id: 2,
    text: "______ it rains, we will stay inside.",
    choices: ["If", "and", "or", "yet"],
    answer: "If"
  },
  {
    id: 3,
    text: "She studied hard ______ she passed the test.",
    choices: ["so", "although", "while", "unless"],
    answer: "so"
  },
  {
    id: 4,
    text: "We went to the park ______ played on the swings.",
    choices: ["and", "because", "before", "yet"],
    answer: "and"
  },
  {
    id: 5,
    text: "______ I finish my homework, I can watch TV.",
    choices: ["After", "But", "So", "Unless"],
    answer: "After"
  },
  {
    id: 6,
    text: "He was tired ______ he went to bed early.",
    choices: ["because", "or", "and", "unless"],
    answer: "because"
  },
  {
    id: 7,
    text: "I want to go swimming ______ the pool is closed.",
    choices: ["but", "when", "if", "therefore"],
    answer: "but"
  },
  {
    id: 8,
    text: "______ the bell rings, it's time for lunch.",
    choices: ["When", "So", "And", "Unless"],
    answer: "When"
  },
  {
    id: 9,
    text: "We can eat pizza ______ we can eat hamburgers.",
    choices: ["or", "because", "although", "hence"],
    answer: "or"
  },
  {
    id: 10,
    text: "______ she was sick, she went to school.",
    choices: ["Although", "So", "And", "Hence"],
    answer: "Although"
  },
  {
    id: 11,
    text: "I ate a sandwich, ______ I was still hungry.",
    choices: ["yet", "when", "after", "since"],
    answer: "yet"
  },
  {
    id: 12,
    text: "______ you finish your vegetables you may have dessert.",
    choices: ["If", "so", "but", "hence"],
    answer: "If"
  },
  {
    id: 13,
    text: "The sun was shining brightly, ______ the wind was cold.",
    choices: ["yet", "when", "because", "therefore"],
    answer: "yet"
  },
  {
    id: 14,
    text: "______ he practice he will improve.",
    choices: ["If", "but", "or", "hence"],
    answer: "If"
  },
  {
    id: 15,
    text: "I read a book ______ I went to bed.",
    choices: ["and", "when", "If", "hence"],
    answer: "and"
  }
];

// Score Cup Component
const ScoreCup = ({ score, totalQuestions, isGlowing = false }) => {
  const fillPercentage = Math.min(100, (score / totalQuestions) * 100);
  
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-14 h-16 mb-1">
        {/* Cup body */}
        <div className="absolute inset-0 rounded-b-full rounded-t-lg bg-gradient-to-r from-purple-200 to-indigo-200 overflow-hidden shadow-md border border-purple-300">
          {/* Cup shine effect */}
          <div className="absolute inset-0 bg-white opacity-0 animate-[cup-shine_2s_ease-in-out_infinite] z-10"></div>
          
          {/* Cup liquid */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-indigo-500 animate-[liquid-fill_1s_ease-out_forwards]"
            style={{
              '--fill-level': `${fillPercentage}%`,
              height: `${fillPercentage}%`,
              transition: 'height 0.5s ease-out'
            }}
          >
            {/* Liquid top shine */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-20"></div>
          </div>
        </div>

        {/* Cup handle */}
        <div className="absolute right-0 top-3 w-3 h-8 border-r-2 border-t-2 border-b-2 rounded-r-full border-purple-300 transform translate-x-1"></div>
        
        {/* Glow effect */}
        <div 
          className={`absolute inset-0 rounded-b-full rounded-t-lg bg-purple-400 filter blur-md -z-10 transition-opacity duration-300 ${
            isGlowing ? 'opacity-50' : 'opacity-0'
          }`}
        ></div>
      </div>
      
      {/* Score text */}
      <div className="font-bold text-lg text-purple-700 relative">
        {score}/{totalQuestions}
        {/* Score text glow */}
        <div 
          className={`absolute inset-0 text-purple-500 filter blur-sm transition-opacity duration-300 ${
            isGlowing ? 'opacity-75' : 'opacity-0'
          }`}
        >
          {score}/{totalQuestions}
        </div>
      </div>
    </div>
  );
};

const ScoreAnimation = ({ score, position }) => (
  <motion.div
    initial={{ opacity: 0, y: 0, scale: 0.5 }}
    animate={{
      opacity: [0, 1, 1, 0],
      y: -50,
      scale: [0.5, 1.2, 1, 0.8]
    }}
    transition={{
      duration: 0.8,
      times: [0, 0.2, 0.8, 1],
      ease: "easeOut"
    }}
    className={`fixed ${
      score > 0 ? 'text-green-600' : 'text-red-600'
    } font-bold text-2xl z-[9999] pointer-events-none`}
    style={{
      left: `${position.x}px`,
      top: `${position.y}px`,
      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}
  >
    {score > 0 ? '+1' : '-1'}
  </motion.div>
);

const ResultScreen = ({ score, totalQuestions, onRetry, highScore }) => {
  const percentage = Math.round(((score / totalQuestions) * 100) * 10) / 10;
  const [showScore, setShowScore] = useState(false);
  const [showPercentage, setShowPercentage] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHighScore, setShowHighScore] = useState(false);
  const isNewHighScore = score > highScore || (highScore === 0 && score > 0);
  
  useEffect(() => {
    // Staggered animations
    setTimeout(() => setShowScore(true), 500);
    setTimeout(() => setShowPercentage(true), 1500);
    setTimeout(() => setShowFeedback(true), 2200);
    setTimeout(() => setShowHighScore(true), 2800);
  }, []);
  
  const getFeedback = () => {
    if (percentage === 100) return "Perfect Score! Outstanding!";
    if (percentage >= 80) return "Excellent Work!";
    if (percentage >= 60) return "Good Job!";
    if (percentage >= 40) return "Keep Practicing!";
    return "Don't Give Up!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      {isNewHighScore && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={percentage >= 60 ? 500 : 100}
          gravity={0.2}
        />
      )}
      
      <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8">
        Game Complete!
      </h2>
      
      {isNewHighScore && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: [0.8, 1.2, 1] }}
          transition={{ delay: 0.5, duration: 1 }}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold rounded-full px-4 py-1 shadow-lg mb-4 inline-block"
        >
          New High Score! 🏆
        </motion.div>
      )}
      
      <AnimatePresence>
        {showScore && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center gap-6 mb-8"
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 10 }}
              className="w-24 h-24"
            >
              <ScoreCup score={score} totalQuestions={totalQuestions} isGlowing={true} />
            </motion.div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 1] }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-7xl font-bold"
            >
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {score}
              </span>
              <span className="text-4xl text-gray-600">/{totalQuestions}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedback && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl text-gray-700 mb-8"
          >
            {getFeedback()}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPercentage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 mb-10"
          >
            <div className="h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className={`h-full ${
                  percentage >= 60 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500'
                }`}
                initial={{ width: "0%" }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className={`text-xl font-bold ${
                percentage >= 60 ? 'text-purple-600' : 'text-orange-600'
              }`}>
                {percentage}%
              </span>
              <span className="text-gray-600 text-lg"> Correct</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showHighScore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col items-center"
          >
            <div className="font-semibold text-gray-600 mb-1">High Score</div>
            <div className={`text-2xl font-bold ${isNewHighScore ? 'text-yellow-600' : 'text-purple-600'}`}>
              {Math.max(highScore, score)}/{totalQuestions}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <button
          onClick={onRetry}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg
            transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0"
        >
          Try Again
        </button>
      </motion.div>
    </motion.div>
  );
};

const Dragzilla = ({ onBackToGames }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [scoreAnimations, setScoreAnimations] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [animateScoreUpdate, setAnimateScoreUpdate] = useState(false);
  const [scoreCupGlow, setScoreCupGlow] = useState(false);
  const [highScore, setHighScore] = useState(0);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  // Load high score from localStorage on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('dragzilla-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);
  
  // Update high score when game is completed
  useEffect(() => {
    if (showResults && score > highScore) {
      setHighScore(score);
      localStorage.setItem('dragzilla-high-score', score.toString());
    }
  }, [showResults, score, highScore]);

  useEffect(() => {
    // Add the CSS for cup animations to the document
    const styleElement = document.createElement('style');
    styleElement.textContent = cupCSS;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    if (score > 0) {
      setAnimateScoreUpdate(true);
      const timer = setTimeout(() => setAnimateScoreUpdate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [score]);

  const handleDragStart = (event, choice) => {
    event.dataTransfer.setData("choice", choice);
    event.dataTransfer.effectAllowed = "move";
    
    // Set drag preview text with scale animation
    event.target.style.transform = 'scale(1.05)';
    event.target.style.opacity = "0.6";
    event.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    // Add dragging class to body for global cursor change
    document.body.classList.add('dragging');
    setIsDragging(true);
  };

  const handleDragEnd = (event) => {
    // Reset styles with transition
    event.target.style.transition = 'all 0.2s ease-out';
    event.target.style.transform = 'scale(1)';
    event.target.style.opacity = "1";
    event.target.style.boxShadow = 'none';

    // Clean up after transition
    setTimeout(() => {
      event.target.style.transition = '';
    }, 200);
    
    document.body.classList.remove('dragging');
    setIsDragging(false);
    
    // Remove dragover class from all drop zones with fade
    document.querySelectorAll('.droppable-area').forEach(zone => {
      zone.style.transition = 'all 0.2s ease-out';
      zone.classList.remove('dragover');
    });
  };

  const handleDrop = (event) => {
    if (hasAnswered) return;
    
    event.preventDefault();
    const choice = event.dataTransfer.getData("choice");
    const newAnswers = { ...answers };
    newAnswers[currentQuestionIndex] = choice;
    setAnswers(newAnswers);
    checkAnswer(choice);
    
    // Remove dragover class
    event.currentTarget.classList.remove('dragover');
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    
    // Only add dragover class if we haven't answered yet
    if (!hasAnswered) {
      event.currentTarget.classList.add('dragover');
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
  };

  const checkAnswer = (choice) => {
    const isCorrect = choice === currentQuestion.answer;
    setHasAnswered(true);
    
    // Create score animation
    const dropArea = document.querySelector('.droppable-area');
    if (dropArea) {
      const rect = dropArea.getBoundingClientRect();
      setScoreAnimations([{
        id: Date.now(),
        score: isCorrect ? 1 : -1,
        position: {
          x: rect.left + (rect.width / 2) - 10,
          y: rect.top - 10
        }
      }]);

      // Clear animation after it completes
      setTimeout(() => setScoreAnimations([]), 1000);
    }

    // Update score and show feedback
    if (isCorrect) {
      setScore(prev => prev + 1);
      setScoreCupGlow(true);
      setTimeout(() => setScoreCupGlow(false), 1000);
      setFeedbackMessage('Correct! 🎉');
    } else {
      setFeedbackMessage(`Incorrect! The correct answer is "${currentQuestion.answer}"`);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setHasAnswered(false);
      setShowFeedback(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setHasAnswered(false);
      setShowFeedback(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers({});
    setScoreAnimations([]);
    setShowResults(false);
    setHasAnswered(false);
    setShowFeedback(false);
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
        <button
          onClick={onBackToGames}
          className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors text-purple-700 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Games
        </button>
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full">
          <ResultScreen
            score={score}
            totalQuestions={questions.length}
            onRetry={handleRetry}
            highScore={highScore}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
      <button
        onClick={onBackToGames}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors text-purple-700 font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Games
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Dragzilla
            </h2>
            <p className="text-gray-600 mt-2">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {highScore > 0 && (
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-500 mb-1">High Score</div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1 text-yellow-700 font-bold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                  </svg>
                  {highScore}/{questions.length}
                </div>
              </div>
            )}
            <motion.div 
              className="flex items-center"
              animate={animateScoreUpdate ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <ScoreCup score={score} totalQuestions={questions.length} isGlowing={scoreCupGlow} />
            </motion.div>
          </div>
        </div>

        {/* Score Animations */}
        <AnimatePresence>
          {scoreAnimations.map(animation => (
            <ScoreAnimation
              key={animation.id}
              score={animation.score}
              position={animation.position}
            />
          ))}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500"
            initial={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Feedback Message */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-6 p-4 rounded-lg text-center font-medium ${
                feedbackMessage.includes('Correct')
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              {feedbackMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question */}
        <div className="bg-white border-2 border-purple-200 shadow-md rounded-lg p-6 mb-8">
          <div 
            className="text-lg flex items-center justify-center min-h-[100px]"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {currentQuestion.text.split(/_{2,}/).map((part, index, array) => (
              <React.Fragment key={index}>
                {part}
                {index < array.length - 1 && (
                  <span className={`${
                    answers[currentQuestionIndex] 
                      ? (answers[currentQuestionIndex] === currentQuestion.answer 
                          ? 'bg-green-200 text-green-800 border-green-300' 
                          : 'bg-red-200 text-red-800 border-red-300')
                      : 'bg-purple-100 text-purple-800 border-purple-300'
                  } px-4 py-2 rounded-md inline-block min-w-[100px] text-center mx-2 droppable-area
                  transition-all duration-200 ease-out border-2
                  ${!hasAnswered ? 'border-dashed hover:border-purple-400 hover:bg-purple-50' : ''}
                  ${isDragging && !hasAnswered ? 'shadow-lg border-purple-400 bg-purple-50 scale-105' : ''}`}>
                    {answers[currentQuestionIndex] || '______'}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Conjunction Choices */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl mb-6 shadow-inner">
          <motion.div
            className="flex flex-wrap gap-3 justify-center"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {currentQuestion.choices.map((choice, index) => (
              <motion.button
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                className={`${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                } ${hasAnswered ? 'opacity-50 cursor-not-allowed' : ''}
                bg-white text-purple-800 shadow-sm
                font-medium py-3 px-6 rounded-lg
                transition-all duration-200 ease-out transform
                border-2 border-transparent
                ${!hasAnswered ? 'hover:bg-purple-50 hover:shadow-md hover:-translate-y-1 hover:border-purple-200 active:translate-y-0' : ''}`}
                draggable={!hasAnswered}
                onDragStart={(e) => handleDragStart(e, choice)}
                onDragEnd={handleDragEnd}
              >
                {choice}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Navigation and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`${
                currentQuestionIndex === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-200'
              } bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-lg
                transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-1`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Previous
            </button>
            {hasAnswered && (
              <button
                onClick={handleNextQuestion}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg
                  transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-1"
              >
                {currentQuestionIndex === questions.length - 1 ? "Finish Game" : "Next Question"}
                {currentQuestionIndex !== questions.length - 1 && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}
            <button
              onClick={handleRetry}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-6 rounded-lg
                transition-colors duration-200 shadow-sm hover:shadow-md border border-indigo-200 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Retry
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dragzilla;