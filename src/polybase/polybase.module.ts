import { Module } from '@nestjs/common';
import { PolybaseController } from './polybase.controller';
import { PolybaseService } from './polybase.service';

@Module({
  controllers: [PolybaseController],
  providers: [PolybaseService],
  exports: [PolybaseService],
})
export class PolybaseModule {}
