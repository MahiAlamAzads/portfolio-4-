// src/services/github.ts
// GitHub API integration – auto-import pinned/public repos as projects.

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const GITHUB_API = "https://api.github.com";
const USERNAME = process.env.GITHUB_USERNAME ?? "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
}

// Fetch public repos for a user
export async function fetchGitHubRepos(
  username = USERNAME,
  perPage = 30,
): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/repos?sort=updated&per_page=${perPage}&type=owner`,
    { headers, next: { revalidate: 3600 } },
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

// Sync GitHub repos to Prisma projects (upsert by slug)
export async function syncGitHubProjects(username = USERNAME) {
  const repos = await fetchGitHubRepos(username);
  // console.log("Repos:", repos);
  const filtered = repos.filter((r) => !r.fork && !r.archived);

  console.log("Repos:", repos);
  console.log("Filtered:", filtered.length);

  const results = await Promise.allSettled(
    filtered.map((repo) =>
      prisma.project.upsert({
        where: { slug: slugify(repo.name) },
        create: {
          title: repo.full_name.split("/")[1] ?? repo.name,
          slug: slugify(repo.name),
          summary: repo.description ?? "",
          description: repo.description ?? "",
          techStack: repo.language
            ? [repo.language, ...repo.topics]
            : repo.topics,
          githubUrl: repo.html_url,
          liveUrl: repo.homepage ?? undefined,
          status: "COMPLETED",
          featured: false,
          category: "Open Source",
        },
        update: {
          summary: repo.description ?? "",
          liveUrl: repo.homepage ?? undefined,
          techStack: repo.language
            ? [repo.language, ...repo.topics]
            : repo.topics,
        },
      }),
    ),
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return { synced: succeeded, failed, total: filtered.length };
}
