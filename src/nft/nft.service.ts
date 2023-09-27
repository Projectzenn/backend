//here we want to use the polybase provider to genreate and store all the files with the encryption of our backend.
// we can publicly store the files but only the msg.sender can decrypt the files.
// how we do that is slightly different from the other services.

import { Injectable } from "@nestjs/common";
import { Alchemy, Network, Nft } from "alchemy-sdk";

const config = {
  apiKey: "alcht_s0wd1yQoSYY2Ru97nr8pwMiGcjKvNX", // Replace with your API key
  network: Network.MATIC_MUMBAI, // Replace with your network
};
const alchemy = new Alchemy(config);

export interface NFTItem {
  name: string;
  image: string;
  category: string;
  contract: string;
  tokenid: string;
  type: "ERC721" | "ERC1155";
}
@Injectable()
export class NftService {
  async getAllNFTs(address: string): Promise<NFTItem[]> {

    
    // we will be testing it here for mumbai.
    let response = await alchemy.nft.getNftsForOwner(address);

    
    //so we want to make sure that we give back a result that has an name, image and category for each nft. 
    let result = response.ownedNfts.map((item) => {
      console.log(item)
      return {
        name: item.contract.name,
        image: item.tokenUri?.raw,
        category: item.tokenId,
        contract: item.contract?.address,
        tokenid: item.tokenId, 
        type: item.contract.tokenType
      } as NFTItem;
    });
    
    return result;
  }
  
  async getNFTsByContract(contract: string, tokenId: string): Promise<Nft> {
    //we want all the information about a nft. 
    const response = await alchemy.nft.getNftMetadata(
      contract,
      tokenId
    );
    
    return response
  }
  

  
}
