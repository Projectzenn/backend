/**
 * Controller for Polybase API endpoints.
 */
import { Controller, Get, Param } from "@nestjs/common";
import { AchievementService } from "./achievement.service";

@Controller("achievement")
export class AchievementController {
  constructor(private readonly svc: AchievementService) {}


  @Get("/all")
  async getAllAchievements() {
    const result = await this.svc.getAllAchievements();

    return result;
  }
  
  @Get('/getByGroup/:address')
  async getContractAchievement(
    @Param('address') address: string,
  ) {
    const result = await this.svc.getContractAchievement(address);
    //we want to make sure that we can get the iupfs details back

    return result;
  }
  
  @Get('/getSingle/:address/:id')
  async getSingleAchievement(
    @Param('address') address: string,
    @Param('id') id: string,
  ) {
    const result = await this.svc.getSingleAchievement(address, id);
    //we want to make sure that we can get the iupfs details back

    return result;
  }
  
  
}
