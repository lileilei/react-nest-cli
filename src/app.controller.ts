import { Controller, Get, Post, Put, Body,Bind } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getHello() {
    return this.appService.getHello();
  }

  @Post()
  async create(@Body() params) {
    return this.appService.login(params);
  }

  @Put()
  async loginout(@Body() params) {
    return {}
  }
}

