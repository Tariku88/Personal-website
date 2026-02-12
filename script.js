document.documentElement.classList.add("js");

const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
const publicationItems = Array.from(document.querySelectorAll(".pub-item"));
const yearNode = document.getElementById("year");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    publicationItems.forEach((item) => {
      const type = item.dataset.type;
      const shouldShow = selectedFilter === "all" || type === selectedFilter;
      item.style.display = shouldShow ? "" : "none";
    });
  });
});

const sections = Array.from(document.querySelectorAll("section[id]"));
const revealBlocks = [
  document.querySelector(".hero"),
  ...Array.from(document.querySelectorAll("main .section")),
].filter(Boolean);

revealBlocks.forEach((block, index) => {
  const delay = Math.min(index * 70, 300);
  block.style.setProperty("--reveal-delay", `${delay}ms`);
});

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("active", isActive);
        });
      });
    },
    {
      threshold: 0.35,
      rootMargin: "-90px 0px -40% 0px",
    }
  );

  sections.forEach((section) => navObserver.observe(section));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealBlocks.forEach((block) => revealObserver.observe(block));
} else {
  revealBlocks.forEach((block) => block.classList.add("is-visible"));
}
