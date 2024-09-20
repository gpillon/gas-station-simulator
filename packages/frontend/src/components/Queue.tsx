import React from 'react';
import Vehicle from './Vehicle';
import { Vehicle as VehicleType } from '../types';

interface Props {
  vehicles: VehicleType[];
}

const Queue: React.FC<Props> = ({ vehicles }) => {
  return (
    <div className="queue mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Queue</h3>
      {vehicles.length === 0 ? (
        <p className="text-gray-600">No vehicles in queue</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {vehicles.map(vehicle => (
            <Vehicle key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Queue;