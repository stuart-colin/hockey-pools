/* eslint-disable no-console */
/**
 * Stand-alone comparison of four "Biggest Steals / Biggest Busts" algorithms
 * (plus the original raw-points baseline) against live roster data.
 *
 * The repo ships with Algorithm B (expected-points regression) wired into the
 * UI. Use this script when you want to re-tune the model or evaluate a new
 * approach against real pool data without redeploying.
 *
 * Setup (from repo root):
 *   curl -sS -o rosters.json "https://hockey-pools-api.fly.dev/v1/rosters?limit=1000"
 *
 * Usage:
 *   node scripts/compare-bust-models.js
 *
 * Optional flags:
 *   --bust-floor=20     Min pick-rate% a player needs to be considered a bust
 *   --steal-ceiling=25  Max pick-rate% a player can have to be considered a steal
 *   --top=8             How many rows to show per algorithm
 *
 * rosters.json is intentionally git-ignored - re-fetch it whenever you re-run.
 */

const fs = require('fs');
const path = require('path');

// ---------- args ----------
const args = process.argv.slice(2).reduce((acc, a) => {
  const m = a.match(/^--([^=]+)=(.*)$/);
  if (m) acc[m[1]] = m[2];
  return acc;
}, {});
const BUST_FLOOR = Number(args['bust-floor'] ?? 20);
const STEAL_CEILING = Number(args['steal-ceiling'] ?? 25);
const TOP_N = Number(args['top'] ?? 8);

// ---------- load data ----------
const rostersPath = path.join(__dirname, '..', 'rosters.json');
const raw = JSON.parse(fs.readFileSync(rostersPath, 'utf8'));
const rosters = raw.results || [];
const TOTAL_ROSTERS = rosters.length;

console.log(`Loaded ${TOTAL_ROSTERS} rosters.`);
console.log(`Bust floor (min pick-rate%): ${BUST_FLOOR}`);
console.log(`Steal ceiling (max pick-rate%): ${STEAL_CEILING}`);
console.log(`Top N per algorithm: ${TOP_N}\n`);

// ---------- normalize players ----------
const calculateSkaterPoints = (g, a, ot) => g + a + ot;
const calculateGoaliePoints = (w, so, otl) => w * 2 + so * 2 + otl;

const normalize = (p) => {
  if (!p) return null;
  const sub = p.stats?.featuredStats?.playoffs?.subSeason;
  const isGoalie = p.position === 'G';
  const goals = sub?.goals || 0;
  const assists = sub?.assists || 0;
  const otGoals = sub?.otGoals || 0;
  const wins = sub?.wins || 0;
  const shutouts = sub?.shutouts || 0;
  const otl = p.stats?.otl || 0;
  const points = isGoalie
    ? calculateGoaliePoints(wins, shutouts, otl)
    : calculateSkaterPoints(goals, assists, otGoals);
  return {
    id: p.nhl_id,
    name: p.name,
    position: p.position,
    points,
  };
};

// Build playerMap keyed by nhl_id, accumulating pickCount
const playerMap = new Map();
for (const r of rosters) {
  const all = [
    ...(r.left || []),
    ...(r.center || []),
    ...(r.right || []),
    ...(r.defense || []),
    ...(r.goalie || []),
    ...(r.utility ? [r.utility] : []),
  ].filter(Boolean);

  for (const raw of all) {
    const n = normalize(raw);
    if (!n) continue;
    if (!playerMap.has(n.id)) {
      playerMap.set(n.id, { ...n, pickCount: 1 });
    } else {
      playerMap.get(n.id).pickCount += 1;
    }
  }
}

const players = [...playerMap.values()].map(p => ({
  ...p,
  pickRate: (p.pickCount / TOTAL_ROSTERS) * 100,
}));

console.log(`Unique players in pool: ${players.length}`);
console.log(`  Forwards (L/C/R): ${players.filter(p => 'LCR'.includes(p.position)).length}`);
console.log(`  Defense (D):       ${players.filter(p => p.position === 'D').length}`);
console.log(`  Goalies (G):       ${players.filter(p => p.position === 'G').length}\n`);

// ---------- shared helpers ----------
const POSITION_GROUP = { L: 'F', C: 'F', R: 'F', D: 'D', G: 'G' };
const groupOf = p => POSITION_GROUP[p.position] || 'F';

