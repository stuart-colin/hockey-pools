import React, { useReducer, useMemo, useCallback, useState, useEffect } from 'react';
import { Grid, Segment, Header, Icon, Button } from 'semantic-ui-react';
import { useAuth0 } from '@auth0/auth0-react';
import useSubmitRoster from '../../hooks/useSubmitRoster';
import useMyTeam from '../../hooks/useMyTeam';
import {
  calculatePositionLimits,
  calculateTeamCount,
  calculateUtilityBonus,
  buildTeamIds,
} from '../../utils/teambuilder';
import AvailablePlayersTable from './TeamBuilder.AvailablePlayersTable';
import RosterTable from './TeamBuilder.RosterTable';

const initialState = {
  myTeam: [],
  submittedTeam: {},
  userId: '',
  filterPosition: [],
  filterTeam: [],
  filterName: '',
  isLoading: false,
  submissionStatus: 'idle',
};

const teamBuilderReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PLAYER':
      return { ...state, myTeam: [...state.myTeam, action.payload] };
    case 'REMOVE_PLAYER':
      return {
        ...state,
        myTeam: state.myTeam.filter((p) => p.playerId !== action.payload),
      };
    case 'SET_FILTER_POSITION':
      return { ...state, filterPosition: action.payload };
    case 'SET_FILTER_TEAM':
      return { ...state, filterTeam: action.payload };
    case 'SET_FILTER_NAME':
      return { ...state, filterName: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SUBMISSION_STATUS':
      return { ...state, submissionStatus: action.payload };
    case 'SET_SUBMITTED_TEAM':
      return { ...state, submittedTeam: action.payload };
    case 'SET_USER_ID':
      return { ...state, userId: action.payload };
    case 'RESET_TEAM':
      return { ...initialState };
    default:
      return state;
  }
};

