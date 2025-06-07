import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WritingPage from './writingPage';
import { useTimer } from '../../../lib/TimerContext';
import ExamContainer from '../../ui/ExamContainer';

const WritingHome = () => {
  const navigate = useNavigate();
  const { type } = useParams(); // Get IELTS type from URL (academic or general-training)
  const { resetTimer, setTimerStarted } = useTimer();
  const [showInstructions, setShowInstructions] = useState(true);
  
  const handleBackToStart = () => {
    resetTimer();
    // Navigate back to the appropriate skills page based on type
    if (type) {
      navigate(`/ielts/${type}/skills`);
    } else {
      navigate('/skills'); // Fallback for legacy routes
    }
  };

  const handleStartNow = () => {
    // Only start the timer when user clicks "Start Exam"
    setTimerStarted(true);
    setShowInstructions(false);
  };

  // Determine test type display name
  const getTestTypeName = () => {
    if (type === 'academic') return 'Academic';
    if (type === 'general-training') return 'General Training';
    return 'IELTS'; // Fallback for legacy routes
  };

  // Get test type specific instructions
  const getTestTypeInstructions = () => {
    if (type === 'academic') {
      return {
        task1: 'Task 1: Describe visual data (graph, chart, diagram) - 150+ words',
        task2: 'Task 2: Academic essay with argument/discussion - 250+ words',
        description: 'Academic IELTS Writing focuses on formal, academic language and analytical skills.'
      };
    } else if (type === 'general-training') {
      return {
        task1: 'Task 1: Write a letter (formal, semi-formal, or informal) - 150+ words',
        task2: 'Task 2: Essay on general interest topics - 250+ words',
        description: 'General Training IELTS Writing focuses on practical, everyday communication skills.'
      };
    } else {
      return {
        task1: 'Task 1: Describe visuals or write letters - 150+ words',
        task2: 'Task 2: Essay writing - 250+ words',
        description: 'Master the art of academic writing with authentic IELTS tasks.'
      };
    }
  };

  const testTypeInstructions = getTestTypeInstructions();

  const renderInstructions = () => (
    <ExamContainer>
      <div className="instructions-container">
        <div className="writing-header">
          <h1 className="writing-title">IELTS {getTestTypeName()} Writing Practice</h1>
          <p className="writing-subtitle">
            {testTypeInstructions.description}
          </p>
        </div>
        
        <div className="instructions-card-compact">
          <h2 className="instructions-title">IELTS {getTestTypeName()} Writing Test Instructions</h2>
          
          <div className="instructions-content-grid">
            <div className="instruction-block-compact">
              <div className="instruction-icon-small">
                <span className="material-icons">edit_note</span>
              </div>
              <div className="instruction-details-compact">
                <h3>Test Structure</h3>
                <p><strong>2 Tasks</strong> - Task 1 (150+ words) & Task 2 (250+ words)</p>
              </div>
            </div>

            <div className="instruction-block-compact">
              <div className="instruction-icon-small">
                <span className="material-icons">schedule</span>
              </div>
              <div className="instruction-details-compact">
                <h3>Time Management</h3>
                <p><strong>60 minutes</strong> total - Plan: 20 min + 40 min</p>
              </div>
            </div>

            <div className="instruction-block-compact">
              <div className="instruction-icon-small">
                <span className="material-icons">task_alt</span>
              </div>
              <div className="instruction-details-compact">
                <h3>Task Types</h3>
                <div>
                  <p><strong>Task 1:</strong> {testTypeInstructions.task1.split(' - ')[0]}</p>
                  <p><strong>Task 2:</strong> {testTypeInstructions.task2.split(' - ')[0]}</p>
                </div>
              </div>
            </div>

            <div className="instruction-block-compact">
              <div className="instruction-icon-small">
                <span className="material-icons">analytics</span>
              </div>
              <div className="instruction-details-compact">
                <h3>Assessment</h3>
                <p><strong>4 Criteria</strong> - Task Response, Coherence, Lexical, Grammar</p>
              </div>
            </div>

            <div className="instruction-block-compact">
              <div className="instruction-icon-small">
                <span className="material-icons">priority_high</span>
              </div>
              <div className="instruction-details-compact">
                <h3>Key Points</h3>
                <p>Task 2 counts <strong>twice</strong> as much as Task 1</p>
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

          <div className="start-instruction-compact">
            <p className="text-center font-medium text-gray-800">
              Click "Start Exam" to begin your IELTS {getTestTypeName()} Writing test.
            </p>
          </div>
          
          <div className="text-center">
            <button 
              onClick={handleStartNow}
              className="start-button"
            >
              <span className="material-icons mr-2">edit</span>
              Start Exam
            </button>
          </div>
        </div>
      </div>
    </ExamContainer>
  );

  return showInstructions ? renderInstructions() : <WritingPage onBackToStart={handleBackToStart} testType={type} />;
};

export default WritingHome;