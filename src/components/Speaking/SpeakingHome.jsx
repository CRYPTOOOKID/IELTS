import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const SpeakingHome = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">IELTS Speaking Practice</h2>
      <p className="text-lg text-slate-600 mb-8">
        Improve your speaking skills for the IELTS test with practice sessions and feedback.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">About IELTS Speaking</h3>
            <p className="text-slate-600 mb-4">
              The IELTS Speaking test consists of a face-to-face interview with an examiner, lasting 11-14 minutes.
            </p>
            <ul className="list-disc pl-5 text-slate-600 space-y-2">
              <li>Part 1: Introduction and interview (4-5 minutes)</li>
              <li>Part 2: Individual long turn (3-4 minutes)</li>
              <li>Part 3: Two-way discussion (4-5 minutes)</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">Speaking Tips</h3>
            <ul className="list-disc pl-5 text-slate-600 space-y-2">
              <li>Speak clearly and at a natural pace</li>
              <li>Use a range of vocabulary and grammatical structures</li>
              <li>Develop your answers with examples and explanations</li>
              <li>Don't memorize prepared answers</li>
              <li>It's okay to ask for clarification if needed</li>
              <li>Express your opinions confidently</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center">
        <p className="text-slate-600 mb-6">
          This feature is coming soon. Speaking practice will be available in future updates.
        </p>
        <Link to="/">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SpeakingHome;