import React from 'react';
import { Vehicle as VehicleType } from '../types';

interface Props {
  vehicle: VehicleType;
}

const Vehicle: React.FC<Props> = ({ vehicle }) => {
  return (
    <div className="vehicle bg-gray-100 rounded-lg p-2 mb-2">
      <p className="text-sm text-gray-700">Type: {vehicle.type}</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${(vehicle.currentFuel / vehicle.tankCapacity) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Fuel: {vehicle.currentFuel}/{vehicle.tankCapacity}
      </p>
    </div>
  );
};

export default Vehicle;