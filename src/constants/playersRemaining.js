/**
 * Gradient text color for “n / 16 players remaining” (0 = worst, 16 = best).
 * Shared by Standings, My Team, and anywhere else that surfaces this metric.
 */
export const PLAYERS_REMAINING_COLORS = [
  '#db2828',
  '#e01b3d',
  '#e21051',
  '#e21064',
  '#df1a76',
  '#da2788',
  '#d23499',
  '#c841a8',
  '#bc4cb5',
  '#ae57c1',
  '#9e60ca',
  '#8d69d1',
  '#7b70d5',
  '#6777d7',
  '#537cd7',
  '#3c81d4',
  '#2185d0',
];

/**
 * @param {number} count — players remaining (0–16; clamped)
 * @returns {string} hex color
 */
export function getPlayersRemainingColor(count) {
  const i = Math.min(Math.max(Number(count) || 0, 0), PLAYERS_REMAINING_COLORS.length - 1);
  return PLAYERS_REMAINING_COLORS[i];
}
