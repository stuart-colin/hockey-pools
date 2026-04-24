import React from 'react';
import {
  Card,
  Icon,
  Image,
  Popup,
  Statistic,
} from 'semantic-ui-react';

import {
  TOTAL_ROSTER_SIZE,
} from '../../constants/insights';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const popupQuestionIconStyle = {
  cursor: 'pointer',
  marginLeft: '6px',
  opacity: 0.6,
};

const compositionGridStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
};

const positionRowGridStyle = (isMobile) => ({
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: `repeat(${isMobile ? 2 : 3}, 1fr)`,
  minWidth: 0,
});

const positionHeaderRowStyle = {
  borderBottom: '1px solid #e0e0e0',
  display: 'flex',
  marginBottom: '12px',
  paddingBottom: '8px',
};

const positionTitleStyle = {
  fontWeight: '600',
  fontSize: '14px',
};

const positionPlayersStackStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const playerRowStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: '12px',
};

const playerNameCellStyle = (player) => ({
  color: player.isEliminated ? 'red' : null,
  flex: 1,
  fontSize: '13px',
  fontWeight: '500',
  minWidth: 0,
  overflow: 'hidden',
});

const playerNameTextStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const playerSubLineStyle = {
  color: '#888',
  fontSize: '11px',
  fontWeight: '500',
  lineHeight: '1.2',
  marginTop: '2px',
  textAlign: 'right',
};

const playerHeadshotStyle = (player) => ({
  filter: player.isEliminated ? 'grayscale(1)' : 'none',
  opacity: player.isEliminated ? 0.5 : 1,
});

const playerPointsStyle = (color) => ({
  color: color === 'green' ? '#21ba45' : color === 'red' ? '#db2828' : '#2185d0',
  flexShrink: 0,
  fontSize: '13px',
  fontWeight: '700',
});

const formatPickRate = (player) => {
  if (player.isUnselected || !player.pickRate) return '—';
  return `${Math.round(player.pickRate)}%`;
};

/**
 * TeamCompositionPanel - Displays team roster organized by position
 * Shows the Perfect Team or Most Common Team with position-based layout
 */
const TeamCompositionPanel = ({
  color,
  getTeamByPosition,
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
                hideOnScroll
                position='right center'
                trigger={
                  <Icon
                    name='question circle outline'
                    size='small'
                    style={popupQuestionIconStyle}
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
        <div style={compositionGridStyle}>
          {(isMobile ?
            [['Left', 'Center'], ['Right', 'Defense'], ['Goalie', 'Utility']] :
            [['Left', 'Center', 'Right'], ['Defense', 'Goalie', 'Utility']]).map((row, rowIdx) => (
              <div
                key={rowIdx}
                style={positionRowGridStyle(isMobile)}
              >
                {row.map((position) => {
                  const posPlayers = getTeamByPosition(team, position);
                  return (
                    <div key={position}>
                      <div
                        style={positionHeaderRowStyle}
                      >
                        <span style={positionTitleStyle}>
                          {position}
                        </span>
                      </div>
                      <div style={positionPlayersStackStyle}>
                        {posPlayers.map((player) => (
                          <div key={player.id}>
                            <div style={playerRowStyle}>
                              <div style={playerNameCellStyle(player)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                  <Image
                                    alt={player.name}
                                    avatar
                                    src={player.headshot}
                                    style={playerHeadshotStyle(player)}
                                  />
                                  <span style={playerNameTextStyle}>{player.name}</span>
                                </div>
                              </div>
                              <div style={playerPointsStyle(color)}>
                                {player.points}
                              </div>
                            </div>
                            <div style={playerSubLineStyle}>
                              {formatPickRate(player)}
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
