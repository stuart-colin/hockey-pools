import React from 'react';

import { useBreakpoint } from '../hooks/useBreakpoint';
import '../css/customStyle.css';
import '../css/customStyle.css';

const StatsSlim = ({ player }) => {

  const { isMobile } = useBreakpoint();
  const delta = player._delta;

  const deltaStyle = {
    color: '#21ba45',
    fontSize: '0.85em',
    fontWeight: 'bold',
    marginLeft: '2px',
  };

  const renderDelta = (value) => {
    if (!value || value <= 0) return null;
    return <span style={deltaStyle}>+{value}</span>;
  };

  let stats;
  if (player.position === 'G') {
    stats = [player.wins, 'W', player.shutouts, 'SO', player.otl, 'OTL'];
  } else {
    stats = [player.goals, 'G', player.assists, 'A', player.otGoals, 'OTG'];
  }

  return (
    <div
      alt={`${player.teamName} logo`}
      className={`ui blue card ${player.isEliminated ? 'eliminated' : ''}`}
      key={player.name}
      style={isMobile ? {
        boxSizing: 'border-box',
        width: '100%',
      } : undefined}
    >
      <div className='items'>
        <div className='logoBox'>
          <img className='teamLogoSlim' src={player.teamLogo} alt={`${player.teamName} Logo`} />
        </div>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            gap: '10px',
            padding: '5px 10px 5px 0px',
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <img className="ui circular image" src={player.headshot} alt={`${player.name} Headshot`} style={{ width: '55px' }} />
          </div>
          <div
            className="content"
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <div className='right floated meta'>{player.position}</div>
            <div className="sub header">{player.name}</div>
            <div className="meta">{player.teamName}</div>
            <div className="description">
              {player.position === 'G' ? (
                <>
                  <div><b>{stats[0]}</b> {stats[1]} | <b>{stats[2]}</b> {stats[3]} | <b>{stats[4]}</b> {stats[5]} | <b>{player.points}</b> Pool Points</div>
                  {(delta?.wins || delta?.shutouts || delta?.otl || delta?.points) && (
                    <div style={{ color: '#21ba45' }}>
                      {<><b>{delta.wins}</b> {stats[1]} | </>}
                      {<><b>{delta.shutouts}</b> {stats[3]} | </>}
                      {<><b>{delta.otl}</b> {stats[5]} | </>}
                      {<><b>{delta.points}</b> Today</>}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div><b>{stats[0]}</b> {stats[1]} | <b>{stats[2]}</b> {stats[3]} | <b>{stats[4]}</b> {stats[5]} | <b>{player.points}</b> Pool Points</div>
                  {(delta?.goals || delta?.assists || delta?.otGoals || delta?.points) && (
                    <div style={{ color: '#21ba45' }}>
                      {<><b>{delta.goals}</b> {stats[1]} | </>}
                      {<><b>{delta.assists}</b> {stats[3]} | </>}
                      {<><b>{delta.otGoals}</b> {stats[5]} | </>}
                      {<><b>{delta.points}</b> Today</>}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsSlim;