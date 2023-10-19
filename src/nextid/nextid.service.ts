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

const nextClient = new ApolloClient({
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

  async getProfileNFT(address: string) {
    const query = gql`
     {
        identity(
          platform: "ethereum"
          identity: "${address}"
        ) {
          uuid
          platform
          identity
          displayName
          createdAt
          addedAt
          updatedAt
          nft {
            id
            category
            address
            chain
            source
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

  async getMyProfile(platform: string, address: string): Promise<any[]> {

    address = address.toLowerCase();

    const query = gql`
      query findOneIdentityWithSource($platform: String!, $identity: String!) {
        identity(platform: $platform, identity: $identity) {
          uuid
          platform
          identity
          displayName
          createdAt
          addedAt
          updatedAt
          # Here we perform a 3-depth deep search for this identity's "neighbor".
          neighbor(depth: 5) {
            sources # Which upstreams provide these connection infos.
            identity {
              uuid
              platform
              identity
              displayName
            }
          }
        }
      }
    `;

    const response = await nextClient.query({
      query,
      variables: {
        platform: platform,
        identity: address,
      },
      fetchPolicy: "no-cache",
    });

    console.log(response);
    return response.data.identity;
  }
}
