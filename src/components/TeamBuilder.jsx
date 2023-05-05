import React, { useEffect, useState } from "react";

import { Button, Grid, Icon, Segment, Table } from "semantic-ui-react";

import { customSort } from "../utils/stats";

const TeamBuilder = ({ rosters }) => {
  const [myTeam, setMyTeam] = useState([]);
  const [left, setLeft] = useState([]);
  const [center, setCenter] = useState([]);
  const [right, setRight] = useState([]);
  const [defense, setDefense] = useState([]);
  const [goalie, setGoalie] = useState([]);
  const [utility, setUtility] = useState([]);

  const rosterLimits = { R: 3, L: 3, C: 3, D: 4, G: 2 };
  const rosterPositions = ['L', 'L', 'L', 'C', 'C', 'C', 'R', 'R', 'R', 'D', 'D', 'D', 'D', 'G', 'G', 'U']
  let limitBonus;

  const position = myTeam.map(player => {
    return player[2].position.code
  })
  const counts = {};

  for (const num of position) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  };

  counts['L'] === 4 ||
    counts['R'] === 4 ||
    counts['C'] === 4 ||
    counts['D'] === 5 ||
    counts['G'] === 3
    ? limitBonus = 0
    : limitBonus = 1;
  const sortedTeam = customSort(myTeam, 0).reverse()

  const rosterIndicator = rosterPositions.map((position, index) => {
    return (
      <Button
        style={{ cursor: 'default' }}
        compact
        color={rosterPositions.indexOf(position, rosterPositions.indexOf(position) + counts[position]) > index
          || rosterLimits[position] <= counts[position]
          ? 'green' : limitBonus === 0 && index === 15 ? 'green' : null}
      >
        {position}
      </Button>
    )
  })

  const teamRosters = rosters.rosters.map(team => {
    return team[2].map(roster => {
      return (
        <Table.Row>
          <Table.Cell>
            <Button
              icon
              disabled={counts[roster.position.code] >= rosterLimits[roster.position.code] + limitBonus
                && !JSON.stringify(myTeam).includes(JSON.stringify([team[0], team[1], roster]))
                ? true : false}
              color={JSON.stringify(myTeam).includes(JSON.stringify([team[0], team[1], roster])) ? 'green' : null}
              onClick={() => setMyTeam(
                JSON.stringify(myTeam).includes(JSON.stringify([team[0], team[1], roster]))
                  ? JSON.parse(JSON.stringify(myTeam).replace((JSON.stringify([team[0], team[1], roster])), null)).filter(e => e)
                  : counts[roster.position.code] >= rosterLimits[roster.position.code] + limitBonus ? myTeam
                    : player => [...player, [team[0], team[1], roster]]
              )}
            >
              <Icon name='check' />
            </Button>
          </Table.Cell>
          <Table.Cell>
            {roster.position.code}
          </Table.Cell>
          <Table.Cell>
            {roster.person.fullName}
            {/* <div>{roster.person.id}</div> */}
          </Table.Cell>
          <Table.Cell>
            {team[0]}
          </Table.Cell>
          <Table.Cell>

          </Table.Cell>
        </Table.Row>
      )
    })
  })

  const myRoster = sortedTeam.map(team => {
    return (
      <Table.Row>
        <Table.Cell>
          <Button
            icon
            color='red'
            onClick={() => setMyTeam(myTeam.filter(player => player !== team)
            )}
          >
            <Icon name='trash'></Icon>
          </Button>
        </Table.Cell>
        <Table.Cell>
          {team[2].position.code}
        </Table.Cell>
        <Table.Cell>
          {team[2].person.fullName}
        </Table.Cell>
        <Table.Cell>
          {team[0]}
        </Table.Cell>
        <Table.Cell>

        </Table.Cell>
      </Table.Row>
    )
  })

  return (
    <Segment>
      <Grid columns={2} stackable>
        <Grid.Row>

          <Grid.Column>
            <h3>
              Team Builder
            </h3>
            This is currently in development for next season.
            If you've discovered it please feel free to try it out and let me know what you think!
            This won't affect any current rosters.
            Mobile view is currently pretty nasty, desktop is much nicer.
          </Grid.Column>
          <Grid.Column textAlign="center">
            {/* <Button.Group floated='right' widths='16' fluid> */}
            {rosterIndicator}
            <Button
              compact
              color='red'
              disabled={myTeam.length === 0}
              onClick={() => setMyTeam([])}
            >
              Clear All
            </Button>
            <Button
              compact
              color='blue'
              disabled={myTeam.length < 16}
              onClick={() => alert('GET SOME')}
            >
              Submit
            </Button>
            {/* </Button.Group> */}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid columns={2} stackable>
        <Grid.Row>
          <Grid.Column style={{ maxHeight: '72vh', overflow: 'auto' }}>
            <h4>
              Available Players
            </h4>
            <Table basic='very' compact>
              <Table.Header style={{ position: 'sticky', top: '0px', background: 'white' }}>
                <Table.Row>
                  <Table.HeaderCell>Select</Table.HeaderCell>
                  <Table.HeaderCell>Position</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Team</Table.HeaderCell>
                  <Table.HeaderCell>Stats</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              {/* {renderedTeams} */}
              {teamRosters}
            </Table>
          </Grid.Column>
          <Grid.Column style={{ maxHeight: '72vh', overflow: 'auto' }}>
            <h4>
              My Team
            </h4>
            <Table basic='very' compact='very'>
              <Table.Header style={{ position: 'sticky', top: '0px', background: 'white' }}>
                <Table.Row>
                  <Table.HeaderCell>Remove</Table.HeaderCell>
                  <Table.HeaderCell>Position</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Team</Table.HeaderCell>
                  <Table.HeaderCell>Stats</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              {myRoster}
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  )
}

export default TeamBuilder;