import { Injectable } from '@nestjs/common';
import { Address, parseAbiItem, parseEther } from 'viem';

import fetch from 'cross-fetch';
import { privateKeyToAccount } from 'viem/accounts';
import attrributesAbi from './attributes.abi.json';
import { client, mumbaiClient, polygonMumbai } from './chain.helper';
import { CompanyDetailsResult } from './chain.types';
import companyAbi from './company.abi.json';
import abi from './interaction.abi.json';
//const CONTRACT = '0x19B97a92800a059b66f3A7D3085042edbcaD4dbB';
const CONTRACT = '0xf9Ac80a9985bcD5Cbc8d7759b4e6CBd502A0c55C';
const COMPANY_REGISTRY = "0xbB037266FacF6B84A127E755e98408E8d2b53b32"
@Injectable()
export class ChainService {
  
  // Function to fetch metadata from IPFS
  async fetchMetadata(cid: string): Promise<any> {

    const response =  await fetch(`https://ipfs.io/ipfs/${cid}`);

    if (!response.ok) {
      return null;

    }
    return await response.json();
  }
  
  async getAllTokens() {
    const retrievedTokens = await mumbaiClient.getLogs({
      address: CONTRACT as Address,
      event: parseAbiItem('event TokenInfoAdded(uint256 tokenId, string cid)'),
      //fromBlock: 39248278n,
      fromBlock: 40608835n,
    });

    const result = await Promise.all(
      retrievedTokens.map(async (token: any) => {

        const metadata = await this.fetchMetadata(token.args.cid.toString());
        return {
          id: parseInt(token.args.tokenId.toString(), 10),
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


  return {result};
}

async getAllCompanies() {
  const retrievedTokens = await mumbaiClient.getLogs({
    address: COMPANY_REGISTRY as Address,
    event: parseAbiItem('event CompanyAdded(uint256 indexed companyId, string indexed name, string image, string details, address indexed creator, address addr)'),
    fromBlock: 39248278n,
  });
  

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

      return this.getTokenDetail(CONTRACT, token.args.id);
     
    })
  );

  
  return result;
}


  
  async getTokenDetail(contract: Address, tokenid: string) {
    //reading the details 
    const result = await mumbaiClient.readContract({
      address: contract,
      abi: abi,
      functionName: 'getCid',
      args: [tokenid],
    }) as any;
    
    const metadata = await this.fetchMetadata(result.toString());
    
    
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
  
  //SETUP OF ACCOUNT FOR ONBOARDS
  async sendFaucet(address: Address){
  
    const privateKey = process.env.PRIVATE_SENDER as Address;
    const account = privateKeyToAccount(privateKey);
  
    const transaction = await client.sendTransaction({
      account: account,
      to: address,
      value: parseEther("0.01"),
      chain: polygonMumbai
    });
    
    const watchTransaction = await mumbaiClient.waitForTransactionReceipt( 
      { hash: transaction }
    )
    
    if(watchTransaction.status == "success"){
      return {status: true, message: "success"}
    }

  }
  
  async sendOnboardAttributes(address: Address){
    
    const account = privateKeyToAccount(process.env.PRIVATE_SENDER as Address);
    const transaction = await client.writeContract({
      address: '0x7415cd60c8dBc185dAC077B7d543151f0bC9F50B',
      abi: attrributesAbi,
      functionName: 'mintBatch',
      chain: polygonMumbai,
      args: [address, [1,2,3,4,5]],
      account: account,
    })
    
    const watchTransaction = await mumbaiClient.waitForTransactionReceipt( 
      { hash: transaction }
    )
    
    if(watchTransaction.status == "success"){
      return {status: true, message: "success"}
    }
  }
}

