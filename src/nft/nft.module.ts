import { Module } from '@nestjs/common';
import { ChainModule } from 'src/chain/chain.module';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';

@Module({
  imports: [ChainModule],
  controllers: [NftController],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
