'use client';
import React, { useEffect, useState } from 'react';

function GameSession({ params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId;

  // State for the player name retrieved from the cookie
  const [playerNameFromCookie, setPlayerNameFromCookie] = useState<string | undefined>();
  
  // State for the game session data
  const [gameSessionData, setGameSessionData] = useState<{
    players: Array<any>;
    host: string;
  } | null>(null);

  // First useEffect to retrieve player's name from the cookie
  useEffect(() => {
    setPlayerNameFromCookie(getCookie('playerName'));
  }, []);

  // Second useEffect to fetch game session data
  useEffect(() => {
    async function fetchGameSessionData() {
      try {
        const response = await fetch(`/api/gameSession/${sessionId}`);
        const data = await response.json();
        setGameSessionData(data);
      } catch (error) {
        console.error('Error fetching game session data:', error);
      }
    }

    if (sessionId) {
      fetchGameSessionData();
    }

    const refreshInterval = setInterval(fetchGameSessionData, 5000); // Refresh every 5 seconds

    return () => {
      clearInterval(refreshInterval);
    };
  }, [sessionId]);

  if (!gameSessionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-darkblue-900 text-lightblue-100 p-24">
      <h1 className="text-5xl font-bold mb-8">Game ID: {sessionId}</h1>
      <div className="bg-darkblue-800 p-4 rounded-lg w-full max-w-md">
        <h2 className="text-2xl mb-4 text-darkblue-600">Players:</h2>
        <ul className="list-none p-0">
          {gameSessionData.players.map((player, index) => (
            <li
              key={index}
              className={`p-2 mb-2 rounded-lg ${
                gameSessionData.host === player.name 
                  ? 'bg-green-500' 
                  : playerNameFromCookie === player.name 
                    ? 'bg-yellow-500' 
                    : 'bg-blue-500'
              }`}
            >
              {player.name} {gameSessionData.host === player.name ? '👑' : ''}
            </li>
          ))}
        </ul>
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
    return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  }
}

export default GameSession;





