import React, { Fragment, useState } from "react";

import { Button, Dropdown, Grid, Icon, Image, Label, Menu, Segment, Table } from "semantic-ui-react";


const teamLogoURL = `https://assets.nhle.com/logos/nhl/svg/`;
const playerHeadshotURL = `https://assets.nhle.com/mugs/nhl/20242025/`;

const TeamBuilder = ({ regularSeasonStats }) => {
  const [myTeam, setMyTeam] = useState([]);
  // const [left, setLeft] = useState([]);
  // const [center, setCenter] = useState([]);
  // const [right, setRight] = useState([]);
  // const [defense, setDefense] = useState([]);
  // const [goalie, setGoalie] = useState([]);
  // const [utility, setUtility] = useState([]);

  const positionCounts = { R: 3, L: 3, C: 3, D: 4, G: 2 };
  const rosterPositions = ['C', 'C', 'C', 'L', 'L', 'L', 'R', 'R', 'R', 'D', 'D', 'D', 'D', 'G', 'G', 'U']
  let utilityBonus;

  const position = myTeam.map(player => {
    return player.positionCode
  })
  const positionLimit = {};

  for (const num of position) {
    positionLimit[num] = positionLimit[num] ? positionLimit[num] + 1 : 1;
  };

  const teamCounts = myTeam.map(player => {
    return player.teamAbbrevs.split(/[,]+/).pop()
  })

  function countTeams(array) {
    return array.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
  }

  const teamCount = countTeams(teamCounts);

  // console.log(teamCount);

  positionLimit['L'] === 4 ||
    positionLimit['R'] === 4 ||
    positionLimit['C'] === 4 ||
    positionLimit['D'] === 5 ||
    positionLimit['G'] === 3
    ? utilityBonus = 0
    : utilityBonus = 1;

  const rankedGoalies = regularSeasonStats.goalieStats.sort((a, b) =>
    (a.wins > b.wins)
      ? -1 : ((b.wins > a.wins)
        ? 1 : 0));

  const rankedSkaters = regularSeasonStats.skaterStats.sort((a, b) =>
    (a.points > b.points)
      ? -1 : ((b.points > a.points)
        ? 1 : 0));

  let center = [];
  let left = [];
  let right = [];
  let defense = [];
  let goalie = [];
  let utility = [];

  let centerIds = [];
  let leftIds = [];
  let rightIds = [];
  let defenseIds = [];
  let goalieIds = [];
  let utilityIds = [];

  myTeam.map(player => {
    player.positionCode === 'C' && center.length < positionCounts[player.positionCode]
      ? center.push(player) && centerIds.push(player.playerId)
      : player.positionCode === 'L' && left.length < positionCounts[player.positionCode]
        ? left.push(player) && leftIds.push(player.playerId)
        : player.positionCode === 'R' && right.length < positionCounts[player.positionCode]
          ? right.push(player) && rightIds.push(player.playerId)
          : player.positionCode === 'D' && defense.length < positionCounts[player.positionCode]
            ? defense.push(player) && defenseIds.push(player.playerId)
            : player.positionCode === 'G' && goalie.length < positionCounts[player.positionCode]
              ? goalie.push(player) && goalieIds.push(player.playerId)
              : utility.push(player) && utilityIds.push(player.playerId);
  });

  // const sortedTeam = myTeam.sort(function (a, b) {
  //   return rosterPositions.indexOf(a.positionCode) - rosterPositions.indexOf(b.positionCode)
  // });

  const sortedTeam = center.concat(
    left.concat(
      right.concat(
        defense.concat(
          goalie.concat(
            utility
          )))))

  let submittedTeam = {
    "owner": 'peepee poopoo lover',
    "center": centerIds,
    "left": leftIds,
    "right": rightIds,
    "defense": defenseIds,
    "goalie": goalieIds,
    "utility": utilityIds,
  };

  const rosterPositionBadge = rosterPositions.map((position, index) => {
    return (
      <Button
        style={{ cursor: 'default' }}
        color={
          rosterPositions.indexOf(position, rosterPositions.indexOf(position)
            + positionLimit[position]) > index
            || positionCounts[position] <= positionLimit[position]
            ? 'blue' : utilityBonus === 0 && index === 15 ? 'blue' : null}
      >
        {position}
      </Button>
    )
  })

  const teamCountBadge = Object.entries(teamCount).map((team, value) => {
    return (
      <Fragment>
        <Label
        >
          <Image
            avatar size='mini'
            src={teamLogoURL + team[0] + `_light.svg`}
          >
          </Image>
          {team[1]}
        </Label>
      </Fragment>
    )
  })

  const goalieStats = rankedGoalies.map(goalie => {
    return (
      <Table.Row>
        <Table.Cell>
          <Button
            icon
            disabled={positionLimit[goalie.positionCode] >= positionCounts[goalie.positionCode] + utilityBonus
              && !JSON.stringify(myTeam).includes(JSON.stringify(goalie))
              ? true : false}
            color={JSON.stringify(myTeam).includes(JSON.stringify(goalie)) ? 'blue' : null}
            onClick={() => setMyTeam(
              JSON.stringify(myTeam).includes(JSON.stringify(goalie))
                ? JSON.parse(JSON.stringify(myTeam).replace((JSON.stringify(goalie)), null)).filter(e => e)
                : positionLimit[goalie.positionCode] >= positionCounts[goalie.positionCode] + utilityBonus ? myTeam
                  : player => [...player, goalie]
            )}
          >
            <Icon name='check' />
          </Button>
        </Table.Cell>
        <Table.Cell>
          {goalie.positionCode}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={playerHeadshotURL + goalie.teamAbbrevs.split(/[,]+/).pop() + `/` + goalie.playerId + `.png`} alt={`${goalie.goalieFullname} Headshot`} />
          {goalie.goalieFullName}
          {/* <div>{goalie.playerId}</div> */}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={teamLogoURL + goalie.teamAbbrevs.split(/[,]+/).pop() + `_light.svg`} alt={`${goalie.teamAbbrevs.split(/[,]+/).pop()} Logo`} />
          {goalie.teamAbbrevs.split(/[,]+/).pop()}
        </Table.Cell>
        <Table.Cell>
          GP: {goalie.gamesPlayed} W: {goalie.wins} L: {goalie.losses} OTL: {goalie.otLosses}
        </Table.Cell>
      </Table.Row>
    )
  })

  const skaterStats = rankedSkaters.map(skater => {
    return (
      <Table.Row>
        <Table.Cell>
          <Button
            icon
            disabled={positionLimit[skater.positionCode] >= positionCounts[skater.positionCode] + utilityBonus
              && !JSON.stringify(myTeam).includes(JSON.stringify(skater))
              ? true : false}
            color={JSON.stringify(myTeam).includes(JSON.stringify(skater)) ? 'blue' : null}
            onClick={() => setMyTeam(
              JSON.stringify(myTeam).includes(JSON.stringify(skater))
                ? JSON.parse(JSON.stringify(myTeam).replace((JSON.stringify(skater)), null)).filter(e => e)
                : positionLimit[skater.positionCode] >= positionCounts[skater.positionCode] + utilityBonus ? myTeam
                  : player => [...player, skater]
            )}
          >
            <Icon name='check' />
          </Button>
        </Table.Cell>
        <Table.Cell>
          {skater.positionCode}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={playerHeadshotURL + skater.teamAbbrevs.split(/[,]+/).pop() + `/` + skater.playerId + `.png`} alt={`${skater.skaterFullname} Headshot`} />
          {skater.skaterFullName}
          {/* <div>{skater.playerId}</div> */}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={teamLogoURL + skater.teamAbbrevs.split(/[,]+/).pop() + `_light.svg`} alt={`${skater.teamAbbrevs.split(/[,]+/).pop()} Logo`} />
          {skater.teamAbbrevs.split(/[,]+/).pop()}
        </Table.Cell>
        <Table.Cell>
          GP: {skater.gamesPlayed} G: {skater.goals} A: {skater.assists} P: {skater.points}
        </Table.Cell>
      </Table.Row>
    )
  })

  const myRoster = sortedTeam.map((team, index) => {
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
          {team.positionCode}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={playerHeadshotURL + team.teamAbbrevs.split(/[,]+/).pop() + `/` + team.playerId + `.png`} alt={`${team.playerFullname} Headshot`} />
          {team.positionCode != 'G' ? team.skaterFullName : team.goalieFullName}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={teamLogoURL + team.teamAbbrevs.split(/[,]+/).pop() + `_light.svg`} alt={`${team.teamAbbrevs} Logo`} />
          {team.teamAbbrevs.split(/[,]+/).pop()}
        </Table.Cell>
        <Table.Cell>
          {`GP: ` + team.gamesPlayed}
          {team.positionCode != 'G' ? ` G: ` + team.goals : ` W: ` + team.wins}
          {team.positionCode != 'G' ? ` A: ` + team.assists : ` L: ` + team.losses}
          {team.positionCode != 'G' ? ` P: ` + team.points : ` OTL: ` + team.otLosses}
        </Table.Cell>
      </Table.Row>
    )
  })

  const myCenters = center.map((team, index) => {
    return (
      <Fragment>
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
          {team.positionCode}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={playerHeadshotURL + team.teamAbbrevs.split(/[,]+/).pop() + `/` + team.playerId + `.png`} alt={`${team.playerFullname} Headshot`} />
          {team.positionCode != 'G' ? team.skaterFullName : team.goalieFullName}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={teamLogoURL + team.teamAbbrevs.split(/[,]+/).pop() + `_light.svg`} alt={`${team.teamAbbrevs} Logo`} />
          {team.teamAbbrevs.split(/[,]+/).pop()}
        </Table.Cell>
        <Table.Cell>
          {`GP: ` + team.gamesPlayed}
          {team.positionCode != 'G' ? ` G: ` + team.goals : ` W: ` + team.wins}
          {team.positionCode != 'G' ? ` A: ` + team.assists : ` L: ` + team.losses}
          {team.positionCode != 'G' ? ` P: ` + team.points : ` OTL: ` + team.otLosses}
        </Table.Cell>
      </Fragment>
    )
  })

  const myLefts = left.map((team, index) => {
    return (
      <Fragment>
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
          {team.positionCode}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={playerHeadshotURL + team.teamAbbrevs.split(/[,]+/).pop() + `/` + team.playerId + `.png`} alt={`${team.playerFullname} Headshot`} />
          {team.positionCode != 'G' ? team.skaterFullName : team.goalieFullName}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={teamLogoURL + team.teamAbbrevs.split(/[,]+/).pop() + `_light.svg`} alt={`${team.teamAbbrevs} Logo`} />
          {team.teamAbbrevs.split(/[,]+/).pop()}
        </Table.Cell>
        <Table.Cell>
          {`GP: ` + team.gamesPlayed}
          {team.positionCode != 'G' ? ` G: ` + team.goals : ` W: ` + team.wins}
          {team.positionCode != 'G' ? ` A: ` + team.assists : ` L: ` + team.losses}
          {team.positionCode != 'G' ? ` P: ` + team.points : ` OTL: ` + team.otLosses}
        </Table.Cell>
      </Fragment>
    )
  })
  const myRights = right.map((team, index) => {
    return (
      <Fragment>
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
          {team.positionCode}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={playerHeadshotURL + team.teamAbbrevs.split(/[,]+/).pop() + `/` + team.playerId + `.png`} alt={`${team.playerFullname} Headshot`} />
          {team.positionCode != 'G' ? team.skaterFullName : team.goalieFullName}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={teamLogoURL + team.teamAbbrevs.split(/[,]+/).pop() + `_light.svg`} alt={`${team.teamAbbrevs} Logo`} />
          {team.teamAbbrevs.split(/[,]+/).pop()}
        </Table.Cell>
        <Table.Cell>
          {`GP: ` + team.gamesPlayed}
          {team.positionCode != 'G' ? ` G: ` + team.goals : ` W: ` + team.wins}
          {team.positionCode != 'G' ? ` A: ` + team.assists : ` L: ` + team.losses}
          {team.positionCode != 'G' ? ` P: ` + team.points : ` OTL: ` + team.otLosses}
        </Table.Cell>
      </Fragment>
    )
  })

  const myDefense = defense.map((team, index) => {
    return (
      <Fragment>
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
          {team.positionCode}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={playerHeadshotURL + team.teamAbbrevs.split(/[,]+/).pop() + `/` + team.playerId + `.png`} alt={`${team.playerFullname} Headshot`} />
          {team.positionCode != 'G' ? team.skaterFullName : team.goalieFullName}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={teamLogoURL + team.teamAbbrevs.split(/[,]+/).pop() + `_light.svg`} alt={`${team.teamAbbrevs} Logo`} />
          {team.teamAbbrevs.split(/[,]+/).pop()}
        </Table.Cell>
        <Table.Cell>
          {`GP: ` + team.gamesPlayed}
          {team.positionCode != 'G' ? ` G: ` + team.goals : ` W: ` + team.wins}
          {team.positionCode != 'G' ? ` A: ` + team.assists : ` L: ` + team.losses}
          {team.positionCode != 'G' ? ` P: ` + team.points : ` OTL: ` + team.otLosses}
        </Table.Cell>
      </Fragment>
    )
  })

  const myGoalies = goalie.map((team, index) => {
    return (
      <Fragment>
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
          {team.positionCode}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={playerHeadshotURL + team.teamAbbrevs.split(/[,]+/).pop() + `/` + team.playerId + `.png`} alt={`${team.playerFullname} Headshot`} />
          {team.positionCode != 'G' ? team.skaterFullName : team.goalieFullName}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={teamLogoURL + team.teamAbbrevs.split(/[,]+/).pop() + `_light.svg`} alt={`${team.teamAbbrevs} Logo`} />
          {team.teamAbbrevs.split(/[,]+/).pop()}
        </Table.Cell>
        <Table.Cell>
          {`GP: ` + team.gamesPlayed}
          {team.positionCode != 'G' ? ` G: ` + team.goals : ` W: ` + team.wins}
          {team.positionCode != 'G' ? ` A: ` + team.assists : ` L: ` + team.losses}
          {team.positionCode != 'G' ? ` P: ` + team.points : ` OTL: ` + team.otLosses}
        </Table.Cell>
      </Fragment>
    )
  })

  const myUtility = utility.map((team, index) => {
    return (
      <Fragment>
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
          {team.positionCode}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={playerHeadshotURL + team.teamAbbrevs.split(/[,]+/).pop() + `/` + team.playerId + `.png`} alt={`${team.playerFullname} Headshot`} />
          {team.positionCode != 'G' ? team.skaterFullName : team.goalieFullName}
        </Table.Cell>
        <Table.Cell>
          <Image avatar size='mini' src={teamLogoURL + team.teamAbbrevs.split(/[,]+/).pop() + `_light.svg`} alt={`${team.teamAbbrevs} Logo`} />
          {team.teamAbbrevs.split(/[,]+/).pop()}
        </Table.Cell>
        <Table.Cell>
          {`GP: ` + team.gamesPlayed}
          {team.positionCode != 'G' ? ` G: ` + team.goals : ` W: ` + team.wins}
          {team.positionCode != 'G' ? ` A: ` + team.assists : ` L: ` + team.losses}
          {team.positionCode != 'G' ? ` P: ` + team.points : ` OTL: ` + team.otLosses}
        </Table.Cell>
      </Fragment>
    )
  })

  const rosterPositionBadges = rosterPositions.map((position, index) => {
    return (
      <Table.Row>
        <Table.Cell>
          {rosterPositionBadge[index]}
        </Table.Cell>
        {position === 'C' ? myCenters[index] :
          position === 'L' ? myLefts[index - 3] :
            position === 'R' ? myRights[index - 6] :
              position === 'D' ? myDefense[index - 9] :
                position === 'G' ? myGoalies[index - 13] :
                  myUtility[index - 15]}
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
            {/* This is currently in development for next season.
            If you've discovered it please feel free to try it out and let me know what you think!
            This won't affect any current rosters.
            Mobile view is currently pretty nasty, desktop is much nicer. */}
            Work In Progress
            {/* <Menu vertical>
              <Dropdown item text='Filter' icon='sliders horizontal'>
                Filter
                <Menu.Menu >
                  <Dropdown.Item text='Team'>
                    <Dropdown.Menu >
                      <Dropdown.Item>Carolina Hurricanes</Dropdown.Item>
                      <Dropdown.Item>Dallas Stars</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Item>
                </Menu.Menu>
              </Dropdown>
            </Menu> */}
          </Grid.Column>

        </Grid.Row>
      </Grid>
      <Grid columns={2} stackable>
        <Grid.Row>
          <Grid.Column style={{ maxHeight: '72vh', overflow: 'auto' }}>
            <h4>
              Available Players
            </h4>
            <Table singleLine unstackable basic='very' compact='very'>
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
              {goalieStats}
              {skaterStats}
            </Table>
          </Grid.Column>
          <Grid.Column style={{ maxHeight: '72vh', overflow: 'auto' }}>
            <Grid.Row textAlign="left">
              <h4>
                My Team
              </h4>
              {teamCountBadge}
            </Grid.Row>
            <Table singleLine unstackable basic='very' compact='very'>
              <Table.Header style={{ position: 'sticky', top: '0px', background: 'white' }}>
                <Table.Row>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell>Remove</Table.HeaderCell>
                  <Table.HeaderCell>Position</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Team</Table.HeaderCell>
                  <Table.HeaderCell>Stats</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              {rosterPositionBadges}
            </Table>
            <Grid.Row textAlign="right">
              {/* <Button.Group floated='right' widths='16' fluid> */}

              <Button
                color='red'
                disabled={myTeam.length === 0}
                onClick={() => setMyTeam([])}
              >
                Clear
              </Button>
              <Button
                color='green'
                disabled={myTeam.length < 16}
                onClick={() => console.log(submittedTeam)}
              >
                Submit
              </Button>
              {/* </Button.Group> */}
            </Grid.Row>
          </Grid.Column>

        </Grid.Row>
      </Grid>
    </Segment>
  )
}

export default TeamBuilder;