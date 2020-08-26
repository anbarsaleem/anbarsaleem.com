$(document).ready(function() {

  function toggleProject(projectNum) {

    var projId = "project_button_" + projectNum;
    var x = document.getElementById(projId);

    if(x.style.display === "none" || x.style.display === "") {

        x.style.display = "flex";

    }

    else {

        x.style.display = "none";

    }

  }
  
});