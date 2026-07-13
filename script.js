// ============================
// Typing animation for hero role
// ============================
const roles = ["AI/ML Engineer", "Brand Builder", "Graphic Designer"];
const typedEl = document.getElementById("typedRole");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400); // pause at full word
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeLoop, deleting ? 45 : 85);
}

if (typedEl) {
  if (prefersReducedMotion) {
    typedEl.textContent = roles[0];
  } else {
    typeLoop();
  }
}

// ============================
// Mode rail: switches ENGINEERING / DESIGN
// based on which section is in view
// ============================
const modeLabel = document.getElementById("modeLabel");
const modeRail = document.getElementById("modeRail");
const sections = document.querySelectorAll("[data-mode]");

const modeNames = {
  engineering: "MODE — ENGINEERING",
  design: "MODE — DESIGN"
};

function setMode(mode) {
  document.documentElement.style.setProperty(
    "--accent",
    mode === "design" ? "var(--accent-design)" : "var(--accent-eng)"
  );
  document.documentElement.style.setProperty(
    "--accent-dim",
    mode === "design" ? "var(--accent-design-dim)" : "var(--accent-eng-dim)"
  );
  if (modeLabel) modeLabel.textContent = modeNames[mode] || modeNames.engineering;
}

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const mode = entry.target.getAttribute("data-mode");
          setMode(mode);
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

// ============================
// Design collections + lightbox
// ============================
// EDIT THIS: add your real image paths here. Each entry needs a `src` (path
// under assets/) and a `caption` (shown under the image in the lightbox).
// The number of items you list is what the lightbox will cycle through —
// the "N pieces" count on each card in index.html is just static text, so
// update that too if you add or remove items.
const collections = {
  logos: {
    title: "Logo design",
    items: [
      { src: "assets/logos/logo1.png", caption: "Logo 1" },
      { src: "assets/logos/logo2.png", caption: "Logo 2" },
      { src: "assets/logos/logo3.png", caption: "Logo 3" },
      { src: "assets/logos/logo4.jpg", caption: "Logo 4" }
    ]
  },
  posters: {
    title: "Posters & social",
    items: [
      { src: "assets/posters/poster1.png", caption: "Poster 1" },
      { src: "assets/posters/poster2.png", caption: "Poster 2" },
      { src: "assets/posters/poster3.jpg", caption: "Poster 3" },
      { src: "assets/posters/poster4.png", caption: "Poster 4" }
    ]
  },
  art: {
    title: "Digital art",
    items: [
      { src: "assets/digital-art/art1.jpg", caption: "Piece 1" },
      { src: "assets/digital-art/art2.jpg", caption: "Piece 2" },
      { src: "assets/digital-art/art3.jpg", caption: "Piece 3" },
      { src: "assets/digital-art/art4.jpg", caption: "Piece 4" },
      { src: "assets/digital-art/art5.jpg", caption: "Piece 5" },
      { src: "assets/digital-art/art6.jpg", caption: "Piece 6" }
    ]
  }
};

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCounter = document.getElementById("lightboxCounter");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let activeCollection = null;
let activeIndex = 0;

function renderLightboxImage() {
  const collection = collections[activeCollection];
  const item = collection.items[activeIndex];

  // Try to load the real image; fall back to a placeholder box if it's
  // missing (which it will be until you add your own files to assets/).
  lightboxImage.innerHTML = "";
  const img = new Image();
  img.alt = item.caption;
  img.onerror = () => {
    lightboxImage.innerHTML =
      `<span class="placeholder-text">Add image<br><span class="placeholder-hint">${item.src}</span></span>`;
  };
  img.onload = () => {
    lightboxImage.innerHTML = "";
    lightboxImage.appendChild(img);
  };
  img.src = item.src;

  lightboxTitle.textContent = `${collection.title} — ${item.caption}`;
  lightboxCounter.textContent = `${activeIndex + 1} / ${collection.items.length}`;
}

function openLightbox(collectionKey) {
  activeCollection = collectionKey;
  activeIndex = 0;
  renderLightboxImage();
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function step(delta) {
  const collection = collections[activeCollection];
  const count = collection.items.length;
  activeIndex = (activeIndex + delta + count) % count;
  renderLightboxImage();
}

document.querySelectorAll(".collection-card").forEach((card) => {
  const key = card.getAttribute("data-collection");
  const cover = card.querySelector(".collection-cover");
  const first = collections[key] && collections[key].items[0];

  if (first && cover) {
    const img = new Image();
    img.alt = collections[key].title;
    img.onload = () => {
      cover.innerHTML = "";
      cover.appendChild(img);
    };
    // onerror: leave the "Add cover" placeholder text in place
    img.src = first.src;
  }

  card.addEventListener("click", () => {
    if (collections[key]) openLightbox(key);
  });
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener("click", () => step(-1));
if (lightboxNext) lightboxNext.addEventListener("click", () => step(1));

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener("keydown", (e) => {
  if (!lightbox || !lightbox.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});