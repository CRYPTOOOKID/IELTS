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
    <div className="container mx-auto px-4 py-8 fade-in bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="text-center mb-12 slide-up">
        <h1 className="text-5xl font-bold text-gray-800 mb-3">
          IELTS Mastery
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Master the skills you need for IELTS success
        </p>
      </header>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
        {/* Reading Card */}
        <Card
          className="skill-card reading-card shadow-md"
          onClick={() => handleSkillSelection('reading')}
        >
          <div className="skill-card-content">
            <h2 className="text-xl font-bold mb-2">Reading</h2>
            <p className="text-sm opacity-90">
              Build comprehension skills with authentic IELTS-style passages and questions
            </p>
            <div className="skill-icon reading-icon">
              <span className="material-icons">menu_book</span>
            </div>
          </div>
        </Card>

        {/* Writing Card */}
        <Card
          className="skill-card writing-card shadow-md"
          onClick={() => handleSkillSelection('writing')}
        >
          <div className="skill-card-content">
            <h2 className="text-xl font-bold mb-2">Writing</h2>
            <p className="text-sm opacity-90">
              Practice Task 1 and Task 2 with guided feedback on your essays
            </p>
            <div className="skill-icon writing-icon">
              <span className="material-icons">edit_note</span>
            </div>
          </div>
        </Card>

        {/* Listening Card */}
        <Card
          className="skill-card listening-card shadow-md"
          onClick={() => handleSkillSelection('listening')}
        >
          <div className="skill-card-content">
            <h2 className="text-xl font-bold mb-2">Listening</h2>
            <p className="text-sm opacity-90">
              Train with diverse audio exercises that mirror real exam conditions
            </p>
            <div className="skill-icon listening-icon">
              <span className="material-icons">headphones</span>
            </div>
          </div>
        </Card>

        {/* Speaking Card */}
        <Card
          className="skill-card speaking-card shadow-md"
          onClick={() => handleSkillSelection('speaking')}
        >
          <div className="skill-card-content">
            <h2 className="text-xl font-bold mb-2">Speaking</h2>
            <p className="text-sm opacity-90">
              Build fluency through guided practice sessions with feedback
            </p>
            <div className="skill-icon speaking-icon">
              <span className="material-icons">record_voice_over</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Features Section */}
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-5xl mx-auto mb-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Why IELTS Mastery?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <span className="material-icons text-blue-600">school</span>
            </div>
            <h4 className="font-medium text-gray-800 mb-1">Expert Content</h4>
            <p className="text-sm text-gray-600">Practice with materials designed to match the real exam</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-full mb-3">
              <span className="material-icons text-green-600">insights</span>
            </div>
            <h4 className="font-medium text-gray-800 mb-1">Progress Tracking</h4>
            <p className="text-sm text-gray-600">Monitor your improvement with detailed analytics</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-orange-100 p-3 rounded-full mb-3">
              <span className="material-icons text-orange-600">psychology</span>
            </div>
            <h4 className="font-medium text-gray-800 mb-1">Personalized Feedback</h4>
            <p className="text-sm text-gray-600">Get insights on how to improve your performance</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 p-6 rounded-lg text-center max-w-3xl mx-auto border border-blue-100">
        <h3 className="text-lg font-medium text-blue-800 mb-3">Ready to improve your IELTS score?</h3>
        <p className="text-sm text-blue-600 mb-4">
          Select any skill above to begin practicing
        </p>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-sm transition-colors"
          onClick={() => handleSkillSelection('reading')}
        >
          Start Now
        </button>
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
          <Route path="/reading" element={<ReadingHome />} />
          <Route path="/reading/exam" element={<ReadingExam />} />
        </Routes>
      </div>
    </SpeakingProvider>
  );
}

export default App;
