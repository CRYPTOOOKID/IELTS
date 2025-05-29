import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

// Available topics for the Action game
const availableTopics = [
  {
    id: 'at_home_activities',
    title: 'At Home Activities',
    description: 'Learn verbs related to daily activities around the house',
    icon: 'home',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'classroom_actions',
    title: 'Classroom Actions',
    description: 'Practice verbs commonly used in educational settings',
    icon: 'school',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'communication',
    title: 'Communication',
    description: 'Master verbs related to speaking and communication',
    icon: 'chat',
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'daily_morning_routine',
    title: 'Daily Morning Routine',
    description: 'Learn action words for morning activities',
    icon: 'wb_sunny',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'evening_activities',
    title: 'Evening Activities',
    description: 'Practice verbs for evening and night routines',
    icon: 'nights_stay',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'health_and_body_care',
    title: 'Health and Body Care',
    description: 'Understand verbs related to health and personal care',
    icon: 'health_and_safety',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'hobbies_and_free_time',
    title: 'Hobbies and Free Time',
    description: 'Explore action words for leisure activities',
    icon: 'sports_tennis',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'in_the_kitchen',
    title: 'In the Kitchen',
    description: 'Learn cooking and kitchen-related action verbs',
    icon: 'kitchen',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'playing_and_sports',
    title: 'Playing and Sports',
    description: 'Master sports and recreational activity verbs',
    icon: 'sports_soccer',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'shopping_and_errands',
    title: 'Shopping and Errands',
    description: 'Practice verbs for shopping and daily errands',
    icon: 'shopping_cart',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    id: 'travel_and_transport',
    title: 'Travel and Transport',
    description: 'Learn action words related to travel and transportation',
    icon: 'airplanemode_active',
    color: 'from-sky-500 to-blue-500'
  },
  {
    id: 'using_technology',
    title: 'Using Technology',
    description: 'Understand verbs for technology and digital activities',
    icon: 'computer',
    color: 'from-slate-500 to-gray-600'
  },
  {
    id: 'weather_and_seasons_actions',
    title: 'Weather and Seasons Actions',
    description: 'Explore verbs related to weather and seasonal activities',
    icon: 'wb_cloudy',
    color: 'from-blue-400 to-sky-500'
  },
  {
    id: 'weekend_activities',
    title: 'Weekend Activities',
    description: 'Practice action words for weekend fun and relaxation',
    icon: 'weekend',
    color: 'from-violet-500 to-purple-500'
  }
];

