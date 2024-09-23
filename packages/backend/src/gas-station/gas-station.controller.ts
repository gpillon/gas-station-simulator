import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
} from '@nestjs/common';
import { GasStationService } from './gas-station.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReadPricesDto } from './dto/read-prices.dto';
import { UpdatePricesDto } from './dto/update-rpices.dto';
import { SimulationState } from './types';
import { ReadStateDto } from './dto/read-state.dto';
import { ProcessPaymentDto } from './dto/porcess-payment.dto';

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

  @Post('process-payment')
  @ApiOperation({ summary: 'Process a payment' })
  @ApiBody({ type: ProcessPaymentDto })
  @ApiResponse({
    status: 200,
    description: 'Payment processed',
    type: ProcessPaymentDto,
  })
  async processPayment(
    @Body() payment: ProcessPaymentDto,
  ): Promise<ProcessPaymentDto> {
    const result = this.gasStationService.processPayment(
      +payment.pumpId,
      payment.paymentId,
    );
    if (result.ok) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
      throw new BadRequestException(
        'Payment failed, paymentId: ' + payment.paymentId,
      );
    }
    return payment;
  }
}
