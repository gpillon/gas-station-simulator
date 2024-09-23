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
  selectedGasoline: ['regular', 'midgrade', 'premium', 'diesel'][number];
}

export const GasolineType = [
  'regular',
  'midgrade',
  'premium',
  'diesel',
] as const;
export type GasolineTypeT = (typeof GasolineType)[number];

export type SimulationSettings = {
  vehiclesAutoRefill: boolean;
  tanksAutoRefill: boolean;
  autoAdjustPrices: boolean;
  isSimulationRunning: boolean;
  queueSize: number;
  vehiclesPerSecond: number;
  chanchePerSecondOfVehicleStartRefill: number;
};

export interface SimulationState extends SimulationSettings {
  pumps: Pump[];
  queue: Vehicle[];
  vehiclesServed: number;
  carsServed: number;
  trucksServed: number;
  averageWaitTime: number;
  totalRevenue: number;
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
  fuelBuyPrices: {
    regular: number;
    midgrade: number;
    premium: number;
    diesel: number;
  };
}
