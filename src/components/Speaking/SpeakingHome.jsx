import React from 'react';
import { useSpeakingContext } from './SpeakingContext';
import SpeakingInstructions from './SpeakingInstructions';
import { Part1, Part2, Part3 } from './SpeakingParts';
import SpeakingFeedback from './SpeakingFeedback';
import { Card } from '../ui/card';
import './speaking.css';

const SpeakingHome = () => {
  const {
    testData,
    loading,
    error,
    setError,
    showInstructions,
    currentPart,
    usingFallback,
    showFeedback
  } = useSpeakingContext();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-xl text-slate-600">Loading test data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[80vh]">
        <Card className="max-w-md w-full p-6 bg-red-50 border-red-200">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => setError(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Instructions
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Show feedback if available
  if (showFeedback) {
    return <SpeakingFeedback />;
  }

  // Always show instructions first if no test is in progress
  if (showInstructions) {
    return <SpeakingInstructions />;
  }
  
  // If we're not showing instructions but don't have test data yet, show loading
  if (!testData) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-xl text-slate-600">Loading test data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {usingFallback ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>
            GraphQL API requests failed. Using fallback test data.
          </span>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>
            Successfully loaded test data.
          </span>
        </div>
      )}
      
      {currentPart === 1 && <Part1 />}
      {currentPart === 2 && <Part2 />}
      {currentPart === 3 && <Part3 />}
    </div>
  );
};

export default SpeakingHome;