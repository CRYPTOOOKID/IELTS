import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GEMINI_API_KEY = 'AIzaSyA6MdoSLwUd2D8kf1goBDg-92nvMTq2j9A';
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const questions = [
  "What's your favorite book and why?",
  "Describe your ideal vacation destination.",
  "What's the most interesting thing you learned recently?",
  "If you could have any superpower, what would it be and why?",
  "What's your opinion on artificial intelligence?",
  "Describe a challenge you overcame recently.",
  "What's your favorite childhood memory?",
  "If you could change one thing about the world, what would it be?",
  "What are your goals for the next five years?",
  "What advice would you give to your younger self?"
];

const TalkToMe = ({ onBackToGames }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.webkitSpeechRecognition) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscribedText(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    setTranscribedText('');
    setFeedback('');
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      await getFeedback();
    }
  };

  const getFeedback = async () => {
    setIsLoading(true);
    try {
      // Try with API key as a query parameter first
      let response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Act as an expert English teacher. For the spoken response to the question "${questions[currentQuestionIndex]}", analyze the answer: "${transcribedText}". Provide up to three concise lines of plain text feedback detailing any grammatical or structural issues and offering specific suggestions for improvement without using any extra formatting symbols.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200
          }
        })
      });

      // If first attempt fails, try with Authorization header
      if (!response.ok && response.status === 401) {
        console.log("Trying with Authorization header instead of query parameter");
        response = await fetch(GEMINI_API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GEMINI_API_KEY}`
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Act as an expert English teacher. For the spoken response to the question "${questions[currentQuestionIndex]}", analyze the answer: "${transcribedText}". Provide up to three concise lines of plain text feedback detailing any grammatical or structural issues and offering specific suggestions for improvement without using any extra formatting symbols.`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 200
            }
          })
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        throw new Error('Invalid response format from API');
      }

      setFeedback(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error('Error getting feedback:', error);
      setFeedback(`Error getting feedback: ${error.message}. Please try again.`);
    }
    setIsLoading(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscribedText('');
      setFeedback('');
    } else {
      setGameComplete(true);
    }
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-white text-slate-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1.5 }}
            className="text-7xl mb-8"
          >
            🎉
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold mb-4 text-blue-600"
          >
            Congratulations!
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xl mb-8 text-center text-slate-600"
          >
            You've mastered all the speaking challenges!
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToGames}
            className="px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700"
          >
            Return to Games
          </motion.button>
        </div>
        
        <style jsx="true">{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -30px) scale(1.1); }
            50% { transform: translate(-20px, 20px) scale(0.9); }
            75% { transform: translate(20px, 30px) scale(1.05); }
          }
          .animate-blob {
            animation: blob 10s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-white text-slate-800">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto p-6 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={onBackToGames}
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 bg-white text-blue-600 hover:bg-blue-50 border border-blue-100 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </motion.button>
          
          <div className="text-sm font-medium text-slate-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-blue-100">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        <div className="relative w-full h-2.5 mb-8 rounded-full overflow-hidden bg-blue-100 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 h-full bg-blue-600"
          />
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl shadow-xl p-8 mb-8 bg-white border border-blue-100"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">
              Talk To Me
            </h2>

            <div className="space-y-6">
              <div className="rounded-xl p-6 bg-blue-50 border border-blue-100 shadow-inner">
                <h3 className="text-xl font-semibold mb-2 text-blue-800">Your Question:</h3>
                <p className="text-lg text-slate-700">
                  {questions[currentQuestionIndex]}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startListening}
                  disabled={isListening}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md ${
                    isListening
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  {isListening ? 'Listening...' : 'Start Speaking'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopListening}
                  disabled={!isListening}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md ${
                    !isListening
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  Stop Speaking
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {transcribedText && (
                  <motion.div
                    key="transcribed-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="rounded-xl p-6 bg-slate-50 border border-slate-200 shadow-inner"
                  >
                    <h4 className="text-lg font-semibold mb-2 text-slate-800">Your Response:</h4>
                    <p className="text-slate-700">{transcribedText}</p>
                  </motion.div>
                )}

                {isLoading && (
                  <motion.div
                    key="loading-spinner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center gap-3 text-slate-600 py-4"
                  >
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing your response...
                  </motion.div>
                )}

                {feedback && (
                  <motion.div
                    key="feedback"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="rounded-xl p-6 bg-indigo-50 border border-indigo-100 shadow-md"
                  >
                    <h4 className="text-lg font-semibold mb-2 text-indigo-800">Feedback:</h4>
                    <p className="text-slate-700 whitespace-pre-line">{feedback}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Next Question
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <style jsx="true">{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 30px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default TalkToMe;