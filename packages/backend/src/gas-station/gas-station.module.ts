import { Module } from '@nestjs/common';
import { GasStationGateway } from './gas-station.gateway';
import { GasStationService } from './gas-station.service';
import { GasStationController } from './gas-station.controller';
import { GasStationSimulationController } from './gas-station-simulation.controller';
import { GasStationPumpsController } from './gas-station-pumps.controller';

@Module({
  providers: [GasStationGateway, GasStationService],
  controllers: [
    GasStationController,
    GasStationSimulationController,
    GasStationPumpsController,
  ],
})
export class GasStationModule {}
