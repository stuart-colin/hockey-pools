import React, { useMemo, useState, useEffect } from 'react';
import {
  Button,
  Dropdown,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Loader,
  Segment,
  Table,
} from 'semantic-ui-react';
import { frequency, customSort } from '../utils/stats';
import eliminatedTeams from '../constants/eliminatedTeams';
// import positions from '../constants/positions';
import '../css/customStyle.css';

const teamLogoURL = `https://assets.nhle.com/logos/nhl/svg/`;

const Insights = ({ users }) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [sortPlayerOption, setSortPlayerOption] = useState('Points');
  const [reverse, setReverse] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [nameSearch, setNameSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState([]);
  const [positionFilter, setPositionFilter] = useState([]);

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
    //   console.log(user.roster[positions[i]])
    // }
    playerData.push(
      ...user.roster.left,
      ...user.roster.center,
      ...user.roster.right,
      ...user.roster.defense,
      ...user.roster.goalie,
      user.roster.utility,
    )
  });

  playerData.forEach((player) => {
    let playerPoints;
    let playerStat1;
    let playerStat2;
    let playerStat3;
    if (player.position === 'G') {
      playerPoints = player.stats.featuredStats.playoffs.subSeason.wins * 2 + player.stats.featuredStats.playoffs.subSeason.shutouts * 2 + player.stats.otl;
      playerStat1 = player.stats.featuredStats.playoffs.subSeason.wins;
      playerStat2 = player.stats.featuredStats.playoffs.subSeason.shutouts;
      playerStat3 = player.stats.otl;
    } else {
      playerPoints = player.stats.featuredStats.playoffs.subSeason.goals + player.stats.featuredStats.playoffs.subSeason.assists + player.stats.featuredStats.playoffs.subSeason.otGoals;
      playerStat1 = player.stats.featuredStats.playoffs.subSeason.goals;
      playerStat2 = player.stats.featuredStats.playoffs.subSeason.assists;
      playerStat3 = player.stats.featuredStats.playoffs.subSeason.otGoals;
    }
    players.push([player.headshot, player.name, player.position, player.stats.teamLogo, player.stats.teamName, playerPoints, playerStat1, playerStat2, playerStat3])
  });

  frequency(players).map((player) => {
    playerList.push([player[0].split(',')[0], player[0].split(',')[1], player[0].split(',')[2], player[0].split(',')[3], player[0].split(',')[4], parseFloat(player[0].split(',')[5]), parseFloat(player[0].split(',')[6]), parseFloat(player[0].split(',')[7]), parseFloat(player[0].split(',')[8]), player[1]])
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

  // Filtered and sorted data
  const filteredPlayers = useMemo(() => {
    return playerSort
      .filter((player) => {
        const matchesPosition = positionFilter.length
          ? positionFilter.includes(player[2])
          : true;
        const matchesTeam = teamFilter.length
          ? teamFilter.includes(player[4])
          : true;
        const matchesName = nameSearch
          ? player[1]
            .toLowerCase()
            .includes(nameSearch.toLowerCase())
          : true;
        return matchesPosition && matchesTeam && matchesName;
      })
      .sort((a, b) => b.wins - a.wins); // Sort by wins in descending order
  }, [playerSort, positionFilter, teamFilter, nameSearch]);

  // Dropdown options for filters
  const positionOptions = [
    { key: 'C', text: 'C', value: 'C' },
    { key: 'L', text: 'L', value: 'L' },
    { key: 'R', text: 'R', value: 'R' },
    { key: 'D', text: 'D', value: 'D' },
    { key: 'G', text: 'G', value: 'G' },
  ];

  const teamOptions = useMemo(() => {
    const teams = new Map(); // Use a Map to ensure uniqueness based on team name
    playerSort.forEach((player) => {
      const teamLogo = player[3];
      const teamName = player[4];
      if (!teams.has(teamName)) {
        teams.set(teamName, {
          key: teamName,
          text: teamName,
          value: teamName,
          image: { avatar: true, src: teamLogo }
        });
      }
    });
    return Array.from(teams.values()); // Convert the Map values to an array
  }, [playerSort]);

  const playerHeaders = headers.map((header, index) => {
    const isSticky = index === 0;
    return (
      <Table.HeaderCell
        key={header}
        onClick={() => {
          setSortPlayerOption(header);
          sortPlayerOption === header && setReverse(!reverse);
        }}
        style={{
          cursor: 'pointer',
          // ...(isSticky && {
          //   position: 'sticky',
          //   left: -15,
          //   background: 'white',
          //   zIndex: 3, // Ensure it stays above the body rows
          // }),
        }}
      >
        {header}
        {sortPlayerOption === header && !reverse ? (
          <Icon name='sort down' />
        ) : sortPlayerOption === header && reverse ? (
          <Icon name='sort up' />
        ) : (
          null
        )}
      </Table.HeaderCell>
    );
  });

  const playerDetails = filteredPlayers.map((player, index) => {

    return (
      <Table.Row key={player[1]} negative={eliminatedTeams.includes(player[4])}>
        <Table.Cell collapsing>{index + 1}</Table.Cell>
        <Table.Cell
          style={{
            // position: 'sticky',
            // left: -15,
            // background: 'white', // Ensure the sticky column has a background
            // zIndex: 1, // Ensure it stays above other columns when scrolling
          }}
        >
          <Image src={player[0]} avatar alt={`${player[1]} Headshot`} /> {player[1]}
        </Table.Cell>
        <Table.Cell>{player[2]}</Table.Cell>
        <Table.Cell>
          <Image src={player[3]} avatar size='mini' alt={`${player[4]} Logo`} /> {player[4]}
        </Table.Cell>
        <Table.Cell>
          <strong>{player[5]}</strong>
          {player[2] === 'G'
            ? ' — ' + player[6] + ' W | ' + player[7] + ' SO | ' + player[8] + ' OTL'
            : ' — ' + player[6] + ' G | ' + player[7] + ' A | ' + player[8] + ' OTG'
          }
        </Table.Cell>
        <Table.Cell>
          {player[9] + `/` + users.rosters.length + ` -- ` + ((player[9] / users.rosters.length) * 100).toFixed(0)}%
        </Table.Cell>
      </Table.Row>
    );
  });

  return (
    <Segment.Group>
      <Segment attached='top'>
        <Grid columns='equal'>
          <Grid.Row >
            <Grid.Column textAlign='left' onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>
              <Icon circular color='blue' name={visible ? 'chevron up' : 'chevron down'} />
            </Grid.Column>
            <Grid.Column>
              <Header color='blue' textAlign='center' as='h3' style={{ whiteSpace: 'nowrap' }}>Player Details</Header>
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <Button
                basic={!filtersVisible}
                color='blue'
                icon
                onClick={() => setFiltersVisible(!filtersVisible)}
                size='mini'
              >
                <Icon name='filter' />
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {filtersVisible && (
          <Grid stackable columns='equal'>
            <Grid.Row
              columns={3}
              style={{
                position: 'sticky',
                top: 0,
                left: 0,
                zIndex: 10,
                background: 'white',
              }}>
              <Grid.Column>
                <Input
                  placeholder='Name'
                  fluid
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                />
              </Grid.Column>
              <Grid.Column>
                <Dropdown
                  placeholder='Team'
                  fluid
                  multiple
                  search
                  selection
                  clearable
                  options={teamOptions}
                  onChange={(e, { value }) => setTeamFilter(value)}
                  value={teamFilter}
                  renderLabel={(item) => ({
                    content: (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Image
                          src={item.image.src}
                          avatar
                          style={{
                            width: '16px',
                            height: '16px',
                            marginRight: '5px',
                          }} // Smaller size for the chip
                        />
                        <span>{item.text}</span>
                      </div>
                    ),
                    style: {
                      display: 'inline-flex', // Ensure chips are inline
                      alignItems: 'center',
                      margin: '2px', // Add spacing between chips
                      padding: '4px 8px', // Compact padding for the chip
                      borderRadius: '4px', // Rounded corners for the chip
                      background: '#f1f1f1', // Optional: Light background for better visibility
                    },
                  })}
                />
              </Grid.Column>
              <Grid.Column>
                <Dropdown
                  placeholder='Position'
                  fluid
                  multiple
                  search
                  selection
                  clearable
                  options={positionOptions}
                  onChange={(e, { value }) => setPositionFilter(value)}
                  value={positionFilter}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Segment>
      <Segment attached='bottom' className={visible ? 'expandedStyle' : 'collapsedStyle'}>
        {loading ? (
          <Loader active inline='centered' size='large'>
            Loading Player Details...
          </Loader>
        ) : (
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Grid stackable>

                  <Grid.Row>
                    <Grid.Column width={16}>
                      <Table basic='very' singleLine unstackable selectable>
                        <Table.Header
                          style={{
                            position: 'sticky',
                            top: -15,
                            background: 'white', // Ensure the sticky column has a background
                            zIndex: 2, // Ensure it stays above other columns when scrolling
                          }}>
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
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}

      </Segment>
    </Segment.Group>
  );
};

export default Insights;