import React from 'react';

function JoinGameModal({ isOpen, onClose, onJoin }) {
  const [playerName, setPlayerName] = React.useState('');
  const [gameId, setGameId] = React.useState('');

  const handleNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  const handleGameIdChange = (event) => {
    setGameId(event.target.value);
  };

  return (
    isOpen && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg w-96">
          <h2 className="text-2xl mb-4">Join a Game</h2>
          <input
            type="text"
            placeholder="Enter your name"
            className="border rounded-lg w-full p-2 mb-4"
            value={playerName}
            onChange={handleNameChange}
          />
          <input
            type="text"
            placeholder="Enter game ID"
            className="border rounded-lg w-full p-2 mb-4"
            value={gameId}
            onChange={handleGameIdChange}
          />
          <button
            onClick={() => onJoin(playerName, gameId)}
            className="bg-blue-500 text-white p-2 rounded-lg w-full"
          >
            Join
          </button>
          <button onClick={onClose} className="mt-4 text-gray-500">
            Close
          </button>
        </div>
      </div>
    )
  );
}

export default JoinGameModal;
