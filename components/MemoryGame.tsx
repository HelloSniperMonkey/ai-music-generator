import React, { useState, useEffect } from 'react';

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const EMOJIS = ['🎵', '🎸', '🎹', '🎤', '🎧', '🎺', '🎻', '🥁'];

export const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  // Initialize the game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Create pairs of cards
    const cardPairs = EMOJIS.flatMap((emoji, index) => [
      { id: index * 2, emoji, flipped: false, matched: false },
      { id: index * 2 + 1, emoji, flipped: false, matched: false },
    ]);
    
    // Shuffle the cards
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsChecking(false);
  };

  const handleCardClick = (index: number) => {
    // Prevent clicking if already checking or card is matched/flipped
    if (isChecking || cards[index].matched || cards[index].flipped || flippedIndices.length >= 2) {
      return;
    }

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      checkForMatch(newFlippedIndices);
    }
  };

  const checkForMatch = (indices: number[]) => {
    setIsChecking(true);
    const [first, second] = indices;

    if (cards[first].emoji === cards[second].emoji) {
      // Match found!
      setTimeout(() => {
        const newCards = [...cards];
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setMatchedPairs(matchedPairs + 1);
        setFlippedIndices([]);
        setIsChecking(false);
      }, 600);
    } else {
      // No match, flip back
      setTimeout(() => {
        const newCards = [...cards];
        newCards[first].flipped = false;
        newCards[second].flipped = false;
        setCards(newCards);
        setFlippedIndices([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const isGameComplete = matchedPairs === EMOJIS.length;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Game Header */}
      <div className="mb-6 text-center">
        <div className="flex justify-between items-center mb-3">
          <div className="bg-purple-900/30 px-4 py-2 rounded-lg border border-purple-600/50">
            <span className="text-sm text-purple-300">Moves: </span>
            <span className="text-lg font-bold text-purple-400">{moves}</span>
          </div>
          <div className="bg-pink-900/30 px-4 py-2 rounded-lg border border-pink-600/50">
            <span className="text-sm text-pink-300">Pairs: </span>
            <span className="text-lg font-bold text-pink-400">{matchedPairs}/{EMOJIS.length}</span>
          </div>
        </div>
        
        {isGameComplete && (
          <div className="mb-4 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/50 animate-pulse">
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              🎉 Perfect! You completed the game in {moves} moves!
            </p>
          </div>
        )}
        
        <button
          onClick={initializeGame}
          className="text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-600"
        >
          New Game
        </button>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(index)}
            disabled={card.matched || card.flipped || isChecking}
            className={`
              aspect-square rounded-xl text-4xl flex items-center justify-center
              transform transition-all duration-300 shadow-lg
              ${card.flipped || card.matched
                ? 'bg-gradient-to-br from-purple-600 to-pink-600 scale-100 rotate-0'
                : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:scale-105 hover:shadow-xl cursor-pointer'
              }
              ${card.matched ? 'opacity-60 ring-2 ring-green-400' : ''}
              ${!card.flipped && !card.matched ? 'hover:from-gray-600 hover:to-gray-700' : ''}
              disabled:cursor-not-allowed
            `}
            style={{
              transform: card.flipped || card.matched ? 'rotateY(0deg)' : 'rotateY(0deg)',
            }}
          >
            <span className={`transition-opacity duration-200 ${card.flipped || card.matched ? 'opacity-100' : 'opacity-0'}`}>
              {card.emoji}
            </span>
            <span className={`absolute transition-opacity duration-200 ${card.flipped || card.matched ? 'opacity-0' : 'opacity-100'}`}>
              🎼
            </span>
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-400">
        <p>Match all the musical instrument pairs!</p>
      </div>
    </div>
  );
};
