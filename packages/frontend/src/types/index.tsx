export interface Vehicle {
    id: string;
    type: string;
    currentFuel: number;
    tankCapacity: number;
    fuelType: "Gas" | "Diesel";
  }

  export interface Pump {
    id: number;
    status: 'idle' | 'busy' | 'fueling';
    currentVehicle: Vehicle | null;
    selectedGasoline: string | null;
}

export interface SimulationSettings {
    vehiclesAutoRefill: boolean;
    tanksAutoRefill: boolean;
    autoAdjustPrices: boolean;
    chanchePerSecondOfVehicleStartRefill: number;
    queueSize: number;
    vehiclesPerSecond: number;
  }
  
  // ... other types remain the same
  export interface SimulationState extends SimulationSettings {
    pumps: Pump[];
    queue: Vehicle[];
    vehiclesServed: number;
    carsServed: number;
    trucksServed: number;
    averageWaitTime: number;
    totalRevenue: number;
    queueSize: number;
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
    fuelBuyPrices: {
      regular: number;
      midgrade: number;
      premium: number;
      diesel: number;
    };
  }