import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import './App.css';
import LandingPage from './components/LandingPage.jsx';
import LoginPage from './components/Auth/LoginPage.jsx';
// Import other sections
import WritingHome from './components/Writing/WritingHome.jsx';

// Import Auth context
import { AuthProvider, useAuth } from './components/Auth/AuthContext.jsx';

// Import Speaking section
import { SpeakingProvider } from './components/Speaking/SpeakingContext.jsx';
import SpeakingHome from './components/Speaking/SpeakingHome.jsx';
// Import Reading Section
import ReadingHome from './components/Reading/ReadingHome.jsx';
import ReadingExam from './components/Reading/ReadingExam.jsx';

// Import Timer context
import { TimerProvider, useTimer } from './lib/TimerContext.jsx';
import TimerDisplay from './components/ui/TimerDisplay.jsx';

// HomePage component for the skills selection page
const HomePage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { resetTimer } = useTimer();
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
  
  const handleSkillSelection = (skill) => {
    resetTimer();
    navigate(`/${skill.toLowerCase()}`);
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      setShowLogoutSuccess(true);
      
      // Redirect to landing page after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <h1>IELTS Practice</h1>
          <div className="header-line"></div>
          <button 
            onClick={handleLogout}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 absolute top-4 right-4"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Logout Success Toast */}
      {showLogoutSuccess && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-md flex items-center space-x-2 animate-fadeIn z-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Successfully logged out</span>
        </div>
      )}

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
    <AuthProvider>
      <SpeakingProvider>
        <TimerProvider>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/skills" element={<HomePage />} />
              <Route path="/writing" element={<WritingHome />} />
              <Route path="/speaking" element={<SpeakingHome />} />
              <Route path="/listening" element={<ListeningPlaceholder />} />
              <Route path="/reading" element={<ReadingHome />} />
              <Route path="/reading/exam" element={<ReadingExam />} />
            </Routes>
          </div>
        </TimerProvider>
      </SpeakingProvider>
    </AuthProvider>
  );
}

export default App;
