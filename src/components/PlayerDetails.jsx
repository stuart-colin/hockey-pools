import React, { useState, useEffect } from 'react';
import { Icon, Table, Image, Segment, Grid, Loader, Header } from 'semantic-ui-react';
import { frequency, customSort } from '../utils/stats';
import eliminatedTeams from '../constants/eliminatedTeams';
// import positions from '../constants/positions';
import '../css/customStyle.css';

const Insights = ({ users }) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [sortPlayerOption, setSortPlayerOption] = useState('Points');
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (!users.loading) {
      setLoading(false);
    }
  }, [users]);

  const loadedStyle = () => {
    if (!loading) {
      return { display: 'none' }
    }
  };

  const loadingStyle = () => {
    if (loading) {
      return { opacity: 0 }
    }
  };

  let playersRemaining = [];
  let points = [];
  let playerData = [];
  let players = [];
  let playerList = [];

  users.rosters.forEach((user) => {
    playersRemaining.push(user.playersRemaining)
    points.push(user.points)
    // for (let i = 0; i < positions.length; i++) {
    //   console.log(user.user[positions[i]])
    // }
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
      user.user.goalie[1],
    )
  });

  playerData.forEach((player) => {
    let playerPoints;
    if (player.position === 'G') {
      playerPoints = player.stats.featuredStats.playoffs.subSeason.wins * 2 + player.stats.featuredStats.playoffs.subSeason.shutouts * 2 + player.stats.otl;
    } else {
      playerPoints = player.stats.featuredStats.playoffs.subSeason.goals + player.stats.featuredStats.playoffs.subSeason.assists + player.stats.featuredStats.playoffs.subSeason.otGoals;
    }
    players.push([player.headshot, player.name, player.position, player.stats.teamLogo, player.stats.teamName, playerPoints])
  });

  frequency(players).map((player) => {
    playerList.push([player[0].split(',')[0], player[0].split(',')[1], player[0].split(',')[2], player[0].split(',')[3], player[0].split(',')[4], parseFloat(player[0].split(',')[5]), player[1]])
    return null;
  });

  const headers = [
    'Player',
    'Position',
    'Team',
    'Points',
    'Pick Rate',
  ];

  const sortOptions = {
    Player: () => customSort(playerList, 1).reverse(),
    Position: () => customSort(playerList, 2).reverse(),
    Team: () => customSort(playerList, 4).reverse(),
    Points: () => customSort(playerList, 5),
  };

  // Default to the original list if no valid sort option is selected
  let playerSort = sortOptions[sortPlayerOption]
    ? sortOptions[sortPlayerOption]()
    : playerList;

  // Reverse the sort order if `reverse` is true
  if (reverse) {
    playerSort.reverse();
  }

  const playerHeaders = headers.map((header) => {
    return (
      <Table.HeaderCell
        onClick={() => {
          setSortPlayerOption(header);
          sortPlayerOption === header && setReverse(!reverse);
        }}
        style={{ cursor: 'pointer' }}
      >
        {header}
        {sortPlayerOption === header && !reverse ? (
          <Icon name="sort down" />
        ) : sortPlayerOption === header && reverse ? (
          <Icon name="sort up" />
        ) : (
          <Icon name="sort" />
        )}
      </Table.HeaderCell>
    );
  });

  const playerDetails = playerSort.map((player, index) => {
    return (
      <Table.Row key={player[1]} negative={eliminatedTeams.includes(player[4])}>
        <Table.Cell collapsing>{index + 1}</Table.Cell>
        <Table.Cell>
          <Image src={player[0]} avatar alt={`${player[1]} Headshot`} /> {player[1]}
        </Table.Cell>
        <Table.Cell>{player[2]}</Table.Cell>
        <Table.Cell>
          <Image src={player[3]} avatar size="mini" alt={`${player[4]} Logo`} /> {player[4]}
        </Table.Cell>
        <Table.Cell>{player[5]}</Table.Cell>
        <Table.Cell>
          {player[6] + `/` + users.rosters.length + ` -- ` + ((player[6] / users.rosters.length) * 100).toFixed(0)}%
        </Table.Cell>
      </Table.Row>
    );
  });

  return (
    <Segment.Group>
      <Segment attached="top" >
        <Grid>
          <Grid.Column width={2} onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>
            <Icon circular color="blue" name={visible ? 'chevron up' : 'chevron down'} />
          </Grid.Column>
          <Grid.Column textAlign="center" width={12}>
            <Header color="blue" as="h2">Player Details</Header>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached="bottom" className={visible ? 'expandedInsightsStyle' : 'collapsedStyle'}>
        {loading ? (
          <Loader active inline="centered" size="large">
            Loading Player Details...
          </Loader>
        ) : (
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <Table basic="very" singleLine unstackable selectable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell></Table.HeaderCell>
                      {playerHeaders}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>{playerDetails}</Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default Insights;