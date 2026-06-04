const menuToggle = document.querySelector(".mobile-menu-toggle");
const navLinks = document.querySelector(".nav-links");
const dropdownParents = document.querySelectorAll(".nav-dropdown > a");
const projectSearch = document.querySelector("#projectSearch");
const projectCards = document.querySelectorAll("[data-project-card]");
const searchEmpty = document.querySelector(".search-empty");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("nav-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "×" : "☰";
    });
}

dropdownParents.forEach((dropdownLink) => {
    dropdownLink.addEventListener("click", (event) => {
        const isMobile = window.matchMedia("(max-width: 650px)").matches;
        if (!isMobile) return;
        event.preventDefault();
        const parentDropdown = dropdownLink.closest(".nav-dropdown");
        parentDropdown?.classList.toggle("submenu-open");
    });
});

if (projectSearch && projectCards.length > 0) {
    projectSearch.addEventListener("input", () => {
        const searchTerm = projectSearch.value.toLowerCase().trim();
        let visibleCount = 0;

        projectCards.forEach((card) => {
            const cardText = card.textContent.toLowerCase();
            const matchesSearch = cardText.includes(searchTerm);
            card.hidden = !matchesSearch;
            if (matchesSearch) visibleCount += 1;
        });

        if (searchEmpty) {
            searchEmpty.hidden = visibleCount !== 0;
        }
    });
}
