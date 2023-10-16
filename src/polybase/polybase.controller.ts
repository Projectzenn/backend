/**
 * Controller for Polybase API endpoints.
 */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Address } from 'viem';
import { PolybaseService, Profile, RequestMint } from './polybase.service';

@Controller('polybase')
export class PolybaseController {
  constructor(private readonly svc: PolybaseService) {}

  @Get(':address')
  async getProfile(@Param('address') address: string) {
    const result = await this.svc.getProfileByAddress(address);

    if (!result.status) throw new NotFoundException(result.message);
    //
    if(result.data) {
      //avatar convert string to json
      ///differetnt
      
      result.data.avatar = result.data.avatar.split(',');
    }
    return result;
  }
  
  @Get('/profile/tba/:address')
  async getProfileTBA(@Param('address') address: string) {
    console.log("fetiching userprofile absed on tba")
    const result = await this.svc.getProfileByTBA(address as Address);
    console.log(result);
    if (!result.status) throw new NotFoundException(result.message);
    //
    
    
    
    return result.message;
  }
  
  @Get('/profiles/all')
  async getProfiles() {
    const result = await this.svc.getProfiles();

    return result;
  }
  @Get('/requests/all')
  async getMintRequests() {
    const result = await this.svc.getRequests();

    return result;
  }

  @Post('/create')
  async createProfile(@Body() formData: Profile) {
    const result = await this.svc.createProfile(formData);

    if (!result.status) throw new BadRequestException(result.message);
    return result;
  }
  
  @Post('/updateProfile')
  async updateProfile(@Body() formData: any) {
    const result = await this.svc.updateProfile(formData);

    if (!result.status) throw new BadRequestException(result.message);
    return result;
  }
  
  @Post('/requestMint')
  async requestMint(@Body() formData: RequestMint) {
    const result = await this.svc.requestMint(formData);

    if (!result.status) throw new BadRequestException(result.message);
    return result;
  }

  @Get('/follow/:address/:signedMessage')
  async follow(
    @Param('address') address: string,
    @Param('signedMessage') signedMessage: string,
  ) {
    const result = await this.svc.startFollow(address, signedMessage);

    if (!result.status) throw new BadRequestException(result.message);
    return result;
  }
  @Get('/unfollow/:address/:followee')
  async unfollowProfile(@Param('address') address: string, @Param('followee') followee: string) {
    const result = await this.svc.unfollow(address, followee);

    return result;
  }
  @Get('/followers/:address')
  async getFollowers(@Param('address') address: string) {
    const result = await this.svc.getFollowers(address);

    return result;
  }
  @Get('/following/:address')
  async getFollowing(@Param('address') address: string) {
    const result = await this.svc.getFollowing(address);
    return result;
  }
  @Get('/update/avatar/:address/:string')
  async updateAvatar(
    @Param('address') address: string,
    @Param('string') string: string,
  ) {
    return this.svc.updateAvatar(address, string);
  }
  
  @Get('/update/nft/:address/:nft')
  async updateNFT(
    @Param('address') address: string,
    @Param('nft') nft: string,
  ) {
    const newNFT =  ["bafkreidutepul5by5atjpebnchfscmd7s5r4pzaiezxnazuq5kdveu2fgq",
    "bafkreidlzc4pnszwiyx73yqlbwgkchyuendxkfq63sp54vhnky3ruti5xu",
    "bafkreihdqgem6jwebjyiahy6e4mgf5xdrqam3yaxq2ki2ew4hw6tjxq7du",
    "bafkreigjctpasi7b2ytsn7mx47wjobnqkvioi4vllg7dqwzzvw7u2lijme",
    "bafkreif6oi5pwrjzey5q4pmyd3zck6a53uoefozxydapiipgq2flsbldsi", 
    "bafkreiabd3cfto7a7tjwgr5zikce476jxeeekmeif357t7v3g64uolgose"]
    const change =  await this.svc.updateNFT(address, newNFT);

    return change;
  }
  
  @Get('/delete/mintrequest')
  async deleteMintRequest(
    @Query('id') id: string,
  ) {
    return this.svc.deleteMintRequest(id);
  }
  

  
  @Get('/update/tba/:address/:tba')
  async updateTBA(
    @Param('address') address: string,
    @Param('tba') tba: string,
  ) {
    return this.svc.updateTokenBound(address, tba);
  }
  
  

  @Get('/nft/minting/:address')
  async getNFTOnMinting(@Param('address') address: string) {
    const result = await this.svc.getNFTOnMinting(address);

    return result;
  }
  
  @Get('/nft/:status/:id')
  async changeStatus(@Param('id') id: string
  , @Param('status') status: string) {
    const result = await this.svc.changeStatus(id, status);

    return result;
  }
  
  @Get('/company/request')
  async getRequestsByAddress(
    @Query('address') address: string,
    @Query('status') status: string
  ) {
    // Now you have access to address and status as query parameters
    
    // Your existing logic to get result using the address
    const result = await this.svc.getCompanyJoin(address, status);

    // You can also use the status query parameter as needed

    return result;
  }
  
}