const TeamBuilder = ({ regularSeasonStats, rosterDataEndpoint }) => {
  const [state, dispatch] = useReducer(teamBuilderReducer, initialState);
  const { user, isAuthenticated } = useAuth0();
  const { postData } = useSubmitRoster();
  const rosterLoaded = React.useRef(false);

  // Initialize userId from Auth0 user
  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      // Extract the user ID from Auth0 sub (format: auth0|userid)
      const userIdFromAuth = user.sub.split('|').pop();
      dispatch({ type: 'SET_USER_ID', payload: userIdFromAuth });
    }
  }, [isAuthenticated, user]);

  // Load existing roster from database (only once)
  const { roster } = useMyTeam(rosterDataEndpoint);

  useEffect(() => {
    if (roster && roster.center && regularSeasonStats.skaterStats && regularSeasonStats.goalieStats && !rosterLoaded.current) {
      rosterLoaded.current = true;
      // Combine all stats for lookup
      const allPlayers = [...regularSeasonStats.skaterStats, ...regularSeasonStats.goalieStats];

      // Get all NHL IDs from roster (extract nhl_id from player objects)
      const nhlIds = [
        ...roster.center.map(p => p.nhl_id),
        ...roster.left.map(p => p.nhl_id),
        ...roster.right.map(p => p.nhl_id),
        ...roster.defense.map(p => p.nhl_id),
        ...roster.goalie.map(p => p.nhl_id),
        ...(roster.utility && roster.utility.nhl_id ? [roster.utility.nhl_id] : []),
      ];

      // Look up each player in available stats and add to team
      nhlIds.forEach((nhlId) => {
        const playerData = allPlayers.find((p) => p.playerId === nhlId);
        if (playerData) {
          dispatch({ type: 'ADD_PLAYER', payload: playerData });
        }
      });
    }
  }, [roster]);

  const positionLimits = useMemo(
    () => calculatePositionLimits(state.myTeam),
    [state.myTeam]
  );

  const teamCount = useMemo(
    () => calculateTeamCount(state.myTeam),
    [state.myTeam]
  );

  const utilityBonus = useMemo(
    () => calculateUtilityBonus(positionLimits),
    [positionLimits]
  );

  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleAddPlayer = useCallback((player) => {
    dispatch({ type: 'ADD_PLAYER', payload: player });
  }, []);

  const handleRemovePlayer = useCallback((playerId) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: playerId });
  }, []);

  const handlePositionFilterChange = useCallback((position) => {
    dispatch({ type: 'SET_FILTER_POSITION', payload: position });
  }, []);

  const handleTeamFilterChange = useCallback((team) => {
    dispatch({ type: 'SET_FILTER_TEAM', payload: team });
  }, []);

  const handleNameFilterChange = useCallback((name) => {
    dispatch({ type: 'SET_FILTER_NAME', payload: name });
  }, []);

  const handleSubmitRoster = useCallback(async () => {
    dispatch({ type: 'SET_SUBMISSION_STATUS', payload: 'processing' });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Use the userId from state that was set from Auth0 in useEffect
      const teamIds = buildTeamIds(state.myTeam, state.userId);
      dispatch({ type: 'SET_SUBMITTED_TEAM', payload: teamIds });
      await postData(teamIds);
      dispatch({ type: 'SET_SUBMISSION_STATUS', payload: 'success' });
    } catch (error) {
      dispatch({ type: 'SET_SUBMISSION_STATUS', payload: 'error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state, postData]);

  const handlePlayerToggle = useCallback((player) => {
    const isSelected = state.myTeam.some((p) => p.playerId === player.playerId);
    if (isSelected) {
      handleRemovePlayer(player.playerId);
    } else {
      handleAddPlayer(player);
    }
  }, [state.myTeam, handleRemovePlayer, handleAddPlayer]);

  const handleClearTeam = useCallback(() => {
    dispatch({ type: 'RESET_TEAM' });
  }, []);

  // Direct button click handler
  const handleSubmitClick = () => {
    handleSubmitRoster();
  };

  return (
    <Segment.Group>
      <Segment attached="top">
        <Grid columns={3} verticalAlign='middle'>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column />
            <Grid.Column verticalAlign='middle' textAlign='center'>
              <Header as='h3' color='blue' style={{ whiteSpace: 'nowrap' }}>Team Builder</Header>
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <Button
                basic={!filtersVisible}
                color="blue"
                icon
                onClick={() => setFiltersVisible(!filtersVisible)}
                size='mini'
              >
                <Icon name="filter" />
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment attached="bottom">
        <Grid columns={2} stackable>
          <Grid.Row>
            <Grid.Column>
              <AvailablePlayersTable
                goalieStats={regularSeasonStats.goalieStats || []}
                skaterStats={regularSeasonStats.skaterStats || []}
                loading={regularSeasonStats.loading}
                filtersVisible={filtersVisible}
                nameSearch={state.filterName}
                onNameSearchChange={handleNameFilterChange}
                teamFilter={state.filterTeam}
                onTeamFilterChange={(teams) =>
                  dispatch({
                    type: 'SET_FILTER_TEAM',
                    payload: teams,
                  })
                }
                positionFilter={state.filterPosition}
                onPositionFilterChange={(positions) =>
                  dispatch({
                    type: 'SET_FILTER_POSITION',
                    payload: positions,
                  })
                }
                myTeam={state.myTeam}
                positionLimit={positionLimits}
                utilityBonus={utilityBonus}
                onPlayerToggle={handlePlayerToggle}
              />
            </Grid.Column>
            <Grid.Column>
              <RosterTable
                myTeam={state.myTeam}
                teamCount={teamCount}
                submissionStatus={state.submissionStatus}
                teamIds={state.submittedTeam}
                onClearTeam={handleClearTeam}
                onRemovePlayer={(player) => handleRemovePlayer(player?.playerId)}
                onSubmit={handleSubmitClick}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Segment.Group>
  );
};

export default TeamBuilder;
