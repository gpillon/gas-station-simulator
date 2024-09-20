export interface Vehicle {
    id: string;
    type: string;
    currentFuel: number;
    tankCapacity: number;
  }

  export interface Pump {
    id: number;
    status: 'idle' | 'busy' | 'fueling';
    currentVehicle: Vehicle | null;
    selectedGasoline: string | null;
}
  
  // ... other types remain the same
  export interface SimulationState {
    pumps: Pump[];
    queue: Vehicle[];
    vehiclesServed: number;
    averageWaitTime: number;
    totalRevenue: number;
  }