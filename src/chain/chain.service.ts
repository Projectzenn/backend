import { Injectable } from '@nestjs/common';
import { Address, parseAbiItem } from 'viem';

import fetch from 'cross-fetch';
import { mumbaiClient } from './chain.helper';
import { CompanyDetailsResult } from './chain.types';
import companyAbi from './company.abi.json';
import abi from './interaction.abi.json';
const CONTRACT = '0x19B97a92800a059b66f3A7D3085042edbcaD4dbB';
const COMPANY_REGISTRY = "0xbB037266FacF6B84A127E755e98408E8d2b53b32"

@Injectable()
export class ChainService {
  
  // Function to fetch metadata from IPFS
  private async fetchMetadata(cid: string): Promise<any> {
    console.log(cid);
    const response =  await fetch(`https://ipfs.io/ipfs/${cid}`);
    console.log(response);
    if (!response.ok) {
      return null;
      throw new Error('Failed to fetch metadata');
    }
    return await response.json();
  }
  
  async getAllTokens() {
    const retrievedTokens = await mumbaiClient.getLogs({
      address: CONTRACT as Address,
      event: parseAbiItem('event TokenInfoAdded(uint indexed tokenid, string cid)'),
      fromBlock: 39248278n,
    });

    const result = await Promise.all(
      retrievedTokens.map(async (token: any) => {
        console.log(token.args.cid.toString());
        console.log(token);
        const metadata = await this.fetchMetadata(token.args.cid.toString());
        return {
          id: parseInt(token.args.tokenid.toString(), 10),
          cid: token.args.cid.toString(),
          metadata: metadata,
        };
      })
    );   
    
    return result;
}

async getTokens(address: Address) {
  
  const retrievedTokens = await mumbaiClient.getLogs({
    address: CONTRACT as Address,
    event: parseAbiItem('event TokenInfoAdded(uint indexed tokenid, string cid)'),
    fromBlock: 40608835n,
  })
  
  const result = await Promise.all(
    retrievedTokens.map(async (token: any) => {
     const metadata = await this.fetchMetadata(token.args.cid.toString());
      return {
        id: parseInt(token.args.tokenid.toString(), 10),
        cid: token.args.cid.toString(),
        metadata: metadata,
      };
    })
  );

    console.log(result);
  return {result};
}

async getAllCompanies() {
  console.log("getting all the companies soon...")
  const retrievedTokens = await mumbaiClient.getLogs({
    address: COMPANY_REGISTRY as Address,
    event: parseAbiItem('event CompanyAdded(uint256 indexed companyId, string indexed name, string image, string details, address indexed creator, address addr)'),
    fromBlock: 39248278n,
  });
  
  console.log(retrievedTokens);

  const result = await Promise.all(
    retrievedTokens.map(async (token: any) => {
      const metadata = await this.fetchMetadata(token.args.details.toString());
      return {
        id: token.args.companyId.toString(),
        name: token.args.name.toString(),
        image: token.args.image.toString(),
        creator: token.args.creator.toString(),
        addr: token.args.addr.toString(),
        details_url: token.args.details.toString(),
        details: metadata,
      };
    })
  );
  
  
  return result;
}

async getCompanyDetails(address: string){
  //try to read from the contract in order to get this detais. 
  
}

async getAllTokenHolders(address:string){
  
}

async getUserTokens(address: string) {
  const retrievedTokens = await mumbaiClient.getLogs({
    address: CONTRACT as Address,
    event: parseAbiItem('event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)'),
    fromBlock: 39248278n,
    args: {
      operator: "0xE4E78523FDa823973D0484Bd2dC7bC34343d68fd",
      from: '0x0000000000000000000000000000000000000000' as Address,
      to: address as Address
    }
  });
  
  

  const result = await Promise.all(
    retrievedTokens.map(async (token: any) => {
      console.log(token.args.id); 
      return this.getTokenDetail('', token.args.id);
     
    })
  );

  
  return result;
}


  async mintProject() {
    console.log('minting project');
  }
  
  async getTokenDetail(contract: string, tokenid: string) {
    //reading the details 
    const result = await mumbaiClient.readContract({
      address: CONTRACT,
      abi: abi,
      functionName: 'getCid',
      args: [tokenid],
    }) as any;
    
    console.log(result)
    console.log(tokenid)
    const metadata = await this.fetchMetadata(result.toString());
    console.log(metadata);
    
    return {
      cid: result,
      metadata: metadata,
      contract: contract, 
      tokenid: tokenid
    };
  }
  
  async getCompanyContractDetails(address: Address) : Promise<CompanyDetailsResult> {
    //reading the details 
    const result = await mumbaiClient.readContract({
      address: address,
      abi: companyAbi,
      functionName: 'details'
    }) as any;
    
    //this returns me a cid.
    
    const metadata = await this.fetchMetadata(result.toString());
    console.log(metadata);
    
    
    return {
      details: result, 
      name: metadata.groupName, 
      image: metadata.image,
      description: metadata.introduction, 
      urls: metadata.urls, 
      email: metadata.email,
      type: metadata.type,
      owner: ""
    };
  }
}

