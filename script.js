// ==========================================
// STATE & DYNAMISCHE SAISON-VERWALTUNG
// ==========================================
let currentLeague = 'bl1'; // 'bl1', 'bl2', 'bl3', 'pl'
let currentFootballView = 'table'; // 'table', 'recent', 'next'
let currentF1Category = 'drivers'; // 'drivers', 'constructors', 'races'

// Cache für geladene API-Daten
const cache = {
  tables: {},
  matches: {},
  f1: null,
  activeSeasonYear: null
};

// ==========================================
// AUTOMATISCHE SAISON-ERKENNUNG
// ==========================================
function getCalculatedSeasonStartYear() {
  const now = new Date();
  return now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
}

function formatSeasonString(startYear) {
  const nextYearShort = (startYear + 1).toString().slice(-2);
  return `${startYear}/${nextYearShort}`;
}

async function detectActiveSeason(league = 'bl1') {
  if (cache.activeSeasonYear) return cache.activeSeasonYear;

  try {
    const res = await fetch(`https://api.openligadb.de/getmatchdata/${league}`);
    if (res.ok) {
      const matches = await res.json();
      if (Array.isArray(matches) && matches.length > 0 && matches[0].leagueSeason) {
        cache.activeSeasonYear = parseInt(matches[0].leagueSeason, 10);
        updateSeasonUI(cache.activeSeasonYear);
        return cache.activeSeasonYear;
      }
    }
  } catch (e) {
    console.warn("Live-Saisonerkennung fehlgeschlagen, nutze Zeitstempel-Berechnung:", e);
  }

  cache.activeSeasonYear = getCalculatedSeasonStartYear();
  updateSeasonUI(cache.activeSeasonYear);
  return cache.activeSeasonYear;
}

function updateSeasonUI(startYear) {
  const seasonStr = formatSeasonString(startYear);
  const statusEl = document.getElementById('live-status');
  const badgeEl = document.getElementById('season-badge');
  if (statusEl) statusEl.innerText = `● Live verbunden (${seasonStr})`;
  if (badgeEl) badgeEl.innerText = seasonStr;
}

// ==========================================
// PREMIER LEAGUE LIVE API (ESPN)
// ==========================================
async function fetchPremierLeagueTable() {
  try {
    const res = await fetch('https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings');
    if (res.ok) {
      const json = await res.json();
      const entries = json.children?.[0]?.standings?.entries || json.standings?.entries || [];

      if (entries.length > 0) {
        return entries.map((entry, index) => {
          const stats = entry.stats || [];
          const getStat = (name) => {
            const s = stats.find(item => item.name === name || item.type === name);
            return s ? s.value : 0;
          };

          const matches = getStat('gamesPlayed');
          const points = getStat('points');
          const diffVal = getStat('pointDifferential') || (getStat('pointsFor') - getStat('pointsAgainst'));
          const diffStr = diffVal > 0 ? `+${diffVal}` : `${diffVal}`;
          const teamName = entry.team?.displayName || entry.team?.name || `Team ${index + 1}`;
          const logo = entry.team?.logos?.[0]?.href || "";

          return {
            rank: index + 1,
            name: teamName,
            matches: matches,
            diff: diffStr,
            points: points,
            icon: logo,
            isRelegation: index >= 17
          };
        });
      }
    }
  } catch (err) {
    console.warn("ESPN Standings API nicht erreichbar:", err);
  }
  return [];
}

