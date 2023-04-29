import React, { useState, useEffect } from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { frequency, customSort } from '../utils/stats';
import eliminatedTeams from '../constants/eliminatedTeams';
// import positions from '../constants/positions';
import '../css/customStyle.css';

const Insights = ({ users, season }) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [sortTeamOption, setSortTeamOption] = useState('total-picks');

  useEffect(() => {
    if (!users.loading) {
      setLoading(false);
    }
  }, [users]);

  const loadedStyle = () => {
    if (!loading) {
      return { display: 'none' }
    }
  }

  const loadingStyle = () => {
    if (loading) {
      return { opacity: 0 }
    }
  }

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
  })

  playerData.forEach((player) => {
    let playerPoints;
    if (player.position === 'G') {
      playerPoints = player.stats.wins * 2 + player.stats.shutouts * 2 + player.stats.otl;
    } else {
      playerPoints = player.stats.goals + player.stats.assists + player.stats.overTimeGoals;
    }
    players.push([player.name, player.position, player.team.name, playerPoints])
  })

  frequency(players).map((player) => {
    playerList.push([player[0].split(',')[0], player[0].split(',')[1], player[0].split(',')[2], parseFloat(player[0].split(',')[3]), player[1]])
    return null;
  })

  const playerTeamCount = playerList.map((team) => {
    return team[2];
  })
  const selectionsPerTeam = frequency(playerTeamCount).sort();

  const teamCount = players.map((team) => {
    return team[2];
  })
  const totalSelectionsPerTeam = frequency(teamCount).sort();

  selectionsPerTeam.map((team, index) => {
    team.push(totalSelectionsPerTeam[index][1])
    return team;
  })
  // season === '2023' ? selectionsPerTeam.push(['Seattle Kraken', 0, 0])
  //   : season === '2022' ? selectionsPerTeam.push(['Dallas Stars', 0, 0], ['Los Angeles Kings', 0, 0], ['Nashville Predators', 0, 0])
  //     : null;

  selectionsPerTeam.sort()

  let teams;
  sortTeamOption === 'alphabetical' ? teams = selectionsPerTeam
    : sortTeamOption === 'unique-picks' ? teams = customSort(selectionsPerTeam, 1)
      : teams = customSort(selectionsPerTeam, 2);

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
      </Table.Row>
    )
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
                    <Table.HeaderCell onClick={() => setSortTeamOption('alphabetical')} style={{ cursor: 'pointer' }}>Team<Icon name='sort' /></Table.HeaderCell>
                    <Table.HeaderCell onClick={() => setSortTeamOption('unique-picks')} style={{ cursor: 'pointer' }}>Unique Players Picked<Icon name='sort' /></Table.HeaderCell>
                    <Table.HeaderCell onClick={() => setSortTeamOption('total-picks')} style={{ cursor: 'pointer' }}>Total Players Picked<Icon name='sort' /></Table.HeaderCell>
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
  )
}

export default Insights;