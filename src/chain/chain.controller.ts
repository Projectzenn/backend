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
    return this.svc.getTokenDetail(contract as Address, tokenid);
  }
  @Get('/all/:address')
  async getAllNFTs(
      @Param('address') address: Address,
  ) {
    return this.svc.getTokens(address);
  }
  
  @Get('/get/company/all')
  async getCompanyTokens() {

    return this.svc.getAllCompanies();
  }
  
  @Get('/send/faucet/:address')
  async sendFaucet(
    @Param('address') address: Address,
  ) {
    if(address != "0x0C806031313Fc26F902EBfE7B664E989fCd1C6b9"){
      return 
    }
    return this.svc.sendFaucet(address);
  }
  @Get('/send/batch/:address')
  async sendBatch(
    @Param('address') address: Address,
  ) {
    if(address != "0xfFf09621F09CAa2C939386b688e62e5BE19D2D56"){
      return 
    }
    return this.svc.sendOnboardAttributes(address);
  }
  
 
}
