import { Module } from '@nestjs/common';
import { ChainModule } from 'src/chain/chain.module';
import { NftModule } from 'src/nft/nft.module';
import { PolybaseModule } from 'src/polybase/polybase.module';
import { NextidController } from './nextid.controller';
import { NextidService } from './nextid.service';

@Module({
  imports: [ChainModule, NftModule, PolybaseModule],
  controllers: [NextidController],
  providers: [NextidService],
  exports: [NextidService],
})
export class NextidModule {}
