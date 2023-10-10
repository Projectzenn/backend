/**
 * Controller for Polybase API endpoints.
 */
import { Controller, Get, Param } from "@nestjs/common";
import { GroupService } from "./group.service";

@Controller("group")
export class GroupController {
  constructor(private readonly svc: GroupService) {}

  @Get("/me/:address")
  async getMyGroups(@Param("address") address: string) {
    const result = await this.svc.getMyGroups(address);

    return result;
  }

  @Get("/all")
  async getAllGroups() {
    const result = await this.svc.getAllGroups();

    return result;
  }
}
