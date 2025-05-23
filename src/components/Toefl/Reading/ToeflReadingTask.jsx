import React, { useState } from 'react';
import { useToeflReadingContext } from './ToeflReadingContext';
import { Button } from '../../ui/button';
import './ToeflReading.css';

const ToeflReadingTask = () => {
  const {
    passages,
    currentPassage,
    currentQuestion,
    userAnswers,
    timeRemaining,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    finishTest,
    formatTime,
    navigateToQuestion
  } = useToeflReadingContext();

  const [showReview, setShowReview] = useState(false);
  const [selectedStatements, setSelectedStatements] = useState({});

  if (!passages || passages.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-message">Loading reading passages...</p>
      </div>
    );
  }

  const passage = passages[currentPassage];
  const question = passage?.questions?.[currentQuestion];
  
  if (!passage || !question) {
    return (
      <div className="error-container">
        <p className="error-message">Error loading passage or question.</p>
        <Button onClick={finishTest}>Finish Test</Button>
      </div>
    );
  }

  const handleAnswerSelect = (optionIndex) => {
    if (question.type === 'PROSE_SUMMARY') {
      // Handle multiple selection for prose summary
      const currentAnswers = userAnswers[question.id] || [];
      let newAnswers;
      
      if (currentAnswers.includes(optionIndex)) {
        newAnswers = currentAnswers.filter(index => index !== optionIndex);
      } else if (currentAnswers.length < 3) {
        newAnswers = [...currentAnswers, optionIndex];
      } else {
        return; // Already have 3 selections
      }
      
      submitAnswer(question.id, newAnswers);
    } else {
      submitAnswer(question.id, optionIndex);
    }
  };

  const handleTableAnswer = (statementIndex, categoryIndex) => {
    const currentAnswers = userAnswers[question.id] || {};
    submitAnswer(question.id, {
      ...currentAnswers,
      [statementIndex]: categoryIndex
    });
  };

  const isLastQuestion = () => {
    return currentPassage === passages.length - 1 && 
           currentQuestion === passage.questions.length - 1;
  };

  const canGoNext = () => {
    return currentQuestion < passage.questions.length - 1 || 
           currentPassage < passages.length - 1;
  };

  const canGoPrevious = () => {
    return currentQuestion > 0 || currentPassage > 0;
  };

  const getTimerClass = () => {
    if (timeRemaining <= 300) return 'critical'; // 5 minutes
    if (timeRemaining <= 600) return 'warning';  // 10 minutes
    return '';
  };

  const getTotalQuestionNumber = () => {
    let total = 0;
    for (let i = 0; i < currentPassage; i++) {
      total += passages[i].questions.length;
    }
    return total + currentQuestion + 1;
  };

  const getTotalQuestions = () => {
    return passages.reduce((total, p) => total + p.questions.length, 0);
  };

  const renderPassageText = () => {
    let text = passage.text;
    
    // Remove the highlighted sentence markers from display
    text = text.replace(/\*\*HIGHLIGHTED_SENTENCE_START\*\*/g, '');
    text = text.replace(/\*\*HIGHLIGHTED_SENTENCE_END\*\*/g, '');
    
    // Handle sentence highlighting for SENTENCE_SIMPLIFICATION questions
    if (question.type === 'SENTENCE_SIMPLIFICATION' && question.sentenceToHighlight) {
      const highlightedSentence = question.sentenceToHighlight;
      text = text.replace(
        highlightedSentence,
        `<mark class="highlighted-sentence">${highlightedSentence}</mark>`
      );
    }
    
    // Handle insertion points for INSERT_TEXT questions - show numbered positions
    if (question.type === 'INSERT_TEXT') {
      // Replace [1], [2], [3], [4] with numbered insertion points
      text = text.replace(/\[1\]/g, '<span class="insertion-point" data-point="1">■1</span>');
      text = text.replace(/\[2\]/g, '<span class="insertion-point" data-point="2">■2</span>');
      text = text.replace(/\[3\]/g, '<span class="insertion-point" data-point="3">■3</span>');
      text = text.replace(/\[4\]/g, '<span class="insertion-point" data-point="4">■4</span>');
    } else {
      // For other question types, just remove the insertion markers
      text = text.replace(/\[\d+\]/g, '');
    }
    
    return text.split('\n').map((paragraph, index) => (
      <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
    ));
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'SENTENCE_SIMPLIFICATION':
        return (
          <div className="question-content">
            <div className="question-text">
              <div className="highlighted-sentence-notice">
                The highlighted sentence below appears in the passage:
              </div>
              <div className="highlighted-sentence-display">
                {question.sentenceToHighlight}
              </div>
              <div className="question-instruction">
                Which of the following best expresses the essential information of the highlighted sentence?
              </div>
            </div>
            {renderStandardOptions()}
          </div>
        );

      case 'INSERT_TEXT':
        return (
          <div className="question-content">
            <div className="question-text">
              <div className="insert-instruction">
                Look at the four squares [■] in the passage that indicate where the following sentence could be added:
              </div>
              <div className="sentence-to-insert">
                {question.sentenceToInsert}
              </div>
              <div className="question-instruction">
                Where would the sentence best fit?
              </div>
            </div>
            {renderInsertTextOptions()}
          </div>
        );

      case 'FILL_IN_A_TABLE':
        return (
          <div className="question-content">
            <div className="question-text">{question.question}</div>
            {renderTableQuestion()}
          </div>
        );

      case 'PROSE_SUMMARY':
        return (
          <div className="question-content">
            <div className="question-text">
              {question.question}
            </div>
            <div className="prose-summary-instruction">
              Select THREE answer choices that express the most important ideas in the passage.
            </div>
            {renderProseSummaryOptions()}
          </div>
        );

      case 'VOCABULARY':
        return (
          <div className="question-content">
            <div className="question-text">
              The word "<strong>{question.targetWord}</strong>" in paragraph {question.paragraphReference} is closest in meaning to:
            </div>
            {renderStandardOptions()}
          </div>
        );

      default:
        return (
          <div className="question-content">
            <div className="question-text">{question.question}</div>
            {renderStandardOptions()}
          </div>
        );
    }
  };

  const renderStandardOptions = () => (
    <div className="answer-options">
      {question.options && question.options.length > 0 ? (
        question.options.map((option, index) => (
          <label
            key={index}
            className={`answer-option ${userAnswers[question.id] === index ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={index}
              checked={userAnswers[question.id] === index}
              onChange={() => handleAnswerSelect(index)}
            />
            <span className="answer-option-text">
              {String.fromCharCode(65 + index)}. {option || 'Option text missing'}
            </span>
          </label>
        ))
      ) : (
        <div className="error-message">No options available for this question.</div>
      )}
    </div>
  );

  const renderInsertTextOptions = () => (
    <div className="answer-options">
      {question.options && question.options.length > 0 ? (
        question.options.map((option, index) => (
          <label
            key={index}
            className={`answer-option insert-text-option ${userAnswers[question.id] === index ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={index}
              checked={userAnswers[question.id] === index}
              onChange={() => handleAnswerSelect(index)}
            />
            <span className="answer-option-text">
              <span className="insertion-position">Position {index + 1}</span>
              <span className="insertion-description">■{index + 1}</span>
            </span>
          </label>
        ))
      ) : (
        // Default to 4 positions if no options provided
        [1, 2, 3, 4].map((position) => (
          <label
            key={position - 1}
            className={`answer-option insert-text-option ${userAnswers[question.id] === (position - 1) ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={position - 1}
              checked={userAnswers[question.id] === (position - 1)}
              onChange={() => handleAnswerSelect(position - 1)}
            />
            <span className="answer-option-text">
              <span className="insertion-position">Position {position}</span>
              <span className="insertion-description">■{position}</span>
            </span>
          </label>
        ))
      )}
    </div>
  );

  // Helper function to process text with **bold** markers
  const processTextWithBold = (text) => {
    if (!text) return text;
    
    // Split text by **markers and process each part
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove the ** markers and wrap in a styled span
        const boldText = part.slice(2, -2);
        return (
          <span key={index} className="prose-summary-bold-text">
            {boldText}
          </span>
        );
      }
      return part;
    });
  };

  const renderProseSummaryOptions = () => {
    const currentAnswers = userAnswers[question.id] || [];
    
    if (!question.options || question.options.length === 0) {
      return <div className="error-message">No summary options available.</div>;
    }
    
    return (
      <div className="prose-summary-options">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`prose-summary-option ${currentAnswers.includes(index) ? 'selected' : ''} ${currentAnswers.length >= 3 && !currentAnswers.includes(index) ? 'disabled' : ''}`}
          >
            <input
              type="checkbox"
              checked={currentAnswers.includes(index)}
              onChange={() => handleAnswerSelect(index)}
              disabled={currentAnswers.length >= 3 && !currentAnswers.includes(index)}
            />
            <span className="option-text">
              {String.fromCharCode(65 + index)}. {processTextWithBold(option) || 'Option text missing'}
            </span>
          </label>
        ))}
        <div className="selection-counter">
          Selected: {currentAnswers.length} / 3
        </div>
      </div>
    );
  };

  const renderTableQuestion = () => {
    const currentAnswers = userAnswers[question.id] || {};
    
    if (!question.tableCategories || question.tableCategories.length === 0) {
      return <div className="error-message">No table categories available.</div>;
    }
    
    if (!question.statementsToCategorize || question.statementsToCategorize.length === 0) {
      return <div className="error-message">No statements to categorize available.</div>;
    }
    
    return (
      <div className="table-question">
        <div className="table-categories">
          {question.tableCategories.map((category, index) => (
            <div key={index} className="table-category">
              <h4>{category || `Category ${index + 1}`}</h4>
              <div className="category-items">
                {question.statementsToCategorize
                  .map((statement, stmtIndex) => 
                    currentAnswers[stmtIndex] === index ? (statement.statement || 'Statement text missing') : null
                  )
                  .filter(item => item !== null)
                  .map((item, itemIndex) => (
                    <div key={itemIndex} className="category-item">{item}</div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
        
        <div className="statements-to-categorize">
          <h4>Assign statements to appropriate categories: <span className="instruction-hint">(Click on the category)</span></h4>
          {question.statementsToCategorize.map((statement, index) => (
            <div key={index} className="statement-item">
              <div className="statement-text">{statement.statement || `Statement ${index + 1} text missing`}</div>
              <div className="category-buttons">
                {question.tableCategories.map((category, catIndex) => (
                  <button
                    key={catIndex}
                    className={`category-btn ${currentAnswers[index] === catIndex ? 'selected' : ''}`}
                    onClick={() => handleTableAnswer(index, catIndex)}
                  >
                    {category || `Category ${catIndex + 1}`}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="reading-task-container">
      {/* Questions Panel - Now on the LEFT */}
      <div className="questions-panel">
        <div className="question-header">
          <div className="question-info">
            <div className="question-number">
              Question {getTotalQuestionNumber()}
            </div>
            <div className="question-progress">
              {getTotalQuestionNumber()} of {getTotalQuestions()}
            </div>
            <div className="question-type-badge">
              {question.type.replace(/_/g, ' ')}
            </div>
          </div>
          <div className={`timer-display ${getTimerClass()}`}>
            {formatTime(timeRemaining)}
          </div>
        </div>

        {renderQuestionContent()}

        <div className="navigation-buttons">
          <Button
            className="nav-button prev-button"
            onClick={previousQuestion}
            disabled={!canGoPrevious()}
          >
            <span className="material-icons mr-1">arrow_back</span>
            Previous
          </Button>

          <Button
            className="nav-button"
            onClick={() => setShowReview(!showReview)}
            variant="outline"
          >
            <span className="material-icons mr-1">rate_review</span>
            Review
          </Button>

          {isLastQuestion() ? (
            <Button
              className="nav-button finish-button"
              onClick={finishTest}
            >
              <span className="material-icons mr-1">check_circle</span>
              Finish Test
            </Button>
          ) : (
            <Button
              className="nav-button next-button"
              onClick={nextQuestion}
              disabled={!canGoNext()}
            >
              Next
              <span className="material-icons ml-1">arrow_forward</span>
            </Button>
          )}
        </div>
      </div>

      {/* Passage Panel - Now on the RIGHT */}
      <div className="passage-panel">
        <h2 className="passage-title">{passage.title}</h2>
        <div className="passage-text">
          {renderPassageText()}
        </div>
      </div>

      {/* Review Panel */}
      <div className={`review-panel ${showReview ? 'open' : ''}`}>
        <div className="review-header">
          <h3 className="review-title">Review</h3>
          <button
            className="close-review"
            onClick={() => setShowReview(false)}
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="review-questions">
          {passages.map((passage, passageIndex) => 
            passage.questions.map((q, questionIndex) => {
              const globalQuestionNumber = passages
                .slice(0, passageIndex)
                .reduce((total, p) => total + p.questions.length, 0) + questionIndex + 1;
              
              const isCurrent = passageIndex === currentPassage && questionIndex === currentQuestion;
              const isAnswered = userAnswers[q.id] !== undefined;
              
              return (
                <div
                  key={q.id}
                  className={`review-question-item ${
                    isCurrent ? 'current' : isAnswered ? 'answered' : 'unanswered'
                  }`}
                  onClick={() => navigateToQuestion(passageIndex, questionIndex)}
                >
                  {globalQuestionNumber}
                </div>
              );
            })
          )}
        </div>

        <div className="review-summary">
          <p className="text-sm text-gray-600">
            Answered: {Object.keys(userAnswers).length} / {getTotalQuestions()}
          </p>
          <p className="text-sm text-gray-600">
            Time Remaining: {formatTime(timeRemaining)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToeflReadingTask; 