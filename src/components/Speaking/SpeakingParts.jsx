import React, { useRef, useState } from 'react';
import { useSpeakingContext } from './SpeakingContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import useSpeechRecognition from './useSpeechRecognition';

// Part 1 Component
export const Part1 = () => {
  const { 
    testData, 
    nextPart, 
    transcriptions, 
    isRecording, 
    updateTranscription, 
    toggleRecording,
    setError
  } = useSpeakingContext();
  
  const { isSupported, startRecognition } = useSpeechRecognition();
  const recognitionRef = useRef(null);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const startRecording = (questionIndex) => {
    // If already recording, stop the recognition
    if (isRecording.part1[questionIndex]) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          console.log('Speech recognition stopped');
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
        recognitionRef.current = null;
      }
      
      // Save the final transcript
      if (currentTranscript) {
        updateTranscription(1, questionIndex, currentTranscript);
      }
    } else {
      // Stop any existing recognition before starting a new one
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          console.log('Stopping previous speech recognition');
        } catch (error) {
          console.error('Error stopping previous speech recognition:', error);
        }
        recognitionRef.current = null;
      }
      
      // Start new recording
      if (!isSupported) {
        setError('Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.');
        return;
      }
      
      // Reset current transcript
      setCurrentTranscript('');
      
      // Start speech recognition
      recognitionRef.current = startRecognition(
        // onResult callback
        (transcript) => {
          setCurrentTranscript(transcript);
          // Update in real-time
          updateTranscription(1, questionIndex, transcript);
        },
        // onError callback
        (errorMessage) => {
          setError(errorMessage);
          toggleRecording(1, questionIndex); // Turn off recording state
        }
      );
    }
    
    // Toggle recording state
    toggleRecording(1, questionIndex);
  };
  
  // Get the questions from the test data
  const questions = testData?.testData?.Part1 || [];
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Speaking Test - Part 1</h1>
      <p className="text-center text-slate-600 mb-8">
        Answer the following questions about familiar topics. Click the microphone button to start recording your answer.
      </p>
      
      <div className="space-y-8 mb-8">
        {questions.map((question, index) => (
          <div key={index} className="flex items-start gap-4">
            <Card className="p-6 speaking-question-card flex-1">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">{question}</h2>
              
              {transcriptions.part1[index] && (
                <div className="transcription-area">
                  <h3 className="transcription-label">Your Answer:</h3>
                  <p className="transcription-text">{transcriptions.part1[index]}</p>
                </div>
              )}
            </Card>
            
            <Button
              onClick={() => startRecording(index)}
              className={`mic-button rounded-full w-14 h-14 flex-shrink-0 ${
                isRecording.part1[index]
                  ? 'bg-red-600 hover:bg-red-700 recording'
                  : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
              }`}
              aria-label={isRecording.part1[index] ? "Stop recording" : "Start recording"}
            >
              {isRecording.part1[index] ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </Button>
          </div>
        ))}
      </div>
      
      <div className="text-center mb-12">
        <Button
          size="lg"
          onClick={nextPart}
          className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 text-lg nav-button"
        >
          Next: Part 2
        </Button>
      </div>
    </div>
  );
};

// Part 2 Component
export const Part2 = () => {
  const { 
    testData, 
    nextPart, 
    transcriptions, 
    isRecording, 
    updateTranscription, 
    toggleRecording,
    setError
  } = useSpeakingContext();
  
  const { isSupported, startRecognition } = useSpeechRecognition();
  const recognitionRef = useRef(null);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const toggleRecordingHandler = () => {
    // If already recording, stop the recognition
    if (isRecording.part2) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          console.log('Speech recognition stopped for Part 2');
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
        recognitionRef.current = null;
      }
      
      // Save the final transcript
      if (currentTranscript) {
        updateTranscription(2, 0, currentTranscript);
      }
    } else {
      // Stop any existing recognition before starting a new one
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          console.log('Stopping previous speech recognition');
        } catch (error) {
          console.error('Error stopping previous speech recognition:', error);
        }
        recognitionRef.current = null;
      }
      
      // Start new recording
      if (!isSupported) {
        setError('Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.');
        return;
      }
      
      // Reset current transcript
      setCurrentTranscript('');
      
      // Start speech recognition
      recognitionRef.current = startRecognition(
        // onResult callback
        (transcript) => {
          setCurrentTranscript(transcript);
          // Update in real-time
          updateTranscription(2, 0, transcript);
        },
        // onError callback
        (errorMessage) => {
          setError(errorMessage);
          toggleRecording(2, 0); // Turn off recording state
        }
      );
    }
    
    // Toggle recording state
    toggleRecording(2, 0);
  };
  
  // Get the Part 2 data from the test data
  const part2Data = testData?.testData?.Part2 || {
    title: "No topic available",
    cues: [],
    final_question: ""
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Speaking Test - Part 2</h1>
      <p className="text-center text-slate-600 mb-8">
        You will be given a topic to talk about for 1-2 minutes. You have 1 minute to prepare your response.
      </p>
      
      <Card className="p-6 mb-8 speaking-question-card cue-card">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">{part2Data.title}</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-slate-700 mb-3">You should say:</h3>
          <ul className="space-y-2 text-slate-700">
            {part2Data.cues.map((cue, index) => (
              <li key={index} className="cue-item">{cue}</li>
            ))}
          </ul>
        </div>
        
        {part2Data.final_question && (
          <p className="text-lg font-medium text-slate-700 mb-6">{part2Data.final_question}</p>
        )}
        
        <div className="flex justify-center mt-8">
          <Button
            onClick={toggleRecordingHandler}
            className={`flex items-center justify-center rounded-full w-20 h-20 ${
              isRecording.part2
                ? 'bg-red-600 hover:bg-red-700 recording'
                : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
            }`}
            aria-label={isRecording.part2 ? "Stop recording" : "Start recording"}
          >
            {isRecording.part2 ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </Button>
        </div>
        <p className="text-center text-sm text-slate-500 mt-2">
          {isRecording.part2 ? "Click to stop recording" : "Click to start recording your response"}
        </p>
      </Card>
      
      {transcriptions.part2 && (
        <Card className="p-6 mb-8 speaking-question-card">
          <h3 className="text-lg font-semibold text-slate-700 mb-3">Your Response:</h3>
          <div className="transcription-area">
            <p className="transcription-text">{transcriptions.part2}</p>
          </div>
        </Card>
      )}
      
      <div className="text-center mb-12">
        <Button
          size="lg"
          onClick={nextPart}
          className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 text-lg nav-button"
        >
          Next: Part 3
        </Button>
      </div>
    </div>
  );
};

