import { Test, TestingModule } from '@nestjs/testing';
import { GasStationController } from './gas-station.controller';
import { GasStationService } from './gas-station.service';
import { SimulationState } from './types';

describe('GasStationController', () => {
  let controller: GasStationController;
  let service: GasStationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GasStationController],
      providers: [GasStationService],
    }).compile();

    controller = module.get<GasStationController>(GasStationController);
    service = module.get<GasStationService>(GasStationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPrices', () => {
    it('should return fuel prices', () => {
      const result = { regular: 1.5, midgrade: 1.7, premium: 1.9, diesel: 1.6 };
      jest.spyOn(service, 'getFuelPrices').mockImplementation(() => result);
      expect(controller.getPrices()).toBe(result);
    });
  });

  describe('updatePrices', () => {
    it('should update fuel prices', () => {
      const newPrices = { regular: 2.0, midgrade: 2.2 };
      const result = { ...newPrices, premium: 1.9, diesel: 1.6 };
      jest.spyOn(service, 'updateFuelPrices').mockImplementation(() => result);
      expect(controller.updatePrices(newPrices)).toBe(result);
    });
  });

  describe('getState', () => {
    it('should return the current state', () => {
      const state: SimulationState = {
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
      jest.spyOn(service, 'getState').mockImplementation(() => state);
      expect(controller.getState()).toBe(state);
    });
  });

  describe('processPayment', () => {
    it('should process payment successfully', async () => {
      const payment = { pumpId: 1, paymentId: 'abc123' };
      jest
        .spyOn(service, 'processPayment')
        .mockImplementation(() => ({ ok: true }));
      await expect(controller.processPayment(payment)).resolves.toEqual(
        payment,
      );
    });

    it('should throw BadRequestException for failed payment', async () => {
      const payment = { pumpId: 1, paymentId: 'abc123' };
      jest
        .spyOn(service, 'processPayment')
        .mockImplementation(() => ({ ok: false }));
      await expect(controller.processPayment(payment)).rejects.toThrow();
    });
  });
});
