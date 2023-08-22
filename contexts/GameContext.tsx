import React, { createContext, useState, useContext } from 'react';
import { GameSession } from '../app/types';

interface GameContextType {
  gameSession: GameSession | null;
  setGameSession: React.Dispatch<React.SetStateAction<GameSession | null>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC = ({ children }) => {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);

  return (
    <GameContext.Provider value={{ gameSession, setGameSession }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
