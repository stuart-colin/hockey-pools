const currentYear = new Date().getFullYear().toString();

// Puck drop — the moment rosters lock and standings/insights/etc. unlock.
// Stored in UTC. Sat Apr 18, 2026 at 3:00 PM EDT = 19:00 UTC.
const playoffStartUTC = '2026-04-18T19:00:00Z';
// const playoffStartUTC = '2020-01-01T00:00:00Z';

export const APP_CONFIG = {
  currentYear,
  alertMessage: "We are excited to have you join us this year! Roster submissions are now open and will close at the start of the first playoff game.",
  rosterDataEndpoint: `${process.env.REACT_APP_BASE_URL}/v1/rosters/`,
  playoffStartUTC,
};
