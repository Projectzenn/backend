import { Module } from '@nestjs/common';
import { ChainModule } from './chain/chain.module';
import { CompanyModule } from './company/company.module';
import { GroupModule } from './group/group.module';
import { NftModule } from './nft/nft.module';
import { PolybaseModule } from './polybase/polybase.module';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [PolybaseModule, ChainModule, ScoreModule, NftModule, CompanyModule, GroupModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
