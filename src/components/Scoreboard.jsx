import React, { Fragment } from 'react';
import { List, Label, Image, Segment, Popup, Icon, ListDescription } from 'semantic-ui-react';
import useScores from '../hooks/useScores';
import getOrdinals from '../utils/getOrdinals';

const teamLogo = 'https://assets.nhle.com/logos/nhl/svg/';

const Scoreboard = () => {
  const scoreboard = useScores();

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

  const renderGameLabels = (game) => (
    <>
      <Image avatar src={game.awayTeam.logo} alt={`${game.awayTeam.name.default} Logo`} />
      <Label>{game.awayTeam.score}</Label>
      <Label>
        {game.gameState === "OFF" || game.gameState === "FINAL"
          ? "Final"
          : game.gameState === "FUT" || game.gameState === "PRE"
            ? localDate(game.startTimeUTC)
            : `${game.clock.timeRemaining} ${game.period}${getOrdinals(game.period)} ${game.clock.inIntermission ? "INT" : ""
            }`}
      </Label>
      <Label>{game.homeTeam.score}</Label>
      <Image avatar src={game.homeTeam.logo} alt={`${game.homeTeam.name.default} Logo`} />
    </>
  );

  const renderGameStats = (game) => {

    const homeTeamWins =
      game.homeTeam.abbrev === game.seriesStatus.topSeedTeamAbbrev
        ? game.seriesStatus.topSeedWins
        : game.seriesStatus.bottomSeedWins;

    const awayTeamWins =
      game.awayTeam.abbrev === game.seriesStatus.topSeedTeamAbbrev
        ? game.seriesStatus.topSeedWins
        : game.seriesStatus.bottomSeedWins;
    return (
      <List divided relaxed >
        <List.Item
          textAlign="center"
          style={{
            display: "flex", // Use flexbox for horizontal alignment
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically
          }}>
          <Label>
            <Image avatar src={game.awayTeam.logo} alt={`${game.awayTeam.name.default} Logo`} />
            <Label>
              {awayTeamWins}
            </Label>
            <Label>
              {
                awayTeamWins === 4
                  ? game.awayTeam.abbrev + ' Wins'
                  : homeTeamWins === 4
                    ? game.homeTeam.abbrev + ' Wins'
                    : awayTeamWins === homeTeamWins
                      ? 'Series Tied'
                      : awayTeamWins > homeTeamWins
                        ? game.awayTeam.abbrev + ' Leads'
                        : game.homeTeam.abbrev + ' Leads'
              }
            </Label>
            <Label>
              {homeTeamWins}
            </Label>
            <Image avatar src={game.homeTeam.logo} alt={`${game.homeTeam.name.default} Logo`} />
          </Label>
        </List.Item>
        {game.goals.map((goal, index) => (
          <List.Item
            key={index}
            style={{
              display: "flex", // Use flexbox for horizontal alignment
              alignItems: "center", // Vertically center the content
            }}
          >
            <Image
              avatar
              src={teamLogo + goal.teamAbbrev + '_light.svg'} // Assuming the team logo URL is stored here
              alt={`${goal.teamName} Logo`}
              style={{ marginRight: "10px" }}
            />
            <Image
              avatar
              src={goal.mugshot} // Assuming the mugshot URL is stored here
              alt={`${goal.name.default}'s mugshot`}
              style={{ marginRight: "10px" }}
            />
            <List.Content>
              <List.Header>
                <strong>G: {goal.name.default} {' ('}{goal.goalsToDate}{')'}</strong>
              </List.Header>
              <List.Description>
                <strong>A:</strong>
                {" "}
                {goal.assists.length > 0
                  ? goal.assists.map((assist) => assist.name.default + ' (' + assist.assistsToDate + ')').join(", ")
                  : "None"}
              </List.Description>
              <List.Description>
                <strong>{goal.timeInPeriod} {' '} {goal.period}{getOrdinals(goal.period)}</strong>
              </List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
    );
  };

  const games = scoreboard.games.map((game, index) => (
    <List.Item key={index}>
      <Popup
        trigger={<Label>{renderGameLabels(game)}</Label>}
        content={game.goals && game.goals.length > 0 ? renderGameStats(game) : null}
        position="top center"
        hoverable
        wide='very'
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
      }}
    >

      <List horizontal>
        <Label color='blue'>
          <Icon size='large' name='calendar outline' />
          {scoreboard.date ? prettyDate(scoreboard.date) : 'No games scheduled today'}
        </Label>
        {games}
      </List>
    </Segment>
  );
};

export default Scoreboard;