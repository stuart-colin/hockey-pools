import React from 'react';
import { Grid, Header, Statistic, Card, Segment } from 'semantic-ui-react';
import { chunkArray } from '../../utils/insightCalculations';
import { POSITION_ORDER, GRID_LAYOUT, TOTAL_ROSTER_SIZE } from '../../constants/insights';

/**
 * TeamCompositionPanel - Displays team roster organized by position
 * Shows the Perfect Team or Most Common Team with position-based layout
 */
const TeamCompositionPanel = ({
  title,
  teamPoints,
  teamRemaining,
  team,
  renderStatistics,
  getTeamByPosition,
  color,
}) => {
  const positionLabels = {
    'Left': 'LW',
    'Center': 'C',
    'Right': 'RW',
    'Defense': 'D',
    'Goalie': 'G'
  };

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>{title}</Card.Header>
        <div style={{ marginTop: '12px', display: 'flex', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Points
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1b1c1d' }}>
              {teamPoints}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Players Remaining
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1b1c1d' }}>
              {teamRemaining}/{TOTAL_ROSTER_SIZE}
            </div>
          </div>
        </div>
      </Card.Content>
      <Card.Content>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {[
            ['Left', 'Center', 'Right'],
            ['Defense', 'Goalie', 'Utility']
          ].map((row, rowIdx) => (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', minWidth: 0 }} key={rowIdx}>
              {row.map((position) => {
                const posPlayers = getTeamByPosition(team, position);
                return (
                  <div key={position}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: `1px solid #e0e0e0` }}>
                      <span style={{
                        display: 'inline-block',
                        width: '24px',
                        height: '24px',
                        backgroundColor: `var(--semantic-${color})` || '#2185D0',
                        borderRadius: '3px',
                        textAlign: 'center',
                        lineHeight: '24px',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '11px',
                        marginRight: '8px',
                        flexShrink: 0
                      }}>
                        {positionLabels[position]}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1b1c1d' }}>
                        {position}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {posPlayers.map((player) => (
                        <div key={player.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: '12px', fontWeight: '500', color: '#1b1c1d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                            {player.name}
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: color === 'green' ? '#21ba45' : color === 'red' ? '#db2828' : '#2185d0', marginLeft: '12px', flexShrink: 0 }}>
                            {player.points}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
};

export default React.memo(TeamCompositionPanel);
