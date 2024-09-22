import { Body, Controller, Get, Put } from '@nestjs/common';
import { GasStationService } from './gas-station.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReadPricesDto } from './dto/read-prices.dto';
import { UpdatePricesDto } from './dto/update-rpices.dto';
import { SimulationState } from './types';
import { ReadStateDto } from './dto/read-state.dto';

@Controller('gas-station')
@ApiTags('Gas Station')
export class GasStationController {
  constructor(private readonly gasStationService: GasStationService) {}

  @Get('prices')
  @ApiOperation({ summary: 'Get fuel prices' })
  @ApiResponse({ status: 200, description: 'Fuel prices', type: ReadPricesDto })
  getPrices(): ReadPricesDto {
    return this.gasStationService.getFuelPrices();
  }

  @Put('prices')
  @ApiOperation({ summary: 'Update fuel prices' })
  @ApiBody({ type: UpdatePricesDto })
  @ApiResponse({
    status: 200,
    description: 'Fuel prices updated',
    type: ReadPricesDto,
  })
  updatePrices(@Body() prices: UpdatePricesDto): ReadPricesDto {
    const fuelPrices = this.gasStationService.updateFuelPrices(prices);
    this.gasStationService.emitStateUpdate();
    return fuelPrices;
  }

  @Get('state')
  @ApiOperation({ summary: 'Get the current state of the gas station' })
  @ApiResponse({
    status: 200,
    description: 'Current state',
    type: ReadStateDto,
  })
  getState(): SimulationState {
    return this.gasStationService.getState();
  }
}
