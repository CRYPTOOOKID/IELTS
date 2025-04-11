import React, { useState } from 'react';
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
  BarChart
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

const IELTSLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">IELTS Mastery</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><a href="#features" className="text-gray-600 hover:text-blue-600 transition duration-200">Features</a></li>
                <li><a href="#skills" className="text-gray-600 hover:text-blue-600 transition duration-200">Skills</a></li>
                <li><a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition duration-200">Testimonials</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-blue-600 transition duration-200">Pricing</a></li>
              </ul>
            </nav>
            
            <div className="hidden md:block">
              <button 
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Get Started
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Features</a>
              <a href="#skills" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Skills</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Testimonials</a>
              <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Pricing</a>
              <button 
                onClick={handleGetStarted}
                className="mt-2 w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Master IELTS with <span className="text-blue-600">AI-Powered</span> Precision
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  Experience real-time feedback and expert guidance to achieve your target IELTS score. Just like the official exam, but with instant AI assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleGetStarted}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 text-lg font-medium"
                  >
                    Get Started
                  </button>
                  <button className="bg-transparent border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition duration-200 text-lg font-medium">
                    Learn More
                  </button>
                </div>
              </div>
              
              <div className="md:w-1/2 mt-12 md:mt-0">
                <div className="relative">
                  <div className="bg-blue-600 rounded-lg w-full h-64 md:h-96 opacity-20 absolute -top-4 -right-4"></div>
                  <div className="bg-white rounded-lg shadow-xl p-6 relative">
                    <div className="flex flex-col gap-4 h-full">
                      <div className="flex gap-3">
                        <div className="bg-blue-100 rounded-lg p-4 flex-1 text-center">
                          <Headphones className="text-blue-600 w-12 h-12 mx-auto mb-2" />
                          <h3 className="font-semibold text-blue-800">Listening</h3>
                        </div>
                        <div className="bg-green-100 rounded-lg p-4 flex-1 text-center">
                          <BookOpen className="text-green-600 w-12 h-12 mx-auto mb-2" />
                          <h3 className="font-semibold text-green-800">Reading</h3>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="bg-purple-100 rounded-lg p-4 flex-1 text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-2 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.6 9.45c-1.95 2.7-4.5 5.25-7.2 7.2" />
                            <path d="M22 2 11 13" />
                            <path d="M9 11c-2.7 1.95-5.25 4.5-7.2 7.2" />
                          </svg>
                          <h3 className="font-semibold text-purple-800">Writing</h3>
                        </div>
                        <div className="bg-amber-100 rounded-lg p-4 flex-1 text-center">
                          <MessageSquare className="text-amber-600 w-12 h-12 mx-auto mb-2" />
                          <h3 className="font-semibold text-amber-800">Speaking</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Master All IELTS Sections</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive platform helps you excel in all four components of the IELTS exam with AI-powered feedback and guidance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Listening Component */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 transition duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Headphones className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Listening</h3>
                <p className="text-gray-600 mb-4">
                  Practice with authentic IELTS listening tests and receive detailed scoring on your performance.
                </p>
                <div className="flex items-center text-blue-600 font-medium hover:text-blue-800 cursor-pointer">
                  <span>Learn More</span>
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
              
              {/* Reading Component */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 transition duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Reading</h3>
                <p className="text-gray-600 mb-4">
                  Enhance your reading skills with real IELTS passages and receive AI-powered feedback on your answers.
                </p>
                <div className="flex items-center text-green-600 font-medium hover:text-green-800 cursor-pointer">
                  <span>Learn More</span>
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
              
              {/* Writing Component */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 transition duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M17.6 9.45c-1.95 2.7-4.5 5.25-7.2 7.2" />
                    <path d="M22 2 11 13" />
                    <path d="M9 11c-2.7 1.95-5.25 4.5-7.2 7.2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Writing</h3>
                <p className="text-gray-600 mb-4">
                  Get real-time AI feedback on your essays with suggestions for improvements in grammar, vocabulary, and structure.
                </p>
                <div className="flex items-center text-purple-600 font-medium hover:text-purple-800 cursor-pointer">
                  <span>Learn More</span>
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
              
              {/* Speaking Component */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 transition duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="bg-amber-600 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Speaking</h3>
                <p className="text-gray-600 mb-4">
                  Practice speaking tasks with our AI interviewer and receive instant feedback on your pronunciation and fluency.
                </p>
                <div className="flex items-center text-amber-600 font-medium hover:text-amber-800 cursor-pointer">
                  <span>Learn More</span>
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Feedback Highlight Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center lg:space-x-12">
              <div className="lg:w-1/2 mb-10 lg:mb-0">
                <div className="relative">
                  <div className="bg-blue-600 rounded-lg w-full h-64 md:h-96 opacity-10 absolute -top-4 -left-4"></div>
                  <div className="bg-white rounded-lg shadow-xl overflow-hidden relative">
                    <div className="bg-gray-900 p-3 flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-gray-400 text-sm">IELTS Mastery AI Feedback</div>
                    </div>
                    <div className="p-6">
                      <div className="mb-4">
                        <p className="text-gray-500 mb-2 text-sm">Essay Response:</p>
                        <p className="text-gray-800">The graph shows information about computer ownership as a percentage of the population between 2002 and 2010...</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-blue-700 mb-2 flex items-center">
                          <BarChart size={18} className="mr-2" /> AI Feedback Analysis
                        </h4>
                        
                        <div className="mb-4">
                          <div className="font-medium text-gray-800 mb-1">Task Achievement</div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <div className="mt-1 text-sm text-gray-600 flex justify-between">
                            <span>8.5/10</span>
                            <span className="text-green-600 font-medium">Very Good</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="font-medium text-gray-800 mb-1">Coherence & Cohesion</div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                          <div className="mt-1 text-sm text-gray-600 flex justify-between">
                            <span>8.0/10</span>
                            <span className="text-green-600 font-medium">Good</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="font-medium text-gray-800 mb-1">Lexical Resource</div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                          </div>
                          <div className="mt-1 text-sm text-gray-600 flex justify-between">
                            <span>7.0/10</span>
                            <span className="text-amber-600 font-medium">Satisfactory</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="font-medium text-gray-800 mb-1">Grammar Range & Accuracy</div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                          <div className="mt-1 text-sm text-gray-600 flex justify-between">
                            <span>6.5/10</span>
                            <span className="text-amber-600 font-medium">Adequate</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <div className="flex justify-between items-center">
                            <div className="font-medium text-gray-800">Overall Band Score:</div>
                            <div className="flex items-center">
                              <span className="text-xl font-bold text-blue-700">7.5</span>
                              <Star size={16} className="ml-1 text-blue-600 fill-blue-600" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Real-time AI Feedback <span className="text-blue-600">Just Like an Examiner</span></h2>
                <p className="text-xl text-gray-600 mb-8">
                  Our advanced AI technology provides immediate, detailed feedback on your performance—just like having a personal IELTS examiner available 24/7.
                </p>
                
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <CheckCircle2 className="text-white" size={14} />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold mb-1">Detailed Scoring</h3>
                      <p className="text-gray-600">Get comprehensive band scores with specific feedback on each criteria.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <CheckCircle2 className="text-white" size={14} />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold mb-1">Improvement Suggestions</h3>
                      <p className="text-gray-600">Receive actionable tips to improve your grammar, vocabulary, and structure.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <CheckCircle2 className="text-white" size={14} />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold mb-1">Progress Tracking</h3>
                      <p className="text-gray-600">Monitor your improvement over time with detailed analytics and insights.</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleGetStarted}
                  className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 text-lg font-medium inline-flex items-center"
                >
                  Get Started
                  <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose IELTS Mastery</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform offers unique advantages to help you achieve your target score faster and more efficiently.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
                <div className="mb-4 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Authentic Exam Experience</h3>
                <p className="text-gray-600">
                  Practice with tests that exactly replicate the format, timing, and difficulty of the official IELTS General exam.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
                <div className="mb-4 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Live AI Feedback</h3>
                <p className="text-gray-600">
                  Get instant, detailed feedback on your performance across all IELTS components, helping you identify areas for improvement.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
                <div className="mb-4 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2" />
                    <path d="M12 10v6" />
                    <path d="m9 13 3-3 3 3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Comprehensive Resources</h3>
                <p className="text-gray-600">
                  Access a vast library of practice materials, vocabulary lists, grammar lessons, and strategy guides.
                </p>
              </div>
              
              {/* Feature 4 */}
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
                <div className="mb-4 text-blue-600">
                  <Clock size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Study Anywhere, Anytime</h3>
                <p className="text-gray-600">
                  Access our platform on any device - desktop, tablet, or mobile - and study whenever and wherever it's convenient for you.
                </p>
              </div>
              
              {/* Feature 5 */}
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
                <div className="mb-4 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Expert Support</h3>
                <p className="text-gray-600">
                  Get help from our team of IELTS experts whenever you need clarification or have questions about your preparation.
                </p>
              </div>
              
              {/* Feature 6 */}
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
                <div className="mb-4 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12h10" />
                    <path d="M9 4v16" />
                    <path d="M14 9h3" />
                    <path d="M14 12h7" />
                    <path d="M14 15h3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Personalized Learning</h3>
                <p className="text-gray-600">
                  Our system adapts to your strengths and weaknesses, creating a customized study plan to maximize your score improvement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how IELTS Mastery has helped students achieve their target scores and pursue their dreams.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">SK</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold">Sarah K.</h4>
                    <p className="text-gray-600">Band 7.5 | Canada</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                  ))}
                </div>
                <p className="text-gray-600">
                  "After struggling with the Writing section for months, IELTS Mastery's AI feedback helped me identify my weaknesses and improve my score from 6.0 to 7.5 in just 6 weeks."
                </p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-bold">RP</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold">Raj P.</h4>
                    <p className="text-gray-600">Band 8.0 | Australia</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                  ))}
                </div>
                <p className="text-gray-600">
                  "The Speaking practice with AI feedback transformed my confidence. The realistic simulation of the actual test environment made a huge difference on test day."
                </p>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-bold">EM</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold">Elena M.</h4>
                    <p className="text-gray-600">Band 7.0 | UK</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                  ))}
                </div>
                <p className="text-gray-600">
                  "I had taken the IELTS twice before and couldn't get the score I needed. With IELTS Mastery, I finally understood where I was going wrong and achieved my target score."
                </p>
              </div>
            </div>
            
            {/* Success Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-4xl font-bold text-blue-600 mb-2">94%</h3>
                <p className="text-gray-600">of users improve their score</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-4xl font-bold text-blue-600 mb-2">1.5+</h3>
                <p className="text-gray-600">average band score improvement</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-4xl font-bold text-blue-600 mb-2">50K+</h3>
                <p className="text-gray-600">successful students</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-4xl font-bold text-blue-600 mb-2">30+</h3>
                <p className="text-gray-600">countries served</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Start Your IELTS Success Journey Today
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of successful test-takers who achieved their target score with IELTS Mastery.
              </p>
              
              <Alert className="bg-white border-blue-200 mb-8">
                <AlertCircle className="text-blue-600" size={18} />
                <AlertTitle className="text-gray-900">Limited Time Offer</AlertTitle>
                <AlertDescription className="text-gray-600">
                  Get 20% off any plan when you sign up before the end of the month.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-center">
                <button 
                  onClick={handleGetStarted}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition duration-200 text-lg font-medium">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find answers to common questions about IELTS Mastery and how it can help you succeed.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {/* FAQ Item 1 */}
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
                  <h3 className="text-xl font-bold mb-3">How does the AI feedback work?</h3>
                  <p className="text-gray-600">
                    Our advanced AI system analyzes your responses across all four IELTS components, providing detailed feedback on grammar, vocabulary, pronunciation, and content. It compares your performance to the official IELTS scoring criteria and offers specific suggestions for improvement.
                  </p>
                </div>
                
                {/* FAQ Item 2 */}
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
                  <h3 className="text-xl font-bold mb-3">How accurate is your simulated test compared to the real IELTS?</h3>
                  <p className="text-gray-600">
                    Our tests are designed to mirror the official IELTS exam in format, timing, difficulty, and scoring. Our team includes certified IELTS examiners who ensure that our materials meet the same standards as the actual test.
                  </p>
                </div>
                
                {/* FAQ Item 3 */}
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
                  <h3 className="text-xl font-bold mb-3">Can I access the platform on my mobile device?</h3>
                  <p className="text-gray-600">
                    Yes, IELTS Mastery is fully responsive and works on all devices, including smartphones and tablets. You can practice and improve your skills whenever and wherever is most convenient for you.
                  </p>
                </div>
                
                {/* FAQ Item 4 */}
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
                  <h3 className="text-xl font-bold mb-3">How long does it take to see improvement in my scores?</h3>
                  <p className="text-gray-600">
                    Most users see meaningful improvement within 2-4 weeks of consistent practice. The exact timeline depends on your starting level, target score, and the amount of time you dedicate to practice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">IELTS Mastery</h3>
              <p className="mb-4">Helping students achieve their dream IELTS scores with AI-powered practice and feedback.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#skills" className="hover:text-white">Skills</a></li>
                <li><a href="#testimonials" className="hover:text-white">Testimonials</a></li>
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Practice Tests</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Listening Tests</a></li>
                <li><a href="#" className="hover:text-white">Reading Tests</a></li>
                <li><a href="#" className="hover:text-white">Writing Tasks</a></li>
                <li><a href="#" className="hover:text-white">Speaking Practice</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">About Us</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Our Story</a></li>
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>© {new Date().getFullYear()} IELTS Mastery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IELTSLandingPage;