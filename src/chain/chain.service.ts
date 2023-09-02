import { Injectable } from '@nestjs/common';
import { Address, parseAbiItem } from 'viem';
import { mumbaiClient } from './chain.helper';
//https://mumbai.polygonscan.com/address/0x6eF66aa692259C681adB7c728a0CD44cAdc81b42#code
const CONTRACT = '0xf1b80F765DcbaD95748E989D46AC23a1afB92105';

@Injectable()
export class ChainService {
  async getAllTokens() {
    const retrievedTokens = await mumbaiClient.getLogs({
      address: CONTRACT as Address,
      event: parseAbiItem('event TokenInfoAdded(uint indexed tokenid)'),
      fromBlock: 39248278n,
    });

    const result = retrievedTokens.map((token: any) => {
      return {
        id: token.args.tokenId,
      };
    });

    return result;
  }

  async mintProject() {
    console.log('minting project');
  }
}
