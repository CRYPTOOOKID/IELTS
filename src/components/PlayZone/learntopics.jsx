import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../../config';

// Progress tracker component
const ProgressTracker = ({ currentQuestion, totalQuestions }) => {
  const progressPercentage = Math.round((currentQuestion / totalQuestions) * 100);
  
  return (
    <div className="progress-tracker">
      <div className="progress-text">
        {currentQuestion} of {totalQuestions}
      </div>
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
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
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              selectedOption === option 
                ? (feedback?.isCorrect ? 'correct-selected' : 'incorrect-selected') 
                : ''
            } ${
              feedback && option === question.correct_answer && selectedOption !== option
                ? 'correct'
                : ''
            }`}
            onClick={() => handleOptionClick(option)}
            disabled={feedback !== null}
          >
            {option}
          </button>
        ))}
      </div>
    );
  };
  
  const renderFillInTheBlank = () => {
    return (
      <form onSubmit={handleTextSubmit} className="fill-in-blank-container">
        <div className="input-container">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your answer here..."
            className={`text-input ${
              feedback
                ? feedback.isCorrect
                  ? 'correct-input'
                  : 'incorrect-input'
                : ''
            }`}
            disabled={feedback !== null}
          />
          <button
            type="submit"
            className="submit-button"
            disabled={textInput.trim() === '' || feedback !== null}
          >
            Submit
          </button>
        </div>
        
        {feedback && !feedback.isCorrect && (
          <div className="correct-answer-display">
            Correct answer: <span className="correct-answer">{feedback.correctAnswer}</span>
          </div>
        )}
      </form>
    );
  };

  const renderErrorCorrection = () => {
    return (
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              selectedOption === option 
                ? (feedback?.isCorrect ? 'correct-selected' : 'incorrect-selected') 
                : ''
            } ${
              feedback && option === question.correct_answer && selectedOption !== option
                ? 'correct'
                : ''
            }`}
            onClick={() => handleOptionClick(option)}
            disabled={feedback !== null}
          >
            {option}
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="question-container">
      <h2 className="question-text">{question.question}</h2>
      
      {isMultipleChoice && renderMultipleChoice()}
      {isFillInTheBlank && renderFillInTheBlank()}
      {isErrorCorrection && renderErrorCorrection()}
      
      {showProTip && (
        <div className={`pro-tip ${feedback?.isCorrect ? 'correct-tip' : 'incorrect-tip'}`}>
          <div className="pro-tip-header">
            <span className="material-icons">
              {feedback?.isCorrect ? 'check_circle' : 'error'}
            </span>
            <h3>Pro Tip</h3>
          </div>
          <p>{question.pro_tip}</p>
        </div>
      )}
      
      <div className="navigation-buttons">
        <button
          className="nav-button prev-button"
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
        >
          <span className="material-icons">arrow_back</span>
          Previous
        </button>
        
        <ProgressTracker
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
        />
        
        <button
          className="nav-button next-button"
          onClick={onNext}
          disabled={!feedback}
        >
          {currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next'}
          <span className="material-icons">arrow_forward</span>
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
  
  if (percentage >= 90) {
    message = 'Excellent! You\'ve mastered this topic.';
    color = 'text-green-600';
  } else if (percentage >= 70) {
    message = 'Good job! You\'re on the right track.';
    color = 'text-blue-600';
  } else if (percentage >= 50) {
    message = 'Not bad, but there\'s room for improvement.';
    color = 'text-yellow-600';
  } else {
    message = 'You might need to review this topic again.';
    color = 'text-red-600';
  }
  
  return (
    <div className="quiz-summary">
      <h2 className="summary-title">Quiz Completed</h2>
      <h3 className="topic-name">{topicName}</h3>
      
      <div className="score-display">
        <div className="score-circle">
          <div className="score-percentage">{percentage}%</div>
          <div className="score-text">
            {score} out of {totalQuestions} correct
          </div>
        </div>
      </div>
      
      <p className={`feedback-message ${color}`}>{message}</p>
      
      <div className="summary-buttons">
        <button className="summary-button retry" onClick={onRetry}>
          <span className="material-icons">refresh</span>
          Try Again
        </button>
        <button className="summary-button home" onClick={onBackToTopics}>
          <span className="material-icons">home</span>
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
  
  // Fetch questions for the selected topic
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        const id = parseInt(topicId, 10);
        if (isNaN(id) || id < 1 || id > 21) {
          throw new Error('Invalid topic ID');
        }
        
        // Use embedded data for topic ID 1
        if (id === 1 && topicDataMap["1"]) {
          console.log('Using embedded data for topic ID 1');
          setTopic(topicDataMap["1"]);
          setQuestions(topicDataMap["1"].questions);
          setLoading(false);
          return;
        }
        
        // For other topics, use the API with CORS handling
        if (config.features.allowDirectApiCalls) {
          try {
            // Try direct API call
            const response = await fetch(`${config.apiBaseUrl}/id/${id}`);
            if (!response.ok) {
              throw new Error('Failed to fetch topic data');
            }
            
            const data = await response.json();
            setTopic(data);
            setQuestions(data.questions);
          } catch (apiError) {
            console.warn('API request failed:', apiError);
            
            // Use mock data as fallback
            useMockData(id);
          }
        } else {
          // Use mock data
          useMockData(id);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    // Helper function to use mock data
    const useMockData = (id) => {
      // For other topics, create a generic mock with a few sample questions
      const topicName = topicNames[id-1] || "Grammar Topic";
      const mockData = {
        topicId: id,
        topicName: topicName,
        questions: [
          {
            options: ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
            correct_answer: "A) Option 1",
            pro_tip: "This is a sample question for " + topicName + ". In a real environment, this would be fetched from the API.",
            type: "multiple_choice",
            question: "Sample question 1 for " + topicName + "?"
          },
          {
            options: ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
            correct_answer: "B) Option 2",
            pro_tip: "This is another sample question for " + topicName + ". The real data would have topic-specific content.",
            type: "multiple_choice",
            question: "Sample question 2 for " + topicName + "?"
          },
          {
            correct_answer: "answer",
            pro_tip: "This is a fill-in-the-blank sample for " + topicName + ".",
            type: "fill_in_the_blank",
            question: "Sample _____ (word) question for " + topicName + "."
          }
        ]
      };
      setTopic(mockData);
      setQuestions(mockData.questions);
    };
    
    if (topicId) {
      fetchTopic();
    }
  }, [topicId, topicNames]);
  
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
        <p>{error}</p>
        <button onClick={handleBackToTopics} className="back-button">
          Back to Topics
        </button>
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
          className="back-button"
        >
          <span className="material-icons">arrow_back</span>
          Back to Topics
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
