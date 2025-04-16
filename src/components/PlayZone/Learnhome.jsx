import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LearnHome = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTopics, setFilteredTopics] = useState([]);
  
  const grammarTopics = [
    {
      name: "Subject-Verb Agreement",
      icon: "rule",
      color: "#4361ee"
    },
    {
      name: "Verb Tenses (Basic)",
      icon: "schedule",
      color: "#3a86ff"
    },
    {
      name: "Verb Tenses (Advanced)",
      icon: "update",
      color: "#4cc9f0"
    },
    {
      name: "Pronoun Agreement and Case",
      icon: "person",
      color: "#4895ef"
    },
    {
      name: "Articles (a, an, the)",
      icon: "text_fields",
      color: "#560bad"
    },
    {
      name: "Punctuation",
      icon: "more_horiz",
      color: "#7209b7"
    },
    {
      name: "Sentence Structure (Clauses and Phrases)",
      icon: "sort",
      color: "#f72585"
    },
    {
      name: "Sentence Structure (Sentence Types)",
      icon: "sort_by_alpha",
      color: "#b5179e"
    },
    {
      name: "Modifiers (Adjectives and Adverbs)",
      icon: "design_services",
      color: "#3a0ca3"
    },
    {
      name: "Prepositions and Prepositional Phrases",
      icon: "arrow_right_alt",
      color: "#4361ee"
    },
    {
      name: "Conjunctions",
      icon: "link",
      color: "#3a86ff"
    },
    {
      name: "Word Order (Syntax)",
      icon: "reorder",
      color: "#4cc9f0"
    },
    {
      name: "Active and Passive Voice",
      icon: "sync_alt",
      color: "#7209b7"
    },
    {
      name: "Gerunds and Infinitives",
      icon: "line_style",
      color: "#560bad"
    },
    {
      name: "Participles",
      icon: "short_text",
      color: "#480ca8"
    },
    {
      name: "Countable and Uncountable Nouns",
      icon: "pin",
      color: "#3f37c9"
    },
    {
      name: "Determiners",
      icon: "straighten",
      color: "#4361ee"
    },
    {
      name: "Modal Verbs",
      icon: "event_available",
      color: "#4895ef"
    },
    {
      name: "Reported Speech (Indirect Speech)",
      icon: "record_voice_over",
      color: "#4cc9f0"
    },
    {
      name: "Conditional Sentences (If-Clauses)",
      icon: "call_split",
      color: "#f72585"
    },
    {
      name: "Phrasal Verbs",
      icon: "fork_right",
      color: "#7209b7"
    }
  ];
  
  useEffect(() => {
    setFilteredTopics(grammarTopics);
  }, []);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = grammarTopics.filter(topic => 
        topic.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTopics(filtered);
    } else {
      setFilteredTopics(grammarTopics);
    }
  }, [searchTerm]);
  
  const handleTopicClick = (topic) => {
    const topicIndex = grammarTopics.findIndex(t => t.name === topic.name) + 1;
    navigate(`/play-zone/learn/${topicIndex}`);
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
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
        <div className="learn-container fade-in">
          <h2 className="learn-title">Grammar Topics</h2>
          
          {selectedTopic ? (
            <div className="topic-content slide-up">
              <div className="topic-header" style={{backgroundColor: selectedTopic.color + '22'}}>
                <div 
                  className="topic-icon-large" 
                  style={{backgroundColor: selectedTopic.color + '33'}}
                >
                  <span className="material-icons" style={{color: selectedTopic.color}}>
                    {selectedTopic.icon}
                  </span>
                </div>
                <h3 className="topic-title" style={{color: selectedTopic.color}}>
                  {selectedTopic.name}
                </h3>
              </div>
              
              <div className="topic-body">
                <p className="text-gray-600 mb-6">
                  Content for {selectedTopic.name} will be added soon. Check back later for lessons, exercises, and examples.
                </p>
                
                <div className="topic-info-box">
                  <div className="topic-info-header">
                    <span className="material-icons">info</span>
                    <h4>About This Topic</h4>
                  </div>
                  <p>This section will include comprehensive lessons, practice exercises, and examples to help you master {selectedTopic.name} for IELTS success.</p>
                </div>
                
                <button 
                  onClick={() => setSelectedTopic(null)}
                  className="back-to-topics-button"
                  style={{backgroundColor: selectedTopic.color}}
                >
                  <span className="material-icons">arrow_back</span>
                  Back to Topics
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="search-box">
                <div className="search-input-container">
                  <span className="material-icons search-icon">search</span>
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button 
                      className="clear-search-button"
                      onClick={() => setSearchTerm('')}
                    >
                      <span className="material-icons">close</span>
                    </button>
                  )}
                </div>
              </div>
            
              <div className="grammar-topics-grid">
                {filteredTopics.map((topic, index) => (
                  <button 
                    key={index}
                    className="grammar-topic-button slide-up"
                    onClick={() => handleTopicClick(topic)}
                    style={{animationDelay: `${0.05 * (index % 10)}s`}}
                  >
                    <div 
                      className="topic-icon" 
                      style={{backgroundColor: topic.color + '22'}}
                    >
                      <span className="material-icons" style={{color: topic.color}}>
                        {topic.icon}
                      </span>
                    </div>
                    <div className="topic-name">{topic.name}</div>
                  </button>
                ))}
              </div>
              
              {filteredTopics.length === 0 && (
                <div className="no-results">
                  <span className="material-icons">search_off</span>
                  <p>No topics found matching "{searchTerm}"</p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="reset-search-button"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <footer className="landing-footer fade-in">
        <p>Designed for focused IELTS preparation</p>
      </footer>
    </div>
  );
};

export default LearnHome;
