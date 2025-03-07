import React, { useState, useMemo } from 'react';
import { useReadingContext } from './ReadingContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';
import './reading.css';

// Component for rendering different question types
const QuestionRenderer = ({ questionSet }) => {
  // Get the question type, handling different property names that might come from the API
  const questionType = questionSet.questionType || questionSet.type || '';
  
  // Normalize the question type to handle variations in naming from the API
  const normalizedType = normalizeQuestionType(questionType);
  
  // Use the appropriate renderer based on normalized question type
  switch (normalizedType) {
    case 'TRUE_FALSE_NOT_GIVEN':
      return <TrueFalseNotGivenQuestion questionSet={questionSet} />;
    case 'SENTENCE_COMPLETION':
    case 'FILL_IN_THE_BLANKS':
    case 'GAP_FILL':
      // For all fill-in-the-blank type questions, use SentenceCompletionQuestion
      return <SentenceCompletionQuestion questionSet={questionSet} />;
    case 'MATCHING_HEADINGS':
      return <MatchingHeadingsQuestion questionSet={questionSet} />;
    case 'MULTIPLE_CHOICE':
      return <MultipleChoiceQuestion questionSet={questionSet} />;
    case 'PARAGRAPH_MATCHING':
    case 'MATCHING_INFORMATION':
      return <ParagraphMatchingQuestion questionSet={questionSet} />;
    case 'SHORT_ANSWER':
      return <ShortAnswerQuestion questionSet={questionSet} />;
    case 'IDENTIFYING_VIEWS_CLAIMS':
    case 'YES_NO_NOT_GIVEN':
      return <IdentifyingViewsClaimsQuestion questionSet={questionSet} />;
    default:
      console.warn(`Unknown question type: ${questionType}`);
      return (
        <div className="p-4 bg-yellow-50 rounded-md">
          <p>Question type "{questionType}" rendering not implemented yet.</p>
        </div>
      );
  }
};

// Helper function to normalize question types from different API formats
const normalizeQuestionType = (type) => {
  // Convert to uppercase for consistent comparison
  const upperType = (type || '').toUpperCase();
  
  // Map of alternative names to standardized types
  const typeMap = {
    'TFNG': 'TRUE_FALSE_NOT_GIVEN',
    'TF': 'TRUE_FALSE_NOT_GIVEN',
    'TRUE_FALSE': 'TRUE_FALSE_NOT_GIVEN',
    'FILL_BLANKS': 'SENTENCE_COMPLETION',
    'FILL_IN_BLANKS': 'SENTENCE_COMPLETION',
    'FILL_IN_THE_BLANK': 'SENTENCE_COMPLETION',
    'FILL_IN_THE_BLANKS': 'SENTENCE_COMPLETION',
    'GAP_FILLING': 'SENTENCE_COMPLETION',
    'GAP_FILL': 'SENTENCE_COMPLETION',
    'SENTENCE_COMPLETION': 'SENTENCE_COMPLETION',
    'MATCHING_HEADING': 'MATCHING_HEADINGS',
    'MATCH_HEADINGS': 'MATCHING_HEADINGS',
    'MULTIPLE_CHOICE': 'MULTIPLE_CHOICE',
    'MCQ': 'MULTIPLE_CHOICE',
    'PARAGRAPH_MATCH': 'PARAGRAPH_MATCHING',
    'PARAGRAPH_MATCHING': 'PARAGRAPH_MATCHING',
    'MATCHING_INFORMATION': 'PARAGRAPH_MATCHING',
    'SHORT_ANSWER': 'SHORT_ANSWER',
    'IDENTIFYING_VIEWS': 'IDENTIFYING_VIEWS_CLAIMS',
    'IDENTIFYING_CLAIMS': 'IDENTIFYING_VIEWS_CLAIMS',
    'YES_NO_NOT_GIVEN': 'IDENTIFYING_VIEWS_CLAIMS',
    'YNNG': 'IDENTIFYING_VIEWS_CLAIMS'
  };
  
  // Special case for GraphQL format - if the question text contains blanks, treat as SENTENCE_COMPLETION
  if (upperType && typeof upperType === 'string' && upperType.includes('SENTENCE') || upperType.includes('FILL')) {
    return 'SENTENCE_COMPLETION';
  }
  
  // Return the normalized type or the original if not found
  return typeMap[upperType] || upperType;
};

