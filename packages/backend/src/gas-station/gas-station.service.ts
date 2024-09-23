import { Injectable } from '@nestjs/common';
import {
  SimulationState,
  Vehicle,
  Pump,
  GasolineTypeT,
  SimulationSettings,
} from './types';
import { Subject } from 'rxjs';
import { UpdatePricesDto } from './dto/update-rpices.dto';
import { ProcessPaymentDto } from './dto/porcess-payment.dto';

@Injectable()
export class GasStationService {
  private state: SimulationState;
  private totalWaitTime: number = 0;
  private simulationInterval: NodeJS.Timeout | null = null;
  public stateUpdates = new Subject<Partial<SimulationState>>();
  public paymentUpdates = new Subject<ProcessPaymentDto>();
  public refuelingComplete = new Subject<{ pumpId: number; income: number }>();
  public isSimulationRunning: boolean = false;
  private previousState: SimulationState;
  private crudeOilPrice: number = 1.496;
  private simulationCycle: number = 1;
  private tickPerSecond: number = 10;
  public paymentsRequests: { pumpId: number; paymentId: string }[] = [];
  private gainOnEachFuelTypeRespectToCrudeOil = {
    regular: 1.1,
    midgrade: 1.2,
    premium: 1.3,
    diesel: 1.05,
  } as const;

  constructor() {
    this.resetSimulation();
    this.startSimulation();
  }

  getFuelPrices(): SimulationState['fuelPrices'] {
    return this.state.fuelPrices;
  }

  updateFuelPrices(prices: UpdatePricesDto): SimulationState['fuelPrices'] {
    this.state.fuelPrices = { ...this.state.fuelPrices, ...prices };
    return this.state.fuelPrices;
  }

