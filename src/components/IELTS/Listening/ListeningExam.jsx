import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';

const ListeningExam = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const audioRef = useRef(null);
  
  // State management
  const [currentSection, setCurrentSection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [testData, setTestData] = useState(null);
  const [audioEnded, setAudioEnded] = useState(false);

  // Mock test data - In real implementation, this would come from API
  const mockTestData = {
    sections: [
      {
        id: 1,
        title: "Section 1: Social Conversation",
        audioUrl: "/audio/section1.mp3", // Mock URL
        questions: [
          {
            id: 1,
            type: "fill_blank",
            question: "The caller's name is ________.",
            correctAnswer: "Sarah Johnson"
          },
          {
            id: 2,
            type: "multiple_choice",
            question: "What time is the appointment?",
            options: ["2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"],
            correctAnswer: "3:30 PM"
          },
          {
            id: 3,
            type: "fill_blank",
            question: "The phone number is ________ ________ ________.",
            correctAnswer: "555 123 4567"
          }
        ]
      },
      {
        id: 2,
        title: "Section 2: Social Monologue",
        audioUrl: "/audio/section2.mp3",
        questions: [
          {
            id: 4,
            type: "multiple_choice",
            question: "The museum is closed on:",
            options: ["Monday", "Tuesday", "Wednesday", "Sunday"],
            correctAnswer: "Monday"
          },
          {
            id: 5,
            type: "fill_blank",
            question: "Adult ticket price: £________",
            correctAnswer: "12.50"
          }
        ]
      },
      {
        id: 3,
        title: "Section 3: Educational Discussion",
        audioUrl: "/audio/section3.mp3",
        questions: [
          {
            id: 6,
            type: "multiple_choice",
            question: "The main topic of the discussion is:",
            options: ["Climate change", "Renewable energy", "Environmental policy", "Carbon emissions"],
            correctAnswer: "Renewable energy"
          },
          {
            id: 7,
            type: "fill_blank",
            question: "The research was conducted over ________ months.",
            correctAnswer: "18"
          }
        ]
      },
      {
        id: 4,
        title: "Section 4: Academic Lecture",
        audioUrl: "/audio/section4.mp3",
        questions: [
          {
            id: 8,
            type: "multiple_choice",
            question: "According to the lecture, the primary cause is:",
            options: ["Economic factors", "Social changes", "Technological advancement", "Political decisions"],
            correctAnswer: "Technological advancement"
          },
          {
            id: 9,
            type: "fill_blank",
            question: "The study involved ________ participants.",
            correctAnswer: "250"
          },
          {
            id: 10,
            type: "fill_blank",
            question: "Results were published in ________.",
            correctAnswer: "2023"
          }
        ]
      }
    ]
  };

  useEffect(() => {
    // Simulate loading test data
    setTimeout(() => {
      setTestData(mockTestData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        setHasStartedAudio(true);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioEnded(true);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextSection = () => {
    if (currentSection < 4) {
      setCurrentSection(currentSection + 1);
      setIsPlaying(false);
      setHasStartedAudio(false);
      setAudioEnded(false);
    }
  };

  const handleSubmitExam = () => {
    // Calculate results and navigate to feedback
    const results = calculateResults();
    navigate('/ielts/listening/feedback', { 
      state: { 
        answers, 
        testData, 
        results 
      } 
    });
  };

  const calculateResults = () => {
    let correct = 0;
    let total = 0;
    
    testData.sections.forEach(section => {
      section.questions.forEach(question => {
        total++;
        const userAnswer = answers[question.id];
        if (userAnswer && userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
          correct++;
        }
      });
    });
    
    return {
      correct,
      total,
      percentage: Math.round((correct / total) * 100),
      band: getBandScore(correct, total)
    };
  };

  const getBandScore = (correct, total) => {
    const percentage = (correct / total) * 100;
    if (percentage >= 90) return 9;
    if (percentage >= 80) return 8;
    if (percentage >= 70) return 7;
    if (percentage >= 60) return 6;
    if (percentage >= 50) return 5;
    if (percentage >= 40) return 4;
    if (percentage >= 30) return 3;
    if (percentage >= 20) return 2;
    return 1;
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'fill_blank':
        return (
          <div key={question.id} className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white mb-3 font-medium">{question.id}. {question.question}</p>
            <input
              type="text"
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your answer here..."
            />
          </div>
        );
      
      case 'multiple_choice':
        return (
          <div key={question.id} className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white mb-4 font-medium">{question.id}. {question.question}</p>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-white/5 p-2 rounded">
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-white/80">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading test...</p>
        </div>
      </div>
    );
  }

  const currentSectionData = testData.sections.find(s => s.id === currentSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      {/* Audio Player Bar */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-white font-semibold">{currentSectionData.title}</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayPause}
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                  !hasStartedAudio 
                    ? 'bg-green-500 hover:bg-green-600 animate-pulse' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                <span className="material-icons text-white">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
              {!hasStartedAudio && (
                <span className="text-green-400 text-sm font-medium animate-pulse">
                  Click to start audio
                </span>
              )}
              {audioEnded && (
                <span className="text-yellow-400 text-sm font-medium">
                  Audio completed
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-white/70">Section {currentSection} of 4</span>
            <button
              onClick={() => navigate('/ielts/listening')}
              className="text-white/70 hover:text-white transition-colors"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
        </div>
        
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          onEnded={handleAudioEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={currentSectionData.audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Sections 1 & 2 */}
          <div className="space-y-6">
            {(currentSection === 1 || currentSection === 2) && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="material-icons text-blue-400 mr-3">quiz</span>
                  {currentSectionData.title}
                </h3>
                <div className="space-y-4">
                  {currentSectionData.questions.map(renderQuestion)}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sections 3 & 4 */}
          <div className="space-y-6">
            {(currentSection === 3 || currentSection === 4) && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="material-icons text-purple-400 mr-3">quiz</span>
                  {currentSectionData.title}
                </h3>
                <div className="space-y-4">
                  {currentSectionData.questions.map(renderQuestion)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-center">
          {currentSection < 4 ? (
            <button
              onClick={handleNextSection}
              disabled={!hasStartedAudio}
              className={`inline-flex items-center space-x-3 px-8 py-4 rounded-2xl text-white font-semibold transition-all duration-300 ${
                hasStartedAudio
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
                  : 'bg-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <span>Next Section</span>
              <span className="material-icons">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={handleSubmitExam}
              disabled={!hasStartedAudio}
              className={`inline-flex items-center space-x-3 px-8 py-4 rounded-2xl text-white font-semibold transition-all duration-300 ${
                hasStartedAudio
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
                  : 'bg-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <span>Submit Exam</span>
              <span className="material-icons">check_circle</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeningExam; 