// Helper functions to handle different data structures
const getQuestionItems = (questionSet) => {
  // If there's an items array, use it
  if (questionSet.items && Array.isArray(questionSet.items)) {
    return questionSet.items;
  }
  
  // If there's a questions array, use it
  if (questionSet.questions && Array.isArray(questionSet.questions)) {
    return questionSet.questions;
  }
  
  // If there's a blanks array (for fill-in-the-blanks questions), use it
  if (questionSet.blanks && Array.isArray(questionSet.blanks)) {
    return questionSet.blanks;
  }
  
  // If there's a gaps array (another name for blanks), use it
  if (questionSet.gaps && Array.isArray(questionSet.gaps)) {
    return questionSet.gaps;
  }
  
  // Default to empty array
  return [];
};

const getQuestionId = (item) => {
  return item.itemNumber || item.questionId || item.blankId || item.gapId || item.id || '';
};

const getQuestionText = (item) => {
  return item.questionPrompt || item.questionText || item.blankText || item.gapText || item.text || '';
};

const getCorrectAnswer = (item) => {
  return item.correctAnswer ||
         (item.correctAnswers && item.correctAnswers[0]) ||
         item.answer ||
         (item.answers && item.answers[0]) ||
         '';
};

// Get input type based on question properties
const getInputType = (questionSet, item) => {
  // First check if explicitly specified
  if (questionSet.inputType) {
    return questionSet.inputType;
  }
  
  // Check item-level input type
  if (item && item.inputType) {
    return item.inputType;
  }
  
  // Determine based on question type
  const questionType = normalizeQuestionType(questionSet.questionType || questionSet.type || '');
  
  if (questionType === 'SENTENCE_COMPLETION' ||
      questionType === 'FILL_IN_THE_BLANKS' ||
      questionType === 'GAP_FILL') {
    
    // Check for specific display mode in the question set
    if (questionSet.displayMode === 'box' || questionSet.displayAs === 'box') {
      return 'box';
    }
    
    if (questionSet.displayMode === 'dropdown' || questionSet.displayAs === 'dropdown') {
      return 'dropdown';
    }
    
    if (questionSet.displayMode === 'line' || questionSet.displayAs === 'line') {
      return 'line';
    }
    
    // Default to box for these question types
    return 'box';
  }
  
  // Default for other question types
  return 'line';
};

