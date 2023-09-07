import { Module } from '@nestjs/common';
import { ChainModule } from './chain/chain.module';
import { PolybaseModule } from './polybase/polybase.module';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [PolybaseModule, ChainModule, ScoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
