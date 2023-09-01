import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import random from "lodash/random";

export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;

    // Retrieve the parsed JSON body directly
    const requestBody = await request.json(); // Assuming players are sent in the request body
    const players = requestBody.players;

    if (!sessionId || !players) {
      return NextResponse.json(
        { error: "Session ID or players not provided" },
        { status: 400 }
      );
    }

    // Load locations from the locations.json file
    const locationsFilePath = path.join(process.cwd(), "locations.json");
    const locationsContent = await fs.readFile(locationsFilePath, "utf-8");
    const locations = JSON.parse(locationsContent);

    // Randomly select a location
    const locationKeys = Object.keys(locations.locations);
    const selectedLocation = locationKeys[random(0, locationKeys.length - 1)];

    // Get the roles for the selected location
    let roles = locations.locations[selectedLocation].roles;

    // Randomly select a player to be the spy
    const spy = players[random(0, players.length - 1)];

    // Assign roles to players ensuring one player is selected as the spy
    const assignedRoles: any = {};
    for (const player of players) {
      if (player.name === spy.name) {
        assignedRoles[player.name] = "Spy";
      } else {
        const roleIndex = random(0, roles.length - 1);
        assignedRoles[player.name] = roles[roleIndex].name;
        roles.splice(roleIndex, 1);
      }
    }

    // Read the existing game session data
    const gameSessionFile = path.join(
      process.cwd(),
      "game_sessions",
      `${sessionId}.json`
    );
    const existingSessionData = JSON.parse(
      await fs.readFile(gameSessionFile, "utf-8")
    );

    // Update the existing game session data
    existingSessionData["location"] = selectedLocation;
    existingSessionData["roles"] = assignedRoles;
    existingSessionData["gameState"] = "in_progress"; // Change gameState here

    // Save the updated game session data to the game session JSON file
    await fs.writeFile(
      gameSessionFile,
      JSON.stringify(existingSessionData),
      "utf-8"
    );

    return NextResponse.json({ message: "Game started successfully" });
  } catch (error) {
    console.error("Error starting the game:", error);
    return NextResponse.json(
      { error: "Error starting the game" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID not provided" },
        { status: 400 }
      );
    }

    // Define the path to the game session file
    const gameSessionFolder = path.join(process.cwd(), "game_sessions");
    const gameSessionFile = path.join(gameSessionFolder, `${sessionId}.json`);

    // Read the game session data from the JSON file
    const fileContent = await fs.readFile(gameSessionFile, "utf-8");
    const gameSessionData = JSON.parse(fileContent);

    return NextResponse.json(gameSessionData);
  } catch (error) {
    console.error("Error reading game session data:", error);
    return NextResponse.json(
      error || "An error occurred while reading game session data",
      { status: 500 }
    );
  }
}

async function parseRequestBody(request: Request): Promise<any> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    request.body.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    request.body.on("end", () => {
      const data = Buffer.concat(chunks).toString("utf-8");
      resolve(JSON.parse(data));
    });
    request.body.on("error", (err: Error) => {
      reject(err);
    });
  });
}
