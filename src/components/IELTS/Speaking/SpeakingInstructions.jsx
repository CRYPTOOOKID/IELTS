import React, { useState, useEffect } from 'react';
import { useSpeakingContext } from './SpeakingContext';
import { Button } from '../../ui/button';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import './speaking.css';

const SpeakingInstructions = () => {
  const { startTest, setTestDataDirectly, loading, loadingMessage, setLoading, setError, error, resetError } = useSpeakingContext();
  const { type } = useParams(); // Get IELTS type from URL (academic or general-training)
  const [isDataReady, setIsDataReady] = useState(false);
  const [testData, setTestData] = useState(null);
  
  // Trigger API call when component mounts (like Action game topic selection)
  useEffect(() => {
    fetchSpeakingData();
  }, [type]);

  const fetchSpeakingData = async () => {
    try {
      resetError();
      setIsDataReady(false);
      setLoading(true);
      
      // Generate random test number between 1-20
      const randomTestNumber = Math.floor(Math.random() * 20) + 1;
      
      // Use the correct IELTS endpoint pattern based on test type
      const testId = type === 'academic' 
        ? `ILTS.SPKNG.ACAD.T${randomTestNumber}`
        : `ILTS.SPKNG.GT.T${randomTestNumber}`;
      
      const endpoint = `https://8l1em9gvy7.execute-api.us-east-1.amazonaws.com/speakingtest/${testId}`;
      
      console.log(`Fetching speaking test: ${testId} from ${endpoint}`);
      
      const response = await fetch(endpoint, { 
        method: 'GET', 
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        let errorPayload = null; 
        try { errorPayload = await response.json(); } catch (e) {}
        const errorMsg = errorPayload?.message || errorPayload?.error || `Request failed with status: ${response.status}`;
        throw new Error(errorMsg);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched speaking test: ${testId}`);
      
      // Set the data both locally and in the context
      setTestData(data);
      setTestDataDirectly(data);
      setIsDataReady(true);
      
    } catch (err) {
      console.error('Error fetching speaking test data:', err);
      setError(err.message);
      setIsDataReady(false);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStartTest = async () => {
    if (isDataReady && testData) {
      try {
        resetError();
        startTest(); // This will trigger the context's startTest which shows countdown and then starts the test
      } catch (err) {
        console.error('Error starting test:', err);
        setError('Failed to start the speaking test. Please try again.');
      }
    }
  };

  const handleRetry = () => {
    fetchSpeakingData();
  };

  // Determine test type display name
  const getTestTypeName = () => {
    if (type === 'academic') return 'Academic';
    if (type === 'general-training') return 'General Training';
    return 'IELTS';
  };

  const renderError = () => (
    <div className="instructions-container">
      <div className="speaking-header">
        <h1 className="speaking-title">IELTS {getTestTypeName()} Speaking Practice</h1>
        <p className="speaking-subtitle text-red-600">
          Failed to load speaking test
        </p>
      </div>
      
      <div className="instructions-card-compact">
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <span className="material-icons text-red-600 text-2xl">error</span>
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Unable to Load Speaking Test</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRetry}
              className="text-lg font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              <span className="flex items-center gap-2">
                <span className="material-icons">refresh</span>
                Try Again
              </span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="text-lg font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-gray-500 hover:bg-gray-600 text-white"
            >
              <span className="flex items-center gap-2">
                <span className="material-icons">arrow_back</span>
                Go Back
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return renderError();
  }

  return (
    <div className="instructions-container" style={{ maxHeight: '100vh', overflow: 'hidden' }}>
      <div className="speaking-header">
        <h1 className="speaking-title">IELTS {getTestTypeName()} Speaking Practice</h1>
        <p className="speaking-subtitle">
          Practice your spoken English with our AI-powered speaking assessment system
        </p>
      </div>
      
      <div className="instructions-card-compact">
        <h2 className="instructions-title">IELTS {getTestTypeName()} Speaking Test Instructions</h2>
        
        <div className="instructions-content-grid">
          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">record_voice_over</span>
            </div>
            <div className="instruction-details-compact">
              <h3>Test Structure</h3>
              <p><strong>3 Parts</strong> - Introduction, Topic Card, Discussion</p>
            </div>
          </div>

          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">schedule</span>
            </div>
            <div className="instruction-details-compact">
              <h3>Duration</h3>
              <p><strong>11-14 minutes</strong> total speaking time</p>
            </div>
          </div>

          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">mic</span>
            </div>
            <div className="instruction-details-compact">
              <h3>Recording</h3>
              <p><strong>Voice recorded</strong> for AI analysis</p>
            </div>
          </div>

          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">analytics</span>
            </div>
            <div className="instruction-details-compact">
              <h3>Assessment</h3>
              <p><strong>4 Criteria</strong> - Fluency, Vocabulary, Grammar, Pronunciation</p>
            </div>
          </div>

          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">headset_mic</span>
            </div>
            <div className="instruction-details-compact">
              <h3>Requirements</h3>
              <p><strong>Microphone access</strong> required for recording</p>
            </div>
          </div>

          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">feedback</span>
            </div>
            <div className="instruction-details-compact">
              <h3>AI Feedback</h3>
              <p>Get <strong>detailed analysis</strong> and improvement tips</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-gray-800 mb-2">🎙️ What to Expect:</h3>
          <ul className="text-gray-700 text-sm space-y-1">
            <li>• <strong>Part 1:</strong> Personal questions about yourself and familiar topics</li>
            <li>• <strong>Part 2:</strong> Speak about a topic for 1-2 minutes (with preparation time)</li>
            <li>• <strong>Part 3:</strong> Discussion of abstract ideas related to Part 2 topic</li>
            <li>• Each part tests different speaking skills and abilities</li>
            <li>• AI will analyze your fluency, vocabulary, grammar, and pronunciation</li>
          </ul>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
          <h3 className="font-bold text-yellow-800 mb-2">⚠️ Important Notes:</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Ensure your microphone is working properly</li>
            <li>• Find a quiet environment for recording</li>
            <li>• Speak clearly and at a normal pace</li>
            <li>• Don't worry about perfect pronunciation - focus on communication</li>
          </ul>
        </div>

        <div className="start-instruction-compact">
          <p className="text-center font-medium text-gray-800">
            {isDataReady 
              ? "Your speaking test is ready! Click 'Start Test' to begin."
              : "Please wait while we prepare your speaking prompts..."
            }
          </p>
        </div>
        
        <div className="text-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartTest}
            disabled={!isDataReady || loading}
            className={`text-xl font-bold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              (isDataReady && !loading) 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {(isDataReady && !loading) ? (
              <span className="flex items-center gap-3">
                <span className="material-icons">mic</span>
                Start Test
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                Preparing Test...
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SpeakingInstructions;