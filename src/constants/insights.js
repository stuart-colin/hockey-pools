/**
 * Insights component constants
 */

// Threshold control defaults
export const DEFAULT_HIGH_THRESHOLD = 15; // Steals: max selection % a player can have
export const DEFAULT_LOW_THRESHOLD = 15;  // Busts: min selection % a player must have
export const THRESHOLD_SMALL_STEP = 1;
export const THRESHOLD_BIG_STEP = 10;

// Threshold-aware descriptions for the slider tooltips.
export const INSIGHT_DESCRIPTIONS = {
  MOST_ADVANTAGEOUS: (threshold) =>
    `Players selected by ${threshold}% or fewer of teams who outscored what their selection rate predicted (within their position group).`,
  LEAST_ADVANTAGEOUS: (threshold) =>
    `Players selected by at least ${threshold}% of teams who fell furthest below what their selection rate predicted (within their position group).`,
};

// Roster position configuration with slot counts
export const POSITION_CONFIG = {
  LEFT: { key: 'Left', label: 'Left', slots: 3 },
  CENTER: { key: 'Center', label: 'Center', slots: 3 },
  RIGHT: { key: 'Right', label: 'Right', slots: 3 },
  DEFENSE: { key: 'Defense', label: 'Defense', slots: 4 },
  GOALIE: { key: 'Goalie', label: 'Goalie', slots: 2 },
  UTILITY: { key: 'Utility', label: 'Utility', slots: 1 },
};

// Order of positions for display
export const POSITION_ORDER = ['Left', 'Center', 'Right', 'Defense', 'Goalie', 'Utility'];

// Roster limits for team building
export const ROSTER_LIMITS = {
  L: 3,
  C: 3,
  R: 3,
  D: 4,
  G: 2,
  U: 1,
};

export const TOTAL_ROSTER_SIZE = 16;

// Text and display constants
export const INSIGHT_TITLES = {
  PLAYERS_REMAINING: 'Players Remaining',
  POOL_POINTS: 'Pool Points',
  MOST_PICKS: 'Most Picks',
  BEST_PICKS: 'Best Picks',
  WORST_PICKS: 'Worst Picks',
  MOST_ADVANTAGEOUS: 'Most Advantageous Picks',
  LEAST_ADVANTAGEOUS: 'Least Advantageous Picks',
  BEST_UNSELECTED: 'Best Players No One Took',
  PERFECT_TEAM: 'Perfect Team',
  MOST_COMMON_TEAM: 'Most Common Team',
};

// Color scheme for insights
export const INSIGHT_COLORS = {
  POOL_STATS: {
    most: 'blue',
    average: 'purple',
    least: 'red',
  },
  MOST_PICKS: 'blue',
  BEST_PICKS: 'green',
  WORST_PICKS: 'red',
  MOST_ADVANTAGEOUS: 'teal',
  LEAST_ADVANTAGEOUS: 'purple',
  BEST_UNSELECTED: 'green',
  PERFECT_TEAM: 'green',
  MOST_COMMON_TEAM: 'blue',
  ELIMINATED: 'red', // Used when player is eliminated
};

// Top N constants (how many to display in each insight)
export const TOP_N = {
  MOST_PICKS: 10,
  BEST_PICKS: 10,
  WORST_PICKS: 10,
  MOST_ADVANTAGEOUS: 10,
  LEAST_ADVANTAGEOUS: 10,
  BEST_UNSELECTED: 10,
};

// Grid layout configuration
export const GRID_LAYOUT = {
  INSIGHTS_ROW: 2, // Width units per insight in top row
  POSITION_CHUNK_SIZE: 3, // Positions per row in Perfect/Most Common Team
};
