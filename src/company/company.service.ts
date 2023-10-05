//here we want to use the polybase provider to genreate and store all the files with the encryption of our backend.
// we can publicly store the files but only the msg.sender can decrypt the files.
// how we do that is slightly different from the other services.

import { Injectable } from "@nestjs/common";
import { ChainService } from "src/chain/chain.service";
import { NftService } from "src/nft/nft.service";
import { PolybaseService } from "src/polybase/polybase.service";
import { Address, getAddress } from "viem";
import { CompanyDetails } from "./company.types";





@Injectable()
export class CompanyService {

  //initiate polybase.
  constructor(private readonly ChainService: ChainService, private readonly NftService:NftService,
    private readonly PolybaseService: PolybaseService
    ) {}
  
    
    async getCompanyDetails(address:string): Promise<CompanyDetails>{
        
        const ownersResponse = await this.NftService.getOwnersForContract(address);
    
        const details = await this.ChainService.getCompanyContractDetails(address as Address);
        
        return {
            owners: ownersResponse.owners,
            details:details,
            address:address
        }
        
    }
    
    async getMembers(address:string): Promise<any[]>{
        const ownersResponse = await this.NftService.getOwnersForContract(address);
        
        //loop over eachowner and return 
        const members = [];
        for (const owner of ownersResponse.owners){
            const userAddress = getAddress(owner)
            const details = await this.PolybaseService.getProfileByTBA(userAddress);
            members.push(details.message);
        }
        
        return members
    }

}
