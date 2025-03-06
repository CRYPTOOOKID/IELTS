import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const ReadingHome = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">IELTS Reading Practice</h2>
      <p className="text-lg text-slate-600 mb-8">
        Improve your reading skills for the IELTS test with practice passages and questions.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">About IELTS Reading</h3>
            <p className="text-slate-600 mb-4">
              The IELTS Reading test consists of three passages of increasing difficulty, and you'll have 60 minutes to answer 40 questions.
            </p>
            <ul className="list-disc pl-5 text-slate-600 space-y-2">
              <li>Academic Reading: texts from books, journals, magazines, and newspapers</li>
              <li>General Training Reading: texts from notices, advertisements, official documents, booklets, newspapers, and instruction manuals</li>
              <li>Questions may include multiple choice, matching information, sentence completion, summary completion, and more</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">Reading Tips</h3>
            <ul className="list-disc pl-5 text-slate-600 space-y-2">
              <li>Skim the passage first to get a general idea of the content</li>
              <li>Read the questions carefully before reading the passage in detail</li>
              <li>Pay attention to key words in the questions</li>
              <li>Don't spend too much time on one question</li>
              <li>Watch out for similar words that might have different meanings</li>
              <li>Check your spelling and grammar in your answers</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center">
        <p className="text-slate-600 mb-6">
          This feature is coming soon. Reading practice tests will be available in future updates.
        </p>
        <Link to="/">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ReadingHome;