import React, { useMemo } from 'react';
import {
  Dropdown,
  Grid,
  Header,
  Input,
  Loader,
  Table,
} from 'semantic-ui-react';
import useIsMobile from '../../hooks/useBreakpoint';
import PlayerRow from './TeamBuilder.PlayerRow';
import {
  POSITION_OPTIONS,
  TEAM_LOGO_URL,
} from '../../constants/teambuilder';
import {
  filterPlayers,
  sortPlayers,
  isPlayerDisabled,
  getTeamAbbrev,
  createTableHeader,
} from '../../utils/teambuilder';

/**
 * Left panel: Available players with filters
 */
const AvailablePlayersTable = ({
  goalieStats,
  skaterStats,
  loading,
  filtersVisible,
  nameSearch,
  onNameSearchChange,
  teamFilter,
  onTeamFilterChange,
  positionFilter,
  onPositionFilterChange,
  myTeam,
  positionLimit,
  utilityBonus,
  onPlayerToggle,
}) => {
  const isMobile = useIsMobile();
  // Build team options from available stats
  const teamOptions = useMemo(() => {
    const teams = Array.from(
      new Set([
        ...goalieStats.map((p) => getTeamAbbrev(p.teamAbbrevs)),
        ...skaterStats.map((p) => getTeamAbbrev(p.teamAbbrevs)),
      ])
    );
    return teams.map((team) => ({
      key: team,
      text: team,
      value: team,
      image: { avatar: true, src: `${TEAM_LOGO_URL}${team}_light.svg` },
    }));
  }, [goalieStats, skaterStats]);

  // Filter and sort goalies
  const filteredGoalies = useMemo(() => {
    const filtered = filterPlayers(goalieStats, nameSearch, teamFilter, positionFilter);
    return sortPlayers(filtered, true);
  }, [goalieStats, nameSearch, teamFilter, positionFilter]);

  // Filter and sort skaters
  const filteredSkaters = useMemo(() => {
    const filtered = filterPlayers(skaterStats, nameSearch, teamFilter, positionFilter);
    return sortPlayers(filtered, false);
  }, [skaterStats, nameSearch, teamFilter, positionFilter]);

  return (
    <div style={{ marginTop: 0, height: isMobile ? 'calc(100dvh - 272px)' : 'auto', maxHeight: isMobile ? 'none' : '60dvh', display: 'flex', flexDirection: 'column' }}>
      <Grid style={{ marginBottom: 0 }}>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Header as='h4'>Available Players</Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {/* Filters */}
      {filtersVisible && (
        <Grid stackable style={{ position: 'sticky', zIndex: 10, marginBottom: 10, marginTop: 0, flex: 'none' }}>
          <Grid.Row columns={3} style={{ padding: 0 }}>
            <Grid.Column>
              <Input
                placeholder='Name'
                fluid
                value={nameSearch}
                onChange={(e) => onNameSearchChange(e.target.value)}
              />
            </Grid.Column>
            <Grid.Column>
              <Dropdown
                placeholder='Team'
                fluid
                multiple
                search
                selection
                options={teamOptions}
                onChange={(e, { value }) => onTeamFilterChange(value)}
                value={teamFilter}
                noResultsMessage={teamFilter.length === teamOptions.length ? 'All selected' : 'No results found'}
                renderLabel={(item) => ({
                  content: (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={item.image.src}
                        alt={item.text}
                        style={{ width: '16px', height: '16px', marginRight: '5px', borderRadius: '2px' }}
                      />
                      <span>{item.text}</span>
                    </div>
                  ),
                  style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    margin: '2px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: '#f1f1f1',
                  },
                })}
              />
            </Grid.Column>
            <Grid.Column>
              <Dropdown
                placeholder='Position'
                fluid
                multiple
                search
                selection
                options={POSITION_OPTIONS}
                onChange={(e, { value }) => onPositionFilterChange(value)}
                value={positionFilter}
                noResultsMessage={positionFilter.length === POSITION_OPTIONS.length ? 'All selected' : 'No results found'}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}

      {/* Scrollable Players Table Container */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Grid style={{ marginRight: 0 }}>
          <Grid.Row>
            <Grid.Column style={{ paddingRight: 0 }}>
              {loading ? (
                <Loader active inline='centered' size='medium'>
                  Loading Available Players...
                </Loader>
              ) : (
                <Table singleLine unstackable basic='very' compact='very'>
                  {createTableHeader()}
                  <Table.Body>
                    {filteredGoalies.map((goalie) => (
                      <PlayerRow
                        key={goalie.playerId}
                        player={goalie}
                        isSelected={myTeam.some((p) => p.playerId === goalie.playerId)}
                        isDisabled={isPlayerDisabled(goalie, positionLimit, utilityBonus) && !myTeam.some((p) => p.playerId === goalie.playerId)}
                        onToggle={onPlayerToggle}
                      />
                    ))}
                    {filteredSkaters.map((skater) => (
                      <PlayerRow
                        key={skater.playerId}
                        player={skater}
                        isSelected={myTeam.some((p) => p.playerId === skater.playerId)}
                        isDisabled={isPlayerDisabled(skater, positionLimit, utilityBonus) && !myTeam.some((p) => p.playerId === skater.playerId)}
                        onToggle={onPlayerToggle}
                      />
                    ))}
                  </Table.Body>
                </Table>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </div >
  );
};

export default AvailablePlayersTable;
