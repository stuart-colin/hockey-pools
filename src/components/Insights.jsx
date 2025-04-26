import React, { useState, useEffect } from 'react';
import { Divider, Icon, Grid, Statistic, Segment, Header, Loader } from 'semantic-ui-react';
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

  const calculatePlayerPoints = (player) => {
    if (player.position === 'G') {
      return (
        player.stats.featuredStats.playoffs.subSeason.wins * 2 +
        player.stats.featuredStats.playoffs.subSeason.shutouts * 2 +
        player.stats.otl
      );
    }
    return (
      player.stats.featuredStats.playoffs.subSeason.goals +
      player.stats.featuredStats.playoffs.subSeason.assists +
      player.stats.featuredStats.playoffs.subSeason.otGoals
    );
  };

  playerData.forEach((player) => {
    const playerPoints = calculatePlayerPoints(player);
    players.push([player.name, player.position, player.stats.teamName, playerPoints]);
  });

  frequency(players).map((player) => {
    playerList.push([player[0].split(',')[0], player[0].split(',')[1], player[0].split(',')[2], parseFloat(player[0].split(',')[3]), player[1]])
    return null;
  })

  const mostPlayersRemaining = max(playersRemaining);
  const averagePlayersRemaining = mean(playersRemaining).toFixed(0);
  const leastPlayersRemaining = min(playersRemaining);

  const mostPoints = max(points);
  const averagePoints = mean(points).toFixed(0)
  const leastPoints = min(points);

  const mostCommonPlayers = playerList.slice(0, 3).map((player) => {
    return <Statistic horizontal value={player[4]
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
      return <Statistic horizontal value={player[3]
      }
        key={player[0]}
        label={player[0] + ' (' + player[4] + ')'}
      />;
    });

  const bottomPlayers = customSort(playerList, 3)
    .slice(-3)
    .reverse()
    .map((player) => {
      return <Statistic horizontal value={player[3]
      }
        key={player[0]}
        label={player[0] + ' (' + player[4] + ')'}
      />;
    });

  const bestByPickThreshold = customSort(playerList, 3)
    .filter(player => Math.round(player[4] / users.rosters.length * 100) <= highThresh)
    .slice(0, 3)
    .map((player) => {
      return <Statistic horizontal value={player[3]
      }
        key={player[0]}
        label={player[0] + ' (' + player[4] + ')'}
      />;
    });

  const highThreshMin = playerList.length ? parseFloat((playerList[playerList.length - 1][4] / users.rosters.length * 100).toFixed(0)) : null;
  const highThreshMax = playerList.length ? parseFloat((playerList[0][4] / users.rosters.length * 100).toFixed(0)) : null;

  const worstByPickThreshold = customSort(playerList, 3)
    .filter(player => (player[4] / users.rosters.length * 100) >= lowThresh)
    .slice(-3)
    .reverse()
    .map((player) => {
      return <Statistic horizontal value={player[3]
      }
        key={player[0]}
        label={player[0] + ' (' + player[4] + ')'}
      />;
    });

  const lowThreshMin = playerList.length ? parseFloat((playerList[playerList.length - 1][4] / users.rosters.length * 100).toFixed(0)) : null;
  const lowThreshMax = playerList.length ? parseFloat((playerList[2][4] / users.rosters.length * 100).toFixed(0)) : null;

  return (
    <Segment.Group>
      <Segment attached="top">
        <Grid>
          <Grid.Column width={2} onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>
            <Icon circular color="blue" name={visible ? 'chevron up' : 'chevron down'} />
          </Grid.Column>
          <Grid.Column textAlign="center" width={12}>
            <Header as="h3" color="blue">Quick Insights</Header>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached="bottom" className={visible ? 'expandedInsightsStyle' : 'collapsedStyle'}>
        {loading ? (
          <Loader active inline="centered" size="large">
            Loading Insights...
          </Loader>
        ) : (
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={2} >
                <Header as="h3">Players Remaining</Header>
                <Statistic.Group size='mini' widths='one'>
                  <Statistic horizontal color="blue" value={mostPlayersRemaining} label="Most" />
                  <Statistic horizontal color="purple" value={averagePlayersRemaining} label="Average" />
                  <Statistic horizontal color="red" value={leastPlayersRemaining} label="Least" />
                </Statistic.Group>
              </Grid.Column>
              <Grid.Column width={2}>
                <Header as="h3">Pool Points</Header>
                <Statistic.Group size='mini' widths='one'>
                  <Statistic horizontal color="blue" value={mostPoints} label="Most" />
                  <Statistic horizontal color="purple" value={averagePoints} label="Average" />
                  <Statistic horizontal color="red" value={leastPoints} label="Least" />
                </Statistic.Group>
              </Grid.Column>
              <Grid.Column width={2}>
                <Header as="h3">Most Picks</Header>
                <Statistic.Group size='mini' widths='one' color="blue">
                  {mostCommonPlayers}
                </Statistic.Group>
              </Grid.Column>
              <Grid.Column width={2}>
                <Header as="h3">Best Picks</Header>
                <Statistic.Group size='mini' widths='one' color="green">
                  {topPlayers}
                </Statistic.Group>
              </Grid.Column>
              <Grid.Column width={2}>
                <Header as="h3">Worst Picks</Header>
                <Statistic.Group size='mini' widths='one' color="red">
                  {bottomPlayers}
                </Statistic.Group>
              </Grid.Column>
              <Grid.Column width={2}>
                <Header as="h3">Most Advantageous Picks</Header>
                <Statistic.Group size='mini' widths='one' color="teal">
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
                </div>
                <h6>Highest points under {highThresh}% selection rate</h6>
              </Grid.Column>
              <Grid.Column width={2}>
                <Header as="h3">Least Advantageous Picks</Header>
                <Statistic.Group size='mini' widths='one' color="purple">
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
                </div>
                <h6>Lowest points over {lowThresh}% selection rate</h6>
              </Grid.Column>
              <Grid.Column width={2}>
                <Header as="h3">Best Players No One Took</Header>
                <Statistic.Group size='tiny' widths='one' color='green'>
                  <Statistic
                    horizontal
                    // label='Pavel Francouz'
                    // value='14'
                    // label='Adin Hill'
                    // value='26'
                    label='Coming Soon'
                  />
                  <Statistic
                    horizontal
                  // label='Antti Raanta'
                  // value='14'
                  // label='Sergei Bobrovsky'
                  // value='26'
                  />
                  <Statistic
                    horizontal
                  // label='Carter Verhaeghe'
                  // value='14'
                  // label='Carter Verhaeghe'
                  // value='19'
                  />
                </Statistic.Group>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Header as="h3">Perfect Team - {bestPoints} Points, {bestRemaining}/16 Players</Header>
                <Grid>
                  <Grid.Row columns={3}>
                    <Grid.Column>
                      <Header as='h4'>Left</Header>
                      <Statistic.Group size='mini' widths='one' color='green'>
                        {topL.map((player) => {
                          return (
                            <Statistic
                              horizontal
                              key={player[0]}
                              label={player[0] + ' (' + player[4] + ')'}
                              value={player[3]}
                              style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }} />
                          )
                        })}
                      </Statistic.Group>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as='h4'>Center</Header>
                      <Statistic.Group size='mini' widths='one' color='green'>
                        {topC.map((player) => {
                          return (
                            <Statistic
                              horizontal
                              key={player[0]}
                              label={player[0] + ' (' + player[4] + ')'}
                              value={player[3]}
                              style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }} />
                          )
                        })}
                      </Statistic.Group>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as='h4'>Right</Header>
                      <Statistic.Group size='mini' widths='one' color='green'>
                        {topR.map((player) => {
                          return (
                            <Statistic
                              horizontal
                              key={player[0]}
                              label={player[0] + ' (' + player[4] + ')'}
                              value={player[3]}
                              style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }} />
                          )
                        })}
                      </Statistic.Group>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={3}>
                    <Grid.Column>
                      <Header as='h4'>Defense</Header>
                      <Statistic.Group size='mini' widths='one' color='green'>
                        {topD.map((player) => {
                          return (
                            <Statistic
                              horizontal
                              key={player[0]}
                              label={player[0] + ' (' + player[4] + ')'}
                              value={player[3]}
                              style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }} />
                          )
                        })}
                      </Statistic.Group>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as='h4'>Goalie</Header>
                      <Statistic.Group size='mini' widths='one' color='green'>
                        {topG.map((player) => {
                          return (
                            <Statistic
                              horizontal
                              key={player[0]}
                              label={player[0] + ' (' + player[4] + ')'}
                              value={player[3]}
                              style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }} />
                          )
                        })}
                      </Statistic.Group>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as='h4'>Utility</Header>
                      <Statistic.Group size='mini' widths='one' color='green'>
                        {topU.map((player) => {
                          return (
                            <Statistic
                              horizontal
                              key={player[0]}
                              label={player[0] + ' (' + player[4] + ')'}
                              value={player[3]}
                              style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }} />
                          )
                        })}
                      </Statistic.Group>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
              <Grid.Column>
                <Header as="h3">Most Common Team - {commonPoints} Points, {commonRemaining}/16 Players</Header>
                <Grid>
                  <Grid.Row columns={3}>
                    <Grid.Column>
                      <Header as='h4'>Left</Header>
                      <Statistic.Group size='mini' widths='one' color='purple'>
                        {commonL.map((player) => {
                          return (
                            <Statistic
                              horizontal
                              key={player[0]}
                              label={player[0] + ' (' + player[4] + ')'}
                              value={player[3]}
                              style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }} />
                          )
                        })}
                      </Statistic.Group>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as='h4'>Center</Header>
                      <Statistic.Group size='mini' widths='one' color='purple'>
                        {commonC.map((player) => {
                          return (
                            <Statistic
                              horizontal
                              key={player[0]}
                              label={player[0] + ' (' + player[4] + ')'}
                              value={player[3]}
                              style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }} />
                          )
                        })}
                      </Statistic.Group>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as='h4'>Right</Header>
                      <Statistic.Group size='mini' widths='one' color='purple'>
                        {commonR.map((player) => {
                          return (
                            <Statistic
                              horizontal
                              key={player[0]}
                              label={player[0] + ' (' + player[4] + ')'}
                              value={player[3]}
                              style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }} />
                          )
                        })}
                      </Statistic.Group>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Grid>
                  <Grid.Row columns={3}>
                    <Grid.Column>
                      <Header as='h4'>Defense</Header>
                      <Statistic.Group size='mini' widths='one' color='purple'>
                        {commonD.map((player) => {
                          return (
                            <Statistic
                              horizontal
                              key={player[0]}
                              label={player[0] + ' (' + player[4] + ')'}
                              value={player[3]}
                              style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }} />
                          )
                        })}
                      </Statistic.Group>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as='h4'>Goalie</Header>
                      <Statistic.Group size='mini' widths='one' color='purple'>
                        {commonG.map((player) => {
                          return (
                            <Statistic
                              horizontal
                              key={player[0]}
                              label={player[0] + ' (' + player[4] + ')'}
                              value={player[3]}
                              style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }} />
                          )
                        })}
                      </Statistic.Group>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as='h4'>Utility</Header>
                      <Statistic.Group size='mini' widths='one' color='purple'>
                        {commonU.map((player) => {
                          return (
                            <Statistic
                              horizontal
                              key={player[0]}
                              label={player[0] + ' (' + player[4] + ')'}
                              value={player[3]}
                              style={{ color: eliminatedTeams.includes(player[2]) ? 'red' : '' }} />
                          )
                        })}
                      </Statistic.Group>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid >
        )
        }
      </Segment >


      {/* <div className='two wide center aligned column'>
              <h4>Team</h4>
              <p>Most players picked</p>
              <p>Least players picked</p>
            </div> */}
    </Segment.Group >
  );
};

export default Insights;