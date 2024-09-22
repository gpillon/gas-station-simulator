import React from 'react';
import { SimulationState } from '../types';
import { StatItem, RefillLink } from './StatisticsPanel';
import useWebSocket from '../hooks/useWebSocket';

interface Props {
  state: SimulationState;
  onClose: () => void;
}

const FuelStatisticsModal: React.FC<Props> = ({ state, onClose }) => {
  const { refillFuel } = useWebSocket();

  const handleRefill = (fuelType: string) => {
    refillFuel(1000, fuelType);
  };

  const getFuelColor = (capacity: number) => {
    if (capacity <= 0) return 'text-red-600';
    if (capacity < 400) return 'text-yellow-500';
    if (capacity >= 400) return 'text-green-700';
    return 'text-gray-900';
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50" id="fuel-modal">
      <div className="relative p-8 border w-full max-w-xl shadow-lg rounded-lg bg-white">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Fuel Statistics</h2>
        
        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Fuel Capacity (Liters)</h3>
        <div className="grid grid-cols-2 gap-6">
          <StatItem 
            title={<>Regular <RefillLink onClick={() => handleRefill('regular')} /></>}
            value={state.fuelCapacity.regular} 
            format={n => `${n.toFixed(2)} L`} 
            textColor={getFuelColor(state.fuelCapacity.regular)}
          />
          <StatItem 
            title={<>Mid-Grade <RefillLink onClick={() => handleRefill('midgrade')} /></>}
            value={state.fuelCapacity.midgrade} 
            format={n => `${n.toFixed(2)} L`} 
            textColor={getFuelColor(state.fuelCapacity.midgrade)}
          />
          <StatItem 
            title={<>Premium <RefillLink onClick={() => handleRefill('premium')} /></>}
            value={state.fuelCapacity.premium} 
            format={n => `${n.toFixed(2)} L`} 
            textColor={getFuelColor(state.fuelCapacity.premium)}
          />
          <StatItem 
            title={<>Diesel <RefillLink onClick={() => handleRefill('diesel')} /></>}
            value={state.fuelCapacity.diesel} 
            format={n => `${n.toFixed(2)} L`} 
            textColor={getFuelColor(state.fuelCapacity.diesel)}
          />
        </div>

        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Refilling (Liters)</h3>
        <div className="grid grid-cols-2 gap-6">
          <StatItem title="Regular" value={state.refillingFuels.regular} format={n => `${n.toFixed(2)} L`}  />
          <StatItem title="Mid-Grade" value={state.refillingFuels.midgrade} format={n => `${n.toFixed(2)} L`} />
          <StatItem title="Premium" value={state.refillingFuels.premium} format={n => `${n.toFixed(2)} L`} />
          <StatItem title="Diesel" value={state.refillingFuels.diesel} format={n => `${n.toFixed(2)} L`} />
        </div>

        <button
          className="mt-8 w-full px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FuelStatisticsModal;