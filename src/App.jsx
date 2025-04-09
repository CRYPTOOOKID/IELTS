import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

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
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <h1>IELTS Practice</h1>
          <div className="header-line"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        <div className="skills-container">
          <h2 className="skills-title">Choose a section to practice</h2>
          
          <div className="skills-grid">
            {/* Reading Card */}
            <div 
              className="skill-tile"
              onClick={() => handleSkillSelection('reading')}
            >
              <div className="skill-icon">
                <span className="material-icons">menu_book</span>
              </div>
              <h2>Reading</h2>
              <p>Enhance your comprehension skills with IELTS-style passages</p>
            </div>

            {/* Writing Card */}
            <div 
              className="skill-tile"
              onClick={() => handleSkillSelection('writing')}
            >
              <div className="skill-icon">
                <span className="material-icons">edit_note</span>
              </div>
              <h2>Writing</h2>
              <p>Master Task 1 and Task 2 with guided practice</p>
            </div>

            {/* Listening Card */}
            <div 
              className="skill-tile"
              onClick={() => handleSkillSelection('listening')}
            >
              <div className="skill-icon">
                <span className="material-icons">headphones</span>
              </div>
              <h2>Listening</h2>
              <p>Practice with authentic audio exercises</p>
            </div>

            {/* Speaking Card */}
            <div 
              className="skill-tile"
              onClick={() => handleSkillSelection('speaking')}
            >
              <div className="skill-icon">
                <span className="material-icons">record_voice_over</span>
              </div>
              <h2>Speaking</h2>
              <p>Build fluency with Part 1, 2, and 3 exercises</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="landing-footer">
        <p>Designed for focused IELTS preparation</p>
      </footer>
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
