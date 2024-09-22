import React, { useState } from 'react';
import { getBackendHost } from '../utils/getBackendUrls';

interface Props {
  prices: {
    [key: string]: number;
  };
  onClose: () => void;
}

const FuelPricesPanel: React.FC<Props> = ({ prices, onClose }) => {
  const [newPrices, setNewPrices] = useState(prices);
  const api_url = getBackendHost().api_url;
  const handlePriceChange = (fuelType: string, value: string) => {
    setNewPrices(prev => ({
      ...prev,
      [fuelType]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api_url}/api/gas-station/prices`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrices),
      });

      if (!response.ok) {
        throw new Error('Failed to update fuel prices');
      }

      onClose();
    } catch (error) {
      console.error('Error updating fuel prices:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative p-8 border w-full max-w-md shadow-lg rounded-lg bg-white">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Fuel Prices</h2>
        <form onSubmit={handleSubmit}>
          {Object.entries(newPrices).map(([fuelType, price]) => (
            <div key={fuelType} className="mb-4">
              <label htmlFor={fuelType} className="block text-sm font-medium text-gray-700">{fuelType}</label>
              <input
                type="number"
                id={fuelType}
                name={fuelType}
                value={price}
                onChange={(e) => handlePriceChange(fuelType, e.target.value)}
                step="0.001"
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          ))}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FuelPricesPanel;