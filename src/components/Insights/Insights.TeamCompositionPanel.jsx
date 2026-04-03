import React from 'react';
import { Grid, Header, Statistic, Card, Segment, Icon, Popup } from 'semantic-ui-react';
import { chunkArray } from '../../utils/insightCalculations';
import { POSITION_ORDER, GRID_LAYOUT, TOTAL_ROSTER_SIZE } from '../../constants/insights';
import useIsMobile from '../../hooks/useBreakpoint';

/**
 * TeamCompositionPanel - Displays team roster organized by position
 * Shows the Perfect Team or Most Common Team with position-based layout
 */
const TeamCompositionPanel = ({
  title,
  tooltip,
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

  const isMobile = useIsMobile();

  return (
    <Card fluid>
      {title && (
        <Card.Content>
          <Card.Header>
            {title}
            {tooltip && (
              <Popup
                trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                content={tooltip}
                size='small'
              />
            )}
          </Card.Header>
        </Card.Content>
      )}
      <Card.Content>
        <Statistic.Group size={isMobile ? 'mini' : 'tiny'} color={color}>
          <Statistic label='Points' value={teamPoints} />
          <Statistic label='Players Remaining' value={`${teamRemaining}/${TOTAL_ROSTER_SIZE}`} />
        </Statistic.Group>
      </Card.Content>
      <Card.Content>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {(isMobile ? [['Left', 'Center'], ['Right', 'Defense'], ['Goalie', 'Utility']] : [['Left', 'Center', 'Right'], ['Defense', 'Goalie', 'Utility']]).map((row, rowIdx) => (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 3}, 1fr)`, gap: '24px', minWidth: 0 }} key={rowIdx}>
              {row.map((position) => {
                const posPlayers = getTeamByPosition(team, position);
                return (
                  <div key={position}>
                    <div style={{ display: 'flex', marginBottom: '12px', paddingBottom: '8px', borderBottom: `1px solid #e0e0e0` }}>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>
                        {position}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {posPlayers.map((player) => (
                        <div key={player.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '500', color: '#1b1c1d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
                            {player.name}
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: color === 'green' ? '#21ba45' : color === 'red' ? '#db2828' : '#2185d0', flexShrink: 0 }}>
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
