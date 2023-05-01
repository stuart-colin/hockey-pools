import React, { useState, useEffect } from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { frequency, customSort, sumArrayIndex, sumNestedArray } from '../utils/stats';
import eliminatedTeams from '../constants/eliminatedTeams';
// import positions from '../constants/positions';
import '../css/customStyle.css';

const Insights = ({ users, season }) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [sortTeamOption, setSortTeamOption] = useState('Points/Pick (Weighted)');
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
      playerPoints = player.stats.wins * 2 + player.stats.shutouts * 2 + player.stats.otl;
    } else {
      playerPoints = player.stats.goals + player.stats.assists + player.stats.overTimeGoals;
    }
    players.push([player.name, player.position, player.team.name, playerPoints])
  });

  frequency(players).map((player) => {
    playerList.push([player[0].split(',')[0], player[0].split(',')[1], player[0].split(',')[2], parseFloat(player[0].split(',')[3]), player[1]])
    return null;
  });

  const playerTeamCount = playerList.map((team) => {
    return team[2];
  });
  const selectionsPerTeam = frequency(playerTeamCount).sort();

  const teamCount = players.map((team) => {
    return team[2];
  });
  const totalSelectionsPerTeam = frequency(teamCount).sort();

  const teamPoints = sumArrayIndex(playerList, 2, 3);
  const teamPoolPoints = sumArrayIndex(players, 2, 3);
  const totalPoolPoints = sumNestedArray(teamPoolPoints, 1);

  selectionsPerTeam.map((team, index) => {
    team.push(totalSelectionsPerTeam[index][1], teamPoints[index][1], teamPoolPoints[index][1], (teamPoints[index][1] / selectionsPerTeam[index][1]), (teamPoolPoints[index][1] / totalSelectionsPerTeam[index][1]))
    return team;
  })
  // season === '2023' ? selectionsPerTeam.push(['Seattle Kraken', 0, 0])
  //   : season === '2022' ? selectionsPerTeam.push(['Dallas Stars', 0, 0], ['Los Angeles Kings', 0, 0], ['Nashville Predators', 0, 0])
  //     : null;

  selectionsPerTeam.sort();

  const headers = [
    'Team',
    'Unique Players Picked',
    'Total Players Picked',
    'Percent of Pool',
    'Raw Team Points',
    'Total Pool Points',
    'Pool Contribution',
    'Points/Pick (Average)',
    'Points/Pick (Weighted)',
  ];

  let teams;
  sortTeamOption === 'Team' ? teams = selectionsPerTeam
    : sortTeamOption === 'Unique Players Picked' ? teams = customSort(selectionsPerTeam, 1)
      : sortTeamOption === 'Total Players Picked' ? teams = customSort(selectionsPerTeam, 2)
        : sortTeamOption === 'Percent of Pool' ? teams = customSort(selectionsPerTeam, 2)
          : sortTeamOption === 'Raw Team Points' ? teams = customSort(selectionsPerTeam, 3)
            : sortTeamOption === 'Total Pool Points' ? teams = customSort(selectionsPerTeam, 4)
              : sortTeamOption === 'Pool Contribution' ? teams = customSort(selectionsPerTeam, 4)
                : sortTeamOption === 'Points/Pick (Average)' ? teams = customSort(selectionsPerTeam, 5)
                  : teams = customSort(selectionsPerTeam, 6);

  reverse && teams.reverse();

  const teamHeaders = headers.map((header) => {
    return (
      <Table.HeaderCell
        onClick={
          () => {
            setSortTeamOption(header);
            sortTeamOption === header && setReverse(!reverse)
          }
        }
        style={{ cursor: 'pointer' }}>
        {header}
        {
          sortTeamOption === header && !reverse ?
            <Icon name='sort down' /> :
            sortTeamOption === header && reverse ?
              <Icon name='sort up' /> :
              <Icon name='sort' />
        }
      </Table.HeaderCell>
    )
  });

  const teamDetails = teams.map((team, index) => {
    return (
      <Table.Row
        key={team[0]}
        negative={eliminatedTeams.includes(team[0]) ? true : false}
      >
        <Table.Cell collapsing>{index + 1}</Table.Cell>
        <Table.Cell>{team[0]}</Table.Cell>
        <Table.Cell>{team[1]}</Table.Cell>
        <Table.Cell>{team[2]}</Table.Cell>
        <Table.Cell>{((team[2] / (users.rosters.length * 16)) * 100).toFixed(2)}%</Table.Cell>
        <Table.Cell>{team[3]}</Table.Cell>
        <Table.Cell>{team[4]}</Table.Cell>
        <Table.Cell>{((team[4] / totalPoolPoints) * 100).toFixed(2)}%</Table.Cell>
        <Table.Cell>{team[5].toFixed(2)}</Table.Cell>
        <Table.Cell>{team[6].toFixed(2)}</Table.Cell>
      </Table.Row>
    );
  });

  return (
    <div className='ui segments'>
      <div className='ui top blue centered attached header' >
        <div className='left aligned column'
          onClick={() => setVisible(!visible)}
          style={{ cursor: 'pointer', position: 'absolute' }}>
          <h3>
            {visible &&
              <Icon
                circular
                color='blue'
                name='chevron up'
              />
            }
            {!visible &&
              <Icon
                circular
                color='blue'
                name='chevron down'
              />
            }
          </h3>
        </div>
        <div className='middle aligned column'>
          <h2>
            Team Details
          </h2>
        </div>
      </div>
      <div
        className={
          `ui bottom attached segment
        ${!visible ? 'collapsedStyle' : 'expandedInsightsStyle'}`
        }>
        <div
          className='ui active inverted dimmer'
          style={loadedStyle()}>
          <div className='ui text loader'>
            Loading Team Details...
          </div>
        </div>
        <div className='ui stackable grid' style={loadingStyle()}>
          <div className='row'>
            <div className='sixteen wide center aligned column'>
              <Table basic='very' unstackable selectable>
                <Table.Header style={{ position: 'sticky', top: '-14px', background: 'white' }}>
                  <Table.Row>
                    <Table.HeaderCell></Table.HeaderCell>
                    {teamHeaders}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {teamDetails}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;