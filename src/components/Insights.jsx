import React, { useState, useEffect } from 'react';
import { Placeholder, Statistic } from 'semantic-ui-react';
// import positions from '../constants/positions';
import '../css/customStyle.css';

const Insights = ({ users }) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

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
  let players = [];

  users.rosters.forEach((user) => {
    playersRemaining.push(user.playersRemaining)
    points.push(user.points)
    // for (let i = 0; i < positions.length; i++) {
    //   console.log(user.user[positions[i]].name)
    // }
    players.push(
      user.user.utility.name,
      user.user.left[0].name,
      user.user.left[1].name,
      user.user.left[2].name,
      user.user.center[0].name,
      user.user.center[1].name,
      user.user.center[2].name,
      user.user.right[0].name,
      user.user.right[1].name,
      user.user.right[2].name,
      user.user.defense[0].name,
      user.user.defense[1].name,
      user.user.defense[2].name,
      user.user.defense[3].name,
      user.user.goalie[0].name,
      user.user.goalie[1].name,
    )
  })

  const average = (array) => array.length && array.reduce((a, b) => a + b) / (array.length);
  const max = (array) => array.length && array.reduce((a, b) => a > b ? a : b);
  const min = (array) => array.length && array.reduce((a, b) => a < b ? a : b);
  const mode = (array) => array.length && array.sort((a, b) =>
    array.filter(v => v === a).length - array.filter(v => v === b).length).pop();
  const averagePlayersRemaining = average(playersRemaining).toFixed(0);
  const mostPlayersRemaining = max(playersRemaining);
  const fewestPlayersRemaining = min(playersRemaining);
  const averagePoints = average(points).toFixed(0)
  const mostPoints = max(points);
  const fewestPoints = min(points);
  const mostCommonPlayer = mode(players);
  const counts = {};
  for (const player of players) {
    counts[player] = counts[player] ? counts[player] + 1 : 1;
  }
  const commonPlayerSelections = counts[mostCommonPlayer];

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
            Insights
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
            <div className='four wide center aligned column'>
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
            <div className='four wide center aligned column'>
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
            <div className='four wide center aligned column'>
              <h4>Most Selected Player</h4>
              <Statistic.Group size='tiny' widths='one'>
                <Statistic
                  color='blue'
                  value={commonPlayerSelections + '/' + users.rosters.length + ' - ' + (commonPlayerSelections / users.rosters.length * 100).toFixed(0) + '%'}
                  label={mostCommonPlayer}
                />
              </Statistic.Group>
              {/* <p>Times Picked</p> */}
            </div>
            {/* <div className='four wide center aligned column'>
              <h4>Perfect team</h4>
            </div>
            <div className='four wide center aligned column'>
              <h4>Team</h4>
              <p>Most players picked</p>
              <p>Fewest players picked</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Insights;