import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getIELTSTest, listIELTSTests } from '../../graphql/queries';
import fallbackData from './fallbackData';

// Create API client
const client = generateClient();

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

  // Function to fetch available tests
  const fetchAvailableTests = async () => {
    try {
      console.log('Fetching available tests from GraphQL API');
      const response = await client.graphql({
        query: listIELTSTests
      });
      
      if (response.data && response.data.listIELTSTests) {
        console.log('Available tests:', response.data.listIELTSTests);
        
        // Process the test list
        const tests = response.data.listIELTSTests.map(test => ({
          testId: test.testId,
          // Extract a title from the rawJson if possible
          title: test.testId // We could parse the rawJson to get a better title if needed
        }));
        
        setAvailableTests(tests);
      } else {
        console.warn('No tests available from API');
      }
    } catch (err) {
      console.error('Error fetching available tests:', err);
    }
  };

  // Function to fetch test data from API with retry mechanism
  const fetchTestData = async (testId = "IELTS_TEST_001") => {
    setLoading(true);
    setError(null);
    setUsingFallback(false);
    
    // Maximum number of retry attempts
    const maxRetries = 3;
    let currentRetry = 0;
    let success = false;
    
    while (currentRetry < maxRetries && !success) {
      try {
        console.log(`Fetching test data for ID: ${testId} (Attempt ${currentRetry + 1}/${maxRetries})`);
        const response = await client.graphql({
          query: getIELTSTest,
          variables: { testId }
        });
        
        if (response.data && response.data.getIELTSTest && response.data.getIELTSTest.rawJson) {
          try {
            // Log the raw JSON to see what we're working with
            console.log('Raw JSON:', response.data.getIELTSTest.rawJson);
            
            // Parse the JSON string - it might be double or triple-stringified
            let fetchedData;
            try {
              // First, get the raw JSON string
              const rawJson = response.data.getIELTSTest.rawJson;
              console.log('Raw JSON type:', typeof rawJson);
              
              // Direct approach for the specific format we're seeing in the logs
              // This is a very specific solution for the exact format we're seeing
              if (rawJson.startsWith('"\\"{') && rawJson.endsWith('}\\\""')) {
                console.log('Detected triple-stringified JSON format');
                
                try {
                  // Method 1: Manual string manipulation
                  // Remove the outer quotes and unescape the inner JSON
                  const content = rawJson.slice(1, -1)  // Remove outer quotes
                    .replace(/\\"/g, '"')               // Replace \" with "
                    .replace(/\\\\/g, '\\');            // Replace \\ with \
                  
                  // Now we should have a valid JSON string
                  fetchedData = JSON.parse(content);
                  console.log('Successfully parsed using manual string manipulation');
                } catch (e1) {
                  console.error('Method 1 failed:', e1);
                  
                  try {
                    // Method 2: Regex-based approach
                    const regex = /^"\\"{(.*)}\\\""$/;
                    const match = rawJson.match(regex);
                    
                    if (match && match[1]) {
                      // We've extracted the content between the quotes
                      const extracted = match[1].replace(/\\\\/g, '\\').replace(/\\"/g, '"');
                      const jsonStr = '{' + extracted + '}';
                      fetchedData = JSON.parse(jsonStr);
                      console.log('Successfully parsed using regex extraction');
                    } else {
                      throw new Error('Regex extraction failed');
                    }
                  } catch (e2) {
                    console.error('Method 2 failed:', e2);
                    // Method 3: Last resort
                    console.error('All parsing methods failed');
                    throw new Error('Failed to parse complex JSON data');
                  }
                }
              } else {
                // Standard approach for other formats
                // Try to parse it, handling multiple levels of stringification
                let parsedData = rawJson;
                let attempts = 0;
                const maxParseAttempts = 3; // Prevent infinite loops
                
                // Keep parsing as long as we have a string that looks like JSON
                while (typeof parsedData === 'string' &&
                      (parsedData.startsWith('{') || parsedData.startsWith('[')) &&
                      attempts < maxParseAttempts) {
                  try {
                    parsedData = JSON.parse(parsedData);
                    attempts++;
                    console.log(`Parse attempt ${attempts} successful, result type:`, typeof parsedData);
                  } catch (e) {
                    // If parsing fails, we've reached the end of JSON strings
                    console.log(`Parse attempt ${attempts} failed:`, e.message);
                    break;
                  }
                }
                
                fetchedData = parsedData;
              }
              
              console.log('Final parsed data type:', typeof fetchedData);
              
              // Format the data properly - ensure testData is an object, not a string
              const formattedData = {
                testId: testId,
                testData: typeof fetchedData === 'string' ? JSON.parse(fetchedData) : fetchedData
              };
              
              // Check if the data has the right structure using our validation function
              if (isValidTestData(formattedData)) {
                setTestData(formattedData);
                console.log('Successfully loaded test data from GraphQL API');
                success = true;
                break; // Exit the retry loop
              } else {
                console.warn('Invalid data structure from API');
                throw new Error('The data from GraphQL API has an invalid structure');
              }
            } catch (parseError) {
              console.error('Error parsing test data JSON:', parseError);
              throw new Error('Error parsing data from GraphQL API');
            }
          } catch (parseError) {
            console.error('Error parsing test data JSON:', parseError);
            throw new Error('Error parsing data from GraphQL API');
          }
        } else {
          console.warn('No test data returned from API');
          throw new Error('No test data available from GraphQL API');
        }
      } catch (err) {
        console.error(`Error fetching test data (Attempt ${currentRetry + 1}/${maxRetries}):`, err);
        currentRetry++;
        
        if (currentRetry < maxRetries) {
          console.log(`Retrying... (${currentRetry}/${maxRetries})`);
          // Optional: Add a delay before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // If all retries failed, use fallback data
    if (!success) {
      console.log('All GraphQL attempts failed. Using fallback data.');
      setTestData(fallbackData);
      setUsingFallback(true);
    }
    
    // Start the test automatically after data is loaded
    setShowInstructions(false);
    setLoading(false);
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