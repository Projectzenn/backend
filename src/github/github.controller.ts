import {
  Controller,
  Get,
  Param,
  Query
} from '@nestjs/common';
import { GithubService } from './github.service';
  
  @Controller('github')
  export class GithubController {
    constructor(private readonly svc: GithubService) {}
  

    
    @Get('/github/:address')
    async getProfiles(
        @Param('address') address: string,
    ) {
      const result = await this.svc.githubScore(address);
      console.log(result);
      return result;
    }
    
    @Get('/github/contributions/:address')
    async getContributions(
        @Param('address') address: string,
    ) {
      const result = await this.svc.usersRepo(address);
      console.log(result);
      return result;
    }
    
    @Get('has-contributed')
    async hasContributed(
        @Query('username') username: string,
        @Query('repo') repo: string
    ): Promise<any> {
        const hasContributed = await this.svc.hasContributed(username, repo);
        return { hasContributed };
    }
    
    
    @Get('/github/score/:address')
    async getActivityScore(
        @Param('address') address: string,
    ) {
      const result = await this.svc.getUserLanguages(address);
      console.log(result);
      return result;
    }
    
    @Get('/hackathons')
    async getHackathons()
    {
      const result = await this.svc.getHackathons();
      console.log(result);
      return result;
    }
  
    
  }
  