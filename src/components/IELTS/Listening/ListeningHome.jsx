import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';

const ListeningHome = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleStartExam = () => {
    navigate('/ielts/listening/exam');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const testFeatures = [
    {
      icon: 'headphones',
      title: 'Audio Recordings',
      description: '4 sections with authentic listening materials'
    },
    {
      icon: 'timer',
      title: '30 Minutes',
      description: 'Standard IELTS listening test duration'
    },
    {
      icon: 'quiz',
      title: '40 Questions',
      description: 'Various question types including multiple choice, form filling, and matching'
    },
    {
      icon: 'assessment',
      title: 'Instant Feedback',
      description: 'Get your results immediately after completion'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/20 to-purple-900/40"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20">
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
              <button 
                onClick={() => navigate('/ielts-skills')}
                className="text-white/80 hover:text-white transition duration-200 flex items-center space-x-1"
              >
                <span className="material-icons text-sm">arrow_back</span>
                <span>Back to Skills</span>
              </button>
              <div className="text-white/60">|</div>
              <span className="text-white/80 font-medium">IELTS Listening</span>
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
      <main className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl mb-8 shadow-2xl">
              <span className="material-icons text-white text-4xl">headphones</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                IELTS
              </span>
              <br />
              <span className="text-white/90">Listening Test</span>
            </h1>
            <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed mb-8">
              Test your listening comprehension skills with authentic IELTS materials. 
              Complete 4 sections with increasing difficulty levels.
            </p>
          </div>

          {/* Test Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {testFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
                  <span className="material-icons text-white text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Test Instructions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <span className="material-icons text-blue-400 mr-3">info</span>
              Test Instructions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Test Structure</h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start">
                    <span className="material-icons text-blue-400 mr-3 mt-0.5">play_circle</span>
                    <span><strong>Section 1:</strong> Conversation in social context</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-blue-400 mr-3 mt-0.5">play_circle</span>
                    <span><strong>Section 2:</strong> Monologue in social context</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-blue-400 mr-3 mt-0.5">play_circle</span>
                    <span><strong>Section 3:</strong> Educational conversation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-blue-400 mr-3 mt-0.5">play_circle</span>
                    <span><strong>Section 4:</strong> Academic monologue</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Important Notes</h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start">
                    <span className="material-icons text-yellow-400 mr-3 mt-0.5">warning</span>
                    <span>Audio plays only once per section</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-green-400 mr-3 mt-0.5">check_circle</span>
                    <span>You can pause and resume audio</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-blue-400 mr-3 mt-0.5">edit</span>
                    <span>Answer questions while listening</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-purple-400 mr-3 mt-0.5">schedule</span>
                    <span>Complete all sections to finish</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Start Test Button */}
          <div className="text-center">
            <button
              onClick={handleStartExam}
              className="group inline-flex items-center space-x-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-6 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-xl font-semibold"
            >
              <span className="material-icons text-3xl group-hover:scale-110 transition-transform duration-300">play_arrow</span>
              <span>Start Listening Test</span>
              <span className="material-icons text-2xl group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
            </button>
            <p className="text-white/60 mt-4 text-sm">
              Make sure you have a quiet environment and working headphones
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListeningHome;