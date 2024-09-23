import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentDto {
  @ApiProperty({
    description: 'The ID of the pump that processed the payment',
    example: 1,
  })
  pumpId: number;

  @ApiProperty({
    description: 'The ID of the payment',
    example: Math.random().toString(36).substring(2, 11),
  })
  paymentId: string;
}
