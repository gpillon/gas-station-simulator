import React, { useState } from 'react';
import Vehicle from './Vehicle';
import { Pump as PumpType } from '../types';
import PumpPanel from './PumpPanel';

// Import your images
import regularIcon from '../assets/images/regular.png';
import midGradeIcon from '../assets/images/midgrade.png';
import premiumIcon from '../assets/images/premium.png';
import dieselIcon from '../assets/images/diesel.png';
import { SimulationState } from '../types';
import { Socket } from 'socket.io-client';
import { getAvailableFuelTypes } from '../utils/availableFuelTypes';

interface Props {
  state: SimulationState;
  pump: PumpType;
  onSelectGasoline: (pumpId: number, gasolineType: string) => void;
  socket: Socket | null;
  fuelCapacity: { [key: string]: number };
}

const Pump: React.FC<Props> = ({ state, pump, onSelectGasoline, socket, fuelCapacity }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const gasolineTypes = [
    { name: 'Regular', icon: regularIcon, capacityKey: 'regular' },
    { name: 'MidGrade', icon: midGradeIcon, capacityKey: 'midgrade' },
    { name: 'Premium', icon: premiumIcon, capacityKey: 'premium' },
    { name: 'Diesel', icon: dieselIcon, capacityKey: 'diesel' },
  ];

  const isCompatibleFuel = (vehicleType: string, fuelType: string) => {
    return (vehicleType === 'Car') || (vehicleType === 'Truck' && fuelType === 'Diesel');
  };

  const getVehicleBackgroundColor = () => {
    if (pump.currentVehicle && pump.selectedGasoline) {
      return isCompatibleFuel(pump.currentVehicle.type, pump.selectedGasoline) ? 'bg-green-200' : 'bg-red-200';
    }
    return '';
  };

  const handleTitleClick = () => {
    if (pump.currentVehicle) {
      setIsPanelOpen(true);
    }
  };

  return (
    <>
      <div className="pump bg-white shadow-md rounded-lg p-4">
        <h3 
          className={`text-xl font-semibold text-center mb-2 ${
            pump.currentVehicle 
              ? 'text-blue-600 cursor-pointer hover:text-blue-800 transition-colors duration-300'
              : 'text-gray-400'
          }`}
          onClick={handleTitleClick}
        >
          Pump {pump.id}
        </h3>
        <hr className="border-t border-gray-300 mb-4" />
        <div className="h-16 mb-4">
          {pump.currentVehicle ? (
            <Vehicle vehicle={pump.currentVehicle} bgcolor={getVehicleBackgroundColor()}/>
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
              <div 
                className={`w-full aspect-square max-w-[500px] relative overflow-hidden rounded-md `}
              >
                <img 
                  src={gasolineTypes.find(type => type.name === pump.selectedGasoline)?.icon} 
                  alt={pump.selectedGasoline} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {gasolineTypes.map((type) => {
                const isFuelEmpty = fuelCapacity[type.capacityKey] <= 0;
                return (
                  <button
                    key={type.name}
                    onClick={() => pump.currentVehicle && !isFuelEmpty && onSelectGasoline(pump.id, type.name)}
                    className={`flex flex-col items-center w-full ${
                      !pump.currentVehicle || isFuelEmpty || !getAvailableFuelTypes(pump.currentVehicle).includes(type.name) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={(!pump.currentVehicle || isFuelEmpty || !getAvailableFuelTypes(pump.currentVehicle).includes(type.name))}
                  >
                    <div className={`relative aspect-square w-full overflow-hidden rounded-lg shadow-md transition duration-300 ease-in-out ${
                      !pump.currentVehicle || isFuelEmpty || !getAvailableFuelTypes(pump.currentVehicle).includes(type.name) ? 'grayscale' : 'hover:shadow-lg'
                    }`}>
                      <img 
                        src={type.icon} 
                        alt={type.name} 
                        className="w-full h-full object-cover"
                      />
                      {isFuelEmpty && (
                        <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">N/A</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {isPanelOpen && (
        <PumpPanel 
          gasStationState={state}
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