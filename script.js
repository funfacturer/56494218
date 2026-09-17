// Fest zugeordnete Weihnachtssymbole für jedes der 24 Türchen (Index 0 = Tag 1, Index 23 = Tag 24)
const symbols = [
  "🎅", "🎄", "🎁", "🦌", "⛄", "❄️", "🕯️", "🔔", 
  "🌟", "🍪", "angel", "🛷", "🧦", "🧣", "🧤", "☕", 
  "🍊", "🥨", "🎶", "🕊️", "⛪", "🌌", "🏠", "🍾"
];

// Die textuellen Namen der Symbole (können bei Bedarf als Hilfestellung im Rätsel dienen)
const symbolNames = [
  "Weihnachtsmann", "Tannenbaum", "Geschenk", "Rentier", "Schneemann", "Schneeflocke", "Kerze", "Glocke",
  "Stern", "Keks", "Engel", "Schlitten", "Nikolausstiefel", "Schal", "Handschuhe", "Heißgetränk",
  "Orange", "Brezel", "Noten", "Friedenstaube", "Kirche", "Sternenhimmel", "Lebkuchenhaus", "Sekt"
];

const surprises = [
  "🎄 Ein heißer Kakao wärmt heute die Seele!",
  "⭐ Glaube an Wunder, Liebe und Glück.",
  "🕯️ Zünde heute eine Kerze für Gemütlichkeit an.",
  "🍪 Zeit, Plätzchen zu naschen oder zu backen!",
  "❄️ Atme tief ein und genieße die Winterluft.",
  "🎅 Frohen Nikolaustag! Schau in deine Schuhe.",
  "🎶 Höre heute dein liebstes Weihnachtslied.",
  "🎁 Schicke jemandem eine nette Sprachnachricht.",
  "📖 Gönne dir heute 15 Minuten Lesezeit.",
  "🍵 Genieße einen wärmenden Gewürztee.",
  "✨ Schenke heute einem Fremden ein Lächeln.",
  "🍊 Duft von Zimt und Mandarinen genießen.",
  "💌 Zeit für die ersten Weihnachtsgrüße.",
  "🌟 Schau heute Abend kurz in den Sternenhimmel.",
  "🎬 Zeit für einen gemütlichen Weihnachtsfilm.",
  "🥨 Gönne dir heute eine süße Leckerei.",
  "🧣 Kuschel dich warm ein.",
  "🌨️ Nimm dir heute eine kleine Auszeit.",
  "🕯️ Das Fest rückt immer näher!",
  "🎉 Erinnere dich an einen schönen Moment des Jahres.",
  "🕊️ Ruhe und Gelassenheit für den Tag.",
  "🎵 Mach die Weihnachtsmusik an!",
  "🌲 Morgen ist Heiligabend!",
  "🎅 Frohe und gesegnete Weihnachten!"
];

const calendar = document.getElementById("calendar");
const testModeCheckbox = document.getElementById("test-mode");
const resetBtn = document.getElementById("reset-btn");
const modalOverlay = document.getElementById("modal-overlay");
const modalBadge = document.getElementById("modal-day-badge");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");

let openedDoors = JSON.parse(localStorage.getItem("advent_opened_doors")) || [];

// Array mischen
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 24 überlappungsfreie Zonen mit Zufallsversatz (Jitter) berechnen
function generateRandomLayout() {
  const rows = 6;
  const cols = 4;
  const positions = [];

  const days = shuffle(Array.from({ length: 24 }, (_, i) => i + 1));
  let index = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const day = days[index++];

      // Basispositionen in Prozent der Zelle
      const cellTop = (r / rows) * 100;
      const cellLeft = (c / cols) * 100;

      // Zufallsversatz innerhalb der Zelle
      const jitterTop = (Math.random() * 4) + 1; // 1% bis 5%
      const jitterLeft = (Math.random() * 6) + 2; // 2% bis 8%
      const rotation = (Math.random() * 20) - 10; // -10deg bis +10deg

      positions.push({
        day: day,
        top: cellTop + jitterTop,
        left: cellLeft + jitterLeft,
        rotate: rotation
      });
    }
  }

  localStorage.setItem("advent_positions", JSON.stringify(positions));
  return positions;
}

function getPositions() {
  let saved = JSON.parse(localStorage.getItem("advent_positions"));
  if (!saved || saved.length !== 24) {
    saved = generateRandomLayout();
  }
  return saved;
}

function triggerHaptic() {
  if ("vibrate" in navigator) {
    navigator.vibrate(20);
  }
}

function openModal(day) {
  modalBadge.textContent = `Türchen ${day}`;
  
  // Setze das zugehörige Symbol ins Modal
  const modalIconElement = document.querySelector(".modal-icon");
  if (modalIconElement) {
    modalIconElement.textContent = symbols[day - 1];
  }
  
  modalContent.textContent = surprises[day - 1];
  modalOverlay.style.display = "flex";
  document.body.classList.add("modal-open");
}

function closeModal() {
  modalOverlay.style.display = "none";
  document.body.classList.remove("modal-open");
}

function createCalendar() {
  calendar.innerHTML = "";
  const today = new Date();
  const currentMonth = today.getMonth(); // 11 = Dezember
  const currentDay = today.getDate();
  const positions = getPositions();

  positions.forEach(item => {
    const { day, top, left, rotate } = item;

    const container = document.createElement("div");
    container.className = "door-container";
    container.style.top = `${top}%`;
    container.style.left = `${left}%`;
    container.style.transform = `rotate(${rotate}deg)`;

    const card = document.createElement("div");
    card.className = "door-card";
    
    if (openedDoors.includes(day)) {
      card.classList.add("open");
    }

    const front = document.createElement("div");
    front.className = "door-front";
    front.innerHTML = `<span class="number">${day}</span><span class="star">★</span>`;

    // Das Symbol wird fest auf der Rückseite des Türchens platziert
    const back = document.createElement("div");
    back.className = "door-back";
    back.innerHTML = `<span class="back-symbol">${symbols[day - 1]}</span>`;

    card.appendChild(front);
    card.appendChild(back);
    container.appendChild(card);

    container.addEventListener("click", () => {
      triggerHaptic();
      const isDecember = currentMonth === 11;
      const isAllowed = testModeCheckbox.checked || (isDecember && currentDay >= day);

      if (!isAllowed) {
        alert(`Türchen ${day} öffnet sich erst am ${day}. Dezember! 🎅`);
        return;
      }

      if (!openedDoors.includes(day)) {
        openedDoors.push(day);
        localStorage.setItem("advent_opened_doors", JSON.stringify(openedDoors));
        card.classList.add("open");
      }

      setTimeout(() => openModal(day), 250);
    });

    calendar.appendChild(container);
  });
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

resetBtn.addEventListener("click", () => {
  if (confirm("Kalender zurücksetzen und Türchen neu im Bild verteilen?")) {
    openedDoors = [];
    localStorage.removeItem("advent_opened_doors");
    localStorage.removeItem("advent_positions");
    createCalendar();
  }
});

// Schneefall
function createSnow() {
  const snowContainer = document.getElementById("snow-container");
  const flakeCount = 18;

  for (let i = 0; i < flakeCount; i++) {
    const flake = document.createElement("div");
    flake.className = "snowflake";
    flake.textContent = "•";
    flake.style.left = Math.random() * 100 + "vw";
    flake.style.animationDuration = Math.random() * 3 + 3 + "s";
    flake.style.opacity = Math.random() * 0.5 + 0.3;
    flake.style.fontSize = Math.random() * 12 + 10 + "px";
    snowContainer.appendChild(flake);
  }
}

createSnow();
createCalendar();
