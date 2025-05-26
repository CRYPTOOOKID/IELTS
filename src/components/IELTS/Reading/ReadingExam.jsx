import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import IeltsReadingTest from './IeltsReadingTest.tsx';

// Sample test data - in a real app, this would come from an API
const sampleTestData = {
  id: 'reading-test-1',
  title: 'IELTS Academic Reading Test',
  timeLimit: 3600, // 60 minutes in seconds
  sections: [
    {
      id: 'section-1',
      title: 'Reading Passage 1',
      passage: {
        title: 'The History of Chocolate',
        content: `Chocolate has a rich and fascinating history that spans over 3,000 years. The story begins with the ancient civilizations of Mesoamerica, where the cacao tree (Theobroma cacao) was first cultivated. The Olmecs, who lived in what is now Mexico around 1500 BCE, were likely the first to discover the potential of cacao beans.

The Maya civilization further developed the use of cacao, creating a bitter drink called "xocolatl" which was reserved for royalty and religious ceremonies. They believed that cacao was a gift from the gods and used cacao beans as currency. The Aztecs later adopted this practice, and when Spanish conquistador Hernán Cortés arrived in Mexico in 1519, he was introduced to this exotic beverage.

Cortés brought cacao beans back to Spain, where sugar was added to make the drink more palatable to European tastes. For nearly a century, Spain kept chocolate a closely guarded secret, but eventually, the knowledge spread throughout Europe. By the 17th century, chocolate houses had become popular gathering places in London, similar to coffee houses.

The Industrial Revolution brought significant changes to chocolate production. In 1828, Dutch chemist Coenraad van Houten invented a process to remove fat from cacao beans, creating cocoa powder. This innovation made chocolate more affordable and accessible to the general public. Later, in 1875, Swiss chocolatier Daniel Peter created the first milk chocolate by adding condensed milk to chocolate.

Today, chocolate is enjoyed worldwide in countless forms, from simple candy bars to elaborate desserts. The global chocolate industry is worth billions of dollars, and cacao is grown in tropical regions around the world, providing livelihoods for millions of farmers.`,
        paragraphs: ['A', 'B', 'C', 'D', 'E']
      },
      questions: [
        {
          id: 'q1',
          questionNumber: 1,
          type: 'multiple-choice',
          questionText: 'According to the passage, who were likely the first to discover the potential of cacao beans?',
          options: [
            'The Maya',
            'The Aztecs', 
            'The Olmecs',
            'The Spanish'
          ],
          correctAnswer: 'The Olmecs'
        },
        {
          id: 'q2',
          questionNumber: 2,
          type: 'true-false-not-given',
          questionText: 'The Maya used cacao beans as a form of currency.',
          correctAnswer: 'True'
        },
        {
          id: 'q3',
          questionNumber: 3,
          type: 'sentence-completion',
          questionText: 'Spanish conquistador _______ was introduced to the chocolate drink in 1519.',
          correctAnswer: 'Hernán Cortés',
          maxWords: 2
        },
        {
          id: 'q4',
          questionNumber: 4,
          type: 'matching-headings',
          questionText: 'Choose the most suitable heading for paragraph C.',
          options: [
            'The spread of chocolate in Europe',
            'Ancient chocolate ceremonies',
            'Modern chocolate production',
            'The invention of milk chocolate'
          ],
          correctAnswer: 'The spread of chocolate in Europe'
        },
        {
          id: 'q5',
          questionNumber: 5,
          type: 'paragraph-matching',
          questionText: 'Which paragraph mentions the invention of a process to remove fat from cacao beans?',
          correctAnswer: 'D'
        }
      ]
    }
  ]
};

const ReadingExam = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get test data from navigation state or use sample data as fallback
  const testData = location.state?.testData || sampleTestData;

  console.log('ReadingExam: Using test data:', testData);

  const handleTestSubmit = (answers) => {
    // The IeltsReadingTest component now handles navigation to feedback page
    console.log('Test submitted with answers:', answers);
  };

  const handleBackToHome = () => {
    navigate('/ielts/reading');
  };

  // Show loading state if no test data is available
  if (!testData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <IeltsReadingTest 
        testData={testData}
        onSubmit={handleTestSubmit}
        onExit={handleBackToHome}
      />
    </div>
  );
};

export default ReadingExam; 