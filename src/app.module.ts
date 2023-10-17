import { Module } from '@nestjs/common';
import { ChainModule } from './chain/chain.module';
import { CompanyModule } from './company/company.module';
import { GroupModule } from './group/group.module';
import { NextidModule } from './nextid/nextid.module';
import { NftModule } from './nft/nft.module';
import { PolybaseModule } from './polybase/polybase.module';
import { ProjectModule } from './project/project.module';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [PolybaseModule, ChainModule, NextidModule,
    ScoreModule, NftModule, CompanyModule, GroupModule, ProjectModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
