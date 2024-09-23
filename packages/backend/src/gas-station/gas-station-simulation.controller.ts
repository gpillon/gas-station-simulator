import { Body, Controller, Post, Put } from '@nestjs/common';
import { GasStationService } from './gas-station.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ReadStateDto } from './dto/read-state.dto';
import { SimulationSettings } from './types';
import { UpdateSimulationSettingsDto } from './dto/update-simulation-settings.dto';

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

  @Put('settings')
  @ApiOperation({ summary: 'Set the gas station settings' })
  @ApiBody({ type: UpdateSimulationSettingsDto })
  @ApiResponse({
    status: 200,
    description: 'Gas station settings set',
    type: ReadStateDto,
  })
  setSettings(@Body() settings: Partial<SimulationSettings>): ReadStateDto {
    this.gasStationService.simulationSetings(settings);
    return this.gasStationService.getState();
  }
}
