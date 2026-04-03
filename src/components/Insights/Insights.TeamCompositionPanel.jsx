import React from 'react';
import {
  Card,
  Grid,
  Header,
  Icon,
  Image,
  Popup,
  Segment,
  Statistic,
} from 'semantic-ui-react';

import { chunkArray } from '../../utils/insightCalculations';
import {
  GRID_LAYOUT,
  POSITION_ORDER,
  TOTAL_ROSTER_SIZE,
} from '../../constants/insights';
import useBreakpoint from '../../hooks/useBreakpoint';

/**
 * TeamCompositionPanel - Displays team roster organized by position
 * Shows the Perfect Team or Most Common Team with position-based layout
 */
const TeamCompositionPanel = ({
  color,
  getTeamByPosition,
  renderStatistics,
  team,
  teamPoints,
  teamRemaining,
  title,
  tooltip,
}) => {
  const positionLabels = {
    Center: 'C',
    Defense: 'D',
    Goalie: 'G',
    Left: 'LW',
    Right: 'RW',
  };

  const { isMobile } = useBreakpoint();

  return (
    <Card fluid>
      {title && (
        <Card.Content>
          <Card.Header>
            {title}
            {tooltip && (
              <Popup
                content={tooltip}
                position='right center'
                trigger={
                  <Icon
                    name='question circle outline'
                    size='small'
                    style={{
                      cursor: 'pointer',
                      marginLeft: '6px',
                      opacity: 0.6,
                    }}
                  />
                }
              />
            )}
          </Card.Header>
        </Card.Content>
      )}
      <Card.Content>
        <Statistic.Group
          color={color}
          size={isMobile ? 'mini' : 'tiny'}
        >
          <Statistic
            label='Points'
            value={teamPoints}
          />
          <Statistic
            label='Players Remaining'
            value={`${teamRemaining}/${TOTAL_ROSTER_SIZE}`}
          />
        </Statistic.Group>
      </Card.Content>
      <Card.Content>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {(isMobile ?
            [['Left', 'Center'], ['Right', 'Defense'], ['Goalie', 'Utility']] :
            [['Left', 'Center', 'Right'], ['Defense', 'Goalie', 'Utility']]).map((row, rowIdx) => (
              <div
                key={rowIdx}
                style={{
                  display: 'grid',
                  gap: '24px',
                  gridTemplateColumns: `repeat(${isMobile ? 2 : 3}, 1fr)`,
                  minWidth: 0,
                }}
              >
                {row.map((position) => {
                  const posPlayers = getTeamByPosition(team, position);
                  return (
                    <div key={position}>
                      <div
                        style={{
                          borderBottom: '1px solid #e0e0e0',
                          display: 'flex',
                          marginBottom: '12px',
                          paddingBottom: '8px',
                        }}
                      >
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>
                          {position}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {posPlayers.map((player) => (
                          <div
                            key={player.id}
                            style={{
                              alignItems: 'center',
                              display: 'flex',
                              gap: '12px',
                            }}
                          >
                            <div
                              style={{
                                color: player.isEliminated ? 'red' : null,
                                flex: 1,
                                fontSize: '13px',
                                fontWeight: '500',
                                minWidth: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <Image
                                alt={player.name}
                                avatar
                                src={player.headshot}
                                style={{
                                  filter: player.isEliminated ? 'grayscale(1)' : 'none',
                                  opacity: player.isEliminated ? 0.5 : 1,
                                }}
                              />
                              <vatar />
                              {player.name}
                            </div>
                            <div
                              style={{
                                color: color === 'green' ? '#21ba45' : color === 'red' ? '#db2828' : '#2185d0',
                                flexShrink: 0,
                                fontSize: '13px',
                                fontWeight: '700',
                              }}
                            >
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
