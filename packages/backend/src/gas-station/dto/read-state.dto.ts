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
  @ApiProperty({ example: 1000 })
  regular: number;
  @ApiProperty({ example: 1000 })
  midgrade: number;
  @ApiProperty({ example: 1000 })
  premium: number;
  @ApiProperty({ example: 1000 })
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

class Pump implements PumpT {
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
  @ApiProperty({ description: 'Array of pump states', type: [Pump] })
  pumps: Pump[];

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
    description: 'Whether the simulation is currently running',
    example: true,
  })
  isSimulationRunning: boolean;

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
}
