import { Injectable } from '@nestjs/common';
import { SimulationState, Vehicle, Pump } from './types';
import { Subject } from 'rxjs';

@Injectable()
export class GasStationService {
  private state: SimulationState;
  private totalWaitTime: number = 0;
  private simulationInterval: NodeJS.Timeout | null = null;
  public stateUpdates = new Subject<SimulationState>();

  constructor() {
    this.resetSimulation();
  }

  selectGasoline(pumpId: number, gasolineType: string) {
    const pump = this.state.pumps.find(p => p.id === pumpId);
    if (pump && pump.status === 'busy' && !pump.selectedGasoline) {
      pump.selectedGasoline = gasolineType;
      pump.status = 'fueling';
      this.stateUpdates.next(this.state);
    }
  }

  startSimulation() {
    if (!this.simulationInterval) {
      this.simulationInterval = setInterval(() => {
        this.updateSimulation();
        this.stateUpdates.next(this.state);
      }, 100);
    }
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
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
      averageWaitTime: 0,
      totalRevenue: 0,
    };
    this.totalWaitTime = 0;

    this.stateUpdates.next(this.state);
  }

  getState(): SimulationState {
    return this.state;
  }

  private updateSimulation() {
    // Add new vehicles to the queue
    if (this.state.queue.length < 12 && Math.random() < 0.03) {
      this.addVehicleToQueue();
    }

    // Process vehicles at pumps
    this.state.pumps.forEach(pump => {
    if (pump.status === 'fueling' && pump.currentVehicle) {
        pump.currentVehicle.currentFuel += 1;
        if (pump.currentVehicle.currentFuel >= pump.currentVehicle.tankCapacity) {
            this.finishVehicle(pump);
        }
    } 
    });

    // Update fueling progress
    this.state.pumps.forEach(pump => {
        if (pump.status === 'busy' && pump.currentVehicle) {
            if (pump.currentVehicle.currentFuel >= pump.currentVehicle.tankCapacity) {
              this.finishVehicle(pump);
            }
          }
    });


    this.state.pumps.forEach(pump => {
      if (pump.status === 'idle') {
        this.startFueling(pump);
      }
    });

    // Move vehicles from queue to empty pumps
    const emptyPumps = this.state.pumps.filter(pump => pump.status === 'idle');
    while (emptyPumps.length > 0 && this.state.queue.length > 0) {
      const pump = emptyPumps.pop();
      const vehicle = this.state.queue.shift();
      if (pump && vehicle) {
        pump.status = 'busy';
        pump.currentVehicle = vehicle;
      }
    }
  }

  private addVehicleToQueue() {
    const vehicleType = Math.random() < 0.7 ? 'Car' : 'Truck';
    const newVehicle: Vehicle = {
      id: Math.random().toString(36).substr(2, 9),
      type: vehicleType,
      currentFuel: 0,
      tankCapacity: vehicleType === 'Car' ? Math.floor(Math.random() * 40) + 15 : Math.floor(Math.random() * 80) + 20,
      arrivalTime: Date.now(), // Add this line
    };

    this.state.queue.push(newVehicle);
  }

  private finishVehicle(pump: Pump) {
    if (pump.currentVehicle) {
      this.state.vehiclesServed++;
      this.state.totalRevenue += pump.currentVehicle.tankCapacity * 1.74; // Assuming $2 per unit of fuel
      pump.status = 'idle';
      pump.currentVehicle = null;
      pump.selectedGasoline = null;
    }
  }

  private startFueling(pump: Pump) {
    if (this.state.queue.length > 0) {
      const vehicle = this.state.queue.shift();
      if (vehicle) {
        const waitTime = (Date.now() - vehicle.arrivalTime) / 60000; // Convert to minutes
        this.totalWaitTime += waitTime;
        this.state.averageWaitTime =  this.state.vehiclesServed ? this.totalWaitTime / this.state.vehiclesServed : 0;
  
        console.log(`Vehicle ${vehicle.id} started fueling:`);
        console.log(`  Wait time: ${waitTime.toFixed(2)} minutes`);
        console.log(`  Total wait time: ${this.totalWaitTime.toFixed(2)} minutes`);
        console.log(`  Vehicles served: ${this.state.vehiclesServed}`);
        console.log(`  New average wait time: ${this.state.averageWaitTime.toFixed(2)} minutes`);
        console.log(`  Total revenue: ${this.state.totalRevenue.toFixed(2)}`);

        pump.status = 'busy';
        pump.currentVehicle = vehicle;
      }
    }
  }

  startRefueling(pumpId: number | string, fuelType: string, paymentMethod: string) {
    if (typeof pumpId === 'string') {
        pumpId = parseInt(pumpId);
    }
    const pump = this.state.pumps.find(p => p.id === pumpId);
    if (pump && pump.status === 'busy' && pump.currentVehicle) {
      pump.selectedGasoline = fuelType;
      pump.status = 'fueling';
      
      // Simulate refueling process
      setTimeout(() => {
        this.finishRefueling(pump);
      }, 5000); // 5 seconds for demonstration, adjust as needed

      this.stateUpdates.next(this.state);
    }
  }

  private finishRefueling(pump: Pump) {
    if (pump.currentVehicle) {
      this.state.vehiclesServed++;
      this.state.totalRevenue += (pump.currentVehicle.tankCapacity) * 1.74; // Assuming $2 per unit of fuel
      pump.status = 'idle';
      pump.currentVehicle = null;
      pump.selectedGasoline = null;
      this.stateUpdates.next(this.state);
    }
    
  }
}