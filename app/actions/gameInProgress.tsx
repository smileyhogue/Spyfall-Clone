"use server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCookie() {
  const cookieStore = cookies();
  const cookieName = cookieStore.get("name");
  return cookieName;
}
// get the location for this session from database
export async function getLobbyLocation(sessionID: string) {
  const lobbyLocation = await prisma.game_sessions.findUnique({
    where: {
      sessionID: sessionID,
    },
    select: {
      locationId: true,
    },
  });
  // get the location name from locations table
  const locationName = await prisma.locations.findUnique({
    where: {
      id: lobbyLocation?.locationId as number | bigint | undefined,
    },
    select: {
      name: true,
    },
  });
  await prisma.$disconnect();
  return locationName;
}

// get the role of the given player from database table game_session_roles and get the rolw from the "roles" table
export async function getPlayerRole(sessionID: string, playerName: string) {
  const playerRole = await prisma.game_session_roles.findFirst({
    where: {
      AND: [{ sessionID: sessionID }, { player_name: playerName }],
    },
    select: {
      role_id: true,
    },
  });
  let role = "";

  if (playerRole !== null) {
    if (playerRole.role_id !== null) {
      const roleName = await prisma.roles.findUnique({
        where: {
          id: playerRole.role_id,
        },
        select: {
          name: true,
        },
      });

      if (roleName !== null) {
        if (roleName.name !== null) {
          role = roleName.name;
        }
      }
    }
  }

  await prisma.$disconnect();
  return role;
}
