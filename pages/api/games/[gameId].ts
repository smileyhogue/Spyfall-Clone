// pages/api/games/[gameId].ts

import { games } from './index';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { gameId } = req.query;

  let gameSession;

  if (typeof gameId === 'string') {
    gameSession = games[gameId]; // Retrieve the game session using the provided game ID
  }

  if (!gameSession) {
    return res.status(404).json({ error: 'Game not found' });
  }

  res.status(200).json(gameSession);
}
