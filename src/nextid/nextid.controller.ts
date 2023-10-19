/**
 * Controller for Polybase API endpoints.
 */
import { Controller, Get, Param } from "@nestjs/common";
import { NextidService } from "./nextid.service";

@Controller("nextid")
export class NextidController {
  constructor(private readonly svc: NextidService) {}

  @Get("/user/profile/:platform/:address")
  async getUserProfile(
    @Param("platform") platform: string,
    @Param("address") address: string,
  ) {
    const result = await this.svc.getMyProfile(platform, address);

    return result;
  }
  @Get("/user/nft/:address")
  async getUserSocials(@Param("address") address: string) {
    const result = await this.svc.getProfileNFT(address);

    return result;
  }

}
