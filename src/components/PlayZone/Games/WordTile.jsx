import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Game logic utilities
const gameUtils = {
  // Check if the sentence is correctly arranged
  isSentenceCorrect: (currentWords, correctWords) => {
    if (currentWords.length !== correctWords.length) return false;
    return currentWords.every((word, index) => word === correctWords[index]);
  }
};

const sentences = [
  {
    jumbled: ["cat", "the", "sat", "mat", "on", "the"],
    correct: ["the", "cat", "sat", "on", "the", "mat"],
    chunks: [
      { words: ["the", "cat"], type: "N" },
      { words: ["sat"], type: "V" },
      { words: ["on", "the", "mat"], type: "P" }
    ]
  },
  {
    jumbled: ["ran", "dog", "the", "fast"],
    correct: ["the", "dog", "ran", "fast"],
    chunks: [
      { words: ["the", "dog"], type: "N" },
      { words: ["ran", "fast"], type: "V" }
    ]
  },
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
    jumbled: ["excitedly", "letter", "friend", "her", "wrote", "she", "to", "best", "her", "morning", "this"],
    correct: ["she", "excitedly", "wrote", "a", "letter", "to", "her", "best", "friend", "this", "morning"],
    chunks: [
      { words: ["she"], type: "N" },
      { words: ["excitedly", "wrote"], type: "V" },
      { words: ["a", "letter"], type: "N" },
      { words: ["to", "her", "best", "friend"], type: "P" },
      { words: ["this", "morning"], type: "P" }
    ]
  }
];

// Component to display a word tile
const WordTile = ({ word, type, isDragging, onDragStart, className, ...props }) => (
  <motion.div
    className={`${className} shadow-lg rounded-lg px-4 py-2 cursor-move 
               font-semibold text-lg select-none transition-shadow`}
    whileHover={{ scale: 1.05, boxShadow: "0 8px 15px rgba(0,0,0,0.1)" }}
    whileTap={{ scale: 0.95 }}
    animate={{ 
      opacity: isDragging ? 0.5 : 1,
      y: isDragging ? -5 : 0
    }}
    draggable
    onDragStart={onDragStart}
    {...props}
  >
    {word}
  </motion.div>
);

