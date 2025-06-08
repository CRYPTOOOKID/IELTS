import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';
import { GitBranch, ArrowRight } from 'lucide-react';
import { IeltsQuestion } from '../../../../types/IeltsTypes';

interface MatchingFeaturesQuestionProps {
  question: IeltsQuestion;
  selectedAnswers: { [key: string]: string };
  onAnswerChange: (answers: { [key: string]: string }) => void;
}

const MatchingFeaturesQuestion: React.FC<MatchingFeaturesQuestionProps> = ({
  question,
  selectedAnswers,
  onAnswerChange,
}) => {
  const handleSelectionChange = (itemText: string, feature: string) => {
    const newAnswers = { ...selectedAnswers };
    if (feature === '') {
      delete newAnswers[itemText];
    } else {
      newAnswers[itemText] = feature;
    }
    onAnswerChange(newAnswers);
  };

  const getUsedFeatures = () => {
    return Object.values(selectedAnswers);
  };

  const isFeatureUsed = (feature: string) => {
    return getUsedFeatures().includes(feature);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography
                variant="body2"
                color="primary"
                fontWeight="bold"
              >
                Questions {question.questionNumber}-{question.questionNumber + (question.items?.length || 1) - 1}
              </Typography>
              <Chip
                icon={<GitBranch size={14} />}
                label="MATCHING FEATURES"
                size="small"
                color="secondary"
                variant="outlined"
              />
            </Box>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ lineHeight: 1.5 }}
            >
              {question.questionText}
            </Typography>
          </Box>

          {/* Available Features */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Available Features:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {question.options?.map((option, index) => {
                const optionKey = Object.keys(option)[0];
                const optionText = option[optionKey];
                return (
                  <motion.div
                    key={optionKey}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <Chip
                      label={`${optionKey}. ${optionText}`}
                      variant={isFeatureUsed(optionKey) ? "filled" : "outlined"}
                      color={isFeatureUsed(optionKey) ? "primary" : "default"}
                      size="small"
                      sx={{
                        margin: 0.5,
                        fontSize: '0.75rem',
                        opacity: isFeatureUsed(optionKey) ? 0.7 : 1,
                      }}
                    />
                  </motion.div>
                );
              })}
            </Box>
          </Box>

          {/* Matching Items */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Match each item with a feature:
            </Typography>
            
            {question.items?.map((item, index) => (
              <motion.div
                key={item.itemText}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    mb: 2,
                    border: '2px solid',
                    borderColor: selectedAnswers[item.itemText] ? '#2563eb' : '#e2e8f0',
                    borderRadius: 2,
                    backgroundColor: selectedAnswers[item.itemText] ? '#eff6ff' : 'white',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="primary"
                    sx={{ minWidth: 100 }}
                  >
                    {item.itemText}
                  </Typography>
                  
                  <ArrowRight size={20} color="#6b7280" />
                  
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <Select
                      value={selectedAnswers[item.itemText] || ''}
                      onChange={(e) => handleSelectionChange(item.itemText, e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: selectedAnswers[item.itemText] ? '#2563eb' : '#d1d5db',
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>Select a feature...</em>
                      </MenuItem>
                      {question.options?.map((option) => {
                        const optionKey = Object.keys(option)[0];
                        const optionText = option[optionKey];
                        const isUsed = isFeatureUsed(optionKey) && selectedAnswers[item.itemText] !== optionKey;
                        return (
                          <MenuItem
                            key={optionKey}
                            value={optionKey}
                            disabled={isUsed}
                            sx={{
                              opacity: isUsed ? 0.5 : 1,
                              fontSize: '0.875rem',
                            }}
                          >
                            {optionKey}. {optionText}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Tips:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '16px' }}>
                <li>Read all the features carefully before matching</li>
                <li>Look for specific characteristics or attributes mentioned</li>
                <li>Each feature can only be used once</li>
                <li>Some features may not be used at all</li>
              </ul>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MatchingFeaturesQuestion; 