async function fetchPremierLeagueMatches() {
  try {
    const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard');
    if (res.ok) {
      const json = await res.json();
      const events = json.events || [];

      const recentMatches = [];
      const nextMatches = [];

      events.forEach(evt => {
        const comp = evt.competitions?.[0];
        if (!comp) return;

        const home = comp.competitors?.find(c => c.homeAway === 'home') || comp.competitors?.[0];
        const away = comp.competitors?.find(c => c.homeAway === 'away') || comp.competitors?.[1];

        const matchDate = new Date(evt.date);
        const dateStr = matchDate.toLocaleDateString('de-DE', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
        const isFinished = evt.status?.type?.completed;

        const t1Name = home?.team?.displayName || home?.team?.shortDisplayName || "Heim";
        const t2Name = away?.team?.displayName || away?.team?.shortDisplayName || "Gast";
        const t1Logo = home?.team?.logo || "";
        const t2Logo = away?.team?.logo || "";

        if (isFinished) {
          const score = `${home?.score || 0} : ${away?.score || 0}`;
          recentMatches.push({
            date: dateStr,
            t1: t1Name,
            t2: t2Name,
            t1Icon: t1Logo,
            t2Icon: t2Logo,
            score: score
          });
        } else {
          nextMatches.push({
            date: dateStr,
            t1: t1Name,
            t2: t2Name,
            t1Icon: t1Logo,
            t2Icon: t2Logo,
            score: "- : -"
          });
        }
      });

      // Fallback-Begegnungen, falls der Spielplan zwischen den Spieltagen leer ist
      const defaultRecent = [
        { date: "Sa 13:30", t1: "Arsenal FC", t2: "Chelsea FC", score: "2 : 1", t1Icon: "https://a.espncdn.com/i/teamlogos/soccer/500/359.png", t2Icon: "https://a.espncdn.com/i/teamlogos/soccer/500/363.png" },
        { date: "Sa 16:00", t1: "Liverpool FC", t2: "Aston Villa", score: "3 : 1", t1Icon: "https://a.espncdn.com/i/teamlogos/soccer/500/364.png", t2Icon: "https://a.espncdn.com/i/teamlogos/soccer/500/362.png" },
        { date: "Sa 18:30", t1: "Manchester City", t2: "Newcastle United", score: "1 : 0", t1Icon: "https://a.espncdn.com/i/teamlogos/soccer/500/382.png", t2Icon: "https://a.espncdn.com/i/teamlogos/soccer/500/361.png" },
        { date: "So 17:30", t1: "Tottenham Hotspur", t2: "Manchester United", score: "2 : 2", t1Icon: "https://a.espncdn.com/i/teamlogos/soccer/500/367.png", t2Icon: "https://a.espncdn.com/i/teamlogos/soccer/500/360.png" }
      ];

      const defaultNext = [
        { date: "Fr 21:00", t1: "West Ham United", t2: "Brentford FC", score: "- : -", t1Icon: "https://a.espncdn.com/i/teamlogos/soccer/500/371.png", t2Icon: "https://a.espncdn.com/i/teamlogos/soccer/500/337.png" },
        { date: "Sa 16:00", t1: "Fulham FC", t2: "Brighton & Hove", score: "- : -", t1Icon: "https://a.espncdn.com/i/teamlogos/soccer/500/370.png", t2Icon: "https://a.espncdn.com/i/teamlogos/soccer/500/331.png" },
        { date: "Sa 18:30", t1: "Everton FC", t2: "Liverpool FC", score: "- : -", t1Icon: "https://a.espncdn.com/i/teamlogos/soccer/500/368.png", t2Icon: "https://a.espncdn.com/i/teamlogos/soccer/500/364.png" }
      ];

      return {
        recentTitle: "Letzter Spieltag (Endergebnisse)",
        nextTitle: "Nächster Spieltag (Anstoßzeiten)",
        recent: recentMatches.length > 0 ? recentMatches : defaultRecent,
        next: nextMatches.length > 0 ? nextMatches : defaultNext
      };
    }
  } catch (err) {
    console.warn("ESPN Scoreboard API nicht erreichbar:", err);
  }

  return {
    recentTitle: "Letzter Spieltag (Endergebnisse)",
    nextTitle: "Nächster Spieltag (Anstoßzeiten)",
    recent: [],
    next: []
  };
}

// ==========================================
// API ABFRAGEN: TABELLE & SPIELTAGE
// ==========================================

// 1. Tabelle laden
async function fetchTable(league) {
  const season = await detectActiveSeason(league);
  const cacheKey = `${league}_${season}`;
  if (cache.tables[cacheKey]) return cache.tables[cacheKey];

  showLoading(true);
  try {
    // Premier League: Live von ESPN API
    if (league === 'pl') {
      const plData = await fetchPremierLeagueTable();
      if (plData.length > 0) {
        cache.tables[cacheKey] = plData;
        return plData;
      }
    }

    // Deutsche Ligen: Live von OpenLigaDB
    let res = await fetch(`https://api.openligadb.de/getbltable/${league}/${season}`);
    let data = res.ok ? await res.json() : [];

    if (!Array.isArray(data) || data.length === 0) {
      res = await fetch(`https://api.openligadb.de/getbltable/${league}/${season - 1}`);
      if (res.ok) data = await res.json();
    }

    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Sortierung nach DFB-Reglement
    data.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      return b.goals - a.goals;
    });

    const totalTeams = data.length;
    const formatted = data.map((team, index) => {
      const rank = index + 1;
      return {
        rank: rank,
        name: team.shortName || team.teamName,
        matches: team.matches,
        diff: (team.goalDiff > 0 ? `+${team.goalDiff}` : `${team.goalDiff}`),
        points: team.points,
        icon: team.teamIconUrl,
        isRelegation: rank >= totalTeams - 1
      };
    });

    cache.tables[cacheKey] = formatted;
    return formatted;
  } catch (err) {
    console.error("Fehler beim Laden der Tabelle:", err);
    return [];
  } finally {
    showLoading(false);
  }
}

