const currentYear = new Date().getFullYear().toString();

export const APP_CONFIG = {
  currentYear,
  alertMessage: "We are excited to have you join us this year! Roster submissions will open once all playoff spots have been clinched and will close at the start of the first playoff game.",
  rosterDataEndpoint: `${process.env.REACT_APP_BASE_URL}/v1/rosters/`,
};