// API Service
const fetchTopicQuestions = async (topicName) => {
  try {
    const response = await fetch(`https://llf5fa83b8.execute-api.us-east-1.amazonaws.com/prod/lesson/${topicName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${topicName} questions`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// Topic Selection Screen Component
const TopicSelectionScreen = ({ onTopicSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center"
  >
    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mb-8 shadow-xl">
      <span className="material-icons text-white text-4xl">category</span>
    </div>
    
    <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-6">
      Action Game
    </h1>
    
    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
      Choose a topic to practice action verbs. Look at images and select the correct verb to complete sentences!
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {availableTopics.map((topic, index) => (
        <motion.div
          key={topic.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTopicSelect(topic)}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
        >
          <div className={`h-3 bg-gradient-to-r ${topic.color}`}></div>
          <div className="p-6">
            <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${topic.color} rounded-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <span className="material-icons text-white text-xl">{topic.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{topic.title}</h3>
            <p className="text-gray-600 text-sm">{topic.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Loading Screen Component
const LoadingScreen = ({ topicTitle }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center"
  >
    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mb-8 shadow-xl">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4">
      Loading {topicTitle}
    </h2>
    
    <p className="text-xl text-gray-600">
      Preparing your action verb practice session...
    </p>
  </motion.div>
);

// Start Screen Component
const StartScreen = ({ selectedTopic, onStartGame, onBackToTopics }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center"
  >
    <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${selectedTopic.color} rounded-full mb-8 shadow-xl`}>
      <span className="material-icons text-white text-4xl">{selectedTopic.icon}</span>
    </div>
    
    <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4">
      {selectedTopic.title}
    </h1>
    
    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
      {selectedTopic.description}
    </p>
    
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStartGame}
        className={`bg-gradient-to-r ${selectedTopic.color} text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        Start Game
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBackToTopics}
        className="bg-gray-100 text-gray-700 text-xl font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-200 transition-all duration-300"
      >
        Choose Different Topic
      </motion.button>
    </div>
  </motion.div>
);

// Question Card Component
const QuestionCard = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  selectedAnswer, 
  onAnswerSelect, 
  onNext, 
  onFinish, 
  isAnswered,
  isCorrect 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto"
    >
      {/* Progress Bar */}
      <div className="bg-gray-100 h-2">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full transition-all duration-500"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>
      
      {/* Question Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-emerald-600 font-semibold text-lg">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < questionNumber - 1 ? 'bg-emerald-500' : 
                  i === questionNumber - 1 ? 'bg-cyan-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Image and Question */}
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Image */}
          <div className="relative">
            <div className="w-48 h-48 bg-gray-100 rounded-xl overflow-hidden shadow-md">
              {!imageLoaded && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={question.imageUrl}
                alt={question.originalActivityText || "Action scene"}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </div>
          </div>
          
          {/* Question Text */}
          <div className="flex-1 text-center md:text-left">
            <div className="text-2xl font-semibold text-gray-800 mb-6">
              {question.questionTextPrefix}{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-transparent bg-clip-text font-bold">
                _____
              </span>{' '}
              {question.questionTextSuffix}
            </div>
            
            {/* Answer Options */}
            <div className="grid gap-3">
              {question.options.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                  whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                  onClick={() => !isAnswered && onAnswerSelect(option)}
                  disabled={isAnswered}
                  className={`p-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    selectedAnswer === option
                      ? isAnswered
                        ? option === question.correctAnswerVerb
                          ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-700'
                          : 'bg-red-100 border-2 border-red-500 text-red-700'
                        : 'bg-cyan-100 border-2 border-cyan-500 text-cyan-700'
                      : isAnswered && option === question.correctAnswerVerb
                        ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-700'
                        : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                  } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
            
            {/* Feedback */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 rounded-xl ${
                    isCorrect 
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-icons">
                      {isCorrect ? 'check_circle' : 'cancel'}
                    </span>
                    <span className="font-semibold">
                      {isCorrect ? 'Correct!' : 'Incorrect!'}
                    </span>
                  </div>
                  {!isCorrect && (
                    <p className="mt-2 text-sm">
                      The correct answer is: <strong>{question.correctAnswerVerb}</strong>
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Next Button */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={questionNumber === totalQuestions ? onFinish : onNext}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {questionNumber === totalQuestions ? 'Finish Game' : 'Next Question'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Results Screen Component
const ResultsScreen = ({ score, totalQuestions, onPlayAgain, onBackToGames, onBackToTopics, selectedTopic, answers }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Outstanding! You're an action word expert! 🌟";
    if (percentage >= 70) return "Great job! You have a good understanding of verbs! 👏";
    if (percentage >= 50) return "Well done! Keep practicing to improve further! 💪";
    return "Good effort! Practice makes perfect! 🎯";
  };

  const getStars = () => {
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-2xl mx-auto"
    >
      {percentage >= 70 && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}
      
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            {Array.from({ length: getStars() }, (_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                className="text-yellow-400 text-4xl"
              >
                ⭐
              </motion.span>
            ))}
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            {selectedTopic.title} Complete!
          </h2>
          
          <div className="text-6xl font-bold text-emerald-600 mb-4">
            {score}<span className="text-3xl text-gray-500">/{totalQuestions}</span>
          </div>
          
          <div className="text-2xl font-semibold text-gray-600 mb-4">
            {percentage}% Correct
          </div>
          
          <p className="text-lg text-gray-600 mb-6">
            {getPerformanceMessage()}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayAgain}
            className={`bg-gradient-to-r ${selectedTopic.color} text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            Play Again
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToTopics}
            className="bg-blue-100 text-blue-700 font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-200 transition-all duration-300"
          >
            Choose Topic
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToGames}
            className="bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-200 transition-all duration-300"
          >
            Back to Games
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Error Screen Component
const ErrorScreen = ({ error, onRetry, onBackToTopics }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center"
  >
    <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-8 shadow-xl">
      <span className="material-icons text-red-600 text-4xl">error</span>
    </div>
    
    <h2 className="text-4xl font-bold text-red-600 mb-4">
      Oops! Something went wrong
    </h2>
    
    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
      {error?.message || 'Failed to load the questions. Please try again.'}
    </p>
    
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="bg-red-500 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Try Again
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBackToTopics}
        className="bg-gray-100 text-gray-700 text-xl font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-200 transition-all duration-300"
      >
        Choose Different Topic
      </motion.button>
    </div>
  </motion.div>
);

// Main Action Game Component
const Action = ({ onBackToGames }) => {
  const [gameState, setGameState] = useState('topics'); // 'topics', 'loading', 'start', 'playing', 'results', 'error'
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  const handleTopicSelect = async (topic) => {
    setSelectedTopic(topic);
    setGameState('loading');
    setError(null);

    try {
      const fetchedQuestions = await fetchTopicQuestions(topic.id);
      // Shuffle questions for replayability
      const shuffledQuestions = [...fetchedQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
      setGameState('start');
    } catch (err) {
      setError(err);
      setGameState('error');
    }
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setAnswers([]);
  };

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswerVerb;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setAnswers(prev => [...prev, {
      question: currentQuestion,
      selectedAnswer: answer,
      isCorrect
    }]);
  };

  const handleNext = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleFinish = () => {
    setGameState('results');
  };

  const handlePlayAgain = () => {
    setGameState('start');
  };

  const handleBackToTopics = () => {
    setGameState('topics');
    setSelectedTopic(null);
    setQuestions([]);
    setError(null);
  };

  const handleRetry = () => {
    if (selectedTopic) {
      handleTopicSelect(selectedTopic);
    } else {
      handleBackToTopics();
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswerVerb;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToGames}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <span className="material-icons">arrow_back</span>
            <span className="font-medium">Back to Games</span>
          </motion.button>
          
          {gameState === 'playing' && (
            <div className="text-emerald-600 font-semibold">
              Score: {score}/{questions.length}
            </div>
          )}
        </div>
      </div>

      {/* Game Content */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {gameState === 'topics' && (
            <TopicSelectionScreen key="topics" onTopicSelect={handleTopicSelect} />
          )}
          
          {gameState === 'loading' && selectedTopic && (
            <LoadingScreen key="loading" topicTitle={selectedTopic.title} />
          )}
          
          {gameState === 'error' && (
            <ErrorScreen key="error" error={error} onRetry={handleRetry} onBackToTopics={handleBackToTopics} />
          )}
          
          {gameState === 'start' && selectedTopic && (
            <StartScreen 
              key="start" 
              selectedTopic={selectedTopic}
              onStartGame={startGame} 
              onBackToTopics={handleBackToTopics}
            />
          )}
          
          {gameState === 'playing' && currentQuestion && (
            <QuestionCard
              key={currentQuestionIndex}
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={handleAnswerSelect}
              onNext={handleNext}
              onFinish={handleFinish}
              isAnswered={isAnswered}
              isCorrect={isCorrect}
            />
          )}
          
          {gameState === 'results' && selectedTopic && (
            <ResultsScreen
              key="results"
              score={score}
              totalQuestions={questions.length}
              onPlayAgain={handlePlayAgain}
              onBackToGames={onBackToGames}
              onBackToTopics={handleBackToTopics}
              selectedTopic={selectedTopic}
              answers={answers}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Action; 