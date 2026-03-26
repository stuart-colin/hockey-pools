import React, { useMemo } from 'react';
import {
  Dropdown,
  Grid,
  Header,
  Input,
  Loader,
  Table,
} from 'semantic-ui-react';
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
    <Grid.Column style={{ maxHeight: '60vh', overflow: 'auto' }}>
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Header as='h4'>Available Players</Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {/* Filters */}
      {filtersVisible && (
        <Grid stackable style={{ position: 'sticky', top: -15, zIndex: 10, background: 'white', marginBottom: '10px' }}>
          <Grid.Row columns={3}>
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
                clearable
                options={teamOptions}
                onChange={(e, { value }) => onTeamFilterChange(value)}
                value={teamFilter}
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
                clearable
                options={POSITION_OPTIONS}
                onChange={(e, { value }) => onPositionFilterChange(value)}
                value={positionFilter}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}

      {/* Players Table */}
      <Grid>
        <Grid.Row>
          <Grid.Column>
            {loading ? (
              <Loader active inline='centered' size='medium'>
                Loading Available Players...
              </Loader>
            ) : (
              <Table singleLine unstackable basic='very' compact='very'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Select</Table.HeaderCell>
                    <Table.HeaderCell>Position</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Team</Table.HeaderCell>
                    <Table.HeaderCell>Stats</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
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
    </Grid.Column>
  );
};

export default AvailablePlayersTable;
