import { Controller, Get, Param } from '@nestjs/common';
import { Address } from 'viem';
import { ChainService } from './chain.service';

@Controller('chain')
export class ChainController {
  constructor(private readonly svc: ChainService) {}

  @Get('/all')
  async getAll() {
    return this.svc.getAllTokens();
  }
  
  @Get('/user/:address')
  async getUserTokens(
    @Param('address') address: string,
  ) {
    return this.svc.getUserTokens(address);
  }
  
  @Get('/:contract/:tokenid')
  async getTokenDetail(
    @Param('contract') contract: string,
    @Param('tokenid') tokenid: string,
  ) {
    return this.svc.getTokenDetail(contract, tokenid);
  }
  @Get('/all/:address')
  async getAllNFTs(
      @Param('address') address: Address,
  ) {
    return this.svc.getTokens(address);
  }
  
  @Get('/get/company/all')
  async getCompanyTokens() {
    console.log("Getting all the companies and tokens from it")
    return this.svc.getAllCompanies();
  }
  
 
}
