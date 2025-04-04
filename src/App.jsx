import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Card } from './components/ui/card';

import './App.css';

// Import other sections
import WritingHome from './components/Writing/WritingHome.jsx';

// Import Speaking section
import { SpeakingProvider } from './components/Speaking/SpeakingContext.jsx';
import SpeakingHome from './components/Speaking/SpeakingHome.jsx';
// Import Reading Section
import ReadingHome from './components/Reading/ReadingHome.jsx';
import ReadingExam from './components/Reading/ReadingExam.jsx';

// HomePage component for the landing page
const HomePage = () => {
  const navigate = useNavigate();
  
  const handleSkillSelection = (skill) => {
    navigate(`/${skill.toLowerCase()}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-12 fade-in">
      {/* Hero Section */}
      <div className="text-center mb-16 slide-up">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 mb-6">
          IELTS Practice Platform
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Master all four sections of the IELTS exam with our comprehensive, interactive practice platform
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
        {/* Reading Card */}
        <Card
          className="skill-card reading-card shadow-lg"
          onClick={() => handleSkillSelection('reading')}
        >
          <div className="skill-card-content">
            <h2 className="text-2xl font-bold mb-3">Reading</h2>
            <p className="mb-4 opacity-90">
              Practice reading comprehension with authentic IELTS-style passages and questions.
            </p>
            <div className="skill-icon reading-icon">
              <span className="material-icons">menu_book</span>
            </div>
          </div>
        </Card>

        {/* Writing Card */}
        <Card
          className="skill-card writing-card shadow-lg"
          onClick={() => handleSkillSelection('writing')}
        >
          <div className="skill-card-content">
            <h2 className="text-2xl font-bold mb-3">Writing</h2>
            <p className="mb-4 opacity-90">
              Develop your writing skills for both Task 1 and Task 2 with detailed feedback.
            </p>
            <div className="skill-icon writing-icon">
              <span className="material-icons">edit_note</span>
            </div>
          </div>
        </Card>

        {/* Listening Card */}
        <Card
          className="skill-card listening-card shadow-lg"
          onClick={() => handleSkillSelection('listening')}
        >
          <div className="skill-card-content">
            <h2 className="text-2xl font-bold mb-3">Listening</h2>
            <p className="mb-4 opacity-90">
              Enhance your listening comprehension with diverse audio exercises and scenarios.
            </p>
            <div className="skill-icon listening-icon">
              <span className="material-icons">headphones</span>
            </div>
          </div>
        </Card>

        {/* Speaking Card */}
        <Card
          className="skill-card speaking-card shadow-lg"
          onClick={() => handleSkillSelection('speaking')}
        >
          <div className="skill-card-content">
            <h2 className="text-2xl font-bold mb-3">Speaking</h2>
            <p className="mb-4 opacity-90">
              Improve your speaking abilities through guided practice sessions with AI feedback.
            </p>
            <div className="skill-icon speaking-icon">
              <span className="material-icons">record_voice_over</span>
            </div>
          </div>
        </Card>

        {/* Practice Tests Card - Spanning 2 columns on medium screens */}
        <Card
          className="skill-card practice-card shadow-lg md:col-span-2 lg:col-span-4"
          onClick={() => handleSkillSelection('practice')}
        >
          <div className="skill-card-content flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-3">Full Practice Tests</h2>
              <p className="mb-4 opacity-90 max-w-2xl">
                Take complete practice tests that simulate the real IELTS exam experience with timed sections and comprehensive scoring.
              </p>
            </div>
            <div className="skill-icon practice-icon static md:relative mt-4 md:mt-0">
              <span className="material-icons text-4xl">timer</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Info Section */}
      <div className="text-center mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-sm">
        <h3 className="text-2xl font-semibold text-blue-800 mb-4">Ready to Improve Your IELTS Score?</h3>
        <p className="text-slate-700 mb-6 max-w-3xl mx-auto">
          Our platform provides realistic practice materials and instant feedback to help you achieve your target score.
          Select any skill above to begin your practice journey.
        </p>
        <div className="inline-flex items-center justify-center bg-white px-6 py-3 rounded-xl shadow-md text-blue-800 border border-blue-100">
          <span className="material-icons mr-3">lightbulb</span>
          <span className="font-medium">Select a skill above to begin your practice</span>
        </div>
      </div>
    </div>
  );
};

// Placeholder for Listening section
const ListeningPlaceholder = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Listening Section</h1>
      <p className="text-xl text-gray-600 mb-8">
        The Listening section is currently under maintenance.
      </p>
      <Link to="/">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Return to Home
        </button>
      </Link>
    </div>
  );
};

// Placeholder for Practice Tests section
const PracticeTestsPlaceholder = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Practice Tests</h1>
      <p className="text-xl text-gray-600 mb-8">
        Full IELTS practice tests will be available soon.
      </p>
      <Link to="/">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Return to Home
        </button>
      </Link>
    </div>
  );
};

function App() {
  console.log('App component mounting');
  return (
    <SpeakingProvider>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/writing" element={<WritingHome />} />
          <Route path="/speaking" element={<SpeakingHome />} />
          <Route path="/listening" element={<ListeningPlaceholder />} />
          <Route path="/practice" element={<PracticeTestsPlaceholder />} />
          <Route path="/reading" element={<ReadingHome />} />
          <Route path="/reading/exam" element={<ReadingExam />} />
        </Routes>
      </div>
    </SpeakingProvider>
  );
}

export default App;
