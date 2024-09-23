import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateSimulationSettingsDto {
  @ApiProperty({
    description: 'Automatically refill vehicles',
    default: false,
    required: false,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  vehiclesAutoRefill?: boolean;

  @ApiProperty({
    description: 'Automatically refill tanks',
    default: false,
    required: false,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  tanksAutoRefill?: boolean;

  @ApiProperty({
    description: 'Automatically adjust prices',
    default: false,
    required: false,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  autoAdjustPrices?: boolean;

  @ApiProperty({
    description: 'Size of the queue',
    default: 9,
    required: false,
    example: 9,
    minimum: 0,
    maximum: 50,
  })
  @IsNumber()
  @Min(0)
  @Max(50)
  @IsOptional()
  queueSize?: number;

  @ApiProperty({
    description: 'Vehicles per second',
    default: 0.3,
    required: false,
    example: 0.3,
    minimum: 0,
    maximum: 2,
  })
  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  vehiclesPerSecond?: number;

  @ApiProperty({
    description: 'Chance per second of vehicle start refill',
    default: 0.25,
    required: false,
    example: 0.25,
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  chanchePerSecondOfVehicleStartRefill?: number;
}
