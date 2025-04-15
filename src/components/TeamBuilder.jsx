import React, { useState, useMemo } from 'react';
import { Button, Grid, Icon, Image, Input, Loader, Message, Segment, Table, Dropdown } from 'semantic-ui-react';
import useSubmitRoster from '../hooks/useSubmitRoster';

const teamLogoURL = `https://assets.nhle.com/logos/nhl/svg/`;
const playerHeadshotURL = `https://assets.nhle.com/mugs/nhl/20242025/`;

const TeamBuilder = ({ regularSeasonStats }) => {
  const [myTeam, setMyTeam] = useState([]);
  const [userId, setUserId] = useState('');
  const [teamIds, setTeamIds] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [positionFilter, setPositionFilter] = useState([]);
  const [teamFilter, setTeamFilter] = useState([]);
  const [nameSearch, setNameSearch] = useState('');

  const positionCounts = { R: 3, L: 3, C: 3, D: 4, G: 2 };
  const rosterPositions = ['C', 'C', 'C', 'L', 'L', 'L', 'R', 'R', 'R', 'D', 'D', 'D', 'D', 'G', 'G', 'U'];

  const { loading, error, response, postData } = useSubmitRoster();

  // Derived data using useMemo
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
    return positionLimit['L'] === 4 ||
      positionLimit['R'] === 4 ||
      positionLimit['C'] === 4 ||
      positionLimit['D'] === 5 ||
      positionLimit['G'] === 3
      ? 0
      : 1;
  }, [positionLimit]);

  // Filtered and sorted data
  const filteredGoalies = useMemo(() => {
    return regularSeasonStats.goalieStats
      .filter((player) => {
        const matchesPosition = positionFilter.length
          ? positionFilter.includes(player.positionCode)
          : true;
        const matchesTeam = teamFilter.length
          ? teamFilter.includes(player.teamAbbrevs.split(/[,]+/).pop())
          : true;
        const matchesName = nameSearch
          ? player.goalieFullName.toLowerCase().includes(nameSearch.toLowerCase())
          : true;
        return matchesPosition && matchesTeam && matchesName;
      })
      .sort((a, b) => b.wins - a.wins); // Sort by wins in descending order
  }, [regularSeasonStats.goalieStats, positionFilter, teamFilter, nameSearch]);

  const filteredSkaters = useMemo(() => {
    return regularSeasonStats.skaterStats
      .filter((player) => {
        const matchesPosition = positionFilter.length
          ? positionFilter.includes(player.positionCode)
          : true;
        const matchesTeam = teamFilter.length
          ? teamFilter.includes(player.teamAbbrevs.split(/[,]+/).pop())
          : true;
        const matchesName = nameSearch
          ? player.skaterFullName.toLowerCase().includes(nameSearch.toLowerCase())
          : true;
        return matchesPosition && matchesTeam && matchesName;
      })
      .sort((a, b) => b.points - a.points); // Sort by points in descending order
  }, [regularSeasonStats.skaterStats, positionFilter, teamFilter, nameSearch]);

  const updateTeamIds = () => {
    const remainingPlayers = [...myTeam]; // Copy of myTeam to track unassigned players
    const utilityPlayerIndex = [...remainingPlayers]
      .reverse() // Reverse the array to prioritize the last player added
      .findIndex((p) => {
        // Check if the player exceeds the position limit
        const positionCount = remainingPlayers.filter((player) => player.positionCode === p.positionCode).length;
        return positionCount > positionCounts[p.positionCode];
      });

    const utilityPlayer =
      utilityPlayerIndex !== -1
        ? remainingPlayers.splice(remainingPlayers.length - 1 - utilityPlayerIndex, 1)[0]
        : null;

    const newTeamIds = {
      owner: userId,
      center: remainingPlayers
        .filter((p) => p.positionCode === 'C')
        .map((p) => p.playerId),
      left: remainingPlayers
        .filter((p) => p.positionCode === 'L')
        .map((p) => p.playerId),
      right: remainingPlayers
        .filter((p) => p.positionCode === 'R')
        .map((p) => p.playerId),
      defense: remainingPlayers
        .filter((p) => p.positionCode === 'D')
        .map((p) => p.playerId),
      goalie: remainingPlayers
        .filter((p) => p.positionCode === 'G')
        .map((p) => p.playerId),
      utility: utilityPlayer ? [utilityPlayer.playerId] : [], // Add only the utility player
    };

    setTeamIds(newTeamIds); // Update the teamIds state
  };

  useMemo(() => {
    updateTeamIds();
  }, [myTeam, userId]);

  const handleSubmit = async () => {
    setSubmissionStatus('processing'); // Set status to processing
    try {
      await postData(teamIds); // Submit the teamIds
      setSubmissionStatus('success'); // Set status to success
    } catch (error) {
      console.error('Submission failed:', error);
      setSubmissionStatus('error'); // Set status to error
    }
  };

  const renderFeedback = () => {
    if (submissionStatus === 'processing') {
      return (
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Submitting...</Message.Header>
            Your roster is being submitted. Please wait.
          </Message.Content>
        </Message>
      );
    }

    if (submissionStatus === 'success') {
      return (
        <Message positive>
          <Message.Header>Submission Successful</Message.Header>
          Your roster has been submitted successfully!
        </Message>
      );
    }

    if (submissionStatus === 'error') {
      return (
        <Message negative>
          <Message.Header>Submission Failed</Message.Header>
          There was an error submitting your roster. Please ensure your User ID matches the provided ID.
        </Message>
      );
    }

    return null; // No feedback when idle
  };

  const togglePlayer = (player) => {
    setMyTeam((prevTeam) =>
      prevTeam.includes(player) ? prevTeam.filter((p) => p !== player) : [...prevTeam, player]
    );
  };

  const renderPlayerRow = (player, isDisabled) => (
    <Table.Row key={player.playerId}>
      <Table.Cell>
        <Button
          icon
          disabled={isDisabled}
          color={myTeam.includes(player) ? 'blue' : null}
          onClick={() => togglePlayer(player)}
        >
          <Icon name='check' />
        </Button>
      </Table.Cell>
      <Table.Cell>{player.positionCode}</Table.Cell>
      <Table.Cell>
        <Image
          avatar
          size='mini'
          src={`${playerHeadshotURL}${player.teamAbbrevs.split(/[,]+/).pop()}/${player.playerId}.png`}
          alt={player.positionCode === 'G'
            ? `${player.goalieFullName} Headshot`
            : `${player.skaterFullName} Headshot`}
        />
        {player.positionCode === 'G'
          ? player.goalieFullName
          : player.skaterFullName}
      </Table.Cell>
      <Table.Cell>
        <Image
          avatar
          size='mini'
          src={`${teamLogoURL}${player.teamAbbrevs.split(/[,]+/).pop()}_light.svg`}
          alt={`${player.teamAbbrevs} Logo`}
        />
        {player.teamAbbrevs.split(/[,]+/).pop()}
      </Table.Cell>
      <Table.Cell>
        {player.positionCode === 'G'
          ? `GP: ${player.gamesPlayed} W: ${player.wins} L: ${player.losses} OTL: ${player.otLosses}`
          : `GP: ${player.gamesPlayed} G: ${player.goals} A: ${player.assists} P: ${player.points}`}
      </Table.Cell>
    </Table.Row>
  );

  const rosterPlayerRows = (() => {
    const remainingPlayers = [...myTeam]; // Copy of myTeam to track unassigned players

    return rosterPositions.map((position, index) => {
      // Handle utility ('U') position separately
      if (position === 'U') {
        // Find the first player who has hit the position limit
        const utilityPlayerIndex = remainingPlayers.findIndex(
          (p) => positionLimit[p.positionCode] >= positionCounts[p.positionCode]
        );
        const utilityPlayer =
          utilityPlayerIndex !== -1 ? remainingPlayers.splice(utilityPlayerIndex, 1)[0] : null;

        return (
          <Table.Row key={index}>
            <Table.Cell>
              <Button
                icon
                color={!utilityPlayer ? 'grey' : 'red'}
                onClick={() => setMyTeam(myTeam.filter((p) => p !== utilityPlayer))}
                disabled={!utilityPlayer} // Disable button if no utility player exists
              >
                <Icon name='trash' />
              </Button>
            </Table.Cell>
            <Table.Cell>U</Table.Cell>
            <Table.Cell>
              {utilityPlayer ? (
                <Image
                  avatar
                  size='mini'
                  src={`${playerHeadshotURL}${utilityPlayer.teamAbbrevs.split(/[,]+/).pop()}/${utilityPlayer.playerId
                    }.png`}
                  alt={
                    utilityPlayer.positionCode === 'G'
                      ? `${utilityPlayer.goalieFullName} Headshot`
                      : `${utilityPlayer.skaterFullName} Headshot`
                  }
                />
              ) : null}
              {utilityPlayer
                ? utilityPlayer.positionCode === 'G'
                  ? utilityPlayer.goalieFullName
                  : utilityPlayer.skaterFullName
                : ''}
            </Table.Cell>
            <Table.Cell>
              {utilityPlayer ? (
                <Image
                  avatar
                  size='mini'
                  src={`${teamLogoURL}${utilityPlayer.teamAbbrevs.split(/[,]+/).pop()}_light.svg`}
                  alt={`${utilityPlayer.teamAbbrevs} Logo`}
                />
              ) : null}
              {utilityPlayer ? utilityPlayer.teamAbbrevs.split(/[,]+/).pop() : ''}
            </Table.Cell>
            <Table.Cell>
              {utilityPlayer
                ? utilityPlayer.positionCode === 'G'
                  ? `GP: ${utilityPlayer.gamesPlayed} W: ${utilityPlayer.wins} L: ${utilityPlayer.losses} OTL: ${utilityPlayer.otLosses}`
                  : `GP: ${utilityPlayer.gamesPlayed} G: ${utilityPlayer.goals} A: ${utilityPlayer.assists} P: ${utilityPlayer.points}`
                : ''}
            </Table.Cell>
          </Table.Row>
        );
      }

      // Handle regular positions
      const playerIndex = remainingPlayers.findIndex((p) => p.positionCode === position);
      const player = playerIndex !== -1 ? remainingPlayers.splice(playerIndex, 1)[0] : null;

      return (
        <Table.Row key={index}>
          <Table.Cell>
            <Button
              icon
              color={!player ? 'grey' : 'red'}
              onClick={() => setMyTeam(myTeam.filter((p) => p !== player))}
              disabled={!player} // Disable button if no player exists for this position
            >
              <Icon name='trash' />
            </Button>
          </Table.Cell>
          <Table.Cell>{position}</Table.Cell>
          <Table.Cell>
            {player ? (
              <Image
                avatar
                size='mini'
                src={`${playerHeadshotURL}${player.teamAbbrevs.split(/[,]+/).pop()}/${player.playerId}.png`}
                alt={
                  player.positionCode === 'G'
                    ? `${player.goalieFullName} Headshot`
                    : `${player.skaterFullName} Headshot`
                }
              />
            ) : null}
            {player && player.positionCode === 'G'
              ? player.goalieFullName
              : player
                ? player.skaterFullName
                : ''}
          </Table.Cell>
          <Table.Cell>
            {player ? (
              <Image
                avatar
                size='mini'
                src={`${teamLogoURL}${player.teamAbbrevs.split(/[,]+/).pop()}_light.svg`}
                alt={`${player.teamAbbrevs} Logo`}
              />
            ) : null}
            {player ? player.teamAbbrevs.split(/[,]+/).pop() : ''}
          </Table.Cell>
          <Table.Cell>
            {player
              ? player.positionCode === 'G'
                ? `GP: ${player.gamesPlayed} W: ${player.wins} L: ${player.losses} OTL: ${player.otLosses}`
                : `GP: ${player.gamesPlayed} G: ${player.goals} A: ${player.assists} P: ${player.points}`
              : ''}
          </Table.Cell>
        </Table.Row>
      );
    });
  })();

  // Dropdown options for filters
  const positionOptions = [
    { key: 'C', text: 'C', value: 'C' },
    { key: 'L', text: 'L', value: 'L' },
    { key: 'R', text: 'R', value: 'R' },
    { key: 'D', text: 'D', value: 'D' },
    { key: 'G', text: 'G', value: 'G' },
  ];

  const teamOptions = useMemo(() => {
    const teams = Array.from(
      new Set([
        ...regularSeasonStats.goalieStats.map((player) => player.teamAbbrevs.split(/[,]+/).pop()),
        ...regularSeasonStats.skaterStats.map((player) => player.teamAbbrevs.split(/[,]+/).pop()),
      ])
    );
    return teams.map((team) => ({
      key: team,
      text: team,
      value: team,
      image: { avatar: true, src: `${teamLogoURL}${team}_light.svg` }, // Add team logo
    }));
  }, [regularSeasonStats]);

  return (
    <Segment>
      <Grid columns={2} stackable >
        <Grid.Row>
          <Grid.Column>
            <h3>Team Builder</h3>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid columns={2} stackable>
        <Grid.Row>
          {/* Available Players */}
          <Grid.Column style={{ maxHeight: '72vh', overflow: 'auto' }}>
            <Grid stackable style={{ position: 'sticky', top: 0, zIndex: 10, background: 'white', marginBottom: '10px' }}>
              <h4>Available Players </h4>
              <Grid.Row columns={3}>
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
                    renderLabel={(item) => ({
                      content: (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Image
                            src={item.image.src}
                            avatar
                            style={{ width: '16px', height: '16px', marginRight: '5px' }} // Smaller size for the chip
                          />
                          <span>{item.text}</span>
                        </div>
                      ),
                      style: {
                        display: 'inline-flex', // Ensure chips are inline
                        alignItems: 'center',
                        margin: '2px', // Add spacing between chips
                        padding: '4px 8px', // Compact padding for the chip
                        borderRadius: '4px', // Rounded corners for the chip
                        background: '#f1f1f1', // Optional: Light background for better visibility
                      },
                    })}
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
            {regularSeasonStats.loading ? (
              <Loader active inline="centered" size="medium">
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
                  {filteredGoalies.map((goalie) =>
                    renderPlayerRow(
                      goalie,
                      positionLimit[goalie.positionCode] >= positionCounts[goalie.positionCode] + utilityBonus &&
                      !myTeam.includes(goalie)
                    )
                  )}
                  {filteredSkaters.map((skater) =>
                    renderPlayerRow(
                      skater,
                      positionLimit[skater.positionCode] >= positionCounts[skater.positionCode] + utilityBonus &&
                      !myTeam.includes(skater)
                    )
                  )}
                </Table.Body>
              </Table>
            )}
          </Grid.Column>
          {/* My Team */}
          <Grid.Column style={{ maxHeight: '72vh', overflow: 'auto' }}>
            <Grid stackable style={{ position: 'sticky', top: 0, zIndex: 10, background: 'white', marginBottom: '10px' }}>
              <h4>My Team</h4>
              <Grid.Row>
                <Grid.Column>
                  <Input
                    placeholder='User ID'
                    style={{ maxWidth: '40vw' }}
                    onChange={(e) => setUserId(e.target.value)}
                    value={userId}
                    maxLength='24'
                  />
                  <Button.Group size='small' floated='right'>
                    <Button color='red' disabled={myTeam.length === 0} onClick={() => setMyTeam([])}>
                      Clear
                    </Button>
                    <Button color='green' disabled={myTeam.length < 16 || userId.length < 24} onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Button.Group>
                  {renderFeedback()}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Button.Group size='small'>
                    <Button color='blue'>
                      {myTeam.length} / 16 Players
                    </Button>
                    {Object.entries(teamCount).map(([team, count]) => (
                      <Button key={team}>
                        <Image avatar src={`${teamLogoURL}${team}_light.svg`} />
                        {count}
                      </Button>
                    ))}
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Table singleLine unstackable basic='very' compact='very'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Remove</Table.HeaderCell>
                  <Table.HeaderCell>Position</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Team</Table.HeaderCell>
                  <Table.HeaderCell>Stats</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{rosterPlayerRows}</Table.Body>
            </Table>

          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default TeamBuilder;