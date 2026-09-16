// ==========================================
// SPORT DATEN (TABELLEN & BEIDE SPIELTAGE)
// ==========================================
const sportsData = {
  bl1: {
    title: "1. Bundesliga",
    table: [
      { pos: 1, team: "Bayern München", sp: 23, diff: "+42", pkt: 55 },
      { pos: 2, team: "Bayer Leverkusen", sp: 23, diff: "+28", pkt: 47 },
      { pos: 3, team: "Eintracht Frankfurt", sp: 23, diff: "+17", pkt: 42 },
      { pos: 4, team: "RB Leipzig", sp: 23, diff: "+12", pkt: 40 },
      { pos: 5, team: "Borussia Dortmund", sp: 23, diff: "+9", pkt: 37 },
      { pos: 6, team: "SC Freiburg", sp: 23, diff: "+3", pkt: 36 },
      { pos: 16, team: "1. FC Heidenheim", sp: 23, diff: "-15", pkt: 18 },
      { pos: 17, team: "Holstein Kiel", sp: 23, diff: "-24", pkt: 14 },
      { pos: 18, team: "VfL Bochum", sp: 23, diff: "-32", pkt: 11 }
    ],
    recentMatches: [
      { date: "Fr 20:30", t1: "Bayer Leverkusen", t2: "Bayern München", score: "0 : 0" },
      { date: "Sa 15:30", t1: "Borussia Dortmund", t2: "VfL Bochum", score: "3 : 1" },
      { date: "Sa 15:30", t1: "RB Leipzig", t2: "FC St. Pauli", score: "2 : 0" },
      { date: "Sa 18:30", t1: "VfB Stuttgart", t2: "SC Freiburg", score: "1 : 2" },
      { date: "So 17:30", t1: "Eintracht Frankfurt", t2: "Werder Bremen", score: "4 : 1" }
    ],
    nextMatches: [
      { date: "Fr 20:30", t1: "Bayern München", t2: "VfB Stuttgart", score: "- : -" },
      { date: "Sa 15:30", t1: "Bayer Leverkusen", t2: "Eintracht Frankfurt", score: "- : -" },
      { date: "Sa 15:30", t1: "RB Leipzig", t2: "Borussia Dortmund", score: "- : -" },
      { date: "Sa 18:30", t1: "Mönchengladbach", t2: "Werder Bremen", score: "- : -" },
      { date: "So 17:30", t1: "SC Freiburg", t2: "FC Augsburg", score: "- : -" }
    ]
  },
  bl2: {
    title: "2. Bundesliga",
    table: [
      { pos: 1, team: "Hamburger SV", sp: 23, diff: "+18", pkt: 44 },
      { pos: 2, team: "1. FC Köln", sp: 23, diff: "+14", pkt: 42 },
      { pos: 3, team: "Fortuna Düsseldorf", sp: 23, diff: "+11", pkt: 40 },
      { pos: 4, team: "Hannover 96", sp: 23, diff: "+9", pkt: 39 },
      { pos: 5, team: "1. FC Kaiserslautern", sp: 23, diff: "+6", pkt: 38 }
    ],
    recentMatches: [
      { date: "Fr 18:30", t1: "1. FC Köln", t2: "Schalke 04", score: "2 : 1" },
      { date: "Sa 13:00", t1: "Hannover 96", t2: "Hamburger SV", score: "1 : 1" },
      { date: "Sa 20:30", t1: "Fortuna Düsseldorf", t2: "Greuther Fürth", score: "3 : 0" },
      { date: "So 13:30", t1: "1. FC Nürnberg", t2: "Kaiserslautern", score: "1 : 3" }
    ],
    nextMatches: [
      { date: "Fr 18:30", t1: "Hamburger SV", t2: "1. FC Köln", score: "- : -" },
      { date: "Fr 18:30", t1: "Paderborn", t2: "Hannover 96", score: "- : -" },
      { date: "Sa 13:00", t1: "Düsseldorf", t2: "Kaiserslautern", score: "- : -" },
      { date: "So 13:30", t1: "Hertha BSC", t2: "Schalke 04", score: "- : -" }
    ]
  },
  bl3: {
    title: "3. Liga",
    table: [
      { pos: 1, team: "Dynamo Dresden", sp: 24, diff: "+15", pkt: 48 },
      { pos: 2, team: "SV Sandhausen", sp: 24, diff: "+12", pkt: 45 },
      { pos: 3, team: "Arminia Bielefeld", sp: 24, diff: "+9", pkt: 43 },
      { pos: 4, team: "1. FC Saarbrücken", sp: 24, diff: "+8", pkt: 41 },
      { pos: 5, team: "Energie Cottbus", sp: 24, diff: "+7", pkt: 39 }
    ],
    recentMatches: [
      { date: "Fr 19:00", t1: "Dynamo Dresden", t2: "VfL Osnabrück", score: "2 : 1" },
      { date: "Sa 14:00", t1: "Arminia Bielefeld", t2: "SV Waldhof", score: "1 : 0" },
      { date: "Sa 16:30", t1: "Energie Cottbus", t2: "Rot-Weiss Essen", score: "3 : 3" },
      { date: "So 19:30", t1: "1. FC Saarbrücken", t2: "SV Sandhausen", score: "0 : 1" }
    ],
    nextMatches: [
      { date: "Sa 14:00", t1: "Dynamo Dresden", t2: "Arminia Bielefeld", score: "- : -" },
      { date: "Sa 14:00", t1: "Saarbrücken", t2: "Energie Cottbus", score: "- : -" },
      { date: "So 16:30", t1: "SV Sandhausen", t2: "Rot-Weiss Essen", score: "- : -" }
    ]
  },
  pl: {
    title: "Premier League",
    table: [
      { pos: 1, team: "Liverpool FC", sp: 25, diff: "+38", pkt: 60 },
      { pos: 2, team: "Arsenal FC", sp: 25, diff: "+27", pkt: 53 },
      { pos: 3, team: "Manchester City", sp: 25, diff: "+22", pkt: 49 },
      { pos: 4, team: "Chelsea FC", sp: 25, diff: "+18", pkt: 46 },
      { pos: 5, team: "Nottingham Forest", sp: 25, diff: "+8", pkt: 44 }
    ],
    recentMatches: [
      { date: "Sa 13:30", t1: "Liverpool FC", t2: "Manchester City", score: "2 : 0" },
      { date: "Sa 16:00", t1: "Arsenal FC", t2: "Aston Villa", score: "3 : 1" },
      { date: "Sa 18:30", t1: "Chelsea FC", t2: "Brighton", score: "2 : 1" },
      { date: "So 17:30", t1: "Manchester United", t2: "Tottenham", score: "1 : 1" }
    ],
    nextMatches: [
      { date: "Sa 13:30", t1: "Arsenal", t2: "Chelsea", score: "- : -" },
      { date: "Sa 16:00", t1: "Liverpool", t2: "Aston Villa", score: "- : -" },
      { date: "Sa 18:30", t1: "Manchester City", t2: "Newcastle", score: "- : -" },
      { date: "So 17:30", t1: "Tottenham", t2: "Man United", score: "- : -" }
    ]
  }
};

