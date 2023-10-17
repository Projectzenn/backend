/**
 * Controller for Polybase API endpoints.
 */
import { Controller, Get, Param } from "@nestjs/common";
import { NextidService } from "./nextid.service";

@Controller("nextid")
export class NextidController {
  constructor(private readonly svc: NextidService) {}

  @Get("/user/:address")
  async getMyGroups(@Param("address") address: string) {
    const result = await this.svc.getMyProfile(address);

    return result;
  }

}
