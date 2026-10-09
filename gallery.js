const photos = [
  {
    image: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa",
    alt: "low angle photo of cherry blossoms tree",
    source:
      "https://unsplash.com/photos/low-angle-photo-of-cherry-blossoms-tree-sKJ7zSylUao",
    author: "Arno Smit",
    profile: "https://unsplash.com/@_entreprenerd",
    category: "bloom",
    id: "1",
    ratio: 0.8,
  },
  {
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce",
    alt: "scenery of mountain",
    source: "https://unsplash.com/photos/scenery-of-mountain-oMneOBYhJxY",
    author: "John Lee",
    profile: "https://unsplash.com/@john_artifexfilm",
    category: "wild",
    id: "2",
    ratio: 1.15,
  },
  {
    image: "https://images.unsplash.com/photo-1494879540385-bc170b0878a7",
    alt: "aerial view of seashore with stones",
    source:
      "https://unsplash.com/photos/aerial-view-of-seashore-with-stones-J3ABLQjZQBg",
    author: "samsommer",
    profile: "https://unsplash.com/@samsommer",
    category: "water",
    id: "3",
    ratio: 0.78,
  },
  {
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b",
    alt: "trees on forest with sun rays",
    source:
      "https://unsplash.com/photos/trees-on-forest-with-sun-rays-sp-p7uuT0tw",
    author: "Sebastian Unrau",
    profile: "https://unsplash.com/@sebastian_unrau",
    category: "wild",
    id: "4",
    ratio: 1.15,
  },
  {
    image: "https://images.unsplash.com/photo-1552674510-62c267e73ada",
    alt: "top-view photography of seashore",
    source:
      "https://unsplash.com/photos/top-view-photography-of-seashore-VCOHfuG4PU8",
    author: "CK Yeo",
    profile: "https://unsplash.com/@seakei",
    category: "water",
    id: "5",
    ratio: 1.2,
  },
  {
    image: "https://images.unsplash.com/photo-1551829142-d9b8cf2c9232",
    alt: "white petaled flower",
    source: "https://unsplash.com/photos/white-petaled-flower-lFTtQqVfx6g",
    author: "David Brooke Martin",
    profile: "https://unsplash.com/@dbmartin00",
    category: "bloom",
    id: "6",
    ratio: 0.8,
  },
  {
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d",
    alt: "aerial photo of green trees",
    source:
      "https://unsplash.com/photos/aerial-photo-of-green-trees-ugnrXk1129g",
    author: "Marita Kavelashvili",
    profile: "https://unsplash.com/@maritaextrabold",
    category: "wild",
    id: "7",
    ratio: 0.88,
  },
  {
    image: "https://images.unsplash.com/photo-1516655855035-d5215bcb5604",
    alt: "river near mountains",
    source: "https://unsplash.com/photos/river-near-mountains-KiRlN3jjVNU",
    author: "Mark Koch",
    profile: "https://unsplash.com/@markk92",
    category: "wild",
    id: "8",
    ratio: 0.75,
  },
  {
    image: "https://images.unsplash.com/photo-1538943186303-104afadcbb16",
    alt: "pink petaled flower bloom during daytime",
    source:
      "https://unsplash.com/photos/pink-petaled-flower-bloom-during-daytime-_41JjnrSeHU",
    author: "Yustinus Subiakto",
    profile: "https://unsplash.com/@yustinus",
    category: "bloom",
    id: "9",
    ratio: 0.8,
  },
  {
    image: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d",
    alt: "photo of ocean waves at daytime",
    source:
      "https://unsplash.com/photos/photo-of-ocean-waves-at-daytime-wc9avd2RaN0",
    author: "Christoffer Engström",
    profile: "https://unsplash.com/@christoffere",
    category: "water",
    id: "10",
    ratio: 1.2,
  },
  {
    image: "https://images.unsplash.com/photo-1783295542349-62ce2ccb7401",
    alt: "Emerald lake reflecting a majestic mountain and dense pine forest",
    source:
      "https://unsplash.com/photos/emerald-lake-reflecting-a-majestic-mountain-and-dense-pine-forest-NRFtGN-JWAE",
    author: "Ali Kazal",
    profile: "https://unsplash.com/@lureofadventure",
    category: "wild",
    id: "11",
    ratio: 0.9,
  },
  {
    image: "https://images.unsplash.com/photo-1761776599893-b65405726caa",
    alt: "Misty evergreen forest on a cloudy day",
    source:
      "https://unsplash.com/photos/misty-evergreen-forest-on-a-cloudy-day-Oge0F8H1_nM",
    author: "Arno Senoner",
    profile: "https://unsplash.com/@arnosenoner",
    category: "wild",
    id: "12",
    ratio: 1.15,
  },
];

