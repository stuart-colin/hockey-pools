// URLs
export const TEAM_LOGO_URL = 'https://assets.nhle.com/logos/nhl/svg/';
export const PLAYER_HEADSHOT_URL = 'https://assets.nhle.com/mugs/nhl/20252026/';

// Position requirements
export const POSITION_COUNTS = {
  R: 3,
  L: 3,
  C: 3,
  D: 4,
  G: 2,
};

// Roster order
export const ROSTER_POSITIONS = [
  'C', 'C', 'C',
  'L', 'L', 'L',
  'R', 'R', 'R',
  'D', 'D', 'D', 'D',
  'G', 'G',
  'U', // Utility
];

// Filter dropdown options
export const POSITION_OPTIONS = [
  { key: 'C', text: 'C', value: 'C' },
  { key: 'L', text: 'L', value: 'L' },
  { key: 'R', text: 'R', value: 'R' },
  { key: 'D', text: 'D', value: 'D' },
  { key: 'G', text: 'G', value: 'G' },
];

// Roster constants
export const TOTAL_ROSTER_SIZE = 16;

// Table header names
export const TABLE_HEADERS = {
  ACTION: '',
  POSITION: 'Pos',
  NAME: 'Name',
  TEAM: 'Team',
  STATS: 'Season Stats',
};
