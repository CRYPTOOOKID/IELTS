import React from 'react';
import { useReadingContext } from './ReadingContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import './reading.css';

const ReadingInstructions = () => {
  const { startTest, fetchTestData, setLoading } = useReadingContext();
  
  const handleStartTest = async () => {
    try {
      // Show loading state
      setLoading(true);
      
      // Fetch test data
      await fetchTestData("IELTS_TEST_001");
      
      // Start the test - this is now handled in fetchTestData
      // but we'll call it here as well to ensure it works
      startTest();
    } catch (error) {
      console.error("Error starting test:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">IELTS Reading Test</h1>
      
      <Card className="mb-8 p-6">
        <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
        <div className="space-y-4 text-slate-700">
          <p>
            The IELTS Reading test consists of 3 sections with a total of 40 questions. You have 60 minutes to complete the test.
          </p>
          <p>
            Each section contains one long text. Texts are taken from books, journals, magazines, and newspapers. They are written for a non-specialist audience and are on academic topics of general interest.
          </p>
          <p>
            You will need to answer a variety of questions that test your reading skills, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Multiple choice</li>
            <li>True/False/Not Given</li>
            <li>Matching headings</li>
            <li>Matching information</li>
            <li>Matching features</li>
            <li>Sentence completion</li>
            <li>Summary completion</li>
          </ul>
        </div>
      </Card>

      <Card className="mb-8 p-6">
        <h2 className="text-2xl font-semibold mb-4">Tips for Success</h2>
        <div className="space-y-4 text-slate-700">
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Time Management</h3>
            <p>Spend about 20 minutes on each section. If you can't answer a question, move on and come back to it later.</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-md mb-4">
            <h3 className="font-semibold text-green-800 mb-2">Skimming and Scanning</h3>
            <p>Quickly skim the text first to get a general idea of the content. Then scan for specific information when answering questions.</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-md mb-4">
            <h3 className="font-semibold text-purple-800 mb-2">Read the Instructions Carefully</h3>
            <p>Pay attention to word limits and specific instructions for each question type.</p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-md">
            <h3 className="font-semibold text-amber-800 mb-2">Answer All Questions</h3>
            <p>There is no penalty for wrong answers, so make sure to answer every question even if you have to guess.</p>
          </div>
        </div>
      </Card>

      <Card className="mb-8 p-6">
        <h2 className="text-2xl font-semibold mb-4">Question Types Explained</h2>
        <div className="space-y-4 text-slate-700">
          <div className="border-l-4 border-blue-500 pl-4 py-2 mb-4">
            <h3 className="font-semibold mb-1">True/False/Not Given</h3>
            <p className="text-sm">Determine if statements agree with (TRUE), contradict (FALSE), or have no information about (NOT GIVEN) in the text.</p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4 py-2 mb-4">
            <h3 className="font-semibold mb-1">Matching Headings</h3>
            <p className="text-sm">Match headings to paragraphs based on the main idea of each paragraph.</p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4 py-2 mb-4">
            <h3 className="font-semibold mb-1">Multiple Choice</h3>
            <p className="text-sm">Select the correct answer from several options based on information in the text.</p>
          </div>
          
          <div className="border-l-4 border-amber-500 pl-4 py-2 mb-4">
            <h3 className="font-semibold mb-1">Sentence Completion</h3>
            <p className="text-sm">Complete sentences with words from the text, following word limits (e.g., NO MORE THAN THREE WORDS).</p>
          </div>
          
          <div className="border-l-4 border-red-500 pl-4 py-2">
            <h3 className="font-semibold mb-1">Paragraph Matching</h3>
            <p className="text-sm">Match statements or questions to specific paragraphs in the text.</p>
          </div>
        </div>
      </Card>

      <div className="text-center mb-12">
        <Button 
          size="lg" 
          onClick={handleStartTest}
          className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 text-lg"
        >
          Start Now
        </Button>
        <p className="mt-4 text-slate-500 text-sm">
          You will have 60 minutes to complete the test once you begin.
        </p>
      </div>
    </div>
  );
};

export default ReadingInstructions;