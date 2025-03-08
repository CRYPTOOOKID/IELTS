import React, { createContext, useContext, useState } from 'react';
import fallbackData from './fallback.js';
import { testGenerationPrompt, feedbackPrompt } from './prompt.js';

// Create the context
const SpeakingContext = createContext();

// Custom hook to use the context
export const useSpeakingContext = () => {
  const context = useContext(SpeakingContext);
  if (!context) {
    throw new Error('useSpeakingContext must be used within a SpeakingProvider');
  }
  return context;
};

// Provider component
export const SpeakingProvider = ({ children }) => {
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentPart, setCurrentPart] = useState(1); // 1, 2, or 3
  const [usingFallback, setUsingFallback] = useState(false);
  const [transcriptions, setTranscriptions] = useState({
    part1: ["", "", "", ""],
    part2: "",
    part3: ["", "", "", ""]
  });
  const [isRecording, setIsRecording] = useState({
    part1: [false, false, false, false],
    part2: false,
    part3: [false, false, false, false]
  });
  const [feedback, setFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Function to fetch test data from Gemini API
  const fetchTestData = async () => {
    setLoading(true);
    setError(null);
    setUsingFallback(false);
    
    const API_KEY = "AIzaSyA6MdoSLwUd2D8kf1goBDg-92nvMTq2j9A";
    const MODEL = "gemini-2.0-flash-lite";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    
    // Add a console log to show when we're attempting to fetch new data
    console.log("Attempting to fetch new speaking test data from Gemini API");
    
    // Maximum number of retry attempts
    const maxRetries = 2;
    let currentRetry = 0;
    let success = false;
    
    while (currentRetry < maxRetries && !success) {
      try {
        console.log(`Fetching speaking test data (Attempt ${currentRetry + 1}/${maxRetries})`);
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: testGenerationPrompt + `\n\nGenerate a unique set of questions. Current timestamp: ${new Date().toISOString()}`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.9, // Increased for more variety
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048
            }
          })
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          try {
            const generatedText = data.candidates[0].content.parts[0].text;
            console.log("Generated Text:", generatedText);
            
            // Extract JSON from the response - handle different possible formats
            let parsedData;
            
            try {
              // First attempt: Try to parse the entire text as JSON
              parsedData = JSON.parse(generatedText);
              console.log("Successfully parsed entire text as JSON");
            } catch (e) {
              console.log("Could not parse entire text as JSON, trying to extract JSON...");
              
              try {
                // Second attempt: Try to extract JSON using regex
                const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                  throw new Error('No JSON found in the response');
                }
                
                const jsonString = jsonMatch[0];
                console.log("Extracted JSON string:", jsonString);
                
                try {
                  parsedData = JSON.parse(jsonString);
                  console.log("Successfully parsed extracted JSON");
                } catch (e2) {
                  console.error("Error parsing extracted JSON:", e2);
                  
                  // Third attempt: Try to manually fix common JSON issues
                  console.log("Attempting to fix JSON manually...");
                  let fixedJson = jsonString
                    .replace(/,(\s*[\]}])/g, '$1') // Remove trailing commas
                    .replace(/'/g, '"') // Replace single quotes with double quotes
                    .replace(/\n/g, ''); // Remove newlines
                    
                  try {
                    parsedData = JSON.parse(fixedJson);
                    console.log("Successfully parsed fixed JSON");
                  } catch (e3) {
                    console.error("Error parsing fixed JSON:", e3);
                    throw new Error('Failed to parse JSON after multiple attempts');
                  }
                }
              } catch (error) {
                console.error("All JSON extraction attempts failed:", error);
                throw error;
              }
            }
            
            // Validate and fix the structure if needed
            console.log("Validating data structure:", parsedData);
            
            // Ensure we have the required parts
            let validatedData = { ...parsedData };
            
            // Check and fix Part1
            if (!validatedData.Part1 || !Array.isArray(validatedData.Part1)) {
              console.warn('Part1 is missing or not an array, creating default');
              validatedData.Part1 = fallbackData.testData.Part1;
            } else if (validatedData.Part1.length < 4) {
              console.warn('Part1 has fewer than 4 questions, using available questions');
              // Keep what we have but ensure we have 4 questions
              while (validatedData.Part1.length < 4) {
                validatedData.Part1.push(fallbackData.testData.Part1[validatedData.Part1.length]);
              }
            }
            
            // Check and fix Part2
            if (!validatedData.Part2 || typeof validatedData.Part2 !== 'object') {
              console.warn('Part2 is missing or not an object, creating default');
              validatedData.Part2 = fallbackData.testData.Part2;
            } else {
              // Ensure Part2 has all required properties
              if (!validatedData.Part2.title) {
                validatedData.Part2.title = fallbackData.testData.Part2.title;
              }
              if (!validatedData.Part2.cues || !Array.isArray(validatedData.Part2.cues)) {
                validatedData.Part2.cues = fallbackData.testData.Part2.cues;
              }
              if (!validatedData.Part2.final_question) {
                validatedData.Part2.final_question = fallbackData.testData.Part2.final_question;
              }
            }
            
            // Check and fix Part3
            if (!validatedData.Part3 || !Array.isArray(validatedData.Part3)) {
              console.warn('Part3 is missing or not an array, creating default');
              validatedData.Part3 = fallbackData.testData.Part3;
            } else if (validatedData.Part3.length < 4) {
              console.warn('Part3 has fewer than 4 questions, using available questions');
              // Keep what we have but ensure we have 4 questions
              while (validatedData.Part3.length < 4) {
                validatedData.Part3.push(fallbackData.testData.Part3[validatedData.Part3.length]);
              }
            }
            
            setTestData({
              testId: "SPEAKING_TEST_GEMINI",
              testData: validatedData
            });
            console.log('Successfully loaded and validated test data from Gemini API');
            success = true;
            break; // Exit the retry loop
          } catch (parseError) {
            console.error('Error parsing test data JSON:', parseError);
            throw new Error('Error parsing data from Gemini API');
          }
        } else {
          console.warn('No test data returned from API');
          throw new Error('No test data available from Gemini API');
        }
      } catch (err) {
        console.error(`Error fetching test data (Attempt ${currentRetry + 1}/${maxRetries}):`, err);
        currentRetry++;
        
        if (currentRetry < maxRetries) {
          console.log(`Retrying... (${currentRetry}/${maxRetries})`);
          // Add a delay before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // If all retries failed, use fallback data
    if (!success) {
      console.log('⚠️ WARNING: All Gemini API attempts failed. Using fallback data. ⚠️');
      console.log('This is why you are seeing the same questions every time.');
      setTestData(fallbackData);
      setUsingFallback(true);
      
      // Display a more visible alert in the console
      console.warn('%c USING FALLBACK DATA - API CALLS FAILED ', 'background: #FFA500; color: #000; font-size: 16px; padding: 5px;');
    } else {
      console.log('✅ Successfully fetched new speaking test data from Gemini API');
    }
    
    setLoading(false);
  };

  // Start the test by hiding instructions
  const startTest = () => {
    // Stop any active recordings when starting the test
    stopAllRecordings();
    
    setShowInstructions(false);
    setCurrentPart(1);
  };

  // Move to the next part of the test
  const nextPart = () => {
    // Stop any active recordings when moving to the next part
    stopAllRecordings();
    
    if (currentPart < 3) {
      setCurrentPart(currentPart + 1);
    }
  };

  // Update transcription for a specific part and question
  const updateTranscription = (part, questionIndex, text) => {
    setTranscriptions(prev => {
      if (part === 2) {
        return { ...prev, part2: text };
      } else {
        const partKey = part === 1 ? 'part1' : 'part3';
        const newPartTranscriptions = [...prev[partKey]];
        newPartTranscriptions[questionIndex] = text;
        return { ...prev, [partKey]: newPartTranscriptions };
      }
    });
  };

  // Stop all active recordings
  const stopAllRecordings = () => {
    setIsRecording({
      part1: [false, false, false, false],
      part2: false,
      part3: [false, false, false, false]
    });
  };

  // Toggle recording state for a specific part and question
  const toggleRecording = (part, questionIndex) => {
    // Check if we're turning on a recording
    const isStartingRecording = part === 2
      ? !isRecording.part2
      : !isRecording[part === 1 ? 'part1' : 'part3'][questionIndex];

    if (isStartingRecording) {
      // Stop all active recordings first
      stopAllRecordings();
    }
    
    // Then set the new recording state
    setIsRecording(prev => {
      if (part === 2) {
        return { ...prev, part2: isStartingRecording };
      } else {
        const partKey = part === 1 ? 'part1' : 'part3';
        const newPartRecording = [...prev[partKey]];
        newPartRecording[questionIndex] = isStartingRecording;
        return { ...prev, [partKey]: newPartRecording };
      }
    });
  };

  // Reset the test state
  const resetTest = () => {
    setShowInstructions(true);
    setCurrentPart(1);
    setTranscriptions({
      part1: ["", "", "", ""],
      part2: "",
      part3: ["", "", "", ""]
    });
    setIsRecording({
      part1: [false, false, false, false],
      part2: false,
      part3: [false, false, false, false]
    });
    setFeedback(null);
    setShowFeedback(false);
  };

  // Get feedback from AI
  const getFeedback = async () => {
    if (!testData) return;
    
    // Stop any active recordings when getting feedback
    stopAllRecordings();
    
    // Set loading state and show feedback page immediately
    setFeedbackLoading(true);
    setShowFeedback(true);
    setError(null);
    
    try {
      // Prepare the data to send to the AI
      const part1Questions = testData.testData.Part1;
      const part2Question = {
        title: testData.testData.Part2.title,
        cues: testData.testData.Part2.cues,
        final_question: testData.testData.Part2.final_question
      };
      const part3Questions = testData.testData.Part3;
      
      // Combine questions and answers
      const part1Data = part1Questions.map((question, index) => ({
        question,
        answer: transcriptions.part1[index]
      }));
      
      const part2Data = {
        question: part2Question,
        answer: transcriptions.part2
      };
      
      const part3Data = part3Questions.map((question, index) => ({
        question,
        answer: transcriptions.part3[index]
      }));
      
      // Combine all parts
      const testContent = {
        part1: part1Data,
        part2: part2Data,
        part3: part3Data
      };
      
      // Format the content for the AI
      let promptContent = "IELTS Speaking Test Responses:\n\n";
      
      // Add Part 1
      promptContent += "Part 1:\n";
      part1Data.forEach((item, index) => {
        if (item.answer.trim()) {
          promptContent += `Question ${index + 1}: ${item.question}\n`;
          promptContent += `Answer: ${item.answer}\n\n`;
        }
      });
      
      // Add Part 2
      promptContent += "Part 2:\n";
      promptContent += `Topic: ${part2Data.question.title}\n`;
      if (part2Data.answer.trim()) {
        promptContent += `Answer: ${part2Data.answer}\n\n`;
      }
      
      // Add Part 3
      promptContent += "Part 3:\n";
      part3Data.forEach((item, index) => {
        if (item.answer.trim()) {
          promptContent += `Question ${index + 1}: ${item.question}\n`;
          promptContent += `Answer: ${item.answer}\n\n`;
        }
      });
      
      // Call the AI API
      const API_KEY = "AIzaSyA6MdoSLwUd2D8kf1goBDg-92nvMTq2j9A";
      const MODEL = "gemini-2.0-flash-lite";
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
      
      console.log("Sending speaking test responses for AI feedback");
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: feedbackPrompt + "\n\n" + promptContent
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        try {
          const generatedText = data.candidates[0].content.parts[0].text;
          
          // Extract JSON from the response
          let parsedData;
          
          try {
            // First attempt: Try to parse the entire text as JSON
            parsedData = JSON.parse(generatedText);
          } catch (e) {
            // Second attempt: Try to extract JSON using regex
            const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
              throw new Error('No JSON found in the response');
            }
            
            const jsonString = jsonMatch[0];
            
            try {
              parsedData = JSON.parse(jsonString);
            } catch (e2) {
              // Third attempt: Try to manually fix common JSON issues
              let fixedJson = jsonString
                .replace(/,(\s*[\]}])/g, '$1') // Remove trailing commas
                .replace(/'/g, '"') // Replace single quotes with double quotes
                .replace(/\n/g, ''); // Remove newlines
                
              parsedData = JSON.parse(fixedJson);
            }
          }
          
          setFeedback(parsedData);
          console.log('Successfully received AI feedback', parsedData);
        } catch (parseError) {
          console.error('Error parsing feedback JSON:', parseError);
          setError('Error parsing feedback from AI');
        }
      } else {
        console.warn('No feedback data returned from API');
        setError('No feedback available from AI');
      }
    } catch (err) {
      console.error('Error getting feedback:', err);
      setError(`Error getting feedback: ${err.message}`);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Value object to be provided by the context
  const value = {
    testData,
    loading,
    setLoading,
    error,
    setError,
    showInstructions,
    currentPart,
    usingFallback,
    transcriptions,
    isRecording,
    feedback,
    feedbackLoading,
    showFeedback,
    setShowFeedback,
    fetchTestData,
    startTest,
    nextPart,
    updateTranscription,
    toggleRecording,
    resetTest,
    getFeedback,
  };

  return (
    <SpeakingContext.Provider value={value}>
      {children}
    </SpeakingContext.Provider>
  );
};