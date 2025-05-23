import React from 'react';
import { Button } from '../../ui/button';
import { useToeflReadingContext } from './ToeflReadingContext';
import './ToeflReading.css';

const ToeflReadingInstructions = () => {
  const { startTest, usingFallback, showCountdown, countdownNumber } = useToeflReadingContext();
  
  const handleStartTest = () => {
    startTest();
  };
  
  // Show countdown animation when starting test
  if (showCountdown) {
    return (
      <div className="instructions-container">
        <div className="reading-header">
          <h1 className="reading-title">TOEFL iBT Reading Practice</h1>
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
                  key={`particle-${index}`}
                  className="floating-particle"
                  style={{ 
                    '--delay': `${Math.random() * 5}s`,
                    '--duration': `${5 + Math.random() * 10}s`,
                    '--x-start': `${Math.random() * 100}%`,
                    '--x-end': `${Math.random() * 100}%`,
                    '--y-start': `${Math.random() * 100}%`,
                    '--y-end': `${Math.random() * 100}%`,
                    '--size': `${Math.random() * 10 + 5}px`,
                    '--opacity': Math.random() * 0.5 + 0.2
                  }}
                />
              ))}
            </div>
            
            {/* Animated circles */}
            <div className="countdown-ring countdown-ring-1">
              {[...Array(8)].map((_, index) => {
                const angle = (index / 8) * 2 * Math.PI;
                const x = 110 * Math.cos(angle);
                const y = 110 * Math.sin(angle);
                
                return (
                  <div 
                    key={`dot1-${index}`}
                    className="countdown-dot"
                    style={{ 
                      left: `calc(50% + ${x}px)`, 
                      top: `calc(50% + ${y}px)`,
                      opacity: 0.8,
                      transform: 'translate(-50%, -50%)'
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
              {countdownNumber > 0 ? "Breathe in... and out..." : "Focus on your reading"}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="instructions-container">
      <div className="reading-header">
        <h1 className="reading-title">TOEFL iBT Reading Practice</h1>
        <p className="reading-subtitle">
          Enhance your reading comprehension skills with authentic TOEFL iBT passages
        </p>
        {usingFallback && (
          <div className="mt-2 text-amber-600 text-sm">
            <span className="material-icons text-sm align-middle mr-1">info</span>
            Using offline test data
          </div>
        )}
      </div>
      
      <div className="instructions-card-compact">
        <h2 className="instructions-title">TOEFL iBT Reading Section Instructions</h2>
        
        <div className="instructions-content-grid">
          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">article</span>
            </div>
            <div className="instruction-details-compact">
              <h3>Test Structure</h3>
              <p>Read <strong>2 passages</strong> and answer <strong>10 questions each</strong> (20 total).</p>
            </div>
          </div>

          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">schedule</span>
            </div>
            <div className="instruction-details-compact">
              <h3>Time Management</h3>
              <p><strong>35 minutes</strong> total. Manage your time carefully.</p>
            </div>
          </div>

          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">navigation</span>
            </div>
            <div className="instruction-details-compact">
              <h3>Navigation</h3>
              <p>Navigate <strong>back and forth</strong> through questions.</p>
            </div>
          </div>

          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">quiz</span>
            </div>
            <div className="instruction-details-compact">
              <h3>Question Types</h3>
              <p><strong>Multiple-choice</strong> with various formats.</p>
            </div>
          </div>

          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">rate_review</span>
            </div>
            <div className="instruction-details-compact">
              <h3>Review Feature</h3>
              <p>Click <strong>"Review"</strong> to check answers.</p>
            </div>
          </div>

          <div className="instruction-block-compact">
            <div className="instruction-icon-small">
              <span className="material-icons">score</span>
            </div>
            <div className="instruction-details-compact">
              <h3>Scoring</h3>
              <p>Receive <strong>immediate feedback</strong> after completion.</p>
            </div>
          </div>
        </div>

        <div className="start-instruction-compact">
          <p className="text-center font-medium text-gray-800">
            Click "Start Exam" to begin your TOEFL Reading test.
          </p>
        </div>
        
        <div className="text-center">
          <Button 
            className="start-button"
            onClick={handleStartTest}
          >
            <span className="material-icons mr-2">menu_book</span>
            Start Exam
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToeflReadingInstructions; 