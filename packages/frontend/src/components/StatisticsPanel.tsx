import React from 'react';
import { SimulationState } from '../types';

interface StatisticsPanelProps {
  state: SimulationState;
  onClose: () => void;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ state, onClose }) => {
  const totalVehicles = state.vehiclesServed;
  const cars = state.vehiclesServed * 0.7; // Assuming 70% are cars based on previous logic
  const trucks = state.vehiclesServed * 0.3; // Assuming 30% are trucks
  const totalFuel = state.totalRevenue / 1.74; // Assuming $1.74 per unit of fuel

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Gas Station Statistics</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <StatItem title="Total Vehicles Served" value={totalVehicles} />
          <StatItem title="Cars Served" value={Math.round(cars)} />
          <StatItem title="Trucks Served" value={Math.round(trucks)} />
          <StatItem title="Total Fuel Dispensed" value={`${totalFuel.toFixed(2)} liters`} />
          <StatItem title="Average Wait Time" value={`${state.averageWaitTime.toFixed(2)} minutes`} />
          <StatItem title="Total Revenue" value={`$${state.totalRevenue.toFixed(2)}`} />
        </div>
      </div>
    </div>
  );
};

const StatItem: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="bg-gray-100 p-4 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-2xl font-bold text-blue-600">{value}</p>
  </div>
);

export default StatisticsPanel;