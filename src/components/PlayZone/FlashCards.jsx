import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ChevronRight, ChevronLeft, RotateCcw, Home, Book, Award, Sparkles, Lightbulb, Brain, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../Auth/AuthContext';

// API configuration
const API_KEY = "AIzaSyA6MdoSLwUd2D8kf1goBDg-92nvMTq2j9A";

// Suggestion topics for flashcards
const SUGGESTIONS = [
  "IELTS Speaking",
  "Phrasal Verbs",
  "Idioms",
  "Grammar Rules",
  "Academic Vocab",
  "Collocations",
  "Pronouns",
  "Prepositions",
  "Tenses",
  "Conditionals"
];

// Function to generate flashcards using Gemini API
const generateFlashcards = async (topic) => {
  const prompt = `Generate exactly 10 flashcard items for studying: "${topic}". 
  Format each flashcard as a JSON object with "front" (question/term) and "back" (answer/definition) properties. 
  Make them educational, clear, and fun. Return ONLY the JSON array with no additional text.`;
  
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" + API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
      const textResponse = data.candidates[0].content.parts[0].text;
      const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    
    throw new Error("Couldn't parse flashcards from response");
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return Array.from({ length: 10 }, (_, i) => ({
      front: `Sample Question ${i + 1} for ${topic}`,
      back: `Sample Answer ${i + 1} for ${topic}`
    }));
  }
};

