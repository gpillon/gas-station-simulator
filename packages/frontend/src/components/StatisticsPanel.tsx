import React from 'react';
import { SimulationState } from '../types';

interface Props {
  state: SimulationState;
  onClose: () => void;
}

const StatisticsPanel: React.FC<Props> = ({ state, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50" id="my-modal">
      <div className="relative p-8 border w-full max-w-xl shadow-lg rounded-lg bg-white">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Detailed Statistics</h2>
        <div className="grid grid-cols-2 gap-6">
          <StatItem title="Vehicles Served" value={state.vehiclesServed} />
          <StatItem title="Cars Served" value={state.carsServed} />
          <StatItem title="Trucks Served" value={state.trucksServed} />
          <StatItem title="Average Wait Time" value={`${state.averageWaitTime.toFixed(2)} min`} />
          <StatItem title="Total Revenue" value={`${state.totalRevenue.toFixed(2)} €`} />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Fuel Dispensed (Liters)</h3>

        <div className="grid grid-cols-2 gap-6">
          <StatItem title="Regular" value={`${state.fuelDispensed.regular.toFixed(2)} L`} />
          <StatItem title="Mid-Grade" value={`${state.fuelDispensed.midgrade.toFixed(2)} L`} />
          <StatItem title="Premium" value={`${state.fuelDispensed.premium.toFixed(2)} L`} />
          <StatItem title="Diesel" value={`${state.fuelDispensed.diesel.toFixed(2)} L`} />
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

const StatItem: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="bg-gray-100 p-4 rounded-lg">
    <h4 className="text-sm font-medium text-gray-500 mb-1">{title}</h4>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

export default StatisticsPanel;