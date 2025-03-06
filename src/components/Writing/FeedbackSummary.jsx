import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, TabletSmartphone, ArrowUpRight, LayoutGrid, Layers, PieChart, BookOpen, Fingerprint, BrainCircuit, Award, Target, Sparkles, TrendingUp, Zap, AlertTriangle } from 'lucide-react';

// Component for the score display with circular progress indicator
const ScoreCircle = ({ score, label, size = "md", animate = false }) => {
  // Calculate the circumference and stroke-dasharray based on the score
  const radius = size === "lg" ? 40 : size === "md" ? 30 : 20;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 9) * circumference;
  
  const sizeClasses = {
    lg: "w-28 h-28 text-4xl",
    md: "w-20 h-20 text-2xl",
    sm: "w-16 h-16 text-xl"
  };

  const scoreColor = score >= 7 ? "#22c55e" : score >= 6 ? "#3b82f6" : score >= 5 ? "#f59e0b" : "#ef4444";
  
  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        <svg className="w-full h-full" viewBox={`0 0 ${radius * 2 + 10} ${radius * 2 + 10}`}>
          <circle
            cx={radius + 5}
            cy={radius + 5}
            r={radius}
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="5"
          />
          <circle
            cx={radius + 5}
            cy={radius + 5}
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            transform={`rotate(-90 ${radius + 5} ${radius + 5})`}
            strokeLinecap="round"
            className={animate ? "animate-circle-fill" : ""}
          />
        </svg>
        <div className="absolute font-bold" style={{ color: scoreColor }}>{score.toFixed(1)}</div>
      </div>
      {label && <p className="mt-2 text-center text-sm font-medium text-gray-700">{label}</p>}
    </div>
  );
};

