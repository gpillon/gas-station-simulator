import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GasStationModule } from './gas-station/gas-station.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    GasStationModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: '/',
            module: GasStationModule,
          },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