const f1Data = {
  drivers: [
    { pos: 1, name: "Max Verstappen", team: "Red Bull Racing", pkt: 0 },
    { pos: 2, name: "Lando Norris", team: "McLaren", pkt: 0 },
    { pos: 3, name: "Charles Leclerc", team: "Ferrari", pkt: 0 },
    { pos: 4, name: "Oscar Piastri", team: "McLaren", pkt: 0 },
    { pos: 5, name: "Lewis Hamilton", team: "Ferrari", pkt: 0 },
    { pos: 6, name: "George Russell", team: "Mercedes", pkt: 0 }
  ],
  constructors: [
    { pos: 1, name: "McLaren", pkt: 0 },
    { pos: 2, name: "Ferrari", pkt: 0 },
    { pos: 3, name: "Red Bull Racing", pkt: 0 },
    { pos: 4, name: "Mercedes", pkt: 0 },
    { pos: 5, name: "Aston Martin", pkt: 0 }
  ],
  races: [
    { name: "GP von Australien", date: "14. - 16. März 2025", track: "Melbourne" },
    { name: "GP von China", date: "21. - 23. März 2025", track: "Shanghai" },
    { name: "GP von Japan", date: "04. - 06. April 2025", track: "Suzuka" },
    { name: "GP von Bahrain", date: "11. - 13. April 2025", track: "Sakhir" }
  ]
};

// ==========================================
// STATE MANAGEMENT
// ==========================================
let currentLeague = 'bl1';
let currentFootballView = 'table'; // 'table' | 'recent' | 'next'
let currentF1Category = 'drivers';

// ==========================================
// RENDER FUNKTIONEN
// ==========================================
function renderFootball() {
  const data = sportsData[currentLeague];

  document.getElementById('league-table-title').innerText = `${data.title} – Tabelle`;
  document.getElementById('league-recent-title').innerText = `${data.title} – Letzter Spieltag`;
  document.getElementById('league-next-title').innerText = `${data.title} – Nächster Spieltag`;

  // 1. Tabelle
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = data.table.map(row => `
    <tr>
      <td class="pos-col">${row.pos}</td>
      <td><span class="team-cell">${row.team}</span></td>
      <td class="num-col">${row.sp}</td>
      <td class="num-col">${row.diff}</td>
      <td class="points-col">${row.pkt}</td>
    </tr>
  `).join('');

  // 2. Letzter Spieltag (Ergebnisse)
  const recentList = document.getElementById('recent-matches-list');
  recentList.innerHTML = data.recentMatches.map(m => `
    <div class="match-item">
      <span class="match-date">${m.date}</span>
      <div class="match-teams">
        <div class="match-team"><span>${m.t1}</span></div>
        <div class="match-team"><span>${m.t2}</span></div>
      </div>
      <div class="match-badge result">${m.score}</div>
    </div>
  `).join('');

  // 3. Nächster Spieltag (Vorschau)
  const nextList = document.getElementById('next-matches-list');
  nextList.innerHTML = data.nextMatches.map(m => `
    <div class="match-item">
      <span class="match-date">${m.date}</span>
      <div class="match-teams">
        <div class="match-team"><span>${m.t1}</span></div>
        <div class="match-team"><span>${m.t2}</span></div>
      </div>
      <div class="match-badge">${m.score}</div>
    </div>
  `).join('');
}

