import React from 'react';

const GameSession = ({ session }) => {
  return (
    <div>
      <h2 className="text-2xl mb-4">Game Session</h2>
      <ul className="space-y-2">
        {session && session.players && session.players.map(player => (
          <li key={player.id} className="border border-gray-600 p-2 rounded-md">
            {player.name}
            {player.id === session.host.id && ' 👑'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameSession;
