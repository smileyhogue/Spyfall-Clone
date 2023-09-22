"use server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

async function setCookie(name: string) {
  cookies().set("name", name);
}

async function startGame(data: any) {
  // generate a random 6 alphanumeric character string
  let code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const gameSession = await prisma.game_sessions.create({
    data: {
      sessionID: code,
      host: data.name,
      gameState: "lobby",
    },
  });
  const gameSessionPlayers = await prisma.game_session_players.create({
    data: {
      sessionID: gameSession.sessionID,
      player_name: data.name,
    },
  });
  // disconnect from database
  await prisma.$disconnect();
  setCookie(data.name);
  return gameSession;
}

async function joinGame(data: any) {
  // check if session id exists in game_sessions table
  const gameSession = await prisma.game_sessions.findUnique({
    where: {
      sessionID: data.gameID,
    },
  });
  if (gameSession == null) {
    return null;
  }
  // generate a random 6 alphanumeric character string
  const gameSessionPlayers = await prisma.game_session_players.create({
    data: {
      sessionID: data.gameID,
      player_name: data.name,
    },
  });
  await prisma.$disconnect();
  setCookie(data.name);
  return gameSessionPlayers;
}

async function startNewGame(sessionID: string) {
  // get locations from database
  const locations = await prisma.locations.findMany();
  // get players from database in this session
  const players = await prisma.game_session_players.findMany({
    where: {
      sessionID: sessionID,
    },
  });
  // get random location
  const randomLocation =
    locations[Math.floor(Math.random() * locations.length)];
  // get roles for this location
  const roles = await prisma.roles.findMany({
    where: {
      location_id: randomLocation.id,
    },
  });

  // assign location to game_session
  const gameSession = await prisma.game_sessions.update({
    where: {
      sessionID: sessionID,
    },
    data: {
      locationId: randomLocation.id,
    },
  });
  // randomly assign roles to players and  update game_session_roles
  for (let i = 0; i < players.length; i++) {
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    await prisma.game_session_roles.create({
      data: {
        sessionID: sessionID,
        player_name: players[i].player_name,
        role_id: randomRole.id,
      },
    });
  }
  // update game_session to gameState = "started"
  const updatedGameSession = await prisma.game_sessions.update({
    where: {
      sessionID: sessionID,
    },
    data: {
      gameState: "in_progress",
    },
  });
  await prisma.$disconnect();
  sendStartGame(sessionID);
}

async function sendStartGame(sessionID: string) {
  // send websocket message to all players in session to start game
  const ws = new WebSocket(
    "wss://free.blr2.piesocket.com/v3/1?api_key=fwgAxy5bvnDC4vjweGMQ1etiC57zqC1gmV2yg2bw&notify_self=1"
  );
  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        action: "message",
        channel: sessionID,
        type: "game_start",
      })
    );
  };
}

export { startGame, joinGame, startNewGame, sendStartGame };
