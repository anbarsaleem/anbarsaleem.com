$(document).ready(function() {

  // When the user scrolls the page, execute myFunction
  window.onscroll = function() {myFunction()};

  // Get the navbar
  var navbar = document.getElementById("navbar");
  var personal_projects = document.getElementById("projects");
  

  // Get the offset position of the navbar
  var sticky = personal_projects.offsetTop - 150;

  // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
  function myFunction() {
      if (window.pageYOffset >= sticky) {
          navbar.classList.add("sticky")
      } else {
          navbar.classList.remove("sticky");
      }
  }
  
});