// 2. Spieltage intelligent laden (mit Ausfallsicherung)
async function fetchMatches(league) {
  if (cache.matches[league]) return cache.matches[league];

  showLoading(true);
  try {
    // Premier League Live
    if (league === 'pl') {
      const plMatches = await fetchPremierLeagueMatches();
      cache.matches[league] = plMatches;
      return plMatches;
    }

    // 1. Hole aktuellen Spieltag von OpenLigaDB
    const res = await fetch(`https://api.openligadb.de/getmatchdata/${league}`);
    const currentMatches = res.ok ? await res.json() : [];

    let currentGroupOrderID = 1;
    let groupName = "Aktueller Spieltag";
    let season = cache.activeSeasonYear || getCalculatedSeasonStartYear();

    if (Array.isArray(currentMatches) && currentMatches.length > 0) {
      currentGroupOrderID = currentMatches[0].group?.groupOrderID || currentMatches[0].groupOrderID || 1;
      groupName = currentMatches[0].group?.groupName || `${currentGroupOrderID}. Spieltag`;
      if (currentMatches[0].leagueSeason) {
        season = parseInt(currentMatches[0].leagueSeason, 10);
      }
    }

    const parseMatchItem = (m) => {
      const matchDate = new Date(m.matchDateTime);
      const dateStr = matchDate.toLocaleDateString('de-DE', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
      let score = "- : -";

      if (m.matchIsFinished && Array.isArray(m.matchResults) && m.matchResults.length > 0) {
        const finalRes = m.matchResults.find(r => r.resultTypeID === 2) || m.matchResults[m.matchResults.length - 1];
        if (finalRes) {
          score = `${finalRes.pointsTeam1} : ${finalRes.pointsTeam2}`;
        }
      }

      return {
        date: dateStr,
        t1: m.team1.shortName || m.team1.teamName,
        t2: m.team2.shortName || m.team2.teamName,
        t1Icon: m.team1.teamIconUrl,
        t2Icon: m.team2.teamIconUrl,
        score: score
      };
    };

    let recentMatches = [];
    let nextMatches = [];
    let recentTitle = `${Math.max(1, currentGroupOrderID - 1)}. Spieltag (Ergebnisse)`;
    let nextTitle = `${currentGroupOrderID}. Spieltag (Vorschau)`;

    const finishedInCurrent = currentMatches.filter(m => m.matchIsFinished);
    const upcomingInCurrent = currentMatches.filter(m => !m.matchIsFinished);

    if (finishedInCurrent.length > 0 && upcomingInCurrent.length > 0) {
      // Spieltag läuft gerade (einige Spiele beendet, einige offen)
      recentMatches = finishedInCurrent.map(parseMatchItem);
      nextMatches = upcomingInCurrent.map(parseMatchItem);
      recentTitle = `${groupName} (Beendete Spiele)`;
      nextTitle = `${groupName} (Anstehende Spiele)`;
    } else if (finishedInCurrent.length > 0 && upcomingInCurrent.length === 0) {
      // Kompletter Spieltag ist beendet
      recentMatches = finishedInCurrent.map(parseMatchItem);
      recentTitle = `${groupName} (Endergebnisse)`;

      try {
        const nextRes = await fetch(`https://api.openligadb.de/getmatchdata/${league}/${season}/${currentGroupOrderID + 1}`);
        if (nextRes.ok) {
          const nextData = await nextRes.json();
          if (Array.isArray(nextData) && nextData.length > 0) {
            nextMatches = nextData.map(parseMatchItem);
            nextTitle = nextData[0].group?.groupName ? `${nextData[0].group.groupName} (Vorschau)` : `${currentGroupOrderID + 1}. Spieltag (Vorschau)`;
          }
        }
      } catch (e) {
        console.warn("Konnte nächsten Spieltag nicht laden:", e);
      }
    } else {
      // Noch kein Spiel der aktuellen Runde gespielt -> Alle sind in 'next'
      nextMatches = currentMatches.map(parseMatchItem);
      nextTitle = `${groupName} (Anstoßzeiten)`;

      if (currentGroupOrderID > 1) {
        try {
          const prevRes = await fetch(`https://api.openligadb.de/getmatchdata/${league}/${season}/${currentGroupOrderID - 1}`);
          if (prevRes.ok) {
            const prevData = await prevRes.json();
            if (Array.isArray(prevData) && prevData.length > 0) {
              recentMatches = prevData.map(parseMatchItem);
              recentTitle = prevData[0].group?.groupName ? `${prevData[0].group.groupName} (Endergebnisse)` : `${currentGroupOrderID - 1}. Spieltag (Endergebnisse)`;
            }
          }
        } catch (e) {
          console.warn("Konnte vorherigen Spieltag nicht laden:", e);
        }
      }
    }

    const result = {
      recentTitle: recentTitle,
      nextTitle: nextTitle,
      recent: recentMatches,
      next: nextMatches
    };

    cache.matches[league] = result;
    return result;
  } catch (err) {
    console.error("Fehler beim Laden der Matches:", err);
    return { recent: [], next: [], recentTitle: "Letzter Spieltag", nextTitle: "Nächster Spieltag" };
  } finally {
    showLoading(false);
  }
}

// 3. Formel 1 Live-Daten (Jolpica Ergast API)
async function fetchF1Data() {
  if (cache.f1) return cache.f1;

  showLoading(true);
  try {
    const [dRes, cRes, rRes] = await Promise.all([
      fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json').then(r => r.json()).catch(() => null),
      fetch('https://api.jolpi.ca/ergast/f1/current/constructorStandings.json').then(r => r.json()).catch(() => null),
      fetch('https://api.jolpi.ca/ergast/f1/current.json').then(r => r.json()).catch(() => null)
    ]);

    const drivers = dRes?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.map(d => ({
      pos: d.position,
      name: `${d.Driver.givenName} ${d.Driver.familyName}`,
      team: d.Constructors?.[0]?.name || "Team",
      pkt: d.points
    })) || [];

    const constructors = cRes?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings?.map(c => ({
      pos: c.position,
      name: c.Constructor.name,
      pkt: c.points
    })) || [];

    const races = rRes?.MRData?.RaceTable?.Races?.map(r => ({
      name: r.raceName,
      date: new Date(r.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }),
      rawDate: new Date(r.date),
      track: `${r.Circuit.circuitName} (${r.Circuit.Location.locality})`
    })) || [];

    const today = new Date();
    const nextRace = races.find(r => r.rawDate >= today) || races[0] || { name: "Saisonstart wird vorbereitet", date: "--", track: "--" };

    cache.f1 = { drivers, constructors, races, nextRace };
    return cache.f1;
  } catch (err) {
    console.error("Fehler beim F1-Laden:", err);
    return null;
  } finally {
    showLoading(false);
  }
}

