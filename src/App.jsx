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

import LearnHome from './components/PlayZone/Learnhome.jsx';
import GamesHome from './components/PlayZone/Gameshome.jsx';
import LearnTopics from './components/PlayZone/learntopics.jsx';

// HomePage component for the skills selection page
const HomePage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { resetTimer } = useTimer();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleSkillSelection = (skill) => {
    resetTimer();
    navigate(`/${skill.toLowerCase()}`);
  };
  
  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    try {
      setIsLoggingOut(true);
      
      // Store logout intent in sessionStorage
      sessionStorage.setItem('showLogoutSuccess', 'true');
      
      // Sign out and immediately navigate
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
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
            disabled={isLoggingOut}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 absolute top-4 right-4 flex items-center shadow-md"
          >
            {isLoggingOut ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging out...
              </>
            ) : (
              <>
                <span className="material-icons text-sm mr-1">logout</span>
                Logout
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        <div className="skills-container">
          <h2 className="skills-title fade-in">Choose a section to practice</h2>
          
          <div className="text-center mb-6 fade-in">
            <button 
              className="play-zone-button"
              onClick={() => navigate('/play-zone')}
            >
              <span className="material-icons">sports_esports</span>
              <span>Play Zone</span>
            </button>
          </div>
          
          <div className="skills-grid">
            {/* Reading Card */}
            <div 
              className="skill-tile slide-up"
              onClick={() => handleSkillSelection('reading')}
              style={{animationDelay: '0.1s'}}
            >
              <div className="skill-icon">
                <span className="material-icons">menu_book</span>
              </div>
              <h2>Reading</h2>
              <p>Enhance your comprehension skills with IELTS-style passages</p>
            </div>

            {/* Writing Card */}
            <div 
              className="skill-tile slide-up"
              onClick={() => handleSkillSelection('writing')}
              style={{animationDelay: '0.2s'}}
            >
              <div className="skill-icon">
                <span className="material-icons">edit_note</span>
              </div>
              <h2>Writing</h2>
              <p>Master Task 1 and Task 2 with guided practice</p>
            </div>

            {/* Listening Card */}
            <div 
              className="skill-tile slide-up"
              onClick={() => handleSkillSelection('listening')}
              style={{animationDelay: '0.3s'}}
            >
              <div className="skill-icon">
                <span className="material-icons">headphones</span>
              </div>
              <h2>Listening</h2>
              <p>Practice with authentic audio exercises</p>
            </div>

            {/* Speaking Card */}
            <div 
              className="skill-tile slide-up"
              onClick={() => handleSkillSelection('speaking')}
              style={{animationDelay: '0.4s'}}
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
      
      <footer className="landing-footer fade-in">
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

// Placeholder for Play Zone section
const PlayZonePlaceholder = () => {
  const navigate = useNavigate();
  
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <h1>IELTS Practice</h1>
          <div className="header-line"></div>
          <button 
            onClick={() => navigate('/skills')}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200 absolute top-4 left-4 flex items-center shadow-md"
          >
            <span className="material-icons text-sm mr-1">arrow_back</span>
            Back
          </button>
        </div>
      </header>
      
      <main className="landing-main">
        <div className="instructions-panel max-w-3xl fade-in">
          <div className="instructions-header">Play Zone</div>
          <div className="instructions-section">
            <div className="text-center mb-8">
              <span className="material-icons" style={{fontSize: '4rem', color: '#6930c3'}}>sports_esports</span>
            </div>
            <p className="text-lg text-gray-700 mb-8 text-center">
              Welcome to the Play Zone! Choose an option below to enhance your IELTS preparation.
            </p>
            
            <div className="play-zone-options">
              <button 
                onClick={() => navigate('/play-zone/learn')}
                className="play-zone-option-button learn-button"
              >
                <span className="material-icons">school</span>
                <span>Learn</span>
              </button>
              
              <button 
                onClick={() => navigate('/play-zone/games')}
                className="play-zone-option-button games-button"
              >
                <span className="material-icons">videogame_asset</span>
                <span>Play Games</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="landing-footer fade-in">
        <p>Designed for focused IELTS preparation</p>
      </footer>
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
              <Route path="/play-zone" element={<PlayZonePlaceholder />} />
              <Route path="/play-zone/learn" element={<LearnHome />} />
              <Route path="/play-zone/learn/:topicId" element={<LearnTopics />} />
              <Route path="/play-zone/games" element={<GamesHome />} />
            </Routes>
          </div>
        </TimerProvider>
      </SpeakingProvider>
    </AuthProvider>
  );
}

export default App;
