'use client';
import React from 'react';
import Image from 'next/image';
import GameModal from '../modals/ClientGameModal';
import JoinGameModal from '../modals/ClientJoinGameModal'; // Import the new JoinGameModal

async function createGameSession(hostName) {
  try {
    // Call the API endpoint to create a game session
    const response = await fetch('/api/createGameSession', {
      method: 'POST', // Use POST method
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hostName }), // Pass the host player's name in the request body
    });

    const data = await response.json();

    if (data.sessionId) {
      // Redirect the user to the game session
      window.location.href = `/game/${data.sessionId}`;
    } else {
      console.error('Failed to get the session ID');
    }
  } catch (error) {
    console.error('Error creating game session:', error);
  }
}

export default function Home() {
  const [isHostModalOpen, setIsHostModalOpen] = React.useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = React.useState(false);

  const handleHostGame = () => {
    setIsHostModalOpen(true);
  };

  const handleCloseHostModal = () => {
    setIsHostModalOpen(false);
  };

  const handleCreateGame = (hostName) => {
    createGameSession(hostName);

    setIsHostModalOpen(false);
  };

  const handleJoinGame = () => {
    setIsJoinModalOpen(true);
  };

  const handleCloseJoinModal = () => {
    setIsJoinModalOpen(false);
  };

  const handleJoin = async (playerName, gameId) => {
    try {
      const response = await fetch('/api/joinGameSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Pass the player's name and game ID as sessionid in the request body
        body: JSON.stringify({ playerName, sessionId: gameId }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        window.location.href = `/game/${gameId}`;
      } else {
        console.error('Failed to join game session');
      }
    } catch (error) {
      console.error('Error joining game session:', error);
    }
  
    setIsJoinModalOpen(false);
  };
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-darkblue-900 text-lightblue-100">
      <div className="max-w-5xl w-full items-center justify-center font-mono text-xl text-center mb-12">
        <h1 className="text-5xl font-bold mb-8">Spyfall Clone</h1>
        <p className="text-2xl">
          Dive into the world of secrets, spies, and intrigue!
        </p>
      </div>

      <div className="flex flex-col space-y-4 mb-12">
        <button
          onClick={handleHostGame}
          className="bg-lightblue-100 text-darkblue-900 rounded-lg py-4 px-8 font-bold text-xl shadow-md hover:opacity-90"
        >
          Host a game
        </button>
        <button
          onClick={handleJoinGame}
          className="bg-lightblue-100 text-darkblue-900 rounded-lg py-4 px-8 font-bold text-xl shadow-md hover:opacity-90"
        >
          Join a game
        </button>
      </div>

      <footer className="mt-16 text-sm">
        <p className="mb-4">Inspired by the original Spyfall game. Not affiliated with the official version.</p>
        <a
          className="flex items-center space-x-2 text-lightblue-300 hover:text-lightblue-500"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            className="dark:invert"
            width={100}
            height={24}
            priority
          />
          <span>Powered by Vercel</span>
        </a>
      </footer>

      <GameModal
        isOpen={isHostModalOpen}
        onClose={handleCloseHostModal}
        onCreate={handleCreateGame}
      />

      <JoinGameModal
        isOpen={isJoinModalOpen}
        onClose={handleCloseJoinModal}
        onJoin={handleJoin}
      />
    </main>
  );
}
