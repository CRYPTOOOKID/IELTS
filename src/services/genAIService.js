// Browser-compatible GenAI service using Gemini REST API directly
class GenAIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
    
    if (!this.apiKey) {
      console.warn('VITE_GEMINI_API_KEY not found in environment variables');
    }
  }

  async generateSentences(difficulty = 'easy', count = 5) {
    if (!this.apiKey) {
      console.warn('No API key available, using fallback sentences');
      return this.getFallbackSentences(difficulty, count);
    }

    try {
      const prompt = this.createPrompt(difficulty, count);
      
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from API');
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      const sentences = this.parseSentenceResponse(generatedText);
      
      if (sentences.length === 0) {
        throw new Error('No valid sentences generated');
      }

      return sentences;
    } catch (error) {
      console.error('Error generating sentences with GenAI:', error);
      return this.getFallbackSentences(difficulty, count);
    }
  }

  createPrompt(difficulty, count) {
    const difficultySettings = {
      easy: {
        wordCount: '4-6',
        complexity: 'simple present tense, basic vocabulary, common everyday words',
        examples: 'The cat sleeps. Birds fly high. Rain falls down. Dogs run fast.',
        grammar: 'Use simple subject-verb or subject-verb-object patterns'
      },
      medium: {
        wordCount: '7-10',
        complexity: 'past tense, present perfect, compound sentences, descriptive adjectives',
        examples: 'The beautiful bird sang loudly yesterday. Children played happily in the sunny park.',
        grammar: 'Include adjectives, adverbs, and prepositional phrases'
      },
      hard: {
        wordCount: '10-15',
        complexity: 'complex tenses, multiple clauses, advanced vocabulary, conditional sentences',
        examples: 'The experienced teacher carefully explained the complicated mathematical concept to her attentive students during the morning session.',
        grammar: 'Use complex sentence structures with dependent clauses'
      }
    };

    const settings = difficultySettings[difficulty] || difficultySettings.easy;

    return `You are an expert English grammar teacher creating sentence scramble exercises for language learners. 

Generate exactly ${count} grammatically perfect English sentences for a word scramble game.

DIFFICULTY LEVEL: ${difficulty.toUpperCase()}
- Word count per sentence: ${settings.wordCount} words
- Grammar complexity: ${settings.complexity}
- Grammar focus: ${settings.grammar}
- Style examples: ${settings.examples}

REQUIREMENTS:
1. Each sentence must be grammatically correct and meaningful
2. Use appropriate vocabulary for ${difficulty} level English learners
3. Ensure words can be logically scrambled and unscrambled
4. Avoid contractions, punctuation, or special characters
5. Use lowercase words only
6. Make sentences about common, relatable topics (family, nature, school, daily life)

For each sentence, provide:
- correct: Array of words in proper sentence order
- jumbled: Array of same words in scrambled order (MUST be different from correct order)
- chunks: Grammar components (N=Noun phrase, V=Verb phrase, P=Prepositional phrase, A=Adjective/Adverb phrase)

Format as valid JSON array:
[
  {
    "correct": ["the", "happy", "children", "played", "outside", "yesterday"],
    "jumbled": ["played", "children", "yesterday", "the", "outside", "happy"],
    "chunks": [
      {"words": ["the", "happy", "children"], "type": "N"},
      {"words": ["played"], "type": "V"},
      {"words": ["outside"], "type": "P"},
      {"words": ["yesterday"], "type": "A"}
    ]
  }
]

CRITICAL RULES:
- Return ONLY the JSON array, no other text
- Ensure jumbled order is truly scrambled (different from correct)
- All chunks must cover every word exactly once
- Use realistic, educational sentences
- Test that sentences make logical sense

Generate ${count} sentences now:`;
  }

  parseSentenceResponse(responseText) {
    try {
      // Clean the response text to extract JSON
      let cleanText = responseText.trim();
      
      // Remove any markdown code block formatting
      cleanText = cleanText.replace(/```json\s*/, '').replace(/```\s*$/, '');
      cleanText = cleanText.replace(/```\s*/, '');
      
      // Find JSON array in the response
      const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn('No JSON array found in response:', responseText);
        return [];
      }

      const sentences = JSON.parse(jsonMatch[0]);
      
      // Validate and clean the response
      const validSentences = sentences.map(sentence => {
        // Ensure all required fields exist and are arrays
        const correct = Array.isArray(sentence.correct) ? sentence.correct : [];
        const jumbled = Array.isArray(sentence.jumbled) ? sentence.jumbled : correct.slice();
        const chunks = Array.isArray(sentence.chunks) ? sentence.chunks : [];
        
        // If jumbled is same as correct, shuffle it
        if (JSON.stringify(jumbled) === JSON.stringify(correct)) {
          const shuffled = [...correct];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return { correct, jumbled: shuffled, chunks };
        }
        
        return { correct, jumbled, chunks };
      }).filter(sentence => 
        sentence.correct.length > 0 && 
        sentence.jumbled.length === sentence.correct.length
      );

      console.log('Successfully parsed sentences:', validSentences.length);
      return validSentences;
    } catch (error) {
      console.error('Error parsing GenAI response:', error);
      console.log('Raw response:', responseText);
      return [];
    }
  }

  getFallbackSentences(difficulty, count) {
    const fallbackSentences = {
      easy: [
        {
          jumbled: ["cat", "the", "sleeps"],
          correct: ["the", "cat", "sleeps"],
          chunks: [
            { words: ["the", "cat"], type: "N" },
            { words: ["sleeps"], type: "V" }
          ]
        },
        {
          jumbled: ["runs", "dog", "fast", "the"],
          correct: ["the", "dog", "runs", "fast"],
          chunks: [
            { words: ["the", "dog"], type: "N" },
            { words: ["runs", "fast"], type: "V" }
          ]
        },
        {
          jumbled: ["is", "sun", "bright", "the"],
          correct: ["the", "sun", "is", "bright"],
          chunks: [
            { words: ["the", "sun"], type: "N" },
            { words: ["is", "bright"], type: "V" }
          ]
        },
        {
          jumbled: ["plays", "child", "the", "happily"],
          correct: ["the", "child", "plays", "happily"],
          chunks: [
            { words: ["the", "child"], type: "N" },
            { words: ["plays", "happily"], type: "V" }
          ]
        },
        {
          jumbled: ["sings", "bird", "beautifully", "the"],
          correct: ["the", "bird", "sings", "beautifully"],
          chunks: [
            { words: ["the", "bird"], type: "N" },
            { words: ["sings", "beautifully"], type: "V" }
          ]
        }
      ],
      medium: [
        {
          jumbled: ["quickly", "ran", "dog", "the", "park", "the", "in"],
          correct: ["the", "dog", "ran", "quickly", "in", "the", "park"],
          chunks: [
            { words: ["the", "dog"], type: "N" },
            { words: ["ran", "quickly"], type: "V" },
            { words: ["in", "the", "park"], type: "P" }
          ]
        },
        {
          jumbled: ["birds", "beautiful", "the", "trees", "tall", "in", "sang", "the"],
          correct: ["the", "beautiful", "birds", "sang", "in", "the", "tall", "trees"],
          chunks: [
            { words: ["the", "beautiful", "birds"], type: "N" },
            { words: ["sang"], type: "V" },
            { words: ["in", "the", "tall", "trees"], type: "P" }
          ]
        },
        {
          jumbled: ["children", "the", "playground", "played", "yesterday", "in", "the"],
          correct: ["the", "children", "played", "in", "the", "playground", "yesterday"],
          chunks: [
            { words: ["the", "children"], type: "N" },
            { words: ["played"], type: "V" },
            { words: ["in", "the", "playground"], type: "P" },
            { words: ["yesterday"], type: "A" }
          ]
        },
        {
          jumbled: ["book", "interesting", "read", "she", "the", "quietly"],
          correct: ["she", "read", "the", "interesting", "book", "quietly"],
          chunks: [
            { words: ["she"], type: "N" },
            { words: ["read"], type: "V" },
            { words: ["the", "interesting", "book"], type: "N" },
            { words: ["quietly"], type: "A" }
          ]
        },
        {
          jumbled: ["flowers", "garden", "bloom", "spring", "the", "in", "during"],
          correct: ["the", "flowers", "bloom", "in", "the", "garden", "during", "spring"],
          chunks: [
            { words: ["the", "flowers"], type: "N" },
            { words: ["bloom"], type: "V" },
            { words: ["in", "the", "garden"], type: "P" },
            { words: ["during", "spring"], type: "P" }
          ]
        }
      ],
      hard: [
        {
          jumbled: ["excitedly", "letter", "friend", "her", "wrote", "she", "to", "best", "her", "morning", "this"],
          correct: ["she", "excitedly", "wrote", "a", "letter", "to", "her", "best", "friend", "this", "morning"],
          chunks: [
            { words: ["she"], type: "N" },
            { words: ["excitedly", "wrote"], type: "V" },
            { words: ["a", "letter"], type: "N" },
            { words: ["to", "her", "best", "friend"], type: "P" },
            { words: ["this", "morning"], type: "P" }
          ]
        },
        {
          jumbled: ["carefully", "professor", "the", "complex", "explained", "theory", "students", "to", "his"],
          correct: ["the", "professor", "carefully", "explained", "the", "complex", "theory", "to", "his", "students"],
          chunks: [
            { words: ["the", "professor"], type: "N" },
            { words: ["carefully", "explained"], type: "V" },
            { words: ["the", "complex", "theory"], type: "N" },
            { words: ["to", "his", "students"], type: "P" }
          ]
        },
        {
          jumbled: ["musicians", "talented", "performed", "concert", "hall", "the", "beautifully", "in", "the"],
          correct: ["the", "talented", "musicians", "performed", "beautifully", "in", "the", "concert", "hall"],
          chunks: [
            { words: ["the", "talented", "musicians"], type: "N" },
            { words: ["performed", "beautifully"], type: "V" },
            { words: ["in", "the", "concert", "hall"], type: "P" }
          ]
        },
        {
          jumbled: ["scientist", "breakthrough", "discovered", "important", "laboratory", "an", "in", "her"],
          correct: ["the", "scientist", "discovered", "an", "important", "breakthrough", "in", "her", "laboratory"],
          chunks: [
            { words: ["the", "scientist"], type: "N" },
            { words: ["discovered"], type: "V" },
            { words: ["an", "important", "breakthrough"], type: "N" },
            { words: ["in", "her", "laboratory"], type: "P" }
          ]
        },
        {
          jumbled: ["architecture", "ancient", "tourists", "the", "admired", "building", "magnificent"],
          correct: ["the", "tourists", "admired", "the", "magnificent", "ancient", "architecture", "building"],
          chunks: [
            { words: ["the", "tourists"], type: "N" },
            { words: ["admired"], type: "V" },
            { words: ["the", "magnificent", "ancient", "architecture", "building"], type: "N" }
          ]
        }
      ]
    };

    const sentences = fallbackSentences[difficulty] || fallbackSentences.easy;
    return sentences.slice(0, Math.min(count, sentences.length));
  }

  async generateAdaptiveSentences(userPerformance) {
    const { correctAnswers, totalAnswers, averageTime } = userPerformance;
    const accuracy = correctAnswers / totalAnswers;
    
    let difficulty = 'easy';
    if (accuracy > 0.8 && averageTime < 30) {
      difficulty = 'hard';
    } else if (accuracy > 0.6) {
      difficulty = 'medium';
    }

    console.log(`Generating adaptive sentences with difficulty: ${difficulty} (accuracy: ${accuracy.toFixed(2)}, avgTime: ${averageTime.toFixed(1)}s)`);
    return await this.generateSentences(difficulty, 3);
  }

  // Test method to verify API connection
  async testConnection() {
    if (!this.apiKey) {
      return { success: false, error: 'No API key configured' };
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Say "Hello" if you can hear me.'
            }]
          }]
        })
      });

      if (response.ok) {
        return { success: true, message: 'API connection successful' };
      } else {
        return { success: false, error: `API returned ${response.status}: ${response.statusText}` };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new GenAIService(); 