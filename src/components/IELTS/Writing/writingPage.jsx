import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './writingPage.css';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { generateIeltsPrompt } from './ieltsPrompt';
import FeedbackSummary from './FeedbackSummary';
import { useTimer } from '../../../lib/TimerContext';
import TimeUpModal from "../../ui/TimeUpModal";
import ExamContainer from "../../ui/ExamContainer";

const WritingPage = ({ onBackToStart, testType }) => {
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
  const [writingQuestions, setWritingQuestions] = useState([]);
  const [fetchingQuestions, setFetchingQuestions] = useState(true);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdownNumber, setCountdownNumber] = useState(3);

  // Get timer context
  const { startTimer, resetTimer, timeRemaining } = useTimer();

  // Loading stages
  const loadingStages = [
    { number: 1, name: "Analyzing Your Responses" },
    { number: 2, name: "Evaluating Task Achievement" },
    { number: 3, name: "Assessing Language Use" },
    { number: 4, name: "Calculating Scores" },
    { number: 5, name: "Finalizing Feedback" }
  ];

  // Generate random test number and construct API endpoint
  const generateTestEndpoint = () => {
    // Generate random test number between 1 and 20
    const randomTestNumber = Math.floor(Math.random() * 20) + 1;
    
    // Determine test type based on prop or fallback to general training
    let testTypeCode;
    if (testType === 'academic') {
      testTypeCode = 'ILTS.WRTNG.ACAD';
    } else if (testType === 'general-training') {
      testTypeCode = 'ILTS.WRTNG.GT';
    } else {
      // Fallback for legacy routes - default to general training
      testTypeCode = 'ILTS.WRTNG.GT';
    }
    
    const testId = `${testTypeCode}.T${randomTestNumber}`;
    const apiUrl = `https://yeo707lcq4.execute-api.us-east-1.amazonaws.com/writingtest/${testId}`;
    
    console.log(`Generated test endpoint: ${apiUrl} for test type: ${testType || 'legacy'}`);
    return { apiUrl, testId, testNumber: randomTestNumber };
  };

  // Fetch writing questions from API on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setFetchingQuestions(true);
        console.log("Fetching writing test data...");
        
        const { apiUrl, testId } = generateTestEndpoint();
        
        console.log(`Fetching writing test data from: ${apiUrl}`);
        
        const response = await fetch(apiUrl, { 
          method: 'GET', 
          headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
          let errorPayload = null; 
          try { errorPayload = await response.json(); } catch (e) {}
          const errorMsg = errorPayload?.message || errorPayload?.error || `Request failed with status: ${response.status}`;
          throw new Error(errorMsg);
        }
        
        const data = await response.json();
        console.log("Successfully fetched writing test data:", data);
        console.log("Tasks in response:", data.tasks);
        console.log("Test type:", testType);
        console.log("Root level imageUrl:", data.imageUrl);
        
        // Log the complete structure for debugging
        if (data.tasks && data.tasks.length > 0) {
          console.log("First task structure:", JSON.stringify(data.tasks[0], null, 2));
          if (data.tasks.length > 1) {
            console.log("Second task structure:", JSON.stringify(data.tasks[1], null, 2));
          }
        }
        
        // Transform API response to match our expected question format
        const transformedQuestions = data.tasks.map(task => {
          console.log("Processing task:", task);
          // For task 1
          if (task.taskNumber === 1) {
            const questionData = {
              type: 'task1',
              taskType: task.taskType,
              text: task.prompt, // Use prompt from task
              testId: testId
            };
            
            // Add specific fields based on test type
            if (testType === 'academic') {
              // Academic tests may have imageUrl for visual description tasks
              console.log("Processing academic task 1, checking for images...");
              console.log("Root imageUrl:", data.imageUrl);
              console.log("Task imageContent:", task.imageContent);
              console.log("Task typeImage:", task.typeImage);
              
              // Check for image in multiple locations:
              // 1. Root level imageUrl
              // 2. Task level imageContent
              // 3. Task level typeImage
              // 4. Task level imageUrl (fallback)
              const imageUrl = data.imageUrl || task.imageContent || task.typeImage || task.imageUrl;
              
              if (imageUrl && imageUrl.trim() !== '') {
                questionData.imageUrl = imageUrl;
                questionData.hasImage = true;
                console.log("Academic test with image detected:", imageUrl);
              } else {
                console.log("Academic test without image - no valid imageUrl found");
                console.log("Checked: data.imageUrl =", data.imageUrl);
                console.log("Checked: task.imageContent =", task.imageContent);
                console.log("Checked: task.typeImage =", task.typeImage);
                questionData.hasImage = false;
              }
              questionData.instructions = task.instructions || "Summarize the information by selecting and reporting the main features, and make comparisons where relevant.";
              questionData.prompt = task.prompt; // Keep the original prompt
            } else {
              // General Training tests have letter writing with situation and bullet points
              questionData.situation = task.situation || task.prompt;
              questionData.instructions = task.instructions;
              questionData.bulletPoints = task.bulletPoints || [];
              questionData.hasImage = false;
            }
            
            console.log("Transformed task 1 data:", questionData);
            return questionData;
          } 
          // For task 2 (Essay writing - similar for both types)
          else if (task.taskNumber === 2) {
            return {
              type: 'task2',
              taskType: task.taskType,
              text: task.prompt,
              testId: testId
            };
          }
        }).filter(Boolean); // Remove any undefined entries
        
        setWritingQuestions(transformedQuestions);
      } catch (error) {
        console.error("Error fetching writing questions:", error);
        // Fallback to default questions if API fails
        const fallbackQuestions = testType === 'academic' ? [
          {
            type: "task1",
            text: "The graph below shows the population changes in a certain country from 1950 to 2050. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
            taskType: "Graph Description",
            hasImage: true,
            imageUrl: "https://via.placeholder.com/600x400/3b82f6/ffffff?text=Sample+Chart+for+Academic+Task+1",
            prompt: "The graph below shows the population changes in a certain country from 1950 to 2050. Summarize the information by selecting and reporting the main features, and make comparisons where relevant."
          },
          {
            type: "task2",
            text: "Some people believe that universities should focus on providing academic skills rather than preparing students for employment. To what extent do you agree or disagree?",
            taskType: "Opinion Essay"
          }
        ] : [
          {
            type: "task1",
            text: "You recently bought a piece of equipment for your kitchen but it did not work. You phoned the shop but no action was taken. Write a letter to the shop manager.",
            taskType: "Complaint Letter",
            situation: "You recently bought a piece of equipment for your kitchen but it did not work. You phoned the shop but no action was taken.",
            instructions: "Write a letter to the shop manager. In your letter:",
            bulletPoints: [
              "describe the problem with the equipment",
              "explain what happened when you phoned the shop",
              "say what you would like the manager to do"
            ]
          },
          {
            type: "task2",
            text: "Some people think that parents should teach children how to be good members of society. Others, however, believe that school is the place to learn this. Discuss both these views and give your own opinion.",
            taskType: "Discussion Essay"
          }
        ];
        
        setWritingQuestions(fallbackQuestions);
      } finally {
        setFetchingQuestions(false);
      }
    };
    
    fetchQuestions();
  }, [testType]); // Re-fetch when testType changes

  // Countdown animation effect
  useEffect(() => {
    if (showCountdown && !fetchingQuestions) {
      if (countdownNumber > 0) {
        const timer = setTimeout(() => {
          setCountdownNumber(countdownNumber - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // When countdown reaches 0, hide countdown and show the exam
        setShowCountdown(false);
      }
    }
  }, [countdownNumber, showCountdown, fetchingQuestions]);

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

  // Monitor time remaining and show modal when time is up
  useEffect(() => {
    if (timeRemaining === 0 && !showFeedback) {
      setShowTimeUpModal(true);
    }
    
    // Clean up function to reset timer when component unmounts
    return () => {
      if (showFeedback) {
        resetTimer();
      }
    };
  }, [timeRemaining, showFeedback, resetTimer]);
  
  // Handle time up event
  const handleTimeUp = () => {
    setShowTimeUpModal(false);
    generateCombinedFeedback();
  };

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
      // Find the questions from our array
      const task1Question = writingQuestions.find(q => q.type === 'task1');
      const task2Question = writingQuestions.find(q => q.type === 'task2');
      
      if (!task1Question || !task2Question) {
        throw new Error("Unable to retrieve task questions. Please refresh and try again.");
      }
      
      // Generate the combined prompt using the imported function
      const combinedPrompt = generateIeltsPrompt(
        task1Question ? (task1Question.situation || task1Question.text) : '',
        task1Response,
        task2Question ? task2Question.text : '',
        task2Response
      );
      
      console.log("Sending request to DeepSeek API for feedback generation...");

      // Make the API request to DeepSeek
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-44f37e518ea04bf893bfa6083a78c4fb'
        },
        body: JSON.stringify({
          model: "deepseek-reasoner",
          messages: [
            { role: "system", content: "You are an IELTS writing evaluator." },
            { role: "user", content: combinedPrompt }
          ],
          temperature: 0.7,
          max_tokens: 3000
        })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("DeepSeek API error response:", errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Unexpected response format from DeepSeek API:", data);
        throw new Error("Received invalid response format from the AI service.");
      }
      
      const assistantMessage = data.choices[0].message.content;
      console.log("Successfully received feedback from DeepSeek API");
      
      // Extract JSON from the response with improved error handling
      let parsedFeedback;
      try {
        // First attempt: Try to extract JSON from markdown code blocks (```json ... ```)
        const jsonMatch = assistantMessage.match(/```json\n([\s\S]*?)\n```/);
        
        if (jsonMatch && jsonMatch[1]) {
          const jsonText = jsonMatch[1];
          try {
            // Attempt to parse the extracted JSON
            parsedFeedback = JSON.parse(jsonText);
          } catch (jsonError) {
            console.error("Error parsing JSON extracted from markdown block, attempting to repair:", jsonError);
            
            // Attempt to fix common JSON formatting issues
            let sanitizedJson = jsonText
              // Fix unquoted property names
              .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
              // Fix single quotes used instead of double quotes
              .replace(/'/g, '"')
              // Fix trailing commas in arrays/objects
              .replace(/,(\s*[}\]])/g, '$1');
            
            try {
              parsedFeedback = JSON.parse(sanitizedJson);
              console.log("Successfully repaired and parsed JSON");
            } catch (repairError) {
              // If still fails, try a more aggressive approach
              console.error("Failed to repair JSON with first attempt, trying more aggressive repair:", repairError);
              
              // Extract what appears to be the JSON structure and try to rebuild it
              // This creates a minimal valid structure even if some data is lost
              const fallbackData = createFallbackFeedback(jsonText);
              parsedFeedback = fallbackData;
            }
          }
        } else {
          // Second attempt: Try to find JSON without code blocks (sometimes APIs return raw JSON)
          console.log("No JSON code block found, searching for raw JSON in response");
          
          // Try to extract anything that looks like JSON object
          const possibleJson = assistantMessage.match(/(\{[\s\S]*\})/);
          
          if (possibleJson && possibleJson[1]) {
            try {
              parsedFeedback = JSON.parse(possibleJson[1]);
            } catch (rawJsonError) {
              console.error("Failed to parse raw JSON from response:", rawJsonError);
              throw new Error("Failed to parse AI feedback: Invalid JSON structure");
            }
          } else {
            console.error("No valid JSON structure found in response");
            throw new Error("Failed to extract JSON from API response");
          }
        }
      } catch (e) {
        console.error("Failed to parse JSON from API response:", e);
        
        // Use fallback feedback as a last resort
        console.log("Using fallback feedback due to parsing error");
        parsedFeedback = generateFallbackFeedback();
      }
      
      // Function to create fallback feedback data when JSON parsing fails
      function createFallbackFeedback(partialJson) {
        console.log("Creating fallback feedback from partial data");
        try {
          // Extract score values if present
          const task1Score = parseFloat(partialJson.match(/"overall_score"\s*:\s*"?([0-9.]+)"?/)?.[1] || "6.5");
          const task2Score = parseFloat(partialJson.match(/"task2"[\s\S]*?"overall_score"\s*:\s*"?([0-9.]+)"?/)?.[1] || "7.0");
          const finalScore = (task1Score * 0.333 + task2Score * 0.667).toFixed(1);
          
          return {
            task1: {
              overallScore: task1Score,
              categories: {
                taskAchievement: { score: 6.5, percentage: 65, comments: ["Addresses the task appropriately"] },
                coherenceCohesion: { score: 6.5, percentage: 65, comments: ["Logical organization of information"] },
                lexicalResource: { score: 6.5, percentage: 65, comments: ["Uses adequate range of vocabulary"] },
                grammaticalRange: { score: 6.5, percentage: 65, comments: ["Uses a mix of simple and complex sentences"] }
              },
              strengths: ["Clear structure", "Appropriate response to the task"],
              improvements: ["Consider using more varied vocabulary", "Pay attention to complex grammatical structures"]
            },
            task2: {
              overallScore: task2Score,
              categories: {
                taskAchievement: { score: 7.0, percentage: 70, comments: ["Addresses all parts of the task"] },
                coherenceCohesion: { score: 7.0, percentage: 70, comments: ["Logical progression of ideas"] },
                lexicalResource: { score: 7.0, percentage: 70, comments: ["Uses a range of vocabulary with flexibility"] },
                grammaticalRange: { score: 7.0, percentage: 70, comments: ["Uses a variety of complex structures"] }
              },
              strengths: ["Well-developed response", "Clear position throughout"],
              improvements: ["Minor grammatical errors in complex sentences", "Further examples would strengthen arguments"]
            },
            finalScore: parseFloat(finalScore),
            overallFeedback: "This is a partially generated feedback due to processing issues. Your writing demonstrates good understanding of the IELTS tasks."
          };
        } catch (error) {
          console.error("Error creating fallback feedback from partial data:", error);
          return generateFallbackFeedback();
        }
      }
      
      // Function to generate basic fallback feedback when all else fails
      function generateFallbackFeedback() {
        return {
          task1: {
            overallScore: 6.5,
            categories: {
              taskAchievement: { score: 6.5, percentage: 65, comments: ["Addresses the task appropriately", "Covers the main features of the graph/chart", "Presents a clear overview"] },
              coherenceCohesion: { score: 6.5, percentage: 65, comments: ["Information is arranged coherently", "Uses cohesive devices effectively", "Paragraphing is logical"] },
              lexicalResource: { score: 6.5, percentage: 65, comments: ["Uses adequate range of vocabulary", "Makes some errors in word choice/formation", "Generally paraphrases successfully"] },
              grammaticalRange: { score: 6.5, percentage: 65, comments: ["Uses a mix of simple and complex sentences", "Makes some errors but meaning remains clear", "Shows good control of grammar and punctuation"] }
            },
            strengths: ["Clear structure", "Appropriate response to the task", "Effective use of language"],
            improvements: ["Consider using more varied vocabulary", "Pay attention to complex grammatical structures", "Provide more detailed analysis of data"]
          },
          task2: {
            overallScore: 7.0,
            categories: {
              taskAchievement: { score: 7.0, percentage: 70, comments: ["Addresses all parts of the task", "Presents a clear position throughout", "Fully developed response"] },
              coherenceCohesion: { score: 7.0, percentage: 70, comments: ["Logical progression of ideas", "Uses a range of cohesive devices", "Clear central topic in each paragraph"] },
              lexicalResource: { score: 7.0, percentage: 70, comments: ["Uses a range of vocabulary with flexibility", "Uses less common items with some awareness of style", "Makes occasional errors in word choice"] },
              grammaticalRange: { score: 7.0, percentage: 70, comments: ["Uses a variety of complex structures", "Majority of sentences are error-free", "Good control of grammar and punctuation"] }
            },
            strengths: ["Well-developed response", "Clear position throughout", "Good range of vocabulary"],
            improvements: ["Minor grammatical errors in complex sentences", "Further examples would strengthen arguments", "More precise word choice in some instances"]
          },
          finalScore: 6.8,
          overallFeedback: "This is generated feedback as we couldn't process your submission. Your writing demonstrates a good understanding of the IELTS writing task requirements. To improve your score, focus on vocabulary precision and grammar in complex sentences."
        };
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
      resetTimer();
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

  // Render the countdown animation
  const renderCountdown = () => {
    // Calculate positions for dots and sparkles
    const getRandomPosition = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    
    // Create array of dots for the rings
    const createDots = (count) => {
      const dots = [];
      const radius = 110; // Ring radius
      
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        dots.push({ x, y });
      }
      
      return dots;
    };
    
    // Create array of random sparkle positions
    const createSparkles = (count) => {
      const sparkles = [];
      
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const distance = getRandomPosition(60, 160);
        const x = distance * Math.cos(angle);
        const y = distance * Math.sin(angle);
        
        sparkles.push({ x, y });
      }
      
      return sparkles;
    };
    
    const dots = createDots(8);
    const sparkles = createSparkles(6);
    
    return (
      <div className="flex flex-col justify-center items-center h-[600px] text-center">
        {/* Main heading */}
        <h2 className="text-4xl font-bold text-primary-deep mb-12">
          <span className="breath-text">Take a deep breath</span>
        </h2>
        
        {/* Countdown animation container */}
        <div className="countdown-animation">
          {/* Rotating rings with dots */}
          <div className="countdown-ring countdown-ring-1">
            {dots.map((dot, index) => (
              <div 
                key={`dot1-${index}`}
                className="countdown-dot"
                style={{ 
                  left: `calc(50% + ${dot.x}px)`, 
                  top: `calc(50% + ${dot.y}px)`,
                  opacity: 0.8,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>
          
          <div className="countdown-ring countdown-ring-2">
            {dots.map((dot, index) => (
              <div 
                key={`dot2-${index}`}
                className="countdown-dot"
                style={{ 
                  left: `calc(50% + ${dot.x}px)`, 
                  top: `calc(50% + ${dot.y}px)`,
                  opacity: 0.5,
                  transform: 'translate(-50%, -50%) scale(0.7)'
                }}
              />
            ))}
          </div>
          
          {/* Random sparkles */}
          {sparkles.map((sparkle, index) => (
            <div
              key={`sparkle-${index}`}
              className="countdown-sparkle"
              style={{
                left: `calc(50% + ${sparkle.x}px)`,
                top: `calc(50% + ${sparkle.y}px)`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
          
          {/* Main countdown number */}
          <div className="countdown-number">
            {countdownNumber > 0 ? countdownNumber : (
              <div className="countdown-go">Go!</div>
            )}
          </div>
        </div>
        
        {/* Message that changes based on countdown state */}
        <div className="countdown-message" style={{ animationDelay: '0.3s' }}>
          {countdownNumber > 0 
            ? "Prepare your thoughts..."
            : "Your exam is ready!"
          }
        </div>
        
        {/* Show arrow icon when countdown finishes */}
        {countdownNumber === 0 && (
          <div className="mt-16" style={{ animation: 'fadeInUp 0.5s ease-out 0.7s both' }}>
            <svg className="w-14 h-14 mx-auto text-primary animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        )}
      </div>
    );
  };

  const renderWritingTask = () => {
    // Show countdown animation if in countdown mode
    if (showCountdown) {
      return renderCountdown();
    }
    
    // If still fetching questions, hide the spinner since we'll handle this with the countdown
    if (fetchingQuestions) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-deep"></div>
          <p className="ml-4 text-lg text-gray-700">Loading questions...</p>
        </div>
      );
    }

    // Find the current task
    const currentTaskData = writingQuestions.find(q => q.type === currentTask);
    
    if (!currentTaskData || writingQuestions.length === 0) {
      return (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-red-600 mb-4 text-center">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p className="text-lg text-gray-600 mb-4">Unable to load questions. Please check your network connection and try again later.</p>
          <Button onClick={handleBack} className="back-button mt-4">Back to Instructions</Button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {showTimeUpModal && <TimeUpModal onSubmit={handleTimeUp} />}
        {showWordCountWarning && renderWordCountWarningModal()}
        
        {/* Header Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between max-w-full">
            <div className="flex items-center space-x-4">
              <Button onClick={handleBack} className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                <span className="material-icons text-lg">arrow_back</span>
                <span>Back</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${currentTask === 'task1' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <span className={`text-sm font-medium ${currentTask === 'task1' ? 'text-blue-600' : 'text-gray-500'}`}>Task 1</span>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className={`w-3 h-3 rounded-full ${currentTask === 'task2' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <span className={`text-sm font-medium ${currentTask === 'task2' ? 'text-blue-600' : 'text-gray-500'}`}>Task 2</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Test Type Badge */}
              {testType && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  testType === 'academic' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  <span className="material-icons text-sm mr-1">
                    {testType === 'academic' ? 'school' : 'work'}
                  </span>
                  {testType === 'academic' ? 'Academic' : 'General Training'}
                </span>
              )}
              
              {/* Word Count */}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                wordCount < (currentTask === 'task1' ? 150 : 250)
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                <span className="material-icons text-sm">text_format</span>
                <span className="text-sm font-medium">
                  {wordCount} / {currentTask === 'task1' ? 150 : 250} words
                </span>
              </div>
              
              {/* Timer would go here if needed */}
            </div>
          </div>
        </div>

        {/* Main Content Area - Split Screen */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Panel - Questions */}
          <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              {/* Task Header */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    currentTask === 'task1' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    <span className="material-icons text-lg">
                      {currentTask === 'task1' 
                        ? (testType === 'academic' ? 'analytics' : 'mail')
                        : 'edit'
                      }
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      IELTS Writing Task {currentTask === 'task1' ? '1' : '2'}
                    </h2>
                    <p className="text-gray-600">
                      {currentTask === 'task1' 
                        ? (testType === 'academic' 
                            ? 'Describe and analyze visual information' 
                            : 'Write a letter based on the situation')
                        : 'Write an essay response'
                      }
                    </p>
                  </div>
                </div>
                
                {/* Task Requirements */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{currentTask === 'task1' ? '150+' : '250+'}</div>
                    <div className="text-xs text-gray-600">Min Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{currentTask === 'task1' ? '20' : '40'}</div>
                    <div className="text-xs text-gray-600">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{currentTask === 'task1' ? '33%' : '67%'}</div>
                    <div className="text-xs text-gray-600">Weight</div>
                  </div>
                </div>
              </div>

              {/* Task Content */}
              <div className="space-y-6">
                {/* Task 1 Content */}
                {currentTask === 'task1' && (
                  <>
                    {/* Task Prompt - Always show first */}
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="material-icons text-blue-600">
                          {testType === 'academic' ? 'analytics' : 'mail'}
                        </span>
                        <h3 className="font-semibold text-blue-800">
                          {testType === 'academic' ? 'Task Description' : 'Letter Writing Task'}
                        </h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {currentTaskData.prompt || currentTaskData.text}
                      </p>
                    </div>

                    {/* Image Display for Academic Tests - Show after task description */}
                    {currentTaskData.hasImage && currentTaskData.imageUrl && (
                      <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="material-icons text-gray-600">image</span>
                          <h3 className="font-semibold text-gray-800">Visual Data</h3>
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            Academic Task 1
                          </span>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <img 
                            src={currentTaskData.imageUrl} 
                            alt="Task 1 Visual Data - Chart/Graph/Diagram" 
                            className="academic-task-image mx-auto block"
                            onLoad={(e) => {
                              console.log("Image loaded successfully:", currentTaskData.imageUrl);
                              console.log("Image dimensions:", e.target.naturalWidth, "x", e.target.naturalHeight);
                              e.target.style.display = 'block';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'none';
                              }
                            }}
                            onError={(e) => {
                              console.error("Image failed to load:", currentTaskData.imageUrl);
                              console.error("Image error event:", e);
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'block';
                              }
                            }}
                          />
                          <div 
                            className="text-center text-gray-500 p-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
                            style={{ display: 'none' }}
                          >
                            <span className="material-icons text-4xl mb-2 text-gray-400">broken_image</span>
                            <p className="font-medium text-gray-600 mb-2">Image could not be loaded</p>
                            <p className="text-xs text-gray-500 break-all">URL: {currentTaskData.imageUrl}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              This may be due to network issues or an invalid image URL.
                            </p>
                          </div>
                        </div>
                        <div className="image-analysis-note">
                          <div className="flex items-start space-x-2">
                            <span className="material-icons text-blue-600 text-sm mt-0.5">info</span>
                            <div className="image-analysis-text">
                              <p className="font-medium mb-1">Analysis Instructions:</p>
                              <p>Carefully examine the visual data above. Describe the main features, trends, and patterns. Make comparisons where relevant and highlight significant changes or differences.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Debug info for Academic Task 1 without image - Compact version */}
                    {testType === 'academic' && currentTask === 'task1' && (!currentTaskData.hasImage || !currentTaskData.imageUrl) && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="material-icons text-yellow-600 text-sm">warning</span>
                          <h4 className="font-medium text-yellow-800">No Visual Data Available</h4>
                        </div>
                        <p className="text-sm text-yellow-700 mb-2">
                          This Academic Task 1 question does not include a chart, graph, or diagram.
                        </p>
                        <details className="text-xs text-yellow-600">
                          <summary className="cursor-pointer font-medium">Debug Info</summary>
                          <div className="mt-2 p-2 bg-yellow-100 rounded">
                            <div>hasImage: {String(currentTaskData.hasImage)}</div>
                            <div>imageUrl: {currentTaskData.imageUrl || 'null'}</div>
                          </div>
                        </details>
                      </div>
                    )}
                    
                    {/* Instructions */}
                    {currentTaskData.instructions && (
                      <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="material-icons text-amber-600">task_alt</span>
                          <h3 className="font-semibold text-amber-800">Instructions</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed font-medium">{currentTaskData.instructions}</p>
                      </div>
                    )}
                    
                    {/* Situation (for General Training) */}
                    {currentTaskData.situation && testType === 'general-training' && (
                      <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="material-icons text-green-600">description</span>
                          <h3 className="font-semibold text-green-800">Situation</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{currentTaskData.situation}</p>
                      </div>
                    )}
                    
                    {/* Bullet Points (for General Training) */}
                    {currentTaskData.bulletPoints && currentTaskData.bulletPoints.length > 0 && (
                      <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="material-icons text-yellow-600">format_list_bulleted</span>
                          <h3 className="font-semibold text-yellow-800">Key Points to Address</h3>
                        </div>
                        <ul className="space-y-2">
                          {currentTaskData.bulletPoints.map((point, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-200 text-yellow-800 text-sm font-bold flex-shrink-0 mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-gray-700 leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
                
                {/* Task 2 Content */}
                {currentTask === 'task2' && (
                  <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="material-icons text-purple-600">edit</span>
                      <h3 className="font-semibold text-purple-800">Essay Prompt</h3>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">{currentTaskData.text}</p>
                  </div>
                )}
                
                {/* Writing Tips */}
                <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-400">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="material-icons text-indigo-600">lightbulb</span>
                    <h3 className="font-semibold text-indigo-800">
                      {currentTask === 'task1' 
                        ? (testType === 'academic' ? 'Academic Writing Tips' : 'Letter Writing Tips')
                        : 'Essay Writing Tips'
                      }
                    </h3>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {currentTask === 'task1' ? (
                      testType === 'academic' ? (
                        <>
                          <li>• Focus on key trends, patterns, and significant data points</li>
                          <li>• Use appropriate academic vocabulary and formal language</li>
                          <li>• Make comparisons and highlight contrasts where relevant</li>
                          <li>• Organize information logically with clear paragraphs</li>
                        </>
                      ) : (
                        <>
                          <li>• Use appropriate tone (formal, semi-formal, or informal)</li>
                          <li>• Address all bullet points clearly and completely</li>
                          <li>• Use proper letter format with greeting and closing</li>
                          <li>• Organize your ideas in logical paragraphs</li>
                        </>
                      )
                    ) : (
                      <>
                        <li>• Present a clear position and maintain it throughout</li>
                        <li>• Support your arguments with relevant examples</li>
                        <li>• Use a variety of linking words and phrases</li>
                        <li>• Write a strong introduction and conclusion</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Writing Area */}
          <div className="w-1/2 bg-gray-50 flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              {/* Writing Area Header */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Response</h3>
                <p className="text-sm text-gray-600">
                  Write your {currentTask === 'task1' 
                    ? (testType === 'academic' ? 'description' : 'letter') 
                    : 'essay'} here. Remember to check your word count and grammar.
                </p>
              </div>
              
              {/* Writing Textarea */}
              <div className="flex-1 flex flex-col">
                <textarea
                  className="flex-1 w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm leading-relaxed"
                  value={currentTask === 'task1' ? task1Response : task2Response}
                  onChange={handleResponseChange}
                  placeholder={`Start writing your ${currentTask === 'task1' 
                    ? (testType === 'academic' ? 'description' : 'letter') 
                    : 'essay'} here...`}
                  style={{ minHeight: '400px' }}
                />
              </div>
            </div>
            
            {/* Bottom Action Bar */}
            <div className="bg-white border-t border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    wordCount < (currentTask === 'task1' ? 150 : 250)
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {wordCount} words
                  </div>
                  
                  {wordCount < (currentTask === 'task1' ? 150 : 250) && (
                    <div className="text-sm text-amber-600">
                      {(currentTask === 'task1' ? 150 : 250) - wordCount} more words needed
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  {currentTask === 'task2' && (
                    <Button 
                      onClick={() => setCurrentTask('task1')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Back to Task 1
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleTaskSubmit} 
                    disabled={wordCount < 20 || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating Feedback...</span>
                      </>
                    ) : (
                      <>
                        <span>{currentTask === 'task1' ? 'Continue to Task 2' : 'Submit for Feedback'}</span>
                        <span className="material-icons text-lg">
                          {currentTask === 'task1' ? 'arrow_forward' : 'send'}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
    <div className="w-full max-w-none">
      <div className="w-full max-w-none">
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
    </div>
  );
};

export default WritingPage;