const groupBy = (arr, fn) => arr.reduce((acc, x) => {
  const k = fn(x);
  (acc[k] = acc[k] || []).push(x);
  return acc;
}, {});

const percentileRank = (value, allValues) => {
  if (!allValues || allValues.length <= 1) return 50;
  let lt = 0, eq = 0;
  for (const v of allValues) {
    if (v < value) lt += 1;
    else if (v === value) eq += 1;
  }
  return ((lt + 0.5 * eq) / allValues.length) * 100;
};

const mean = arr => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
const stdev = arr => {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return Math.sqrt(arr.reduce((a, x) => a + (x - m) ** 2, 0) / arr.length);
};

// ---------- ALGORITHM 0 (BASELINE): current production logic ----------
// Filter by pick rate floor/ceiling, then sort by raw points (no position aware).
const algo0 = players.map(p => ({
  ...p,
  // For busts (sorted by score desc) we want low-points players to win, so
  // negate points so that a 0-point player gets the highest score.
  score: -p.points,
  detail: `raw points = ${p.points} (no position adjustment)`,
}));

// ---------- ALGORITHM A: within-position percentile gap ----------
// bustScore  = pickRatePct(within F/D/G) - pointsPct(within F/D/G)
// stealScore = -bustScore
const algoA = (() => {
  const groups = groupBy(players, groupOf);
  const groupArrays = {};
  for (const [k, arr] of Object.entries(groups)) {
    groupArrays[k] = {
      pickRates: arr.map(p => p.pickRate),
      points: arr.map(p => p.points),
    };
  }
  return players.map(p => {
    const g = groupOf(p);
    const pickPct = percentileRank(p.pickRate, groupArrays[g].pickRates);
    const pointsPct = percentileRank(p.points, groupArrays[g].points);
    return {
      ...p,
      score: pickPct - pointsPct,
      detail: `pick ${Math.round(pickPct)}%ile, pts ${Math.round(pointsPct)}%ile (${g})`,
    };
  });
})();

// ---------- ALGORITHM B: expected-points regression ----------
// Within each position group fit linear: expectedPoints = a + b * pickRate.
// score (bust) = expected - actual (positive = underperformed expectation).
// score (steal) = actual - expected.
const linearFit = (xs, ys) => {
  const n = xs.length;
  if (n < 2) return { a: ys[0] || 0, b: 0 };
  const mx = mean(xs), my = mean(ys);
  let num = 0, den = 0;
  for (let i = 0; i < n; i += 1) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) ** 2;
  }
  const b = den === 0 ? 0 : num / den;
  const a = my - b * mx;
  return { a, b };
};

const algoB = (() => {
  const groups = groupBy(players, groupOf);
  const fits = {};
  for (const [k, arr] of Object.entries(groups)) {
    fits[k] = linearFit(arr.map(p => p.pickRate), arr.map(p => p.points));
  }
  return players.map(p => {
    const g = groupOf(p);
    const { a, b } = fits[g];
    const expected = a + b * p.pickRate;
    const residual = p.points - expected; // positive = beat expectation
    return {
      ...p,
      score: -residual, // for "bust" larger = worse
      detail: `expected ${expected.toFixed(1)} pts, got ${p.points} (${g})`,
    };
  });
})();

// ---------- ALGORITHM C: Value Over Replacement (VOR) ----------
// Define replacement-level per position as the points value of the player whose
// pick-rate rank within their group lands at the "starter cutoff" - i.e. the
// approximate number of starting roster slots pool-wide:
//   F slots per roster = 9 (3L+3C+3R), * teams = pool slots
//   D slots per roster = 4
//   G slots per roster = 2
// The cutoff player is the lowest-points player still in starter range when
// sorted by pick rate desc. bustness = pickRate% * (replacement - actual_pts).
const algoC = (() => {
  const groups = groupBy(players, groupOf);
  const slotCount = { F: 9, D: 4, G: 2 };
  const replacement = {};
  for (const [g, arr] of Object.entries(groups)) {
    const cutoff = slotCount[g] * 1; // players >= 1 pick rate, take top N "starters"
    const sortedByPickDesc = [...arr].sort((a, b) => b.pickCount - a.pickCount);
    const top = sortedByPickDesc.slice(0, cutoff);
    replacement[g] = top.length ? Math.min(...top.map(p => p.points)) : 0;
  }
  return players.map(p => {
    const g = groupOf(p);
    const repl = replacement[g];
    const gap = repl - p.points; // positive = below replacement
    return {
      ...p,
      score: (p.pickRate / 100) * gap,
      detail: `repl ${repl} pts, got ${p.points} (${g}, slots=${slotCount[g]})`,
    };
  });
})();

