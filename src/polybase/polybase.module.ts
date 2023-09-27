import { Module } from '@nestjs/common';
import { ChainModule } from 'src/chain/chain.module';
import { PolybaseController } from './polybase.controller';
import { PolybaseService } from './polybase.service';

@Module({
  imports: [ChainModule],
  controllers: [PolybaseController],
  providers: [PolybaseService],
  exports: [PolybaseService],
})
export class PolybaseModule {}
