import { Module } from '@nestjs/common';
import { ChainModule } from 'src/chain/chain.module';
import { GroupModule } from 'src/group/group.module';
import { PolybaseModule } from 'src/polybase/polybase.module';
import { ProjectModule } from 'src/project/project.module';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';

@Module({
  imports: [ChainModule, GroupModule, ProjectModule, PolybaseModule],
  controllers: [AchievementController],
  providers: [AchievementService],
  exports: [AchievementService],
})
export class AchievementModule {}
