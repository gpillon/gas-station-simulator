import { ApiProperty } from '@nestjs/swagger';

export class ReadPricesDto {
  @ApiProperty({ description: 'Price of regular fuel', example: 1.74 })
  regular: number;

  @ApiProperty({ description: 'Price of mid-grade fuel', example: 1.85 })
  midgrade: number;

  @ApiProperty({ description: 'Price of premium fuel', example: 2.01 })
  premium: number;

  @ApiProperty({ description: 'Price of diesel fuel', example: 1.68 })
  diesel: number;
}
