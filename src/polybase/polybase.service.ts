//here we want to use the polybase provider to genreate and store all the files with the encryption of our backend.
// we can publicly store the files but only the msg.sender can decrypt the files.
// how we do that is slightly different from the other services.

import { Injectable } from "@nestjs/common";
import { Collection, Polybase } from "@polybase/client";
import { randomBytes } from "crypto";
import { uuidV4 } from "ethers";
import { ChainService } from "src/chain/chain.service";
import { getPolybaseInstance } from "src/utils/polybase/getPolybaseInstance";
import { Address, getAddress } from "viem";

export interface Profile {
  address: string;
  username: string;
  name: string;
  email: string;
  job: string;
  description: string;
}

export enum RequestType {
  Individual = "individual",
  Group = "group",
  Project = "project",
}

export interface RequestMint {
  contract: string;
  tokenId: string;
  data: string[];
  type: RequestType;
  requester: string;
  tokenbound: string;
}

@Injectable()
export class PolybaseService {
  db: Polybase;
  profile: Collection<any>;
  mintRequest: Collection<any>;
  follow: Collection<any>;
  groupChat: Collection<any>;

  //initiate polybase.
  constructor(
    private readonly ChainService: ChainService,
  ) {
    this.db = getPolybaseInstance();
    this.profile = this.db.collection("User");
    this.follow = this.db.collection("Followers");
    this.mintRequest = this.db.collection("MintRequest");
    this.groupChat = this.db.collection("GroupChat");
  }

  async getProfileByAddress(address: string): Promise<any> {
    const response = await this.profile.where("id", "==", address).get();

    if (response.data.length === 0) {
      return { status: false, message: "profile not found" };
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

      //if this is an success we going to mint the nft
      await this.ChainService.sendFaucet(formData.address as Address);
    } catch (error) {
      return { status: false, message: error };
    }

    return { status: true, message: "profile created successfully" };
  }

  async requestMint(formData: RequestMint): Promise<any> {
    const id = uuidV4(randomBytes(16));
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (!formData.type) {
      formData.type = RequestType.Individual;
    }
    try {
      await this.mintRequest.create([
        id,
        formData.contract,
        formData.tokenId,
        formData.type,
        formData.data,
        formData.requester,
        formData.tokenbound,
        currentTimestamp,
      ]);
    } catch (error) {
      return { status: false, message: error };
    }

    return { status: true, message: "Successfully requested mint." };
  }

  async getProfiles(): Promise<any> {
    const response = await this.profile.get();

    let profiles = [];
    for (const item of response.data) {
      try {
        profiles.push(item.data);
      } catch (error) {
        return error;
      }
    }
    return profiles;
  }

  async getProfileByTBA(tba: Address): Promise<any> {
    console.log(tba);
    tba = getAddress(tba);

    const response = await this.profile.where("TBA", "==", tba).get();

    console.log(response.data);
    if (response.data.length === 0) {
      return { status: false, message: "profile not found" };
    }
    return { status: true, message: response.data[0].data };
  }

