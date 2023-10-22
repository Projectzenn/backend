//here we want to use the polybase provider to genreate and store all the files with the encryption of our backend.
// we can publicly store the files but only the msg.sender can decrypt the files.
// how we do that is slightly different from the other services.

import { Injectable } from "@nestjs/common";

@Injectable()
export class GithubService {
  async githubScore(username: string): Promise<any> {
    const res = await fetch(`https://api.github.com/users/${username}`);
    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.message);
    }

    return data;
  }
  async hasContributed(username: string, repo: string): Promise<boolean> {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repo}/contributors`
      );
      if (!res.ok) {
        throw new Error(
          `Failed to fetch contributors for ${repo}. HTTP Status: ${res.status}`
        );
      }
      const contributors = await res.json();
      const userContribution = contributors.find(
        (contrib) => contrib.login === username
      );
      return !!userContribution; // Convert to boolean; true if found, false otherwise.
    } catch (error) {
      console.error(`Error occurred in hasContributed: ${error.message}`);
      throw error;
    }
  }

  async usersRepo(username: string): Promise<any> {
    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!res.ok) {
        throw new Error(
          `Failed to fetch repositories for ${username}. HTTP Status: ${res.status}`
        );
      }
      let repositories;
      try {
        repositories = await res.json();
      } catch (jsonError) {
        throw new Error(
          `Failed to parse repositories JSON for ${username}. Error: ${jsonError.message}`
        );
      }

      const contributions = [];

      for (let repo of repositories) {
        console.log(repo);
        const contribRes = await fetch(
          `https://api.github.com/repos/${repo.full_name}/contributors`
        );
        if (!contribRes.ok) {
          console.error(
            `Failed to fetch contributors for ${repo.full_name}. Skipping this repo.`
          );
          continue; // Skip processing this repo and move on to the next one.
        }
        let contributors;
        try {
          contributors = await contribRes.json();
        } catch (jsonError) {
          console.error(
            `Failed to parse contributors JSON for ${repo.full_name}. Error: ${jsonError.message}`
          );
          continue; // Skip processing this repo and move on to the next one.
        }

        console.log(contributors);
        const userContribution = contributors.find(
          (contrib) => contrib.login === username
        );

        if (userContribution) {
          contributions.push({
            repoName: repo.name,
            contributions: userContribution.contributions,
          });
        }
      }

      console.log(contributions);
      return contributions;
    } catch (error) {
      console.error(`Error occurred in usersRepo: ${error.message}`);
      throw error; // Re-throw the error to let the caller handle it or to propagate it further up.
    }
  }

  async fetchRepoLanguages(repoUrl: string) {
    const languages = await fetch(`${repoUrl}/languages`).then((res) =>
      res.json()
    );

    if (languages.status !== 200) {
      throw new Error("Failed to fetch languages from GitHub.");
    }

    return languages.data;
  }

  async getUserLanguages(username: string) {
    const repos = await this.usersRepo(username);

    const languagesData = await Promise.all(
      repos.map((repo) => this.fetchRepoLanguages(repo.languages_url))
    );

    const languagesSummary = {};

    languagesData.forEach((langData) => {
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

  async getHackathons(): Promise<any> {
    const res = await fetch(
      `https://devpost.com/software/search?page=1&query=blockchain`
    );
    const data = await res.json();

    return data;
  }
}
