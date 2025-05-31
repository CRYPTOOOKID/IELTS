import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';

const ListeningFeedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  
  // Get data from navigation state
  const { answers = {}, testData = null, results = null } = location.state || {};

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleRetakeTest = () => {
    navigate('/ielts/listening/exam');
  };

  const handleBackToHome = () => {
    navigate('/ielts/listening');
  };

  // If no data, redirect back
  if (!testData || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">No test data found</p>
          <button
            onClick={() => navigate('/ielts/listening')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Listening Home
          </button>
        </div>
      </div>
    );
  }

  const getBandColor = (band) => {
    if (band >= 8) return 'text-green-400';
    if (band >= 6) return 'text-blue-400';
    if (band >= 4) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return "Outstanding performance! You have excellent listening skills.";
    if (percentage >= 80) return "Great job! Your listening comprehension is very good.";
    if (percentage >= 70) return "Good work! You have solid listening skills with room for improvement.";
    if (percentage >= 60) return "Fair performance. Focus on improving your listening strategies.";
    if (percentage >= 50) return "You're making progress. More practice will help improve your skills.";
    return "Keep practicing! Regular listening practice will help you improve significantly.";
  };

  const renderQuestionAnalysis = (section) => {
    return section.questions.map((question) => {
      const userAnswer = answers[question.id] || '';
      const isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      
      return (
        <div key={question.id} className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-start justify-between mb-3">
            <p className="text-white font-medium flex-1">{question.id}. {question.question}</p>
            <div className={`flex items-center space-x-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              <span className="material-icons text-sm">
                {isCorrect ? 'check_circle' : 'cancel'}
              </span>
              <span className="text-sm font-medium">
                {isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-white/60 text-sm">Your answer:</span>
              <span className={`font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {userAnswer || 'No answer provided'}
              </span>
            </div>
            
            {!isCorrect && (
              <div className="flex items-center space-x-3">
                <span className="text-white/60 text-sm">Correct answer:</span>
                <span className="text-green-400 font-medium">{question.correctAnswer}</span>
              </div>
            )}
            
            {question.type === 'multiple_choice' && (
              <div className="mt-3">
                <span className="text-white/60 text-sm">Options:</span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm ${
                        option === question.correctAnswer
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : option === userAnswer && !isCorrect
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-white/5 text-white/70'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/ielts-skills')}
              className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img 
                  src="/logo.ico" 
                  alt="SPINTA Logo" 
                  className="w-8 h-8 rounded-lg object-contain" 
                />
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-lg">SPINTA</span>
            </button>
            
            <nav className="hidden md:flex items-center space-x-8">
              <span className="text-white/80 font-medium">IELTS Listening Results</span>
            </nav>
            
            <button 
              onClick={handleLogout}
              className="group flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white/80 px-4 py-2 rounded-lg hover:bg-white/20 hover:text-white transition-all duration-300 border border-white/20"
            >
              <span className="material-icons text-lg">logout</span>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Results Overview */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl mb-8 shadow-2xl">
              <span className="material-icons text-white text-4xl">assessment</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Test
              </span>
              <br />
              <span className="text-white/90">Complete!</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              {getPerformanceMessage(results.percentage)}
            </p>
          </div>

          {/* Score Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">{results.correct}</div>
              <div className="text-white/70">Correct Answers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">{results.total}</div>
              <div className="text-white/70">Total Questions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">{results.percentage}%</div>
              <div className="text-white/70">Accuracy</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className={`text-4xl font-bold mb-2 ${getBandColor(results.band)}`}>
                {results.band}
              </div>
              <div className="text-white/70">IELTS Band</div>
            </div>
          </div>

          {/* Section-by-Section Analysis */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <span className="material-icons text-blue-400 mr-3">analytics</span>
              Detailed Analysis
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {testData.sections.map((section) => {
                const sectionCorrect = section.questions.filter(q => {
                  const userAnswer = answers[q.id] || '';
                  return userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
                }).length;
                
                return (
                  <div key={section.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">{section.title}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400">
                          {sectionCorrect}/{section.questions.length}
                        </div>
                        <div className="text-sm text-white/70">
                          {Math.round((sectionCorrect / section.questions.length) * 100)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {renderQuestionAnalysis(section)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Band Score Information */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="material-icons text-yellow-400 mr-3">school</span>
              IELTS Band Score Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-400">Band 7-9 (Expert User)</h4>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Excellent comprehension</li>
                  <li>• Understands complex ideas</li>
                  <li>• Minimal errors</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-400">Band 5-6 (Competent User)</h4>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Good overall comprehension</li>
                  <li>• Some inaccuracies</li>
                  <li>• Handles routine situations well</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-yellow-400">Band 1-4 (Limited User)</h4>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Basic comprehension</li>
                  <li>• Frequent misunderstandings</li>
                  <li>• Needs more practice</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetakeTest}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
            >
              <span className="material-icons">refresh</span>
              <span>Retake Test</span>
            </button>
            
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 font-semibold"
            >
              <span className="material-icons">home</span>
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListeningFeedback; 