const gallery = document.querySelector("#gallery");
const viewer = document.querySelector("#viewer");
const fullPhoto = document.querySelector("#full-photo");
const status = document.querySelector("#status");
const savedFilter = document.querySelector("#saved-filter");
const layoutToggle = document.querySelector("#layout-toggle");
let category = "all";
let savedOnly = false;
let visiblePhotos = photos;
let position = 0;
let previousFocus;
let previousOverflow;
let saved = new Set();

try {
  const stored = JSON.parse(localStorage.getItem("gallery-saved") || "[]");
  if (Array.isArray(stored))
    saved = new Set(
      stored.filter((id) => photos.some((photo) => photo.id === id)),
    );
} catch {
  /* Storage may be unavailable; saving still works for this visit. */
}

const heart =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.8a5.4 5.4 0 0 0-7.6 0L12 6l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z"/></svg>';
const expand =
  '<span class="expand"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4"/></svg></span>';

function imageUrl(photo, width) {
  return `${photo.image}?auto=format&fit=crop&w=${width}&q=85`;
}

function updateSavedCount() {
  const badge = document.querySelector("#saved-count");
  badge.textContent = saved.size;
  badge.hidden = !saved.size;
}

function render() {
  visiblePhotos = photos.filter(
    (photo) =>
      (category === "all" || photo.category === category) &&
      (!savedOnly || saved.has(photo.id)),
  );
  gallery.replaceChildren();
  for (const [index, photo] of visiblePhotos.entries()) {
    const card = document.createElement("article");
    card.className = "photo-card";
    card.style.setProperty("--ratio", photo.ratio);
    card.style.setProperty("--delay", `${Math.min(index, 7) * 40}ms`);

    const open = document.createElement("button");
    open.className = "photo-open loading";
    open.setAttribute("aria-label", `Open ${photo.alt}`);
    const image = new Image();
    image.alt = photo.alt;
    image.loading = index < 4 ? "eager" : "lazy";
    image.decoding = "async";
    image.width = 700;
    image.height = Math.round(700 / photo.ratio);
    image.onload = () => {
      image.classList.add("loaded");
      open.classList.remove("loading");
    };
    image.onerror = () => {
      open.classList.remove("loading");
      image.hidden = true;
      const fallback = document.createElement("span");
      fallback.className = "image-error";
      fallback.textContent = "Photo unavailable";
      open.prepend(fallback);
    };
    image.src = imageUrl(photo, 700);
    open.append(image);
    open.insertAdjacentHTML("beforeend", expand);
    open.addEventListener("click", () => openViewer(index));

    const save = document.createElement("button");
    save.className = "icon-button photo-save";
    save.innerHTML = heart;
    function updateSave() {
      save.setAttribute("aria-pressed", saved.has(photo.id));
      save.setAttribute(
        "aria-label",
        `${saved.has(photo.id) ? "Unsave" : "Save"} ${photo.alt}`,
      );
    }
    updateSave();
    save.addEventListener("click", () => {
      if (saved.has(photo.id)) saved.delete(photo.id);
      else saved.add(photo.id);
      try {
        localStorage.setItem("gallery-saved", JSON.stringify([...saved]));
      } catch {
        /* Keep the in-memory selection. */
      }
      updateSave();
      updateSavedCount();
      status.textContent = saved.has(photo.id)
        ? "Photo saved."
        : "Photo removed from saved photos.";
      if (savedOnly) {
        render();
        const next = gallery.querySelectorAll(".photo-save");
        (next[Math.min(index, next.length - 1)] || savedFilter).focus();
      }
    });
    card.append(open, save);
    gallery.append(card);
  }
  document.querySelector("#empty").hidden = visiblePhotos.length > 0;
  status.textContent = `${visiblePhotos.length} photos${savedOnly ? " saved" : ""}.`;
}

