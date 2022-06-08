import React, { useState, useEffect } from 'react';
import { Divider, Grid, Statistic, Table } from 'semantic-ui-react';
// import positions from '../constants/positions';
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
    players.push([player.name, player.position, player.team.name, playerPoints])
  })

  // console.log(playerData)
  // console.log(players)
  // console.log(playerList)

  const max = (array) => array.length && array.reduce((a, b) => a > b ? a : b);
  const average = (array) => array.length && array.reduce((a, b) => a + b) / (array.length);
  const min = (array) => array.length && array.reduce((a, b) => a < b ? a : b);
  // const mode = (array) => array.length && array.sort((a, b) =>
  //   array.filter(v => v === a).length - array.filter(v => v === b).length).pop();
  const frequency = (array, index) => {
    let hash = {};
    for (let i of array) {
      if (!hash[i]) hash[i] = 0;
      hash[i]++;
    }
    const hashToArray = Object.entries(hash);
    const sortedArray = hashToArray.sort((a, b) => a[1] > b[1] ? -1 : 1);
    return sortedArray;
  }

  const mostPlayersRemaining = max(playersRemaining);
  const averagePlayersRemaining = average(playersRemaining).toFixed(0);
  const fewestPlayersRemaining = min(playersRemaining);

  const mostPoints = max(points);
  const averagePoints = average(points).toFixed(0)
  const fewestPoints = min(points);

  frequency(players).map((player) => {
    playerList.push([player[0].split(',')[0], player[0].split(',')[1], player[0].split(',')[2], parseFloat(player[0].split(',')[3]), player[1]])
  })

  const mostCommonPlayers = playerList.slice(0, 3).map((player) => {
    // console.log(player)
    return <Statistic value={player[4] + '/' + users.rosters.length
      // + ' - ' + (commonPlayerSelections / users.rosters.length * 100).toFixed(0) + '%'
    }
      label={player[0]}
    />;
  });
  const playersByFrequency = playerList.map((player, index) => {
    return (
      <Table.Row>
        <Table.Cell collapsing>{index + 1}</Table.Cell>
        <Table.Cell>{player[0]}</Table.Cell>
        <Table.Cell>{player[1]}</Table.Cell>
        <Table.Cell>{player[2]}</Table.Cell>
        <Table.Cell>{player[3]}</Table.Cell>
        <Table.Cell>{player[4]}</Table.Cell>
      </Table.Row>
    )
  });

  const sortByPoints = [].concat(playerList)
    .sort((a, b) => a[3] > b[3] ? -1 : 1);

  const playersByPoints = sortByPoints.map((player, index) => {
    return (
      <Table.Row>
        <Table.Cell collapsing>{index + 1}</Table.Cell>
        <Table.Cell>{player[0]}</Table.Cell>
        <Table.Cell>{player[1]}</Table.Cell>
        <Table.Cell>{player[2]}</Table.Cell>
        <Table.Cell>{player[3]}</Table.Cell>
        <Table.Cell>{player[4]}</Table.Cell>
      </Table.Row>
    )
  });

  const topL = sortByPoints.filter(player => player[1] === 'L').slice(0, 3);
  const topC = sortByPoints.filter(player => player[1] === 'C').slice(0, 3);
  const topR = sortByPoints.filter(player => player[1] === 'R').slice(0, 3);
  const topD = sortByPoints.filter(player => player[1] === 'D').slice(0, 4);
  const topG = sortByPoints.filter(player => player[1] === 'G').slice(0, 2);
  const topByPosition = [topL, topC, topR, topD, topG].flat();
  const topU = sortByPoints.filter(player => !topByPosition.includes(player)).slice(0, 1);
  // const bestTeam = topByPosition.concat(topU);
  // const bestTeam = topByPosition.concat(topU).map((player, index) => {
  //   return <div>{player[0]}: {player[3]}</div>
  // });

  const commonL = playerList.filter(player => player[1] === 'L').slice(0, 3);
  const commonC = playerList.filter(player => player[1] === 'C').slice(0, 3);
  const commonR = playerList.filter(player => player[1] === 'R').slice(0, 3);
  const commonD = playerList.filter(player => player[1] === 'D').slice(0, 4);
  const commonG = playerList.filter(player => player[1] === 'G').slice(0, 2);
  const commonByPosition = [commonL, commonC, commonR, commonD, commonG].flat();
  const commonU = playerList.filter(player => !commonByPosition.includes(player)).slice(0, 1);

  const topPlayers = sortByPoints.slice(0, 3).map((player) => {
    // console.log(player)
    return <Statistic value={player[3]
    }
      label={player[0]}
    />;
  });

  const bottomPlayers = sortByPoints.slice(-3).reverse().map((player) => {
    // console.log(player)
    return <Statistic value={player[3]
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
            <div className='two wide center aligned column'>
              <h4>Players Remaining</h4>
              <Statistic.Group size='tiny' widths='one'>
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
            <div className='two wide center aligned column'>
              <h4>Pool Points</h4>
              <Statistic.Group size='tiny' widths='one'>
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
            <div className='two wide center aligned column'>
              <h4>Most Picked Players</h4>
              <Statistic.Group size='tiny' color='blue' widths='one'>
                {mostCommonPlayers}
              </Statistic.Group>
            </div>
            <div className='two wide center aligned column'>
              <h4>Best Picks</h4>
              <Statistic.Group size='tiny' color='blue' widths='one'>
                {topPlayers}
              </Statistic.Group>
              <h6>Highest individual points</h6>
            </div>
            <div className='two wide center aligned column'>
              <h4>Worst Picks</h4>
              <Statistic.Group size='tiny' color='red' widths='one'>
                {bottomPlayers}
              </Statistic.Group>
              {/* <Statistic.Group size='tiny' widths='one' color='red'>
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
            <div className='two wide center aligned column'>
              <h4>Most Undervalued Picks</h4>
              <Statistic.Group size='tiny' widths='one' color='teal'>
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
            <div className='two wide center aligned column'>
              <h4>Most Overvalued Picks</h4>
              <Statistic.Group size='tiny' widths='one' color='purple'>
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
            <div className='eight wide center aligned column'>
              <h4>Perfect Team</h4>
              <Grid>
                <Grid.Row columns={3}>
                  <Grid.Column>
                    <h5>Left</h5>
                    {topL.map((player) => {
                      return (
                        <div>
                          {player[0] + ': ' + player[3]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Center</h5>
                    {topC.map((player) => {
                      return (
                        <div>
                          {player[0] + ': ' + player[3]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Right</h5>
                    {topR.map((player) => {
                      return (
                        <div>
                          {player[0] + ': ' + player[3]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={3}>
                  <Grid.Column>
                    <h5>Defense</h5>
                    {topD.map((player) => {
                      return (
                        <div>
                          {player[0] + ': ' + player[3]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Goalie</h5>
                    {topG.map((player) => {
                      return (
                        <div>
                          {player[0] + ': ' + player[3]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Utility</h5>
                    {topU.map((player) => {
                      return (
                        <div>
                          {player[0] + ': ' + player[3]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
            <div className='eight wide center aligned column'>
              <h4>Most Common Team</h4>
              <Grid>
                <Grid.Row columns={3}>
                  <Grid.Column>
                    <h5>Left</h5>
                    {commonL.map((player) => {
                      return (
                        <div>
                          {player[0] + ': ' + player[4]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Center</h5>
                    {commonC.map((player) => {
                      return (
                        <div>
                          {player[0] + ': ' + player[4]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Right</h5>
                    {commonR.map((player) => {
                      return (
                        <div>
                          {player[0] + ': ' + player[4]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={3}>
                  <Grid.Column>
                    <h5>Defense</h5>
                    {commonD.map((player) => {
                      return (
                        <div>
                          {player[0] + ': ' + player[4]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Goalie</h5>
                    {commonG.map((player) => {
                      return (
                        <div>
                          {player[0] + ': ' + player[4]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Utility</h5>
                    {commonU.map((player) => {
                      return (
                        <div>
                          {player[0] + ': ' + player[4]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                </Grid.Row>
                <Divider vertical></Divider>
              </Grid>
            </div>
            {/* <div className='two wide center aligned column'>
              <h4>Team</h4>
              <p>Most players picked</p>
              <p>Fewest players picked</p>
            </div> */}
          </div>
          <Divider />
          <div className='row'>
            <div className='sixteen wide center aligned column'>
              <h4>
                Player Details
              </h4>
              <Table basic='very' unstackable selectable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell>Player</Table.HeaderCell>
                    <Table.HeaderCell>Position</Table.HeaderCell>
                    <Table.HeaderCell>Team</Table.HeaderCell>
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