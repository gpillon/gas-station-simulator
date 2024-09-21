import React, { useState } from 'react';
import Vehicle from './Vehicle';
import { Pump as PumpType } from '../types';
import PumpPanel from './PumpPanel';

// Import your images
import regularIcon from '../assets/images/regular.png';
import midGradeIcon from '../assets/images/midgrade.png';
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
    { name: 'MidGrade', icon: midGradeIcon },
    { name: 'Premium', icon: premiumIcon },
    { name: 'Diesel', icon: dieselIcon },
  ];

  return (
    <>
      <div className="pump bg-white shadow-md rounded-lg p-4">
        <h3 
          className="text-xl font-semibold text-center text-blue-600 mb-2 cursor-pointer hover:text-blue-800 transition-colors duration-300"
          onClick={() => setIsPanelOpen(true)}
        >
          Pump {pump.id}
        </h3>
        <hr className="border-t border-gray-300 mb-4" />
        <div className="h-16 mb-4"> {/* Reduced height from h-24 to h-16 */}
          {pump.currentVehicle ? (
            <Vehicle vehicle={pump.currentVehicle} />
          ) : (
            <div className="h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No vehicle</span>
            </div>
          )}
        </div>
        <p className={`text-sm font-medium ${pump.status === 'idle' ? 'text-green-500' : 'text-yellow-500'}`}>
          Status: {pump.status}
        </p>
        <div className="gasoline-selection mt-4">
          {pump.status === 'fueling' && pump.selectedGasoline ? (
            <div className="flex justify-center">
              <div className="w-24 h-24 relative overflow-hidden rounded-md">
                <img 
                  src={gasolineTypes.find(type => type.name === pump.selectedGasoline)?.icon} 
                  alt={pump.selectedGasoline} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {gasolineTypes.map((type) => (
                <button
                  key={type.name}
                  onClick={() => pump.currentVehicle && onSelectGasoline(pump.id, type.name)}
                  className={`flex flex-col items-center ${!pump.currentVehicle ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!pump.currentVehicle}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                    <img 
                      src={type.icon} 
                      alt={type.name} 
                      className={`w-full h-full object-cover ${!pump.currentVehicle ? 'grayscale' : ''}`}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
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