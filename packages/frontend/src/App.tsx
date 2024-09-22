import React from 'react';
import Controls from './components/Controls';
import GasStation from './components/GasStation';
import Statistics from './components/Statistics';
import useWebSocket from './hooks/useWebSocket';

const App: React.FC = () => {
  const { state, sendCommand, selectGasoline, socket, refillFuel } = useWebSocket();

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Gas Station Simulator</h1>
          <GasStation 
            state={state} 
            onSelectGasoline={selectGasoline} 
            socket={socket}
            refillFuel={refillFuel}
          />
          <Statistics state={state} />
          <Controls 
          sendCommand={sendCommand}
          isSimulationRunning={state.isSimulationRunning}
        />
        </div>
      </div>
    </div>
  );
};

export default App;