import React from 'react';

interface Props {
  sendCommand: (command: string) => void;
}

const Controls: React.FC<Props> = ({ sendCommand }) => {
  return (
    <div className="controls mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Controls</h2>
      <div className="flex space-x-4">
        <button
          onClick={() => sendCommand('START')}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Start Simulation
        </button>
        <button
          onClick={() => sendCommand('STOP')}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Stop Simulation
        </button>
        <button
          onClick={() => sendCommand('RESET')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
        >
          Reset Simulation
        </button>
      </div>
    </div>
  );
};

export default Controls;