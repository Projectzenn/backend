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
import { NftService } from "src/nft/nft.service";
import { PolybaseService } from "src/polybase/polybase.service";
  
  //https://mumbai.polygonscan.com/address/0x6eF66aa692259C681adB7c728a0CD44cAdc81b42#code
  //SUPPORT FOR MORE NETWORKS IS POSSIBLE AS LONG AS THE GRAPH SUPPORTS IT.
  const nextidLink = new HttpLink({
    uri: "https://relation-service.nextnext.id",
    fetch,
  });
  
  const nextClient =  new ApolloClient({
      link: nextidLink,
      cache: new InMemoryCache(),
    });
  
  @Injectable()
  export class NextidService {
    //initiate polybase.
    constructor(
      private readonly ChainService: ChainService,
      private readonly NftService: NftService,
      private readonly PolybaseService: PolybaseService
    ) {}
  
  
  
    async getMyProfile(address: string): Promise<any[]> {
      const query = gql`
       query findOneIdentity {
        identity(platform: "twitter", identity: "${address}") {
          uuid
          platform
          identity
          displayName
          createdAt
          addedAt
          updatedAt
          neighborWithTraversal(depth: 5) {
            ... on ProofRecord {
              __typename
              source
              from {
                uuid
                platform
                identity
                displayName
              }
              to {
                uuid
                platform
                identity
                displayName
              }
            }
            ... on HoldRecord {
              __typename
              source
              from {
                uuid
                platform
                identity
                displayName
              }
              to {
                uuid
                platform
                identity
                displayName
              }
            }
          }
        }
      }
    `;
  
      const response = await nextClient.query({
        query,
        fetchPolicy: "no-cache",
      });
  
      console.log(response);
      return response.data.identity;
    }
  
    
      
 
  }
  