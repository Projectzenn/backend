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
  constructor(private readonly ChainService: ChainService) {}

  async getSingleAchievement(address: string, id: any): Promise<any> {
    //we want to get all the tokens the users account holds, then we want to get the details of each token.
    //then we want to return the details of each token.
    const query = gql`
      {
      achievements(where: {group: "${address}", id: "${id}"}) {
        id
        description
        group {
          id
          addr
        }
        locked
      }
    }
  `;

  const response = await clients[8001].query({
    query,
    fetchPolicy: "no-cache",
  });

  console.log(response);
  const requests = response.data.achievements;
  
  //we want to fetch the metadata of each of the requests.

    const metadata = await this.ChainService.fetchMetadata(requests[0].description);
    requests[0].metadata = metadata;


  //we want to fetcht the metadata.

  if (response.data.achievements.length == 0) {
    return [];
  }
  return requests[0];

  
  
  }

  async getContractAchievement(address: string): Promise<any> {
    //get achievement by contract.. 
    //get all the achievements by contract.
   
      const query = gql`
      {
        achievements(where: {group: "${address}"}){
          id
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

    console.log(response);
    const requests = response.data.achievements;
    
    //we want to fetch the metadata of each of the requests.
    for (let i = 0; i < requests.length; i++) {
      const metadata = await this.ChainService.fetchMetadata(requests[i].description);
      requests[i].metadata = metadata;
    }

    //we want to fetcht the metadata.

    if (response.data.achievements.length == 0) {
      return [];
    }
    return requests;

    
  }

  async getAllAchievements(): Promise<any[]> {
    const query = gql`
      {
        achievements(first: 100) {
          id
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

    console.log(response);
    const requests = response.data.achievements;
    
    //we want to fetch the metadata of each of the requests.
    for (let i = 0; i < requests.length; i++) {
      const metadata = await this.ChainService.fetchMetadata(requests[i].description);
      requests[i].metadata = metadata;
    }

    //we want to fetcht the metadata.

    if (response.data.achievements.length == 0) {
      return [];
    }
    return requests;

  }
}
