import { Module } from '@nestjs/common';
import { ChainModule } from 'src/chain/chain.module';
import { PolybaseModule } from 'src/polybase/polybase.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [ChainModule, PolybaseModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
