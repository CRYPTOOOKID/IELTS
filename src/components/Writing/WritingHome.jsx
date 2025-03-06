import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import WritingPage from './writingPage';

const WritingHome = () => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(true);
  
  const handleBackToStart = () => {
    navigate('/');
  };

  const handleStartNow = () => {
    setShowInstructions(false);
  };

  const renderInstructions = () => (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6 text-primary-deep">IELTS Writing Test Instructions</h2>
        
        <Card className="mb-8 p-6 text-left">
          <h3 className="text-xl font-semibold mb-4">About the IELTS Writing Test</h3>
          <p className="mb-4">
            The IELTS Writing test consists of two tasks. You will need to complete both tasks to receive a complete evaluation.
          </p>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Task 1:</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>You will be presented with a graph, table, chart, or diagram and asked to describe, summarize, or explain the information in your own words.</li>
              <li>You may be asked to describe and explain data, describe the stages of a process, how something works, or describe an object or event.</li>
              <li>You should write at least 150 words.</li>
              <li>You should spend about 20 minutes on this task.</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Task 2:</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>You will be presented with a point of view, argument, or problem.</li>
              <li>You need to write an essay in response, providing your perspective, discussing both sides of an argument, evaluating ideas, or offering solutions to the problem.</li>
              <li>You should write at least 250 words.</li>
              <li>You should spend about 40 minutes on this task.</li>
              <li>Task 2 contributes twice as much as Task 1 to your final Writing band score.</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Assessment Criteria:</h4>
            <p className="mb-2">Your writing will be assessed on:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="font-medium">Task Achievement/Response:</span> How well you address all parts of the task with relevant, fully extended ideas.</li>
              <li><span className="font-medium">Coherence and Cohesion:</span> How well you organize information and ideas with clear progression and appropriate use of cohesive devices.</li>
              <li><span className="font-medium">Lexical Resource:</span> The range and accuracy of your vocabulary.</li>
              <li><span className="font-medium">Grammatical Range and Accuracy:</span> The range and accuracy of your grammar.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Important Tips:</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Plan your time carefully to complete both tasks.</li>
              <li>Write clearly and organize your ideas logically.</li>
              <li>Use a variety of sentence structures and vocabulary.</li>
              <li>Stay on topic and address all parts of the task.</li>
              <li>Check your work for errors when you finish.</li>
            </ul>
          </div>
        </Card>
        
        <div className="flex justify-between">
          <Button onClick={handleBackToStart} className="back-button">
            Return to Home
          </Button>
          <Button onClick={handleStartNow} className="submit-button">
            Start Now
          </Button>
        </div>
      </div>
    </div>
  );

  return showInstructions ? renderInstructions() : <WritingPage onBackToStart={handleBackToStart} />;
};

export default WritingHome;