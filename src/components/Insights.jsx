import React, { useState, useEffect, useMemo } from 'react';
import { Divider, Icon, Grid, Statistic, Segment, Header, Loader } from 'semantic-ui-react';
import { min, max, mean, customSort } from '../utils/stats';
import '../css/customStyle.css';

const smallStep = 1;
const bigStep = 10;
const defaultHighThresh = 50;
const defaultLowThresh = 50;

const Insights = ({ users, players }) => {
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

  const userPlayersRemaining = useMemo(() => users.rosters.map(u => u.playersRemaining), [users.rosters]);
  const userPoints = useMemo(() => users.rosters.map(u => u.points), [users.rosters]);

  const playerPickRate = useMemo(() => players.map(p => ({
    ...p,
    pickRate: (p.pickCount / users.rosters.length) * 100
  })), [players, users.rosters.length]);

  const mostPlayersRemaining = max(userPlayersRemaining);
  const averagePlayersRemaining = mean(userPlayersRemaining).toFixed(0);
  const leastPlayersRemaining = min(userPlayersRemaining);

  const mostPoints = max(userPoints);
  const averagePoints = mean(userPoints).toFixed(0)
  const leastPoints = min(userPoints);

  const mostCommonPlayers = playerPickRate.slice(0, 3).map((player) => {
    return <Statistic horizontal value={player.pickCount
      // + ' - ' + (commonPlayerSelections / users.rosters.length * 100).toFixed(0) + '%'
    }
      key={player.id}
      label={player.name}
    />;
  });

  const topL = customSort(playerPickRate, 'points').filter(player => player.position === 'L').slice(0, 3);
  const topC = customSort(playerPickRate, 'points').filter(player => player.position === 'C').slice(0, 3);
  const topR = customSort(playerPickRate, 'points').filter(player => player.position === 'R').slice(0, 3);
  const topD = customSort(playerPickRate, 'points').filter(player => player.position === 'D').slice(0, 4);
  const topG = customSort(playerPickRate, 'points').filter(player => player.position === 'G').slice(0, 2);
  const topByPosition = [topL, topC, topR, topD, topG].flat();
  const topU = customSort(playerPickRate, 'points').filter(player => !topByPosition.some(p => p.id === player.id)).slice(0, 1);

  const bestTeam = topByPosition.concat(topU);
  let bestRemaining = 16;
  let bestPoints = 0;
  bestTeam.map((player) => {
    if (player.isEliminated) {
      bestRemaining--
    }
    bestPoints = bestPoints + player.points;
    return null;
  });

  const commonL = playerPickRate.filter(player => player.position === 'L').slice(0, 3); // Use playerPickRate
  const commonC = playerPickRate.filter(player => player.position === 'C').slice(0, 3);
  const commonR = playerPickRate.filter(player => player.position === 'R').slice(0, 3);
  const commonD = playerPickRate.filter(player => player.position === 'D').slice(0, 4);
  const commonG = playerPickRate.filter(player => player.position === 'G').slice(0, 2);
  const commonByPosition = [commonL, commonC, commonR, commonD, commonG].flat();
  const commonU = playerPickRate.filter(player => !commonByPosition.some(p => p.id === player.id)).slice(0, 1);

  const commonTeam = commonByPosition.concat(commonU);
  let commonRemaining = 16;
  let commonPoints = 0;
  commonTeam.map((player) => {
    if (player.isEliminated) {
      commonRemaining--
    }
    commonPoints = commonPoints + player.points
    return null;
  });

  const topPlayers = customSort(playerPickRate, 'points')
    .slice(0, 3)
    .map((player) => {
      return <Statistic horizontal value={player.points
      }
        key={player.id}
        label={`${player.name} (${player.pickCount})`}
      />;
    });

  const bottomPlayers = customSort(playerPickRate, 'points')
    .slice(-3)
    .reverse()
    .map((player) => {
      return <Statistic horizontal value={player.points
      }
        key={player.id}
        label={`${player.name} (${player.pickCount})`}
      />;
    });

  const bestByPickThreshold = customSort(playerPickRate, 'points')
    .filter(player => Math.round(player.pickRate) <= highThresh)
    .slice(0, 3)
    .map((player) => {
      return <Statistic horizontal value={player.points
      }
        key={player.id}
        label={`${player.name} (${player.pickCount})`}
      />;
    });

  const highThreshMin = playerPickRate.length ? Math.floor(playerPickRate[playerPickRate.length - 1].pickRate) : 0;
  const highThreshMax = playerPickRate.length ? Math.ceil(playerPickRate[0].pickRate) : 100;

  const worstByPickThreshold = customSort(playerPickRate, 'points')
    .filter(player => player.pickRate >= lowThresh)
    .slice(-3)
    .reverse()
    .map((player) => {
      return <Statistic horizontal value={player.points
      }
        key={player.id}
        label={`${player.name} (${player.pickCount})`}
      />;
    });

  const lowThreshMin = playerPickRate.length ? Math.floor(playerPickRate[playerPickRate.length - 1].pickRate) : 0;
  const lowThreshMax = playerPickRate.length ? Math.ceil(playerPickRate[0].pickRate) : 100; // Use players[0] for max pick rate

  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const renderStatistics = (players, color) => {
    return players.map((player) => (
      <Statistic
        color={player.isEliminated ? 'red' : color}
        horizontal
        key={player.id} // Use unique id
        label={`${player.name} (${player.pickCount})`}
        value={player.points}
      />
    ));
  };

  return (
    <Segment.Group>
      <Segment attached="top">
        <Grid>
          <Grid.Column width={2} onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>
            <Icon circular color="blue" name={visible ? 'chevron up' : 'chevron down'} />
          </Grid.Column>
          <Grid.Column textAlign="center" width={12}>
            <Header size='medium' color="blue">Quick Insights</Header>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached="bottom" className={visible ? 'expandedStyle' : 'collapsedStyle'}>
        {loading ? (
          <Loader active inline="centered" size="large">
            Loading Insights...
          </Loader>
        ) : (
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={2} >
                <Header size='medium'>Players Remaining</Header>
                <Statistic.Group size='mini' widths='one'>
                  <Statistic horizontal color="blue" value={mostPlayersRemaining} label="Most" />
                  <Statistic horizontal color="purple" value={averagePlayersRemaining} label="Average" />
                  <Statistic horizontal color="red" value={leastPlayersRemaining} label="Least" />
                </Statistic.Group>
              </Grid.Column>
              <Grid.Column width={2}>
                <Header size='medium'>Pool Points</Header>
                <Statistic.Group size='mini' widths='one'>
                  <Statistic horizontal color="blue" value={mostPoints} label="Most" />
                  <Statistic horizontal color="purple" value={averagePoints} label="Average" />
                  <Statistic horizontal color="red" value={leastPoints} label="Least" />
                </Statistic.Group>
              </Grid.Column>
              <Grid.Column width={2}>
                <Header size='medium'>Most Picks</Header>
                <Statistic.Group size='mini' widths='one' color="blue">
                  {mostCommonPlayers}
                </Statistic.Group>
              </Grid.Column>
              <Grid.Column width={2}>
                <Header size='medium'>Best Picks</Header>
                <Statistic.Group size='mini' widths='one' color="green">
                  {topPlayers}
                </Statistic.Group>
              </Grid.Column>
              <Grid.Column width={2}>
                <Header size='medium'>Worst Picks</Header>
                <Statistic.Group size='mini' widths='one' color="red">
                  {bottomPlayers}
                </Statistic.Group>
              </Grid.Column>
              <Grid.Column width={2}>
                <Header size='medium'>Most Advantageous Picks</Header>
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
                <Header size='medium'>Least Advantageous Picks</Header>
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
                <Header size='medium'>Best Players No One Took</Header>
                <Statistic.Group size='mini' widths='one' color='green'>
                  <Statistic
                    horizontal
                    label='Calvin Pickard'
                    value='8'
                  // label='Pavel Francouz'
                  // value='14'
                  // label='Adin Hill'
                  // value='26'
                  // label='Coming Soon'
                  />
                  <Statistic
                    horizontal
                    label='Phillip Danault'
                    value='8'
                  // label='Antti Raanta'
                  // value='14'
                  // label='Sergei Bobrovsky'
                  // value='26'
                  />
                  <Statistic
                    horizontal
                    label='Andrei Kuzmenko'
                    value='6'
                  // label='Carter Verhaeghe'
                  // value='14'
                  // label='Carter Verhaeghe'
                  // value='19'
                  />
                </Statistic.Group>
              </Grid.Column>
            </Grid.Row>
            <Divider />
            <Grid.Row columns={2}>
              <Grid.Column>
                <Header size='medium'>Perfect Team - {bestPoints} Points, {bestRemaining}/16 Players</Header>
                <Grid>
                  {chunkArray(['Left', 'Center', 'Right', 'Defense', 'Goalie', 'Utility'], 3).map((chunk, rowIndex) => (
                    <Grid.Row columns={3} key={rowIndex}>
                      {chunk.map((position) => (
                        <Grid.Column key={position}>
                          <Header as="h4">{position}</Header>
                          <Statistic.Group size="mini" widths="one">
                            {renderStatistics(
                              position === 'Left' ? topL :
                                position === 'Center' ? topC :
                                  position === 'Right' ? topR :
                                    position === 'Defense' ? topD :
                                      position === 'Goalie' ? topG : topU,
                              'green'
                            )}
                          </Statistic.Group>
                        </Grid.Column>
                      ))}
                    </Grid.Row>
                  ))}
                </Grid>
              </Grid.Column>
              <Grid.Column>
                <Header size='medium'>Most Common Team - {commonPoints} Points, {commonRemaining}/16 Players</Header>
                <Grid>
                  {chunkArray(['Left', 'Center', 'Right', 'Defense', 'Goalie', 'Utility'], 3).map((chunk, rowIndex) => (
                    <Grid.Row columns={3} key={rowIndex}>
                      {chunk.map((position) => (
                        <Grid.Column key={position}>
                          <Header as="h4">{position}</Header>
                          <Statistic.Group size="mini" widths="one">
                            {renderStatistics(
                              position === 'Left' ? commonL :
                                position === 'Center' ? commonC :
                                  position === 'Right' ? commonR :
                                    position === 'Defense' ? commonD :
                                      position === 'Goalie' ? commonG : commonU,
                              'blue'
                            )}
                          </Statistic.Group>
                        </Grid.Column>
                      ))}
                    </Grid.Row>
                  ))}
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