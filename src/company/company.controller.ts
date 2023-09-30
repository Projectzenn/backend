/**
 * Controller for Polybase API endpoints.
 */
import { Controller, Get, Param } from "@nestjs/common";
import { CompanyService } from "./company.service";

@Controller("company")
export class CompanyController {
  constructor(private readonly svc: CompanyService) {}

  @Get("/details/:address")
  async getCompanyDetails(@Param("address") address: string) {
    const result = await this.svc.getCompanyDetails(address);

    return result;
  }

  @Get("/members/:address")
  async getMembers(@Param("address") address: string) {
    const result = await this.svc.getMembers(address);

    return result;
  }
}
