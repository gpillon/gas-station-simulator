import { Test, TestingModule } from '@nestjs/testing';
import { GasStationSimulationController } from './gas-station-simulation.controller';
import { GasStationService } from './gas-station.service';
import { SimulationState } from './types';

const zeroState: SimulationState = {
  pumps: [],
  queue: [],
  vehiclesServed: 0,
  carsServed: 0,
  trucksServed: 0,
  averageWaitTime: 0,
  totalRevenue: 0,
  fuelDispensed: {
    regular: 0,
    midgrade: 0,
    premium: 0,
    diesel: 0,
  },
  fuelCapacity: {
    regular: 0,
    midgrade: 0,
    premium: 0,
    diesel: 0,
  },
  refillingFuels: {
    regular: 0,
    midgrade: 0,
    premium: 0,
    diesel: 0,
  },
  fuelPrices: {
    regular: 0,
    midgrade: 0,
    premium: 0,
    diesel: 0,
  },
  fuelBuyPrices: {
    regular: 0,
    midgrade: 0,
    premium: 0,
    diesel: 0,
  },
  vehiclesAutoRefill: false,
  tanksAutoRefill: false,
  autoAdjustPrices: false,
  isSimulationRunning: false,
  queueSize: 0,
  vehiclesPerSecond: 0,
  chanchePerSecondOfVehicleStartRefill: 0,
};

describe('GasStationSimulationController', () => {
  let controller: GasStationSimulationController;
  let service: GasStationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GasStationSimulationController],
      providers: [GasStationService],
    }).compile();

    controller = module.get<GasStationSimulationController>(
      GasStationSimulationController,
    );
    service = module.get<GasStationService>(GasStationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('reset', () => {
    it('should reset the simulation', () => {
      const result: SimulationState = { ...zeroState };
      jest
        .spyOn(service, 'resetSimulation')
        .mockImplementation(() => undefined);
      jest.spyOn(service, 'getState').mockImplementation(() => result);
      expect(controller.reset()).toBe(result);
    });
  });

  describe('start', () => {
    it('should start the simulation', () => {
      const result: SimulationState = { ...zeroState };

      jest
        .spyOn(service, 'startSimulation')
        .mockImplementation(() => undefined);
      jest.spyOn(service, 'getState').mockImplementation(() => result);
      expect(controller.start()).toBe(result);
    });
  });

  describe('stop', () => {
    it('should stop the simulation', () => {
      const result: SimulationState = { ...zeroState };
      jest.spyOn(service, 'stopSimulation').mockImplementation(() => undefined);
      jest.spyOn(service, 'getState').mockImplementation(() => result);
      expect(controller.stop()).toBe(result);
    });
  });

  describe('setSettings', () => {
    it('should set simulation settings', () => {
      const settings = { vehiclesAutoRefill: true };
      const result: SimulationState = { ...zeroState };
      jest
        .spyOn(service, 'simulationSetings')
        .mockImplementation(() => undefined);
      jest.spyOn(service, 'getState').mockImplementation(() => result);
      expect(controller.setSettings(settings)).toBe(result);
    });
  });
});
