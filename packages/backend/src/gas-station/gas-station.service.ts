import { Injectable } from '@nestjs/common';
import { SimulationState, Vehicle, Pump } from './types';
import { Subject } from 'rxjs';

@Injectable()
export class GasStationService {
  private state: SimulationState;
  private previousState: SimulationState;
  private totalWaitTime: number = 0;
  private simulationInterval: NodeJS.Timeout | null = null;
  public stateUpdates = new Subject<SimulationState>();
  public refuelingComplete = new Subject<{ pumpId: number; income: number }>();
  private isSimulationRunning: boolean = false;

  constructor() {
    this.resetSimulation();
  }

  selectGasoline(pumpId: number, gasolineType: string) {
    const pump = this.state.pumps.find((p) => p.id === pumpId);
    if (pump && pump.status === 'busy' && !pump.selectedGasoline) {
      pump.selectedGasoline = gasolineType;
      pump.status = 'fueling';
      this.stateUpdates.next({
        ...this.state,
        isSimulationRunning: this.isSimulationRunning,
      });
    }
  }

  startSimulation() {
    if (!this.simulationInterval) {
      this.isSimulationRunning = true;
      this.simulationInterval = setInterval(() => {
        this.updateSimulation();
        this.emitStateUpdate();
      }, 100);
      this.emitStateUpdate(); // Emit immediately after starting
    }
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
      this.isSimulationRunning = false;
      this.emitStateUpdate(); // Emit immediately after stopping
    }
  }

  resetSimulation() {
    this.state = {
      pumps: [
        { id: 1, status: 'idle', currentVehicle: null, selectedGasoline: null },
        { id: 2, status: 'idle', currentVehicle: null, selectedGasoline: null },
        { id: 3, status: 'idle', currentVehicle: null, selectedGasoline: null },
      ],
      queue: [],
      vehiclesServed: 0,
      carsServed: 0,
      trucksServed: 0,
      averageWaitTime: 0,
      totalRevenue: 0,
      isSimulationRunning: false,
      fuelDispensed: {
        regular: 0,
        midgrade: 0,
        premium: 0,
        diesel: 0,
      },
      fuelCapacity: {
        regular: 500,
        midgrade: 500,
        premium: 500,
        diesel: 500,
      },
      refillingFuels: {
        regular: 0,
        midgrade: 0,
        premium: 0,
        diesel: 0,
      },
      fuelPrices: {
        regular: 1.74,
        midgrade: 1.85,
        premium: 2.01,
        diesel: 1.68,
      },
    };
    this.totalWaitTime = 0;

    this.stateUpdates.next(this.state);
    this.emitStateUpdate();
  }

  getState(): SimulationState {
    return this.state;
  }

  private updateSimulation() {
    this.previousState = JSON.parse(JSON.stringify(this.state));

    // Add new vehicles to the queue
    if (this.state.queue.length < 9 && Math.random() < 0.03) {
      this.addVehicleToQueue();
    }

    // Process vehicles at pumps
    this.state.pumps.forEach((pump) => {
      if (pump.status === 'fueling' && pump.currentVehicle) {
        const fuelAmount = 1;

        if (pump.selectedGasoline) {
          const fuelType = pump.selectedGasoline
            .toLowerCase()
            .replace('-', '') as keyof typeof this.state.fuelDispensed &
            keyof typeof this.state.fuelCapacity;

          if (this.state.fuelCapacity[fuelType] <= 0) {
            this.state.fuelCapacity[fuelType] = 0;
            this.finishRefueling(pump, false); // Don't emit update for each pump
            return;
          }
          pump.currentVehicle.currentFuel += fuelAmount;
          this.state.fuelCapacity[fuelType] -= fuelAmount;
          this.state.fuelDispensed[fuelType] += fuelAmount;
        }
        if (
          pump.currentVehicle.currentFuel >= pump.currentVehicle.tankCapacity
        ) {
          this.finishRefueling(pump, false); // Don't emit update for each pump
        }
      }
    });

    // Update fueling progress
    this.state.pumps.forEach((pump) => {
      if (pump.status === 'busy' && pump.currentVehicle) {
        if (
          pump.currentVehicle.currentFuel >= pump.currentVehicle.tankCapacity
        ) {
          this.finishRefueling(pump);
        }
      }
    });

    this.state.pumps.forEach((pump) => {
      if (pump.status === 'idle') {
        this.startRefueling(pump.id, pump.selectedGasoline);
      }
    });

    // Move vehicles from queue to empty pumps
    const emptyPumps = this.state.pumps.filter(
      (pump) => pump.status === 'idle',
    );
    while (emptyPumps.length > 0 && this.state.queue.length > 0) {
      // Select a random empty pump
      const randomIndex = Math.floor(Math.random() * emptyPumps.length);
      const randomPump = emptyPumps[randomIndex];

      const vehicle = this.state.queue.shift();
      if (randomPump && vehicle) {
        randomPump.status = 'busy';
        randomPump.currentVehicle = vehicle;

        // Remove the selected pump from the emptyPumps array
        emptyPumps.splice(randomIndex, 1);
      }
    }

    this.handleRefillTank();

    // Check if state has changed
    if (this.hasStateChanged()) {
      this.stateUpdates.next({
        ...this.state,
        isSimulationRunning: this.isSimulationRunning,
      });
    }
  }

  private hasStateChanged(): boolean {
    return JSON.stringify(this.state) !== JSON.stringify(this.previousState);
  }

  private addVehicleToQueue() {
    const vehicleType = Math.random() < 0.7 ? 'Car' : 'Truck';
    const newVehicle: Vehicle = {
      id: Math.random().toString(36).substr(2, 9),
      type: vehicleType,
      currentFuel: 0,
      tankCapacity:
        vehicleType === 'Car'
          ? Math.floor(Math.random() * 40) + 15
          : Math.floor(Math.random() * 80) + 20,
      arrivalTime: Date.now(), // Add this line
    };

    this.state.queue.push(newVehicle);
  }

  handleRefillTank() {
    for (const fuelType in this.state.refillingFuels) {
      if (this.state.refillingFuels[fuelType] > 0) {
        const refillingAmountPerTick = 1;
        this.state.refillingFuels[fuelType] -= refillingAmountPerTick;
        this.state.fuelCapacity[fuelType] += refillingAmountPerTick;
      }
    }
  }

  refillFuel(amount: number, fuelType: string) {
    console.log('Refilling fuel:', amount, fuelType);
    this.state.refillingFuels[fuelType] += amount;
    this.state.totalRevenue -= 0.8 * amount * this.state.fuelPrices[fuelType];
  }

  startRefueling(
    pumpId: number | string,
    fuelType: string,
    // paymentMethod: string,
  ) {
    if (typeof pumpId === 'string') {
      pumpId = parseInt(pumpId);
    }
    const pump = this.state.pumps.find((p) => p.id === pumpId);
    if (pump && pump.status === 'busy' && pump.currentVehicle) {
      pump.selectedGasoline = fuelType;
      pump.status = 'fueling';

      this.stateUpdates.next({
        ...this.state,
        isSimulationRunning: this.isSimulationRunning,
      });
    }
  }

  private finishRefueling(pump: Pump, emitUpdate: boolean = true) {
    if (pump.currentVehicle) {
      this.state.vehiclesServed++;
      if (pump.currentVehicle.type === 'Car') {
        this.state.carsServed++;
      } else {
        this.state.trucksServed++;
      }

      const income =
        pump.currentVehicle.currentFuel *
        this.state.fuelPrices[
          pump.selectedGasoline.toLowerCase().replace('-', '')
        ];
      this.state.totalRevenue += income;

      // Update fuel dispensed
      console.log('Finishing refueling', pump.selectedGasoline);

      const waitTime = (Date.now() - pump.currentVehicle.arrivalTime) / 60000;
      this.totalWaitTime += waitTime;
      this.state.averageWaitTime =
        0.7 * this.state.averageWaitTime + 0.3 * waitTime;
      // this.state.averageWaitTime = this.totalWaitTime / this.state.vehiclesServed;

      pump.status = 'idle';
      pump.currentVehicle = null;
      pump.selectedGasoline = null;

      if (emitUpdate && this.hasStateChanged()) {
        this.stateUpdates.next(this.state);
      }
      this.refuelingComplete.next({ pumpId: pump.id, income: income });
    }
  }

  private emitStateUpdate() {
    this.stateUpdates.next({
      ...this.state,
      isSimulationRunning: this.isSimulationRunning,
    });
  }
}
