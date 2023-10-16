/**
 * Controller for Polybase API endpoints.
 */
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
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
  
  @Get('/single/:address')
  async getSingleGroup(
    @Param('address') address: string,
  ) {
    const result = await this.svc.getGroup(address);
    //we want to make sure that we can get the iupfs details back

    return result;
  }
  
  @Post('/newGroup')
  async saveGroupChat(
    @Body('from') from: string,
    @Body('to') to: string,
    @Body('chatId') chatId: string,
  ): Promise<any> {
    console.log(from, to, chatId)
    return this.svc.saveGroupChat(from, to, chatId);
  }
  
  @Get('/chat/get/:id')
  async getGroupChat(
    @Param('id') id: string,
  ): Promise<any> {
    return this.svc.getGroupChat(id);
  }
  
}
