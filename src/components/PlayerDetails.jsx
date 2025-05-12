import React, { useMemo, useState, useEffect } from 'react';
import {
  Checkbox,
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
import useUnselectedPlayers from '../hooks/useUnselectedPlayers';
import '../css/customStyle.css';

const PlayerDetails = ({ users, players, season, eliminatedTeams }) => {
  const [loading, setLoading] = useState(true);
  const [sortPlayerOption, setSortPlayerOption] = useState('Points');
  const [reverse, setReverse] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [nameSearch, setNameSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState([]);
  const [positionFilter, setPositionFilter] = useState([]);
  const [showActive, setShowActive] = useState(false);
  const [showEliminated, setShowEliminated] = useState(false);
  const [showUnselected, setShowUnselected] = useState(false);

  const { unselectedPlayers, loadingUnselected } = useUnselectedPlayers(players, season, eliminatedTeams);

  const allPlayoffPlayers = useMemo(() => {
    const processedSelectedPlayers = players.map(p => ({ ...p, id: p.id ? p.id.toString() : p.name }));
    return [...processedSelectedPlayers, ...unselectedPlayers];
  }, [players, unselectedPlayers]);

  useEffect(() => {
    setLoading(users.loading || loadingUnselected);
  }, [users.loading, loadingUnselected]);

  // Memoize headerKeys to prevent unnecessary re-renders
  const headerKeys = useMemo(() => ({
    Player: "name",
    Position: "position",
    Team: "teamName",
    Points: "points",
    Games: "gamesPlayed",
    "Points/Game": "pointsPerGame",
    "Pick Count — Rate": "pickCount",
  }), []); // Empty dependency array, so it's only created once.


  const filteredPlayers = useMemo(() => {
    const filtered = allPlayoffPlayers.filter((player) => {
      const matchesPosition = positionFilter.length
        ? positionFilter.includes(player.position)
        : true;
      const matchesTeam = teamFilter.length
        ? teamFilter.includes(player.teamName)
        : true;
      const matchesName = nameSearch
        ? player.name.toLowerCase().includes(nameSearch.toLowerCase())
        : true;

      let matchesStatus = true;
      const anyStatusFilterActive = showActive || showEliminated || showUnselected;
      if (anyStatusFilterActive) {
        matchesStatus = false;
        const conditions = [];
        if (showActive) {
          conditions.push(!player.isEliminated);
        }
        if (showEliminated) {
          conditions.push(player.isEliminated);
        }
        if (showUnselected) {
          conditions.push(player.isUnselected);
        }
        if (conditions.length > 0 && conditions.every(condition => condition === true)) {
          matchesStatus = true;
        }
      }
      return matchesPosition && matchesTeam && matchesName && matchesStatus;
    });

    const key = headerKeys[sortPlayerOption];
    const sorted = customSort(filtered, key);
    return reverse ? sorted.reverse() : sorted;
  }, [allPlayoffPlayers, positionFilter, teamFilter, nameSearch, sortPlayerOption, reverse, showActive, showEliminated, showUnselected, headerKeys]);

  const positionOptions = [
    { key: 'C', text: 'C', value: 'C' },
    { key: 'L', text: 'L', value: 'L' },
    { key: 'R', text: 'R', value: 'R' },
    { key: 'D', text: 'D', value: 'D' },
    { key: 'G', text: 'G', value: 'G' },
  ];

  const teamOptions = useMemo(() => {
    const teams = new Map();
    allPlayoffPlayers.forEach((player) => {
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
  }, [allPlayoffPlayers]);

  const playerFilters = () => {
    return (
      <Grid stackable columns='equal'>
        <Grid.Row columns={4}
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            zIndex: 10,
            background: 'white',
            alignItems: 'center'
          }}
        >
          <Grid.Column>
            <Input
              placeholder='Name'
              fluid
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
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
              onChange={(e, { value }) => setTeamFilter(value)}
              value={teamFilter}
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
              options={positionOptions}
              onChange={(e, { value }) => setPositionFilter(value)}
              value={positionFilter}
            />
          </Grid.Column>
          <Grid.Column style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <Checkbox
              label='Active'
              checked={showActive}
              onChange={() => setShowActive(!showActive)}
            />
            <Checkbox
              label='Eliminated'
              checked={showEliminated}
              onChange={() => setShowEliminated(!showEliminated)}
            />
            <Checkbox
              label='Not Selected'
              checked={showUnselected}
              onChange={() => setShowUnselected(!showUnselected)}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

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
      style={{
        cursor: 'pointer',
        paddingTop: 13,
        background: 'white'
      }}
    >
      {header}
      {sortPlayerOption === header && !reverse ? (
        <Icon name='sort down' />
      ) : sortPlayerOption === header && reverse ? (
        <Icon name='sort up' />
      ) : null}
    </Table.HeaderCell>
  ));

  const playerDetails = filteredPlayers.map((player, index) => (
    <Table.Row
      key={player.id}
      negative={player.isEliminated}
      warning={!player.isEliminated && player.isUnselected}
    >
      <Table.Cell collapsing>{index + 1}</Table.Cell>
      <Table.Cell>
        <Image src={player.headshot} avatar alt={`${player.name} Headshot`} /> {player.name}
      </Table.Cell>
      <Table.Cell>{player.position}</Table.Cell>
      <Table.Cell>
        <Image src={player.teamLogo} avatar size='mini' alt={`${player.teamName} Logo`} />{' '}
        {player.teamName}
      </Table.Cell>
      <Table.Cell>
        <strong>{player.points}</strong>
        {player.position === 'G'
          ? ` — ${player.stat1} W | ${player.stat2} SO | ${player.stat3} OTL`
          : ` — ${player.stat1} G | ${player.stat2} A | ${player.stat3} OTG`}
      </Table.Cell>
      <Table.Cell>
        {player.gamesPlayed}
      </Table.Cell>
      <Table.Cell>
        {player.pointsPerGame.toFixed(2)}
      </Table.Cell>
      <Table.Cell>
        {player.isUnselected
          ? 'Not Selected'
          : `${player.pickCount}/${users.rosters.length} — ${((player.pickCount / users.rosters.length) * 100).toFixed(0)}%`}
      </Table.Cell>
    </Table.Row>
  ));

  return (
    <Segment.Group>
      <Segment attached='top'>
        <Grid columns='equal'>
          <Grid.Row>
            <Grid.Column />
            <Grid.Column>
              <Header color='blue' textAlign='center' size='medium' style={{ whiteSpace: 'nowrap' }}>
                Player Details
              </Header>
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <Button
                basic={!filtersVisible}
                color='blue'
                icon
                onClick={() => setFiltersVisible(!filtersVisible)}
                size='mini'
              >
                <Icon name='filter' />
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {filtersVisible && (
          playerFilters()
        )}
      </Segment>
      <Segment attached='bottom' className={'expandedPlayersStyle'} style={{ paddingTop: 0 }}>
        {loading ? (
          <Loader active={loading} inline='centered' size='large' style={{ marginTop: 13 }}>
            Loading Player Details...
          </Loader>
        ) : (
          <Table basic='very' singleLine unstackable selectable>
            <Table.Header
              style={{
                position: 'sticky',
                top: 0,
                background: 'white',
                zIndex: 2,
              }}>
              <Table.Row>
                <Table.HeaderCell />
                {playerHeaders}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {playerDetails}
            </Table.Body>
          </Table>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default PlayerDetails;