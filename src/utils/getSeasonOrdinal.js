import seasons from '../constants/seasons';
import getOrdinal from './getOrdinals';

const getSeasonOrdinal = (season, seasonList = seasons.seasonList) => {
  const seasonNumber = seasonList.slice(0).reverse().indexOf(String(season)) + 1;

  if (seasonNumber <= 0) {
    return '';
  }

  return `${seasonNumber}${getOrdinal(seasonNumber)}`;
};

export default getSeasonOrdinal;