// True/False/Not Given question renderer
const TrueFalseNotGivenQuestion = ({ questionSet }) => {
  const items = getQuestionItems(questionSet);
  
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={getQuestionId(item)} className="p-4 question-card">
          <div className="flex items-start">
            <span className="font-semibold mr-2">{getQuestionId(item)}.</span>
            <div className="flex-1">
              <p className="mb-3">{getQuestionText(item)}</p>
              <div className="flex space-x-4">
                {['TRUE', 'FALSE', 'NOT GIVEN'].map((option) => (
                  <label key={option} className="radio-option">
                    <input
                      type="radio"
                      name={`q-${getQuestionId(item)}`}
                      value={option}
                      className="mr-1"
                      aria-label={`${option} for question ${getQuestionId(item)}`}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Process text with blanks (helper function)
const renderTextWithBlanks = (text, questionId) => {
  // Handle case when text is null or undefined
  if (!text) {
    return <p className="mb-3"></p>;
  }
  
  // Check if text contains standard blank marker (__________) or any variations of it
  const blankMarkers = ['__________', '_________', '________', '_______', '______', '_____'];
  
  // Find which blank marker is used, if any
  const usedMarker = blankMarkers.find(marker => text.includes(marker));
  
  // If no blank marker is found
  if (!usedMarker) {
    return <p className="mb-3">{text}</p>;
  }
  
  // Split by the blank marker
  const parts = text.split(usedMarker);
  
  return (
    <div className="mb-3">
      {parts.map((part, index, array) => (
        <React.Fragment key={index}>
          {part}
          {index < array.length - 1 && (
            <div className="answer-box inline-block mx-1">
              <input
                type="text"
                className="answer-input box-input"
                placeholder="Your answer"
                aria-label={`Answer for blank ${index + 1} in question ${questionId}`}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Sentence Completion question renderer
const SentenceCompletionQuestion = ({ questionSet }) => {
  const items = getQuestionItems(questionSet);
  
  return (
    <div className="space-y-4">
      {items.map((item) => {
        // Get the question text and ID
        const questionText = getQuestionText(item);
        const questionId = getQuestionId(item);
        
        return (
          <Card key={questionId} className="p-4 question-card">
            <div className="flex items-start">
              <span className="font-semibold mr-2">{questionId}.</span>
              <div className="flex-1">
                {renderTextWithBlanks(questionText, questionId)}
                
                {/* Only add separate input box if there's no blank in the text */}
                {!questionText.includes('__________') && (
                  <div className="answer-box">
                    <input
                      type="text"
                      className="answer-input box-input"
                      placeholder="Your answer"
                      aria-label={`Answer for question ${questionId}`}
                    />
                  </div>
                )}
                
                {item.maxWords && (
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum {item.maxWords} word{item.maxWords !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// Matching Headings question renderer
const MatchingHeadingsQuestion = ({ questionSet }) => {
  const items = getQuestionItems(questionSet);
  const headingOptions = questionSet.headingOptions || [];
  
  return (
    <div>
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <h3 className="font-semibold mb-2">List of Headings</h3>
        <ul className="list-roman pl-6">
          {headingOptions.map((heading, index) => (
            <li key={index} className="mb-1">
              {heading}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={getQuestionId(item)} className="p-4 question-card">
            <div className="flex items-start">
              <span className="font-semibold mr-2">{getQuestionId(item)}.</span>
              <div className="flex-1">
                <p className="mb-3">{getQuestionText(item)}</p>
                <select
                  className="answer-input"
                  aria-label={`Select heading for ${getQuestionText(item)}`}
                >
                  <option value="">Select a heading</option>
                  {headingOptions.map((heading, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1}. {heading}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Multiple Choice question renderer
const MultipleChoiceQuestion = ({ questionSet }) => {
  const items = getQuestionItems(questionSet);
  
  return (
    <div className="space-y-4">
      {items.map((item) => {
        // Get options either from the item or from the questionSet
        const options = item.options || questionSet.options || [];
        
        return (
          <Card key={getQuestionId(item)} className="p-4 question-card">
            <div className="flex items-start">
              <span className="font-semibold mr-2">{getQuestionId(item)}.</span>
              <div className="flex-1">
                <p className="mb-3">{getQuestionText(item)}</p>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <label key={index} className="radio-option">
                      <input
                        type="radio"
                        name={`q-${getQuestionId(item)}`}
                        value={String.fromCharCode(65 + index)} // A, B, C, D
                        className="mr-2 mt-1"
                        aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
                      />
                      <span>
                        <strong>{String.fromCharCode(65 + index)}.</strong> {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// Paragraph Matching question renderer
const ParagraphMatchingQuestion = ({ questionSet }) => {
  const items = getQuestionItems(questionSet);
  
  // Generate paragraph letters based on the number of paragraphs
  const paragraphLetters = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i)); // A-J
  }, []);
  
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={getQuestionId(item)} className="p-4 question-card">
          <div className="flex items-start">
            <span className="font-semibold mr-2">{getQuestionId(item)}.</span>
            <div className="flex-1">
              <p className="mb-3">{getQuestionText(item)}</p>
              <select
                className="answer-input"
                aria-label={`Select paragraph for question ${getQuestionId(item)}`}
              >
                <option value="">Select a paragraph</option>
                {paragraphLetters.map((para) => (
                  <option key={para} value={para}>
                    Paragraph {para}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Short Answer question renderer
const ShortAnswerQuestion = ({ questionSet }) => {
  const items = getQuestionItems(questionSet);
  
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card
          key={getQuestionId(item)}
          className="p-4 question-card hover:border-blue-400 transition-colors"
          // Adding data attribute to potentially support passage highlighting in the future
          data-question-id={getQuestionId(item)}
        >
          <div className="flex items-start">
            <span className="font-semibold mr-2">{getQuestionId(item)}.</span>
            <div className="flex-1">
              {/* Adding a subtle left border to visually connect with passage */}
              <p className="mb-3 pl-2 border-l-2 border-blue-200">{getQuestionText(item)}</p>
              <input
                type="text"
                className="answer-input w-full border-b-2 border-gray-300 focus:border-blue-500 transition-colors"
                placeholder="Your answer"
                aria-label={`Answer for question ${getQuestionId(item)}`}
              />
              {/* Optional hint about answer length if available */}
              {item.maxWords && (
                <p className="text-xs text-gray-500 mt-1">
                  Maximum {item.maxWords} word{item.maxWords !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Identifying Views/Claims question renderer (Yes/No/Not Given)
const IdentifyingViewsClaimsQuestion = ({ questionSet }) => {
  const items = getQuestionItems(questionSet);
  
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card
          key={getQuestionId(item)}
          className="p-4 question-card hover:border-blue-400 transition-colors"
          // Adding data attribute to potentially support passage highlighting in the future
          data-question-id={getQuestionId(item)}
        >
          <div className="flex items-start">
            <span className="font-semibold mr-2">{getQuestionId(item)}.</span>
            <div className="flex-1">
              {/* Adding a subtle left border to visually connect with passage */}
              <p className="mb-3 pl-2 border-l-2 border-blue-200">{getQuestionText(item)}</p>
              <div className="flex space-x-4">
                {['YES', 'NO', 'NOT GIVEN'].map((option) => (
                  <label key={option} className="radio-option cursor-pointer">
                    <input
                      type="radio"
                      name={`q-${getQuestionId(item)}`}
                      value={option}
                      className="mr-1"
                      aria-label={`${option} for question ${getQuestionId(item)}`}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const ReadingTest = () => {
  const { testData, currentSection, changeSection, resetTest } = useReadingContext();
  const [activeTab, setActiveTab] = useState(0); // For tracking active tab within a section

  // Safely access nested properties with defensive checks
  const sections = testData?.testData?.sections || [];
  const currentSectionData = sections[currentSection] || { texts: [] };
  const currentTexts = currentSectionData.texts || [];
  const currentText = currentTexts[activeTab] || { questions: [], questionSets: [] };
  
  // Handle different property names in the data structure
  const getQuestions = (text) => {
    return text.questions || text.questionSets || [];
  };
  
  const getSectionNumber = (section) => {
    return section.sectionNumber || section.sectionId || '';
  };
  
  const getSectionTitle = (section) => {
    return section.sectionTitle || section.sectionFocus || '';
  };
  
  const getTextNumber = (text) => {
    return text.textNumber || text.textId || '';
  };
  
  const getTextContent = (text) => {
    return text.textContent || text.textBody || text.text || '';
  };
  
  // Check if we have valid data to display
  if (!sections.length) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">No test data available</h2>
        <p className="text-gray-600 mb-4">There was a problem loading the test data.</p>
      </div>
    );
  }
  
  // Handle section change
  const handleSectionChange = (sectionIndex) => {
    changeSection(sectionIndex);
    setActiveTab(0); // Reset tab when changing section
  };

  // Handle tab change within a section
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className="reading-test-container">
      {/* Header with section tabs */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-800">
            IELTS Reading Test: {getSectionTitle(currentSectionData)}
          </h1>
          <Button 
            variant="outline" 
            onClick={resetTest}
            className="text-sm"
          >
            Back to Instructions
          </Button>
        </div>
        
        <div className="section-tabs">
          {sections.map((section, index) => (
            <button
              key={index}
              className={cn(
                "section-tab",
                currentSection === index ? "active" : ""
              )}
              onClick={() => handleSectionChange(index)}
            >
              Section {getSectionNumber(section)}: {getSectionTitle(section)}
            </button>
          ))}
        </div>
      </div>

      {/* Main content with split screen */}
      <div className="flex flex-1 gap-4 overflow-hidden reading-split-layout">
        {/* Left panel - Passages */}
        <div
          className="w-1/2 border rounded-lg p-4 bg-white shadow-sm scrollable-panel passage-panel"
          id="passage-panel"
        >
          <h2 className="text-xl font-semibold mb-4">Reading Passage</h2>
          
          {/* Text tabs if multiple texts in a section */}
          {currentSectionData.texts.length > 1 && (
            <div className="flex border-b mb-4">
              {currentSectionData.texts.map((text, index) => (
                <button
                  key={index}
                  className={cn(
                    "py-2 px-4 font-medium text-sm focus:outline-none",
                    activeTab === index
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                  onClick={() => handleTabChange(index)}
                >
                  Text {getTextNumber(text)}
                </button>
              ))}
            </div>
          )}
          
          {/* Display the text content */}
          <div className="passage-content">
            <div className="text-sm text-gray-500 mb-2">
              {currentText.textType || 'Text'}
            </div>
            {/* Adding paragraph letters for easier reference */}
            {(getTextContent(currentText) || '').split('\n').map((paragraph, idx) => (
              <p
                key={idx}
                className="whitespace-pre-wrap relative pl-6 mb-2 hover:bg-blue-50 transition-colors"
                // Adding data attributes to support potential highlighting
                data-paragraph-index={idx}
              >
                {/* Adding paragraph letter indicators for easier reference */}
                {paragraph.trim().length > 0 && (
                  <span className="absolute left-0 top-0 font-semibold text-blue-600">
                    {String.fromCharCode(65 + idx % 26)}
                  </span>
                )}
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        
        {/* Right panel - Questions */}
        <div
          className="w-1/2 border rounded-lg p-4 bg-white shadow-sm scrollable-panel"
          id="questions-panel"
        >
          <h2 className="text-xl font-semibold mb-4">Questions</h2>
          
          {/* Question tabs if multiple question sets */}
          {getQuestions(currentText).length > 1 && (
            <div className="flex border-b mb-4">
              {getQuestions(currentText).map((questionSet, index) => (
                <button
                  key={index}
                  className={cn(
                    "py-2 px-4 font-medium text-sm focus:outline-none",
                    "text-gray-500 hover:text-gray-700"
                  )}
                  onClick={() => {/* Handle question set change */}}
                >
                  Questions {index + 1}-{(getQuestionItems(questionSet).length || 0) + index}
                </button>
              ))}
            </div>
          )}
          
          {/* Display the questions */}
          {getQuestions(currentText).map((questionSet, qSetIndex) => (
            <div key={qSetIndex} className="mb-8">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="font-medium">
                  {questionSet.questionStem || questionSet.instructions || questionSet.questionText || 'No question stem available'}
                </p>
                
                {/* Add a hint about which paragraphs to focus on if available */}
                {questionSet.relevantParagraphs && (
                  <p className="text-sm text-blue-600 mt-2">
                    Focus on paragraph{questionSet.relevantParagraphs.length > 1 ? 's' : ''}: {' '}
                    {questionSet.relevantParagraphs.map(p => String.fromCharCode(65 + p)).join(', ')}
                  </p>
                )}
              </div>
              
              {/* Render different question types using our modular component */}
              <QuestionRenderer questionSet={questionSet} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default ReadingTest;