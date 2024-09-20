import React, { useState } from 'react';
import Vehicle from './Vehicle';
import { Pump as PumpType } from '../types';
import PumpPanel from './PumpPanel';

// Import your images
import regularIcon from '../assets/images/regular.png';
import midGradeIcon from '../assets/images/mid-grade.png';
import premiumIcon from '../assets/images/premium.png';
import dieselIcon from '../assets/images/diesel.png';

interface Props {
  pump: PumpType;
  onSelectGasoline: (pumpId: number, gasolineType: string) => void;
  socket: any; // Replace 'any' with the correct socket type
}

const Pump: React.FC<Props> = ({ pump, onSelectGasoline, socket }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const gasolineTypes = [
    { name: 'Regular', icon: regularIcon },
    { name: 'Mid-Grade', icon: midGradeIcon },
    { name: 'Premium', icon: premiumIcon },
    { name: 'Diesel', icon: dieselIcon },
  ];

  return (
    <>
      <div className="pump bg-white shadow-md rounded-lg p-4">
        <h3 
          className="text-xl font-semibold text-center text-blue-600 mb-4 cursor-pointer hover:text-blue-800 transition-colors duration-300"
          onClick={() => setIsPanelOpen(true)}
        >
          Pump {pump.id}
        </h3>
        {pump.currentVehicle && <Vehicle vehicle={pump.currentVehicle} />}
        <p className={`text-sm font-medium ${pump.status === 'idle' ? 'text-green-500' : 'text-yellow-500'}`}>
          Status: {pump.status}
        </p>
        {pump.status === 'busy' && !pump.selectedGasoline && (
          <div className="gasoline-selection mt-4">
            <div className="grid grid-cols-2 gap-4">
              {gasolineTypes.map((type) => (
                <button
                  key={type.name}
                  onClick={() => onSelectGasoline(pump.id, type.name)}
                  className="flex flex-col items-center"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                    <img 
                      src={type.icon} 
                      alt={type.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {pump.status === 'fueling' && pump.selectedGasoline && (
          <div className="mt-4 flex flex-col items-center">
            <div className="w-24 h-24 relative overflow-hidden rounded-md">
              <img 
                src={gasolineTypes.find(type => type.name === pump.selectedGasoline)?.icon} 
                alt={pump.selectedGasoline} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
      {isPanelOpen && (
        <PumpPanel 
          pumpId={pump.id} 
          socket={socket} 
          onClose={() => setIsPanelOpen(false)}
          gasolineTypes={gasolineTypes}
          initialStatus={pump.status}
          selectedGasoline={pump.selectedGasoline}
        />
      )}
    </>
  );
};

export default Pump;