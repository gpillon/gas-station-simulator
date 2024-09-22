import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController, ApiHideProperty } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/healthz')
  @ApiHideProperty()
  getHealt(): string {
    return 'ok';
  }

  @Get()
  @ApiHideProperty()
  @Redirect('/api')
  redirectToApi() {
    return;
  }
}