function showPhoto() {
  const photo = visiblePhotos[position];
  fullPhoto.classList.remove("loaded");
  fullPhoto.hidden = false;
  document.querySelector("#viewer-error").hidden = true;
  fullPhoto.alt = photo.alt;
  fullPhoto.onload = () => fullPhoto.classList.add("loaded");
  fullPhoto.onerror = () => {
    fullPhoto.hidden = true;
    document.querySelector("#viewer-error").hidden = false;
  };
  fullPhoto.src = imageUrl(photo, 1800);
  document.querySelector("#position").textContent =
    `${String(position + 1).padStart(2, "0")} / ${String(visiblePhotos.length).padStart(2, "0")}`;
  const credit = document.querySelector("#photo-source");
  credit.href = photo.source;
  credit.setAttribute("aria-label", `Photo by ${photo.author} on Unsplash`);
  document.querySelector("#previous").disabled = visiblePhotos.length < 2;
  document.querySelector("#next").disabled = visiblePhotos.length < 2;
}

function openViewer(index) {
  position = index;
  previousFocus = document.activeElement;
  previousOverflow = document.body.style.overflow;
  showPhoto();
  viewer.showModal();
  document.body.style.overflow = "hidden";
  document.querySelector("#close-viewer").focus();
}
function move(direction) {
  position =
    (position + direction + visiblePhotos.length) % visiblePhotos.length;
  showPhoto();
}
function closeViewer() {
  viewer.close();
  document.body.style.overflow = previousOverflow;
  previousFocus?.focus();
}
viewer.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeViewer();
});
viewer.addEventListener("click", (event) => {
  if (event.target === viewer) closeViewer();
});
viewer.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    move(event.key === "ArrowLeft" ? -1 : 1);
  }
  if (event.key === "Tab") {
    const controls = [
      ...viewer.querySelectorAll("button:not(:disabled), a[href]"),
    ].filter((element) => !element.closest("[hidden]"));
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
document.querySelector("#close-viewer").addEventListener("click", closeViewer);
document.querySelector("#previous").addEventListener("click", () => move(-1));
document.querySelector("#next").addEventListener("click", () => move(1));
document.querySelector("#retry-photo").addEventListener("click", showPhoto);

for (const filter of document.querySelectorAll(".filter")) {
  filter.addEventListener("click", () => {
    category = filter.dataset.category;
    updateFilters();
    render();
  });
}
function updateFilters() {
  for (const filter of document.querySelectorAll(".filter")) {
    const active = filter.dataset.category === category;
    filter.classList.toggle("active", active);
    filter.setAttribute("aria-pressed", active);
  }
  savedFilter.setAttribute("aria-pressed", savedOnly);
  savedFilter.setAttribute(
    "aria-label",
    savedOnly ? "Show all photos" : "Show saved photos",
  );
}
savedFilter.addEventListener("click", () => {
  savedOnly = !savedOnly;
  updateFilters();
  render();
});
layoutToggle.addEventListener("click", () => {
  const large = gallery.classList.toggle("large");
  layoutToggle.setAttribute("aria-pressed", large);
  layoutToggle.setAttribute(
    "aria-label",
    large ? "Use smaller photos" : "Use larger photos",
  );
});
document.querySelector("#reset").addEventListener("click", () => {
  category = "all";
  savedOnly = false;
  updateFilters();
  render();
  document.querySelector(".filter").focus();
});
updateSavedCount();
render();
