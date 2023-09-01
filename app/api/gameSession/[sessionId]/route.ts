import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
  ) {
  try {
    console.log('params:', params);
    const sessionId = params.sessionId;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID not provided' }, { status: 400 });
    }

    // Define the path to the game session file
    const gameSessionFolder = path.join(process.cwd(), 'game_sessions');
    const gameSessionFile = path.join(gameSessionFolder, `${sessionId}.json`);

    // Read the game session data from the JSON file
    const fileContent = await fs.readFile(gameSessionFile, 'utf-8');
    const gameSessionData = JSON.parse(fileContent);

    return NextResponse.json(gameSessionData);
  } catch (error) {
    console.error('Error reading game session data:', error);
    return NextResponse.json(error || 'An error occurred while reading game session data', { status: 500 });
  }
}
