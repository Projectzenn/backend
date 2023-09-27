//here we want to use the polybase provider to genreate and store all the files with the encryption of our backend.
// we can publicly store the files but only the msg.sender can decrypt the files.
// how we do that is slightly different from the other services.

import { Injectable } from '@nestjs/common';
import { Collection, Polybase } from '@polybase/client';
import { randomBytes } from 'crypto';
import { uuidV4 } from 'ethers';
import { ChainService } from 'src/chain/chain.service';
import { getPolybaseInstance } from 'src/utils/polybase/getPolybaseInstance';

export interface Profile {
  address: string;
  username: string;
  name: string;
  email: string;
  job: string;
  description: string;
}

export interface RequestMint{
  contract:string;
  tokenId:string;
  data: string[];
  requester: string;
  tokenbound: string;
}

@Injectable()
export class PolybaseService {
  db: Polybase;
  profile: Collection<any>;
  mintRequest: Collection<any>;
  follow: Collection<any>;

  //initiate polybase.
  constructor( private readonly ChainService: ChainService) {
    this.db = getPolybaseInstance();
    this.profile = this.db.collection('User');
    this.follow = this.db.collection('Followers');
    this.mintRequest = this.db.collection('MintRequest');
  }

  async getProfileByAddress(address: string): Promise<any> {
    console.log(address);
    const response = await this.profile.where('id', '==', address).get();


    if (response.data.length === 0) {
      return { status: false, message: 'profile not found' };
    }
    return { status: true, message: response.data[0].data };
  }

  async createProfile(formData: Profile): Promise<any> {
    try {
      await this.profile.create([
        formData.address,
        formData.username,
        formData.name,
        formData.email,
        formData.job,
        formData.description,
      ]);
    } catch (error) {
      return { status: false, message: error };
    }

    return { status: true, message: 'profile created successfully' };
  }
  
  async requestMint(formData: RequestMint): Promise<any> {
    const id =  uuidV4(randomBytes(16));
    const currentTimestamp = Math.floor(Date.now() / 1000);
    try {
      await this.mintRequest.create([
        id,
        formData.contract,
        formData.tokenId,
        formData.data,
        formData.requester,
        formData.tokenbound,
        currentTimestamp
      ]);
    } catch (error) {
      return { status: false, message: error };
    }

    return { status: true, message: 'Successfully requested mint.' };
  }
  
  async getProfiles(): Promise<any>{
    const response = await this.profile.get();
    
    let profiles = [];
    for (const item of response.data) {
      try {
        profiles.push(item.data);
      } catch (error) {
        console.log(error);
      }
    }
    return profiles;
  }
  
  async getRequests(): Promise<any>{
    const response = await this.mintRequest.get();
    
    let requests = [];
    for (const item of response.data) {
      try {
        requests.push(item.data);
      } catch (error) {
        console.log(error);
      }
    }
    return requests;
  }

  async startFollow(address: string, signedMessage: string): Promise<any> {
    //need to verify this as well, but for now it's okay.
    try {
      await this.follow.create([address, signedMessage]);
    } catch (error) {
      return { status: false, message: error };
    }
    return { status: true, message: 'followed successfully' };
  }

  async getFollowers(address: string): Promise<any> {
    //get all the folloewers of a users.
    try {
      const response = await this.follow.where('follower', '==', address).get();

      const followers = [];
      for (const item of response.data) {
        try {
          followers.push(item.data.followee);
        } catch (error) {
          console.log(error);
        }
      }
      return followers;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async getFollowing(address: string): Promise<any> {
    try {
      const response = await this.follow.where('followee', '==', address).get();
      console.log('success');
      const followers = [];
      for (const item of response.data) {
        try {
          followers.push(item.data.follower);
        } catch (error) {
          console.log(error);
        }
      }
      return followers;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async updateAvatar(address:string, avatar: string): Promise<any> {
    const response = await this.profile
    .record(address)
    .call('updateAvatar', [avatar]);


  return response.data;
  }
  async updateProfile(formData: any): Promise<any> {
    const response = await this.profile
    .record(formData.address)
    .call('updateProfile', [
      formData.email, 
      formData.job, 
      formData.company, 
      formData.industry, 
      formData.label
    ]);


  return response.data;
  }
  
  async updateTokenBound(address:string, tba: string): Promise<any> {
    const response = await this.profile
    .record(address)
    .call('updateTBA', [tba]);


  return response.data;
  }
  async getNFTOnMinting(address:string){
    const response = await this.mintRequest.where('requester', '==', address).get();
    console.log(response.data);
    
    const allItems: any[] = [];
    for (const mint of response.data) {
      try {
        const nftDetails = await  this.ChainService.getTokenDetail(mint.data.contract, mint.data.tokenId);
        allItems.push({nft: nftDetails, ...mint.data, image: 'https://ipfs.io/ipfs/' + nftDetails.metadata.image, name: nftDetails.metadata.name, category: nftDetails.metadata.category});
      } catch (error) {
        allItems.push('could not decrypt');
      }
    }    
    return allItems;
  }

  async followProfile(): Promise<any> {
    return null;
  }

  async unfollowProfile(address: string): Promise<any> {
    return address;
  }
  async changeStatus(id: string, status) {
    const timestamp = Math.floor(Date.now() / 1000);
    const response = await this.mintRequest
    .record(id)
    .call('updateStatus', [status, timestamp]);
    return response;
  }
  
  
}
