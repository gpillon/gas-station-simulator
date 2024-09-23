import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePricesDto {
  @ApiProperty({
    description: 'Price of regular fuel',
    example: 2.99,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value.toFixed(3)))
  regular?: number;

  @ApiProperty({
    description: 'Price of mid-grade fuel',
    example: 3.19,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value.toFixed(3)))
  midgrade?: number;

  @ApiProperty({
    description: 'Price of premium fuel',
    example: 3.39,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value.toFixed(3)))
  premium?: number;

  @ApiProperty({
    description: 'Price of diesel fuel',
    example: 3.09,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value.toFixed(3)))
  diesel?: number;
}
