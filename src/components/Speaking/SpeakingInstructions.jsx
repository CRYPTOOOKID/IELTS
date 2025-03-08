import React from 'react';
import { useSpeakingContext } from './SpeakingContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import './speaking.css';

const SpeakingInstructions = () => {
  const { startTest, fetchTestData, loading, setLoading, setError } = useSpeakingContext();
  
  const handleStartTest = async () => {
    try {
      // Show loading state
      setLoading(true);
      
      // Fetch test data
      await fetchTestData();
      
      // Start the test
      startTest();
    } catch (error) {
      console.error('Error starting test:', error);
      setError('Failed to load test data. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl font-bold mb-4" style={{
          background: "var(--primary-gradient)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent"
        }}>
          IELTS Speaking Test
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Evaluate your English speaking skills with our interactive assessment
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        {/* Instructions Card */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Card className="p-8 h-full speaking-question-card">
            <h2 className="text-2xl font-bold mb-6" style={{
              background: "var(--primary-gradient)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent"
            }}>
              Instructions
            </h2>
            <div className="space-y-5 text-slate-700">
              <p className="text-lg">
                The IELTS Speaking Test evaluates your ability to communicate in English using an interactive interface.
                You will be presented with questions across three parts. Use the microphone button to record your responses.
              </p>
              <div>
                <p className="font-semibold text-lg mb-3">Test Structure:</p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold mr-3 mt-0.5">1</div>
                    <div>
                      <strong className="text-indigo-800">Introduction</strong>
                      <p className="mt-1">You will be asked questions about yourself and familiar topics.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold mr-3 mt-0.5">2</div>
                    <div>
                      <strong className="text-purple-800">Long Turn</strong>
                      <p className="mt-1">A topic with guiding points will be displayed. Prepare for 1 minute and then respond for 1-2 minutes.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-800 font-bold mr-3 mt-0.5">3</div>
                    <div>
                      <strong className="text-pink-800">Discussion</strong>
                      <p className="mt-1">Answer follow-up questions related to the topic presented in Part 2.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Tips for Success Card */}
        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Card className="p-8 h-full speaking-question-card">
            <h2 className="text-2xl font-bold mb-6" style={{
              background: "var(--secondary-gradient)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent"
            }}>
              Tips for Success
            </h2>
            <div className="space-y-5 text-slate-700">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-xl border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-semibold text-indigo-800">Speak Clearly and Naturally</h3>
                </div>
                <p>Use a comfortable pace and articulate your words clearly. Trust your natural speaking style.</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 4a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L9.586 9 6.293 5.707a1 1 0 01.707-1.414zM10 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1z" />
                  </svg>
                  <h3 className="font-semibold text-green-800">Use a Range of Vocabulary</h3>
                </div>
                <p>Express your ideas with varied vocabulary. Avoid repetition to make your responses more engaging.</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-5 rounded-xl border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-semibold text-purple-800">Develop Your Answers</h3>
                </div>
                <p>Elaborate your responses with examples, details, and personal insights to provide depth.</p>
              </div>
              
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-xl border-l-4 border-amber-500 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-semibold text-amber-800">Stay Calm and Confident</h3>
                </div>
                <p>Rely on the on-screen cues and relax. Remember to test your microphone before starting.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <Button
          onClick={handleStartTest}
          disabled={loading}
          className="nav-button px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-medium rounded-xl shadow-lg"
        >
          {loading ? (
            <>
              <div className="relative w-6 h-6 mr-3">
                <div className="absolute inset-0 rounded-full border-2 border-white border-opacity-25"></div>
                <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              </div>
              Loading Test...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Now
            </>
          )}
        </Button>
        <p className="mt-4 text-slate-600 text-base">
          Click the button above to begin your IELTS Speaking assessment
        </p>
      </div>
    </div>
  );
};

export default SpeakingInstructions;