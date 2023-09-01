import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Import the cookies function

export async function POST(req: Request, res: NextApiResponse) {
  try {
    // parse body json
    const body = await req.json();
    const { playerName, sessionId } = body;

    // Read the existing game session data from the JSON file
    const gameSessionsFolder = path.join(process.cwd(), 'game_sessions');
    const gameSessionFile = path.join(gameSessionsFolder, `${sessionId}.json`);
    const rawData = await fs.readFile(gameSessionFile, 'utf-8');
    const gameSession = JSON.parse(rawData);

    // Add the player to the list of players
    gameSession.players.push({ name: playerName });

    // Write the updated game session data back to the JSON file
    await fs.writeFile(gameSessionFile, JSON.stringify(gameSession, null, 2));

    // Set the playerName in a cookie
    cookies().set('playerName', playerName);

    // Send a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error joining game session:', error);

    // Send an error response
    return NextResponse.json(
      { success: false, error: 'An error occurred while joining the game session' },
      { status: 500 }
    );
  }
}
