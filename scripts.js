let isMobileNavOpen = false;

function toggleMobileNav() {
  isMobileNavOpen = !isMobileNavOpen;
  const navLinks = document.querySelector(".nav-links");
  const hamburger = document.querySelector(".hamburger-menu");
  
  navLinks.classList.toggle("active", isMobileNavOpen);
  hamburger.classList.toggle("active", isMobileNavOpen);
}

document.addEventListener("DOMContentLoaded", () => {
  const navLinksContainer = document.querySelector(".nav-links");
  const hamburger = document.querySelector(".hamburger-menu");

  // Handle dropdown menus on mobile
  const dropdowns = document.querySelectorAll(".dropdown");
  
  dropdowns.forEach((dropdown) => {
    const link = dropdown.querySelector("a");
    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 768 && isMobileNavOpen) {
        e.preventDefault();
        dropdown.classList.toggle("active");
      }
    });
  });

  // Close navigation when a link is clicked
  navLinksContainer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (isMobileNavOpen && !link.closest(".dropdown")) {
        navLinksContainer.classList.remove("active");
        hamburger.classList.remove("active");
        isMobileNavOpen = false;
      }
    });
  });
  
  // Close mobile nav when clicking outside
  document.addEventListener("click", (e) => {
    const navbar = document.querySelector(".navbar");
    if (navbar && !navbar.contains(e.target) && isMobileNavOpen) {
      navLinksContainer.classList.remove("active");
      hamburger.classList.remove("active");
      isMobileNavOpen = false;
    }
  });
});
