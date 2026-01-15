const STORAGE_KEY = "arc_blueprints_collected";

const grid = document.getElementById("bpGrid");
const progressEl = document.getElementById("bpProgress");
const markAllBtn = document.getElementById("bpMarkAll");
const clearAllBtn = document.getElementById("bpClearAll");

let allBlueprints = [];
let collected = new Set();

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...collected]));
  updateProgress();
}

function updateProgress() {
  if (!progressEl) return;
  progressEl.textContent = `${collected.size} / ${allBlueprints.length} collected`;
}

async function init() {
  const res = await fetch("./bp/blueprints.json");
  allBlueprints = await res.json();
  collected = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));

  grid.innerHTML = "";

  allBlueprints.forEach(name => {
    const cell = document.createElement("div");
    cell.className = "bp-cell";

    if (collected.has(name)) {
      cell.classList.add("collected");
    }

    const imageWrap = document.createElement("div");
    imageWrap.className = "bp-image-wrap";

    const img = document.createElement("div");
    img.className = "bp-image";
    img.style.backgroundImage =
          `url("./icons/bpicons/${name}.webp")`;

    imageWrap.appendChild(img);

    /* Footer */
    const footer = document.createElement("div");
    footer.className = "bp-footer";

    const icon = document.createElement("img");
    icon.src = "./icons/bpicons/Old_World.webp";
    icon.alt = "";

    const text = document.createElement("span");
    text.textContent = name
      .replace(/_/g, " ")
      .replace("-Level1", "")
      .replace("Mk 3", "Mk. 3");

footer.append(icon, text);

cell.append(imageWrap, footer);


    cell.addEventListener("click", () => {
      cell.classList.toggle("collected");

      if (collected.has(name)) {
        collected.delete(name);
      } else {
        collected.add(name);
      }

      save();
    });

    grid.appendChild(cell);
  });

  updateProgress();
}

/* Buttons */
markAllBtn?.addEventListener("click", () => {
  collected = new Set(allBlueprints);
  document.querySelectorAll(".bp-cell").forEach(c => c.classList.add("collected"));
  save();
});

clearAllBtn?.addEventListener("click", () => {
  collected.clear();
  document.querySelectorAll(".bp-cell").forEach(c => c.classList.remove("collected"));
  save();
});

init();
