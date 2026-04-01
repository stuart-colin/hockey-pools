// ============================================
// DEV TEST FLAGS
// Toggle these to test features before they're live.
// All flags should be set to their "off" values before committing.
// ============================================

// Simulate eliminated teams before playoffs start.
// Set to true and edit ELIMINATED_TEAMS to test elimination visuals.
export const DEV_TEST_ELIMINATED = false;
export const DEV_ELIMINATED_TEAMS = [
  'Toronto Maple Leafs',
  'Edmonton Oilers',
  'Colorado Avalanche'
];

// Override the live stats date to test against a past day with completed games.
// Set to a 'YYYY-MM-DD' string (e.g. '2025-04-12') or null for normal "today" behavior.
export const DATE_0 = null; // Change this to switch between test dates
export const DATE_1 = '2026-04-01';
export const DATE_2 = '2026-01-31';
export const DATE_3 = '2025-10-15';
export const DEV_TEST_SCORES_DATE = DATE_0; // Change this to switch between test dates
