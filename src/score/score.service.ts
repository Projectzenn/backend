//here we want to use the polybase provider to genreate and store all the files with the encryption of our backend.
// we can publicly store the files but only the msg.sender can decrypt the files.
// how we do that is slightly different from the other services.

import { Injectable } from '@nestjs/common';


export interface Profile {
  address: string;
  username: string;
  name: string;
  email: string;
  job: string;
  company: string;
  industry: string;
}

@Injectable()
export class ScoreService {


  async githubScore(address: string): Promise<any> {
    return address;
  }

 
}
