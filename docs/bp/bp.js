const STORAGE_KEY = "arc_blueprints_collected";

const grid = document.getElementById("bpGrid");

function loadCollected() {
  return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
}

function saveCollected(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

async function init() {
  const res = await fetch("./bp/blueprints.json");
  const blueprints = await res.json();

  const collected = loadCollected();

  blueprints.forEach(name => {
    const cell = document.createElement("div");
    cell.className = "bp-cell";

    if (collected.has(name)) {
      cell.classList.add("collected");
    }

    const img = document.createElement("div");
    img.className = "bp-image";
    img.style.backgroundImage =
      `url("./icons/bpicons/${name}.webp")`;

    const label = document.createElement("div");
    label.className = "bp-name";
    label.textContent = name;

    cell.append(img, label);

    cell.addEventListener("click", () => {
      if (collected.has(name)) {
        collected.delete(name);
        cell.classList.remove("collected");
      } else {
        collected.add(name);
        cell.classList.add("collected");
      }
      saveCollected(collected);
    });

    grid.appendChild(cell);
  });
}

init();
