import React from 'react';
import { useNavigate } from 'react-router-dom';

const GamesHome = () => {
  const navigate = useNavigate();
  
  const games = [
    {
      title: "Word Match",
      icon: "extension",
      description: "Match words with their definitions to build vocabulary",
      color: "#4361ee",
      comingSoon: true
    },
    {
      title: "Grammar Challenge",
      icon: "school",
      description: "Test your grammar knowledge with fun challenges",
      color: "#3a86ff",
      comingSoon: true
    },
    {
      title: "Sentence Builder",
      icon: "format_align_left",
      description: "Arrange words to create correct sentences",
      color: "#38b000",
      comingSoon: true
    },
    {
      title: "Vocabulary Quiz",
      icon: "quiz",
      description: "Test your vocabulary with interactive quizzes",
      color: "#fb8500",
      comingSoon: true
    }
  ];
  
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <h1>IELTS Practice</h1>
          <div className="header-line"></div>
          <button 
            onClick={() => navigate('/play-zone')}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200 absolute top-4 left-4 flex items-center shadow-md"
          >
            <span className="material-icons text-sm mr-1">arrow_back</span>
            Back
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
                style={{animationDelay: `${0.1 * (index + 1)}s`}}
              >
                <div 
                  className="game-icon" 
                  style={{background: `linear-gradient(135deg, ${game.color}22, ${game.color}44)`}}
                >
                  <span 
                    className="material-icons"
                    style={{color: game.color}}
                  >
                    {game.icon}
                  </span>
                </div>
                <h3 className="game-title">{game.title}</h3>
                <p className="game-description">{game.description}</p>
                {game.comingSoon ? (
                  <div className="coming-soon-badge">Coming Soon</div>
                ) : (
                  <button className="play-game-button">
                    Play Now
                  </button>
                )}
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
