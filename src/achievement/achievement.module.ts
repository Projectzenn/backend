import { Module } from '@nestjs/common';
import { ChainModule } from 'src/chain/chain.module';
import { NftModule } from 'src/nft/nft.module';
import { PolybaseModule } from 'src/polybase/polybase.module';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';

@Module({
  imports: [ChainModule, NftModule, PolybaseModule],
  controllers: [AchievementController],
  providers: [AchievementService],
  exports: [AchievementService],
})
export class AchievementModule {}
