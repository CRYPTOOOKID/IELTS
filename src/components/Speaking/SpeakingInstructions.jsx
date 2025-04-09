import React from 'react';
import { useSpeakingContext } from './SpeakingContext';
import { useNavigate } from 'react-router-dom';
import './speaking.css';

const SpeakingInstructions = () => {
  const { startTest, fetchTestData, loading, setLoading, setError } = useSpeakingContext();
  const navigate = useNavigate();
  
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
      setError('Failed to load test data. Using fallback test content instead.');
      // Even if there's an error, still start the test with fallback data
      startTest();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <span className="material-icons mr-1">arrow_back</span>
          Home
        </button>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">IELTS Speaking Practice</h1>
        
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">IELTS Speaking Test Instructions</h1>
          
          <div className="space-y-6 text-gray-700">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Overview</h2>
              <p>The IELTS Speaking test assesses your ability to communicate in English using an interactive interface. You will be presented with questions across three parts.</p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Test Format</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Part 1: Introduction and interview (4-5 minutes)</li>
                <li>Part 2: Individual long turn (3-4 minutes)</li>
                <li>Part 3: Two-way discussion (4-5 minutes)</li>
                <li>Use the microphone button to record your responses</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Tips for Success</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Speak clearly and naturally at a comfortable pace</li>
                <li>Use a range of vocabulary to express your ideas</li>
                <li>Develop your answers with examples and details</li>
                <li>Stay calm and confident throughout the test</li>
                <li>Test your microphone before starting</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h2 className="text-xl font-semibold text-yellow-700 mb-2">Important Notes</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You can record and re-record your responses as needed</li>
                <li>Take time to think before responding to complex questions</li>
                <li>Aim to speak for the full time allocated in Part 2</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <button 
              onClick={handleStartTest}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? 'Loading Test...' : 'Start Test'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingInstructions;