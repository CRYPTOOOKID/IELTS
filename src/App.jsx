import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import ReadingHome from './components/Reading/ReadingHome';
import WritingHome from './components/Writing/WritingHome';
import ListeningHome from './components/Listening/ListeningHome';
import SpeakingHome from './components/Speaking/SpeakingHome';
import { ReadingProvider, useReadingContext } from './components/Reading/ReadingContext';
import { SpeakingProvider, useSpeakingContext } from './components/Speaking/SpeakingContext';
import './App.css';

function AppContent() {
  // Simplified component - moved navigation logic to HomePage

  // HomePage component extracted to fix React Refresh issues
  const HomePage = () => {
    const navigate = useNavigate();
    const { fetchTestData } = useReadingContext();
    const { fetchTestData: fetchSpeakingTestData } = useSpeakingContext();
    
    const handleSkillSelection = (skill) => {
      // If Reading is selected, start fetching the test data
      if (skill.toLowerCase() === 'reading') {
        fetchTestData();
      }
      // For Speaking, we'll fetch the data when the user clicks "Start Now" on the instructions page
      navigate(`/${skill.toLowerCase()}`);
    };
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">IELTS Practice Platform</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Improve your skills in all four sections of the IELTS exam with our interactive practice platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Reading Card */}
          <Card
            className="skill-card reading-card"
            onClick={() => handleSkillSelection('reading')}
          >
            <div className="skill-card-content">
              <h2 className="text-2xl font-bold mb-3">Reading</h2>
              <p className="mb-4">
                Practice reading comprehension with passages similar to the IELTS exam.
              </p>
              <div className="skill-icon reading-icon">
                <span className="material-icons">book</span>
              </div>
            </div>
          </Card>

          {/* Writing Card */}
          <Card
            className="skill-card writing-card"
            onClick={() => handleSkillSelection('writing')}
          >
            <div className="skill-card-content">
              <h2 className="text-2xl font-bold mb-3">Writing</h2>
              <p className="mb-4">
                Develop your writing skills for both Task 1 and Task 2.
              </p>
              <div className="skill-icon writing-icon">
                <span className="material-icons">edit</span>
              </div>
            </div>
          </Card>

          {/* Listening Card */}
          <Card
            className="skill-card listening-card"
            onClick={() => handleSkillSelection('listening')}
          >
            <div className="skill-card-content">
              <h2 className="text-2xl font-bold mb-3">Listening</h2>
              <p className="mb-4">
                Enhance your listening comprehension with audio exercises.
              </p>
              <div className="skill-icon listening-icon">
                <span className="material-icons">headphones</span>
              </div>
            </div>
          </Card>

          {/* Speaking Card */}
          <Card
            className="skill-card speaking-card"
            onClick={() => handleSkillSelection('speaking')}
          >
            <div className="skill-card-content">
              <h2 className="text-2xl font-bold mb-3">Speaking</h2>
              <p className="mb-4">
                Improve your speaking abilities through guided practice sessions.
              </p>
              <div className="skill-icon speaking-icon">
                <span className="material-icons">mic</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">
            Get ready for your IELTS exam by practicing all four skills. Our platform provides
            realistic practice materials and instant feedback to help you improve.
          </p>
          <div className="inline-flex items-center justify-center bg-blue-100 px-4 py-2 rounded-lg text-blue-800">
            <span className="material-icons mr-2">info</span>
            <span>Select a skill above to begin practice</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reading" element={<ReadingHome />} />
        <Route path="/writing" element={<WritingHome />} />
        <Route path="/listening" element={<ListeningHome />} />
        <Route path="/speaking" element={<SpeakingHome />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ReadingProvider>
      <SpeakingProvider>
        <AppContent />
      </SpeakingProvider>
    </ReadingProvider>
  );
}

export default App;