import { Module } from '@nestjs/common';
import { GasStationGateway } from './gas-station.gateway';
import { GasStationService } from './gas-station.service';

@Module({
  providers: [GasStationGateway, GasStationService],
})
export class GasStationModule {}