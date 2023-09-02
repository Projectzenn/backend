import { Controller, Get } from '@nestjs/common';
import { ChainService } from './chain.service';

@Controller('chain')
export class ChainController {
  constructor(private readonly svc: ChainService) {}

  @Get('/all')
  async getAll() {
    return this.svc.getAllTokens();
  }
}
