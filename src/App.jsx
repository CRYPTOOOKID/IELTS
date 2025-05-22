import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import './App.css';
import LandingPage from './components/LandingPage.jsx';
import LoginPage from './components/Auth/LoginPage.jsx';
// Import other sections
import WritingHome from './components/IELTS/Writing/WritingHome.jsx';

// Import Auth context
import { AuthProvider, useAuth } from './components/Auth/AuthContext.jsx';

// Import Speaking section
import { SpeakingProvider } from './components/IELTS/Speaking/SpeakingContext.jsx';
import SpeakingHome from './components/IELTS/Speaking/SpeakingHome.jsx';
// Import Reading Section
import ReadingHome from './components/IELTS/Reading/ReadingHome.jsx';
import ReadingExam from './components/IELTS/Reading/ReadingExam.jsx';

// Import Toefl UnderConstruction component
import UnderConstructionPage from './components/Toefl/UnderConstructionPage.jsx';
// Import Toefl Writing component
import ToeflWritingHome from './components/Toefl/Writing/WritingHome.jsx';
// Import Toefl Speaking component
import ToeflSpeakingHome from './components/Toefl/Speaking/ToeflSpeakingHome.jsx';

// Import Timer context
import { TimerProvider, useTimer } from './lib/TimerContext.jsx';
import TimerDisplay from './components/ui/TimerDisplay.jsx';

import LearnHome from './components/PlayZone/Learnhome.jsx';
import GamesHome from './components/PlayZone/Gameshome.jsx';
import LearnTopics from './components/PlayZone/learntopics.jsx';
import FlashCards from './components/PlayZone/FlashCards.jsx';

// ExamTypePage component for selecting exam type
const ExamTypePage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleExamSelection = (examType) => {
    navigate(`/${examType.toLowerCase()}-skills`);
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
          <h1>English Proficiency Practice</h1>
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
          <h2 className="skills-title fade-in">Choose an Exam Type</h2>
          
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
            {/* IELTS Card */}
            <div 
              className="skill-tile slide-up"
              onClick={() => handleExamSelection('ielts')}
              style={{animationDelay: '0.1s'}}
            >
              <div className="skill-icon">
                <span className="material-icons">school</span>
              </div>
              <h2>IELTS</h2>
              <p>International English Language Testing System</p>
            </div>

            {/* TOEFL Card */}
            <div 
              className="skill-tile slide-up"
              onClick={() => handleExamSelection('toefl')}
              style={{animationDelay: '0.2s'}}
            >
              <div className="skill-icon">
                <span className="material-icons">language</span>
              </div>
              <h2>TOEFL</h2>
              <p>Test of English as a Foreign Language</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="landing-footer fade-in">
        <p>Designed for focused English proficiency exam preparation</p>
      </footer>
    </div>
  );
};

// HomePage component for the skills selection page (now specific to exam type)
const SkillsPage = ({ examType }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { resetTimer } = useTimer();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleSkillSelection = (skill) => {
    resetTimer();
    navigate(`/${examType}/${skill.toLowerCase()}`);
  };
  
  const handleBack = () => {
    navigate('/skills');
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
  
  const examName = examType === 'ielts' ? 'IELTS' : 'TOEFL';
  
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <h1>{examName} Practice</h1>
          <div className="header-line"></div>
          <button 
            onClick={handleBack}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200 absolute top-4 left-4 flex items-center shadow-md"
          >
            <span className="material-icons text-sm mr-1">arrow_back</span>
            Back
          </button>
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
              <p>Enhance your comprehension skills with {examName}-style passages</p>
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
              <p>Master writing tasks with guided practice</p>
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
              <p>Build fluency with structured speaking exercises</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="landing-footer fade-in">
        <p>Designed for focused {examName} preparation</p>
      </footer>
    </div>
  );
};

// IELTS Skills Page
const IELTSSkillsPage = () => <SkillsPage examType="ielts" />;

// TOEFL Skills Page
const TOEFLSkillsPage = () => <SkillsPage examType="toefl" />;

// Placeholder for Listening section
const ListeningPlaceholder = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Listening Section</h1>
      <p className="text-xl text-gray-600 mb-8">
        The Listening section is currently under maintenance.
      </p>
      <button onClick={() => navigate(-1)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Go Back
      </button>
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
          <h1>English Proficiency Practice</h1>
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
              Welcome to the Play Zone! Choose an option below to enhance your exam preparation.
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

              <button 
                onClick={() => navigate('/play-zone/flashcards')}
                className="play-zone-option-button flashcards-button"
              >
                <span className="material-icons">style</span>
                <span>Flash Cards</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="landing-footer fade-in">
        <p>Designed for focused exam preparation</p>
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
              <Route path="/skills" element={<ExamTypePage />} />
              <Route path="/ielts-skills" element={<IELTSSkillsPage />} />
              <Route path="/toefl-skills" element={<TOEFLSkillsPage />} />
              
              {/* IELTS Routes */}
              <Route path="/ielts/writing" element={<WritingHome />} />
              <Route path="/ielts/speaking" element={<SpeakingHome />} />
              <Route path="/ielts/listening" element={<ListeningPlaceholder />} />
              <Route path="/ielts/reading" element={<ReadingHome />} />
              <Route path="/ielts/reading/exam" element={<ReadingExam />} />
              
              {/* TOEFL Routes */}
              <Route path="/toefl/writing" element={<ToeflWritingHome />} />
              <Route path="/toefl/speaking" element={<ToeflSpeakingHome />} />
              <Route path="/toefl/listening" element={<UnderConstructionPage examType="Listening" />} />
              <Route path="/toefl/reading" element={<UnderConstructionPage examType="Reading" />} />
              <Route path="/toefl/reading/exam" element={<UnderConstructionPage examType="Reading Exam" />} />
              
              {/* Play Zone Routes (common for both exam types) */}
              <Route path="/play-zone" element={<PlayZonePlaceholder />} />
              <Route path="/play-zone/learn" element={<LearnHome />} />
              <Route path="/play-zone/learn/:topicId" element={<LearnTopics />} />
              <Route path="/play-zone/games" element={<GamesHome />} />
              <Route path="/play-zone/flashcards" element={<FlashCards />} />
            </Routes>
          </div>
        </TimerProvider>
      </SpeakingProvider>
    </AuthProvider>
  );
}

export default App;
