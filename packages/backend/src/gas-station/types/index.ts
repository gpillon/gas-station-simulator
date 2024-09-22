export interface Vehicle {
  id: string;
  type: 'Car' | 'Truck';
  currentFuel: number;
  tankCapacity: number;
  arrivalTime: number;
  fuelType: 'Gas' | 'Diesel';
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
  carsServed: number;
  trucksServed: number;
  averageWaitTime: number;
  totalRevenue: number;
  isSimulationRunning: boolean;
  fuelDispensed: {
    regular: number;
    midgrade: number;
    premium: number;
    diesel: number;
  };
  fuelCapacity: {
    regular: number;
    midgrade: number;
    premium: number;
    diesel: number;
  };
  refillingFuels: {
    regular: number;
    midgrade: number;
    premium: number;
    diesel: number;
  };
  fuelPrices: {
    regular: number;
    midgrade: number;
    premium: number;
    diesel: number;
  };
}
