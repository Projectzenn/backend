//here we want to use the polybase provider to genreate and store all the files with the encryption of our backend.
// we can publicly store the files but only the msg.sender can decrypt the files.
// how we do that is slightly different from the other services.

import { Injectable } from "@nestjs/common";


@Injectable()
export class ScoreService {
  async githubScore(username: string): Promise<any> {
    console.log("searching for the username")
    const res = await fetch(`https://api.github.com/users/${username}`);
    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.message);
    }

    return data;
  }
  
  async usersRepo(username: string): Promise<any> {
    //getting all the repors
    
    const res = await fetch(`https://api.github.com/users/${username}/repos`);
    const repositories = await res.json();
    
    //now we want to loop over the repositories and fetch the data it is using. 
    
    
    ///do nothing 
    return 0;
    }
   
    async fetchRepoLanguages(repoUrl: string) {
        const languages = await fetch(`${repoUrl}/languages`).then(res => res.json());
    
        if (languages.status !== 200) {
          throw new Error("Failed to fetch languages from GitHub.");
        }
        
        return languages.data;
      }
    
      async getUserLanguages(username: string) {
        const repos = await this.usersRepo(username);
        console.log(repos);
        const languagesData = await Promise.all(repos.map(repo => this.fetchRepoLanguages(repo.languages_url)));
    
        const languagesSummary = {};
    
        languagesData.forEach(langData => {
          for (const lang in langData) {
            if (languagesSummary[lang]) {
              languagesSummary[lang] += langData[lang];
            } else {
              languagesSummary[lang] = langData[lang];
            }
          }
        });
    
        return languagesSummary;
      }
    
      assignSkillLevel(languagesSummary) {
        const skillLevels = {};
    
        for (const lang in languagesSummary) {
          const bytes = languagesSummary[lang];
          if (bytes < 10000) {
            skillLevels[lang] = "Beginner";
          } else if (bytes < 100000) {
            skillLevels[lang] = "Intermediate";
          } else {
            skillLevels[lang] = "Expert";
          }
        }
    
        return skillLevels;
      }
    
      async getUserSkillLevels(username: string): Promise<any> {
        const languagesSummary = await this.getUserLanguages(username);
        return this.assignSkillLevel(languagesSummary);
      }
}