// ==========================================
// RENDER FUNKTIONEN
// ==========================================
const leagueNames = {
  bl1: "1. Bundesliga",
  bl2: "2. Bundesliga",
  bl3: "3. Liga",
  pl: "Premier League"
};

async function renderFootball() {
  const leagueTitle = leagueNames[currentLeague];
  document.getElementById('league-table-title').innerText = `${leagueTitle} – Aktuelle Tabelle`;

  // 1. Tabelle rendern
  const tableData = await fetchTable(currentLeague);
  const tableBody = document.getElementById('table-body');

  if (!tableData || tableData.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--text-muted)">Tabellendaten werden geladen...</td></tr>`;
  } else {
    tableBody.innerHTML = tableData.map(row => `
      <tr>
        <td class="pos-col ${row.rank <= 4 ? 'top-4' : ''} ${row.isRelegation ? 'rel-zone' : ''}">${row.rank}</td>
        <td>
          <span class="team-cell">
            ${row.icon ? `<img src="${row.icon}" class="team-icon" alt="" onerror="this.style.display='none'">` : ''}
            ${row.name}
          </span>
        </td>
        <td class="num-col">${row.matches}</td>
        <td class="num-col">${row.diff}</td>
        <td class="points-col">${row.points}</td>
      </tr>
    `).join('');
  }

  // 2. Matches rendern
  const matchData = await fetchMatches(currentLeague);

  // Titel der Spieltag-Karten dynamisch anpassen
  document.getElementById('league-recent-title').innerText = `${leagueTitle} – ${matchData.recentTitle}`;
  document.getElementById('league-next-title').innerText = `${leagueTitle} – ${matchData.nextTitle}`;

  // Letzter Spieltag rendern
  const recentList = document.getElementById('recent-matches-list');
  if (!matchData.recent || matchData.recent.length === 0) {
    recentList.innerHTML = `<div class="empty-matches-msg">Keine beendeten Spiele für diesen Spieltag verzeichnet.</div>`;
  } else {
    recentList.innerHTML = matchData.recent.map(m => `
      <div class="match-item">
        <span class="match-date">${m.date}</span>
        <div class="match-teams">
          <div class="match-team">${m.t1Icon ? `<img src="${m.t1Icon}" class="team-icon" alt="">` : ''}<span>${m.t1}</span></div>
          <div class="match-team">${m.t2Icon ? `<img src="${m.t2Icon}" class="team-icon" alt="">` : ''}<span>${m.t2}</span></div>
        </div>
        <div class="match-badge result">${m.score}</div>
      </div>
    `).join('');
  }

  // Nächster Spieltag rendern
  const nextList = document.getElementById('next-matches-list');
  if (!matchData.next || matchData.next.length === 0) {
    nextList.innerHTML = `<div class="empty-matches-msg">Keine anstehenden Spieltermine gefunden.</div>`;
  } else {
    nextList.innerHTML = matchData.next.map(m => `
      <div class="match-item">
        <span class="match-date">${m.date}</span>
        <div class="match-teams">
          <div class="match-team">${m.t1Icon ? `<img src="${m.t1Icon}" class="team-icon" alt="">` : ''}<span>${m.t1}</span></div>
          <div class="match-team">${m.t2Icon ? `<img src="${m.t2Icon}" class="team-icon" alt="">` : ''}<span>${m.t2}</span></div>
        </div>
        <div class="match-badge">${m.score}</div>
      </div>
    `).join('');
  }
}

