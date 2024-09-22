import { Controller, Post } from '@nestjs/common';
import { GasStationService } from './gas-station.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ReadStateDto } from './dto/read-state.dto';

@Controller('gas-station-simulation')
@ApiTags('Gas Station Simulation')
export class GasStationSimulationController {
  constructor(private readonly gasStationService: GasStationService) {}

  @Post('reset')
  @ApiOperation({ summary: 'Reset the gas station' })
  @ApiResponse({
    status: 200,
    description: 'Gas station reset',
    type: ReadStateDto,
  })
  reset(): ReadStateDto {
    this.gasStationService.resetSimulation();
    return this.gasStationService.getState();
  }

  @Post('start')
  @ApiOperation({ summary: 'Start the gas station' })
  @ApiResponse({
    status: 200,
    description: 'Gas station started',
    type: ReadStateDto,
  })
  start(): ReadStateDto {
    this.gasStationService.startSimulation();
    return this.gasStationService.getState();
  }

  @Post('stop')
  @ApiOperation({ summary: 'Stop the gas station' })
  @ApiResponse({
    status: 200,
    description: 'Gas station stopped',
    type: ReadStateDto,
  })
  stop(): ReadStateDto {
    this.gasStationService.stopSimulation();
    return this.gasStationService.getState();
  }
}
