import { Test, TestingModule } from '@nestjs/testing';
import { GasStationGateway } from './gas-station.gateway';
import { GasStationService } from './gas-station.service';
import { Socket } from 'socket.io';
import { Subject } from 'rxjs';

describe('GasStationGateway', () => {
  let gateway: GasStationGateway;
  let gasStationService: GasStationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GasStationGateway,
        {
          provide: GasStationService,
          useValue: {
            stateUpdates: new Subject(),
            refuelingComplete: new Subject(),
            paymentUpdates: new Subject(),
            getState: jest.fn().mockReturnValue({}),
            isSimulationRunning: false,
            selectGasoline: jest.fn(),
            startSimulation: jest.fn(),
            stopSimulation: jest.fn(),
            resetSimulation: jest.fn(),
            startRefueling: jest.fn(),
            refillFuel: jest.fn(),
            simulationSetings: jest.fn(),
            paymentsRequests: [],
          },
        },
      ],
    }).compile();

    gateway = module.get<GasStationGateway>(GasStationGateway);
    gasStationService = module.get<GasStationService>(GasStationService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should emit state update on connection', () => {
      const mockClient = { id: 'test', emit: jest.fn() } as unknown as Socket;
      gateway.handleConnection(mockClient);
      expect(mockClient.emit).toHaveBeenCalledWith(
        'stateUpdate',
        expect.any(Object),
      );
    });
  });

  describe('handleSelectGasoline', () => {
    it('should call selectGasoline on service', () => {
      const payload = { pumpId: 1, gasolineType: 'regular' as const };
      gateway.handleSelectGasoline({} as Socket, payload);
      expect(gasStationService.selectGasoline).toHaveBeenCalledWith(
        payload.pumpId,
        payload.gasolineType,
      );
    });
  });

  describe('handleCommand', () => {
    it('should start simulation on START command', () => {
      gateway.handleCommand({} as Socket, 'START');
      expect(gasStationService.startSimulation).toHaveBeenCalled();
    });

    it('should stop simulation on STOP command', () => {
      gateway.handleCommand({} as Socket, 'STOP');
      expect(gasStationService.stopSimulation).toHaveBeenCalled();
    });

    it('should reset simulation on RESET command', () => {
      gateway.handleCommand({} as Socket, 'RESET');
      expect(gasStationService.resetSimulation).toHaveBeenCalled();
    });
  });

  describe('handleStartRefueling', () => {
    it('should call startRefueling on service', () => {
      const payload = {
        pumpId: '1',
        fuelType: 'regular' as const,
        paymentMethod: 'card',
      };
      gateway.handleStartRefueling({} as Socket, payload);
      expect(gasStationService.startRefueling).toHaveBeenCalledWith(
        1,
        payload.fuelType,
      );
    });
  });

  describe('handleRefillFuel', () => {
    it('should call refillFuel on service', () => {
      const payload = { amount: 100, gasolineType: 'regular' };
      gateway.handleRefillFuel({} as Socket, payload);
      expect(gasStationService.refillFuel).toHaveBeenCalledWith(
        payload.amount,
        payload.gasolineType,
      );
    });
  });

  describe('handleSettingsChange', () => {
    it('should call simulationSetings on service', () => {
      const payload = { vehiclesAutoRefill: true };
      gateway.handleSettingsChange({} as Socket, payload);
      expect(gasStationService.simulationSetings).toHaveBeenCalledWith(payload);
    });
  });

  describe('handleProcessPayment', () => {
    it('should add payment request to service', () => {
      const payload = { pumpId: 1, paymentId: 'test123' };
      gateway.handleProcessPayment({} as Socket, payload);
      expect(gasStationService.paymentsRequests).toContainEqual(payload);
    });
  });
});
