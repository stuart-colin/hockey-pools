import React, { Fragment, useState, useMemo } from "react";

import { Button, Grid, Icon, Image, Input, Label, Segment, Table } from "semantic-ui-react";

import useSubmitRoster from "../hooks/useSubmitRoster";

const teamLogoURL = `https://assets.nhle.com/logos/nhl/svg/`;
const playerHeadshotURL = `https://assets.nhle.com/mugs/nhl/20242025/`;

const TeamBuilder = ({ regularSeasonStats }) => {
  const [myTeam, setMyTeam] = useState([]);
  const [submittedTeam, setSubmittedTeam] = useState({});
  const [userId, setUserId] = useState('');

  const positionCounts = { R: 3, L: 3, C: 3, D: 4, G: 2 };
  const rosterPositions = ['C', 'C', 'C', 'L', 'L', 'L', 'R', 'R', 'R', 'D', 'D', 'D', 'D', 'G', 'G', 'U']

  const { postData } = useSubmitRoster(submittedTeam);

  const positionLimit = useMemo(() => {
    return myTeam.reduce((acc, player) => {
      acc[player.positionCode] = (acc[player.positionCode] || 0) + 1;
      return acc;
    }, {});
  }, [myTeam]);

  const teamCount = useMemo(() => {
    return myTeam.reduce((acc, player) => {
      const team = player.teamAbbrevs.split(/[,]+/).pop();
      acc[team] = (acc[team] || 0) + 1;
      return acc;
    }, {});
  }, [myTeam]);

  const utilityBonus = useMemo(() => {
    return positionLimit["L"] === 4 ||
      positionLimit["R"] === 4 ||
      positionLimit["C"] === 4 ||
      positionLimit["D"] === 5 ||
      positionLimit["G"] === 3
      ? 0
      : 1;
  }, [positionLimit]);

  const rankedGoalies = useMemo(() => {
    return [...regularSeasonStats.goalieStats].sort((a, b) => b.wins - a.wins);
  }, [regularSeasonStats.goalieStats]);

  const rankedSkaters = useMemo(() => {
    return [...regularSeasonStats.skaterStats].sort((a, b) => b.points - a.points);
  }, [regularSeasonStats.skaterStats]);

  const handleSubmit = () => {
    setUserId(userId);
    setSubmittedTeam(teamIds);
    postData(submittedTeam);
  };

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

  let teamIds = {
    "owner": userId,
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

  const teamCountBadge = Object.entries(teamCount).map(team => {
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
          <Grid.Column style={{ maxHeight: '50vh', overflow: 'auto' }}>
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
          <Grid.Column style={{ maxHeight: '50vh', overflow: 'auto' }}>
            <Grid.Row textAlign="left">

              <h4>
                My Team
              </h4>
              {teamCountBadge}
            </Grid.Row>
            <Table singleLine unstackable basic='very' compact='very'>
              <Table.Header style={{ position: 'sticky', top: '0px', background: 'white', textAlign: 'left' }}>
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
              <Input
                placeholder='User ID'
                style={{ width: '250px' }}
                onChange={e => setUserId(e.target.value)}
                value={userId}
              >

              </Input>
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
                onClick={handleSubmit}
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