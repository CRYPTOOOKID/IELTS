import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimer } from '../../../lib/TimerContext';
import ExamContainer from '../../ui/ExamContainer';
import './ReadingExam.css';

const ReadingInstructions = () => {
  const navigate = useNavigate();
  const { resetTimer, setTimerStarted } = useTimer();

  const startExam = () => {
    // Start the timer when navigating to the exam
    setTimerStarted(true);
    navigate('/ielts/reading/exam');
  };

  return (
    <ExamContainer>
      <div className="instructions-container">
        <div className="reading-header">
          <h1 className="reading-title">IELTS Reading Practice</h1>
          <p className="reading-subtitle">
            Master reading comprehension with authentic IELTS passages
          </p>
        </div>
        
        <div className="instructions-card-compact">
          <h2 className="instructions-title">IELTS Reading Test Instructions</h2>
          
          <div className="instructions-content-grid">
            <div className="instruction-block-compact">
              <div className="instruction-icon-small">
                <span className="material-icons">menu_book</span>
              </div>
              <div className="instruction-details-compact">
                <h3>Test Structure</h3>
                <p><strong>3 Sections</strong> - 40 questions with increasing difficulty</p>
              </div>
            </div>

            <div className="instruction-block-compact">
              <div className="instruction-icon-small">
                <span className="material-icons">schedule</span>
              </div>
              <div className="instruction-details-compact">
                <h3>Duration</h3>
                <p><strong>60 minutes</strong> - No extra time for transfers</p>
              </div>
            </div>

            <div className="instruction-block-compact">
              <div className="instruction-icon-small">
                <span className="material-icons">quiz</span>
              </div>
              <div className="instruction-details-compact">
                <h3>Question Types</h3>
                <p><strong>Various formats</strong> - Multiple choice, matching, fill-ins</p>
              </div>
            </div>

            <div className="instruction-block-compact">
              <div className="instruction-icon-small">
                <span className="material-icons">rule</span>
              </div>
              <div className="instruction-details-compact">
                <h3>Important Rules</h3>
                <p><strong>Spelling counts</strong> - Answers must be accurate</p>
              </div>
            </div>

            <div className="instruction-block-compact">
              <div className="instruction-icon-small">
                <span className="material-icons">tips_and_updates</span>
              </div>
              <div className="instruction-details-compact">
                <h3>Time Strategy</h3>
                <p><strong>20 min per section</strong> - Don't spend too long on difficult questions</p>
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
              Click "Start Exam" to begin your IELTS Reading test.
            </p>
          </div>
          
          <div className="text-center">
            <button 
              onClick={startExam}
              className="start-button"
            >
              <span className="material-icons mr-2">menu_book</span>
              Start Exam
            </button>
          </div>
        </div>
      </div>
    </ExamContainer>
  );
};

export default ReadingInstructions; 