import React, { createContext, useContext, useState } from 'react';
import fallbackData from './fallback.js';
import { feedbackPrompt } from './prompt.js';
import { Amplify } from 'aws-amplify';
import awsExports from '../../aws-exports';

// Configure Amplify
Amplify.configure(awsExports);

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

  // Function to fetch test data from GraphQL API with fallback
  const fetchTestData = async () => {
    setLoading(true);
    setError(null);
    setUsingFallback(false);
    
    console.log("Attempting to fetch speaking test data from GraphQL API");
    
    try {
      // Use a fixed test ID to avoid randomness and speed up loading
      const testId = 1; // Using ID 1 which we know exists
      console.log(`Fetching speaking test with ID: ${testId}`);
      
      // Use fetch directly to call the GraphQL API
      const response = await fetch(awsExports.aws_appsync_graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': awsExports.aws_appsync_apiKey
        },
        body: JSON.stringify({
          query: `
            query GetIELTSpeakingTest($id: Int!) {
              getIELTSpeakingTest(id: $id) {
                id
                Part1
                Part2 {
                  title
                  cues
                  final_question
                }
                Part3
              }
            }
          `,
          variables: { id: testId }
        })
      });
      
      const data = await response.json();
      
      if (data.data && data.data.getIELTSpeakingTest) {
        const speakingTestData = data.data.getIELTSpeakingTest;
        
        // Set the test data directly without extensive validation
        // since we know the structure from the GraphQL schema
        setTestData({
          testId: `SPEAKING_TEST_${speakingTestData.id}`,
          testData: speakingTestData
        });
        console.log('Successfully loaded test data from GraphQL API');
      } else {
        // If API call succeeded but no data, use fallback
        console.warn('No test data returned from API, using fallback');
        setTestData(fallbackData);
        setUsingFallback(true);
      }
    } catch (err) {
      console.error(`Error fetching test data:`, err);
      console.log('Using fallback data due to API error');
      setTestData(fallbackData);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
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