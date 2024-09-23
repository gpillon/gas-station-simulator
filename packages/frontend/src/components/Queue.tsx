import React, { useEffect, useState } from 'react';
import Vehicle from './Vehicle';
import { SimulationState, Vehicle as VehicleType } from '../types';

interface Props {
  vehicles: VehicleType[];
  state: SimulationState;
}

const Queue: React.FC<Props> = ({ vehicles, state }) => {
  const [queueSize, setQueueSize] = useState(state.queueSize || 9);
  const [emptySlots, setEmptySlots] = useState(0);
  useEffect(() => {
    setQueueSize(state.queueSize || 9);
    setEmptySlots(Math.max(0, queueSize - vehicles.length));
  }, [state, queueSize, vehicles]);

  // const emptySlots = Math.max(0, queueSize - vehicles.length);

  return (
    <div className="queue mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Queue</h3>
      <div className="grid grid-cols-3 gap-4">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="h-16 w-full">
            <Vehicle vehicle={vehicle} />
          </div>
        ))}
        {[...Array(emptySlots)].map((_, index) => (
          <div 
            key={`empty-${index}`} 
            className="h-16 w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
          >
            <span className="text-gray-400">Empty</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Queue;