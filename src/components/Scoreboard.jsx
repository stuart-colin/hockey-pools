import React from 'react';
import { List, Label, Image, Segment, Popup, Icon } from 'semantic-ui-react';
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
      <Image avatar src={game.homeTeam.logo} alt={`${game.homeTeam.name.default} Logo`} />
      <Label>{game.homeTeam.score}</Label>
      <Label>
        {game.gameState === "OFF" || game.gameState === "FINAL"
          ? "Final"
          : game.gameState === "FUT" || game.gameState === "PRE"
            ? localDate(game.startTimeUTC)
            : `${game.clock.timeRemaining} ${game.period}${getOrdinals(game.period)} ${game.clock.inIntermission ? "INT" : ""
            }`}
      </Label>
    </>
  );

  const renderGoalDetails = (goals) => {
    return (
      <List divided relaxed>
        {goals.map((goal, index) => (
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
                <strong>G:</strong> {goal.name.default}
              </List.Header>
              <List.Description>
                <strong>A:</strong>{" "}
                {goal.assists.length > 0
                  ? goal.assists.map((assist) => assist.name.default).join(", ")
                  : "None"}
              </List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
    );
  };

  const games = scoreboard.games.map((game, index) => (
    <List.Item key={index}>
      {game.goals && game.goals.length > 0 ? (
        <Popup
          trigger={<Label>{renderGameLabels(game)}</Label>}
          content={renderGoalDetails(game.goals)}
          position="top center"
          hoverable
        />
      ) : (
        <Label>{renderGameLabels(game)}</Label>
      )}
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