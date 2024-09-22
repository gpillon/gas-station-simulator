import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GasStationService } from './gas-station.service';
import { GasolineTypeT } from './types';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class GasStationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly gasStationService: GasStationService) {
    this.gasStationService.stateUpdates.subscribe((state) => {
      this.server.emit('stateUpdate', state);
    });
    this.gasStationService.refuelingComplete.subscribe((pumpId) => {
      this.server.emit('refuelingComplete', pumpId);
    });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('stateUpdate', {
      ...this.gasStationService.getState(),
      isSimulationRunning: this.gasStationService.isSimulationRunning,
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('selectGasoline')
  handleSelectGasoline(
    client: Socket,
    payload: { pumpId: number; gasolineType: GasolineTypeT },
  ) {
    console.log(
      `Selecting gasoline: Pump ${payload.pumpId}, Type: ${payload.gasolineType}`,
    );
    this.gasStationService.selectGasoline(payload.pumpId, payload.gasolineType);
  }

  @SubscribeMessage('command')
  handleCommand(_client: Socket, command: string) {
    console.log(`Received command: ${command}`);
    switch (command) {
      case 'START':
        this.gasStationService.startSimulation();
        break;
      case 'STOP':
        this.gasStationService.stopSimulation();
        break;
      case 'RESET':
        this.gasStationService.resetSimulation();
        break;
    }
  }

  @SubscribeMessage('startRefueling')
  handleStartRefueling(
    _client: Socket,
    payload: { pumpId: string; fuelType: GasolineTypeT; paymentMethod: string },
  ) {
    console.log('Starting refueling:', payload);
    this.gasStationService.startRefueling(
      parseInt(payload.pumpId),
      payload.fuelType,
    );
    // Simulate refueling completion
    // setTimeout(() => {
    //   console.log('Refueling complete');
    //   client.emit('refuelingComplete', payload.pumpId);
    // }, 5000); // 5 seconds for demonstration, adjust as needed
  }

  @SubscribeMessage('refillFuel')
  handleRefillFuel(
    _client: Socket,
    payload: { amount: number; gasolineType: string },
  ) {
    console.log('Refilling fuel:', payload);
    this.gasStationService.refillFuel(payload.amount, payload.gasolineType);
    // Simulate refueling completion
    // setTimeout(() => {
    //   console.log('Refueling complete');
    //   client.emit('refuelingComplete', payload.pumpId);
    // }, 5000); // 5 seconds for demonstration, adjust as needed
  }
}
