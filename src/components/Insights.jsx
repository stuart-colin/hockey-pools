import React, { useState, useEffect } from 'react';
import { Divider, Table, Statistic } from 'semantic-ui-react';
import positions from '../constants/positions';
import '../css/customStyle.css';

const Insights = ({ users }) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [sortOption, setSortOption] = useState(false);

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
    // console.log(playerPoints)
    players.push([player.name, playerPoints])
  })

  // console.log(playerData)
  // console.log(players)
  // console.log(playerList)

  const max = (array) => array.length && array.reduce((a, b) => a > b ? a : b);
  const average = (array) => array.length && array.reduce((a, b) => a + b) / (array.length);
  const min = (array) => array.length && array.reduce((a, b) => a < b ? a : b);
  // const mode = (array) => array.length && array.sort((a, b) =>
  //   array.filter(v => v === a).length - array.filter(v => v === b).length).pop();
  const pickFrequency = (array, index) => {
    let hash = {};
    for (let i of array) {
      if (!hash[i]) hash[i] = 0;
      hash[i]++;
    }
    const hashToArray = Object.entries(hash);
    const sortedArray = hashToArray.sort((a, b) => b[1] - a[1]);
    return sortedArray;
  }
  const averagePlayersRemaining = average(playersRemaining).toFixed(0);
  const mostPlayersRemaining = max(playersRemaining);
  const fewestPlayersRemaining = min(playersRemaining);
  const averagePoints = average(points).toFixed(0)
  const mostPoints = max(points);
  const fewestPoints = min(points);
  pickFrequency(players).map((player) => {
    playerList.push([player[0].split(',')[0], parseFloat(player[0].split(',')[1]), player[1]])
  })

  const mostCommonPlayers = playerList.slice(0, 3).map((player) => {
    // console.log(player)
    return <Statistic value={player[2] + '/' + users.rosters.length
      // + ' - ' + (commonPlayerSelections / users.rosters.length * 100).toFixed(0) + '%'
    }
      label={player[0]}
    />;
  });
  const playersByFrequency = playerList.map((player, index) => {
    return (
      <Table.Row>
        <Table.Cell>{index + 1}</Table.Cell>
        <Table.Cell>{player[0]}</Table.Cell>
        <Table.Cell>{player[1]}</Table.Cell>
        <Table.Cell>{player[2]}</Table.Cell>
      </Table.Row>
    )
  });

  const sortByPoints = [].concat(playerList)
    .sort((a, b) => a[1] > b[1] ? -1 : 1);

  const playersByPoints = sortByPoints.map((player, index) => {
    return (
      <Table.Row>
        <Table.Cell>{index + 1}</Table.Cell>
        <Table.Cell>{player[0]}</Table.Cell>
        <Table.Cell>{player[1]}</Table.Cell>
        <Table.Cell>{player[2]}</Table.Cell>
      </Table.Row>
    )
  });

  const topPlayers = sortByPoints.slice(0, 3).map((player) => {
    // console.log(player)
    return <Statistic value={player[1]
    }
      label={player[0]}
    />;
  });

  const bottomPlayers = sortByPoints.slice(-3).map((player) => {
    // console.log(player)
    return <Statistic value={player[1]
    }
      label={player[0]}
    />;
  });

  return (
    <div className='ui segments'>
      <div className='ui top blue centered attached header' >
        <div className='left aligned column' onClick={() => setVisible(!visible)} style={{ cursor: 'pointer', position: 'absolute' }}>
          <h3>
            {visible &&
              <i className='window minimize outline icon'></i>
            }
            {!visible &&
              <i className='window maximize outline icon'></i>
            }
          </h3>
        </div>
        <div className='middle aligned column'>
          <h2>
            Quick Insights
          </h2>
        </div>
      </div>
      <div className={
        `ui bottom attached segment
        ${!visible ? 'collapsedRosterStyle' : 'expandedRosterStyle'}`
      }>
        <div className='ui active inverted dimmer' style={loadedStyle()}>
          <div className='ui text loader'>
            Loading Insights...
          </div>
        </div>
        <div className='ui stackable grid' style={loadingStyle()}>
          <div className='row'>
            <div className='five wide center aligned column'>
              <h4>Players Remaining</h4>
              <Statistic.Group size='tiny' widths='three'>
                <Statistic
                  color='blue'
                  value={mostPlayersRemaining}
                  label='Most'
                />
                <Statistic
                  color='purple'
                  value={averagePlayersRemaining}
                  label='Average'
                />
                <Statistic
                  color='red'
                  value={fewestPlayersRemaining}
                  label='Fewest'
                />
              </Statistic.Group>
            </div>
            <div className='five wide center aligned column'>
              <h4>Pool Points</h4>
              <Statistic.Group size='tiny' widths='three'>
                <Statistic
                  color='blue'
                  value={mostPoints}
                  label='Most'
                />
                <Statistic
                  color='purple'
                  value={averagePoints}
                  label='Average'
                />
                <Statistic
                  color='red'
                  value={fewestPoints}
                  label='Fewest'
                />
              </Statistic.Group>
            </div>
            <div className='six wide center aligned column'>
              <h4>Most Picked Players</h4>
              <Statistic.Group size='tiny' color='blue' widths='three'>
                {mostCommonPlayers}
              </Statistic.Group>
            </div>
          </div>
          <Divider />
          <div className='row'>
            <div className='eight wide center aligned column'>
              <h4>Perfect Team</h4>
            </div>
            <div className='eight wide center aligned column'>
              <h4>Most Common Team</h4>
            </div>
            {/* <div className='four wide center aligned column'>
              <h4>Team</h4>
              <p>Most players picked</p>
              <p>Fewest players picked</p>
            </div> */}
          </div>
          <Divider />
          <div className='row'>
            <div className='four wide center aligned column'>
              <h4>Best Picks</h4>
              <Statistic.Group size='tiny' color='blue' widths='three'>
                {topPlayers}
              </Statistic.Group>
              <h6>Highest individual points</h6>
            </div>
            <div className='four wide center aligned column'>
              <h4>Worst Picks</h4>
              <Statistic.Group size='tiny' color='red' widths='three'>
                {bottomPlayers}
              </Statistic.Group>
              {/* <Statistic.Group size='tiny' widths='three' color='red'>
                <Statistic
                  value='0'
                  label='Frederik Andersen'
                />
                <Statistic
                  value='0'
                  label='Mike Reilly'
                />
                <Statistic>
                  <Statistic.Value>
                    1
                  </Statistic.Value>
                  <Statistic.Label>
                    Mason Marchment
                    <br></br>
                    Mackenzie Weegar
                    <br></br>
                    Tristan Jarry
                  </Statistic.Label>
                </Statistic>
              </Statistic.Group> */}
              <h6>Lowest individual points</h6>
            </div>
            <div className='four wide center aligned column'>
              <h4>Most Undervalued Picks</h4>
              <Statistic.Group size='tiny' widths='three' color='teal'>
                <Statistic
                  value='TBD'
                  label='Player'
                />
                <Statistic
                  value='TBD'
                  label='Player'
                />
                <Statistic
                  value='TBD'
                  label='Player'
                />
              </Statistic.Group>
              <h6>top of points / times picked</h6>
            </div>
            <div className='four wide center aligned column'>
              <h4>Most Overvalued Picks</h4>
              <Statistic.Group size='tiny' widths='three' color='purple'>
                <Statistic
                  value='TBD'
                  label='Player'
                />
                <Statistic
                  value='TBD'
                  label='Player'
                />
                <Statistic
                  value='TBD'
                  label='Player'
                />
              </Statistic.Group>
              <h6>bottom of points / times picked</h6>
            </div>
          </div>
          <Divider />
          <div className='row'>
            <div className='sixteen wide center aligned column'>
              <h4>
                Player Details
              </h4>
              <Table color='blue' striped compact>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Rank</Table.HeaderCell>
                    <Table.HeaderCell>Player</Table.HeaderCell>
                    <Table.HeaderCell onClick={() => setSortOption(false)} style={{ cursor: 'pointer' }}>Points</Table.HeaderCell>
                    <Table.HeaderCell onClick={() => setSortOption(true)} style={{ cursor: 'pointer' }}>Times Picked</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sortOption && playersByFrequency}
                  {!sortOption && playersByPoints}
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