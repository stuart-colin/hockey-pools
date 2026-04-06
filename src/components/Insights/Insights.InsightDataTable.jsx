import React, { useState } from 'react';
import { Image, Table, Icon, Button } from 'semantic-ui-react';
import { useBreakpoint } from '../../hooks/useBreakpoint';


/**
 * InsightDataTable - Flexible data table for insights
 * Can display players with standard layout, or custom data with rowRenderer
 * Features: Expandable with customizable row limits, fade effect, customizable color
 *
 * Props:
 *   - players: Array of data to display
 *   - color: Semantic UI color for table
 *   - rowRenderer: (optional) Function that renders custom row content. Receives item and isMobile
 *                  If not provided, renders standard player row with headshot, name, selections, points
 *   - headerRenderer: (optional) Function that renders custom headers. Receives isMobile
 *                     If not provided, renders standard player headers
 *   - visibleRows: (optional) Number of rows to show before expand button (default 4)
 *   - expandedRows: (optional) Max rows to show when expanded (default 10)
 *   - showPercentage: Show selection percentage (only used in default player renderer)
 *   - totalTeams: Total teams in pool (for calculating percentages)
 *   - customColumns: Array of additional columns for player renderer
 *   - emptyMessage: Message when no data
*/
const InsightDataTable = ({
  players,
  color,
  rowRenderer,
  headerRenderer,
  visibleRows = 4,
  expandedRows = 10,
  showPercentage = true,
  totalTeams,
  customColumns = [],
  emptyMessage = 'No data to display',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();

  if (!players || players.length === 0) {
    return <p style={{ color: '#999', fontStyle: 'italic', margin: 0, padding: '16px 0', textAlign: 'center' }}>{emptyMessage}</p>;
  }

  const displayRows = isExpanded
    ? expandedRows
      ? players.slice(0, expandedRows)
      : players
    : players.slice(0, visibleRows);
  const hasMore = players.length > visibleRows;

  // Default header renderer for players
  const renderDefaultHeaders = () => (
    <Table.Row>
      <Table.HeaderCell>
        Player
      </Table.HeaderCell>
      <Table.HeaderCell />
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
  );

  // Default row renderer for players
  const renderDefaultPlayerRow = (player) => (
    <Table.Row
      key={player.id}
      negative={player.isEliminated}
    >
      <Table.Cell collapsing>
        <div
          style={{
            height: isMobile ? '32px' : '44px',
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
              opacity: 0.1,
              height: '100%',
              objectFit: 'cover',
              filter: player.isEliminated ? 'grayscale(1)' : 'none',
            }}
          />
        </div>
        <Image
          alt={player.name}
          avatar
          src={player.headshot}
          style={{
            filter: player.isEliminated ? 'grayscale(1)' : 'none',
            opacity: player.isEliminated ? 0.5 : 1,
          }}
        />
        {player.name}
      </Table.Cell>
      <Table.Cell collapsing>
      </Table.Cell>
      {
        showPercentage && <Table.Cell collapsing textAlign='right'>
          {totalTeams ? (
            <>
              {player.pickCount} <span style={{ color: '#666', fontSize: '0.9em' }}>({Math.round((player.pickCount / totalTeams) * 100)}%)</span>
            </>
          ) : (
            `${player.pickCount}%`
          )}
        </Table.Cell>
      }
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
      {
        customColumns.map((col) => (
          <Table.Cell key={col.key} textAlign='right'>
            {col.render ? col.render(player) : player[col.key]}
          </Table.Cell>
        ))
      }
    </Table.Row >
  );

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <div style={{ overflowX: 'scroll' }}>
          <Table padded singleLine unstackable selectable color={color}>
            <Table.Header>
              {headerRenderer ? headerRenderer(isMobile) : renderDefaultHeaders()}
            </Table.Header>
            <Table.Body>
              {displayRows.map((item, idx) =>
                rowRenderer
                  ? rowRenderer(item, isMobile, idx)
                  : renderDefaultPlayerRow(item)
              )}
            </Table.Body>
          </Table>

          {/* Fade effect when collapsed */}
          {!isExpanded && hasMore && (
            <div style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))',
              bottom: 0,
              height: '50px',
              left: 0,
              pointerEvents: 'none',
              position: 'absolute',
              right: 0,
            }} />
          )}
        </div>
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

export default React.memo(InsightDataTable);
