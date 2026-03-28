import React, { useMemo } from 'react';
import {
  List,
  Label,
  Image,
  Segment,
  Popup,
  Icon
} from 'semantic-ui-react';
import useScores from '../hooks/useScores';
import useIsMobile from '../hooks/useIsMobile';
import getOrdinals from '../utils/getOrdinals';

const teamLogo = 'https://assets.nhle.com/logos/nhl/svg/';

function localDate(date) {
  const newDate = new Date(date);
  return newDate.toLocaleTimeString(undefined, { timeStyle: 'short' });
}

function prettyDate(date) {
  const newDate = new Date(date);
  return newDate.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const Scoreboard = () => {
  const scoreboard = useScores();
  const isMobile = useIsMobile();
  const isPlayoffGame = (game) => Number(game && game.gameType) === 3;
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

  const renderGameLabels = (game) => (
    <>
      <Image avatar src={game.awayTeam.logo} alt={`${game.awayTeam.name.default} Logo`} />
      <Label>{game.awayTeam.score}</Label>
      <Label>{getGameStatusLabel(game)}</Label>
      <Label>{game.homeTeam.score}</Label>
      <Image avatar src={game.homeTeam.logo} alt={`${game.homeTeam.name.default} Logo`} />
    </>
  );

  const getSeriesStatusText = (awayWins, homeWins, awayAbbrev, homeAbbrev) => {
    if (awayWins === 4) return `${awayAbbrev} WINS`;
    if (homeWins === 4) return `${homeAbbrev} WINS`;
    if (awayWins === homeWins) return 'SERIES TIED';
    return awayWins > homeWins ? `${awayAbbrev} LEADS` : `${homeAbbrev} LEADS`;
  };

  const getTeamWins = (team, seriesStatus) => {
    if (!seriesStatus) return null;
    return team.abbrev === seriesStatus.topSeedTeamAbbrev
      ? seriesStatus.topSeedWins
      : seriesStatus.bottomSeedWins;
  };

  const renderSeriesStatus = (game) => {
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
          <Label style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image
              avatar
              src={game.awayTeam.logo}
              alt={`${game.awayTeam.name.default} Logo`}
            />
            <Label>{displayValue[0]}</Label>
            <Label
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}>
              <List.Header style={playoff ? { paddingBottom: 5 } : null}>
                {displayLabel}
              </List.Header>
              {statusText}
            </Label>
            <Label>{displayValue[1]}</Label>
            <Image
              avatar
              src={game.homeTeam.logo}
              alt={`${game.homeTeam.name.default} Logo`}
            />
          </Label>
        </List.Item>
        {game.goals && game.goals.length > 0 && renderGameStats(game)}
      </List>
    );
  };

  const renderGameStats = (game) => {
    return (
      game.goals.map((goal, index) => (
        <List.Item
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <Image
            avatar
            src={teamLogo + goal.teamAbbrev + '_light.svg'}
            alt={`${goal.teamName} Logo`}
            style={{ marginRight: '10px' }}
          />
          <Image
            avatar
            src={goal.mugshot}
            alt={`${goal.name.default}'s mugshot`}
            style={{ marginRight: '10px' }}
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
      )));
  };

  const sortedGames = useMemo(() => {
    if (!scoreboard.games || !Array.isArray(scoreboard.games)) {
      return [];
    }

    return [...scoreboard.games].sort((a, b) => {
      const aFinished = isFinished(a);
      const bFinished = isFinished(b);

      if (aFinished && !bFinished) return 1;
      if (!aFinished && bFinished) return -1;

      return new Date(a.startTimeUTC).getTime() - new Date(b.startTimeUTC).getTime();
    });
  }, [scoreboard.games]);

  const gameListItems = sortedGames.map((game, index) => (
    <List.Item key={game.gamePk || index}>
      <Popup
        trigger={<Label>{renderGameLabels(game)}</Label>}
        content={renderSeriesStatus(game)}
        position={isMobile ? 'bottom right' : 'bottom center'}
        flowing
        hoverable
      />
    </List.Item>
  ));

  return (
    <Segment
      textAlign='center'
      style={{
        position: 'fixed',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        padding: 5,
        top: 0,
        backgroundColor: 'white',
        width: '100vw',
        zIndex: '1000',
      }}>
      <List horizontal>
        <Label color='blue'>
          <Icon size='large' name='calendar outline' />
          {scoreboard.date ? prettyDate(scoreboard.date) : 'No games scheduled today'}
        </Label>
        {gameListItems.length > 0 ? gameListItems : <Label>No games scheduled today</Label>}
      </List>
    </Segment>
  );
};

export default Scoreboard;