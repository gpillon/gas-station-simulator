import { ApiProperty } from '@nestjs/swagger';
import { Vehicle as VehicleT } from '../types';

export class ReadVehicleDto implements VehicleT {
  @ApiProperty({ example: '1234567890' })
  id: string;
  @ApiProperty({ example: 'car', enum: ['Car', 'Truck'] })
  type: VehicleT['type'];
  @ApiProperty({ example: 57 })
  currentFuel: number;
  @ApiProperty({ example: 85 })
  tankCapacity: number;
  @ApiProperty({ example: 100 })
  arrivalTime: number;
  @ApiProperty({ example: 'Gas', enum: ['Gas', 'Diesel'] })
  fuelType: VehicleT['fuelType'];
}
