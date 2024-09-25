import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { GasStationGateway } from './gas-station.gateway';
import { GasStationService } from './gas-station.service';

describe('GasStationGateway (integration)', () => {
  let app: INestApplication;
  let gasStationService: GasStationService;

  async function createTestingModule() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [GasStationGateway, GasStationService],
    }).compile();

    app = moduleFixture.createNestApplication();
    gasStationService = moduleFixture.get<GasStationService>(GasStationService);
    await app.init();
    return moduleFixture;
  }

  async function createSocketConnection(port: number): Promise<Socket> {
    await app.listen(port);
    const clientSocket = io(`http://localhost:${port}`);
    return new Promise((resolve) => {
      clientSocket.on('connect', () => {
        resolve(clientSocket);
      });
    });
  }

  afterEach(async () => {
    await app.close();
  });

  it('should receive state update on connection', async () => {
    await createTestingModule();
    const clientSocket = await createSocketConnection(3001);

    const stateUpdate = await new Promise((resolve) => {
      clientSocket.on('stateUpdate', (state) => {
        resolve(state);
      });
    });

    expect(stateUpdate).toBeDefined();
    expect(stateUpdate['isSimulationRunning']).toBeDefined();

    clientSocket.close();
  });

  it('should handle selectGasoline event', async () => {
    await createTestingModule();
    const clientSocket = await createSocketConnection(3002);

    const payload = { pumpId: 1, gasolineType: 'regular' as const };
    gasStationService.getState().pumps[0].status = 'busy';

    clientSocket.emit('selectGasoline', payload);

    const stateUpdate = await new Promise((resolve) => {
      clientSocket.on('stateUpdate', (state) => {
        resolve(state);
      });
    });

    expect(stateUpdate['pumps'][0].selectedGasoline).toBe(payload.gasolineType);

    clientSocket.close();
  });

  it('should handle command event', async () => {
    await createTestingModule();
    const clientSocket = await createSocketConnection(3003);

    clientSocket.emit('command', 'START');

    const stateUpdate = await new Promise((resolve) => {
      clientSocket.on('stateUpdate', (state) => {
        resolve(state);
      });
    });

    expect(stateUpdate['isSimulationRunning']).toBe(true);

    clientSocket.close();
  });

  it('should handle startRefueling event', async () => {
    await createTestingModule();
    const clientSocket = await createSocketConnection(3004);

    const payload = {
      pumpId: '1',
      fuelType: 'regular' as const,
      paymentMethod: 'card',
    };
    gasStationService.getState().pumps[0].status = 'busy';
    gasStationService.getState().pumps[0].currentVehicle = {
      id: '1',
      type: 'Car',
      currentFuel: 0,
      tankCapacity: 50,
      arrivalTime: Date.now(),
      fuelType: 'Gas',
    };
    clientSocket.emit('startRefueling', payload);

    const stateUpdate = await new Promise((resolve) => {
      clientSocket.on('stateUpdate', (state) => {
        resolve(state);
      });
    });

    expect(stateUpdate['pumps'][0].status).toBe('fueling');

    clientSocket.close();
  });

  it('should handle refillFuel event', async () => {
    await createTestingModule();
    const clientSocket = await createSocketConnection(3005);

    const payload = { amount: 100, gasolineType: 'regular' };
    clientSocket.emit('refillFuel', payload);

    const stateUpdate = await new Promise((resolve) => {
      clientSocket.on('stateUpdate', (state) => {
        resolve(state);
      });
    });

    expect(stateUpdate['refillingFuels'].regular).toBe(payload.amount);

    clientSocket.close();
  });

  it('should handle simulationSettings event', async () => {
    await createTestingModule();
    const clientSocket = await createSocketConnection(3006);

    const payload = { vehiclesAutoRefill: true };
    clientSocket.emit('simulationSettings', payload);

    const stateUpdate = await new Promise((resolve) => {
      clientSocket.on('stateUpdate', (state) => {
        resolve(state);
      });
    });

    expect(stateUpdate['vehiclesAutoRefill']).toBe(true);

    clientSocket.close();
  });

  it('should handle qrPaymentId event', async () => {
    await createTestingModule();
    const clientSocket = await createSocketConnection(3007);
    const payload = { pumpId: 1, paymentId: 'test123' };
    clientSocket.emit('qrPaymentId', payload);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(gasStationService.paymentsRequests).toContainEqual(payload);

    clientSocket.close();
  });
});