  selectGasoline(pumpId: number, gasolineType: GasolineTypeT) {
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
      this.simulationInterval = setInterval(
        () => {
          this.updateSimulation();
          this.emitStateUpdate();
        },
        Math.round(1000 / this.tickPerSecond),
      );
      this.isSimulationRunning = true;
      this.state.isSimulationRunning = this.isSimulationRunning;
      this.emitStateUpdate(); // Emit immediately after starting
    }
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
      this.isSimulationRunning = false;
      this.state.isSimulationRunning = this.isSimulationRunning;
      this.emitStateUpdate(); // Emit immediately after stopping
    }
  }

  getSellBuyPrice(fuelType: GasolineTypeT, buy: boolean = false) {
    return parseFloat(
      (
        (buy ? 0.9 : 1.0) *
        this.crudeOilPrice *
        this.gainOnEachFuelTypeRespectToCrudeOil[fuelType]
      ).toFixed(3),
    );
  }

  getFuelBuyPrices(): SimulationState['fuelBuyPrices'] {
    const fuelBuyPrices = {
      regular: this.getSellBuyPrice('regular', true),
      midgrade: this.getSellBuyPrice('midgrade', true),
      premium: this.getSellBuyPrice('premium', true),
      diesel: this.getSellBuyPrice('diesel', true),
    };
    return fuelBuyPrices;
  }

  resetSimulation() {
    setImmediate(() => this.stopSimulation);
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
      isSimulationRunning: this.isSimulationRunning,
      vehiclesAutoRefill: false,
      tanksAutoRefill: false,
      autoAdjustPrices: false,
      vehiclesPerSecond: 0.3,
      chanchePerSecondOfVehicleStartRefill: 0.25,
      queueSize: 9,
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
        regular: 1.744,
        midgrade: 1.853,
        premium: 2.019,
        diesel: 1.687,
      },
      fuelBuyPrices: { ...this.getFuelBuyPrices() },
    } as const;
    this.previousState = { ...this.state };
    this.stateUpdates.next(this.state);
    this.emitStateUpdate(true);
  }

  getState(): SimulationState {
    return this.state;
  }

  private updateSimulation() {
    this.previousState = JSON.parse(JSON.stringify(this.state));

    // Add new vehicles to the queue
    if (
      this.state.queue.length < this.state.queueSize &&
      Math.random() < this.state.vehiclesPerSecond / this.tickPerSecond
    ) {
      this.addVehicleToQueue();
    }

    if (this.state.vehiclesAutoRefill) {
      this.state.pumps.forEach((pump) => {
        if (
          pump.status === 'busy' &&
          Math.random() <
            this.state.chanchePerSecondOfVehicleStartRefill / this.tickPerSecond
        ) {
          const current_fuel = pump.currentVehicle.currentFuel;
          const tank_capacity = pump.currentVehicle.tankCapacity;
          const fuel_needed = tank_capacity - current_fuel;
          if (fuel_needed > 0) {
            let fuelType: GasolineTypeT;
            if (pump.currentVehicle.fuelType === 'Diesel') {
              fuelType = 'diesel';
            } else if (pump.currentVehicle.fuelType === 'Gas') {
              const randomValue = Math.random();
              if (randomValue < 0.7) {
                fuelType = 'regular';
              } else if (randomValue < 0.9) {
                fuelType = 'midgrade';
              } else {
                fuelType = 'premium';
              }
            }
            this.startRefueling(pump.id, fuelType);
          }
        }
      });
    }

    // Refill tanks if they are below 400 units and no refilling is in progress
    if (this.state.tanksAutoRefill) {
      for (const fuelType in this.state.fuelCapacity) {
        if (
          this.state.fuelCapacity[fuelType] < 400 &&
          this.state.refillingFuels[fuelType] === 0
        ) {
          this.refillFuel(1000, fuelType);
        }
      }
    }

    if (this.simulationCycle % 100 === 0) {
      if (this.state.autoAdjustPrices) {
        for (const fuelType in this.state.fuelPrices) {
          this.state.fuelPrices[fuelType] = this.getSellBuyPrice(
            fuelType as GasolineTypeT,
          );
        }
      }
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

          // interrup if no fuel in Gas Station tank
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

    if (this.simulationCycle % 10 === 0) {
      let priceFluctuation = (Math.random() - 0.5) * 2; // Random value between -1 and 1
      const maxFluctuation = 0.05; // Maximum fluctuation of 25%
      if (this.crudeOilPrice < 1.1)
        priceFluctuation = Math.abs(priceFluctuation);
      if (this.crudeOilPrice > 2.1)
        priceFluctuation = Math.abs(priceFluctuation) * -1;

      this.crudeOilPrice *= 1 + priceFluctuation * maxFluctuation;
      this.state.fuelBuyPrices = { ...this.getFuelBuyPrices() };
    }

    const { changed, diffs } = this.getStateDiff();
    // Check if state has changed
    if (changed) {
      // console.log(`State has changed, ${i++}`, JSON.stringify(diffs));
      this.stateUpdates.next(diffs);
    }
    this.simulationCycle++;
  }

  private hasStateChanged(): boolean {
    return JSON.stringify(this.state) !== JSON.stringify(this.previousState);
  }

  private getStateDiff(): {
    changed: boolean;
    diffs: Partial<SimulationState>;
  } {
    const diffs: Partial<SimulationState> = {};
    let changed = false;

    for (const key in this.state) {
      if (Array.isArray(this.state[key])) {
        if (
          JSON.stringify(this.state[key]) !==
          JSON.stringify(this.previousState[key])
        ) {
          diffs[key] = this.state[key];
          changed = true;
        }
      } else if (
        typeof this.state[key] === 'object' &&
        this.state[key] !== null
      ) {
        const objectDiffs = {};
        let objectChanged = false;
        for (const subKey in this.state[key]) {
          if (this.state[key][subKey] !== this.previousState[key][subKey]) {
            objectDiffs[subKey] = this.state[key][subKey];
            objectChanged = true;
          }
        }
        if (objectChanged) {
          diffs[key] = objectDiffs;
          changed = true;
        }
      } else if (this.state[key] !== this.previousState[key]) {
        diffs[key] = this.state[key];
        changed = true;
      }
    }

    return { changed, diffs };
  }

  private addVehicleToQueue() {
    const vehicleType = Math.random() < 0.7 ? 'Car' : 'Truck';
    const newVehicle: Vehicle = {
      id: Math.random().toString(36).substring(2, 11),
      type: vehicleType,
      currentFuel: 0,
      tankCapacity:
        vehicleType === 'Car'
          ? Math.floor(Math.random() * 40) + 15
          : Math.floor(Math.random() * 80) + 20,
      arrivalTime: Date.now(), // Add this line
      fuelType:
        vehicleType === 'Car'
          ? Math.random() < 0.2
            ? 'Diesel'
            : 'Gas'
          : 'Diesel',
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
    this.stateUpdates.next(this.state);
  }

  refillFuel(amount: number, fuelType: string) {
    console.log('Refilling fuel:', amount, fuelType);
    this.state.refillingFuels[fuelType] += amount;
    this.state.totalRevenue -=
      0.8 * amount * this.state.fuelBuyPrices[fuelType];
    this.stateUpdates.next(this.state);
  }

  simulationSetings(settings: Partial<SimulationSettings>) {
    this.state = { ...this.state, ...settings };
    this.stateUpdates.next(this.state);
  }

  startRefueling(
    pumpId: number | string,
    fuelType: GasolineTypeT,
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

  public emitStateUpdate(force: boolean = false) {
    // console.log('Emitting state update', this.state);
    const { changed, diffs } = this.getStateDiff();
    if (force) {
      this.stateUpdates.next(this.state);
    } else if (changed) {
      this.stateUpdates.next(diffs);
    }
    // this.stateUpdates.next({
    //   ...this.state,
    //   isSimulationRunning: this.isSimulationRunning,
    // });
  }

  getAllPumps(): Pump[] {
    return this.state.pumps;
  }

  getPumpById(id: number): Pump {
    return this.state.pumps.find((p) => p.id === id);
  }

  createPump(): Pump {
    const newPump: Pump = {
      id: this.state.pumps.length + 1,
      status: 'idle',
      currentVehicle: null,
      selectedGasoline: null,
    };

    this.state.pumps.push(newPump);
    return newPump;
  }

  deletePump(id: number): void {
    this.state.pumps = this.state.pumps.filter((p) => p.id !== id);
  }

  processPayment(pumpId: number, paymentId: string): { ok: boolean } {
    if (
      this.paymentsRequests.some(
        (request) => request.paymentId === paymentId,
      ) &&
      this.paymentsRequests.some((request) => request.pumpId === pumpId)
    ) {
      this.paymentUpdates.next({ pumpId, paymentId });
      this.paymentsRequests = this.paymentsRequests.filter(
        (request) =>
          request.paymentId !== paymentId && request.pumpId !== pumpId,
      );
      return { ok: true };
    }
    return { ok: false };
  }
}