const FlashCards = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [currentTopic, setCurrentTopic] = useState("");
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cardColors] = useState(() => {
    const colors = [
      'from-cyan-500 to-blue-500',
      'from-blue-500 to-indigo-500',
      'from-emerald-500 to-teal-500',
      'from-purple-500 to-violet-500',
      'from-pink-500 to-rose-500',
      'from-amber-500 to-yellow-500',
      'from-teal-500 to-emerald-500',
      'from-fuchsia-500 to-purple-500',
      'from-blue-500 to-cyan-500',
      'from-indigo-500 to-purple-500'
    ];
    return [...colors].sort(() => Math.random() - 0.5);
  });

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

  const handleTopicChange = (e) => {
    const words = e.target.value.split(' ').filter(word => word.trim() !== '');
    if (words.length <= 10) {
      setTopic(e.target.value);
    }
  };

  const addSuggestion = (suggestion) => {
    setTopic(suggestion);
  };

  const handleSubmit = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    
    try {
      const cards = await generateFlashcards(topic);
      setFlashcards(cards);
      setCurrentTopic(topic);
      setShowFlashcards(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        setIsComplete(true);
      }
    }, 300);
  };
  
  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex - 1);
      }, 300);
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setIsComplete(false);
  };

  const handleBackToHome = () => {
    setShowFlashcards(false);
    setTopic("");
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setIsComplete(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Add custom styles for flipping cards
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .perspective-1000 {
        perspective: 1000px;
      }
      
      .rotate-y-180 {
        transform: rotateY(180deg);
      }
      
      .backface-hidden {
        backface-visibility: hidden;
      }
      
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      
      .floating {
        animation: float 3s ease-in-out infinite;
      }
      
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
        70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
        100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
      }
      
      .pulsing {
        animation: pulse 2s infinite;
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }
      
      .bouncing {
        animation: bounce 2s ease infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const currentCardColor = cardColors[currentCardIndex % cardColors.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/20 to-purple-900/40"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-teal-400/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="material-icons text-white text-lg">graduation_cap</span>
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-lg">SPINTA</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigate('/play-zone')}
                className="text-white/80 hover:text-white transition duration-200 flex items-center space-x-1"
              >
                <span className="material-icons text-sm">arrow_back</span>
                <span>Play Zone</span>
              </button>
              <div className="text-white/60">|</div>
              <span className="text-white/80 font-medium">Flash Cards</span>
            </nav>
            
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="group flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white/80 px-4 py-2 rounded-lg hover:bg-white/20 hover:text-white transition-all duration-300 border border-white/20"
              >
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm">Logging out...</span>
                  </>
                ) : (
                  <>
                    <span className="material-icons text-lg group-hover:translate-x-1 transition-transform duration-300">logout</span>
                    <span className="text-sm font-medium">Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-12 pt-8">
        <div className="max-w-7xl mx-auto">
          {!showFlashcards ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block mb-4 relative">
                  <div className="absolute -top-10 -right-10 w-20 h-20 text-cyan-400 floating">
                    <Lightbulb size={64} />
                  </div>
                  <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-2">Create Your Study Cards</h1>
                </div>
                <p className="text-xl text-white/80 max-w-2xl mx-auto">Generate custom flashcards powered by AI for any IELTS topic to boost your learning experience</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 transform transition-all duration-300 hover:shadow-2xl border border-white/20">
                <div className="relative mb-8">
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center border-4 border-white/20 shadow-lg">
                    <Zap className="text-cyan-400" size={28} />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={topic}
                      onChange={handleTopicChange}
                      placeholder="Enter a topic to study (e.g., IELTS Speaking Part 2)"
                      className="w-full px-6 py-4 pr-16 rounded-xl border-2 border-white/20 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none shadow-sm text-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/50 transition-all duration-300"
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && topic.trim()) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={!topic.trim() || isLoading}
                      className={`absolute right-3 top-3 p-3 rounded-lg ${
                        !topic.trim() 
                          ? 'bg-gray-300' 
                          : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 pulsing'
                      } text-white transition-all duration-300 transform hover:scale-105`}
                    >
                      <Send size={24} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-8">
                  <p className="text-lg font-medium text-white/80 mb-4 flex items-center">
                    <Sparkles className="mr-2 text-cyan-400" size={20} />
                    Popular Topics
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {SUGGESTIONS.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => addSuggestion(suggestion)}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-sm hover:bg-white/20 hover:border-cyan-300 transition-all duration-300 transform hover:scale-105 shadow-sm group"
                      >
                        <span className="text-white/80 font-medium group-hover:text-white">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center p-12 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
                  <div className="w-40 h-40 relative">
                    <svg className="animate-spin w-full h-full text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                        <span role="img" aria-label="brain" className="text-4xl">🧠</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-bold">Creating Your Flashcards...</p>
                  <p className="text-white/70 mt-2">Our AI is crafting personalized learning materials</p>
                </div>
              )}

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 mt-8 border border-white/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-bl-full opacity-70"></div>
                
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center relative z-10">
                  <Book size={24} className="mr-3 text-cyan-400" /> How It Works
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <div className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 hover:shadow-md">
                      <div className="flex-shrink-0 w-10 h-10 bg-cyan-400/20 rounded-full flex items-center justify-center mr-4 shadow-sm">
                        <span className="text-cyan-400 font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-cyan-400 mb-1">Choose Your Topic</h3>
                        <p className="text-white/70">Enter a topic you want to study or select from our suggestions</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 hover:shadow-md">
                      <div className="flex-shrink-0 w-10 h-10 bg-cyan-400/20 rounded-full flex items-center justify-center mr-4 shadow-sm">
                        <span className="text-cyan-400 font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-cyan-400 mb-1">Generate Cards</h3>
                        <p className="text-white/70">Click the send button to create AI-powered flashcards</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 hover:shadow-md">
                      <div className="flex-shrink-0 w-10 h-10 bg-cyan-400/20 rounded-full flex items-center justify-center mr-4 shadow-sm">
                        <span className="text-cyan-400 font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-cyan-400 mb-1">Study & Memorize</h3>
                        <p className="text-white/70">Flip through your custom flashcards to study and learn</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 hover:shadow-md">
                      <div className="flex-shrink-0 w-10 h-10 bg-cyan-400/20 rounded-full flex items-center justify-center mr-4 shadow-sm">
                        <span className="text-cyan-400 font-bold">4</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-cyan-400 mb-1">Master & Progress</h3>
                        <p className="text-white/70">Track your progress and improve your IELTS knowledge!</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="inline-flex items-center text-cyan-400 font-medium px-4 py-2 rounded-full bg-cyan-400/10 backdrop-blur-sm">
                    <Sparkles size={16} className="mr-2" />
                    Perfect for IELTS exam preparation!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <button 
                    onClick={handleBackToHome}
                    className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-400/10 hover:bg-cyan-400/20 px-4 py-2 rounded-lg backdrop-blur-sm"
                  >
                    <Home size={20} className="mr-2" /> Back to Topics
                  </button>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                    {currentTopic}
                  </h2>
                  <div className="w-24"></div>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center">
                  {!isComplete ? (
                    <div className="w-full">
                      <div className="mb-6 flex justify-between items-center">
                        <div className="bg-cyan-400/10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center border border-cyan-400/20">
                          <span className="text-lg text-cyan-400 font-medium">
                            Card {currentCardIndex + 1} of {flashcards.length}
                          </span>
                        </div>
                        {isFlipped && (
                          <div className="flex items-center bg-emerald-400/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-emerald-400/20">
                            <Award className="text-emerald-400 mr-2" size={20} />
                            <span className="text-white/80 font-medium">Tap to continue</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="w-full flex justify-center mb-2">
                        <div className="flex items-center justify-center space-x-1 w-full max-w-md">
                          {flashcards.map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                idx < currentCardIndex
                                  ? 'bg-cyan-500 flex-grow'
                                  : idx === currentCardIndex
                                  ? 'bg-cyan-500 flex-grow-[2] pulsing'
                                  : 'bg-white/30 flex-grow'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="perspective-1000 w-full h-[500px] mb-8">
                        <div 
                          className={`relative w-full h-full transform transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
                          onClick={flipCard}
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <div 
                            className={`absolute inset-0 w-full h-full bg-gradient-to-br ${currentCardColor} rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center backface-hidden`}
                            style={{ backfaceVisibility: 'hidden' }}
                          >
                            <div className="absolute top-6 left-6 bg-white bg-opacity-20 rounded-full h-12 w-12 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">{currentCardIndex + 1}</span>
                            </div>
                            
                            <div className="absolute top-6 right-6 bg-white bg-opacity-20 rounded-full h-8 w-8 flex items-center justify-center">
                              <span className="text-white">Q</span>
                            </div>
                            
                            <div className="absolute -bottom-3 -right-3 w-24 h-24 text-white text-opacity-10 transform rotate-12">
                              <Brain size={96} />
                            </div>
                            
                            <h3 className="text-3xl font-bold text-white mb-4 flex items-center">
                              <Lightbulb className="mr-2" size={28} /> Question
                            </h3>
                            <div className="bg-white bg-opacity-95 rounded-xl p-8 w-full max-w-2xl shadow-lg border border-white border-opacity-20">
                              <p className="text-center text-gray-800 text-2xl font-medium leading-relaxed">
                                {flashcards[currentCardIndex].front}
                              </p>
                            </div>
                            <p className="text-white text-opacity-90 mt-8 text-lg flex items-center">
                              <ArrowRight className="mr-2 bouncing" size={20} /> Tap to see answer
                            </p>
                          </div>
                          
                          <div 
                            className={`absolute inset-0 w-full h-full bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180`}
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                          >
                            <div className="absolute top-6 left-6 bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center">
                              <span className={`font-bold text-lg bg-gradient-to-br ${currentCardColor} text-transparent bg-clip-text`}>
                                {currentCardIndex + 1}
                              </span>
                            </div>
                            
                            <div className="absolute top-6 right-6 bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center">
                              <span className={`bg-gradient-to-br ${currentCardColor} text-transparent bg-clip-text`}>A</span>
                            </div>
                            
                            <div className="absolute -bottom-3 -right-3 w-24 h-24 text-indigo-100 transform rotate-12">
                              <CheckCircle size={96} />
                            </div>
                            
                            <h3 className={`text-3xl font-bold mb-4 bg-gradient-to-br ${currentCardColor} text-transparent bg-clip-text flex items-center`}>
                              <Award className="mr-2" size={28} /> Answer
                            </h3>
                            <div className={`border-2 border-gray-200 rounded-xl p-8 w-full max-w-2xl shadow-inner bg-gradient-to-br from-gray-50 to-white`}>
                              <p className="text-center text-gray-800 text-2xl leading-relaxed">
                                {flashcards[currentCardIndex].back}
                              </p>
                            </div>
                            <p className="text-gray-400 mt-8 text-lg flex items-center">
                              <ArrowRight className="mr-2 bouncing" size={20} /> Tap to flip back
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center w-full max-w-2xl mx-auto">
                        <button
                          onClick={handlePrevCard}
                          disabled={currentCardIndex === 0}
                          className={`flex items-center py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
                            currentCardIndex === 0 
                              ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                              : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20'
                          }`}
                        >
                          <ChevronLeft size={24} className="mr-2" /> Previous
                        </button>
                        
                        <button
                          onClick={handleNextCard}
                          className="flex items-center py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                        >
                          Next <ChevronRight size={24} className="ml-2" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-2xl text-center">
                      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-12 mb-8 border border-white/20">
                        <div className="w-32 h-32 mx-auto mb-6 relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full pulse-blue"></div>
                          <div className="absolute inset-4 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-full"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Award className="text-cyan-400" size={64} />
                          </div>
                        </div>
                        <h3 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text mb-4">All Done! 🎉</h3>
                        <p className="text-xl text-white/80 mb-8">
                          You've completed all flashcards for: <span className="font-semibold text-cyan-400">{currentTopic}</span>
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                          <button
                            onClick={handleRestart}
                            className="flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                          >
                            <RotateCcw size={20} className="mr-2" /> Study Again
                          </button>
                          <button
                            onClick={handleBackToHome}
                            className="flex items-center justify-center bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-3 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 border border-white/20"
                          >
                            <Home size={20} className="mr-2" /> New Topic
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/20">
                        <h4 className="text-lg font-medium text-cyan-400 mb-2">
                          Keep up the great work!
                        </h4>
                        <p className="text-white/70">
                          Regular practice with flashcards is one of the most effective ways to prepare for your IELTS exam.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="relative z-10 border-t border-white/20 bg-black/20 backdrop-blur-lg py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-cyan-400 font-medium mb-4 md:mb-0">Designed for focused IELTS preparation</p>
            <div className="flex space-x-4">
              <span className="text-white/60 flex items-center">
                <Brain size={16} className="mr-1" /> Learn
              </span>
              <span className="text-white/60 flex items-center">
                <Award size={16} className="mr-1" /> Practice
              </span>
              <span className="text-white/60 flex items-center">
                <CheckCircle size={16} className="mr-1" /> Master
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FlashCards;