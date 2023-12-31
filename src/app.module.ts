import { Module } from "@nestjs/common";
import { AchievementModule } from "./achievement/achievement.module";
import { ChainModule } from "./chain/chain.module";
import { CompanyModule } from "./company/company.module";
import { GithubModule } from "./github/github.module";
import { GroupModule } from "./group/group.module";
import { NextidModule } from "./nextid/nextid.module";
import { NftModule } from "./nft/nft.module";
import { PolybaseModule } from "./polybase/polybase.module";
import { ProjectModule } from "./project/project.module";

@Module({
  imports: [
    PolybaseModule,
    ChainModule,
    NextidModule,
    GithubModule,
    NftModule,
    CompanyModule,
    GroupModule,
    ProjectModule,
    AchievementModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
