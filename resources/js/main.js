document.addEventListener("DOMContentLoaded", function() {
  // Navbar burger toggle (mobile)
  var burger = document.querySelector(".navbar-burger");
  if (burger) {
    var menu = document.getElementById(burger.dataset.target);
    burger.addEventListener("click", function() {
      burger.classList.toggle("is-active");
      menu.classList.toggle("is-active");
    });

    // Close menu when a link is clicked
    menu.querySelectorAll("a").forEach(function(link) {
      link.addEventListener("click", function() {
        burger.classList.remove("is-active");
        menu.classList.remove("is-active");
      });
    });
  }

  // Profile photo hover effect
  var imgContainer = document.getElementById("img-with-txt");
  var overlay = document.getElementById("txt");
  var pic = document.getElementById("profile-pic");

  if (imgContainer && overlay && pic) {
    imgContainer.addEventListener("mouseenter", function() {
      overlay.style.display = "block";
      pic.style.opacity = "0.3";
      pic.style.transition = "opacity 0.12s";
    });
    imgContainer.addEventListener("mouseleave", function() {
      overlay.style.display = "none";
      pic.style.opacity = "1";
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener("click", function(e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
