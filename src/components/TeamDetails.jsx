import React, { useState, useEffect, useMemo } from 'react';
import {
  Grid,
  Header,
  Icon,
  Image,
  Loader,
  Segment,
  Table,
} from 'semantic-ui-react';

import { customSort } from '../utils/stats';

const TeamDetails = ({ users, players, season }) => {
  const [loading, setLoading] = useState(true);
  const [sortTeamOption, setSortTeamOption] = useState('Points/Pick (Weighted)');
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (!users.loading) {
      setLoading(false);
    }
  }, [users]);

  const teamAggregations = useMemo(() => {
    const aggregations = {};

    players.forEach(player => {
      const teamName = player.teamName;
      if (!teamName) return;

      if (!aggregations[teamName]) {
        aggregations[teamName] = {
          name: teamName,
          logo: player.teamLogo,
          uniquePlayers: 0,
          totalPlayers: 0,
          teamPoints: 0,
          isEliminated: player.isEliminated,
          poolContribution: 0,
        };
      }

      aggregations[teamName].uniquePlayers += 1;
      aggregations[teamName].totalPlayers += player.pickCount;
      aggregations[teamName].teamPoints += player.points;
      aggregations[teamName].poolContribution += (player.points * player.pickCount);
    });

    return Object.values(aggregations);
  }, [players]);

  const totalPoolPoints = useMemo(() => {
    return teamAggregations.reduce((sum, team) => sum + team.poolContribution, 0);
  }, [teamAggregations]);

  const totalRosters = users.rosters.length;

  const headerKeys = {
    'Team': 'name',
    'Unique Players': 'uniquePlayers',
    'Total Players': 'totalPlayers',
    'Per Player Points': 'teamPoints',
    'Pool Contribution': 'poolContribution',
    'Points/Pick (Average)': 'avgPointsPerPick',
    'Points/Pick (Weighted)': 'weightedPointsPerPick'
  };

  const teamData = useMemo(() => {
    return teamAggregations.map(team => {
      const avgPointsPerPick = team.uniquePlayers > 0 ? team.teamPoints / team.uniquePlayers : 0;
      const weightedPointsPerPick = team.totalPlayers > 0 ? team.poolContribution / team.totalPlayers : 0;
      const totalPlayerPercentage = totalRosters > 0 ? (team.totalPlayers / (totalRosters * 16)) * 100 : 0;
      const poolContributionPercentage = totalPoolPoints > 0 ? (team.poolContribution / totalPoolPoints) * 100 : 0;

      return {
        ...team,
        avgPointsPerPick: avgPointsPerPick,
        weightedPointsPerPick: weightedPointsPerPick,
        totalPlayerPercentage: totalPlayerPercentage,
        poolContributionPercentage: poolContributionPercentage,
      }
    });
  }, [teamAggregations, totalRosters, totalPoolPoints]);

  const sortedTeams = useMemo(() => {
    const sortKey = headerKeys[sortTeamOption];
    if (!sortKey) {
      return customSort(teamData, headerKeys['Points/Pick (Weighted)']);
    }
    const sorted = customSort(teamData, sortKey);
    return reverse ? sorted.reverse() : sorted;
  }, [teamData, sortTeamOption, reverse]);

  const teamHeaders = Object.keys(headerKeys).map((header, index) => {
    const isSticky = index === 0;
    return (
      <Table.HeaderCell
        key={header}
        onClick={() => {
          if (sortTeamOption === header) {
            setReverse(!reverse);
          } else {
            setSortTeamOption(header);
            setReverse(false);
          }
        }}
        style={{ cursor: 'pointer', paddingTop: 13, background: 'white' }}
      >
        {header}
        {sortTeamOption === header && !reverse ? (
          <Icon name='sort down' />
        ) : sortTeamOption === header && reverse ? (
          <Icon name='sort up' />
        ) : (
          <Icon name='sort' />
        )}
      </Table.HeaderCell>
    );
  });

  const teamDetails = sortedTeams.map((team, index) => (
    <Table.Row key={team.name} negative={team.isEliminated}>
      <Table.Cell collapsing>{index + 1}</Table.Cell>
      <Table.Cell
        style={{
          // position: 'sticky',
          // left: -15,
          // background: 'white', // Ensure the sticky column has a background
          // zIndex: 1,
        }}>
        <Image src={team.logo} avatar alt={`${team.name} logo`} />
        {team.name}
      </Table.Cell>
      <Table.Cell>{team.uniquePlayers}</Table.Cell>
      <Table.Cell>
        {team.totalPlayers} — {team.totalPlayerPercentage.toFixed(2)}%
      </Table.Cell>
      <Table.Cell>{team.teamPoints}</Table.Cell>
      <Table.Cell>
        {team.poolContribution} — {team.poolContributionPercentage.toFixed(2)}%
      </Table.Cell>
      <Table.Cell>{team.avgPointsPerPick.toFixed(2)}</Table.Cell>
      <Table.Cell>{team.weightedPointsPerPick.toFixed(2)}</Table.Cell>
    </Table.Row>
  ));

  return (
    <Segment.Group>
      <Segment attached='top'>
        <Grid>
          <Grid.Column width={2} />
          <Grid.Column textAlign='center' width={12}>
            <Header color='blue' size='medium'>Team Details</Header>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached='bottom' className={'expandedStyle'} style={{ paddingTop: 0 }}>
        {loading ? (
          <Loader active inline='centered' size='large' style={{ marginTop: 13 }}>
            Loading Team Details...
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
                <Table.HeaderCell></Table.HeaderCell>
                {teamHeaders}
              </Table.Row>
            </Table.Header>
            <Table.Body>{teamDetails}</Table.Body>
          </Table>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default TeamDetails;