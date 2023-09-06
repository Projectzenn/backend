import {
    Controller,
    Get,
    Param
} from '@nestjs/common';
import { ScoreService } from './score.service';
  
  @Controller('score')
  export class ScoreController {
    constructor(private readonly svc: ScoreService) {}
  

    
    @Get('/github/:address')
    async getProfiles(
        @Param('address') address: string,
    ) {
      const result = await this.svc.githubScore(address);
      console.log(result);
      return result;
    }
  
    
  }
  