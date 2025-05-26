import React from 'react';
import { useSpeakingContext } from './SpeakingContext';
import { Button } from '../../ui/button';
import './speaking.css';

const SpeakingInstructions = () => {
  const { startTest, fetchTestData, loading, loadingMessage, setLoading, setError, error, resetError, showCountdown, countdownNumber } = useSpeakingContext();
  
  const handleStartTest = async () => {
    try {
      setError(null);
      
      // Fetch test data in background while starting countdown
      console.log("Starting test and fetching data in background");
      fetchTestData();
      
      // Start the test immediately (shows breathe animation)
      console.log("Starting test with countdown animation");
      startTest();
    } catch (error) {
      console.error("Error in handleStartTest:", error);
      setError(`Error starting test: ${error.message}. Using fallback questions.`);
      
      // Still start the test even if there was an error, since we have fallback data
      startTest();
    }
  };
  
  // Show countdown animation when starting test
  if (showCountdown) {
    return (
      <div className="speaking-container">
        <div className="instructions-container">
          <div className="speaking-header">
            <h1 className="speaking-title">IELTS Speaking Practice</h1>
          </div>
        
        <div className="flex flex-col justify-center items-center h-[600px] text-center">
          {/* Main heading with enhanced styling */}
          <h2 className="text-4xl font-bold text-gradient mb-12">
            <span className="breath-text">Take a deep breath</span>
          </h2>
          
          {/* Enhanced countdown animation container */}
          <div className="countdown-animation">
            {/* Floating particles background */}
            <div className="particles-container">
              {[...Array(15)].map((_, index) => (
                <div
                  key={index}
                  className="floating-particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            {/* Rotating rings with dots */}
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
              ? "Preparing your speaking test..."
              : "Your test is ready - good luck!"
            }
          </div>
          
          {/* Breathing guide animation */}
          <div className="breathing-guide">
            <div className="breathing-circle" style={{ 
              animationDuration: `${countdownNumber > 0 ? '4s' : '0s'}`
            }}></div>
            <p className="breathing-text">
              {countdownNumber > 0 ? "Breathe in... and out..." : "Get ready to speak"}
            </p>
          </div>
        </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="speaking-container">
      <div className="instructions-container">
        <div className="speaking-header">
          <h1 className="speaking-title">IELTS Speaking Practice</h1>
          <p className="speaking-subtitle">
            Build confidence and fluency with authentic IELTS speaking tasks
          </p>
        
        {loadingMessage && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg animate-fade-in">
            {loadingMessage}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg animate-fade-in">
            {error}
            <button 
              onClick={resetError} 
              className="ml-2 text-sm text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
      
      <div className="instructions-card-compact">
        <h2 className="instructions-title">IELTS Speaking Test Instructions</h2>
        
        <div className="instructions-content-grid">
          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">record_voice_over</span>
            </div>
            <div className="instruction-details-compact">
              <h3>Test Structure</h3>
              <p><strong>3 Parts</strong> - Interview, Long Turn, Discussion</p>
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
              <span className="material-icons">chat</span>
            </div>
            <div className="instruction-details-compact">
              <h3>Part 1</h3>
              <p><strong>Interview</strong> - Personal questions (4-5 min)</p>
            </div>
          </div>

          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">person</span>
            </div>
            <div className="instruction-details-compact">
              <h3>Part 2</h3>
              <p><strong>Long Turn</strong> - Topic presentation (3-4 min)</p>
            </div>
          </div>

          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">psychology</span>
            </div>
            <div className="instruction-details-compact">
              <h3>Part 3</h3>
              <p><strong>Discussion</strong> - Abstract topics (4-5 min)</p>
            </div>
          </div>

          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">feedback</span>
            </div>
            <div className="instruction-details-compact">
              <h3>AI Feedback</h3>
              <p>Get <strong>detailed analysis</strong> of your performance</p>
            </div>
          </div>
        </div>

        <div className="start-instruction-compact">
          <p className="text-center font-medium text-gray-800">
            Click "Start Test" to begin your IELTS Speaking practice session.
          </p>
        </div>
        
        <div className="text-center">
          <Button 
            onClick={handleStartTest} 
            disabled={loading} 
            className="start-button"
          >
            {loading ? (
              <>
                <span className="material-icons mr-2 animate-spin">refresh</span>
                Loading Test...
              </>
            ) : (
              <>
                <span className="material-icons mr-2">mic</span>
                Start Speaking Test
              </>
            )}
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SpeakingInstructions;