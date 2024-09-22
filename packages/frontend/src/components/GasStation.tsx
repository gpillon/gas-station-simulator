import React, { useState, useEffect } from 'react';
import Pump from './Pump';
import Queue from './Queue';
import { SimulationState } from '../types';
import { Socket } from 'socket.io-client';
import FuelStatisticsModal from './FuelStatisticsModal';

interface Props {
  state: SimulationState;
  onSelectGasoline: (pumpId: number, gasolineType: string) => void;
  socket: Socket | null;
}

const GasStation: React.FC<Props> = ({ state, onSelectGasoline, socket }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fuelStatus, setFuelStatus] = useState<'normal' | 'low' | 'empty'>('normal');

  useEffect(() => {
    const emptyFuel = Object.values(state.fuelCapacity).some(capacity => capacity <= 0);
    const lowFuel = Object.values(state.fuelCapacity).some(capacity => capacity < 400);

    if (emptyFuel) {
      setFuelStatus('empty');
    } else if (lowFuel) {
      setFuelStatus('low');
    } else {
      setFuelStatus('normal');
    }
  }, [state.fuelCapacity]);

  const getStatusColor = () => {
    switch (fuelStatus) {
      case 'empty':
        return 'text-red-600';
      case 'low':
        return 'text-yellow-500';
      default:
        return '';
    }
  };

  const getStatusText = () => {
    switch (fuelStatus) {
      case 'empty':
        return '(Out of Fuel!)';
      case 'low':
        return '(Low Fuel!)';
      default:
        return '';
    }
  };

  return (
    <div className="gas-station">
      <h2 
        className="text-2xl font-semibold mb-4 cursor-pointer hover:opacity-80 text-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        Gas Station{' '}
        {fuelStatus !== 'normal' && (
          <span className={getStatusColor()}>
            {getStatusText()}
          </span>
        )}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {state.pumps.map(pump => (
          <Pump 
            key={pump.id} 
            pump={pump} 
            onSelectGasoline={onSelectGasoline}
            socket={socket}
            fuelCapacity={state.fuelCapacity}
          />
        ))}
      </div>
      <Queue vehicles={state.queue} />
      {isModalOpen && (
        <FuelStatisticsModal 
          state={state} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default GasStation;