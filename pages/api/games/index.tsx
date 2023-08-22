import { GameSession } from '../../../types';
import { NextApiRequest, NextApiResponse } from 'next';

export const games: { [key: string]: GameSession } = {};

function generateGameId(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const gameIdLength = 6;
  let gameId = '';
  for (let i = 0; i < gameIdLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    gameId += characters.charAt(randomIndex);
  }
  return gameId;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const gameId = generateGameId(); // Generate a unique game ID
    const gameSession = {
      host: req.body.host,
      players: [req.body.host],
    };
    games[gameId] = gameSession; // Store the game session using the generated game ID
    res.status(200).json({ gameId, gameSession });
  }
}
