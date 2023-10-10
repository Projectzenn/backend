import { Module } from '@nestjs/common';
import { ChainModule } from 'src/chain/chain.module';
import { NftModule } from 'src/nft/nft.module';
import { PolybaseModule } from 'src/polybase/polybase.module';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports: [ChainModule, NftModule, PolybaseModule],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
