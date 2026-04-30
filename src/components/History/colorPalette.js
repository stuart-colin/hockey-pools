// Deterministic color per rosterId so highlighted lines stay stable across
// refreshes. We hash the rosterId and rotate around the HSL wheel; the
// resulting colors are the only ones that ever render at full opacity, so
// occasional collisions on the ghost layer don't matter visually.

const hash = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

const HUE_OFFSET = 19;
const HUE_STEP = 47;

export const colorForRosterId = (rosterId) => {
  if (!rosterId) return 'hsl(210, 12%, 55%)';
  const h = (HUE_OFFSET + (hash(String(rosterId)) % 360) + HUE_STEP) % 360;
  return `hsl(${h}, 65%, 45%)`;
};

export const GHOST_COLOR = 'rgba(120, 120, 120, 0.15)';
export const GHOST_HOVER_COLOR = 'rgba(60, 60, 60, 0.65)';
