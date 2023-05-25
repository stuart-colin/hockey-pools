import React, { useState, useEffect } from 'react';
import { Divider, Icon, Grid, Statistic } from 'semantic-ui-react';
import { min, max, mean, frequency, customSort } from '../utils/stats';
import eliminatedTeams from '../constants/eliminatedTeams';
// import positions from '../constants/positions';
import '../css/customStyle.css';

const smallStep = 1;
const bigStep = 10;
const defaultHighThresh = 50;
const defaultLowThresh = 50;

const Insights = ({ users }) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [highThresh, setHighThresh] = useState(defaultHighThresh);
  const [lowThresh, setLowThresh] = useState(defaultLowThresh);

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

  const mostPlayersRemaining = max(playersRemaining);
  const averagePlayersRemaining = mean(playersRemaining).toFixed(0);
  const LeastPlayersRemaining = min(playersRemaining);

  const mostPoints = max(points);
  const averagePoints = mean(points).toFixed(0)
  const LeastPoints = min(points);

  const mostCommonPlayers = playerList.slice(0, 3).map((player) => {
    return <Statistic value={player[4]
      // + ' - ' + (commonPlayerSelections / users.rosters.length * 100).toFixed(0) + '%'
    }
      key={player[0]}
      label={player[0]}
    />;
  });

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

  selectionsPerTeam.push(['Seattle Kraken', 0, 0]);
  selectionsPerTeam.sort()

  const topL = customSort(playerList, 3).filter(player => player[1] === 'L').slice(0, 3);
  const topC = customSort(playerList, 3).filter(player => player[1] === 'C').slice(0, 3);
  const topR = customSort(playerList, 3).filter(player => player[1] === 'R').slice(0, 3);
  const topD = customSort(playerList, 3).filter(player => player[1] === 'D').slice(0, 4);
  const topG = customSort(playerList, 3).filter(player => player[1] === 'G').slice(0, 2);
  const topByPosition = [topL, topC, topR, topD, topG].flat();
  const topU = customSort(playerList, 3).filter(player => !topByPosition.includes(player)).slice(0, 1);
  const bestTeam = topByPosition.concat(topU);
  let bestRemaining = 16;
  let bestPoints = 0;
  bestTeam.map((player) => {
    if (eliminatedTeams.includes(player[2])) {
      bestRemaining--
    }
    bestPoints = bestPoints + player[3];
    return null;
  });

  const commonL = playerList.filter(player => player[1] === 'L').slice(0, 3);
  const commonC = playerList.filter(player => player[1] === 'C').slice(0, 3);
  const commonR = playerList.filter(player => player[1] === 'R').slice(0, 3);
  const commonD = playerList.filter(player => player[1] === 'D').slice(0, 4);
  const commonG = playerList.filter(player => player[1] === 'G').slice(0, 2);
  const commonByPosition = [commonL, commonC, commonR, commonD, commonG].flat();
  const commonU = playerList.filter(player => !commonByPosition.includes(player)).slice(0, 1);
  const commonTeam = commonByPosition.concat(commonU);
  let commonRemaining = 16;
  let commonPoints = 0;
  commonTeam.map((player) => {
    if (eliminatedTeams.includes(player[2])) {
      commonRemaining--
    }
    commonPoints = commonPoints + player[3]
    return null;
  });

  const topPlayers = customSort(playerList, 3)
    .slice(0, 3)
    .map((player) => {
      return <Statistic value={player[3]
      }
        key={player[0]}
        label={player[0]}
      />;
    });

  const bottomPlayers = customSort(playerList, 3)
    .slice(-3)
    .reverse()
    .map((player) => {
      return <Statistic value={player[3]
      }
        key={player[0]}
        label={player[0]}
      />;
    });

  const bestByPickThreshold = customSort(playerList, 3)
    .filter(player => Math.round(player[4] / users.rosters.length * 100) <= highThresh)
    .slice(0, 3)
    .map((player) => {
      return <Statistic value={player[3]
      }
        key={player[0]}
        label={player[0]}
      />;
    });

  const highThreshMin = playerList.length ? parseFloat((playerList[playerList.length - 1][4] / users.rosters.length * 100).toFixed(0)) : null;
  const highThreshMax = playerList.length ? parseFloat((playerList[0][4] / users.rosters.length * 100).toFixed(0)) : null;

  const worstByPickThreshold = customSort(playerList, 3)
    .filter(player => (player[4] / users.rosters.length * 100) >= lowThresh)
    .slice(-3)
    .reverse()
    .map((player) => {
      return <Statistic value={player[3]
      }
        key={player[0]}
        label={player[0]}
      />;
    });

  const lowThreshMin = playerList.length ? parseFloat((playerList[playerList.length - 1][4] / users.rosters.length * 100).toFixed(0)) : null;
  const lowThreshMax = playerList.length ? parseFloat((playerList[2][4] / users.rosters.length * 100).toFixed(0)) : null;

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
            Quick Insights
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
                  value={LeastPlayersRemaining}
                  label='Least'
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
                  value={LeastPoints}
                  label='Least'
                />
              </Statistic.Group>
            </div>
            <div className='two wide center aligned column'>
              <h4>Most Picks</h4>
              <Statistic.Group size='tiny' color='blue' widths='one'>
                {mostCommonPlayers}
              </Statistic.Group>
              <h6>Number of times selected</h6>
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
              <h6>Lowest individual points</h6>
            </div>
            <div className='two wide center aligned column'>
              <h4>Most Advantageous Picks </h4>
              <Statistic.Group size='tiny' widths='one' color='teal'>
                {bestByPickThreshold}
              </Statistic.Group>
              <br></br>
              <div key='highThreshold'>
                <Icon
                  disabled={highThresh <= highThreshMin && true}
                  link={highThresh > highThreshMin && true}
                  name='angle down'
                  onClick={() => highThresh > highThreshMin && setHighThresh(highThresh - smallStep)}
                  size='large'
                />
                <Icon
                  disabled={highThresh <= highThreshMin && true}
                  link={highThresh > highThreshMin && true}
                  name='angle double down'
                  onClick={() => highThresh - bigStep > highThreshMin ? setHighThresh(highThresh - bigStep) : setHighThresh(highThreshMin)}
                  size='large'
                />
                <Icon
                  disabled={highThresh >= highThreshMax && true}
                  link={highThresh < highThreshMax && true}
                  name='angle double up'
                  onClick={() => highThresh + bigStep < highThreshMax ? setHighThresh(highThresh + bigStep) : setHighThresh(highThreshMax)}
                  size='large'
                />
                <Icon
                  disabled={highThresh >= highThreshMax && true}
                  link={highThresh < highThreshMax && true}
                  name='angle up'
                  onClick={() => highThresh < highThreshMax && setHighThresh(highThresh + smallStep)}
                  size='large'
                />
                <Icon
                  disabled={highThresh === defaultHighThresh && true}
                  link={highThresh !== defaultHighThresh && true}
                  name='undo alternate'
                  onClick={() => setHighThresh(defaultHighThresh)}
                  size='large'
                />
                {/* <br></br>
              <Input
                style={{ position: 'relative', top: '1em' }}
                labelPosition='right'
                value={highThresh}
                size='mini'
                type='range'
                min={highThreshMin}
                max={highThreshMax}
                onChange={(e) => setHighThresh(e.target.value)}
              /> */}
              </div>
              <h6>Highest points under {highThresh}% selection rate</h6>
            </div>
            <div className='two wide center aligned column'>
              <h4>Least Advantageous Picks</h4>
              <Statistic.Group size='tiny' widths='one' color='purple'>
                {worstByPickThreshold}
              </Statistic.Group>
              <br></br>
              <div style={{ alignItems: 'center' }}>
                <Icon
                  disabled={lowThresh <= lowThreshMin && true}
                  link={lowThresh > lowThreshMin && true}
                  name='angle down'
                  onClick={() => lowThresh > lowThreshMin && setLowThresh(lowThresh - smallStep)}
                  size='large'
                />
                <Icon
                  disabled={lowThresh <= lowThreshMin && true}
                  link={lowThresh > lowThreshMin && true}
                  name='angle double down'
                  onClick={() => lowThresh - bigStep > lowThreshMin ? setLowThresh(lowThresh - bigStep) : setLowThresh(lowThreshMin)}
                  size='large'
                />
                <Icon
                  disabled={lowThresh >= lowThreshMax && true}
                  link={lowThresh < lowThreshMax && true}
                  name='angle double up'
                  onClick={() => lowThresh + bigStep < lowThreshMax ? setLowThresh(lowThresh + bigStep) : setLowThresh(lowThreshMax)}
                  size='large'
                />
                <Icon
                  disabled={lowThresh >= lowThreshMax && true}
                  link={lowThresh < lowThreshMax && true}
                  name='angle up'
                  onClick={() => lowThresh < lowThreshMax && setLowThresh(lowThresh + smallStep)}
                  size='large'
                />
                <Icon
                  disabled={lowThresh === defaultLowThresh && true}
                  link={lowThresh !== defaultLowThresh && true}
                  name='undo alternate'
                  onClick={() => setLowThresh(defaultLowThresh)}
                  size='large'
                />
                {/* <br></br>
                <Input
                  labelPosition='right'
                  max={lowThreshMax}
                  min={lowThreshMin}
                  onChange={(e) => setLowThresh(parseFloat(e.target.value))}
                  style={{ position: 'relative', top: '1em' }}
                  type='range'
                  value={lowThresh}
                /> */}
              </div>

              <h6>Lowest points over {lowThresh}% selection rate</h6>
            </div>
            <div className='two wide center aligned column'>
              <h4>Best Players No One Took</h4>
              <Statistic.Group size='tiny' widths='one' color='green'>
                <Statistic
                  // label='Pavel Francouz'
                  // value='14'
                  label='Sergei Bobrovsky'
                  value='24'
                />
                <Statistic
                  // label='Antti Raanta'
                  // value='14'
                  label='Carter Verhaeghe'
                  value='16'
                />
                <Statistic
                  // label='Carter Verhaeghe'
                  // value='14'
                  label='Philipp Grubauer'
                  value='14'
                />
              </Statistic.Group>
            </div>
          </div>
          <Divider />
          <div className='row'>
            <div className='eight wide center aligned column'>
              <h4>Perfect Team - {bestPoints} Points, {bestRemaining}/16 Players</h4>
              <Grid>
                <Grid.Row columns={3}>
                  <Grid.Column>
                    <h5>Left</h5>
                    {topL.map((player) => {
                      return (
                        <div key={player[0]} style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }}>
                          {player[0] + ': ' + player[3]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Center</h5>
                    {topC.map((player) => {
                      return (
                        <div key={player[0]} style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }}>
                          {player[0] + ': ' + player[3]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Right</h5>
                    {topR.map((player) => {
                      return (
                        <div key={player[0]} style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }}>
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
                        <div key={player[0]} style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }}>
                          {player[0] + ': ' + player[3]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Goalie</h5>
                    {topG.map((player) => {
                      return (
                        <div key={player[0]} style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }}>
                          {player[0] + ': ' + player[3]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Utility</h5>
                    {topU.map((player) => {
                      return (
                        <div key={player[0]} style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }}>
                          {player[0] + ': ' + player[3]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
            <div className='eight wide center aligned column'>
              <h4>Most Common Team - {commonPoints} Points, {commonRemaining}/16 Players</h4>
              <Grid>
                <Grid.Row columns={3}>
                  <Grid.Column>
                    <h5>Left</h5>
                    {commonL.map((player) => {
                      return (
                        <div key={player[0]} style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }}>
                          {player[0] + ': ' + player[4]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Center</h5>
                    {commonC.map((player) => {
                      return (
                        <div key={player[0]} style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }}>
                          {player[0] + ': ' + player[4]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Right</h5>
                    {commonR.map((player) => {
                      return (
                        <div key={player[0]} style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }}>
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
                        <div key={player[0]} style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }}>
                          {player[0] + ': ' + player[4]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Goalie</h5>
                    {commonG.map((player) => {
                      return (
                        <div key={player[0]} style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }}>
                          {player[0] + ': ' + player[4]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                  <Grid.Column>
                    <h5>Utility</h5>
                    {commonU.map((player) => {
                      return (
                        <div key={player[0]} style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }}>
                          {player[0] + ': ' + player[4]}
                        </div>
                      )
                    })}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
            {/* <div className='two wide center aligned column'>
              <h4>Team</h4>
              <p>Most players picked</p>
              <p>Least players picked</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Insights;