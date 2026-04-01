// import season2021 from '../seasons/2021.json';
import season2022 from '../seasons/2022.json'
import season2023 from '../seasons/2023.json'

const seasons = {
  // season2021,
  season2022,
  season2023,
};

const seasonList = [
  '2026',
  '2025',
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018',
  '2017',
  '2016',
  '2015',
  '2014',
  '2013',
  '2012',
  '2011',
  '2010',
  '2009',
  '2008',
  '2007',
  '2006',
];

// Utility to generate NHL seasonId string (e.g. '20252026') from a year string (e.g. '2026')
export function getSeasonId(year) {
  const y = parseInt(year, 10);
  return `${y - 1}${y}`;
}

export default { seasons, seasonList };