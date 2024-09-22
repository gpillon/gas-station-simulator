import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePricesDto {
  @ApiProperty({ description: 'Price of regular fuel', example: 2.99 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  regular?: number;

  @ApiProperty({ description: 'Price of mid-grade fuel', example: 3.19 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => value, { toClassOnly: true })
  midgrade?: number;

  @ApiProperty({ description: 'Price of premium fuel', example: 3.39 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  premium?: number;

  @ApiProperty({ description: 'Price of diesel fuel', example: 3.09 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  diesel?: number;
}
