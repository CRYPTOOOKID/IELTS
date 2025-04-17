import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TalkToMe from './Games/TalkToMe';
import WordTile from './Games/WordTile';
import WordDrop from './Games/WordDrop';
import DragZilla from './Games/DragZilla';
import CrossRoads from './Games/CrossRoads';
import MarkTheWords from './Games/MarkTheWords';

const GamesHome = () => {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState(null);
  
  const games = [
    {
      id: 'talktome',
      title: "Talk To Me",
      icon: "record_voice_over",
      description: "Practice speaking skills by answering questions and get AI feedback to improve fluency and accuracy.",
      color: "#7209b7"
    },
    {
      id: 'wordtile',
      title: "Word Tile",
      icon: "grid_view",
      description: "Arrange word tiles in the correct order to form grammatically correct sentences and improve structure.",
      color: "#0091ad"
    },
    {
      id: 'worddrop',
      title: "Word Drop",
      icon: "arrow_downward",
      description: "Catch falling words that match the given category to build vocabulary and improve recognition speed.",
      color: "#ff9e00"
    },
    {
      id: 'dragzilla',
      title: "DragZilla",
      icon: "drag_indicator",
      description: "Drag and drop words to match definitions, synonyms, or antonyms and expand your vocabulary.",
      color: "#38b000"
    },
    {
      id: 'crossroads',
      title: "Crossroads",
      icon: "grid_3x3",
      description: "Find the intersection of words by solving word clues and identifying common letters in crossword-style puzzles.",
      color: "#5e60ce"
    },
    {
      id: 'markthewords',
      title: "Mark The Words",
      icon: "highlight_alt",
      description: "Identify specific parts of speech in sentences to improve your grammar recognition and understanding.",
      color: "#06a77d"
    }
  ];
  
  const handleBackToGames = () => {
    setActiveGame(null);
  };
  
  // Render active game component
  if (activeGame === 'talktome') {
    return <TalkToMe onBackToGames={handleBackToGames} />;
  } else if (activeGame === 'wordtile') {
    return <WordTile onBackToGames={handleBackToGames} />;
  } else if (activeGame === 'worddrop') {
    return <WordDrop onBackToGames={handleBackToGames} />;
  } else if (activeGame === 'dragzilla') {
    return <DragZilla onBackToGames={handleBackToGames} />;
  } else if (activeGame === 'crossroads') {
    return <CrossRoads onBackToGames={handleBackToGames} />;
  } else if (activeGame === 'markthewords') {
    return <MarkTheWords onBackToGames={handleBackToGames} />;
  }
  
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <h1>IELTS Practice</h1>
          <div className="header-line"></div>
          <button 
            onClick={() => navigate('/play-zone')}
            className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors text-blue-700 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Play Zone
          </button>
        </div>
      </header>
      
      <main className="landing-main">
        <div className="games-container fade-in">
          <h2 className="learn-title">Games & Activities</h2>
          
          <div className="games-grid">
            {games.map((game, index) => (
              <div 
                key={index}
                className="game-card"
                style={{
                  animationDelay: `${0.1 * (index + 1)}s`,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div 
                  className="game-icon" 
                  style={{
                    background: `linear-gradient(135deg, ${game.color}22, ${game.color}44)`,
                    boxShadow: `0 8px 20px ${game.color}22`
                  }}
                >
                  <span 
                    className="material-icons"
                    style={{
                      color: game.color,
                      fontSize: '2.5rem'
                    }}
                  >
                    {game.icon}
                  </span>
                </div>
                <h3 className="game-title">{game.title}</h3>
                <p className="game-description" style={{ flexGrow: 1 }}>{game.description}</p>
                <button 
                  className="play-game-button"
                  style={{
                    background: `linear-gradient(to right, ${game.color}, ${game.color}cc)`,
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    boxShadow: `0 4px 15px ${game.color}33`,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: 'auto'
                  }}
                  onClick={() => setActiveGame(game.id)}
                >
                  Play Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="landing-footer fade-in">
        <p>Designed for focused IELTS preparation</p>
      </footer>
    </div>
  );
};

export default GamesHome;
