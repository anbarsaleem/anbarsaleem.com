import { writeFileSync, existsSync } from "fs";

const GRAPH_URL =
  "https://raw.githubusercontent.com/anbarsaleem/cv-graph/main/graph.json";
const OUT_PATH = "public/graph.json";
const PROJECTS_OUT_PATH = "public/projects.json";
const USERNAME = "anbarsaleem";

async function fetchGraph() {
  if (existsSync(OUT_PATH) && !process.env.CI) {
    console.log(`[fetch-graph] ${OUT_PATH} exists locally, skipping fetch`);
    return;
  }

  console.log(`[fetch-graph] Fetching from ${GRAPH_URL}`);
  const res = await fetch(GRAPH_URL);
  if (!res.ok) {
    console.warn(
      `[fetch-graph] Failed to fetch (${res.status}), using existing file`
    );
    return;
  }

  const data = await res.text();
  writeFileSync(OUT_PATH, data);
  const parsed = JSON.parse(data);
  console.log(
    `[fetch-graph] Wrote ${parsed.meta.total_nodes} nodes, ${parsed.meta.total_edges} edges`
  );
}

async function fetchProjects() {
  if (existsSync(PROJECTS_OUT_PATH) && !process.env.CI) {
    console.log(`[fetch-projects] ${PROJECTS_OUT_PATH} exists locally, skipping fetch`);
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept: "application/vnd.github+json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log(`[fetch-projects] Fetching repos for ${USERNAME}`);
  const reposRes = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?type=all&sort=pushed&direction=desc&per_page=50`,
    { headers }
  );
  if (!reposRes.ok) {
    console.warn(
      `[fetch-projects] Failed to fetch repos (${reposRes.status}), using existing file`
    );
    return;
  }

  const repos = await reposRes.json();
  const publicRepos = repos.filter(
    (r) => !r.private && r.description
  );

  console.log(`[fetch-projects] Found ${publicRepos.length} public repos with descriptions`);

  const contributorChecks = await Promise.all(
    publicRepos.map(async (repo) => {
      try {
        const contribRes = await fetch(
          `https://api.github.com/repos/${USERNAME}/${repo.name}/contributors?per_page=30`,
          { headers }
        );
        const contribs = await contribRes.json();
        const isContrib =
          Array.isArray(contribs) &&
          contribs.some(
            (c) => c.login?.toLowerCase() === USERNAME
          );
        return isContrib ? repo : null;
      } catch {
        return null;
      }
    })
  );
  const filtered = contributorChecks.filter(Boolean);

  console.log(`[fetch-projects] ${filtered.length} repos where ${USERNAME} is a contributor`);

  const projects = await Promise.all(
    filtered.map(async (repo) => {
      try {
        const langRes = await fetch(repo.languages_url, { headers });
        const languages = await langRes.json();
        return {
          name: repo.name,
          description: repo.description,
          html_url: repo.html_url,
          languages: Object.keys(languages),
          pushed_at: repo.pushed_at,
        };
      } catch {
        return null;
      }
    })
  );

  const validProjects = projects.filter(Boolean).sort(
    (a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
  );

  writeFileSync(PROJECTS_OUT_PATH, JSON.stringify(validProjects, null, 2));
  console.log(`[fetch-projects] Wrote ${validProjects.length} projects`);
}

await fetchGraph();
await fetchProjects();
