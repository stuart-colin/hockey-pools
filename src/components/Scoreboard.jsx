import React, { useMemo } from 'react';
import { useMediaQuery } from "react-responsive";
import {
  List,
  Label,
  Image,
  Segment,
  Popup,
  Icon
} from 'semantic-ui-react';
import useScores from '../hooks/useScores';
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
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isPlayoffGame = (game) => Number(game && game.gameType) === 3;

  const renderGameLabels = (game) => (
    <>
      <Image avatar src={game.awayTeam.logo} alt={`${game.awayTeam.name.default} Logo`} />
      <Label>{game.awayTeam.score}</Label>
      <Label>
        {game.gameState === 'OFF' || game.gameState === 'FINAL'
          ? 'FINAL' + (game.gameOutcome.lastPeriodType === 'OT'
            ? ' ' + game.gameOutcome.otPeriods + '/' + game.gameOutcome.lastPeriodType : '')
          : game.gameState === 'FUT' || game.gameState === 'PRE'
            ? localDate(game.startTimeUTC)
            : `${game.clock.timeRemaining} ${game.period}${getOrdinals(game.period)} ${game.clock.inIntermission ? 'INT' : ''
            }`}
      </Label>
      <Label>{game.homeTeam.score}</Label>
      <Image avatar src={game.homeTeam.logo} alt={`${game.homeTeam.name.default} Logo`} />
    </>
  );

  const renderSeriesStatus = (game) => {
    const showSeriesStatus = isPlayoffGame(game) && game.seriesStatus;
    const showRegularSeasonRecord = !isPlayoffGame(game) && game.gameState !== 'LIVE';
    const homeTeamWins = showSeriesStatus
      ? game.homeTeam.abbrev === game.seriesStatus.topSeedTeamAbbrev
        ? game.seriesStatus.topSeedWins
        : game.seriesStatus.bottomSeedWins
      : null;
    const awayTeamWins = showSeriesStatus
      ? game.awayTeam.abbrev === game.seriesStatus.topSeedTeamAbbrev
        ? game.seriesStatus.topSeedWins
        : game.seriesStatus.bottomSeedWins
      : null;
    const awayTeamRecord = showRegularSeasonRecord ? (game.awayTeam && game.awayTeam.record || '0-0-0') : null;
    const homeTeamRecord = showRegularSeasonRecord ? (game.homeTeam && game.homeTeam.record || '0-0-0') : null;

    return (
      <List
        divided
        relaxed
        style={{
          maxHeight: '70dvh',
          overflow: 'auto',
          scrollbarWidth: 'thin',
        }}>
        {(showSeriesStatus || showRegularSeasonRecord) && (
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
              <Label>{showSeriesStatus ? awayTeamWins : awayTeamRecord}</Label>
              <Label
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}>
                <List.Header style={{ paddingBottom: 5 }}>
                  {showSeriesStatus ? 'Series Status' : 'Season'}
                </List.Header>
                {showSeriesStatus
                  ? awayTeamWins === 4
                    ? game.awayTeam.abbrev + ' WINS'
                    : homeTeamWins === 4
                      ? game.homeTeam.abbrev + ' WINS'
                      : awayTeamWins === homeTeamWins
                        ? 'SERIES TIED'
                        : awayTeamWins > homeTeamWins
                          ? game.awayTeam.abbrev + ' LEADS'
                          : game.homeTeam.abbrev + ' LEADS'
                  : 'Record'}
              </Label>
              <Label>{showSeriesStatus ? homeTeamWins : homeTeamRecord}</Label>
              <Image
                avatar
                src={game.homeTeam.logo}
                alt={`${game.homeTeam.name.default} Logo`}
              />
            </Label>
          </List.Item>
        )}
        {
          game.goals && game.goals.length > 0 ? renderGameStats(game) : null
        }
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

    const gamesToSort = [...scoreboard.games];

    gamesToSort.sort((a, b) => {
      const aIsFinished = a.gameState === 'OFF';
      const bIsFinished = b.gameState === 'OFF';

      if (aIsFinished && !bIsFinished) {
        return 1;
      }
      if (!aIsFinished && bIsFinished) {
        return -1;
      }

      const startTimeA = new Date(a.startTimeUTC).getTime();
      const startTimeB = new Date(b.startTimeUTC).getTime();

      return startTimeA - startTimeB;
    });

    return gamesToSort;
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
        scrollbarWidth: 'thin',
        padding: 5,
        top: 0,
        backgroundColor: 'white',
        width: '100vw',
        zIndex: '1000',
      }}>
      <List horizontal>
        <Label color='blue'>
          <Icon size='large' name='calendar outline' />
          {scoreboard.date
            ? prettyDate(scoreboard.date)
            : 'No games scheduled today'}
        </Label>
        {gameListItems.length > 0 ? gameListItems : <Label>No games scheduled today</Label>}
      </List>
    </Segment>
  );
};

export default Scoreboard;