import {
  Controller,
  Get,
  Param
} from '@nestjs/common';
import { NftService } from './nft.service';
  
  @Controller('nft')
  export class NftController {
    constructor(private readonly svc: NftService) {}
  

    
    @Get('/all/:address')
    async getAllNfts(
        @Param('address') address: string,
    ) {
      const result = await this.svc.getAllNFTs(address);
      console.log(result);
      return result;
    }
    
    
  }
  