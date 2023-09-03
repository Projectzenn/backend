import { Module } from '@nestjs/common';
import { ChainModule } from './chain/chain.module';
import { PolybaseModule } from './polybase/polybase.module';

@Module({
  imports: [PolybaseModule, ChainModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
