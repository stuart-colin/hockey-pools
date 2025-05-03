import React, { useMemo, useState, useEffect } from 'react';
import {
  Button,
  Dropdown,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Loader,
  Segment,
  Table,
} from 'semantic-ui-react';
import { customSort } from '../utils/stats';
import '../css/customStyle.css';

const PlayerDetails = ({ users, players }) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [sortPlayerOption, setSortPlayerOption] = useState('Points');
  const [reverse, setReverse] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [nameSearch, setNameSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState([]);
  const [positionFilter, setPositionFilter] = useState([]);

  useEffect(() => {
    setLoading(users.loading);
  }, [users]);

  const headerKeys = {
    Player: 'name',
    Position: 'position',
    Team: 'teamName',
    Points: 'points',
    'Pick Count — Rate': 'pickCount',
  };

  const filteredPlayers = useMemo(() => {
    const filtered = players.filter((player) => {
      const matchesPosition = positionFilter.length
        ? positionFilter.includes(player.position)
        : true;
      const matchesTeam = teamFilter.length
        ? teamFilter.includes(player.teamName)
        : true;
      const matchesName = nameSearch
        ? player.name.toLowerCase().includes(nameSearch.toLowerCase())
        : true;
      return matchesPosition && matchesTeam && matchesName;
    });

    const key = headerKeys[sortPlayerOption];
    const sorted = customSort(filtered, key);
    return reverse ? sorted.reverse() : sorted;
  }, [players, positionFilter, teamFilter, nameSearch, sortPlayerOption, reverse]);

  // Dropdown options for filters
  const positionOptions = [
    { key: 'C', text: 'C', value: 'C' },
    { key: 'L', text: 'L', value: 'L' },
    { key: 'R', text: 'R', value: 'R' },
    { key: 'D', text: 'D', value: 'D' },
    { key: 'G', text: 'G', value: 'G' },
  ];

  const teamOptions = useMemo(() => {
    const teams = new Map();
    players.forEach((player) => {
      if (!teams.has(player.teamName)) {
        teams.set(player.teamName, {
          key: player.teamName,
          text: player.teamName,
          value: player.teamName,
          image: { avatar: true, src: player.teamLogo },
        });
      }
    });
    return Array.from(teams.values());
  }, [players]);

  // Table headers
  const playerHeaders = Object.keys(headerKeys).map((header) => (
    <Table.HeaderCell
      key={header}
      onClick={() => {
        if (sortPlayerOption === header) {
          setReverse(!reverse);
        } else {
          setSortPlayerOption(header);
          setReverse(false);
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      {header}
      {sortPlayerOption === header && !reverse ? (
        <Icon name="sort down" />
      ) : sortPlayerOption === header && reverse ? (
        <Icon name="sort up" />
      ) : null}
    </Table.HeaderCell>
  ));

  const playerDetails = filteredPlayers.map((player, index) => (
    <Table.Row key={player.name} negative={player.isEliminated}>
      <Table.Cell collapsing>{index + 1}</Table.Cell>
      <Table.Cell>
        <Image src={player.headshot} avatar alt={`${player.name} Headshot`} /> {player.name}
      </Table.Cell>
      <Table.Cell>{player.position}</Table.Cell>
      <Table.Cell>
        <Image src={player.teamLogo} avatar size="mini" alt={`${player.teamName} Logo`} />{' '}
        {player.teamName}
      </Table.Cell>
      <Table.Cell>
        <strong>{player.points}</strong>
        {player.position === 'G'
          ? ` — ${player.stat1} W | ${player.stat2} SO | ${player.stat3} OTL`
          : ` — ${player.stat1} G | ${player.stat2} A | ${player.stat3} OTG`}
      </Table.Cell>
      <Table.Cell>
        {`${player.pickCount}/${users.rosters.length} — ${((player.pickCount / users.rosters.length) * 100).toFixed(0)}%`}
      </Table.Cell>
    </Table.Row>
  ));

  return (
    <Segment.Group>
      <Segment attached="top">
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column textAlign="left" onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>
              <Icon circular color="blue" name={visible ? 'chevron up' : 'chevron down'} />
            </Grid.Column>
            <Grid.Column>
              <Header color="blue" textAlign="center" as="h3" style={{ whiteSpace: 'nowrap' }}>
                Player Details
              </Header>
            </Grid.Column>
            <Grid.Column textAlign="right">
              <Button
                basic={!filtersVisible}
                color="blue"
                icon
                onClick={() => setFiltersVisible(!filtersVisible)}
                size="mini"
              >
                <Icon name="filter" />
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {filtersVisible && (
          <Grid stackable columns="equal">
            <Grid.Row
              columns={3}
              style={{
                position: 'sticky',
                top: 0,
                left: 0,
                zIndex: 10,
                background: 'white',
              }}
            >
              <Grid.Column>
                <Input
                  placeholder="Name"
                  fluid
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                />
              </Grid.Column>
              <Grid.Column>
                <Dropdown
                  placeholder="Team"
                  fluid
                  multiple
                  search
                  selection
                  clearable
                  options={teamOptions}
                  onChange={(e, { value }) => setTeamFilter(value)}
                  value={teamFilter}
                />
              </Grid.Column>
              <Grid.Column>
                <Dropdown
                  placeholder="Position"
                  fluid
                  multiple
                  search
                  selection
                  clearable
                  options={positionOptions}
                  onChange={(e, { value }) => setPositionFilter(value)}
                  value={positionFilter}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Segment>
      <Segment attached="bottom" className={visible ? 'expandedStyle' : 'collapsedStyle'}>
        {loading ? (
          <Loader active inline="centered" size="large">
            Loading Player Details...
          </Loader>
        ) : (
          <Table basic="very" singleLine unstackable selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell></Table.HeaderCell>
                {playerHeaders}
              </Table.Row>
            </Table.Header>
            <Table.Body>{playerDetails}</Table.Body>
          </Table>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default PlayerDetails;