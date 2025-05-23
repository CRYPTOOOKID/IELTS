import React from 'react';
import { ToeflReadingProvider, useToeflReadingContext } from './ToeflReadingContext';
import ToeflReadingInstructions from './ToeflReadingInstructions';
import ToeflReadingTask from './ToeflReadingTask';
import ToeflReadingFeedback from './ToeflReadingFeedback';
import './ToeflReading.css';

const ToeflReadingContent = () => {
  const { 
    showInstructions, 
    showFeedback, 
    error, 
    loadingExam 
  } = useToeflReadingContext();

  if (error) {
    return (
      <div className="toefl-reading-container">
        <div className="error-container">
          <div className="error-icon">
            <span className="material-icons">error</span>
          </div>
          <div className="error-title">Unable to Load Test</div>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  if (loadingExam) {
    return <ToeflReadingInstructions />;
  }

  if (showInstructions) {
    return <ToeflReadingInstructions />;
  }

  if (showFeedback) {
    return <ToeflReadingFeedback />;
  }

  return (
    <div className="toefl-reading-container">
      <ToeflReadingTask />
    </div>
  );
};

const ToeflReadingHome = () => {
  return (
    <ToeflReadingProvider>
      <ToeflReadingContent />
    </ToeflReadingProvider>
  );
};

export default ToeflReadingHome; 