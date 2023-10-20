/**
 * Controller for Polybase API endpoints.
 */
import { BadRequestException, Body, Controller, Get, Param, Post } from "@nestjs/common";
import { RequestMint } from "src/polybase/polybase.service";
import { AchievementService } from "./achievement.service";

interface ChangeStatus {
  id: string;
  status: string;
}

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
  
  @Post('/update')
  async updateMint(@Body() formData: any) {
    console.log("staring here...")
    console.log(formData)
    const result = await this.svc.updateAchievement(formData);
    return result;
  }
  
    
  @Post('/request')
  async requestMint(@Body() formData: RequestMint) {
    console.log("staring here...")
    const result = await this.svc.requestAchievement(formData);

    if (!result.status) throw new BadRequestException(result.message);
    return result;
  }
  
  
  
  @Get('/getRequests/:contract')
  async getRequests(
    @Param('contract') contract: string,
  ) {
    const result = await this.svc.getPendingRequests(contract);
    //we want to make sure that we can get the iupfs details back

    return result;
  }
  
  @Get('/userAchievements/:address')
  async getUserAchievements(
    @Param('address') address: string,
  ) {
    const result = await this.svc.getUserAchievements(address);
    //we want to make sure that we can get the iupfs details back

    return result;
  }
  
  
}
