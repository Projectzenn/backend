//here we want to use the polybase provider to genreate and store all the files with the encryption of our backend.
// we can publicly store the files but only the msg.sender can decrypt the files.
// how we do that is slightly different from the other services.

import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client/core";
import { Injectable } from "@nestjs/common";
import { ChainService } from "src/chain/chain.service";
import { NftService } from "src/nft/nft.service";
import { PolybaseService } from "src/polybase/polybase.service";
import { Address } from "viem";

//https://mumbai.polygonscan.com/address/0x6eF66aa692259C681adB7c728a0CD44cAdc81b42#code
//SUPPORT FOR MORE NETWORKS IS POSSIBLE AS LONG AS THE GRAPH SUPPORTS IT.
const billboardLink = new HttpLink({
  uri: "https://api.studio.thegraph.com/query/49385/groups/version/latest",
  fetch,
});

const clients = {
  8001: new ApolloClient({
    link: billboardLink,
    cache: new InMemoryCache(),
  }),
};

@Injectable()
export class GroupService {
  //initiate polybase.
  constructor(
    private readonly ChainService: ChainService,
    private readonly NftService: NftService,
    private readonly PolybaseService: PolybaseService
  ) {}

  async getMyGroups(address: string): Promise<any> {
    //we want to get all the tokens the users account holds, then we want to get the details of each token.
    //then we want to return the details of each token.
    const tokens = await this.NftService.getAllNFTs(address);

    //get the list of all the nft collections of group and filter them our here.

    return tokens;
  }
  
  async getGroup(address: string): Promise<any> {
    let groupChat = await this.getGroupChat(`${address}/${address}`);
    const groupDetail = await this.ChainService.getCompanyContractDetails(address as Address);
    const members = await this.NftService.getOwnersForContract(address);
    
    if(groupChat.length > 0){
      groupChat = groupChat[0].data
    }
    
    return {
      owners: members.owners,
      details:groupDetail,
      address:address,
      chat: groupChat,
    };
  }
  

  async getAllGroups(): Promise<any[]> {
    const query = gql`
      {
        groupCreateds(first: 5) {
          id
          details
          image
          addr
          name
          creator
          blockTimestamp
        }
      }
    `;

    const response = await clients[8001].query({
      query,
      fetchPolicy: "no-cache",
    });

    console.log(response)
    const requests = response.data.groupCreateds;

    if (response.data.groupCreateds.length == 0) {
      return [];
    }
    return requests;

    return [];
  }
  
  
  async saveGroupChat(from:string, to:string, chatId: string): Promise<any> {
    this.PolybaseService.saveGroupChat(from, to, chatId);
  }
  async getGroupChat(id: string): Promise<any> {
    return this.PolybaseService.getGroupChat(id);
    
  }
}
