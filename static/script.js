const menuToggle = document.querySelector(".mobile-menu-toggle");
const navLinks = document.querySelector(".nav-links");
const dropdownParents = document.querySelectorAll(".nav-dropdown > a");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("nav-open");

        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.textContent = isOpen ? "×" : "☰";
    });
}

dropdownParents.forEach((dropdownLink) => {
    dropdownLink.addEventListener("click", (event) => {
        const isMobile = window.matchMedia("(max-width: 650px)").matches;

        if (!isMobile) {
            return;
        }

        event.preventDefault();

        const parentDropdown = dropdownLink.closest(".nav-dropdown");
        parentDropdown.classList.toggle("submenu-open");
    });
});