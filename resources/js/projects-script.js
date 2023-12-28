function toggleProject(projectNum) {
  var projId = "project_button_" + projectNum;
  var x = document.getElementById(projId);

  if (x.style.display === "none" || x.style.display === "") {
    x.style.display = "flex";
  } else {
    x.style.display = "none";
  }
}

function requestUserRepoInfo() {
  const GITHUB_API_BASE_URL = "https://api.github.com";
  const username = "anbarsaleem";

  // Fetch public repositories for the user, sorted by most recently created
  fetch(
    `${GITHUB_API_BASE_URL}/users/${username}/repos?type=all&sort=created&direction=asc`
  )
    .then((res) => res.json())
    .then((repos) => {
      // Filter out forked and private repositories
      const publicRepos = repos.filter((repo) => !repo.fork && !repo.private);

      // Loop through all public repositories
      publicRepos.forEach((p, pNum) => {
        const LANGUAGES_FOR_PROJECT_ENDPOINT = `/repos/${username}/${p.name}/languages`;

        // Fetch languages for each public repository
        fetch(`${GITHUB_API_BASE_URL}${LANGUAGES_FOR_PROJECT_ENDPOINT}`)
          .then((res) => res.json())
          .then((languages) => {
            generateProjectButton(
              {
                name: p.name,
                url: p.html_url,
                description: p.description,
                languages: Object.keys(languages),
              },
              pNum
            );

            generateProjectField(
              {
                name: p.name,
                url: p.html_url,
                description: p.description,
                languages: Object.keys(languages),
              },
              pNum
            );
          });
      });
    });
}

function generateProjectButton(project, number) {
  var outer_div = $("<div>");
  const outer_div_classes = "columns is-mobile is-centered";

  var inner_div = $("<div>");
  const inner_div_classes = "column is-8 has-text-centered project_buttons";

  var button = $("<button>");
  const button_classes = "button is-info is-inverted is-fullwidth";

  outer_div.addClass(outer_div_classes);

  inner_div.addClass(inner_div_classes);

  button.addClass(button_classes);
  button.click(() => toggleProject(number));
  button.attr("id", "proj_btn_" + number);
  button.text(project.name);

  inner_div.append(button);
  outer_div.append(inner_div);

  $("#projects").append(outer_div);
}

function generateProjectField(project, number) {
  console.log("generateProjectField method loaded");

  var outer_div = $("<div>");
  const outer_div_classes = "project_container";
  outer_div.addClass(outer_div_classes);
  outer_div.attr("id", "project_button_" + number);

  var figure = $("<figure>");
  const figure_class = "project";
  figure.addClass(figure_class);

  var project_content_div = $("<div>");
  const project_content_div_class = "project_content";
  project_content_div.addClass(project_content_div_class);

  var project_title_div = $("<div>");
  const project_title_div_class = "project_title";
  project_title_div.addClass(project_title_div_class);

  var h3 = $("<h3>");
  const h3_class = "project_heading";
  h3.addClass(h3_class);
  h3.text(project.name);

  var description_p = $("<p>");
  const description_p_class = "project_description";
  description_p.addClass(description_p_class);
  description_p.text(project.description);

  var project_details_div = $("<div>");
  const project_details_div_class = "project_details";
  project_details_div.addClass(project_details_div_class);

  var url_p = $("<p>");
  const url_p_class = "project_details";
  url_p.addClass(url_p_class);

  var url_a = $("<a>");
  url_a.text("GITHUB");
  url_a.attr("href", project.url);
  url_a.attr("target", "_blank");

  url_p.append(url_a);

  project_details_div.append(url_p);

  project_title_div.append(h3);

  for (let i in project.languages) {
    var language_div = $("<div>");
    var language_div_classes = "project_tag";

    var specific_language_div_classes =
      " project_tag_" + project.languages[i].toString().toLowerCase();

    language_div_classes += specific_language_div_classes;

    language_div.addClass(language_div_classes);

    language_div.text(project.languages[i].toString().toUpperCase());

    project_title_div.append(language_div);

    console.log(project.languages[i].toString() + " loaded");
  }

  project_content_div.append(
    project_title_div,
    description_p,
    project_details_div
  );

  figure.append(project_content_div);

  outer_div.append(figure);

  $("#projects").append(outer_div);
}

$(document).ready(requestUserRepoInfo);
