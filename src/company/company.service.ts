//here we want to use the polybase provider to genreate and store all the files with the encryption of our backend.
// we can publicly store the files but only the msg.sender can decrypt the files.
// how we do that is slightly different from the other services.

import { Injectable } from "@nestjs/common";
import { ChainService } from "src/chain/chain.service";



@Injectable()
export class CompanyService {

  //initiate polybase.
  constructor(private readonly ChainService: ChainService) {

  }

}
