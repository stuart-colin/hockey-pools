import React from 'react';
import { Image, Label, List, Popup } from 'semantic-ui-react';
import GameDetails from './Scoreboard.GameDetails';
import getOrdinals from '../../utils/getOrdinals';

function localDate(date) {
  const newDate = new Date(date);
  return newDate.toLocaleTimeString(undefined, { timeStyle: 'short' });
}

const isFinished = (game) => game.gameState === 'OFF' || game.gameState === 'FINAL';
const isPreGame = (game) => game.gameState === 'FUT' || game.gameState === 'PRE';

const getGameStatusLabel = (game) => {
  if (isFinished(game)) {
    const ot = game.gameOutcome?.lastPeriodType === 'OT'
      ? ` ${game.gameOutcome.otPeriods}/${game.gameOutcome.lastPeriodType}`
      : '';
    return `FINAL${ot}`;
  }
  if (isPreGame(game)) return localDate(game.startTimeUTC);
  const intermission = game.clock?.inIntermission ? ' INT' : '';
  return `${game.clock?.timeRemaining} ${game.period}${getOrdinals(game.period)}${intermission}`;
};

const GameCard = ({ game, isMobile }) => (
  <List.Item>
    <Popup
      content={<GameDetails game={game} />}
      flowing
      hideOnScroll
      position={isMobile ? 'bottom right' : 'bottom center'}
      trigger={
        <Label>
          <Image
            alt={`${game.awayTeam.name.default} Logo`}
            avatar
            src={game.awayTeam.logo}
          />
          <Label>{game.awayTeam.score}</Label>
          <Label>{getGameStatusLabel(game)}</Label>
          <Label>{game.homeTeam.score}</Label>
          <Image
            alt={`${game.homeTeam.name.default} Logo`}
            avatar
            src={game.homeTeam.logo}
          />
        </Label>
      }
    />
  </List.Item>
);

export default GameCard;
