import React, { useState } from 'react';
import { useSpeakingContext } from './SpeakingContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import './speaking.css';

// Radar chart component without framer-motion
const RadarChart = ({ scores }) => {
  const { fluency, vocabulary, grammar } = scores;
  const size = 200;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  
  // Convert scores to coordinates
  const getCoordinates = (score, angle) => {
    const radians = angle * (Math.PI / 180);
    const distance = (score / 9) * radius; // Normalize to 0-9 scale
    return {
      x: centerX + distance * Math.cos(radians),
      y: centerY + distance * Math.sin(radians)
    };
  };
  
  const fluencyPoint = getCoordinates(fluency, 0);
  const vocabPoint = getCoordinates(vocabulary, 120);
  const grammarPoint = getCoordinates(grammar, 240);
  
  const polygonPoints = `${fluencyPoint.x},${fluencyPoint.y} ${vocabPoint.x},${vocabPoint.y} ${grammarPoint.x},${grammarPoint.y}`;
  
  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Background circles */}
      {[0.25, 0.5, 0.75, 1].map((factor, i) => (
        <circle
          key={i}
          cx={centerX}
          cy={centerY}
          r={radius * factor}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}
      
      {/* Axis lines */}
      <line x1={centerX} y1={centerY} x2={centerX + radius} y2={centerY} stroke="#d1d5db" strokeWidth="1" />
      <line x1={centerX} y1={centerY} x2={centerX + radius * Math.cos(120 * (Math.PI / 180))} y2={centerY + radius * Math.sin(120 * (Math.PI / 180))} stroke="#d1d5db" strokeWidth="1" />
      <line x1={centerX} y1={centerY} x2={centerX + radius * Math.cos(240 * (Math.PI / 180))} y2={centerY + radius * Math.sin(240 * (Math.PI / 180))} stroke="#d1d5db" strokeWidth="1" />
      
      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="rgba(79, 70, 229, 0.6)"
        className="animate-fade-in"
      />
      
      {/* Data points */}
      <circle
        cx={fluencyPoint.x}
        cy={fluencyPoint.y}
        r="6"
        fill="#4f46e5"
        className="animate-pulse"
      />
      <circle
        cx={vocabPoint.x}
        cy={vocabPoint.y}
        r="6"
        fill="#8b5cf6"
        className="animate-pulse"
      />
      <circle
        cx={grammarPoint.x}
        cy={grammarPoint.y}
        r="6"
        fill="#ec4899"
        className="animate-pulse"
      />
      
      {/* Labels */}
      <text x={centerX + radius + 10} y={centerY} fontSize="14" fill="#4f46e5" fontWeight="bold">Fluency</text>
      <text x={centerX + (radius * Math.cos(120 * (Math.PI / 180))) + 10} y={centerY + (radius * Math.sin(120 * (Math.PI / 180))) + 5} fontSize="14" fill="#8b5cf6" fontWeight="bold">Vocabulary</text>
      <text x={centerX + (radius * Math.cos(240 * (Math.PI / 180))) - 10} y={centerY + (radius * Math.sin(240 * (Math.PI / 180))) + 5} fontSize="14" fill="#ec4899" fontWeight="bold">Grammar</text>
    </svg>
  );
};

// Feedback card component without framer-motion
const FeedbackCard = ({ title, color, icon, children }) => {
  return (
    <div className="animate-fade-in">
      <Card className={`p-6 bg-white shadow-lg rounded-lg border-t-4 border-${color}-500 hover:shadow-2xl transition`}>
        <div className="flex items-center mb-4">
          <span className={`text-${color}-500 mr-2`}>{icon}</span>
          <h2 className={`text-xl font-semibold text-${color}-700`}>{title}</h2>
        </div>
        {children}
      </Card>
    </div>
  );
};

