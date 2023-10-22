import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client/core";
import { Injectable } from "@nestjs/common";
import { ChainService } from "src/chain/chain.service";
import { PolybaseService } from "src/polybase/polybase.service";

const projectLink = new HttpLink({
  uri: "https://api.studio.thegraph.com/query/49385/projects/version/latest",
  fetch,
});

const clients = {
  8001: new ApolloClient({
    link: projectLink,
    cache: new InMemoryCache(),
  }),
};

//setup the project interface
export interface Project {
  name: string;
  image: string;
  category: string;
  contract: string;
  tokenid: string;
  type: "ERC721" | "ERC1155";
}
@Injectable()
export class ProjectService {
  constructor(
    private readonly ChainService: ChainService,
    private readonly PolybaseService: PolybaseService
  ) {}
  async getAllProjects(): Promise<any[]> {
    // we will be testing it here for mumbai.
    const query = gql`
      {
        projectCreateds(first: 30) {
          id
          name
          image
          details
          projectAddress
          pushChannel
          url
          deadline
          creator
          works {
            status
            id
            description
          }
          members {
            address
            tokenId
          }
        }
      }
    `;

    const response = await clients[8001].query({
      query,
      fetchPolicy: "no-cache",
    });

    console.log(response);
    const requests = response.data.projectCreateds;
   
    for (let i = 0; i < requests.length; i++) {
      if (requests[i].details) {
        console.log("fetching metadata");
        requests[i].members = requests[i].members.map((member) => member.address);
        await this.ChainService.fetchMetadata(requests[i].details).then(
          (metadata) => {
            console.log(metadata);

            if (metadata.urls?.length > 0) {
              metadata.urls = metadata.urls.map((item) => item.value);
            }
            requests[i] = {
              ...metadata,
              ...requests[i],
            };
          }
        );
      }
    }

    if (response.data.projectCreateds.length == 0) {
      return [];
    }
    return requests;
  }

  async getProject(address: string): Promise<any> {
    // we will be testing it here for mumbai.
    const query = gql`
      {
        projectCreated(id: "${address}"){
          id
          name
          image
          details
          projectAddress
          pushChannel
          url
          deadline
          creator
          works {
            status
            id
            description

          }
          members {
            address
          }}
        }

    `;

    const response = await clients[8001].query({
      query,
      fetchPolicy: "no-cache",
    });

  
    console.log(response);
    
    if (response.data.projectCreated == null) {
      return null;
    }
    let requests = response.data.projectCreated;

    //we need to do some convertion
    let addresses: string[] = [];
    

    if (requests.details) {
      console.log("fetching metadata");
      await this.ChainService.fetchMetadata(requests.details).then(
        (metadata) => {
          console.log(metadata);

          if (metadata.urls?.length > 0) {
            metadata.urls = metadata.urls.map((item) => item.value);
          }
          requests = {
            ...requests,
            ...metadata,
          };
        }
      );
    }

    //getting the chatId aswel
    let groupChat = await this.PolybaseService.getGroupChat(
      `${address}/${address}`
    );
    if (groupChat.length > 0) {
      groupChat = groupChat[0].data;
    }

    return {
      ...requests,
      chatId: groupChat,
    };
  }
}
