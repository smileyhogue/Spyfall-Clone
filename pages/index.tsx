import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../app/layout";
import { useGame } from "../contexts/GameContext";
import GameSession from "../app/components/GameSession";
import { generateGameId } from "../utils/utils";

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const [spyName, setSpyName] = useState("");
  const [joinGameId, setJoinGameId] = useState("");

  const { gameSession, setGameSession } = useGame();
  const router = useRouter();

  const handleHostGame = () => {
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ host: { id: generateGameId(), name: spyName } }),
      });
      const data = await response.json();
      const { gameId } = data;
      setGameSession(data.gameSession);
      // Use `asPath` to get the current path
      router.push(`/game/${gameId}`, undefined, { shallow: true });
    } catch (error) {
      console.error("Error hosting game:", error);
    }
  };

  const handleJoinGame = () => {
    setJoinModalOpen(true);
  };

  const handleJoinSubmit = async () => {
    try {
      const response = await fetch(`/api/games/${joinGameId}`);
      const data = await response.json();
      if (data) {
        setGameSession(data);
        router.push(`/game/${joinGameId}`);
      } else {
        console.error("Game not found.");
      }
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl mb-8">Spyfall Clone</h1>

        {gameSession ? (
          <GameSession session={gameSession} />
        ) : (
          <>
            <div className="space-y-4">
              <button
                onClick={handleHostGame}
                className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
              >
                Host a game
              </button>
              <button
                onClick={handleJoinGame}
                className="px-6 py-3 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
              >
                Join a game
              </button>
            </div>

            {isModalOpen && (
              <div className="modal-background">
                <div className="modal-content">
                  <h2 className="text-xl mb-4">Enter your Spy name</h2>
                  <input
                    type="text"
                    value={spyName}
                    onChange={(e) => setSpyName(e.target.value)}
                    className="modal-input"
                  />
                  <button onClick={handleSubmit} className="modal-button">
                    Submit
                  </button>
                </div>
              </div>
            )}

            {isJoinModalOpen && (
              <div className="modal-background">
                <div className="modal-content">
                  <h2 className="text-xl mb-4">Join a Game</h2>

                  <label className="block mb-2">Game ID</label>
                  <input
                    type="text"
                    value={joinGameId}
                    onChange={(e) => setJoinGameId(e.target.value)}
                    className="modal-input mb-4"
                    placeholder="Enter Game ID"
                  />

                  <label className="block mb-2">Your Spy Name</label>
                  <input
                    type="text"
                    value={spyName}
                    onChange={(e) => setSpyName(e.target.value)}
                    className="modal-input mb-4"
                  />

                  <button onClick={handleJoinSubmit} className="modal-button">
                    Join
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
