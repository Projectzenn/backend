import {
  Controller,
  Get,
  Param
} from '@nestjs/common';
import { ProjectService } from './project.service';
    
    @Controller('project')
    export class ProjectController {
      constructor(private readonly svc: ProjectService) {}
    
  
      
      @Get('/all')
      async getAllProjects(
      ) {
        const result = await this.svc.getAllProjects();
  
        return result;
      }
      
      @Get('/single/:id')
      async getSingleProject(
        @Param('id') id: string,
      ) {
        const result = await this.svc.getProject(id);
        //we want to make sure that we can get the iupfs details back
  
        return result;
      }
      

      
    }
    