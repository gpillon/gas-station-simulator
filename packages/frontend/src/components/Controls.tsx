import React, { useEffect, useState } from 'react';
import SimulationSettingsModal from './SimulationSettingsModal';
import { SimulationState } from '../types';

interface Props {
  sendCommand: (command: string) => void;
  isSimulationRunning: boolean;
  state: SimulationState;
}

const Controls: React.FC<Props> = ({ sendCommand, isSimulationRunning, state }) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [initialSettings, setInitialSettings] = useState({
    vehiclesAutoRefill: false,
    tanksAutoRefill: false,
    autoAdjustPrices: false,
    chanchePerSecondOfVehicleStartRefill: 0.25,
    queueSize: 10,
    vehiclesPerSecond: 0.3,
  });

  useEffect(() => {
    setInitialSettings({
      vehiclesAutoRefill: state.vehiclesAutoRefill,
      tanksAutoRefill: state.tanksAutoRefill,
      autoAdjustPrices: state.autoAdjustPrices,
      chanchePerSecondOfVehicleStartRefill: state.chanchePerSecondOfVehicleStartRefill,
      queueSize: state.queueSize,
      vehiclesPerSecond: state.vehiclesPerSecond,
    });
  }, [state]);

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
      <h2 
        className="text-2xl font-semibold mb-4 cursor-pointer hover:opacity-80 text-blue-600"
        onClick={() => setIsSettingsModalOpen(true)}
      >
        Controls
      </h2>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={handleStartClick}
          className={`w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ${
            isSimulationRunning ? 'opacity-50 cursor-not-allowed z-0' : 'z-10'
          }`}
          disabled={isSimulationRunning}
        >
          Start Simulation
        </button>
        <button
          onClick={handleStopClick}
          className={`w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ${
            !isSimulationRunning ? 'opacity-50 cursor-not-allowed z-0' : 'z-10'
          }`}
          disabled={!isSimulationRunning}
        >
          Stop Simulation
        </button>
        <button
          onClick={() => sendCommand('RESET')}
          className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded z-10"
        >
          Reset Simulation
        </button>
      </div>
      {isSettingsModalOpen && (
        <SimulationSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          initialSettings={initialSettings}
        />
      )}
    </div>
  );
};

export default Controls;