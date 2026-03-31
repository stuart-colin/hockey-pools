import React from 'react';
import { Image, Label, List } from 'semantic-ui-react';
import getOrdinals from '../../utils/getOrdinals';

const teamLogo = 'https://assets.nhle.com/logos/nhl/svg/';

const isPlayoffGame = (game) => Number(game && game.gameType) === 3;
const isFinished = (game) => game.gameState === 'OFF' || game.gameState === 'FINAL';
const isPreGame = (game) => game.gameState === 'FUT' || game.gameState === 'PRE';

const getTeamWins = (team, seriesStatus) => {
  if (!seriesStatus) return null;
  return team.abbrev === seriesStatus.topSeedTeamAbbrev
    ? seriesStatus.topSeedWins
    : seriesStatus.bottomSeedWins;
};

const getSeriesStatusText = (awayWins, homeWins, awayAbbrev, homeAbbrev) => {
  if (awayWins === 4) return `${awayAbbrev} WINS`;
  if (homeWins === 4) return `${homeAbbrev} WINS`;
  if (awayWins === homeWins) return 'SERIES TIED';
  return awayWins > homeWins ? `${awayAbbrev} LEADS` : `${homeAbbrev} LEADS`;
};

const renderGoalItem = (goal, index) => (
  <List.Item
    key={index}
    style={{
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <Image
      alt={`${goal.teamName} Logo`}
      avatar
      src={teamLogo + goal.teamAbbrev + '_light.svg'}
      style={{
        marginRight: '10px',
      }}
    />
    <Image
      alt={`${goal.name.default}'s mugshot`}
      avatar
      src={goal.mugshot}
      style={{
        marginRight: '10px',
      }}
    />
    <List.Content>
      <List.Header>
        <strong>
          G: {goal.firstName.default}
          {' '}
          {goal.lastName.default}
          {' ('}{goal.goalsToDate}{')'}
        </strong>
      </List.Header>
      <List.Description>
        A:
        {' '}
        {goal.assists.length > 0
          ? goal.assists.map((assist) =>
            assist.name.default + ' (' + assist.assistsToDate + ')').join(', ')
          : 'None'}
      </List.Description>
      <List.Description>
        <strong>
          {'('}
          {goal.timeInPeriod}
          {' — '}
          {goal.period > 3
            ? (goal.period - 3) + goal.periodDescriptor.periodType
            : goal.period + getOrdinals(goal.period)}
          {')'}
        </strong>
      </List.Description>
    </List.Content>
  </List.Item>
);

const GameDetails = ({ game }) => {
  const playoff = isPlayoffGame(game) && game.seriesStatus;
  const preGame = !isPlayoffGame(game) && isPreGame(game);
  const liveOrFinal = !isPlayoffGame(game) && (game.gameState === 'LIVE' || isFinished(game));

  const homeWins = getTeamWins(game.homeTeam, game.seriesStatus);
  const awayWins = getTeamWins(game.awayTeam, game.seriesStatus);
  const homeRecord = preGame ? game.homeTeam?.record || '0-0-0' : null;
  const awayRecord = preGame ? game.awayTeam?.record || '0-0-0' : null;
  const homeShots = liveOrFinal ? game.homeTeam?.sog || 0 : null;
  const awayShots = liveOrFinal ? game.awayTeam?.sog || 0 : null;

  const displayValue = playoff ? [awayWins, homeWins] : preGame ? [awayRecord, homeRecord] : [awayShots, homeShots];
  const displayLabel = playoff ? 'Series Status' : preGame ? 'Record' : 'Shots';
  const statusText = playoff ? getSeriesStatusText(awayWins, homeWins, game.awayTeam.abbrev, game.homeTeam.abbrev) : null;

  return (
    <List
      divided
      relaxed
      style={{
        maxHeight: '70dvh',
        overflow: 'auto',
      }}
    >
      <List.Item>
        <Label
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            alt={`${game.awayTeam.name.default} Logo`}
            avatar
            src={game.awayTeam.logo}
          />
          <Label>{displayValue[0]}</Label>
          <Label
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <List.Header
              style={playoff ? { paddingBottom: 5 } : null}
            >
              {displayLabel}
            </List.Header>
            {statusText}
          </Label>
          <Label>{displayValue[1]}</Label>
          <Image
            alt={`${game.homeTeam.name.default} Logo`}
            avatar
            src={game.homeTeam.logo}
          />
        </Label>
      </List.Item>
      {game.goals && game.goals.length > 0 && game.goals.map(renderGoalItem)}
    </List>
  );
};

export default GameDetails;
