import React, { useState, useEffect } from 'react';
import {
  Grid,
  Header,
  Icon,
  Image,
  Loader,
  Segment,
  Table,
} from 'semantic-ui-react';
import { frequency, customSort, sumArrayIndex, sumNestedArray } from '../utils/stats';
import eliminatedTeams from '../constants/eliminatedTeams';

const TeamDetails = ({ users, season }) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [sortTeamOption, setSortTeamOption] = useState('Points/Pick (Weighted)');
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (!users.loading) {
      setLoading(false);
    }
  }, [users]);

  let playersRemaining = [];
  let points = [];
  let playerData = [];
  let players = [];
  let playerList = [];

  users.rosters.forEach((user) => {
    playersRemaining.push(user.playersRemaining);
    points.push(user.points);
    playerData.push(
      user.user.utility,
      user.user.left[0],
      user.user.left[1],
      user.user.left[2],
      user.user.center[0],
      user.user.center[1],
      user.user.center[2],
      user.user.right[0],
      user.user.right[1],
      user.user.right[2],
      user.user.defense[0],
      user.user.defense[1],
      user.user.defense[2],
      user.user.defense[3],
      user.user.goalie[0],
      user.user.goalie[1]
    );
  });

  playerData.forEach((player) => {
    let playerPoints;
    if (player.position === 'G') {
      playerPoints =
        player.stats.featuredStats.playoffs.subSeason.wins * 2 +
        player.stats.featuredStats.playoffs.subSeason.shutouts * 2 +
        player.stats.otl;
    } else {
      playerPoints =
        player.stats.featuredStats.playoffs.subSeason.goals +
        player.stats.featuredStats.playoffs.subSeason.assists +
        player.stats.featuredStats.playoffs.subSeason.otGoals;
    }
    players.push([player.name, player.position, player.stats.teamLogo, player.stats.teamName, playerPoints]);
  });

  frequency(players).map((player) => {
    playerList.push([
      player[0].split(',')[0],
      player[0].split(',')[1],
      player[0].split(',')[2],
      player[0].split(',')[3],
      parseFloat(player[0].split(',')[4]),
      player[1]
    ]);
    return null;
  });

  const playerTeamCount = playerList.map((team) => team[3]);
  const selectionsPerTeam = frequency(playerTeamCount).sort();
  const teamCount = players.map((team) => team[3]);
  const totalSelectionsPerTeam = frequency(teamCount).sort();
  const teamLogos = playerList.map((team) => [team[3], team[2]]);
  const sortedLogos = frequency(teamLogos).sort();
  const teamPoints = sumArrayIndex(playerList, 3, 4);
  const teamPoolPoints = sumArrayIndex(players, 3, 4);
  const totalPoolPoints = sumNestedArray(teamPoolPoints, 1);

  selectionsPerTeam.map((team, index) => {
    team.push(
      sortedLogos[index][0].split(',')[1],
      totalSelectionsPerTeam[index][1],
      teamPoints[index][1],
      teamPoolPoints[index][1],
      teamPoints[index][1] / selectionsPerTeam[index][1],
      teamPoolPoints[index][1] / totalSelectionsPerTeam[index][1]
    );
    return team;
  });

  selectionsPerTeam.sort();

  const headers = [
    'Team',
    'Unique Players',
    'Total Players',
    'Per Player Points',
    'Pool Contribution',
    'Points/Pick (Average)',
    'Points/Pick (Weighted)'
  ];

  let teams;
  switch (sortTeamOption) {
    case 'Team':
      teams = selectionsPerTeam;
      break;
    case 'Unique Players':
      teams = customSort(selectionsPerTeam, 1);
      break;
    case 'Total Players':
      teams = customSort(selectionsPerTeam, 3);
      break;
    case 'Per Player Points':
      teams = customSort(selectionsPerTeam, 4);
      break;
    case 'Pool Contribution':
      teams = customSort(selectionsPerTeam, 5);
      break;
    case 'Points/Pick (Average)':
      teams = customSort(selectionsPerTeam, 6);
      break;
    default:
      teams = customSort(selectionsPerTeam, 7);
  }

  if (reverse) {
    teams.reverse();
  }

  const teamHeaders = headers.map((header, index) => {
    const isSticky = index === 0;
    return (
      <Table.HeaderCell
        key={header}
        onClick={() => {
          setSortTeamOption(header);
          if (sortTeamOption === header) setReverse(!reverse);
        }}
        style={{
          cursor: 'pointer',
          ...(isSticky && {
            position: 'sticky',
            left: -15,
            background: 'white', // Ensure the sticky header has a background
            zIndex: 3, // Ensure it stays above the body rows
          }),
        }}
      >
        {header}
        {sortTeamOption === header && !reverse ? (
          <Icon name="sort down" />
        ) : sortTeamOption === header && reverse ? (
          <Icon name="sort up" />
        ) : (
          null
        )}
      </Table.HeaderCell>
    );
  });

  const teamDetails = teams.map((team, index) => (
    <Table.Row key={team[0]} negative={eliminatedTeams.includes(team[0])}>
      <Table.Cell collapsing>{index + 1}</Table.Cell>
      <Table.Cell
        style={{
          position: 'sticky',
          left: -15,
          background: 'white', // Ensure the sticky column has a background
          zIndex: 1, // Ensure it stays above other columns when scrolling
        }}>
        <Image src={team[2]} avatar alt={`${team[0]} logo`} />
        {team[0]}
      </Table.Cell>
      <Table.Cell>{team[1]}</Table.Cell>
      <Table.Cell>
        {team[3]} -- {((team[3] / (users.rosters.length * 16)) * 100).toFixed(2)}%
      </Table.Cell>
      <Table.Cell>{team[4]}</Table.Cell>
      <Table.Cell>
        {team[5]} -- {((team[5] / totalPoolPoints) * 100).toFixed(2)}%
      </Table.Cell>
      <Table.Cell>{team[6].toFixed(2)}</Table.Cell>
      <Table.Cell>{team[7].toFixed(2)}</Table.Cell>
    </Table.Row>
  ));

  return (
    <Segment.Group>
      <Segment attached="top">
        <Grid>
          <Grid.Column width={2} onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>
            <Icon circular color="blue" name={visible ? 'chevron up' : 'chevron down'} />
          </Grid.Column>
          <Grid.Column textAlign="center" width={12}>
            <Header color="blue" as="h3">Team Details</Header>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached="bottom" className={visible ? 'expandedStyle' : 'collapsedStyle'}>
        {loading ? (
          <Loader active inline="centered" size="large">
            Loading Team Details...
          </Loader>
        ) : (
          <Table basic="very" singleLine unstackable selectable>
            <Table.Header
              style={{
                position: 'sticky',
                top: -15,
                background: 'white', // Ensure the sticky column has a background
                zIndex: 2, // Ensure it stays above other columns when scrolling
              }}>
              <Table.Row>
                <Table.HeaderCell></Table.HeaderCell>
                {teamHeaders}
              </Table.Row>
            </Table.Header>
            <Table.Body>{teamDetails}</Table.Body>
          </Table>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default TeamDetails;