// Part 3 Component
export const Part3 = () => {
  const {
    testData,
    transcriptions,
    isRecording,
    updateTranscription,
    toggleRecording,
    getFeedback,
    setError
  } = useSpeakingContext();
  
  const { isSupported, startRecognition } = useSpeechRecognition();
  const recognitionRef = useRef(null);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const startRecording = (questionIndex) => {
    // If already recording, stop the recognition
    if (isRecording.part3[questionIndex]) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          console.log('Speech recognition stopped for Part 3');
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
        recognitionRef.current = null;
      }
      
      // Save the final transcript
      if (currentTranscript) {
        updateTranscription(3, questionIndex, currentTranscript);
      }
    } else {
      // Stop any existing recognition before starting a new one
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          console.log('Stopping previous speech recognition');
        } catch (error) {
          console.error('Error stopping previous speech recognition:', error);
        }
        recognitionRef.current = null;
      }
      
      // Start new recording
      if (!isSupported) {
        setError('Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.');
        return;
      }
      
      // Reset current transcript
      setCurrentTranscript('');
      
      // Start speech recognition
      recognitionRef.current = startRecognition(
        // onResult callback
        (transcript) => {
          setCurrentTranscript(transcript);
          // Update in real-time
          updateTranscription(3, questionIndex, transcript);
        },
        // onError callback
        (errorMessage) => {
          setError(errorMessage);
          toggleRecording(3, questionIndex); // Turn off recording state
        }
      );
    }
    
    // Toggle recording state
    toggleRecording(3, questionIndex);
  };
  
  // Get the questions from the test data
  const questions = testData?.testData?.Part3 || [];
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Speaking Test - Part 3</h1>
      <p className="text-center text-slate-600 mb-8">
        Answer the following questions related to the topic from Part 2. These questions will be more abstract and require deeper analysis.
      </p>
      
      <div className="space-y-8 mb-8">
        {questions.map((question, index) => (
          <div key={index} className="flex items-start gap-4">
            <Card className="p-6 speaking-question-card flex-1">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">{question}</h2>
              
              {transcriptions.part3[index] && (
                <div className="transcription-area">
                  <h3 className="transcription-label">Your Answer:</h3>
                  <p className="transcription-text">{transcriptions.part3[index]}</p>
                </div>
              )}
            </Card>
            
            <Button
              onClick={() => startRecording(index)}
              className={`mic-button rounded-full w-14 h-14 flex-shrink-0 ${
                isRecording.part3[index]
                  ? 'bg-red-600 hover:bg-red-700 recording'
                  : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
              }`}
              aria-label={isRecording.part3[index] ? "Stop recording" : "Start recording"}
            >
              {isRecording.part3[index] ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </Button>
          </div>
        ))}
      </div>
      
      <div className="text-center mb-12">
        <Button
          size="lg"
          onClick={getFeedback}
          className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-lg nav-button"
        >
          Complete Test & Get Feedback
        </Button>
        <p className="mt-4 text-slate-500 text-sm">
          Click the button above to complete the test and get AI feedback on your performance.
        </p>
      </div>
    </div>
  );
};

// Default export for backward compatibility if needed
export default {
  Part1,
  Part2,
  Part3
};