const WordTileGame = ({ onBackToGames }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [selectedTile, setSelectedTile] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  // Create unique word tiles with IDs
  const createWordTiles = useCallback((sentence) => {
    return sentence.jumbled.map((word, index) => ({
      id: `${word}-${index}`,
      word,
      originalIndex: index
    }));
  }, []);

  const [wordTiles, setWordTiles] = useState(() => createWordTiles(sentences[0]));
  const [draggedTileId, setDraggedTileId] = useState(null);
  const [droppedTiles, setDroppedTiles] = useState([]);
  const dropZoneRef = useRef(null);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Current sentence for easier access
  const currentSentence = useMemo(() =>
    sentences[currentSentenceIndex],
    [currentSentenceIndex]
  );

  const loadNewSentence = useCallback((index) => {
    setCurrentSentenceIndex(index);
    setWordTiles(createWordTiles(sentences[index]));
    setDroppedTiles([]);
    setDraggedTileId(null);
    setIsCorrect(null);
    setShowHint(false);
    setAttempts(0);
  }, [createWordTiles]);

  const handleNextSentence = useCallback(() => {
    if (isCorrect) {
      setScore(prevScore => prevScore + Math.max(10 - attempts, 1));
    }
    
    if (currentSentenceIndex < sentences.length - 1) {
      loadNewSentence(currentSentenceIndex + 1);
    } else {
      setGameComplete(true);
    }
  }, [currentSentenceIndex, loadNewSentence, isCorrect, attempts]);

  const checkAnswer = useCallback((tiles) => {
    const words = tiles.map(tile => tile.word);
    const isAnswerCorrect = gameUtils.isSentenceCorrect(words, currentSentence.correct);
    setIsCorrect(isAnswerCorrect);
    setAttempts(prev => prev + 1);
  }, [currentSentence.correct]);

  const getWordType = (word) => {
    for (const chunk of currentSentence.chunks) {
      if (chunk.words.includes(word)) {
        return chunk.type;
      }
    }
    return null;
  };

  const getWordClasses = (word) => {
    const type = getWordType(word);
    let classes = [];

    switch (type) {
      case 'N': classes.push('bg-blue-500 text-white border-blue-600 border-b-4'); break;
      case 'V': classes.push('bg-red-500 text-white border-red-600 border-b-4'); break;
      case 'P': classes.push('bg-green-500 text-white border-green-600 border-b-4'); break;
      case 'A': classes.push('bg-orange-500 text-white border-orange-600 border-b-4'); break;
      default: classes.push('bg-gray-500 text-white border-gray-600 border-b-4');
    }

    return classes.join(' ');
  };

  const handleDragStart = (tileId) => {
    setDraggedTileId(tileId);
  };

  // Touch handling
  const handleTileClick = (tileId) => {
    if (!isTouchDevice) return;
    
    setSelectedTile(tileId);
    const draggedTile = findTileById(tileId);
    
    // If clicked from the word bank
    if (wordTiles.find(tile => tile.id === tileId)) {
      setWordTiles(wordTiles.filter(tile => tile.id !== tileId));
      setDroppedTiles([...droppedTiles, draggedTile]);
    } 
    // If clicked from the drop zone, move to end
    else if (droppedTiles.find(tile => tile.id === tileId)) {
      setDroppedTiles(droppedTiles.filter(tile => tile.id !== tileId));
      setWordTiles([...wordTiles, draggedTile]);
    }

    // Check answer when all words are placed
    setTimeout(() => {
      if (droppedTiles.length === currentSentence.correct.length - 1) {
        checkAnswer([...droppedTiles, draggedTile]);
      } else if (droppedTiles.length === currentSentence.correct.length && 
                 wordTiles.find(tile => tile.id === tileId)) {
        setIsCorrect(null);
      }
    }, 100);
  };

  const findTileById = useCallback((id) => {
    return wordTiles.find(tile => tile.id === id) ||
           droppedTiles.find(tile => tile.id === id);
  }, [wordTiles, droppedTiles]);

  const [dropIndicatorPosition, setDropIndicatorPosition] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    const dropZone = e.target.closest('.drop-zone');
    if (!dropZone) return;

    const droppedTilesContainer = dropZone.querySelector('.relative.z-10');
    const tiles = Array.from(droppedTilesContainer.children);
    const rect = dropZone.getBoundingClientRect();
    const x = e.clientX - rect.left;

    let newPosition = x;
    for (let i = 0; i < tiles.length; i++) {
      const tileRect = tiles[i].getBoundingClientRect();
      if (e.clientX < tileRect.left + tileRect.width / 2) {
        newPosition = tileRect.left - rect.left;
        break;
      } else if (i === tiles.length - 1) {
        newPosition = tileRect.right - rect.left;
      }
    }

    setDropIndicatorPosition(newPosition);
  }, []);

  const handleDragLeave = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropIndicatorPosition(null);
    }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedTileId === null) return;

    const dropZone = e.target.closest('.drop-zone');
    if (!dropZone) return;

    const draggedTile = findTileById(draggedTileId);
    if (!draggedTile) return;

    const newDroppedTiles = [...droppedTiles];
    const currentIndex = droppedTiles.findIndex(tile => tile.id === draggedTileId);
    
    const droppedTilesContainer = dropZone.querySelector('.relative.z-10');
    const tiles = Array.from(droppedTilesContainer.children);
    let insertIndex = droppedTiles.length;

    for (let i = 0; i < tiles.length; i++) {
      const tileRect = tiles[i].getBoundingClientRect();
      if (e.clientX < tileRect.left + tileRect.width / 2) {
        insertIndex = i;
        break;
      }
    }

    if (currentIndex !== -1) {
      newDroppedTiles.splice(currentIndex, 1);
      if (insertIndex > currentIndex) {
        insertIndex--;
      }
    } else {
      setWordTiles(wordTiles.filter(tile => tile.id !== draggedTileId));
    }

    newDroppedTiles.splice(insertIndex, 0, draggedTile);
    setDroppedTiles(newDroppedTiles);
    setDropIndicatorPosition(null);

    // Check answer when all words are placed
    if (newDroppedTiles.length === currentSentence.correct.length) {
      setTimeout(() => {
        checkAnswer(newDroppedTiles);
      }, 100);
    } else {
      setIsCorrect(null);
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
  };

  const handleResetSentence = () => {
    loadNewSentence(currentSentenceIndex);
  };

  if (gameComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold mb-8"
        >
          🎉 Congratulations! 🎉
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl mb-4 text-center"
        >
          You've completed all the sentences!
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5 }}}
          className="text-2xl font-bold mb-8"
        >
          Your Score: {score}
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackToGames}
          className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold shadow-lg
                   hover:bg-purple-100 transition-colors duration-200"
        >
          Back to Games
        </motion.button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="flex justify-between items-center mb-8 relative">
        <button
          onClick={onBackToGames}
          className="absolute top-0 left-0 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors text-blue-700 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        
        <div className="text-center flex-grow">
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold text-blue-600"
          >
            Word Tile Game
          </motion.h2>
          <div className="flex justify-center gap-3 items-center mt-2">
            <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
              Sentence {currentSentenceIndex + 1} of {sentences.length}
            </div>
            <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
              Score: {score}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3 mb-4">
        <span className="inline-block px-2 py-1 bg-blue-500 text-white rounded-md border-blue-600 border-b-2 text-sm">Noun</span>
        <span className="inline-block px-2 py-1 bg-red-500 text-white rounded-md border-red-600 border-b-2 text-sm">Verb</span>
        <span className="inline-block px-2 py-1 bg-green-500 text-white rounded-md border-green-600 border-b-2 text-sm">Preposition</span>
      </div>
      
      <div className="text-center text-sm text-gray-600 mb-6 bg-white p-3 rounded-lg shadow-sm">
        {isTouchDevice ? 'Tap words to move them between the word bank and sentence area' : 'Drag words to form a correct sentence. Colors show parts of speech.'}
      </div>

      {/* Drop Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        ref={dropZoneRef}
        className="drop-zone relative min-h-[120px] border-4 border-dashed border-blue-400
                  rounded-lg overflow-hidden transition-colors duration-200 bg-white shadow-inner
                  mb-8"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="relative z-10 p-4 flex flex-wrap gap-4 justify-center items-center min-h-[80px]">
          {dropIndicatorPosition !== null && (
            <div
              className="absolute top-0 bottom-0 w-1 bg-blue-400 transform -translate-y-2"
              style={{ left: `${dropIndicatorPosition}px` }}
            />
          )}
          {droppedTiles.length === 0 && (
            <div className="text-gray-400 italic">Drop words here to form a sentence</div>
          )}
          <AnimatePresence>
            {droppedTiles.map((tile) => (
              <WordTile
                key={tile.id}
                word={tile.word}
                className={`${getWordClasses(tile.word)} ${selectedTile === tile.id ? 'ring-2 ring-yellow-400' : ''}`}
                isDragging={draggedTileId === tile.id}
                onDragStart={() => handleDragStart(tile.id)}
                onClick={() => handleTileClick(tile.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Word Tiles Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-lg bg-gray-100 shadow-inner"
      >
        <div className="text-sm text-gray-600 mb-3 font-medium">Available Words:</div>
        <div className="flex flex-wrap gap-3 justify-center">
          <AnimatePresence>
            {wordTiles.map((tile) => (
              <WordTile
                key={tile.id}
                word={tile.word}
                className={`${getWordClasses(tile.word)} ${selectedTile === tile.id ? 'ring-2 ring-yellow-400' : ''}`}
                isDragging={draggedTileId === tile.id}
                onDragStart={() => handleDragStart(tile.id)}
                onClick={() => handleTileClick(tile.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Feedback and Control Buttons */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <AnimatePresence>
          {isCorrect !== null && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className={`text-xl font-bold px-6 py-3 rounded-full ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
            >
              {isCorrect ? '✓ Correct!' : '✗ Try again!'}
            </motion.div>
          )}
        </AnimatePresence>
        
        {isCorrect === false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 text-center"
          >
            {showHint ? (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                Correct answer: {currentSentence.correct.join(' ')}
              </div>
            ) : (
              <button 
                onClick={handleShowHint}
                className="text-yellow-600 underline"
              >
                Show hint
              </button>
            )}
          </motion.div>
        )}

        <div className="flex gap-3 mt-2">
          <button
            onClick={handleResetSentence}
            className="px-4 py-2 rounded-lg font-medium shadow-md
                     bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
          
          <button
            onClick={handleNextSentence}
            disabled={!isCorrect && droppedTiles.length !== currentSentence.correct.length}
            className={`px-6 py-2 rounded-lg font-bold shadow-lg transition-colors duration-200
                      ${(isCorrect || droppedTiles.length === currentSentence.correct.length)
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {isCorrect ? 'Next Sentence →' : 'Check Answer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordTileGame;