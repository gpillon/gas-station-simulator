import { ApiProperty } from '@nestjs/swagger';
import { GasolineType, GasolineTypeT, SimulationState } from '../types';
import { ReadPricesDto } from './read-prices.dto';
import { Pump as PumpT } from '../types';
import { ReadVehicleDto } from './read-vehicle.dts';

class FuelDispensed {
  @ApiProperty({ example: 500 })
  regular: number;
  @ApiProperty({ example: 300 })
  midgrade: number;
  @ApiProperty({ example: 200 })
  premium: number;
  @ApiProperty({ example: 400 })
  diesel: number;
}

class FuelCapacity {
  @ApiProperty({
    example: 1000,
    description: 'Regular Fuel capacity in Liters ',
  })
  regular: number;
  @ApiProperty({
    example: 1000,
    description: 'Midgrade Fuel capacity in Liters',
  })
  midgrade: number;
  @ApiProperty({
    example: 1000,
    description: 'Premium Fuel capacity in Liters',
  })
  premium: number;
  @ApiProperty({ example: 1000, description: 'Diesel Fuel capacity in Liters' })
  diesel: number;
}

class FuelBuyPrices {
  @ApiProperty({
    example: 1000,
    description: 'Regular Fuel buy price in Liters ',
  })
  regular: number;
  @ApiProperty({
    example: 1000,
    description: 'Midgrade Fuel buy price in Liters',
  })
  midgrade: number;
  @ApiProperty({
    example: 1000,
    description: 'Premium Fuel buy price in Liters',
  })
  premium: number;
  @ApiProperty({
    example: 1000,
    description: 'Diesel Fuel buy price in Liters',
  })
  diesel: number;
}

class RefillingFuels {
  @ApiProperty({ example: 0 })
  regular: number;
  @ApiProperty({ example: 0 })
  midgrade: number;
  @ApiProperty({ example: 0 })
  premium: number;
  @ApiProperty({ example: 0 })
  diesel: number;
}

export class ReadPumpDto implements PumpT {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'idle' })
  status: 'idle' | 'busy' | 'fueling';
  @ApiProperty({ type: ReadVehicleDto })
  currentVehicle: ReadVehicleDto | null;
  @ApiProperty({ enum: GasolineType })
  selectedGasoline: GasolineTypeT;
}

export class ReadStateDto implements SimulationState {
  @ApiProperty({ description: 'Array of pump states', type: [ReadPumpDto] })
  pumps: ReadPumpDto[];

  @ApiProperty({
    description: 'Queue of vehicles waiting',
    type: [ReadVehicleDto],
  })
  queue: ReadVehicleDto[];

  @ApiProperty({ description: 'Total number of vehicles served', example: 100 })
  vehiclesServed: number;

  @ApiProperty({ description: 'Number of cars served', example: 75 })
  carsServed: number;

  @ApiProperty({ description: 'Number of trucks served', example: 25 })
  trucksServed: number;

  @ApiProperty({ description: 'Average wait time in seconds', example: 120 })
  averageWaitTime: number;

  @ApiProperty({ description: 'Total revenue generated', example: 1000.5 })
  totalRevenue: number;

  @ApiProperty({
    description: 'Whether the vehicles are auto-refilling',
    example: false,
    type: Boolean,
  })
  vehiclesAutoRefill: boolean;

  @ApiProperty({
    description: 'Whether the tanks are auto-refilling',
    example: false,
    type: Boolean,
  })
  tanksAutoRefill: boolean;

  @ApiProperty({
    description: 'Whether the prices are auto-adjusting',
    example: false,
    type: Boolean,
  })
  autoAdjustPrices: boolean;

  @ApiProperty({
    description: 'Whether the simulation is currently running',
    example: true,
  })
  isSimulationRunning: boolean;

  @ApiProperty({
    description: 'Size of the queue',
    example: 10,
  })
  queueSize: number;

  @ApiProperty({
    description: 'Vehicles per second',
    example: 0.3,
    minimum: 0,
    maximum: 2,
  })
  vehiclesPerSecond: number;

  @ApiProperty({
    description: 'Chance per second of vehicle start refill',
    example: 0.25,
    minimum: 0,
    maximum: 1,
  })
  chanchePerSecondOfVehicleStartRefill: number;

  @ApiProperty({
    description: 'Amount of fuel dispensed for each type',
    type: FuelDispensed,
  })
  fuelDispensed: FuelDispensed;

  @ApiProperty({
    description: 'Fuel capacity for each type',
    type: FuelCapacity,
  })
  fuelCapacity: FuelCapacity;

  @ApiProperty({
    description: 'Amount of fuel being refilled for each type',
    type: RefillingFuels,
  })
  refillingFuels: RefillingFuels;

  @ApiProperty({ description: 'Current fuel prices', type: ReadPricesDto })
  fuelPrices: ReadPricesDto;

  @ApiProperty({ description: 'Current fuel buy prices', type: FuelBuyPrices })
  fuelBuyPrices: FuelBuyPrices;
}
