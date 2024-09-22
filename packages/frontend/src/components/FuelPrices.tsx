import React, { useState } from 'react';
import { AnimatedValue } from './StatisticsPanel';
import FuelPricesPanel from './FuelPricesPanel';

interface Props {
  prices: {
    [key: string]: number;
  };
}

const FuelPrices: React.FC<Props> = ({ prices }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="fuel-prices mt-8 bg-white shadow-md rounded-lg p-4">
      <h2 
        className="text-2xl font-semibold text-blue-600 mb-4 cursor-pointer hover:text-blue-800 transition-colors duration-300"
        onClick={() => setIsPanelOpen(true)}
      >
        Fuel Prices
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(prices).map(([fuelType, price]) => (
          <div key={fuelType} className="stat-item">
            <p className="text-sm text-gray-600">{fuelType}</p>
            <p className="text-2xl text-green-600 font-bold">
              <AnimatedValue value={price} format={n => n.toFixed(3)} />€/L
            </p>
          </div>
        ))}
      </div>
      {isPanelOpen && (
        <FuelPricesPanel 
          prices={prices}
          onClose={() => setIsPanelOpen(false)}
        />
      )}
    </div>
  );
};

export default FuelPrices;