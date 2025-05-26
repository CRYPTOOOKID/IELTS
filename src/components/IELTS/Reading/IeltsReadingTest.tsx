import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { IeltsTest, IeltsQuestion, UserAnswer, TestState } from '../../../../types/IeltsTypes';
import Timer from './Timer.tsx';
import ProgressIndicator from './ProgressIndicator.tsx';
import ReadingPassage from './ReadingPassage.tsx';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion.tsx';
import TrueFalseNotGivenQuestion from './questions/TrueFalseNotGivenQuestion.tsx';
import SentenceCompletionQuestion from './questions/SentenceCompletionQuestion.tsx';
import MatchingHeadingsQuestion from './questions/MatchingHeadingsQuestion.tsx';
import ParagraphMatchingQuestion from './questions/ParagraphMatchingQuestion.tsx';

interface IeltsReadingTestProps {
  testData: IeltsTest;
  onSubmit: (answers: UserAnswer[]) => void;
  onExit?: () => void;
}

const IeltsReadingTest: React.FC<IeltsReadingTestProps> = ({ testData, onSubmit, onExit }) => {
  const navigate = useNavigate();
  const [testState, setTestState] = useState<TestState>({
    currentSectionIndex: 0,
    currentPassageIndex: 0,
    currentQuestionIndex: 0,
    userAnswers: new Map(),
    timeRemaining: testData.estimatedTimeMinutes * 60,
    isSubmitted: false,
  });

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const currentSection = testData.sections[testState.currentSectionIndex];
  const currentPassage = currentSection?.passages[testState.currentPassageIndex];
  const currentQuestion = currentPassage?.questions[testState.currentQuestionIndex];

  const getAllQuestions = useCallback((): IeltsQuestion[] => {
    return testData.sections.flatMap(section =>
      section.passages.flatMap(passage => passage.questions)
    );
  }, [testData]);

  const getTotalQuestions = useCallback((): number => {
    return getAllQuestions().length;
  }, [getAllQuestions]);

  const getAnsweredCount = useCallback((): number => {
    return testState.userAnswers.size;
  }, [testState.userAnswers]);

  // Calculate detailed results for feedback page
  const calculateResults = useCallback(() => {
    const allQuestions = getAllQuestions();
    let correctAnswers = 0;
    const questionResults: Array<{
      question: IeltsQuestion;
      userAnswer: UserAnswer | undefined;
      isCorrect: boolean;
    }> = [];

    allQuestions.forEach(question => {
      const userAnswer = testState.userAnswers.get(question.questionNumber);
      const isCorrect = userAnswer ? isAnswerCorrect(question, userAnswer) : false;
      
      if (isCorrect) {
        correctAnswers++;
      }

      questionResults.push({
        question,
        userAnswer,
        isCorrect,
      });
    });

    const totalQuestions = allQuestions.length;
    const answeredCount = testState.userAnswers.size;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const bandScore = calculateIeltsBandScore(correctAnswers, totalQuestions);

    return {
      totalQuestions,
      answeredCount,
      correctAnswers,
      incorrectAnswers: answeredCount - correctAnswers,
      unansweredQuestions: totalQuestions - answeredCount,
      score,
      bandScore,
      questionResults,
    };
  }, [testState.userAnswers, getAllQuestions]);

  // Check if user answer is correct for the new API format
  const isAnswerCorrect = (question: IeltsQuestion, userAnswer: UserAnswer): boolean => {
    if (!question.correctAnswer) return false;
    
    const correctAnswer = question.correctAnswer.toLowerCase().trim();
    
    if (question.questionType === 'MATCHING_HEADINGS') {
      // For matching headings, check if all items are correctly matched
      if (typeof userAnswer.answer === 'object' && !Array.isArray(userAnswer.answer)) {
        const userMapping = userAnswer.answer as { [key: string]: string };
        return question.items?.every(item => 
          userMapping[item.itemText] === item.correctHeading
        ) || false;
      }
      return false;
    }
    
    // For all other question types including PARAGRAPH_MATCHING
    const userAnswerText = Array.isArray(userAnswer.answer) 
      ? userAnswer.answer[0]?.toLowerCase().trim() 
      : String(userAnswer.answer).toLowerCase().trim();
    
    return userAnswerText === correctAnswer;
  };

  // Calculate IELTS band score based on correct answers out of 40
  const calculateIeltsBandScore = (correct: number, total: number): number => {
    if (total === 0) return 0;
    
    // IELTS Reading band scores are typically based on raw scores out of 40
    // This is the standard IELTS Reading band score conversion
    if (correct >= 39) return 9.0;      // 39-40/40
    if (correct >= 37) return 8.5;      // 37-38/40  
    if (correct >= 35) return 8.0;      // 35-36/40
    if (correct >= 32) return 7.5;      // 32-34/40
    if (correct >= 30) return 7.0;      // 30-31/40
    if (correct >= 27) return 6.5;      // 27-29/40
    if (correct >= 23) return 6.0;      // 23-26/40
    if (correct >= 19) return 5.5;      // 19-22/40
    if (correct >= 15) return 5.0;      // 15-18/40
    if (correct >= 11) return 4.5;      // 11-14/40
    if (correct >= 8) return 4.0;       // 8-10/40
    if (correct >= 5) return 3.5;       // 5-7/40
    if (correct >= 3) return 3.0;       // 3-4/40
    if (correct >= 2) return 2.5;       // 2/40
    if (correct >= 1) return 2.0;       // 1/40
    return 1.0;                         // 0/40
  };

  const handleAnswerChange = (questionNumber: number, answer: string | string[] | { [key: string]: string }) => {
    setTestState(prev => {
      const newAnswers = new Map(prev.userAnswers);
      newAnswers.set(questionNumber, { questionNumber, answer });
      return { ...prev, userAnswers: newAnswers };
    });
    
    setSnackbarMessage('Answer saved');
  };

  const handleMatchingAnswerChange = (answers: { [key: string]: string }) => {
    if (!currentQuestion) return;
    
    // Store the main question answer first and separately from sub-questions
    setTestState(prev => {
      const newAnswers = new Map(prev.userAnswers);
      
      // Store main question answer - this is what the dropdown component needs
      newAnswers.set(currentQuestion.questionNumber, { 
        questionNumber: currentQuestion.questionNumber, 
        answer: answers 
      });
      
      // Track individual sub-question answers for progress tracking only
      // These use different question numbers so they don't interfere
      if (currentQuestion.items) {
        currentQuestion.items.forEach((item, index) => {
          const subQuestionNumber = currentQuestion.questionNumber + index;
          const itemAnswer = answers[item.itemText];
          
          // Only store sub-question if it's not the main question number
          if (subQuestionNumber !== currentQuestion.questionNumber) {
            if (itemAnswer) {
              newAnswers.set(subQuestionNumber, { 
                questionNumber: subQuestionNumber, 
                answer: itemAnswer,
                isSubQuestion: true,
                parentQuestionNumber: currentQuestion.questionNumber
              });
            } else {
              newAnswers.delete(subQuestionNumber);
            }
          }
        });
      }
      
      return { ...prev, userAnswers: newAnswers };
    });
    
    setSnackbarMessage('Answer saved');
  };

  const handleNavigateToQuestion = (sectionIndex: number, passageIndex: number, questionIndex: number) => {
    setTestState(prev => ({
      ...prev,
      currentSectionIndex: sectionIndex,
      currentPassageIndex: passageIndex,
      currentQuestionIndex: questionIndex,
    }));
  };

  const navigateToQuestion = (direction: 'next' | 'prev') => {
    const allQuestions = getAllQuestions();
    const currentQuestionGlobalIndex = allQuestions.findIndex(q => q.questionNumber === currentQuestion?.questionNumber);
    
    let newGlobalIndex;
    if (direction === 'next') {
      newGlobalIndex = Math.min(currentQuestionGlobalIndex + 1, allQuestions.length - 1);
    } else {
      newGlobalIndex = Math.max(currentQuestionGlobalIndex - 1, 0);
    }
    
    const targetQuestion = allQuestions[newGlobalIndex];
    
    // Find the section, passage, and question indices for the target question
    let targetSectionIndex = 0;
    let targetPassageIndex = 0;
    let targetQuestionIndex = 0;
    
    for (let sIndex = 0; sIndex < testData.sections.length; sIndex++) {
      const section = testData.sections[sIndex];
      for (let pIndex = 0; pIndex < section.passages.length; pIndex++) {
        const passage = section.passages[pIndex];
        for (let qIndex = 0; qIndex < passage.questions.length; qIndex++) {
          const question = passage.questions[qIndex];
          if (question.questionNumber === targetQuestion.questionNumber) {
            targetSectionIndex = sIndex;
            targetPassageIndex = pIndex;
            targetQuestionIndex = qIndex;
            break;
          }
        }
      }
    }
    
    setTestState(prev => ({
      ...prev,
      currentSectionIndex: targetSectionIndex,
      currentPassageIndex: targetPassageIndex,
      currentQuestionIndex: targetQuestionIndex,
    }));
  };

  const isFirstQuestion = () => {
    const allQuestions = getAllQuestions();
    return currentQuestion?.questionNumber === allQuestions[0]?.questionNumber;
  };

  const handleSubmit = () => {
    const results = calculateResults();
    const answersArray = Array.from(testState.userAnswers.values());
    
    // Navigate to feedback page with results
    navigate('/ielts/reading/feedback', { 
      state: { 
        testResults: results,
        testData: testData,
        userAnswers: testState.userAnswers
      } 
    });
    
    // Call original onSubmit if provided
    onSubmit(answersArray);
    setShowSubmitDialog(false);
  };

  const handleTimeUp = () => {
    setShowTimeUpDialog(true);
    // Auto-submit after a short delay
    setTimeout(() => {
      handleSubmit();
    }, 3000);
  };

  const isLastQuestion = () => {
    const allQuestions = getAllQuestions();
    return currentQuestion?.questionNumber === allQuestions[allQuestions.length - 1]?.questionNumber;
  };

  const renderCurrentQuestion = () => {
    if (!currentQuestion) return null;

    const userAnswer = testState.userAnswers.get(currentQuestion.questionNumber);

    switch (currentQuestion.questionType) {
      case 'MULTIPLE_CHOICE':
        const selectedAnswer = userAnswer && Array.isArray(userAnswer.answer) 
          ? userAnswer.answer[0] || '' 
          : userAnswer?.answer || '';
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            selectedAnswer={selectedAnswer as string}
            onAnswerChange={(answer: string) => handleAnswerChange(currentQuestion.questionNumber, answer)}
          />
        );
      
      case 'TRUE_FALSE_NOT_GIVEN':
        const tfngAnswer = userAnswer && Array.isArray(userAnswer.answer) 
          ? userAnswer.answer[0] || '' 
          : userAnswer?.answer || '';
        return (
          <TrueFalseNotGivenQuestion
            question={currentQuestion}
            selectedAnswer={tfngAnswer as string}
            onAnswerChange={(answer: string) => handleAnswerChange(currentQuestion.questionNumber, answer)}
          />
        );
      
      case 'SENTENCE_COMPLETION':
      case 'SHORT_ANSWER':
        const textAnswer = userAnswer && Array.isArray(userAnswer.answer) 
          ? userAnswer.answer[0] || '' 
          : userAnswer?.answer || '';
        return (
          <SentenceCompletionQuestion
            question={currentQuestion}
            selectedAnswer={textAnswer as string}
            onAnswerChange={(answer: string) => handleAnswerChange(currentQuestion.questionNumber, answer)}
          />
        );
      
      case 'MATCHING_HEADINGS':
        const matchingAnswers = userAnswer?.answer && typeof userAnswer.answer === 'object' && !Array.isArray(userAnswer.answer)
          ? userAnswer.answer as { [key: string]: string }
          : {};
        
        return (
          <MatchingHeadingsQuestion
            question={currentQuestion}
            selectedAnswers={matchingAnswers}
            onAnswerChange={handleMatchingAnswerChange}
          />
        );
      
      case 'PARAGRAPH_MATCHING':
        const paragraphAnswer = userAnswer && Array.isArray(userAnswer.answer) 
          ? userAnswer.answer[0] || '' 
          : userAnswer?.answer || '';
        return (
          <ParagraphMatchingQuestion
            question={currentQuestion}
            selectedAnswer={paragraphAnswer as string}
            onAnswerChange={(answer: string) => handleAnswerChange(currentQuestion.questionNumber, answer)}
          />
        );
      
      default:
        return (
          <Alert severity="info">
            Question type "{currentQuestion.questionType}" is not yet implemented.
          </Alert>
        );
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', position: 'relative' }}>
      <Timer
        totalMinutes={testData.estimatedTimeMinutes}
        onTimeUp={handleTimeUp}
        isRunning={!testState.isSubmitted}
      />

      {/* Left Sidebar Progress Indicator */}
      <ProgressIndicator
        currentSectionIndex={testState.currentSectionIndex}
        currentPassageIndex={testState.currentPassageIndex}
        currentQuestionIndex={testState.currentQuestionIndex}
        totalSections={testData.sections.length}
        totalPassagesInSection={currentSection?.passages.length || 0}
        totalQuestionsInPassage={currentPassage?.questions.length || 0}
        answeredQuestions={getAnsweredCount()}
        totalQuestions={getTotalQuestions()}
        userAnswers={testState.userAnswers}
        currentQuestionNumber={currentQuestion?.questionNumber}
        onNavigateToQuestion={handleNavigateToQuestion}
        testData={testData}
      />

      {/* Main Content Area - Fixed passage width with flexible questions area */}
      <Container maxWidth={false} sx={{ py: 4, px: 0, ml: '260px', width: 'calc(100vw - 260px)' }}>
        <Box sx={{ display: 'flex', gap: 2, height: '100%' }}>
          {/* Reading Passage - Fixed 45% width of total screen */}
          <Box sx={{ 
            width: '45vw', 
            minWidth: '500px',
            maxWidth: '45vw',
            flexShrink: 0,
            px: 2
          }}>
            {currentPassage && (
              <ReadingPassage
                passage={currentPassage}
                sectionNumber={testState.currentSectionIndex + 1}
              />
            )}
          </Box>

          {/* Question Area - Takes remaining space */}
          <Box sx={{ 
            flex: 1, 
            minWidth: 0,
            px: 2,
            maxWidth: 'calc(43vw - 200px)' // Remaining space after sidebar and passage
          }}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${testState.currentSectionIndex}-${testState.currentPassageIndex}-${testState.currentQuestionIndex}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCurrentQuestion()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, gap: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<ChevronLeft size={20} />}
                  onClick={() => navigateToQuestion('prev')}
                  disabled={isFirstQuestion()}
                  sx={{ minWidth: 140 }}
                >
                  Previous
                </Button>

                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  {isLastQuestion() && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Send size={20} />}
                      onClick={() => setShowSubmitDialog(true)}
                      sx={{ minWidth: 160, fontWeight: 'bold' }}
                    >
                      Submit Test
                    </Button>
                  )}
                </Box>

                <Button
                  variant="contained"
                  endIcon={<ChevronRight size={20} />}
                  onClick={() => navigateToQuestion('next')}
                  disabled={isLastQuestion()}
                  sx={{ minWidth: 140 }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Send size={24} color="#10b981" />
            <Typography variant="h5" fontWeight="bold">
              Submit Test
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You have answered {getAnsweredCount()} out of {getTotalQuestions()} questions. 
          </Typography>

          {getAnsweredCount() < getTotalQuestions() && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              You have {getTotalQuestions() - getAnsweredCount()} unanswered questions.
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary">
            Once you submit, you cannot go back to change your answers. Are you sure you want to submit your test?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowSubmitDialog(false)} variant="outlined">
            Back to Test
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="success" size="large">
            Submit & View Results
          </Button>
        </DialogActions>
      </Dialog>

      {/* Time Up Dialog */}
      <Dialog open={showTimeUpDialog} disableEscapeKeyDown>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Clock size={24} color="#ef4444" />
          Time's Up!
        </DialogTitle>
        <DialogContent>
          <Typography>
            The allocated time for this test has expired. Your test will be submitted automatically.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={2000}
        onClose={() => setSnackbarMessage('')}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default IeltsReadingTest; 