import React from 'react';
import { Button } from '../../ui/button';
import { useToeflSpeakingContext } from './ToeflSpeakingContext';
import './ToeflSpeaking.css';

const ToeflSpeakingInstructions = () => {
  const { startTest, loading, usingFallback, loadingExam } = useToeflSpeakingContext();
  
  const handleStartTest = () => {
    startTest();
  };
  
  if (loadingExam) {
    return (
      <div className="loading-exam-container">
        <div className="loading-exam-content">
          <h2>Loading Your Speaking Test</h2>
          <div className="loading-spinner"></div>
          <p>Take a deep breath and get ready to speak...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="instructions-container">
      <div className="speaking-header">
        <h1 className="speaking-title">TOEFL iBT Speaking Practice</h1>
        <p className="speaking-subtitle">
          Enhance your speaking skills with authentic TOEFL iBT speaking tasks
        </p>
        {usingFallback && (
          <div className="mt-2 text-amber-600 text-sm">
            <span className="material-icons text-sm align-middle mr-1">info</span>
            Using offline test data
          </div>
        )}
      </div>
      
      <div className="instructions-card">
        <h2 className="instructions-title">About the TOEFL iBT Speaking Section</h2>
        
        <div className="my-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-gray-700">
            The Speaking section assesses your ability to communicate effectively in English 
            in academic situations. You'll record responses to 4 tasks that are evaluated
            on delivery, language use, and topic development.
          </p>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Task Types:</h3>
        
        <ul className="task-list mb-6">
          <li>Task 1: Independent Speaking - Express your opinion on a familiar topic</li>
          <li>Task 2: Campus Situation - Read a passage and respond to a question</li>
          <li>Task 3: Academic Course - Read about an academic concept and explain it</li>
          <li>Task 4: Academic Summary - Read a passage and summarize key points</li>
        </ul>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-3">How This Practice Works:</h3>
        
        <ul className="instructions-list">
          <li>
            <div className="instruction-number">1</div>
            <div className="instruction-text">
              You'll see a task prompt to read and understand
            </div>
          </li>
          <li>
            <div className="instruction-number">2</div>
            <div className="instruction-text">
              Click "Record" to begin recording your answer
            </div>
          </li>
          <li>
            <div className="instruction-number">3</div>
            <div className="instruction-text">
              Click "Stop Recording" when you're finished speaking
            </div>
          </li>
          <li>
            <div className="instruction-number">4</div>
            <div className="instruction-text">
              Complete all tasks to receive detailed AI feedback
            </div>
          </li>
        </ul>
        
        <div className="text-center mt-6">
          <Button 
            className="start-button"
            onClick={handleStartTest}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner inline-block w-5 h-5 mr-2"></span>
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
  );
};

export default ToeflSpeakingInstructions; 