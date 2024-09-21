import React from 'react';

interface Props {
  sendCommand: (command: string) => void;
  isSimulationRunning: boolean;
}

const Controls: React.FC<Props> = ({ sendCommand, isSimulationRunning }) => {
  const handleStartClick = () => {
    if (!isSimulationRunning) {
      sendCommand('START');
    }
  };

  const handleStopClick = () => {
    if (isSimulationRunning) {
      sendCommand('STOP');
    }
  };

  return (
    <div className="controls mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Controls</h2>
      <div className="flex space-x-4">
        <button
          onClick={handleStartClick}
          className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ${
            isSimulationRunning ? 'opacity-50 cursor-not-allowed z-0' : 'z-10'
          }`}
          disabled={isSimulationRunning}
        >
          Start Simulation
        </button>
        <button
          onClick={handleStopClick}
          className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ${
            !isSimulationRunning ? 'opacity-50 cursor-not-allowed z-0' : 'z-10'
          }`}
          disabled={!isSimulationRunning}
        >
          Stop Simulation
        </button>
        <button
          onClick={() => sendCommand('RESET')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded z-10"
        >
          Reset Simulation
        </button>
      </div>
    </div>
  );
};

export default Controls;