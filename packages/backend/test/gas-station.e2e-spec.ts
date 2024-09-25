import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { SimulationState } from 'src/gas-station/types';
import { GasStationService } from '../src/gas-station/gas-station.service';

interface ExtendedSocket extends Socket {
  lastState?: any;
}

describe('GasStation (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
    await new Promise<void>((resolve) => httpServer.listen(0, resolve));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('HTTP Endpoints', () => {
    it('should get fuel prices', () => {
      return request(httpServer)
        .get('/api/gas-station/prices')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('regular');
          expect(res.body).toHaveProperty('midgrade');
          expect(res.body).toHaveProperty('premium');
          expect(res.body).toHaveProperty('diesel');
        });
    });

    it('should update fuel prices', () => {
      const newPrices = { regular: 2.5, midgrade: 2.7 };
      return request(httpServer)
        .put('/api/gas-station/prices')
        .send(newPrices)
        .expect(200)
        .expect((res) => {
          expect(res.body.regular).toBe(2.5);
          expect(res.body.midgrade).toBe(2.7);
        });
    });

    it('should get current state', () => {
      return request(httpServer)
        .get('/api/gas-station/state')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('pumps');
          expect(res.body).toHaveProperty('queue');
          expect(res.body).toHaveProperty('vehiclesServed');
          expect(res.body).toHaveProperty('totalRevenue');
        });
    });
  });

  describe('WebSocket Events', () => {
    async function createTestApp() {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      const app = moduleFixture.createNestApplication();
      await app.init();
      const httpServer = app.getHttpServer();
      await new Promise<void>((resolve) => httpServer.listen(45845, resolve));

      const address = httpServer.address();
      const port = typeof address === 'string' ? address : address?.port;
      const socketClient = io(`http://localhost:${port}`) as ExtendedSocket;
      await new Promise<void>((resolve) => {
        socketClient.on('connect', resolve);
      });

      return { app, socketClient };
    }

    it('should process payment', async () => {
      const { app, socketClient } = await createTestApp();

      try {
        const payment = { pumpId: 1, paymentId: 'test123' };
        const payment_post = { pumpId: '1', paymentId: 'test123' };

        // Set up the WebSocket listener before emitting the event
        const paymentUpdatePromise = new Promise<void>((resolve) => {
          socketClient.on('paymentUpdate', (response) => {
            expect(response).toEqual(payment);
            resolve();
          });
        });

        socketClient.emit('qrPaymentId', payment);

        // Wait for the payment to be processed
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Make the HTTP request
        await request(app.getHttpServer())
          .post('/api/gas-station/process-payment')
          .send(payment_post)
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual(payment_post);
          });

        // Wait for the WebSocket update
        await paymentUpdatePromise;
      } finally {
        socketClient.close();
        await app.close();
      }
    });

    it('should receive state updates via WebSocket', async () => {
      const { app, socketClient } = await createTestApp();

      try {
        await new Promise<void>((resolve) => {
          socketClient.on('stateUpdate', (state) => {
            expect(state).toBeDefined();
            expect(state.isSimulationRunning).toBeDefined();
            resolve();
          });

          socketClient.emit('command', 'START');
        });
      } finally {
        socketClient.close();
        await app.close();
      }
    });

    it('should handle selectGasoline event via WebSocket', async () => {
      const { app, socketClient } = await createTestApp();

      try {
        await Promise.all([
          new Promise<void>((resolve) => {
            socketClient.emit('command', 'START');
            socketClient.on('stateUpdate', (state: SimulationState) => {
              if (state.isSimulationRunning) {
                state.pumps.forEach(() => {
                  // @ts-expect-error Testing only, method is private
                  app.get(GasStationService).addVehicleToQueue();
                });
                resolve();
              }
            });
          }),
          request(httpServer)
            .put('/api/gas-station-simulation/settings')
            .send({ vehiclesPerSecond: 10 })
            .expect(200)
            .expect((res) => {
              expect(res.body).toMatchObject({ vehiclesPerSecond: 10 });
              expect(res.body).toHaveProperty('tanksAutoRefill');
              expect(res.body).toHaveProperty('vehiclesAutoRefill');
              expect(res.body).toHaveProperty('vehiclesPerSecond');
            }),
        ]);

        const payload = { pumpId: 1, gasolineType: 'regular' };
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Timeout waiting for selectGasoline response'));
          }, 2000);

          socketClient.on('stateUpdate', (state: SimulationState) => {
            socketClient.lastState = state;
            // console.log('Received state update:', state);
            if (
              state.pumps &&
              state.pumps.find((pump) => pump.id === payload.pumpId)
                ?.selectedGasoline === payload.gasolineType
            ) {
              clearTimeout(timeout);
              resolve();
            } else if (
              state.pumps &&
              state.pumps.find((pump) => pump.id === payload.pumpId)?.status ===
                'busy'
            ) {
              //console.log('Emitting selectGasoline event:', payload);
              socketClient.emit('selectGasoline', payload);
            }
          });
        });
      } finally {
        socketClient.close();
        await app.close();
      }
    });
  });
});
