import React from 'react';

function GameModal({ isOpen, onClose, onCreate }) {
  const [hostName, setHostName] = React.useState(""); // State to store the host player's name

  const handleNameChange = (event) => {
    setHostName(event.target.value);
  };

  return (
    isOpen && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg w-96">
          <h2 className="text-2xl mb-4">Host a Game</h2>
          <input
            type="text"
            placeholder="Enter your name"
            className="border rounded-lg w-full p-2 mb-4"
            value={hostName}
            onChange={handleNameChange} // Call the handler function on input change
          />
          <button
            onClick={() => onCreate(hostName)} // Pass hostName to onCreate
            className="bg-blue-500 text-white p-2 rounded-lg w-full"
          >
            Create
          </button>
          <button onClick={onClose} className="mt-4 text-gray-500">
            Close
          </button>
        </div>
      </div>
    )
  );
}

export default GameModal;
