const GITHUB_API_BASE_URL = "https://api.github.com";
const USERNAME = "anbarsaleem";

const FEATURED_REPOS = [
  "local-llm-stack",
  "homelab",
  "Fitbit2AppleHealth",
  "AI-Course-Mentor-NJIT",
  "watchparty-go",
  "Pixabay-React-App"
];

const REPO_OVERRIDES = {
  "local-llm-stack": "Self-hosted AI inference platform on an RTX 3090 Ti. Docker Compose orchestrates Ollama, Open WebUI, and SearXNG with dual-GPU management and Cloudflare Tunnel for remote access.",
  "homelab": "Personal infrastructure lab on Proxmox VE with 8 Ansible playbooks for automated provisioning, a Go-based job scraping tool (JobScout), and Prometheus + Grafana observability via Tailscale.",
  "Fitbit2AppleHealth": "Full-stack iOS app for migrating Fitbit health data to Apple Health. Express.js backend with OAuth, Ionic/Vue frontend, and Swift HealthKit integration.",
  "AI-Course-Mentor-NJIT": "RAG-powered course recommendation assistant built with OpenAI API, Streamlit, and Docker. Deployed on DigitalOcean with multithreaded data scraping pipelines.",
  "watchparty-go": "Real-time video synchronization application built in Go for synchronized media playback across clients.",
  "Pixabay-React-App": "Image gallery application built with React, TypeScript, and Tailwind CSS, powered by the Pixabay API."
};

const TAG_COLORS = {
  java: "#B07219",
  html: "#E34C26",
  css: "#563D7C",
  javascript: "#D8C84F",
  typescript: "#007acc",
  python: "#306999",
  vue: "#4FC08D",
  swift: "#FFAC45",
  ruby: "#CC342D",
  go: "#00ADD8",
  shell: "#89E051",
  dockerfile: "#384D54",
  c: "#555555",
  makefile: "#427819",
  hcl: "#844FBA",
  "jupyter notebook": "#DA5B0B"
};

function getTagColor(language) {
  return TAG_COLORS[language.toLowerCase()] || "#888";
}

function createProjectCard(project) {
  var card = document.createElement("div");
  card.className = "column is-6-desktop is-12-tablet";

  var tagsHtml = project.languages
    .map(function(lang) {
      return '<span class="project-tag" style="background-color: ' + getTagColor(lang) + '">' +
        lang.toUpperCase() + '</span>';
    })
    .join("");

  card.innerHTML =
    '<div class="project-card">' +
      '<h3 class="project-card-title">' + project.name + '</h3>' +
      '<div class="project-tags">' + tagsHtml + '</div>' +
      '<p class="project-card-description">' + project.description + '</p>' +
      '<a class="project-link" href="' + project.url + '" target="_blank">' +
        'View on GitHub &rarr;' +
      '</a>' +
    '</div>';

  return card;
}

function showFallback() {
  var grid = document.getElementById("projects-grid");
  grid.innerHTML =
    '<div class="column is-12 projects-fallback">' +
      '<p>Unable to load projects. ' +
        '<a href="https://github.com/' + USERNAME + '" target="_blank">View my projects on GitHub &rarr;</a>' +
      '</p>' +
    '</div>';
}

function renderProjects() {
  fetch(GITHUB_API_BASE_URL + "/users/" + USERNAME + "/repos?type=all&sort=created&per_page=100")
    .then(function(res) {
      if (!res.ok) throw new Error("API request failed");
      return res.json();
    })
    .then(function(repos) {
      var featured = repos.filter(function(repo) {
        return FEATURED_REPOS.indexOf(repo.name) !== -1 && !repo.fork;
      });

      featured.sort(function(a, b) {
        return FEATURED_REPOS.indexOf(a.name) - FEATURED_REPOS.indexOf(b.name);
      });

      var languagePromises = featured.map(function(repo) {
        return fetch(GITHUB_API_BASE_URL + "/repos/" + USERNAME + "/" + repo.name + "/languages")
          .then(function(res) { return res.json(); })
          .then(function(languages) {
            return {
              name: repo.name,
              url: repo.html_url,
              description: REPO_OVERRIDES[repo.name] || repo.description || "No description available.",
              languages: Object.keys(languages)
            };
          });
      });

      return Promise.all(languagePromises);
    })
    .then(function(projects) {
      var grid = document.getElementById("projects-grid");
      grid.innerHTML = "";

      projects.forEach(function(project) {
        grid.appendChild(createProjectCard(project));
      });
    })
    .catch(function() {
      showFallback();
    });
}

document.addEventListener("DOMContentLoaded", renderProjects);
