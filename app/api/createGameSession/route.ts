import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const requestData = await request.json(); // Parse the JSON request body
    console.log(requestData);
    if (!requestData) {
      return NextResponse.json({ error: 'Request data is empty' }, { status: 400 });
    }

    // Generate a random 6-digit ID
    const sessionId = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a new game session object with the provided host name
    const gameSession = {
      sessionID: sessionId,
      host: requestData.hostName, // Set the host player
      players: [{name: requestData.hostName}], // Initialize with an empty player list
      gameState: "lobby", // Set the initial game state
      roles: {}, // Initialize with an empty roles object
    };
    console.log(gameSession);
    // Define the path to the game sessions folder and file
    const gameSessionsFolder = path.join(process.cwd(), 'game_sessions');
    const gameSessionFile = path.join(gameSessionsFolder, `${sessionId}.json`);
    console.log(gameSessionFile);
    // Write the game session data to the JSON file
    await fs.writeFile(gameSessionFile, JSON.stringify(gameSession, null, 2));
    console.log("wrote file");
    return NextResponse.json({ sessionId });
  } catch (error) {
    console.error("Error creating game session in createGameSession:", error);
    return NextResponse.json(error || "An error occurred while creating the game session");
  }
}
