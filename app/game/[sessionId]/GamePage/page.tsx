'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function GamePage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const sessionId = params.sessionId;

  const [gameSessionData, setGameSessionData] = useState<{
    players: Array<any>;
    roles: any;
    location: string;
    gameState: string;
  } | null>(null);

  const locationsData = require("../../../../locations.json");
  const availableRoles =
    gameSessionData && locationsData.locations[gameSessionData.location]
      ? locationsData.locations[gameSessionData.location].roles.map(
          (role: { name: string }) => role.name
        )
      : [];
  const availableLocations = Object.keys(locationsData.locations);

  useEffect(() => {
    async function fetchGameSessionData() {
      try {
        const response = await fetch(`/api/gameSession/${sessionId}`);
        const data = await response.json();
        setGameSessionData(data);
      } catch (error) {
        console.error("Error fetching game session data:", error);
      }
    }

    if (sessionId) {
      fetchGameSessionData();
    }
  }, [sessionId]);

  useEffect(() => {
    // Automatic redirection logic for non-host players
    if (!gameSessionData) {
      return;
    }

    const playerNameFromCookie = getCookie("playerName");

    if (
      gameSessionData.gameState === "lobby" &&
      !gameSessionData.roles[playerNameFromCookie]
    ) {
      router.push(`/waiting/${sessionId}`); // Redirect to waiting lobby or a specific page
    }
  }, [gameSessionData, router, sessionId]);

  if (!gameSessionData) {
    return <div>Loading...</div>;
  }

  const playerNameFromCookie = getCookie("playerName");
  const currentPlayerRole = gameSessionData.roles[playerNameFromCookie] || "";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-darkblue-900 text-lightblue-100 p-24">
      <h1 className="text-5xl font-bold mb-8">Game Session</h1>
      <div className="bg-darkblue-800 p-4 rounded-lg w-full max-w-md">
        <div className="border border-lightblue-100 rounded-lg p-4 mb-4">
          <p className="text-2xl mb-2 text-darkblue-600">
            <strong>Players:</strong>
          </p>
          <ul className="list-disc pl-8">
            {gameSessionData.players.map((player, index) => (
              <li
                key={index}
                className={`mb-1 ${
                  gameSessionData.host === player.name
                    ? "text-green-500"
                    : playerNameFromCookie === player.name
                    ? "text-yellow-500"
                    : "text-blue-500"
                }`}
              >
                {player.name}{" "}
                {gameSessionData.host === player.name ? "👑" : ""}
              </li>
            ))}
          </ul>
        </div>
        {!currentPlayerRole || currentPlayerRole === "Spy" ? null : (
          <div className="border border-lightblue-100 rounded-lg p-4 mb-4">
            <p className="text-2xl mb-2 text-darkblue-600">
              <strong>Location:</strong> {gameSessionData.location}
            </p>
          </div>
        )}
        {!currentPlayerRole || currentPlayerRole === "Spy" ? (
          <div className="border border-lightblue-100 rounded-lg p-4 mb-4">
            <p className="text-2xl mb-2 text-darkblue-600">
              <strong>Your Role:</strong> {currentPlayerRole}
            </p>
          </div>
        ) : (
          <div className="border border-lightblue-100 rounded-lg p-4 mb-4">
            <p className="text-2xl mb-2 text-darkblue-600">
              <strong>Your Role:</strong> {currentPlayerRole}
            </p>
            <p className="text-lg mb-0">
              <strong>Available Roles:</strong>
            </p>
            <ul className="list-disc pl-8">
              {availableRoles.map((role, index) => (
                <li key={index}>{role}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="border border-lightblue-100 rounded-lg p-4">
          <p className="text-2xl mb-2 text-darkblue-600">
            <strong>Available Locations:</strong>
          </p>
          <ul className="list-disc pl-8">
            {availableLocations.map((location, index) => (
              <li key={index}>{location}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Helper function to extract a specific cookie value by its name
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    // Decode the cookie value to convert "Player%202" to "Player 2"
    return decodeURIComponent(parts.pop()?.split(";").shift() || "");
  }
}

export default GamePage;
