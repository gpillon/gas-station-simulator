import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GasStationService } from './gas-station.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReadPumpDto } from './dto/read-state.dto';
import { CreatePumpDto } from './dto/create-pump.dto';

@Controller('gas-station/pumps')
@ApiTags('Gas Station Pumps')
export class GasStationPumpsController {
  constructor(private readonly gasStationService: GasStationService) {}
  @Get()
  @ApiOperation({ summary: 'Get all pumps' })
  @ApiResponse({
    status: 200,
    description: 'List of all pumps',
    type: [ReadPumpDto],
  })
  getAllPumps(): ReadPumpDto[] {
    return this.gasStationService.getAllPumps();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pump by id' })
  @ApiResponse({
    status: 200,
    description: 'Pump details',
    type: ReadPumpDto,
  })
  getPumpById(@Param('id') id: number): ReadPumpDto {
    return this.gasStationService.getPumpById(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new pump' })
  @ApiBody({ type: CreatePumpDto })
  @ApiResponse({
    status: 201,
    description: 'Pump created',
    type: ReadPumpDto,
  })
  createPump(/*@Body() createPumpDto: CreatePumpDto*/): ReadPumpDto {
    return this.gasStationService.createPump();
  }

  // @Put(':id')
  // @ApiOperation({ summary: 'Update pump by id' })
  // @ApiBody({ type: UpdatePumpDto })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Pump updated',
  //   type: ReadPumpDto,
  // })
  // updatePump(
  //   @Param('id') id: number,
  //   @Body() updatePumpDto: UpdatePumpDto,
  // ): ReadPumpDto {
  //   return this.gasStationService.updatePump(id, updatePumpDto);
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pump by id' })
  @ApiResponse({
    status: 200,
    description: 'Pump deleted',
  })
  deletePump(@Param('id') id: number): void {
    return this.gasStationService.deletePump(+id);
  }

}
