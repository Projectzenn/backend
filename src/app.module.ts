import { Module } from '@nestjs/common';
import { ChainModule } from './chain/chain.module';
import { NftModule } from './nft/nft.module';
import { PolybaseModule } from './polybase/polybase.module';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [PolybaseModule, ChainModule, ScoreModule, NftModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
