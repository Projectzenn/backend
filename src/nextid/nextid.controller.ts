/**
 * Controller for Polybase API endpoints.
 */
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import axios from "axios";
import { PolybaseService } from "src/polybase/polybase.service";
import { NextidService } from "./nextid.service";

interface VerifyResponse {
    post_content: {
      default: string;
    };
    sign_payload: string;
    uuid: string;
    created_at: string;
    access_token: string;
    public_key: string;
    address:string;
  }
@Controller("nextid")
export class NextidController {
  constructor(private readonly svc: NextidService, private readonly polybaseService: PolybaseService) {}

  @Get("/user/profile/:platform/:address")
  async getUserProfile(
    @Param("platform") platform: string,
    @Param("address") address: string
  ) {
    const result = await this.svc.getMyProfile(platform, address);

    return result;
  }
  @Get("/user/nft/:address")
  async getUserSocials(@Param("address") address: string) {
    const result = await this.svc.getProfileNFT(address);

    return result;
  }

  @Get("/github")
  async githubCallback(
    @Query("code") code: string,
    @Query("publicKey") publicKey: string,

  ) {
    try {
      const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: "a9b9ed7176cb97a46f24",
          client_secret: "9d2343a26cb25454a5e0d4ce928363b41119e649",
          code,
        },
        {
          headers: { Accept: "application/json" },
        }
      );
      
      const userResponse = await axios.get(
        "https://api.github.com/user",
        {
          headers: { Authorization: `token ${tokenResponse.data.access_token}` },
        }
      );
      const username = userResponse.data.login;      
      const token = tokenResponse.data.access_token;
      const proof = {
        action: "create",
        platform: "github",
        identity: username,
        public_key: publicKey,
        //proof_location: gistResponse.data.id
      }
     const request =  await axios.post("https://proof-service.nextnext.id/v1/proof/payload", proof)
     console.log(request.data);  // This will log the public URL of the Gist
        const returnData = {...request.data, access_token: token, public_key: publicKey};

        return returnData;
        
    } catch (error) {
      console.error(error)
      return "error";
    }
  }
  


  @Post("/github/verify")
  async verifyProof(
    @Body() data: VerifyResponse,
  ) {
    const gist = {
        description: "Submitted by Careerzen",
        public: true,
        files: {
          [`${JSON.parse(data.post_content.default).persona}.json`]: {
            content: data.post_content.default,
          },
        },
      };
     
      console.log(data.access_token)
      const gistResponse = await axios.post("https://api.github.com/gists", gist, {
        headers: {
          Authorization: `token ${data.access_token}`,
        },
      });
     
           
    
    const proof = 
        {
            "action": "create",
            "platform": "github",
            "identity": gistResponse.data.owner.login,
            "proof_location": gistResponse.data.id,
            "public_key": data.public_key,
            "extra": {},
            "uuid": data.uuid,
            "created_at": data.created_at,
          }
    
    try {
      const verifyResponse = await axios.post("https://proof-service.nextnext.id/v1/proof", proof);
      
      console.log(verifyResponse)
      if(verifyResponse.status == 201) {
        this.polybaseService.updateGithub(data.address, gistResponse.data.owner.login, gistResponse.data.id) 
      }
      return verifyResponse.data;

    } catch (error) {
      console.error(error);
      return error;
    }
  }
  
}