// ---------- ALGORITHM D: composite z-score ----------
// pickRate z-score across all players, points z-score within position group.
// bustScore = z(pickRate, all) - z(points, group)
const algoD = (() => {
  const allPickRates = players.map(p => p.pickRate);
  const muPick = mean(allPickRates);
  const sdPick = stdev(allPickRates) || 1;

  const groups = groupBy(players, groupOf);
  const stats = {};
  for (const [g, arr] of Object.entries(groups)) {
    const pts = arr.map(p => p.points);
    stats[g] = { mu: mean(pts), sd: stdev(pts) || 1 };
  }
  return players.map(p => {
    const g = groupOf(p);
    const zPick = (p.pickRate - muPick) / sdPick;
    const zPts = (p.points - stats[g].mu) / stats[g].sd;
    return {
      ...p,
      score: zPick - zPts,
      detail: `z-pick ${zPick.toFixed(2)}, z-pts ${zPts.toFixed(2)} (${g})`,
    };
  });
})();

// ---------- print helpers ----------
const padR = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);

const printList = (title, list) => {
  console.log(`\n=== ${title} ===`);
  console.log(
    `${padR('#', 3)} ${padR('Player', 26)} ${padR('Pos', 4)} ` +
    `${padL('Pick%', 6)} ${padL('Pts', 5)} ${padL('Score', 8)}  Detail`
  );
  console.log('-'.repeat(110));
  list.forEach((p, i) => {
    console.log(
      `${padR(i + 1, 3)} ${padR(p.name, 26)} ${padR(p.position, 4)} ` +
      `${padL(p.pickRate.toFixed(1), 6)} ${padL(p.points, 5)} ${padL(p.score.toFixed(2), 8)}  ${p.detail}`
    );
  });
};

const rankBusts = (scored, label) => {
  // Apply pick-rate floor for busts, sort score desc.
  const filtered = scored.filter(p => p.pickRate >= BUST_FLOOR);
  const sorted = [...filtered].sort((a, b) => b.score - a.score || a.points - b.points);
  printList(`BUSTS  -  ${label}`, sorted.slice(0, TOP_N));
};

const rankSteals = (scored, label) => {
  // Apply pick-rate ceiling for steals, sort score asc (smaller bustScore = better steal)
  // For algos A & D the score IS bust-orientation so flip; for B/C we negate.
  // Simpler: define stealScore = -score; that works for all four because each
  // algorithm's `score` is already calibrated as "bust = bigger".
  const filtered = scored.filter(p => p.pickRate <= STEAL_CEILING);
  const sorted = [...filtered].sort((a, b) => a.score - b.score || b.points - a.points);
  printList(`STEALS -  ${label}`, sorted.slice(0, TOP_N));
};

// ---------- run ----------
console.log('============================================================');
console.log('  STEALS  (pickRate <= ' + STEAL_CEILING + '%)');
console.log('============================================================');
rankSteals(algo0, '0: CURRENT - filter by pick rate, sort by raw points');
rankSteals(algoA, 'A: within-position percentile gap');
rankSteals(algoB, 'B: expected-points regression');
rankSteals(algoC, 'C: Value Over Replacement (VOR)');
rankSteals(algoD, 'D: composite z-score');

console.log('\n\n============================================================');
console.log('  BUSTS   (pickRate >= ' + BUST_FLOOR + '%)');
console.log('============================================================');
rankBusts(algo0, '0: CURRENT - filter by pick rate, sort by raw points');
rankBusts(algoA, 'A: within-position percentile gap');
rankBusts(algoB, 'B: expected-points regression');
rankBusts(algoC, 'C: Value Over Replacement (VOR)');
rankBusts(algoD, 'D: composite z-score');
