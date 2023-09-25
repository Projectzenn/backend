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

      return result;
    }
    @Get('/:address/:tokenId')
    async getSingleNFT(
        @Param('address') address: string,
        @Param('tokenId') tokenId: string,
    ) {
      const result = await this.svc.getNFTsByContract(address, tokenId);

      return result;
    }
    
    
  }
  