// Component for category feedback with score bar and comments
const CategoryFeedback = ({ title, score, percentage, comments, expanded, onToggle, icon }) => {
  const scoreColor = score >= 7 ? "bg-green-500" : score >= 6 ? "bg-blue-500" : score >= 5 ? "bg-amber-500" : "bg-red-500";
  
  return (
    <div className="category-box transition-all duration-300 hover:shadow-md bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          {icon && <span className="mr-2 text-indigo-600">{icon}</span>}
          <h4 className="font-medium text-gray-800">{title}</h4>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-white font-bold px-3 py-1 rounded-md" style={{ backgroundColor: score >= 7 ? "#22c55e" : score >= 6 ? "#3b82f6" : score >= 5 ? "#f59e0b" : "#ef4444" }}>
            {score.toFixed(1)}
          </span>
          <button
            onClick={onToggle}
            className="p-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex items-center"
            aria-label={expanded ? "Hide details" : "Show details"}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
      
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full ${scoreColor} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      {expanded && (
        <div className="bg-gray-50 p-4 mt-3 rounded-md border border-gray-200 shadow-sm animate-fadeIn">
          <ul className="space-y-3 text-sm">
            {comments.map((comment, idx) => (
              <li key={idx} className="flex items-start feedback-comment">
                <span className="mr-3 flex-shrink-0 mt-0.5">
                  {comment.includes("improvement") || comment.includes("could") ?
                    <AlertCircle size={16} className="text-amber-500" /> :
                    <CheckCircle size={16} className="text-green-600" />
                  }
                </span>
                <span className="text-gray-700 font-medium">{comment}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Component for feedback items in a card layout
const FeedbackCard = ({ item, type, icon }) => {
  const isStrength = type === 'strength';
  const bgColor = isStrength ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-amber-50 to-orange-50';
  const borderColor = isStrength ? 'border-green-200' : 'border-amber-200';
  const textColor = isStrength ? 'text-green-700' : 'text-amber-700';
  const iconColor = isStrength ? 'text-green-500' : 'text-amber-500';
  
  return (
    <div className={`p-4 rounded-lg shadow-sm ${bgColor} border ${borderColor} hover:shadow-md transition-all duration-300 feedback-card`}>
      <div className="flex items-start">
        <span className={`mr-3 flex-shrink-0 mt-1 ${iconColor}`}>
          {icon || (isStrength ? <CheckCircle size={18} /> : <AlertCircle size={18} />)}
        </span>
        <p className={`${textColor} font-medium`}>{item}</p>
      </div>
    </div>
  );
};

// Strength and improvement icons
const strengthIcons = [<Award size={18} />, <TrendingUp size={18} />, <Sparkles size={18} />, <Zap size={18} />];
const improvementIcons = [<Target size={18} />, <AlertTriangle size={18} />];

const FeedbackSummary = ({ feedback, onBack }) => {
  // State for active task tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for expanded categories
  const [expandedCategories, setExpandedCategories] = useState({
    task1Achievement: false,
    task1Coherence: false,
    task1Lexical: false,
    task1Grammar: false,
    task2Achievement: false,
    task2Coherence: false,
    task2Lexical: false,
    task2Grammar: false
  });
  
  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Category icons
  const categoryIcons = {
    taskAchievement: <Fingerprint size={18} />,
    coherenceCohesion: <Layers size={18} />,
    lexicalResource: <BookOpen size={18} />,
    grammaticalRange: <BrainCircuit size={18} />
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <Button onClick={onBack} className="back-button mb-6">
        <ArrowUpRight size={16} className="mr-2" /> Back to Home
      </Button>
      
      {/* Tabs navigation */}
      <div className="feedback-tab-container mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`feedback-tab ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <PieChart size={16} className="inline-block mr-2" />
          Assessment Overview
        </button>
        <button
          onClick={() => setActiveTab('task1')}
          className={`feedback-tab ${activeTab === 'task1' ? 'active' : ''}`}
        >
          <LayoutGrid size={16} className="inline-block mr-2" />
          Task 1 Feedback
        </button>
        <button
          onClick={() => setActiveTab('task2')}
          className={`feedback-tab ${activeTab === 'task2' ? 'active' : ''}`}
        >
          <TabletSmartphone size={16} className="inline-block mr-2" />
          Task 2 Feedback
        </button>
      </div>
      
      {/* Overview tab content */}
      {activeTab === 'overview' && (
     <div className="fade-in">
          <div className="feedback-content">
            <div className="feedback-header">
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between">
                <div className="text-center lg:text-left mb-6 lg:mb-0">
                  <h2 className="text-2xl font-bold text-indigo-700 mb-2">IELTS Writing Assessment</h2>
                  <p className="text-gray-600">Your detailed feedback and scores</p>
                </div>
                <ScoreCircle score={feedback.finalScore} label="Overall Band" size="lg" animate={true} />
              </div>
            </div>
            
            <div className="feedback-body">
              {/* Score summary section */}
              <div className="score-section mb-8">
                <div className="score-item">
                  <div className="score-label">Task 1 Score</div>
                  <div className="score-value">{feedback.task1.overallScore.toFixed(1)}</div>
                  <div className="text-xs text-gray-500 mt-1">Graph/Chart Description</div>
                </div>
                
                <div className="score-item">
                  <div className="score-label">Overall Band</div>
                  <div className="score-value text-indigo-600 text-2xl">{feedback.finalScore.toFixed(1)}</div>
                  <div className="text-xs text-gray-500 mt-1">Final Assessment</div>
                </div>
                
                <div className="score-item">
                  <div className="score-label">Task 2 Score</div>
                  <div className="score-value">{feedback.task2.overallScore.toFixed(1)}</div>
                  <div className="text-xs text-gray-500 mt-1">Essay Writing</div>
                </div>
              </div>
              
              {/* Overall Assessment */}
              <div className="feedback-summary-box mb-6">
                <h3 className="text-lg font-medium text-indigo-700 mb-3">Overall Assessment</h3>
                <p className="text-gray-700 leading-relaxed">
                  {feedback.overallFeedback}
                </p>
              </div>
            </div>
          </div>
          
          {/* Strengths and Improvements Overview */}
          <div className="feedback-section mb-8">
            {/* Strengths Section */}
            <div className="feedback-content mb-8">
              <div className="feedback-header">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 mr-3">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Key Strengths</h3>
                </div>
              </div>
              
              <div className="feedback-body">
                <div className="feedback-category">
                  <div className="category-header">
                    <LayoutGrid size={20} />
                    <h4 className="font-medium text-gray-800">Task 1 Strengths</h4>
                  </div>
                  <div className="category-content">
                    {feedback.task1.strengths.map((strength, idx) => (
                      <div className="feedback-badge badge-good" key={idx}>
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="feedback-category">
                  <div className="category-header">
                    <TabletSmartphone size={20} />
                    <h4 className="font-medium text-gray-800">Task 2 Strengths</h4>
                  </div>
                  <div className="category-content">
                    {feedback.task2.strengths.map((strength, idx) => (
                      <div className="feedback-badge badge-good" key={idx}>
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Improvements Section */}
            <div className="feedback-content">
              <div className="feedback-header">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-amber-100 mr-3">
                    <AlertCircle size={20} className="text-amber-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Areas for Improvement</h3>
                </div>
              </div>
              
              <div className="feedback-body">
                <div className="feedback-category">
                  <div className="category-header">
                    <LayoutGrid size={20} />
                    <h4 className="font-medium text-gray-800">Task 1 Improvements</h4>
                  </div>
                  <div className="category-content">
                    {feedback.task1.improvements.map((improvement, idx) => (
                      <div className="feedback-badge badge-improve" key={idx}>
                        {improvement}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="feedback-category">
                  <div className="category-header">
                    <TabletSmartphone size={20} />
                    <h4 className="font-medium text-gray-800">Task 2 Improvements</h4>
                  </div>
                  <div className="category-content">
                    {feedback.task2.improvements.map((improvement, idx) => (
                      <div className="feedback-badge badge-improve" key={idx}>
                        {improvement}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Task 1 tab content */}
      {activeTab === 'task1' && (
        <div className="fade-in">
          <div className="feedback-content">
            <div className="feedback-header">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-indigo-700">Task 1 Detailed Assessment</h2>
                <ScoreCircle score={feedback.task1.overallScore} size="sm" />
              </div>
              
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <h3 className="text-sm font-medium text-indigo-700 mb-1">Task Description:</h3>
                <p className="text-sm text-gray-700">Graph/Chart Description - Summarize information by selecting and reporting main features, and make comparisons where relevant.</p>
              </div>
            </div>
            
            <div className="feedback-body">
              <h3 className="text-lg font-semibold mb-4">Assessment Categories</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="collapsible-section">
                  <div
                    className="collapsible-header"
                    onClick={() => toggleCategory('task1Achievement')}
                  >
                    <div className="flex items-center">
                      {categoryIcons.taskAchievement}
                      <span className="ml-2 font-medium">Task Achievement</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-indigo-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        {feedback.task1.categories.taskAchievement.score.toFixed(1)}
                      </span>
                      {expandedCategories.task1Achievement ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  <div className={`collapsed-content ${expandedCategories.task1Achievement ? 'expanded' : ''}`}>
                    <div className="p-4 bg-gray-50 rounded-md mt-2">
                      <div className="h-2 bg-gray-200 rounded-full mb-4">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{width: `${feedback.task1.categories.taskAchievement.percentage}%`}}
                        ></div>
                      </div>
                      <ul className="space-y-2">
                        {feedback.task1.categories.taskAchievement.comments.map((comment, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 mt-1">
                              {comment.includes("improvement") || comment.includes("could") ?
                                <AlertCircle size={14} className="text-amber-500" /> :
                                <CheckCircle size={14} className="text-green-600" />
                              }
                            </span>
                            <span className="text-sm">{comment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="collapsible-section">
                  <div
                    className="collapsible-header"
                    onClick={() => toggleCategory('task1Coherence')}
                  >
                    <div className="flex items-center">
                      {categoryIcons.coherenceCohesion}
                      <span className="ml-2 font-medium">Coherence & Cohesion</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-indigo-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        {feedback.task1.categories.coherenceCohesion.score.toFixed(1)}
                      </span>
                      {expandedCategories.task1Coherence ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  <div className={`collapsed-content ${expandedCategories.task1Coherence ? 'expanded' : ''}`}>
                    <div className="p-4 bg-gray-50 rounded-md mt-2">
                      <div className="h-2 bg-gray-200 rounded-full mb-4">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{width: `${feedback.task1.categories.coherenceCohesion.percentage}%`}}
                        ></div>
                      </div>
                      <ul className="space-y-2">
                        {feedback.task1.categories.coherenceCohesion.comments.map((comment, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 mt-1">
                              {comment.includes("improvement") || comment.includes("could") ?
                                <AlertCircle size={14} className="text-amber-500" /> :
                                <CheckCircle size={14} className="text-green-600" />
                              }
                            </span>
                            <span className="text-sm">{comment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="collapsible-section">
                  <div
                    className="collapsible-header"
                    onClick={() => toggleCategory('task1Lexical')}
                  >
                    <div className="flex items-center">
                      {categoryIcons.lexicalResource}
                      <span className="ml-2 font-medium">Lexical Resource</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-indigo-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        {feedback.task1.categories.lexicalResource.score.toFixed(1)}
                      </span>
                      {expandedCategories.task1Lexical ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  <div className={`collapsed-content ${expandedCategories.task1Lexical ? 'expanded' : ''}`}>
                    <div className="p-4 bg-gray-50 rounded-md mt-2">
                      <div className="h-2 bg-gray-200 rounded-full mb-4">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{width: `${feedback.task1.categories.lexicalResource.percentage}%`}}
                        ></div>
                      </div>
                      <ul className="space-y-2">
                        {feedback.task1.categories.lexicalResource.comments.map((comment, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 mt-1">
                              {comment.includes("improvement") || comment.includes("could") ?
                                <AlertCircle size={14} className="text-amber-500" /> :
                                <CheckCircle size={14} className="text-green-600" />
                              }
                            </span>
                            <span className="text-sm">{comment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="collapsible-section">
                  <div
                    className="collapsible-header"
                    onClick={() => toggleCategory('task1Grammar')}
                  >
                    <div className="flex items-center">
                      {categoryIcons.grammaticalRange}
                      <span className="ml-2 font-medium">Grammatical Range & Accuracy</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-indigo-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        {feedback.task1.categories.grammaticalRange.score.toFixed(1)}
                      </span>
                      {expandedCategories.task1Grammar ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  <div className={`collapsed-content ${expandedCategories.task1Grammar ? 'expanded' : ''}`}>
                    <div className="p-4 bg-gray-50 rounded-md mt-2">
                      <div className="h-2 bg-gray-200 rounded-full mb-4">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{width: `${feedback.task1.categories.grammaticalRange.percentage}%`}}
                        ></div>
                      </div>
                      <ul className="space-y-2">
                        {feedback.task1.categories.grammaticalRange.comments.map((comment, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 mt-1">
                              {comment.includes("improvement") || comment.includes("could") ?
                                <AlertCircle size={14} className="text-amber-500" /> :
                                <CheckCircle size={14} className="text-green-600" />
                              }
                            </span>
                            <span className="text-sm">{comment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-full bg-green-100 mr-3">
                      <CheckCircle size={18} className="text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-800">Strengths</h4>
                  </div>
                  {feedback.task1.strengths.map((strength, idx) => (
                    <div key={idx} className="feedback-badge badge-good">
                      {strength}
                    </div>
                  ))}
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-full bg-amber-100 mr-3">
                      <AlertCircle size={18} className="text-amber-600" />
                    </div>
                    <h4 className="font-medium text-gray-800">Areas for Improvement</h4>
                  </div>
                  {feedback.task1.improvements.map((improvement, idx) => (
                    <div key={idx} className="feedback-badge badge-improve">
                      {improvement}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Task 2 tab content */}
      {activeTab === 'task2' && (
        <div className="fade-in">
          <div className="feedback-content">
            <div className="feedback-header">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-indigo-700">Task 2 Detailed Assessment</h2>
                <ScoreCircle score={feedback.task2.overallScore} size="sm" />
              </div>
              
              <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <h3 className="text-sm font-medium text-indigo-700 mb-1">Task Description:</h3>
                <p className="text-sm text-gray-700">Essay Writing - Present a written argument or case to an educated reader with no specialist knowledge of the topic.</p>
              </div>
            </div>
            
            <div className="feedback-body">
              <h3 className="text-lg font-semibold mb-4">Assessment Categories</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="collapsible-section">
                  <div
                    className="collapsible-header"
                    onClick={() => toggleCategory('task2Achievement')}
                  >
                    <div className="flex items-center">
                      {categoryIcons.taskAchievement}
                      <span className="ml-2 font-medium">Task Achievement</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-indigo-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        {feedback.task2.categories.taskAchievement.score.toFixed(1)}
                      </span>
                      {expandedCategories.task2Achievement ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  <div className={`collapsed-content ${expandedCategories.task2Achievement ? 'expanded' : ''}`}>
                    <div className="p-4 bg-gray-50 rounded-md mt-2">
                      <div className="h-2 bg-gray-200 rounded-full mb-4">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{width: `${feedback.task2.categories.taskAchievement.percentage}%`}}
                        ></div>
                      </div>
                      <ul className="space-y-2">
                        {feedback.task2.categories.taskAchievement.comments.map((comment, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 mt-1">
                              {comment.includes("improvement") || comment.includes("could") ?
                                <AlertCircle size={14} className="text-amber-500" /> :
                                <CheckCircle size={14} className="text-green-600" />
                              }
                            </span>
                            <span className="text-sm">{comment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="collapsible-section">
                  <div
                    className="collapsible-header"
                    onClick={() => toggleCategory('task2Coherence')}
                  >
                    <div className="flex items-center">
                      {categoryIcons.coherenceCohesion}
                      <span className="ml-2 font-medium">Coherence & Cohesion</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-indigo-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        {feedback.task2.categories.coherenceCohesion.score.toFixed(1)}
                      </span>
                      {expandedCategories.task2Coherence ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  <div className={`collapsed-content ${expandedCategories.task2Coherence ? 'expanded' : ''}`}>
                    <div className="p-4 bg-gray-50 rounded-md mt-2">
                      <div className="h-2 bg-gray-200 rounded-full mb-4">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{width: `${feedback.task2.categories.coherenceCohesion.percentage}%`}}
                        ></div>
                      </div>
                      <ul className="space-y-2">
                        {feedback.task2.categories.coherenceCohesion.comments.map((comment, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 mt-1">
                              {comment.includes("improvement") || comment.includes("could") ?
                                <AlertCircle size={14} className="text-amber-500" /> :
                                <CheckCircle size={14} className="text-green-600" />
                              }
                            </span>
                            <span className="text-sm">{comment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="collapsible-section">
                  <div
                    className="collapsible-header"
                    onClick={() => toggleCategory('task2Lexical')}
                  >
                    <div className="flex items-center">
                      {categoryIcons.lexicalResource}
                      <span className="ml-2 font-medium">Lexical Resource</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-indigo-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        {feedback.task2.categories.lexicalResource.score.toFixed(1)}
                      </span>
                      {expandedCategories.task2Lexical ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  <div className={`collapsed-content ${expandedCategories.task2Lexical ? 'expanded' : ''}`}>
                    <div className="p-4 bg-gray-50 rounded-md mt-2">
                      <div className="h-2 bg-gray-200 rounded-full mb-4">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{width: `${feedback.task2.categories.lexicalResource.percentage}%`}}
                        ></div>
                      </div>
                      <ul className="space-y-2">
                        {feedback.task2.categories.lexicalResource.comments.map((comment, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 mt-1">
                              {comment.includes("improvement") || comment.includes("could") ?
                                <AlertCircle size={14} className="text-amber-500" /> :
                                <CheckCircle size={14} className="text-green-600" />
                              }
                            </span>
                            <span className="text-sm">{comment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="collapsible-section">
                  <div
                    className="collapsible-header"
                    onClick={() => toggleCategory('task2Grammar')}
                  >
                    <div className="flex items-center">
                      {categoryIcons.grammaticalRange}
                      <span className="ml-2 font-medium">Grammatical Range & Accuracy</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-indigo-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        {feedback.task2.categories.grammaticalRange.score.toFixed(1)}
                      </span>
                      {expandedCategories.task2Grammar ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  <div className={`collapsed-content ${expandedCategories.task2Grammar ? 'expanded' : ''}`}>
                    <div className="p-4 bg-gray-50 rounded-md mt-2">
                      <div className="h-2 bg-gray-200 rounded-full mb-4">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{width: `${feedback.task2.categories.grammaticalRange.percentage}%`}}
                        ></div>
                      </div>
                      <ul className="space-y-2">
                        {feedback.task2.categories.grammaticalRange.comments.map((comment, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 mt-1">
                              {comment.includes("improvement") || comment.includes("could") ?
                                <AlertCircle size={14} className="text-amber-500" /> :
                                <CheckCircle size={14} className="text-green-600" />
                              }
                            </span>
                            <span className="text-sm">{comment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-full bg-green-100 mr-3">
                      <CheckCircle size={18} className="text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-800">Strengths</h4>
                  </div>
                  {feedback.task2.strengths.map((strength, idx) => (
                    <div key={idx} className="feedback-badge badge-good">
                      {strength}
                    </div>
                  ))}
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-full bg-amber-100 mr-3">
                      <AlertCircle size={18} className="text-amber-600" />
                    </div>
                    <h4 className="font-medium text-gray-800">Areas for Improvement</h4>
                  </div>
                  {feedback.task2.improvements.map((improvement, idx) => (
                    <div key={idx} className="feedback-badge badge-improve">
                      {improvement}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center mt-8">
        <Button onClick={onBack} className="submit-button">
          Start New Test
        </Button>
      </div>
    </div>
  );
};

export default FeedbackSummary;