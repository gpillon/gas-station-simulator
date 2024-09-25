import { Test, TestingModule } from '@nestjs/testing';
import { GasStationService } from './gas-station.service';
import { GasolineTypeT, Vehicle } from './types';

describe('GasStationService', () => {
  let service: GasStationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GasStationService],
    }).compile();

    service = module.get<GasStationService>(GasStationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFuelPrices', () => {
    it('should return fuel prices', () => {
      const prices = service.getFuelPrices();
      expect(prices).toHaveProperty('regular');
      expect(prices).toHaveProperty('midgrade');
      expect(prices).toHaveProperty('premium');
      expect(prices).toHaveProperty('diesel');
      expect(typeof prices.regular).toBe('number');
      expect(typeof prices.midgrade).toBe('number');
      expect(typeof prices.premium).toBe('number');
      expect(typeof prices.diesel).toBe('number');
    });
  });

  describe('updateFuelPrices', () => {
    it('should update fuel prices', () => {
      const newPrices = { regular: 2.0, midgrade: 2.2 };
      const updatedPrices = service.updateFuelPrices(newPrices);
      expect(updatedPrices.regular).toBe(2.0);
      expect(updatedPrices.midgrade).toBe(2.2);
      expect(updatedPrices.premium).toBe(service.getFuelPrices().premium);
      expect(updatedPrices.diesel).toBe(service.getFuelPrices().diesel);
    });
  });

  describe('selectGasoline', () => {
    it('should select gasoline for a busy pump', () => {
      const pumpId = 1;
      const gasolineType: GasolineTypeT = 'regular';
      service['state'].pumps[0].status = 'busy';
      service.selectGasoline(pumpId, gasolineType);
      expect(service['state'].pumps[0].selectedGasoline).toBe(gasolineType);
      expect(service['state'].pumps[0].status).toBe('fueling');
    });

    it('should not select gasoline for an idle pump', () => {
      const pumpId = 1;
      const gasolineType: GasolineTypeT = 'regular';
      service['state'].pumps[0].status = 'idle';
      service.selectGasoline(pumpId, gasolineType);
      expect(service['state'].pumps[0].selectedGasoline).toBeNull();
      expect(service['state'].pumps[0].status).toBe('idle');
    });
  });

  describe('startSimulation and stopSimulation', () => {
    it('should start and stop the simulation', () => {
      service.startSimulation();
      expect(service.isSimulationRunning).toBe(true);
      expect(service['simulationInterval']).toBeDefined();
      expect(service['state'].isSimulationRunning).toBe(true);

      service.stopSimulation();
      expect(service.isSimulationRunning).toBe(false);
      expect(service['simulationInterval']).toBeNull();
      expect(service['state'].isSimulationRunning).toBe(false);
    });
  });

  describe('getSellBuyPrice', () => {
    it('should return correct sell price', () => {
      const sellPrice = service.getSellBuyPrice('regular');
      expect(sellPrice).toBeGreaterThan(0);
      expect(sellPrice).toBeGreaterThan(
        service.getSellBuyPrice('regular', true),
      );
    });

    it('should return correct buy price', () => {
      const buyPrice = service.getSellBuyPrice('regular', true);
      expect(buyPrice).toBeGreaterThan(0);
      expect(buyPrice).toBeLessThan(service.getSellBuyPrice('regular'));
    });
  });

  describe('getFuelBuyPrices', () => {
    it('should return buy prices for all fuel types', () => {
      const buyPrices = service.getFuelBuyPrices();
      expect(buyPrices).toHaveProperty('regular');
      expect(buyPrices).toHaveProperty('midgrade');
      expect(buyPrices).toHaveProperty('premium');
      expect(buyPrices).toHaveProperty('diesel');
      expect(buyPrices.regular).toBeLessThan(service.getFuelPrices().regular);
      expect(buyPrices.midgrade).toBeLessThan(service.getFuelPrices().midgrade);
      expect(buyPrices.premium).toBeLessThan(service.getFuelPrices().premium);
      expect(buyPrices.diesel).toBeLessThan(service.getFuelPrices().diesel);
    });
  });

  describe('resetSimulation', () => {
    it('should reset the simulation state', () => {
      service.resetSimulation();
      const state = service.getState();
      expect(state.vehiclesServed).toBe(0);
      expect(state.carsServed).toBe(0);
      expect(state.trucksServed).toBe(0);
      expect(state.totalRevenue).toBe(0);
      expect(state.pumps.length).toBe(3);
      expect(state.queue.length).toBe(0);
      expect(state.fuelCapacity.regular).toBe(500);
      expect(state.fuelCapacity.midgrade).toBe(500);
      expect(state.fuelCapacity.premium).toBe(500);
      expect(state.fuelCapacity.diesel).toBe(500);
    });
  });

  describe('getState', () => {
    it('should return the current simulation state', () => {
      const state = service.getState();
      expect(state).toHaveProperty('pumps');
      expect(state).toHaveProperty('queue');
      expect(state).toHaveProperty('vehiclesServed');
      expect(state).toHaveProperty('totalRevenue');
      expect(state).toHaveProperty('fuelPrices');
      expect(state).toHaveProperty('fuelCapacity');
      expect(state).toHaveProperty('fuelDispensed');
    });
  });

  describe('refillFuel', () => {
    it('should refill fuel and update state', () => {
      const initialCapacity = service['state'].refillingFuels.regular;
      const initialRevenue = service['state'].totalRevenue;
      const refillAmount = 100;
      service.refillFuel(refillAmount, 'regular');
      expect(service['state'].refillingFuels.regular).toBe(refillAmount);
      expect(service['state'].totalRevenue).toBeLessThan(initialRevenue);
      expect(service['state'].totalRevenue).toBe(
        initialRevenue -
          0.8 * refillAmount * service['state'].fuelBuyPrices.regular,
      );
      expect(service['state'].refillingFuels.regular).toBe(
        initialCapacity + refillAmount,
      );
    });
  });

  describe('simulationSettings', () => {
    it('should update simulation settings', () => {
      const newSettings = {
        vehiclesAutoRefill: true,
        tanksAutoRefill: true,
        vehiclesPerSecond: 0.5,
        queueSize: 15,
      };
      service.simulationSetings(newSettings);
      const state = service.getState();
      expect(state.vehiclesAutoRefill).toBe(true);
      expect(state.tanksAutoRefill).toBe(true);
      expect(state.vehiclesPerSecond).toBe(0.5);
      expect(state.queueSize).toBe(15);
    });
  });

  describe('startRefueling', () => {
    it('should start refueling for a busy pump', () => {
      const pumpId = 1;
      const fuelType: GasolineTypeT = 'regular';
      const vehicle: Vehicle = {
        id: '1',
        type: 'Car',
        currentFuel: 0,
        tankCapacity: 50,
        arrivalTime: Date.now(),
        fuelType: 'Gas',
      };
      service['state'].pumps[0].status = 'busy';
      service['state'].pumps[0].currentVehicle = vehicle;
      service.startRefueling(pumpId, fuelType);
      expect(service['state'].pumps[0].selectedGasoline).toBe(fuelType);
      expect(service['state'].pumps[0].status).toBe('fueling');
    });

    it('should not start refueling for an idle pump', () => {
      const pumpId = 1;
      const fuelType: GasolineTypeT = 'regular';
      service['state'].pumps[0].status = 'idle';
      service['state'].pumps[0].currentVehicle = null;
      service.startRefueling(pumpId, fuelType);
      expect(service['state'].pumps[0].selectedGasoline).toBeNull();
      expect(service['state'].pumps[0].status).toBe('idle');
    });
  });

  describe('getAllPumps', () => {
    it('should return all pumps', () => {
      const pumps = service.getAllPumps();
      expect(pumps.length).toBe(3);
      expect(pumps[0]).toHaveProperty('id');
      expect(pumps[0]).toHaveProperty('status');
      expect(pumps[0]).toHaveProperty('currentVehicle');
      expect(pumps[0]).toHaveProperty('selectedGasoline');
    });
  });

  describe('getPumpById', () => {
    it('should return a pump by id', () => {
      const pump = service.getPumpById(1);
      expect(pump).toBeDefined();
      expect(pump.id).toBe(1);
      expect(pump).toHaveProperty('status');
      expect(pump).toHaveProperty('currentVehicle');
      expect(pump).toHaveProperty('selectedGasoline');
    });

    it('should return undefined for non-existent pump id', () => {
      const pump = service.getPumpById(999);
      expect(pump).toBeUndefined();
    });
  });

  describe('createPump', () => {
    it('should create a new pump', () => {
      const initialPumpCount = service['state'].pumps.length;
      const newPump = service.createPump();
      expect(service['state'].pumps.length).toBe(initialPumpCount + 1);
      expect(newPump.id).toBe(initialPumpCount + 1);
      expect(newPump.status).toBe('idle');
      expect(newPump.currentVehicle).toBeNull();
      expect(newPump.selectedGasoline).toBeNull();
    });
  });

  describe('deletePump', () => {
    it('should delete a pump', () => {
      const initialPumpCount = service['state'].pumps.length;
      service.deletePump(1);
      expect(service['state'].pumps.length).toBe(initialPumpCount - 1);
      expect(service['state'].pumps.find((p) => p.id === 1)).toBeUndefined();
    });
  });

  describe('processPayment', () => {
    it('should process a valid payment', () => {
      const pumpId = 1;
      const paymentId = 'test123';
      service['paymentsRequests'] = [{ pumpId, paymentId }];
      const result = service.processPayment(pumpId, paymentId);
      expect(result.ok).toBe(true);
      expect(service['paymentsRequests'].length).toBe(0);
    });

    it('should reject an invalid payment', () => {
      const result = service.processPayment(999, 'invalid');
      expect(result.ok).toBe(false);
    });
  });

  describe('updateSimulation', () => {
    it('should update the simulation state', () => {
      const initialState = JSON.parse(JSON.stringify(service['state']));
      service.startSimulation();
      service.refillFuel(100, 'regular');
      service['updateSimulation']();
      expect(
        service.stateUpdates.subscribe((state) => {
          Reflect.deleteProperty(state, 'isSimulationRunning');
          Reflect.deleteProperty(initialState, 'isSimulationRunning');
          expect(state).not.toEqual(initialState);
          service.stopSimulation();
        }),
      );
    });
  });

  describe('addVehicleToQueue', () => {
    it('should add a vehicle to the queue', () => {
      const initialQueueLength = service['state'].queue.length;
      service['addVehicleToQueue']();
      expect(service['state'].queue.length).toBe(initialQueueLength + 1);
      const addedVehicle =
        service['state'].queue[service['state'].queue.length - 1];
      expect(addedVehicle).toHaveProperty('id');
      expect(addedVehicle).toHaveProperty('type');
      expect(addedVehicle).toHaveProperty('currentFuel');
      expect(addedVehicle).toHaveProperty('tankCapacity');
      expect(addedVehicle).toHaveProperty('arrivalTime');
      expect(addedVehicle).toHaveProperty('fuelType');
    });
  });

  describe('handleRefillTank', () => {
    it('should refill tanks', () => {
      service['state'].refillingFuels.regular = 10;
      const initialCapacity = service['state'].fuelCapacity.regular;
      service.handleRefillTank();
      expect(service['state'].refillingFuels.regular).toBe(9);
      expect(service['state'].fuelCapacity.regular).toBe(initialCapacity + 1);
    });
  });
});
