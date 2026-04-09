import React, { useMemo, useState } from 'react';
import {
  Button,
  Dropdown,
  Grid,
  Header,
  Icon,
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
  createTableHeader,
} from '../../utils/teambuilder';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const availablePlayersRootStyle = {
  marginTop: 0,
  flex: '1 1 0',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const gridNoBottomMarginStyle = {
  marginBottom: 0,
};

const headerNoMarginStyle = {
  margin: 0,
};

const filtersStickyGridStyle = {
  position: 'sticky',
  zIndex: 10,
  marginBottom: 10,
  marginTop: 0,
  flex: 'none',
};

const filterRowNoPaddingStyle = {
  padding: 0,
};

const teamDropdownLabelRowStyle = {
  display: 'flex',
  alignItems: 'center',
};

const teamDropdownLogoStyle = {
  width: '16px',
  height: '16px',
  marginRight: '5px',
  borderRadius: '2px',
};

const teamDropdownChipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  margin: '2px',
  padding: '4px 8px',
  borderRadius: '4px',
  background: '#f1f1f1',
};

const playersScrollStyle = {
  flex: '1 1 0',
  minHeight: 0,
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
};

const playersGridNoRightMarginStyle = {
  marginRight: 0,
};


/**
 * Left panel: Available players with filters
*/
const AvailablePlayersTable = ({
  goalieStats,
  skaterStats,
  loading,
  filtersVisible,
  onFiltersToggle,
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

  const { isMobile } = useBreakpoint();

  const playersColumnNoRightPaddingStyle = {
    marginBottom: isMobile ? 60 : 0,
  };
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
    <div style={availablePlayersRootStyle}>
      <Grid style={gridNoBottomMarginStyle}>
        <Grid.Row columns={2} verticalAlign='middle'>
          <Grid.Column>
            <Header as='h4' style={headerNoMarginStyle}>
              Available Players
            </Header>
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <Button
              basic={!filtersVisible}
              color="blue"
              icon
              onClick={onFiltersToggle}
              size='mini'
            >
              <Icon name="filter" />
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {/* Filters */}
      {filtersVisible && (
        <Grid stackable style={filtersStickyGridStyle}>
          <Grid.Row columns={3} style={filterRowNoPaddingStyle}>
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
                    <div style={teamDropdownLabelRowStyle}>
                      <img
                        src={item.image.src}
                        alt={item.text}
                        style={teamDropdownLogoStyle}
                      />
                      <span>{item.text}</span>
                    </div>
                  ),
                  style: teamDropdownChipStyle,
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
      <div style={playersScrollStyle}>
        <Grid style={playersGridNoRightMarginStyle}>
          <Grid.Row>
            <Grid.Column style={playersColumnNoRightPaddingStyle}>
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
