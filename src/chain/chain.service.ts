import { Injectable } from '@nestjs/common';
import { Address, parseAbiItem } from 'viem';
import { mumbaiClient } from './chain.helper';
import abi from './interaction.abi.json';
const CONTRACT = '0x19B97a92800a059b66f3A7D3085042edbcaD4dbB';

@Injectable()
export class ChainService {
  
  // Function to fetch metadata from IPFS
  private async fetchMetadata(cid: string): Promise<any> {
    const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
    if (!response.ok) {
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

    // Filter tokens that have metadata.category set to "background"
    const backgroundTokens = result.filter(token => token.metadata && token.metadata.category === 'background');
    const headTokens = result.filter(token => token.metadata && token.metadata.category === 'head');
    const jackedTokens = result.filter(token => token.metadata && token.metadata.category === 'jacket');
    const prizesToken = result.filter(token => token.metadata && token.metadata.category === 'prizes');

    
    
    return {
      'background': backgroundTokens,
      'head': headTokens,
      'jacket': jackedTokens,
      'prizes': prizesToken,
      
    };
}


  async mintProject() {
    console.log('minting project');
  }
  
  async getTokenDetail(contract: string, tokenid: string) {
    //reading the details 
    const result = await mumbaiClient.readContract({
      address: CONTRACT,
      abi: abi,
      functionName: 'getTokenInfo',
      args: [tokenid],
    }) as any;
    
    const metadata = await this.fetchMetadata(result.cid.toString());
    
    return {
      id: parseInt(result.tokenid.toString(), 10),
      cid: result.cid.toString(),
      metadata: metadata,
    };
  }
}
