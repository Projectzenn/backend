/**
 * Controller for Polybase API endpoints.
 */
import {
    Controller
} from '@nestjs/common';
import { CompanyService } from './company.service';
  
  @Controller('company')
  export class CompanyController {
    constructor(private readonly svc: CompanyService) {}
  
    
  }
  