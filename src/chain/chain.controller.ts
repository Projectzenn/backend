import { Controller, Get, Param } from '@nestjs/common';
import { ChainService } from './chain.service';

@Controller('chain')
export class ChainController {
  constructor(private readonly svc: ChainService) {}

  @Get('/all')
  async getAll() {
    return this.svc.getAllTokens();
  }
  @Get('/:contract/:tokenid')
  async getTokenDetail(
    @Param('contract') contract: string,
    @Param('tokenid') tokenid: string,
  ) {
    return this.svc.getTokenDetail(contract, tokenid);
  }
  
 
}
