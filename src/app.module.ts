import { Module } from '@nestjs/common';
import { PolybaseModule } from './polybase/polybase.module';

@Module({
  imports: [PolybaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
