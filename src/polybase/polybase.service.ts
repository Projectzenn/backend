//here we want to use the polybase provider to genreate and store all the files with the encryption of our backend.
// we can publicly store the files but only the msg.sender can decrypt the files.
// how we do that is slightly different from the other services.

import { Injectable } from '@nestjs/common';
import { Collection, Polybase } from '@polybase/client';
import { getPolybaseInstance } from 'src/utils/polybase/getPolybaseInstance';

export interface Profile {
  address: string;
  username: string;
  name: string;
  email: string;
  job: string;
  company: string;
  industry: string;
}

@Injectable()
export class PolybaseService {
  db: Polybase;
  profile: Collection<any>;
  follow: Collection<any>;

  //initiate polybase.
  constructor() {
    this.db = getPolybaseInstance();
    this.profile = this.db.collection('User');
    this.follow = this.db.collection('Followers');
  }

  async getProfileByAddress(address: string): Promise<any> {
    console.log(address);
    const response = await this.profile.where('id', '==', address).get();

    if (response.data.length === 0) {
      return { status: false, message: 'profile not found' };
    }
    return { status: true, message: response.data[0] };
  }

  async createProfile(formData: Profile): Promise<any> {
    try {
      await this.profile.create([
        formData.address,
        formData.username,
        formData.name,
        formData.email,
        formData.job,
        formData.company,
        formData.industry,
      ]);
    } catch (error) {
      return { status: false, message: error };
    }

    return { status: true, message: 'profile created successfully' };
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

  async updateProfile(): Promise<any> {
    return null;
  }

  async followProfile(): Promise<any> {
    return null;
  }

  async unfollowProfile(address: string): Promise<any> {
    return address;
  }
}
