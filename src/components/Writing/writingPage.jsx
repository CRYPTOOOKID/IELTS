import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './writingPage.css';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { generateIeltsPrompt } from './ieltsPrompt';
import FeedbackSummary from './FeedbackSummary';

const WritingPage = ({ onBackToStart }) => {
  const [currentTask, setCurrentTask] = useState('task1');
  const [task1Response, setTask1Response] = useState('');
  const [task2Response, setTask2Response] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [showWordCountWarning, setShowWordCountWarning] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [expandedCategories, setExpandedCategories] = useState({
    taskAchievement: false,
    coherenceCohesion: false,
    lexicalResource: false,
    grammaticalRange: false
  });
  const [loadingTips, setLoadingTips] = useState([
    "Taking a deep breath before writing can help improve your focus.",
    "Try to use a variety of linking words to improve your coherence score.",
    "IELTS examiners look for a range of grammatical structures.",
    "Writing a clear topic sentence for each paragraph can boost your score.",
    "Remember to support your arguments with specific examples."
  ]);
  const [currentTip, setCurrentTip] = useState(0);

  // Feedback will be fetched from the API response

  // Loading stages
  const loadingStages = [
    { number: 1, name: "Analyzing Your Responses" },
    { number: 2, name: "Evaluating Task Achievement" },
    { number: 3, name: "Assessing Language Use" },
    { number: 4, name: "Calculating Scores" },
    { number: 5, name: "Finalizing Feedback" }
  ];

  // Writing task prompts
  const writingQuestions = [
    {
      type: "task1",
      text: "The graph below shows the population changes in a certain country from 1950 to 2050. Summarize the information by selecting and reporting the main features, and make comparisons where relevant."
    },
    {
      type: "task2",
      text: "Some people believe that universities should focus on providing academic skills rather than preparing students for employment. To what extent do you agree or disagree?"
    }
  ];

  // Update word count whenever response changes
  useEffect(() => {
    const currentResponse = currentTask === 'task1' ? task1Response : task2Response;
    const words = currentResponse.trim() ? currentResponse.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [task1Response, task2Response, currentTask]);

  // Rotate through loading tips
  useEffect(() => {
    if (isLoading) {
      const tipInterval = setInterval(() => {
        setCurrentTip(prevTip => (prevTip + 1) % loadingTips.length);
      }, 7500);
      
      return () => clearInterval(tipInterval);
    }
  }, [isLoading, loadingTips.length]);

  // Progress through loading stages and update loading progress
  useEffect(() => {
    if (isLoading) {
      // Reset progress when loading starts
      setLoadingProgress(0);
      
      // Stage duration in milliseconds (7 seconds per stage)
      const stageDuration = 7000;
      const totalDuration = stageDuration * loadingStages.length;
      
      // Update progress every 50ms
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + (100 / (totalDuration / 50));
        });
      }, 50);
      
      // Progress through stages
      const stageInterval = setInterval(() => {
        setCurrentStage(prevStage => {
          // If we're at the last stage, stay there until loading completes
          if (prevStage === loadingStages.length - 1) {
            clearInterval(stageInterval);
            return prevStage;
          }
          return prevStage + 1;
        });
      }, stageDuration); // Each stage takes 4 seconds
      
      return () => {
        clearInterval(progressInterval);
        clearInterval(stageInterval);
      };
    } else {
      setCurrentStage(0);
      setLoadingProgress(0);
    }
  }, [isLoading, loadingStages.length]);

  const handleResponseChange = (e) => {
    if (currentTask === 'task1') {
      setTask1Response(e.target.value);
    } else {
      setTask2Response(e.target.value);
    }
  };

  const toggleCategoryExpansion = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Check word count and show warning if needed
  const checkWordCount = () => {
    const minWords = currentTask === 'task1' ? 150 : 250;
    const currentResponse = currentTask === 'task1' ? task1Response : task2Response;
    const words = currentResponse.trim() ? currentResponse.trim().split(/\s+/).length : 0;
    
    // For demo purposes, allow with fewer words but show custom warning
    if (words < minWords && words > 20) {
      setShowWordCountWarning(true);
      return false;
    } else if (words <= 20) {
      alert("Please write at least 20 words to continue.");
      return false;
    }
    
    return true;
  };

  // Handle task submission
  const handleTaskSubmit = () => {
    if (!checkWordCount()) return;
    
    if (currentTask === 'task1') {
      // Move to Task 2
      setCurrentTask('task2');
    } else {
      // Both tasks completed, generate feedback
      generateCombinedFeedback();
    }
  };

  // Make the API request to DeepSeek for both tasks
  const generateCombinedFeedback = async () => {
    setIsLoading(true);
    setCurrentStage(0);
    setLoadingProgress(0);

    try {
      // Generate the combined prompt using the imported function
      const combinedPrompt = generateIeltsPrompt(
        writingQuestions[0].text,
        task1Response,
        writingQuestions[1].text,
        task2Response
      );

      // Make the API request to DeepSeek
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-5bf2c81a2b514029badda49b337fd017'
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "You are an IELTS writing evaluator." },
            { role: "user", content: combinedPrompt }
          ],
          temperature: 0.7,
          max_tokens: 3000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;
      
      // Extract JSON from the response
      const jsonMatch = assistantMessage.match(/```json\n([\s\S]*?)\n```/);
      let parsedFeedback;
      
      if (jsonMatch && jsonMatch[1]) {
        try {
          parsedFeedback = JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error("Failed to parse JSON from API response:", e);
          throw new Error("Failed to parse AI feedback");
        }
      } else {
        throw new Error("Failed to extract JSON from API response");
      }
      
      // Transform the API response to match our feedback format
      const transformedFeedback = {
        task1: {
          overallScore: parseFloat(parsedFeedback.task1.overall_score),
          categories: {
            taskAchievement: {
              score: parseFloat(parsedFeedback.task1.criterion_scores.task_achievement_response.score),
              percentage: parseFloat(parsedFeedback.task1.criterion_scores.task_achievement_response.score) * 10,
              comments: parsedFeedback.task1.criterion_scores.task_achievement_response.feedback_points || []
            },
            coherenceCohesion: {
              score: parseFloat(parsedFeedback.task1.criterion_scores.coherence_cohesion.score),
              percentage: parseFloat(parsedFeedback.task1.criterion_scores.coherence_cohesion.score) * 10,
              comments: parsedFeedback.task1.criterion_scores.coherence_cohesion.feedback_points || []
            },
            lexicalResource: {
              score: parseFloat(parsedFeedback.task1.criterion_scores.lexical_resource.score),
              percentage: parseFloat(parsedFeedback.task1.criterion_scores.lexical_resource.score) * 10,
              comments: parsedFeedback.task1.criterion_scores.lexical_resource.feedback_points || []
            },
            grammaticalRange: {
              score: parseFloat(parsedFeedback.task1.criterion_scores.grammatical_range_accuracy.score),
              percentage: parseFloat(parsedFeedback.task1.criterion_scores.grammatical_range_accuracy.score) * 10,
              comments: parsedFeedback.task1.criterion_scores.grammatical_range_accuracy.feedback_points || []
            }
          },
          strengths: parsedFeedback.task1.strengths || [],
          improvements: parsedFeedback.task1.improvements || []
        },
        task2: {
          overallScore: parseFloat(parsedFeedback.task2.overall_score),
          categories: {
            taskAchievement: {
              score: parseFloat(parsedFeedback.task2.criterion_scores.task_achievement_response.score),
              percentage: parseFloat(parsedFeedback.task2.criterion_scores.task_achievement_response.score) * 10,
              comments: parsedFeedback.task2.criterion_scores.task_achievement_response.feedback_points || []
            },
            coherenceCohesion: {
              score: parseFloat(parsedFeedback.task2.criterion_scores.coherence_cohesion.score),
              percentage: parseFloat(parsedFeedback.task2.criterion_scores.coherence_cohesion.score) * 10,
              comments: parsedFeedback.task2.criterion_scores.coherence_cohesion.feedback_points || []
            },
            lexicalResource: {
              score: parseFloat(parsedFeedback.task2.criterion_scores.lexical_resource.score),
              percentage: parseFloat(parsedFeedback.task2.criterion_scores.lexical_resource.score) * 10,
              comments: parsedFeedback.task2.criterion_scores.lexical_resource.feedback_points || []
            },
            grammaticalRange: {
              score: parseFloat(parsedFeedback.task2.criterion_scores.grammatical_range_accuracy.score),
              percentage: parseFloat(parsedFeedback.task2.criterion_scores.grammatical_range_accuracy.score) * 10,
              comments: parsedFeedback.task2.criterion_scores.grammatical_range_accuracy.feedback_points || []
            }
          },
          strengths: parsedFeedback.task2.strengths || [],
          improvements: parsedFeedback.task2.improvements || []
        },
        finalScore: parseFloat(parsedFeedback.final_score),
        overallFeedback: parsedFeedback.overall_feedback || "Thank you for your submission. Please review the detailed feedback for areas of strength and improvement."
      };

      setFeedback(transformedFeedback);
      setIsLoading(false);
      setShowFeedback(true);
    } catch (error) {
      console.error("Error generating AI feedback:", error);
      alert("Failed to generate AI feedback. Please try again later.");
      setIsLoading(false);
      
      // Fallback to simulated feedback if API fails
      const fallbackFeedback = {
        task1: {
          overallScore: 6.5,
          categories: {
            taskAchievement: {
              score: 7,
              percentage: 70,
              comments: [
                "You've addressed all parts of the task prompt",
                "Your main ideas are relevant and well-developed",
                "You've provided specific examples to support your arguments",
                "Your response is the appropriate length for the task"
              ]
            },
            coherenceCohesion: {
              score: 6,
              percentage: 60,
              comments: [
                "Your paragraphing is logical and appropriate",
                "You use a range of cohesive devices effectively",
                "Ideas flow naturally from one to the next",
                "Your introduction and conclusion are well-structured"
              ]
            },
            lexicalResource: {
              score: 6,
              percentage: 60,
              comments: [
                "You demonstrate a good vocabulary range appropriate to the topic",
                "You use some less common vocabulary items",
                "Word forms and collocations are generally accurate",
                "You effectively paraphrase to avoid repetition"
              ]
            },
            grammaticalRange: {
              score: 7,
              percentage: 70,
              comments: [
                "You use a mix of simple and complex sentence structures",
                "Your grammar is generally accurate with only minor errors",
                "Punctuation is used correctly throughout",
                "You demonstrate control of complex grammatical forms"
              ]
            }
          },
          strengths: [
            "Clear overall structure with introduction, body paragraphs, and conclusion",
            "Good use of linking words to connect ideas",
            "Relevant examples to support main points"
          ],
          improvements: [
            "More varied vocabulary would enhance the response",
            "Some grammatical errors in complex sentences",
            "More detailed analysis of the data would improve the response"
          ]
        },
        task2: {
          overallScore: 7.0,
          categories: {
            taskAchievement: {
              score: 7,
              percentage: 70,
              comments: [
                "You've addressed all parts of the task prompt",
                "Your main ideas are relevant and well-developed",
                "Your position is clear and consistent throughout",
                "You've provided specific examples to support your arguments"
              ]
            },
            coherenceCohesion: {
              score: 7,
              percentage: 70,
              comments: [
                "Your paragraphing is logical and appropriate",
                "You use a range of cohesive devices effectively",
                "Ideas flow naturally from one to the next",
                "Your introduction and conclusion are well-structured"
              ]
            },
            lexicalResource: {
              score: 7,
              percentage: 70,
              comments: [
                "You demonstrate a wide vocabulary range appropriate to the topic",
                "You use less common vocabulary items with precision",
                "Word forms and collocations are generally accurate",
                "You effectively paraphrase to avoid repetition"
              ]
            },
            grammaticalRange: {
              score: 7,
              percentage: 70,
              comments: [
                "You use a mix of simple and complex sentence structures",
                "Your grammar is generally accurate with only minor errors",
                "Punctuation is used correctly throughout",
                "You demonstrate control of complex grammatical forms"
              ]
            }
          },
          strengths: [
            "Clear overall structure with introduction, body paragraphs, and conclusion",
            "Good use of linking words to connect ideas",
            "Relevant examples to support main points"
          ],
          improvements: [
            "More varied vocabulary would enhance the response",
            "Some grammatical errors in complex sentences",
            "Introduction could more clearly state your position",
            "Conclusion could more effectively summarize your arguments"
          ]
        },
        finalScore: 6.8,
        overallFeedback: "API connection failed. This is simulated feedback. Your writing demonstrates understanding of the IELTS writing task requirements. To improve, focus on vocabulary precision and grammar in complex sentences."
      };
      
      setFeedback(fallbackFeedback);
      setIsLoading(false);
      setShowFeedback(true);
    }
  };

  const handleBack = () => {
    if (showFeedback) {
      setShowFeedback(false);
      setCurrentTask('task1');
      setTask1Response('');
      setTask2Response('');
    } else if (currentTask === 'task2') {
      setCurrentTask('task1');
    } else {
      onBackToStart();
    }
  };

  const renderWordCountWarningModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
        <h3 className="text-xl font-bold text-primary-deep mb-4">Word Count Notice</h3>
        <p className="text-dark mb-6">
          Your response has only <span className="font-bold">{wordCount}</span> words. The recommended minimum is <span className="font-bold">{currentTask === 'task1' ? 150 : 250}</span> words. 
          <br /><br />
          Would you like to continue or go back to add more content?
        </p>
        <div className="flex justify-end space-x-4">
          <Button 
            onClick={() => setShowWordCountWarning(false)} 
            className="back-button"
          >
            Continue Writing
          </Button>
          <Button 
            onClick={() => {
              setShowWordCountWarning(false);
              if (currentTask === 'task1') {
                setCurrentTask('task2');
              } else {
                generateCombinedFeedback();
              }
            }} 
            className="submit-button"
          >
            {currentTask === 'task1' ? 'Continue to Task 2' : 'Get Feedback Anyway'}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderWritingTask = () => (
    <div className="writing-container">
      <div className="mb-8">
        <Button onClick={handleBack} className="back-button mb-4">Back</Button>
        <h2 className="text-2xl font-bold mb-4 text-primary-deep">
          {currentTask === 'task1' ? 'Writing Task 1' : 'Writing Task 2'}
        </h2>
        <div className="prompt-container">
          <p className="text-lg text-dark font-medium">
            {currentTask === 'task1' ? writingQuestions[0].text : writingQuestions[1].text}
          </p>
          {currentTask === 'task1' && (
            <div className="graph-placeholder">
              [Placeholder for graph image]
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="response" className="block font-medium text-dark">
              Your Response:
            </label>
            <div className={`word-count ${
              wordCount < (currentTask === 'task1' ? 150 : 250)
                ? 'warning'
                : 'success'
            }`}>
              Word Count: {wordCount} 
              {wordCount < (currentTask === 'task1' ? 150 : 250) && 
                ` (Minimum: ${currentTask === 'task1' ? 150 : 250})`}
            </div>
          </div>
          <textarea
            id="response"
            className="response-textarea"
            value={currentTask === 'task1' ? task1Response : task2Response}
            onChange={handleResponseChange}
            placeholder="Write your response here..."
          />
        </div>
        
        <div className="text-right">
          <Button 
            onClick={handleTaskSubmit} 
            disabled={wordCount < 20 || isLoading}
            className="submit-button"
          >
            {isLoading ? 'Generating AI Feedback...' : 
              currentTask === 'task1' ? 'Continue to Task 2' : 'Submit for AI Feedback'}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="loading-container">
      <h3 className="loading-title">Analyzing Your IELTS Writing Responses...</h3>
      
      <div className="loading-stages">
        {loadingStages.map((stage, index) => (
          <div key={index} className="loading-stage">
            <div
              className={`stage-circle ${
                index < currentStage ? 'completed' :
                index === currentStage ? 'active' : ''
              }`}
            >
              <span className="stage-number">
                {index < currentStage ? '✓' : stage.number}
              </span>
            </div>
            <span className="stage-name">{stage.name}</span>
          </div>
        ))}
      </div>
      
      <div className="loading-progress">
        <div
          className="progress-fill"
          style={{ width: `${loadingProgress}%` }}
        ></div>
      </div>
      
      <div className="loading-tip">
        <span><strong>IELTS Tip:</strong> {loadingTips[currentTip]}</span>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {showWordCountWarning && renderWordCountWarningModal()}
      
      {isLoading
        ? renderLoading()
        : showFeedback
          ? <FeedbackSummary
              feedback={feedback}
              onBack={() => {
                setShowFeedback(false);
                setCurrentTask('task1');
                setTask1Response('');
                setTask2Response('');
              }}
            />
          : renderWritingTask()
      }
    </div>
  );
};

export default WritingPage;