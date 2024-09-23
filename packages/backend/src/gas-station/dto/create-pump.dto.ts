import { ApiProperty } from '@nestjs/swagger';
import { Pump } from '../types';
import { IsBoolean, IsEmpty, IsOptional } from 'class-validator';

type None<T> = {
    [P in keyof T]: never;
};

export class CreatePumpDto implements Partial<None<Pump>> {
  @IsEmpty()
  @IsOptional()
  id?: never;

  @IsEmpty()
  @IsOptional()
  currentVehicle?: never;

  @IsEmpty()
  @IsOptional()
  status?: never;

  @IsEmpty()
  @IsOptional()
  selectedGasoline?: never;
}

export class CreatePumpQueryDto {
  @ApiProperty({
    description: 'Simulation',
    required: false,
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  simulation?: boolean;
}
