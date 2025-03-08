import React, { createContext, useContext, useState, useEffect } from 'react';
import fallbackData from './fallbackData';

// No API client needed as we're using fallback data

// Create the context
const ReadingContext = createContext();

// Custom hook to use the context
export const useReadingContext = () => {
  const context = useContext(ReadingContext);
  if (!context) {
    throw new Error('useReadingContext must be used within a ReadingProvider');
  }
  return context;
};

// Provider component
export const ReadingProvider = ({ children }) => {
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [availableTests, setAvailableTests] = useState([]);
  const [usingFallback, setUsingFallback] = useState(false);

  // Function to fetch available tests (using fallback data)
  const fetchAvailableTests = async () => {
    try {
      console.log('Using fallback test data');
      
      // Create a mock test list from fallback data
      const tests = [{
        testId: fallbackData.testId,
        title: "Fallback Reading Test"
      }];
      
      setAvailableTests(tests);
    } catch (err) {
      console.error('Error setting up fallback tests:', err);
    }
  };

  // Function to fetch test data (using fallback data directly)
  const fetchTestData = async (testId = "IELTS_TEST_001") => {
    setLoading(true);
    setError(null);
    setUsingFallback(true);
    
    try {
      console.log('Using fallback reading test data');
      
      // Validate the fallback data
      if (isValidTestData(fallbackData)) {
        setTestData(fallbackData);
        console.log('Successfully loaded fallback test data');
      } else {
        console.warn('Invalid fallback data structure');
        setError('Error loading test data');
      }
    } catch (err) {
      console.error('Error setting up test data:', err);
      setError('Error loading test data');
    } finally {
      // Start the test automatically after data is loaded
      setShowInstructions(false);
      setLoading(false);
    }
  };

  // Validate the structure of the test data
  const isValidTestData = (data) => {
    try {
      console.log('Validating data structure:', typeof data,
                 data ? (typeof data.testData) : 'no data');
      
      // Check if the data has the expected structure
      if (!data || typeof data !== 'object') {
        console.error('Data is not an object:', data);
        return false;
      }
      
      // Check if testData exists
      if (!data.testData) {
        console.error('Missing testData:', data);
        return false;
      }
      
      // If testData is a string, try to parse it
      let testData = data.testData;
      if (typeof testData === 'string') {
        try {
          testData = JSON.parse(testData);
          console.log('Successfully parsed string testData into object');
        } catch (e) {
          console.error('Failed to parse testData string:', e);
          return false;
        }
      }
      
      // Now testData should be an object
      if (typeof testData !== 'object') {
        console.error('testData is not an object after parsing:', testData);
        return false;
      }
      
      // Check if sections array exists
      if (!Array.isArray(testData.sections)) {
        console.error('Missing sections array or not an array:', testData);
        return false;
      }
      
      // If sections array is empty, that's a problem
      if (testData.sections.length === 0) {
        console.error('Sections array is empty');
        return false;
      }

      // Check if each section has the expected structure
      for (const section of testData.sections) {
        // Check for section identifiers - allow various property names
        const hasSectionNumber = section.sectionNumber !== undefined;
        const hasSectionId = section.sectionId !== undefined;
        const hasSectionTitle = section.sectionTitle !== undefined || section.sectionFocus !== undefined;
        
        if ((!hasSectionNumber && !hasSectionId) || !hasSectionTitle) {
          console.error('Invalid section basic properties:', section);
          return false;
        }
        
        // Check if texts array exists
        if (!Array.isArray(section.texts)) {
          console.error('Missing texts array or not an array:', section);
          return false;
        }
        
        // If texts array is empty, that's a problem
        if (section.texts.length === 0) {
          console.error('Texts array is empty for section:', section.sectionTitle || section.sectionFocus);
          return false;
        }

        // Check if each text has the expected structure
        for (const text of section.texts) {
          // For GraphQL data, the structure might be different
          // If the text has a 'text' property and 'questions' array, consider it valid
          if (text.text !== undefined && Array.isArray(text.questions)) {
            // This is the format from GraphQL API
            console.log('Detected GraphQL text format with text and questions properties');
            continue; // Skip the rest of the validation for this text
          }
          
          // For other formats, check for standard properties
          // Check for text identifiers - allow various property names
          const hasTextNumber = text.textNumber !== undefined;
          const hasTextId = text.textId !== undefined;
          
          // Check for text content - allow various property names
          const hasTextContent = text.textContent !== undefined ||
                                text.textBody !== undefined;
          
          if ((!hasTextNumber && !hasTextId) || !hasTextContent) {
            console.error('Invalid text basic properties:', text);
            return false;
          }
          
          // Check if questions/questionSets exist
          const hasQuestions = Array.isArray(text.questions) && text.questions.length > 0;
          const hasQuestionSets = Array.isArray(text.questionSets) && text.questionSets.length > 0;
          
          if (!hasQuestions && !hasQuestionSets) {
            console.error('Missing questions or questionSets arrays:', text);
            return false;
          }

          // Get the questions array (could be named questions or questionSets)
          const questionsArray = text.questions || text.questionSets || [];
          
          // Check if each question has the expected structure
          for (const question of questionsArray) {
            // Not all question types have items array
            if (!question.questionType) {
              console.error('Missing questionType:', question);
              return false;
            }
            
            // Check for question stem or instructions - include questionText for GraphQL format
            if (!question.questionStem && !question.instructions && !question.questionText) {
              console.error('Missing question text:', question);
              return false;
            }
          }
        }
      }

      console.log('Data validation successful');
      return true;
    } catch (error) {
      console.error('Error validating test data:', error);
      return false;
    }
  };

  // Initialize by fetching available tests
  useEffect(() => {
    fetchAvailableTests();
  }, []);

  // Start the test by hiding instructions
  const startTest = () => {
    setShowInstructions(false);
  };

  // Change the current section
  const changeSection = (sectionIndex) => {
    if (testData && sectionIndex >= 0 && sectionIndex < testData.testData.sections.length) {
      setCurrentSection(sectionIndex);
    }
  };

  // Reset the test state
  const resetTest = () => {
    setShowInstructions(true);
    setCurrentSection(0);
  };

  // Value object to be provided by the context
  const value = {
    testData,
    loading,
    setLoading,
    error,
    setError,
    currentSection,
    showInstructions,
    availableTests,
    usingFallback,
    fetchTestData,
    fetchAvailableTests,
    startTest,
    changeSection,
    resetTest,
  };

  return (
    <ReadingContext.Provider value={value}>
      {children}
    </ReadingContext.Provider>
  );
};