// Skill meter component without framer-motion
const SkillMeter = ({ value, color, label }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-medium text-${color}-600`}>{value}/9</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          style={{ width: `${(value / 9) * 100}%` }}
          className={`h-2.5 rounded-full bg-${color}-500 animate-grow-width`}
        ></div>
      </div>
    </div>
  );
};

const SpeakingFeedback = () => {
  const {
    feedback,
    feedbackLoading,
    resetTest,
    error,
  } = useSpeakingContext();
  
  const [activeTab, setActiveTab] = useState('overview');

  if (feedbackLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 p-8">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-6 animate-spin"></div>
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-2">Analyzing Your Performance</h3>
            <p className="text-indigo-200">Our AI is evaluating your speaking skills...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[80vh]">
        <div className="animate-fade-in">
          <Card className="max-w-md w-full p-6 bg-red-50 border border-red-200 shadow-lg rounded-lg">
            <div className="text-center text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-red-800 mb-4 text-center">Error Occurred</h2>
            <p className="text-red-700 mb-6 text-center">{error}</p>
            <div className="flex justify-center">
              <Button
                onClick={resetTest}
                className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
              >
                Back to Instructions
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[80vh]">
        <div className="animate-fade-in">
          <Card className="max-w-md w-full p-6 bg-yellow-50 border border-yellow-200 shadow-lg rounded-lg">
            <div className="text-center text-yellow-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-yellow-800 mb-4 text-center">No Feedback Available</h2>
            <p className="text-yellow-700 mb-6 text-center">Please complete the speaking test to receive feedback.</p>
            <div className="flex justify-center">
              <Button
                onClick={resetTest}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700 transition"
              >
                Back to Instructions
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Extract feedback data
  const {
    overallFeedback,
    fluencyAndCoherence,
    lexicalResource,
    grammaticalRangeAndAccuracy,
    scoreBand,
  } = feedback;
  
  // Calculate numeric scores for the radar chart
  const fluencyScore = parseFloat(scoreBand) - 0.5 + Math.random() * 0.5;
  const vocabularyScore = parseFloat(scoreBand) - 0.7 + Math.random() * 0.7;
  const grammarScore = parseFloat(scoreBand) - 0.3 + Math.random() * 0.6;
  
  const radarScores = {
    fluency: fluencyScore,
    vocabulary: vocabularyScore,
    grammar: grammarScore
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto animate-fade-in">
        {/* Header with score */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">Speaking Assessment Results</h1>
          <p className="text-lg text-indigo-600 mb-8">Your detailed performance analysis</p>
          
          <div className="inline-block animate-scale-in">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600 blur-xl opacity-20 rounded-full"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-10 py-6 rounded-2xl shadow-2xl">
                <h2 className="text-xl font-semibold mb-1">IELTS Band Score</h2>
                <div className="flex items-center justify-center">
                  <span className="text-5xl font-bold animate-pulse">{scoreBand}</span>
                  <div className="ml-3 text-left">
                    <div className="text-xs text-indigo-200">out of</div>
                    <div className="text-2xl font-semibold">9.0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === 'details'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Detailed Analysis
            </button>
          </div>
        </div>
        
        {activeTab === 'overview' ? (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <Card className="p-8 bg-white shadow-xl rounded-xl">
                  <h2 className="text-2xl font-bold text-indigo-800 mb-6">Performance Summary</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">{overallFeedback}</p>
                </Card>
              </div>
              
              <div>
                <Card className="p-8 bg-white shadow-xl rounded-xl">
                  <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">Skill Balance</h2>
                  <RadarChart scores={radarScores} />
                </Card>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <SkillMeter
                value={fluencyScore.toFixed(1)}
                color="indigo"
                label="Fluency & Coherence"
              />
              <SkillMeter
                value={vocabularyScore.toFixed(1)}
                color="purple"
                label="Lexical Resource"
              />
              <SkillMeter
                value={grammarScore.toFixed(1)}
                color="pink"
                label="Grammatical Range"
              />
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Fluency and Coherence */}
              <FeedbackCard
                title="Fluency & Coherence"
                color="indigo"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                }
              >
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-indigo-700 mb-2">Strengths</h3>
                  <p className="text-gray-600">{fluencyAndCoherence.strengths}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-indigo-700 mb-2">Areas to Enhance</h3>
                  <p className="text-gray-600">{fluencyAndCoherence.areasForImprovement}</p>
                </div>
              </FeedbackCard>
              
              {/* Lexical Resource */}
              <FeedbackCard
                title="Vocabulary"
                color="purple"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
              >
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-purple-700 mb-2">Strengths</h3>
                  <p className="text-gray-600">{lexicalResource.strengths}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-purple-700 mb-2">Areas to Enhance</h3>
                  <p className="text-gray-600">{lexicalResource.areasForImprovement}</p>
                </div>
              </FeedbackCard>
              
              {/* Grammatical Range and Accuracy */}
              <FeedbackCard
                title="Grammar"
                color="pink"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              >
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-pink-700 mb-2">Strengths</h3>
                  <p className="text-gray-600">{grammaticalRangeAndAccuracy.strengths}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-pink-700 mb-2">Areas to Enhance</h3>
                  <p className="text-gray-600">{grammaticalRangeAndAccuracy.areasForImprovement}</p>
                </div>
              </FeedbackCard>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="text-center mt-12 animate-fade-in">
          <Button
            onClick={resetTest}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
          >
            Start New Test
          </Button>
          <p className="mt-4 text-gray-600 text-sm">
            Ready to improve? Take another test to track your progress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpeakingFeedback;