import { Module } from '@nestjs/common';
import { ChainModule } from 'src/chain/chain.module';
import { NftModule } from 'src/nft/nft.module';
import { PolybaseModule } from 'src/polybase/polybase.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [ChainModule, NftModule, PolybaseModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
