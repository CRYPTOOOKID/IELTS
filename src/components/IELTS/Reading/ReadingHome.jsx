import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReadingHome.css';

const ReadingHome = () => {
  const navigate = useNavigate();
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testData, setTestData] = useState(null);

  // Countdown effect
  useEffect(() => {
    if (showCountdown) {
      if (countdownNumber > 0) {
        const timer = setTimeout(() => {
          setCountdownNumber(countdownNumber - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // When countdown reaches 0, navigate to exam with test data
        setShowCountdown(false);
        navigate('/ielts/reading/exam', { state: { testData } });
      }
    }
  }, [countdownNumber, showCountdown, navigate, testData]);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const testIdToFetch = "reading_gt_1";
      const apiUrl = `https://xguxnr9iu0.execute-api.us-east-1.amazonaws.com/live/tests/${testIdToFetch}`;
      
      console.log(`Fetching reading test data from: ${apiUrl}`);
      
      const response = await fetch(apiUrl, { 
        method: 'GET', 
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        let errorPayload = null; 
        try { errorPayload = await response.json(); } catch (e) {}
        const errorMsg = errorPayload?.message || errorPayload?.error || `Request failed with status: ${response.status}`;
        throw new Error(errorMsg);
      }
      
      const responseData = await response.json();
      console.log("Raw API response data:", responseData);
      
      let finalTestData = null;
      if (responseData?.testData && typeof responseData.testData === 'string') {
        try { 
          finalTestData = JSON.parse(responseData.testData); 
        } catch (parseError) { 
          throw new Error("Failed to parse the test data received from the API."); 
        }
      } else if (responseData?.sections && Array.isArray(responseData.sections)) { 
        finalTestData = responseData; 
      } else { 
        throw new Error("Received unexpected data format from the API."); 
      }
      
      if (!finalTestData?.sections || !Array.isArray(finalTestData.sections) || finalTestData.sections.length === 0) { 
        throw new Error("Invalid data format: 'sections' array is missing or empty."); 
      }
      
      console.log("Successfully fetched and validated final test data.");
      setTestData(finalTestData);
      
    } catch (err) {
      console.error('Error loading test:', err);
      setError(err.message);
      setShowCountdown(false);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = () => {
    // Start countdown animation immediately
    setShowCountdown(true);
    setCountdownNumber(3);
    
    // Fetch data in background while countdown plays
    fetchTestData();
  };

  const handleBack = () => {
    navigate('/ielts-skills');
  };

  // Show countdown animation
  if (showCountdown) {
    return (
      <div className="countdown-container">
        <div className="countdown-animation">
          {/* Floating particles */}
          <div className="particles-container">
            {[...Array(20)].map((_, index) => (
              <div 
                key={`particle-${index}`}
                className="floating-particle"
                style={{ 
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          
          {/* Orbital rings */}
          <div className="countdown-ring countdown-ring-1">
            {[...Array(10)].map((_, index) => {
              const angle = (index / 10) * 2 * Math.PI;
              const x = 100 * Math.cos(angle);
              const y = 100 * Math.sin(angle);
              
              return (
                <div 
                  key={`dot1-${index}`}
                  className="countdown-dot"
                  style={{ 
                    left: `calc(50% + ${x}px)`, 
                    top: `calc(50% + ${y}px)`,
                    opacity: 0.8,
                    transform: 'translate(-50%, -50%)',
                    width: '12px',
                    height: '12px'
                  }}
                />
              );
            })}
          </div>
          
          <div className="countdown-ring countdown-ring-2">
            {[...Array(12)].map((_, index) => {
              const angle = (index / 12) * 2 * Math.PI;
              const x = 80 * Math.cos(angle);
              const y = 80 * Math.sin(angle);
              
              return (
                <div 
                  key={`dot2-${index}`}
                  className="countdown-dot"
                  style={{ 
                    left: `calc(50% + ${x}px)`, 
                    top: `calc(50% + ${y}px)`,
                    opacity: 0.6,
                    transform: 'translate(-50%, -50%)',
                    width: '8px',
                    height: '8px'
                  }}
                />
              );
            })}
          </div>
          
          {/* Central countdown number */}
          <div className="countdown-center">
            {countdownNumber > 0 ? (
              <div className="countdown-number">{countdownNumber}</div>
            ) : (
              <div className="countdown-go">GO!</div>
            )}
          </div>
        </div>
        
        <div className="countdown-message" style={{ animationDelay: '0.3s' }}>
          {countdownNumber > 0 
            ? "Preparing your reading test..."
            : "Your test is ready - good luck!"
          }
        </div>
        
        {/* Breathing guide animation */}
        <div className="breathing-guide">
          <div className="breathing-circle" style={{ 
            animationDuration: `${countdownNumber > 0 ? '4s' : '0s'}`
          }}></div>
          <p className="breathing-text">
            {countdownNumber > 0 ? "Breathe in... and out..." : "Get ready to read"}
          </p>
        </div>
        
        {error && (
          <div className="error-message">
            <p>Error loading test: {error}</p>
            <button onClick={() => navigate('/ielts/reading')} className="back-button">
              Back to Reading Home
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span className="material-icons">arrow_back</span>
            <span>Back to Skills</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">IELTS Reading Practice</h1>
          <div></div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-blue-600 text-3xl">menu_book</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reading Test</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Practice your reading skills with authentic IELTS-style passages and questions. 
              Test your comprehension, vocabulary, and analytical abilities.
            </p>
          </div>

          {/* Test Information */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <span className="material-icons text-blue-600 text-2xl mb-2">schedule</span>
              <h3 className="font-semibold text-gray-800 mb-1">Duration</h3>
              <p className="text-gray-600">60 minutes</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <span className="material-icons text-green-600 text-2xl mb-2">quiz</span>
              <h3 className="font-semibold text-gray-800 mb-1">Questions</h3>
              <p className="text-gray-600">40 questions</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <span className="material-icons text-purple-600 text-2xl mb-2">article</span>
              <h3 className="font-semibold text-gray-800 mb-1">Passages</h3>
              <p className="text-gray-600">3 passages</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">Test Instructions</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="material-icons text-sm mt-1">check_circle</span>
                <span>Read each passage carefully and answer all questions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="material-icons text-sm mt-1">check_circle</span>
                <span>You have 60 minutes to complete all 40 questions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="material-icons text-sm mt-1">check_circle</span>
                <span>Questions include multiple choice, true/false, and completion tasks</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="material-icons text-sm mt-1">check_circle</span>
                <span>Your progress will be saved automatically</span>
              </li>
            </ul>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStartTest}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center space-x-2">
                {loading ? (
                  <>
                    <span className="material-icons animate-spin">refresh</span>
                    <span>Loading Test...</span>
                  </>
                ) : (
                  <>
                    <span className="material-icons">play_arrow</span>
                    <span>Start Reading Test</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingHome; 