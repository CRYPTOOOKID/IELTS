import React from 'react';

// Results View Component for displaying exam scores and feedback
const ReadingResults = ({
  testData,
  finalScore,
  resultsFeedback,
  onReset,
  onExit
}) => {
  // Calculate total possible score
  const calculateTotalPossibleScore = () => {
    if (!testData || !testData.sections) return 0;

    let totalQuestions = 0;
    testData.sections.forEach(section => {
      if (!section || !Array.isArray(section.texts)) return;

      section.texts.forEach(textBlock => {
        if (!textBlock || !textBlock.questionType || !Array.isArray(textBlock.questions)) return;

        const { questionType, questions } = textBlock;
        switch (questionType) {
          case 'MATCHING_HEADINGS':
            totalQuestions += questions.filter(q => q?.type === 'paragraph').length;
            break;
          case 'PARAGRAPH_MATCHING':
            totalQuestions += questions.filter(q => q?.type === 'statement').length;
            break;
          default:
            totalQuestions += questions.length;
            break;
        }
      });
    });

    return totalQuestions;
  };

  // Calculate estimated IELTS band score based on correct answers
  const calculateBandScore = (score, totalQuestions) => {
    if (totalQuestions === 0) return 0;

    // Calculate percentage
    const percentage = (score / totalQuestions) * 100;

    // Approximate IELTS band score conversion
    if (percentage >= 90) return 9.0;
    if (percentage >= 85) return 8.5;
    if (percentage >= 80) return 8.0;
    if (percentage >= 75) return 7.5;
    if (percentage >= 70) return 7.0;
    if (percentage >= 65) return 6.5;
    if (percentage >= 60) return 6.0;
    if (percentage >= 55) return 5.5;
    if (percentage >= 50) return 5.0;
    if (percentage >= 40) return 4.5;
    if (percentage >= 30) return 4.0;
    if (percentage >= 20) return 3.5;
    if (percentage >= 10) return 3.0;
    return 2.5;
  };

  const totalPossibleScore = calculateTotalPossibleScore();
  const estimatedBandScore = calculateBandScore(finalScore, totalPossibleScore);

  return (
    <div className="results-view">
      <div className="results-header">
        <h2 className="text-2xl font-bold text-center mb-6">Reading Test Results</h2>
      </div>

      <div className="score-display bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-center mb-4">Your Score</h3>
        <div className="text-4xl font-bold text-center text-blue-600">
          {finalScore} <span className="text-gray-500">/ {totalPossibleScore}</span>
        </div>
        <div className="text-center mt-2 text-gray-600">
          {Math.round((finalScore / totalPossibleScore) * 100)}% correct
        </div>
        <div className="text-center mt-2 text-gray-600">
          <p>Total questions in this test: {totalPossibleScore}</p>
        </div>
        <div className="text-center mt-4 text-xl font-semibold text-blue-700">
          Estimated IELTS Band Score: {estimatedBandScore.toFixed(1)}
        </div>
      </div>

      {resultsFeedback && resultsFeedback.length > 0 && (
        <div className="detailed-feedback bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Detailed Feedback</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Question</th>
                  <th className="border p-2 text-left">Your Answer</th>
                  <th className="border p-2 text-left">Correct Answer</th>
                  <th className="border p-2 text-left">Result</th>
                </tr>
              </thead>
              <tbody>
                {resultsFeedback.map((result, index) => (
                  <tr key={index} className={result.isCorrect ? "bg-green-50" : "bg-red-50"}>
                    <td className="border p-2">{result.questionNumber}</td>
                    <td className="border p-2">{result.userAnswer || <em className="text-gray-400">No answer</em>}</td>
                    <td className="border p-2">{result.correctAnswer}</td>
                    <td className="border p-2">
                      {result.isCorrect ? (
                        <span className="text-green-600 font-medium">Correct</span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          {result.limitExceeded ? "Word limit exceeded" : "Incorrect"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="navigation-buttons text-center mt-6">
        <button
          onClick={onReset}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mr-4"
        >
          Try Again
        </button>
        <button
          onClick={onExit}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
        >
          Exit to Home
        </button>
      </div>
    </div>
  );
};

export default ReadingResults;