function renderF1() {
  const wrap = document.getElementById('f1-table-wrap');
  const title = document.getElementById('f1-view-title');

  if (currentF1Category === 'drivers') {
    title.innerText = 'Fahrerwertung (Saison 2025)';
    wrap.innerHTML = `
      <table>
        <thead>
          <tr><th class="pos-col">#</th><th>Fahrer</th><th class="points-col">Pkt</th></tr>
        </thead>
        <tbody>
          ${f1Data.drivers.map(d => `
            <tr>
              <td class="pos-col">${d.pos}</td>
              <td><b>${d.name}</b><br><small style="color:var(--text-muted)">${d.team}</small></td>
              <td class="points-col">${d.pkt}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (currentF1Category === 'constructors') {
    title.innerText = 'Konstrukteurswertung (Saison 2025)';
    wrap.innerHTML = `
      <table>
        <thead>
          <tr><th class="pos-col">#</th><th>Konstrukteur</th><th class="points-col">Pkt</th></tr>
        </thead>
        <tbody>
          ${f1Data.constructors.map(c => `
            <tr>
              <td class="pos-col">${c.pos}</td>
              <td><b>${c.name}</b></td>
              <td class="points-col">${c.pkt}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (currentF1Category === 'races') {
    title.innerText = 'Rennkalender 2025';
    wrap.innerHTML = f1Data.races.map(r => `
      <div class="match-item">
        <div style="flex:1">
          <div style="font-weight:700; font-size:0.9rem">${r.name}</div>
          <div style="color:var(--text-muted); font-size:0.75rem">${r.track}</div>
        </div>
        <div class="match-badge">${r.date}</div>
      </div>
    `).join('');
  }
}

// ==========================================
// NAVIGATION & EVENTS
// ==========================================
function switchMainTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

  if (tab === 'football') {
    document.getElementById('tab-football').classList.add('active');
    document.getElementById('nav-fb').classList.add('active');
    document.getElementById('football-nav').style.display = 'block';
    document.getElementById('f1-nav').style.display = 'none';
    document.getElementById('app-title').innerText = 'Fußball Dashboard';
  } else {
    document.getElementById('tab-f1').classList.add('active');
    document.getElementById('nav-f1').classList.add('active');
    document.getElementById('football-nav').style.display = 'none';
    document.getElementById('f1-nav').style.display = 'block';
    document.getElementById('app-title').innerText = 'Formel 1 Hub';
    renderF1();
  }
}

function switchFootballLeague(leagueKey) {
  currentLeague = leagueKey;
  const chips = document.querySelectorAll('#football-nav .chip');
  chips.forEach(c => c.classList.remove('active'));
  if (window.event && window.event.target) {
    window.event.target.classList.add('active');
  }
  renderFootball();
}

function toggleFootballView(view) {
  currentFootballView = view;
  
  const btnTable = document.getElementById('btn-table');
  const btnRecent = document.getElementById('btn-recent');
  const btnNext = document.getElementById('btn-next');

  const vTable = document.getElementById('fb-table-view');
  const vRecent = document.getElementById('fb-recent-view');
  const vNext = document.getElementById('fb-next-view');

  // Buttons zurücksetzen
  [btnTable, btnRecent, btnNext].forEach(b => b.classList.remove('active'));
  // Container ausblenden
  vTable.style.display = 'none';
  vRecent.style.display = 'none';
  vNext.style.display = 'none';

  if (view === 'table') {
    btnTable.classList.add('active');
    vTable.style.display = 'block';
  } else if (view === 'recent') {
    btnRecent.classList.add('active');
    vRecent.style.display = 'block';
  } else if (view === 'next') {
    btnNext.classList.add('active');
    vNext.style.display = 'block';
  }
}

function switchF1Category(cat) {
  currentF1Category = cat;
  const chips = document.querySelectorAll('#f1-nav .chip');
  chips.forEach(c => c.classList.remove('active'));
  if (window.event && window.event.target) {
    window.event.target.classList.add('active');
  }
  renderF1();
}

// Initialer Startaufruf
document.addEventListener('DOMContentLoaded', () => {
  renderFootball();
});
