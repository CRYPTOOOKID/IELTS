import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  BookOpen, 
  Headphones, 
  MessageSquare, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight, 
  Menu, 
  X,
  Star,
  Clock,
  BarChart,
  Gamepad,
  Target,
  Trophy,
  Globe,
  Zap,
  Users,
  GraduationCap
} from 'lucide-react';

// Simple Alert components implementation
const Alert = ({ className, children }) => {
  return (
    <div className={`p-4 rounded-lg border flex items-start gap-3 ${className}`}>
      {children}
    </div>
  );
};

const AlertTitle = ({ className, children }) => {
  return <h5 className={`font-medium ${className}`}>{children}</h5>;
};

const AlertDescription = ({ className, children }) => {
  return <div className={`text-sm ${className}`}>{children}</div>;
};

const SpintaLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
  const navigate = useNavigate();

  // Check for logout success message
  useEffect(() => {
    const hasLoggedOut = sessionStorage.getItem('showLogoutSuccess');
    
    if (hasLoggedOut === 'true') {
      setShowLogoutSuccess(true);
      
      // Clear the session storage flag
      sessionStorage.removeItem('showLogoutSuccess');
      
      // Hide the message after 3 seconds
      const timer = setTimeout(() => {
        setShowLogoutSuccess(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogin = () => {
    navigate('/login?tab=signin');
  };

  const handleGetStarted = () => {
    navigate('/login?tab=signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/20 to-purple-900/40"></div>
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-teal-400/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Logout Success Toast */}
      {showLogoutSuccess && (
        <div className="fixed top-4 right-4 bg-green-50 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded-lg shadow-md flex items-center space-x-2 animate-fadeIn z-50">
          <CheckCircle2 size={20} className="text-green-500" />
          <span>Successfully logged out</span>
        </div>
      )}
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/skills')}
              className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img 
                  src="/logo.ico" 
                  alt="SPINTA Logo" 
                  className="w-8 h-8 rounded-lg object-contain" 
                  style={{
                    imageRendering: 'crisp-edges',
                    filter: 'contrast(1.1) brightness(1.05)',
                    WebkitFilter: 'contrast(1.1) brightness(1.05)'
                  }} 
                />
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-lg">SPINTA</span>
            </button>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><a href="#features" className="text-white/80 hover:text-white transition duration-200">Features</a></li>
                <li><a href="#exams" className="text-white/80 hover:text-white transition duration-200">Tests</a></li>
                <li><a href="#games" className="text-white/80 hover:text-white transition duration-200">Games</a></li>
              </ul>
            </nav>
            
            <div className="hidden md:block">
              <button 
                onClick={handleLogin}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition duration-200 font-medium shadow-lg"
              >
                Login
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-cyan-300 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/20 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#features" className="block px-3 py-2 text-white hover:text-cyan-300">Features</a>
              <a href="#exams" className="block px-3 py-2 text-white hover:text-cyan-300">Tests</a>
              <a href="#games" className="block px-3 py-2 text-white hover:text-cyan-300">Games</a>
              <button 
                onClick={handleLogin}
                className="mt-2 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-6">
                  <Zap className="w-4 h-4 text-cyan-400 mr-2" />
                  <span className="text-sm font-medium">AI-Powered English Test Preparation</span>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Master <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">English Tests</span> with AI Precision
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed">
                Experience IELTS and TOEFL preparation like never before. Get real-time AI feedback, practice with games, and track your progress with advanced analytics.
              </p>
              
              {/* Free Tests Offer */}
              <div className="mb-12">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-lg rounded-full border border-emerald-400/30 mb-4">
                  <Trophy className="w-5 h-5 text-emerald-400 mr-3" />
                  <span className="text-emerald-300 font-semibold text-lg">🎉 Get 2 Free Tests Upon Registration!</span>
                </div>
                <p className="text-white/70 text-sm text-center">
                  Start your journey with two complete practice tests at no cost
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button 
                  onClick={handleGetStarted}
                  className="group bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-lg font-semibold flex items-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center space-x-4 text-white/60">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span>Trusted by students</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    <span>4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Test Platforms Section */}
        <section id="exams" className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Choose Your <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Test Platform</span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Practice with authentic test formats and get instant AI feedback
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* IELTS Card */}
              <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">IELTS</h3>
                        <p className="text-white/60">International English Language Testing System</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-400">4 Skills</div>
                      <div className="text-sm text-white/60">Complete Training</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <Headphones className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <div className="text-sm font-medium">Listening</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <BookOpen className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="text-sm font-medium">Reading</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.6 9.45c-1.95 2.7-4.5 5.25-7.2 7.2" />
                        <path d="M22 2 11 13" />
                        <path d="M9 11c-2.7 1.95-5.25 4.5-7.2 7.2" />
                      </svg>
                      <div className="text-sm font-medium">Writing</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <MessageSquare className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-sm font-medium">Speaking</div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center">
                    Start IELTS Practice
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* TOEFL Card */}
              <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">TOEFL</h3>
                        <p className="text-white/60">Test of English as a Foreign Language</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">4 Skills</div>
                      <div className="text-sm text-white/60">Complete Training</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <Headphones className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <div className="text-sm font-medium">Listening</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <BookOpen className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="text-sm font-medium">Reading</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.6 9.45c-1.95 2.7-4.5 5.25-7.2 7.2" />
                        <path d="M22 2 11 13" />
                        <path d="M9 11c-2.7 1.95-5.25 4.5-7.2 7.2" />
                      </svg>
                      <div className="text-sm font-medium">Writing</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <MessageSquare className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-sm font-medium">Speaking</div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center">
                    Start TOEFL Practice
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Coming Soon */}
            <div className="text-center mt-12">
              <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-lg rounded-full border border-white/20">
                <Clock className="w-5 h-5 text-cyan-400 mr-3" />
                <span className="text-white/80">Cambridge, PTE, and more tests coming soon!</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why Choose <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">SPINTA?</span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Experience the future of language learning with our cutting-edge features
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI Feedback */}
              <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">AI-Powered Feedback</h3>
                <p className="text-white/70">
                  Get instant, detailed feedback just like having a personal examiner available 24/7
                </p>
              </div>
              
              {/* Progress Tracking */}
              <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <BarChart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Smart Analytics</h3>
                <p className="text-white/70">
                  Track your progress with advanced analytics and personalized insights
                </p>
              </div>
              
              {/* Gamification */}
              <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Gamepad className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Interactive Games</h3>
                <p className="text-white/70">
                  Learn through engaging games that make vocabulary and grammar fun
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section id="games" className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center lg:space-x-16">
              <div className="lg:w-1/2 mb-12 lg:mb-0">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Play</span> Your Way to Fluency
                </h2>
                <p className="text-xl text-white/80 mb-8 leading-relaxed">
                  Transform learning into an adventure with our interactive games designed to boost your vocabulary, grammar, and confidence.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/90">Vocabulary building through interactive challenges</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/90">Grammar mastery with gamified lessons</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/90">Real-time progress tracking and achievements</span>
                  </div>
                </div>
                
                <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 font-semibold flex items-center">
                  Explore Games
                  <Gamepad className="ml-3 w-5 h-5" />
                </button>
              </div>
              
              <div className="lg:w-1/2">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { name: "CrossRoads", desc: "Master conditionals", color: "from-cyan-500 to-blue-500" },
                    { name: "WordTile", desc: "Sentence building", color: "from-blue-500 to-indigo-500" },
                    { name: "DragZilla", desc: "Grammar positioning", color: "from-emerald-500 to-teal-500" },
                    { name: "TalkToMe", desc: "Speaking practice", color: "from-purple-500 to-pink-500" }
                  ].map((game, index) => (
                    <div key={index} className="group bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                      <div className={`w-12 h-12 bg-gradient-to-r ${game.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}></div>
                      <h3 className="text-lg font-bold mb-2">{game.name}</h3>
                      <p className="text-white/60 text-sm">{game.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Ready to Start Your <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Success Journey?</span>
              </h2>
              <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
                Join thousands of students who've achieved their target scores with SPINTA's AI-powered preparation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button 
                  onClick={handleGetStarted}
                  className="group bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-10 py-4 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-lg font-semibold flex items-center shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={handleLogin}
                  className="group bg-white/10 backdrop-blur-lg border border-white/20 text-white px-10 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 text-lg font-semibold"
                >
                  Sign In
                </button>
              </div>
              
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 justify-center max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">Trusted</div>
                  <div className="text-white/60">by Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
                  <div className="text-white/60">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">4.9★</div>
                  <div className="text-white/60">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 bg-black/20 backdrop-blur-lg py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <img src="/logo.ico" alt="SPINTA Logo" className="w-8 h-8 rounded-lg" />
                </div>
                <span className="text-xl font-bold text-white drop-shadow-lg">SPINTA</span>
              </div>
              <p className="text-white/60 mb-4">AI-powered English test preparation for IELTS, TOEFL, and more.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Tests</h3>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition">IELTS Practice</a></li>
                <li><a href="#" className="hover:text-white transition">TOEFL Practice</a></li>
                <li><a href="#" className="hover:text-white transition">Coming Soon</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition">AI Feedback</a></li>
                <li><a href="#" className="hover:text-white transition">Progress Tracking</a></li>
                <li><a href="#" className="hover:text-white transition">Interactive Games</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-12 pt-8 text-center">
            <p className="text-white/60">© {new Date().getFullYear()} SPINTA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SpintaLandingPage;