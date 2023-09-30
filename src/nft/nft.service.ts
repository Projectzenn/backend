//here we want to use the polybase provider to genreate and store all the files with the encryption of our backend.
// we can publicly store the files but only the msg.sender can decrypt the files.
// how we do that is slightly different from the other services.

import { Injectable } from "@nestjs/common";
import { Alchemy, Network, Nft } from "alchemy-sdk";
import { ChainService } from "src/chain/chain.service";

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
  constructor(private readonly ChainService: ChainService) {}
  async getAllNFTs(address: string): Promise<NFTItem[]> {
    // we will be testing it here for mumbai.
    let response = await alchemy.nft.getNftsForOwner(address);

    //we need to do here is doing to same we did for hte minting process.
    const allItems: any[] = [];
    for (const mint of response.ownedNfts) {
      try {
        const nftDetails = await this.ChainService.getTokenDetail(
          mint.contract.address,
          mint.tokenId
        );
        allItems.push({
          nft: nftDetails,
          ...mint,
          image: "https://ipfs.io/ipfs/" + nftDetails.metadata.image,
          name: nftDetails.metadata.name,
          category: nftDetails.metadata.category,
          contract: mint.contract.address,
          tokenId: mint.tokenId,
        });
      } catch (error) {
        allItems.push("could not decrypt");
      }
    }
    return allItems;
  }

  async getNFTsByContract(contract: string, tokenId: string): Promise<Nft> {
    //we want all the information about a nft.
    const response = await alchemy.nft.getNftMetadata(contract, tokenId);
    
    
    
    return response;
  }
  
  async getOwnersForContract(contractAddress: string): Promise<any> {
    const owners = await alchemy.nft.getOwnersForContract(contractAddress);
    return owners;
  }
}
