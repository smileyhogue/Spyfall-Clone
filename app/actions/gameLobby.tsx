import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getPlayers(sessionID: string) {
    // get all players in this session
    const players = prisma.game_session_players.findMany({
        where: {
            sessionID: sessionID
        },
        select: {
            player_name: true
        }
    });
    // disconnect from prisma
    await prisma.$disconnect();
    return players;
}

export async function getSession(sessionID: string) {
    // get the session
    const session = await prisma.game_sessions.findUnique({
        where: {
            sessionID: sessionID
        }
    });
    // disconnect from prisma
    await prisma.$disconnect();
    return session;
}