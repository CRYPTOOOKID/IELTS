import React from 'react';
import { useSpeakingContext } from './SpeakingContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

const SpeakingInstructions = () => {
  const { startTest, fetchTestData, loading, setLoading, setError } = useSpeakingContext();
  
  const handleStartTest = async () => {
    try {
      // Show loading state
      setLoading(true);
      
      // Fetch test data from Gemini API
      await fetchTestData();
      
      // Start the test
      startTest();
    } catch (error) {
      console.error("Error starting test:", error);
      setError("Failed to load test data. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">IELTS Speaking Test</h1>
      
      <Card className="mb-8 p-6">
        <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
        <div className="space-y-4 text-slate-700">
          <p>
            The IELTS Speaking test consists of 3 parts and takes between 11 and 14 minutes to complete.
          </p>
          <p>
            The test is a face-to-face interview with an examiner who will assess your ability to communicate effectively in English.
          </p>
          <p>
            The test is structured as follows:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Part 1 (4-5 minutes):</strong> Introduction and interview. The examiner will ask you general questions about yourself and familiar topics.</li>
            <li><strong>Part 2 (3-4 minutes):</strong> Long turn. You will be given a card with a topic and some points to include in your talk. You will have 1 minute to prepare and then speak for 1-2 minutes.</li>
            <li><strong>Part 3 (4-5 minutes):</strong> Discussion. The examiner will ask you more abstract questions related to the topic in Part 2.</li>
          </ul>
        </div>
      </Card>

      <Card className="mb-8 p-6">
        <h2 className="text-2xl font-semibold mb-4">Tips for Success</h2>
        <div className="space-y-4 text-slate-700">
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Speak Clearly and Naturally</h3>
            <p>Try to speak at a natural pace, not too fast or too slow. Pronounce words clearly but don't worry about having an accent.</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-md mb-4">
            <h3 className="font-semibold text-green-800 mb-2">Use a Range of Vocabulary</h3>
            <p>Try to use a variety of words and phrases to express your ideas. Avoid repeating the same words too often.</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-md mb-4">
            <h3 className="font-semibold text-purple-800 mb-2">Develop Your Answers</h3>
            <p>Don't give one-word or very short answers. Develop your responses with examples, reasons, and personal experiences.</p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-md">
            <h3 className="font-semibold text-amber-800 mb-2">Stay Calm and Confident</h3>
            <p>It's normal to feel nervous, but try to stay calm. If you don't understand a question, ask the examiner to repeat or clarify it.</p>
          </div>
        </div>
      </Card>

      <Card className="mb-8 p-6">
        <h2 className="text-2xl font-semibold mb-4">Assessment Criteria</h2>
        <div className="space-y-4 text-slate-700">
          <div className="border-l-4 border-blue-500 pl-4 py-2 mb-4">
            <h3 className="font-semibold mb-1">Fluency and Coherence</h3>
            <p className="text-sm">How well you can speak at a good speed without too many hesitations, and how well you connect your ideas.</p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4 py-2 mb-4">
            <h3 className="font-semibold mb-1">Lexical Resource</h3>
            <p className="text-sm">The range of vocabulary you use and how accurately and appropriately you use it.</p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4 py-2 mb-4">
            <h3 className="font-semibold mb-1">Grammatical Range and Accuracy</h3>
            <p className="text-sm">The range of grammar you use and how accurately you use it.</p>
          </div>
          
          <div className="border-l-4 border-amber-500 pl-4 py-2">
            <h3 className="font-semibold mb-1">Pronunciation</h3>
            <p className="text-sm">How clear your speech is and how well you use intonation, stress, and individual sounds.</p>
          </div>
        </div>
      </Card>

      <div className="text-center mb-12">
        <Button
          size="lg"
          onClick={handleStartTest}
          disabled={loading}
          className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 text-lg nav-button"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Loading Test...
            </>
          ) : (
            "Start Now"
          )}
        </Button>
        <p className="mt-4 text-slate-500 text-sm">
          Click the button above to begin the IELTS Speaking test.
        </p>
      </div>
    </div>
  );
};

export default SpeakingInstructions;