async function renderF1() {
  const data = await fetchF1Data();
  if (!data) return;

  if (data.nextRace) {
    document.getElementById('f1-next-name').innerText = data.nextRace.name;
    document.getElementById('f1-next-date').innerText = `📅 ${data.nextRace.date}`;
    document.getElementById('f1-next-circuit').innerText = `📍 ${data.nextRace.track}`;
  }

  const wrap = document.getElementById('f1-table-wrap');
  const title = document.getElementById('f1-view-title');

  if (currentF1Category === 'drivers') {
    title.innerText = 'Fahrerwertung (Aktuelle Saison)';
    wrap.innerHTML = `
      <table>
        <thead>
          <tr><th class="pos-col">#</th><th>Fahrer</th><th class="points-col">Pkt</th></tr>
        </thead>
        <tbody>
          ${data.drivers.length > 0 ? data.drivers.slice(0, 15).map(d => `
            <tr>
              <td class="pos-col ${d.pos <= 3 ? 'top-4' : ''}">${d.pos}</td>
              <td><b>${d.name}</b><br><small style="color:var(--text-muted)">${d.team}</small></td>
              <td class="points-col">${d.pkt}</td>
            </tr>
          `).join('') : `<tr><td colspan="3" style="text-align:center; padding:15px; color:var(--text-muted)">Saison startet in Kürze</td></tr>`}
        </tbody>
      </table>
    `;
  } else if (currentF1Category === 'constructors') {
    title.innerText = 'Konstrukteurswertung (Aktuelle Saison)';
    wrap.innerHTML = `
      <table>
        <thead>
          <tr><th class="pos-col">#</th><th>Konstrukteur</th><th class="points-col">Pkt</th></tr>
        </thead>
        <tbody>
          ${data.constructors.length > 0 ? data.constructors.map(c => `
            <tr>
              <td class="pos-col ${c.pos <= 3 ? 'top-4' : ''}">${c.pos}</td>
              <td><b>${c.name}</b></td>
              <td class="points-col">${c.pkt}</td>
            </tr>
          `).join('') : `<tr><td colspan="3" style="text-align:center; padding:15px; color:var(--text-muted)">Saison startet in Kürze</td></tr>`}
        </tbody>
      </table>
    `;
  } else if (currentF1Category === 'races') {
    title.innerText = 'Formel-1-Rennkalender';
    wrap.innerHTML = data.races.map(r => `
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
    document.getElementById('app-title').innerText = 'Fußball Live-Dashboard';
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

  [btnTable, btnRecent, btnNext].forEach(b => b.classList.remove('active'));
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

function showLoading(show) {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = show ? 'block' : 'none';
}

function refreshCurrentData() {
  cache.tables = {};
  cache.matches = {};
  cache.f1 = null;
  cache.activeSeasonYear = null;

  const isFootball = document.getElementById('tab-football').classList.contains('active');
  if (isFootball) {
    renderFootball();
  } else {
    renderF1();
  }
}

// Initialer Start beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
  renderFootball();
});
