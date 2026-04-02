import React, { useState } from 'react';
import { Image, Table, Icon, Button } from 'semantic-ui-react';
import { INSIGHT_COLORS } from '../../constants/insights';
import useIsMobile from '../../hooks/useIsMobile';


/**
 * PlayerInsightTable - Displays players in a compact table format
 * Shows player name, selection count & %, and points with optional custom columns
 * Expandable: shows 3 players by default with fade effect and expand button
*/
const PlayerInsightTable = ({
  players,
  color,
  showPercentage = true,
  totalTeams,
  customColumns = [],
  emptyMessage = 'No players to display',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const VISIBLE_ROWS = 4;
  const isMobile = useIsMobile();

  if (!players || players.length === 0) {
    return <p style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '16px 0', margin: 0 }}>{emptyMessage}</p>;
  }

  const visiblePlayers = isExpanded ? players : players.slice(0, VISIBLE_ROWS);
  const hasMore = players.length > VISIBLE_ROWS;

  return (
    <div
    >
      <div
        style={{
          position: 'relative',
        }}>
        <div
          style={{
            overflowX: 'scroll',
          }}
        >
          <Table padded singleLine unstackable selectable color={color}>
            <Table.Header>
              <Table.Row>
                {/* <Table.HeaderCell /> */}
                <Table.HeaderCell>
                  Player
                </Table.HeaderCell>
                <Table.HeaderCell />
                {/* <Table.HeaderCell>
                Team
                </Table.HeaderCell> */}
                {showPercentage && <Table.HeaderCell textAlign='right'>
                  Selections
                </Table.HeaderCell>}
                <Table.HeaderCell textAlign='right'>
                  Points
                </Table.HeaderCell>
                <Table.HeaderCell>
                </Table.HeaderCell>
                {customColumns.map((col) => (
                  <Table.HeaderCell key={col.key} width={col.width} textAlign='right'>
                    {col.label}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visiblePlayers.map((player) => (
                <Table.Row
                  key={player.id}
                  negative={player.isEliminated}
                >
                  {/* <Table.Cell collapsing>
                </Table.Cell> */}
                  <Table.Cell collapsing>
                    <div
                      style={{
                        height: isMobile ? '33px' : '44px',
                        marginLeft: -75,
                        marginTop: isMobile ? -5 : -9,
                        position: 'absolute',
                      }}
                    >
                      <Image
                        alt={`${player.teamName} Logo`}
                        size='large'
                        src={player.teamLogo}
                        style={{
                          opacity: 0.05,
                          height: '100%',
                          objectFit: 'cover',
                          // filter: 'blur(2px)'
                        }}
                      />
                    </div>
                    <Image
                      alt={player.name}
                      avatar
                      src={player.headshot}
                    />
                    {player.name}
                  </Table.Cell>
                  <Table.Cell collapsing>

                  </Table.Cell>
                  {/* <Table.Cell>
                  {player.teamName}
                  </Table.Cell> */}
                  {showPercentage && <Table.Cell collapsing textAlign='right'>
                    {totalTeams ? (
                      <>
                        {player.pickCount} <span style={{ fontSize: '0.9em', color: '#666' }}>({Math.round((player.pickCount / totalTeams) * 100)}%)</span>
                      </>
                    ) : (
                      `${player.pickCount}%`
                    )}
                  </Table.Cell>}
                  <Table.Cell textAlign='right'>
                    <strong>{player.points}</strong>
                  </Table.Cell>
                  <Table.Cell>
                    <strong>
                      {player._delta?.points > 0 ? (
                        <span style={{ color: '#21ba45' }}>+{player._delta.points}</span>
                      ) : (
                        null
                      )}
                    </strong>
                  </Table.Cell>
                  {customColumns.map((col) => (
                    <Table.Cell key={col.key} textAlign='right'>
                      {col.render ? col.render(player) : player[col.key]}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {/* Fade effect when collapsed */}
          {!isExpanded && hasMore && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))',
              pointerEvents: 'none',
            }} />
          )}
        </div>
      </div>

      {/* Expand/Collapse button */}
      {
        hasMore && (
          <Button
            basic
            color={color}
            fluid
            size='mini'
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <Icon name='chevron up' />
                Show Less
              </>
            ) : (
              <>
                <Icon name='chevron down' />
                Show More
              </>
            )}
          </Button>
        )
      }
    </div >
  );
};

export default React.memo(PlayerInsightTable);
