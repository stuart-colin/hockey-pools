import React, { useState } from 'react';
import { Table, Icon, Button } from 'semantic-ui-react';
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
        <Table singleLine unstackable selectable color={color}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={2}>Player</Table.HeaderCell>
              {showPercentage && <Table.HeaderCell width={2} textAlign='right'>
                Selections
              </Table.HeaderCell>}
              <Table.HeaderCell width={1} textAlign='right'>
                Points
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
              <Table.Row key={player.id}>
                <Table.Cell>
                  {player.isEliminated ? (
                    <>
                      <Icon name='ban' color={INSIGHT_COLORS.ELIMINATED} />
                      <span style={{ textDecoration: 'line-through', color: '#999' }}>
                        {player.name}
                      </span>
                    </>
                  ) : (
                    player.name
                  )}
                </Table.Cell>
                {showPercentage && <Table.Cell textAlign='right' color={color}>
                  {totalTeams ? (
                    <>
                      {player.pickCount} <span style={{ fontSize: '0.9em', color: '#666' }}>({Math.round((player.pickCount / totalTeams) * 100)}%)</span>
                    </>
                  ) : (
                    `${player.pickCount}%`
                  )}
                </Table.Cell>}
                <Table.Cell textAlign='right' color={color}>
                  <strong>{player.points}</strong>
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
            background: 'linear-gradient(to bottom, rgba(250,251,252,0), rgba(250,251,252,1))',
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
