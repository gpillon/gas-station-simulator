export interface Vehicle {
    id: string;
    type: string;
    currentFuel: number;
    tankCapacity: number;
    arrivalTime: number;
  }
  
  export interface Pump {
    id: number;
    status: 'idle' | 'busy' | 'fueling';
    currentVehicle: Vehicle | null;
    selectedGasoline: string | null;
  }
  
  export interface SimulationState {
    pumps: Pump[];
    queue: Vehicle[];
    vehiclesServed: number;
    averageWaitTime: number;
    totalRevenue: number;
  }