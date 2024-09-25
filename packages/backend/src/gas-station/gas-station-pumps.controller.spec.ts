import { Test, TestingModule } from '@nestjs/testing';
import { GasStationPumpsController } from './gas-station-pumps.controller';
import { GasStationService } from './gas-station.service';
import { Pump } from './types';

describe('GasStationPumpsController', () => {
  let controller: GasStationPumpsController;
  let service: GasStationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GasStationPumpsController],
      providers: [GasStationService],
    }).compile();

    controller = module.get<GasStationPumpsController>(
      GasStationPumpsController,
    );
    service = module.get<GasStationService>(GasStationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllPumps', () => {
    it('should return all pumps', () => {
      const result: Pump[] = [
        { id: 1, status: 'idle', currentVehicle: null, selectedGasoline: null },
        { id: 2, status: 'busy', currentVehicle: null, selectedGasoline: null },
      ];
      jest.spyOn(service, 'getAllPumps').mockImplementation(() => result);
      expect(controller.getAllPumps()).toBe(result);
    });
  });

  describe('getPumpById', () => {
    it('should return a pump by id', () => {
      const result: Pump = {
        id: 1,
        status: 'idle',
        currentVehicle: null,
        selectedGasoline: null,
      };
      jest.spyOn(service, 'getPumpById').mockImplementation(() => result);
      expect(controller.getPumpById(1)).toBe(result);
    });
  });

  describe('createPump', () => {
    it('should create a new pump', () => {
      const result: Pump = {
        id: 3,
        status: 'idle',
        currentVehicle: null,
        selectedGasoline: null,
      };
      jest.spyOn(service, 'createPump').mockImplementation(() => result);
      expect(controller.createPump()).toBe(result);
    });
  });

  describe('deletePump', () => {
    it('should delete a pump', () => {
      jest.spyOn(service, 'deletePump').mockImplementation(() => undefined);
      expect(controller.deletePump(1)).toBeUndefined();
    });
  });
});
