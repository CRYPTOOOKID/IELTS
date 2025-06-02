import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';

const ListeningExam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const audioRef = useRef(null);
  
  // State management
  const [currentPart, setCurrentPart] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [testData, setTestData] = useState(null);
  const [audioEnded, setAudioEnded] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [justSaved, setJustSaved] = useState(false);
  const [showRefreshConfirm, setShowRefreshConfirm] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (Object.keys(answers).length > 0) {
        // Save to localStorage
        localStorage.setItem('ielts_listening_answers', JSON.stringify({
          answers,
          currentPart,
          timestamp: Date.now()
        }));
        setLastSaved(new Date());
        setJustSaved(true);
        
        // Hide the tick mark after 2 seconds
        setTimeout(() => {
          setJustSaved(false);
        }, 2000);
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(autoSaveInterval);
  }, [answers, currentPart]);

  // Load saved answers on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('ielts_listening_answers');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Only load if saved within last hour
        if (Date.now() - parsed.timestamp < 3600000) {
          setAnswers(parsed.answers || {});
        }
      } catch (error) {
        console.error('Error loading saved answers:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Get test data from navigation state
    const { testData: apiTestData, currentPart: initialPart } = location.state || {};
    
    if (!apiTestData) {
      // If no test data, redirect back to instructions
      navigate('/ielts/listening');
      return;
    }

    // Set the current part from navigation state or default to 1
    if (initialPart) {
      setCurrentPart(initialPart);
    }

    // Transform API data to match component structure
    const transformedData = {
      test_id: apiTestData.test_id_composite,
      parts: Object.keys(apiTestData.parts).map(partNum => {
        const partData = apiTestData.parts[partNum];
        
        // Flatten all questions from all sections in this part
        const allQuestions = [];
        let questionCounter = (parseInt(partNum) - 1) * 10 + 1; // Start numbering from 1, 11, 21, 31
        
        if (partData.questions_data && partData.questions_data.sections) {
          partData.questions_data.sections.forEach(section => {
            section.questions.forEach(question => {
              // Transform question to include section info and standardize format
              allQuestions.push({
                ...question,
                id: questionCounter++,
                question_number: questionCounter - 1,
                question_type: section.question_type,
                section_id: section.section_id,
                section_description: section.section_description,
                matching_options: section.matching_options,
                options: question.options ? question.options.map(opt => opt.text || opt) : undefined
              });
            });
          });
        }
        
        return {
          id: parseInt(partNum),
          title: `Part ${partNum}`,
          audioUrl: partData.audio_url,
          questions: allQuestions,
          sections: partData.questions_data?.sections || []
        };
      })
    };

    setTestData(transformedData);
    setIsLoading(false);
  }, [location.state, navigate]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Audio play error:', error);
          setAudioError(true);
        });
        setHasStartedAudio(true);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioEnded(true);
  };

  const handleAudioLoadStart = () => {
    setAudioLoading(true);
    setAudioError(false);
  };

  const handleAudioCanPlay = () => {
    setAudioLoading(false);
    setAudioError(false);
  };

  const handleAudioError = () => {
    setAudioLoading(false);
    setAudioError(true);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextPart = () => {
    if (currentPart < 4) {
      const nextPart = currentPart + 1;
      setCurrentPart(nextPart);
      setIsPlaying(false);
      setHasStartedAudio(false);
      setAudioEnded(false);
      setAudioLoading(false);
      setAudioError(false);
      
      // Reset audio element
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const handleSubmitExam = () => {
    // Clear auto-saved data
    localStorage.removeItem('ielts_listening_answers');
    
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

  const handleRefreshTest = () => {
    setShowRefreshConfirm(true);
  };

  const confirmRefreshTest = async () => {
    setShowRefreshConfirm(false);
    setIsLoading(true);
    
    try {
      // Generate a random test number between 3 and 22
      const randomTestNumber = Math.floor(Math.random() * 20) + 3;
      
      // Make API request to get new test data
      const response = await fetch(`https://r55vpkomzf.execute-api.us-east-1.amazonaws.com/prod/tests/${randomTestNumber}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch test data');
      }
      
      const newTestData = await response.json();
      
      // Navigate directly to exam with new test data - start with part 1
      navigate('/ielts/listening/exam', { 
        state: { 
          testData: newTestData,
          currentPart: 1
        },
        replace: true
      });
      
      // Reset all state for new test
      setCurrentPart(1);
      setIsPlaying(false);
      setHasStartedAudio(false);
      setAnswers({});
      setAudioEnded(false);
      setAudioLoading(false);
      setAudioError(false);
      
      // Clear auto-saved data
      localStorage.removeItem('ielts_listening_answers');
      
    } catch (error) {
      console.error('Error fetching new test data:', error);
      alert('Failed to load new test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRefreshTest = () => {
    setShowRefreshConfirm(false);
  };

  const calculateResults = () => {
    let correct = 0;
    let total = 0;
    
    testData.parts.forEach(part => {
      part.questions.forEach(question => {
        total++;
        const userAnswer = answers[question.id];
        if (userAnswer && userAnswer.toLowerCase().trim() === question.correct_answer?.toLowerCase().trim()) {
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

  const getQuestionTypeInstructions = (questionType) => {
    switch (questionType) {
      case 'multiple_choice':
      case 'multiple-choice':
      case 'Multiple Choice':
        return 'Choose the correct letter A, B, or C.';
      case 'fill_blank':
      case 'fill-blank':
      case 'completion':
      case 'sentence_completion':
      case 'Sentence Completion':
        return 'Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.';
      case 'form_completion':
        return 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.';
      case 'note_completion':
        return 'Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.';
      case 'table_completion':
        return 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.';
      case 'summary_completion':
        return 'Complete the summary below. Write NO MORE THAN TWO WORDS for each answer.';
      case 'short_answer':
      case 'short-answer':
        return 'Answer the questions below. Write NO MORE THAN THREE WORDS for each answer.';
      case 'matching':
      case 'Matching':
        return 'Choose the correct letter from the options provided.';
      case 'labelling':
      case 'diagram_labelling':
      case 'map_labelling':
      case 'plan_labelling':
        return 'Label the diagram/map. Write NO MORE THAN TWO WORDS for each answer.';
      default:
        return 'Write your answer in the space provided.';
    }
  };

  const groupQuestionsByType = (questions) => {
    const groups = [];
    let currentGroup = null;
    
    questions.forEach(question => {
      const questionType = question.question_type || question.type;
      
      if (!currentGroup || currentGroup.type !== questionType) {
        currentGroup = {
          type: questionType,
          instructions: getQuestionTypeInstructions(questionType),
          questions: [question]
        };
        groups.push(currentGroup);
      } else {
        currentGroup.questions.push(question);
      }
    });
    
    return groups;
  };

  const renderQuestion = (question) => {
    const questionType = question.question_type || question.type;
    const userAnswer = answers[question.id];
    
    switch (questionType) {
      case 'multiple_choice':
      case 'multiple-choice':
      case 'Multiple Choice':
        return (
          <div key={question.id} className="mb-4">
            <p className="text-white mb-3 font-medium text-lg">{question.question_number}. {question.question_text || question.question}</p>
            <div className="space-y-2">
              {(question.options || question.choices || []).map((option, index) => {
                const letter = String.fromCharCode(65 + index); // A, B, C, etc.
                const isSelected = answers[question.id] === letter;
                
                return (
                  <label 
                    key={index} 
                    className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-500/20 border-blue-400 text-blue-300' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      value={letter}
                      checked={isSelected}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                      isSelected 
                        ? 'border-blue-400 bg-blue-500 text-white' 
                        : 'border-white/30 text-white/60'
                    }`}>
                      {letter}
                    </div>
                    <span className="flex-1 text-base font-semibold">{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      
      case 'matching':
      case 'Matching':
        return (
          <div key={question.id} className="mb-4">
            <p className="text-white mb-3 font-medium text-lg">{question.question_number}. {question.question_text || question.question}</p>
            {question.matching_options && (
              <div className="space-y-2">
                {Object.entries(question.matching_options).map(([letter, text]) => {
                  const isSelected = answers[question.id] === letter;
                  
                  return (
                    <label 
                      key={letter} 
                      className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-all duration-200 ${
                        isSelected 
                          ? 'bg-blue-500/20 border-blue-400 text-blue-300' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question_${question.id}`}
                        value={letter}
                        checked={isSelected}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                        isSelected 
                          ? 'border-blue-400 bg-blue-500 text-white' 
                          : 'border-white/30 text-white/60'
                      }`}>
                        {letter}
                      </div>
                      <span className="flex-1 text-base font-semibold">{text}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      
      default:
        // Text input for all other question types
        return (
          <div key={question.id} className="mb-4">
            <p className="text-white font-medium text-lg mb-3">{question.question_number}. {question.question_text || question.question}</p>
            <input
              type="text"
              value={userAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
              placeholder="Type your answer here..."
            />
          </div>
        );
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

  const currentPartData = testData.parts.find(p => p.id === currentPart);
  const questionGroups = groupQuestionsByType(currentPartData.questions);
  
  // Split questions into two columns (5 questions each)
  const leftQuestions = currentPartData.questions.slice(0, 5);
  const rightQuestions = currentPartData.questions.slice(5, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      {/* Audio Player Bar */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-white font-semibold text-2xl">{currentPartData.title}</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                disabled={audioLoading || audioError}
                className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
                  audioError
                    ? 'bg-red-500 hover:bg-red-600'
                    : !hasStartedAudio 
                    ? 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/50' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } ${audioLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {audioLoading ? (
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : audioError ? (
                  <span className="material-icons text-white text-xl">error</span>
                ) : (
                  <span className="material-icons text-white text-xl">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                )}
              </button>
              
              {/* Audio Status - Simplified without animations */}
              {!hasStartedAudio && !audioLoading && !audioError && (
                <div className="flex items-center space-x-3 bg-green-500/20 border border-green-400/50 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <span className="material-icons text-green-400 text-xl">play_circle</span>
                    <span className="text-green-400 font-bold text-lg">Click to Start Audio</span>
                  </div>
                  <span className="material-icons text-green-400 text-xl">arrow_back</span>
                </div>
              )}
              
              {audioLoading && (
                <span className="text-blue-400 font-medium text-lg">
                  Loading audio...
                </span>
              )}
              
              {audioError && (
                <span className="text-red-400 font-medium text-lg">
                  Audio failed to load
                </span>
              )}
              
              {audioEnded && (
                <span className="text-yellow-400 font-medium text-lg">
                  Audio completed
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-white/70 text-lg">Part {currentPart} of 4</span>
            {lastSaved && (
              <div className="flex items-center space-x-2 bg-green-500/20 rounded-lg px-3 py-1">
                <span className="material-icons text-green-400 text-lg">save</span>
                <span className="material-icons text-green-400 text-sm">autorenew</span>
                {justSaved && (
                  <span className="material-icons text-green-400 text-sm animate-pulse">check</span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Hidden audio element */}
        <audio
          key={`part-${currentPart}`}
          ref={audioRef}
          onEnded={handleAudioEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadStart={handleAudioLoadStart}
          onCanPlay={handleAudioCanPlay}
          onError={handleAudioError}
          preload="metadata"
        >
          <source src={currentPartData.audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-8xl mx-auto">
          {/* Part Header */}
          <div className="text-center mb-8">
            <h3 className="text-4xl font-bold text-white mb-2">{currentPartData.title}</h3>
            <div className="flex justify-center items-center space-x-4 text-white/70 text-lg">
              <span>Questions {((currentPart - 1) * 10) + 1}-{currentPart * 10}</span>
              <span>•</span>
              <span>{currentPartData.questions.length} questions</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-base text-white/70 mb-2">
              <span>Progress</span>
              <span>{currentPart}/4 parts</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentPart / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Questions in Two Columns - Increased width by 10% */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8" style={{ maxWidth: '110%', margin: '0 auto' }}>
            {/* Left Column */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-7 border border-white/20">
              <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="material-icons text-blue-400 mr-2 text-xl">quiz</span>
                Questions {((currentPart - 1) * 10) + 1}-{((currentPart - 1) * 10) + 5}
              </h4>
              
              {/* Group questions by type for left column */}
              {groupQuestionsByType(leftQuestions).map((group, groupIndex) => (
                <div key={groupIndex} className="mb-6">
                  <p className="text-orange-400 font-bold text-lg mb-4">{group.instructions}</p>
                  <div className="space-y-4">
                    {group.questions.map(renderQuestion)}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-7 border border-white/20">
              <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="material-icons text-purple-400 mr-2 text-xl">quiz</span>
                Questions {((currentPart - 1) * 10) + 6}-{currentPart * 10}
              </h4>
              
              {/* Group questions by type for right column */}
              {rightQuestions.length > 0 ? (
                groupQuestionsByType(rightQuestions).map((group, groupIndex) => (
                  <div key={groupIndex} className="mb-6">
                    <p className="text-orange-400 font-bold text-lg mb-4">{group.instructions}</p>
                    <div className="space-y-4">
                      {group.questions.map(renderQuestion)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-white/50 py-12">
                  <span className="material-icons text-5xl mb-4">check_circle</span>
                  <p className="text-lg">All questions for this part are in the left column</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Fixed alignment - Moved outside main content container */}
      <div className="container mx-auto px-4 pb-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Part Navigation Dots */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((partNum) => (
              <div
                key={partNum}
                className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-300 ${
                  partNum === currentPart
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : partNum < currentPart
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-white/30 text-white/50'
                }`}
              >
                {partNum < currentPart ? (
                  <span className="material-icons text-lg">check</span>
                ) : (
                  <span className="text-lg font-bold">{partNum}</span>
                )}
              </div>
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex flex-col items-center space-y-4">
            {currentPart < 4 ? (
              <button
                onClick={handleNextPart}
                disabled={!hasStartedAudio}
                className={`inline-flex items-center space-x-3 px-10 py-5 rounded-2xl text-white font-semibold transition-all duration-300 text-xl ${
                  hasStartedAudio
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
                    : 'bg-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                <span>Next Part</span>
                <span className="material-icons text-xl">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                disabled={!hasStartedAudio}
                className={`inline-flex items-center space-x-3 px-10 py-5 rounded-2xl text-white font-semibold transition-all duration-300 text-xl ${
                  hasStartedAudio
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
                    : 'bg-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                <span>Submit Exam</span>
                <span className="material-icons text-xl">check_circle</span>
              </button>
            )}
            
            {!hasStartedAudio && (
              <p className="text-white/60 text-lg text-center">
                Please start the audio to continue
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Refresh Test Button - Only visible on Part 1 */}
      {currentPart === 1 && (
        <>
          <div className="fixed bottom-6 right-6 z-10">
            <div className="relative group">
              <button
                onClick={handleRefreshTest}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-full shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-110"
                title="Get a new test"
              >
                <span className="material-icons text-2xl">refresh</span>
              </button>
              
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                <div className="bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-xl border border-white/20 whitespace-nowrap">
                  <div className="font-semibold mb-1">Already taken this test?</div>
                  <div className="text-gray-300">Click to get a fresh new test!</div>
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Dialog */}
          {showRefreshConfirm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md mx-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-6">
                    <span className="material-icons text-white text-2xl">refresh</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Get a New Test?</h3>
                  <p className="text-white/80 mb-8 leading-relaxed">
                    Are you sure you want to refresh and get a completely new test? 
                    Your current progress will be lost.
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={cancelRefreshTest}
                      className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmRefreshTest}
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-semibold disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Loading...</span>
                        </div>
                      ) : (
                        'Yes, Get New Test'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListeningExam; 