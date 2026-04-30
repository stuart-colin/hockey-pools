// Deterministic colour per roster on the history chart. We delegate to the
// same hash-based palette the standings avatars use (`getAvatarColor`),
// keyed on owner name so a roster's chart line matches their standings
// avatar swatch. Trade-off: only 10 distinct colours, so ~18 rosters share
// each colour with 181 rosters — but the pin/tooltip/leaderboard swatches
// disambiguate, and the consistency win across pages is worth it.
import { getAvatarColor } from '../Standings/Standings.utils';

const FALLBACK_COLOR = 'hsl(210, 12%, 55%)';

export const colorForRoster = (ownerName) => {
  if (!ownerName) return FALLBACK_COLOR;
  return getAvatarColor(ownerName);
};

// Back-compat alias: a few call sites still pass the raw rosterId. The
// underlying hash is name-based now, so callers should prefer
// `colorForRoster(ownerName)` going forward — but we keep this so we can
// migrate gradually without breaking anything.
export const colorForRosterId = (rosterIdOrName) => colorForRoster(rosterIdOrName);

export const GHOST_COLOR = 'rgba(120, 120, 120, 0.15)';
export const GHOST_HOVER_COLOR = 'rgba(60, 60, 60, 0.65)';
