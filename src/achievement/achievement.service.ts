//here we want to use the polybase provider to genreate and store all the files with the encryption of our backend.
// we can publicly store the files but only the msg.sender can decrypt the files.
// how we do that is slightly different from the other services.

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client/core";
import { Injectable } from "@nestjs/common";
import { ChainService } from "src/chain/chain.service";
import { GroupService } from "src/group/group.service";
import { PolybaseService, RequestMint } from "src/polybase/polybase.service";
import { ProjectService } from "src/project/project.service";

const groupsLink = new HttpLink({
  uri: "https://api.studio.thegraph.com/query/49385/groups/version/latest",
  fetch,
});

const clients = {
  8001: new ApolloClient({
    link: groupsLink,
    cache: new InMemoryCache(),
  }),
};

@Injectable()
export class AchievementService {
  //initiate polybase.
  constructor(
    private readonly ChainService: ChainService,
    private readonly PolybaseService: PolybaseService,
    private readonly GroupService: GroupService,
    private readonly ProjectService: ProjectService
  ) {}

  async getSingleAchievement(address: string, id: any): Promise<any> {
    const query = gql`
      {
      achievements(where: {group: "${address}", tokenId: "${id}"}) {
        id
        description
        group {
          id
          addr
        }
        locked
      }
    }`;

    const response = await clients[8001].query({
      query,
      fetchPolicy: "no-cache",
    });

    const requests = response.data.achievements;

    if (requests[0]?.description) {
      const metadata = await this.ChainService.fetchMetadata(
        requests[0].description
      );
      requests[0].metadata = metadata;
    }

    if (response.data.achievements.length == 0) {
      return [];
    }
    return requests[0];
  }

  async getContractAchievement(address: string): Promise<any> {
    const query = gql`
      {
        achievements(where: {group: "${address}"}){
          id
          tokenId
          group {
            id
          }
          description
          locked
        }
      }
    `;

    const response = await clients[8001].query({
      query,
      fetchPolicy: "no-cache",
    });

    if (response.data.achievements.length == 0) {
      return [];
    }

    const requests = response.data.achievements;

    for (let i = 0; i < requests.length; i++) {
      const metadata = await this.ChainService.fetchMetadata(
        requests[i].description
      );
      requests[i].metadata = metadata;
    }

    return requests;
  }

  async getAllAchievements(): Promise<any[]> {
    const query = gql`
      {
        achievements(first: 100) {
          id
          tokenId
          group {
            id
            name
            addr
          }
          description
          locked
        }
      }
    `;

    const response = await clients[8001].query({
      query,
      fetchPolicy: "no-cache",
    });

    const requests = response.data.achievements;

    //we want to fetch the metadata of each of the requests.
    for (let i = 0; i < requests.length; i++) {
      const metadata = await this.ChainService.fetchMetadata(
        requests[i].description
      );
      requests[i].metadata = metadata;
    }

    //we want to fetcht the metadata.

    if (response.data.achievements.length == 0) {
      return [];
    }
    return requests;
  }

  async requestAchievement(formData: RequestMint): Promise<any> {
    return this.PolybaseService.requestMint(formData);
  }

  async getPendingRequests(address: string): Promise<any> {
    const requests = await this.PolybaseService.getAchievementRequests(
      address,
      "open"
    );

    //also need to get the details of the achievemnt itself

    console.log(requests);

    for (let i = 0; i < requests.length; i++) {
      const contract = requests[i].contract;
      const tokenId = parseInt(requests[i].tokenId);
      requests[i].nft = await this.getSingleAchievement(contract, tokenId);

      if (requests[i].type === "individual") {
        requests[i].issuer = (
          await this.PolybaseService.getProfileByAddress(
            requests[i].data.requester
          )
        ).message;
      } else if (requests[i].type === "group") {
        requests[i].issuer = await this.GroupService.getGroup(
          requests[i].requester
        );
      } else if (requests[i].type === "project") {
        requests[i].issuer = await this.ProjectService.getProject(
          requests[i].requester
        );
      }
    }

    return requests;
  }
  
  async mintRequests(address: string): Promise<any> {
    const requests = await this.PolybaseService.getMintRequest(address);
    
    let results = [];
    
    for (let i = 0; i < requests.length; i++) {
      const achievement = await this.getSingleAchievement((requests[i] as any).contract, (requests[i] as any).tokenId);
      
      results.push({
        ...requests[i],
        achievement
      })
    }
    
    return results;

    
    
  }

  async updateAchievement(formData: any) {
    console.log(formData);
    const result = await this.PolybaseService.changeStatus(
      formData.id,
      formData.status
    );
    return result;
  }

  async getUserAchievements(address: string): Promise<any> {
    const query = gql`
   {
  achievementRewards(
    where: {member_: {address: "${address}"}}
  ) {
    id
    achievement{
      tokenId
      description
    }
  }
}
  `;

    const response = await clients[8001].query({
      query,
      fetchPolicy: "no-cache",
    });

    if (response.data.achievementRewards.length == 0) {
      return [];
    }
    
    

    const requests = response.data.achievementRewards;
    
    for (let i = 0; i < requests.length; i++) {
      let metadata = null;
      
      if(requests[i].achievement.description) {
      metadata = await this.ChainService.fetchMetadata(
        requests[i].achievement.description
      );
      }
      requests[i].metadata = metadata;
    }

    return requests;
  }
}
