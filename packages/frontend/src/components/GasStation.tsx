import React from 'react';
import Pump from './Pump';
import Queue from './Queue';
import { SimulationState } from '../types';
import { Socket } from 'socket.io-client';

interface Props {
  state: SimulationState;
  onSelectGasoline: (pumpId: number, gasolineType: string) => void;
  socket: Socket | null;
}

const GasStation: React.FC<Props> = ({ state, onSelectGasoline, socket }) => {
  return (
    <div className="gas-station">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gas Station</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {state.pumps.map(pump => (
          <Pump 
            key={pump.id} 
            pump={pump} 
            onSelectGasoline={onSelectGasoline}
            socket={socket}
          />
        ))}
      </div>
      <Queue vehicles={state.queue} />
    </div>
  );
};

export default GasStation;