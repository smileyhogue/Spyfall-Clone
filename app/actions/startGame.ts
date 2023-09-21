'use server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
async function startGame(data: any) {
    // generate a random 6 alphanumeric character string
    let code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const gameSession = await prisma.game_sessions.create({
        data: {
            sessionID: code,
            host: data.name,
            gameState: "lobby"
        }
    });
    const gameSessionPlayers = await prisma.game_session_players.create({
        data: {
            sessionID: gameSession.sessionID,
            player_name: data.name
        }
    });
    return gameSession;
}

async function joinGame(data: any) {
    // check if session id exists in game_sessions table
    const gameSession = await prisma.game_sessions.findUnique({
        where: {
            sessionID: data.gameID
        }
    });
    if (gameSession == null) {
        return null;
    }
    // generate a random 6 alphanumeric character string
    const gameSessionPlayers = await prisma.game_session_players.create({
        data: {
            sessionID: data.gameID,
            player_name: data.name
        }
    });
    return gameSessionPlayers;
}

export { startGame, joinGame };