  async getRequests(): Promise<any> {
    const response = await this.mintRequest.get();

    let requests = [];
    for (const item of response.data) {
      try {
        requests.push(item.data);
      } catch (error) {
        return error;
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
    return { status: true, message: "followed successfully" };
  }
  async unfollow(address: string, followee: string): Promise<any> {
    //get the id of this and then delete.
    try {
      await this.follow.record(address + "/" + followee).call("unfollow", []);
    } catch (e) {
      return e;
    }

    return followee;
  }
  
  async updateGithub(address: string, github: string, proof:string): Promise<any> {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const response = await this.profile
      .record(address)
      .call("updateGithub", [github, proof, timestamp]);

    return response.data;
  }

  async getFollowers(address: string): Promise<any> {
    //get all the folloewers of a users.
    try {
      const response = await this.follow.where("follower", "==", address).get();

      const followers = [];
      for (const item of response.data) {
        try {
          followers.push(item.data.followee);
        } catch (error) {
          throw new Error(error);
        }
      }
      return followers;
    } catch (e) {
      new Error(e);
      return e;
    }
  }
  async getFollowing(address: string): Promise<any> {
    try {
      const response = await this.follow.where("followee", "==", address).get();

      const followers = [];
      for (const item of response.data) {
        try {
          followers.push(item.data.follower);
        } catch (error) {
          new Error(error);
        }
      }
      return followers;
    } catch (e) {
      new Error(e);
      return e;
    }
  }

  async updateAvatar(address: string, avatar: string): Promise<any> {
    const response = await this.profile
      .record(address)
      .call("updateAvatar", [avatar]);

    return response.data;
  }

  async updateNFT(address: string, nft: string[]): Promise<any> {
    const response = await this.profile
      .record(address)
      .call("updateNFT", [nft]);

    return response.data;
  }

  async updateProfile(formData: any): Promise<any> {
    const response = await this.profile
      .record(formData.address)
      .call("updateProfile", [
        formData.email,
        formData.job,
        formData.company,
        formData.industry,
        formData.label,
      ]);

    return response.data;
  }

  async deleteMintRequest(id: string) {
    const response = await this.mintRequest
      .record(id)
      .call("deleteRequest", []);

    return response;
  }

  async updateTokenBound(address: string, tba: string): Promise<any> {
    const response = await this.profile
      .record(address)
      .call("updateTBA", [tba]);

    //check if tokenbound is address
    await this.ChainService.sendOnboardAttributes(tba as Address);

    const nft = [
      "bafkreidutepul5by5atjpebnchfscmd7s5r4pzaiezxnazuq5kdveu2fgq",
      "bafkreidlzc4pnszwiyx73yqlbwgkchyuendxkfq63sp54vhnky3ruti5xu",
      "bafkreihdqgem6jwebjyiahy6e4mgf5xdrqam3yaxq2ki2ew4hw6tjxq7du",
      "bafkreigjctpasi7b2ytsn7mx47wjobnqkvioi4vllg7dqwzzvw7u2lijme",
      "bafkreif6oi5pwrjzey5q4pmyd3zck6a53uoefozxydapiipgq2flsbldsi",
      "bafkreiabd3cfto7a7tjwgr5zikce476jxeeekmeif357t7v3g64uolgose",
    ];
    this.updateNFT(address, nft);

    return response.data;
  }
  async getNFTOnMinting(address: string) {
    const response = await this.mintRequest
      .where("requester", "==", address)
      .get();

    const allItems: any[] = [];
    for (const mint of response.data) {
      try {
        const nftDetails = await this.ChainService.getTokenDetail(
          mint.data.contract,
          mint.data.tokenId
        );
        allItems.push({
          nft: nftDetails,
          ...mint.data,
          image: "https://ipfs.io/ipfs/" + nftDetails.metadata.image,
          name: nftDetails.metadata.name,
          contract: mint.data.contract,
          tokenId: mint.data.tokenId,
          category: nftDetails.metadata.category,
        });
      } catch (error) {
        allItems.push("could not decrypt");
      }
    }
    return allItems;
  }
  
  async getMintRequest(id: string) {
    const response = await this.mintRequest.where("requester", "==", id).get();

    return response.data.map(item => item.data);

  }

  async followProfile(): Promise<any> {
    return null;
  }

  async changeStatus(id: string, status:string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const response = await this.mintRequest
      .record(id)
      .call("updateStatus", [status, timestamp]);
    return response;
  }

  async getCompanyJoin(address: string, status?: string) {
    let response;
    if (status) {
      response = await this.mintRequest
        .where("contract", "==", address)
        .where("tokenId", "==", "0")
        .where("status", "==", status)
        .get();
    } else {
      response = await this.mintRequest.where("contract", "==", address).get();
    }

    //we also want to get all the profiles of the useres here.
    //we can do that by using the profile collection.
    const requests: any[] = [];
    for (const request of response.data) {
      try {
        const nftDetails = await this.getProfileByAddress(
          request.data.requester
        );
        requests.push({
          request: request.data,
          profile: nftDetails.message,
        });
      } catch (error) {
        requests.push("could not decrypt");
      }
    }

    return requests;
  }

  async getAchievementRequests(address: string, status?: string): Promise<any[]> {
    let response;
    if (status) {
      response = await this.mintRequest
        .where("contract", "==", address)
        .where("status", "==", status)
        .get();
    } else {
      response = await this.mintRequest.where("contract", "==", address).get();
    }

    response.data = response.data.filter(
      (request) => request.data.tokenId !== "0"
    );
    const results = [];
    for (const request of response.data) {
      results.push(request.data);
    }
    return results;
  }

  async saveGroupChat(from: string, to: string, chatId: string) {
    await this.groupChat
      .create([from, to, chatId])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(error);
        //throw error here..

        return error;
      });
  }

  async getGroupChat(id: string) {
    const response = await this.groupChat.where("id", "==", id).get();

    return response.data;
  }
}
