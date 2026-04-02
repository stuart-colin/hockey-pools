import React, { useState } from 'react';
import { Image, Table, Icon, Button } from 'semantic-ui-react';
import { INSIGHT_COLORS } from '../../constants/insights';

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

  if (!players || players.length === 0) {
    return <p style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '16px 0', margin: 0 }}>{emptyMessage}</p>;
  }

  const visiblePlayers = isExpanded ? players : players.slice(0, VISIBLE_ROWS);
  const hasMore = players.length > VISIBLE_ROWS;

  return (
    <div>
      <div style={{
        position: 'relative',
      }}>
        <Table padded singleLine unstackable selectable color={color}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>
                Player
              </Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell>
                Team
              </Table.HeaderCell>
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
                <Table.Cell collapsing>
                  <Image
                    alt={player.name}
                    avatar
                    src={player.headshot}
                  />
                </Table.Cell>
                <Table.Cell>
                  {player.name}
                </Table.Cell>
                <Table.Cell collapsing>
                  <Image
                    alt={`${player.teamName} Logo`}
                    size='mini'
                    src={player.teamLogo}
                  />
                </Table.Cell>
                <Table.Cell>
                  {player.teamName}
                </Table.Cell>
                {showPercentage && <Table.Cell textAlign='right'>
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
                      <span style={{ color: '#21ba45' }}>+{player._delta.points} today</span>
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

      {/* Expand/Collapse button */}
      {hasMore && (
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
      )}
    </div>
  );
};

export default React.memo(PlayerInsightTable);
