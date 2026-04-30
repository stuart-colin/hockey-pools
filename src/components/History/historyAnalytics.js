// Pure functions that derive storyline-style insights from a timeseries
// payload. Inputs are small (~181 series x 60 dates) so naive O(n*d) walks
// are fine.

const descendByPoints = (series, dateIdx) => {
  return [...series].sort((a, b) => (b.points[dateIdx] ?? 0) - (a.points[dateIdx] ?? 0));
};

const computeRanksOnDate = (series, dateIdx) => {
  const sorted = descendByPoints(series, dateIdx);
  const ranks = new Map();
  let lastPoints = null;
  let lastRank = 0;
  sorted.forEach((row, i) => {
    const pts = row.points[dateIdx] ?? 0;
    if (pts !== lastPoints) {
      lastRank = i + 1;
      lastPoints = pts;
    }
    ranks.set(row.rosterId, lastRank);
  });
  return ranks;
};

/**
 * For every series, compute the rank on each date so we can derive
 * climber/fader/peak storylines.
 *
 * @returns Map<rosterId, number[]>  // rank index per date
 */
export const computeRankMatrix = (series, dates) => {
  const matrix = new Map();
  series.forEach((row) => matrix.set(row.rosterId, new Array(dates.length).fill(0)));
  dates.forEach((_, dateIdx) => {
    const ranks = computeRanksOnDate(series, dateIdx);
    series.forEach((row) => {
      const arr = matrix.get(row.rosterId);
      arr[dateIdx] = ranks.get(row.rosterId) || 0;
    });
  });
  return matrix;
};

/**
 * Resolve a "from" date index based on a windowDays option.
 *   windowDays = null/undefined → 0 (all of tracked history)
 *   windowDays = N              → max(0, lastIdx - N)
 */
const resolveFromIdx = (dates, windowDays) => {
  const lastIdx = dates.length - 1;
  if (windowDays == null) return 0;
  return Math.max(0, lastIdx - windowDays);
};

/**
 * Series ordered by who climbed the most rank positions across the window.
 *
 * @param options.limit       max rosters to return (default 3)
 * @param options.windowDays  null = full history, N = compare today vs N days ago
 */
export const biggestClimbers = (series, dates, options = {}) => {
  const { limit = 3, windowDays = null } = options;
  if (!series.length || !dates.length) return [];
  const matrix = computeRankMatrix(series, dates);
  const lastIdx = dates.length - 1;
  const fromIdx = resolveFromIdx(dates, windowDays);
  const candidates = series.map((row) => {
    const ranks = matrix.get(row.rosterId);
    const startRank = ranks[fromIdx];
    const endRank = ranks[lastIdx];
    return {
      rosterId: row.rosterId,
      ownerName: row.ownerName,
      startRank,
      endRank,
      delta: startRank - endRank, // positive means moved up
    };
  });
  return candidates
    .filter((c) => c.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, limit);
};

/**
 * Series ordered by who fell the most rank positions across the window.
 *
 * @param options.limit       max rosters to return (default 3)
 * @param options.windowDays  null = full history, N = compare today vs N days ago
 */
export const biggestFaders = (series, dates, options = {}) => {
  const { limit = 3, windowDays = null } = options;
  if (!series.length || !dates.length) return [];
  const matrix = computeRankMatrix(series, dates);
  const lastIdx = dates.length - 1;
  const fromIdx = resolveFromIdx(dates, windowDays);
  const candidates = series.map((row) => {
    const ranks = matrix.get(row.rosterId);
    const startRank = ranks[fromIdx];
    const endRank = ranks[lastIdx];
    return {
      rosterId: row.rosterId,
      ownerName: row.ownerName,
      startRank,
      endRank,
      delta: endRank - startRank, // positive means fell
    };
  });
  return candidates
    .filter((c) => c.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, limit);
};

/**
 * Single biggest day-over-day jump in points within the given window.
 *
 * @param options.limit       max rosters to return (default 3)
 * @param options.windowDays  null = full timeline, N = only consider gains
 *                            whose "to" day is within the trailing N days
 */
export const biggestSingleDay = (series, dates, options = {}) => {
  const { limit = 3, windowDays = null } = options;
  if (!series.length || dates.length < 2) return [];
  const lastIdx = dates.length - 1;
  const fromI = windowDays != null
    ? Math.max(1, lastIdx - windowDays + 1)
    : 1;
  const candidates = [];
  series.forEach((row) => {
    let bestGain = 0;
    let bestDateIdx = fromI;
    for (let i = fromI; i <= lastIdx; i += 1) {
      const gain = (row.points[i] ?? 0) - (row.points[i - 1] ?? 0);
      if (gain > bestGain) {
        bestGain = gain;
        bestDateIdx = i;
      }
    }
    if (bestGain > 0) {
      candidates.push({
        rosterId: row.rosterId,
        ownerName: row.ownerName,
        gain: bestGain,
        date: dates[bestDateIdx],
      });
    }
  });
  return candidates.sort((a, b) => b.gain - a.gain).slice(0, limit);
};

/**
 * Top N rosters at a specific date index. Returns rosterIds.
 */
export const topNAtDate = (series, dateIdx, n = 10) => {
  return descendByPoints(series, dateIdx).slice(0, n).map((s) => s.rosterId);
};

/**
 * Rosters that gained the most points across a sliding window ending on
 * `referenceIdx` (defaults to the most recent day, kept positional-args-free
 * for parity with biggestClimbers/biggestFaders).
 *
 * @param options.windowDays    width of the trailing window (default 7)
 * @param options.n             max rosters to return (default 10)
 * @param options.referenceIdx  index of the day that anchors the right edge
 *                              of the window. null = use the latest day.
 */
export const topMovers = (series, dates, options = {}) => {
  const { windowDays = 7, n = 10, referenceIdx = null } = options;
  if (!series.length || dates.length < 2) return [];
  const lastIdx = referenceIdx != null
    ? Math.max(0, Math.min(dates.length - 1, referenceIdx))
    : dates.length - 1;
  const fromIdx = Math.max(0, lastIdx - windowDays);
  if (lastIdx === fromIdx) return [];
  return [...series]
    .map((row) => ({
      rosterId: row.rosterId,
      gain: (row.points[lastIdx] ?? 0) - (row.points[fromIdx] ?? 0),
    }))
    .filter((s) => s.gain > 0)
    .sort((a, b) => b.gain - a.gain)
    .slice(0, n)
    .map((s) => s.rosterId);
};
