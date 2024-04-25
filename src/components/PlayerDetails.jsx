import React, { useState, useEffect } from 'react';
import { Icon, Table } from 'semantic-ui-react';
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
      playerPoints = player.stats.featuredStats.playoffs.subSeason.wins * 2 + player.stats.featuredStats.playoffs.subSeason.shutouts * 2 + player.stats.featuredStats.playoffs.subSeason.otLosses;
    } else {
      playerPoints = player.stats.featuredStats.playoffs.subSeason.goals + player.stats.featuredStats.playoffs.subSeason.assists + player.stats.featuredStats.playoffs.subSeason.otGoals;
    }
    players.push([player.name, player.position, player.stats.teamName, playerPoints])
  });

  frequency(players).map((player) => {
    playerList.push([player[0].split(',')[0], player[0].split(',')[1], player[0].split(',')[2], parseFloat(player[0].split(',')[3]), player[1]])
    return null;
  });

  const headers = [
    'Player',
    'Position',
    'Team',
    'Points',
    'Times Picked',
    'Pick Rate',
  ];

  let playerSort;
  sortPlayerOption === 'Player' ? playerSort = customSort(playerList, 0).reverse()
    : sortPlayerOption === 'Position' ? playerSort = customSort(playerList, 1).reverse()
      : sortPlayerOption === 'Team' ? playerSort = customSort(playerList, 2).reverse()
        : sortPlayerOption === 'Points' ? playerSort = customSort(playerList, 3)
          : sortPlayerOption === 'Times Picked' ? playerSort = playerList
            : playerSort = playerList;

  reverse && playerSort.reverse();

  const playerHeaders = headers.map((header) => {
    return (
      <Table.HeaderCell
        onClick={
          () => {
            setSortPlayerOption(header);
            sortPlayerOption === header && setReverse(!reverse)
          }
        }
        style={{ cursor: 'pointer' }}>
        {header}
        {
          sortPlayerOption === header && !reverse ?
            <Icon name='sort down' /> :
            sortPlayerOption === header && reverse ?
              <Icon name='sort up' /> :
              <Icon name='sort' />
        }
      </Table.HeaderCell>
    );
  });

  const playerDetails = playerSort.map((player, index) => {
    return (
      <Table.Row
        key={player[0]}
        negative={eliminatedTeams.includes(player[2]) ? true : false}
      >
        <Table.Cell collapsing>{index + 1}</Table.Cell>
        <Table.Cell>{player[0]}</Table.Cell>
        <Table.Cell>{player[1]}</Table.Cell>
        <Table.Cell>{player[2]}</Table.Cell>
        <Table.Cell>{player[3]}</Table.Cell>
        <Table.Cell>{player[4]}</Table.Cell>
        <Table.Cell>{(player[4] / users.rosters.length * 100).toFixed(0)}%</Table.Cell>
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
            Player Details
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
            Loading Player Details...
          </div>
        </div>
        <div className='ui stackable grid' style={loadingStyle()}>
          <div className='row'>
            <div className='sixteen wide center aligned column'>
              <Table basic='very' unstackable selectable>
                <Table.Header style={{ position: 'sticky', top: '-14px', background: 'white' }}>
                  <Table.Row>
                    <Table.HeaderCell></Table.HeaderCell>
                    {playerHeaders}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {playerDetails}
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