import React, { useReducer, useMemo, useCallback, useState, useEffect } from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import { useAuth0 } from '@auth0/auth0-react';
import useSubmitRoster from '../../hooks/useSubmitRoster';
import useMyTeam from '../../hooks/useMyTeam';
import {
  calculatePositionLimits,
  calculateTeamCount,
  calculateUtilityBonus,
  buildTeamIds,
} from '../../utils/teambuilder';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import SignInNotice from '../SignInNotice';
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
  const { isMobile } = useBreakpoint();
  const [state, dispatch] = useReducer(teamBuilderReducer, initialState);
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth0();
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
    // Wait for BOTH the roster fetch and the season stats fetch to actually
    // produce data. The stats arrays are initialized to [] (truthy!), so a
    // simple `&&` check fired prematurely when the roster arrived first —
    // hydration ran with an empty player pool, matched nothing, then set the
    // ref so it never re-hydrated when stats actually arrived.
    const skaterStats = regularSeasonStats.skaterStats || [];
    const goalieStats = regularSeasonStats.goalieStats || [];
    const statsReady =
      !regularSeasonStats.loading && (skaterStats.length > 0 || goalieStats.length > 0);

    if (roster && roster.center && statsReady && !rosterLoaded.current) {
      rosterLoaded.current = true;
      const allPlayers = [...skaterStats, ...goalieStats];

      const nhlIds = [
        ...roster.center.map(p => p.nhl_id),
        ...roster.left.map(p => p.nhl_id),
        ...roster.right.map(p => p.nhl_id),
        ...roster.defense.map(p => p.nhl_id),
        ...roster.goalie.map(p => p.nhl_id),
        ...(roster.utility && roster.utility.nhl_id ? [roster.utility.nhl_id] : []),
      ];

      nhlIds.forEach((nhlId) => {
        const playerData = allPlayers.find((p) => p.playerId === nhlId);
        if (playerData) {
          dispatch({ type: 'ADD_PLAYER', payload: playerData });
        }
      });
    }
  }, [roster,
    regularSeasonStats.goalieStats,
    regularSeasonStats.loading,
    regularSeasonStats.skaterStats,
  ]);

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
    // Bail out if Auth0 hasn't populated the user id yet — submitting with an
    // empty owner was causing rosters to be persisted with owner:null.
    if (!state.userId) {
      console.warn('Skipping submit: userId not ready');
      return;
    }

    dispatch({ type: 'SET_SUBMISSION_STATUS', payload: 'processing' });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
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

  const handleDismissFeedback = useCallback(() => {
    dispatch({ type: 'SET_SUBMISSION_STATUS', payload: 'idle' });
  }, []);

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

  const rosterTableProps = {
    canSubmit: !!state.userId,
    myTeam: state.myTeam,
    onClearTeam: handleClearTeam,
    onDismissStatus: handleDismissFeedback,
    onRemovePlayer: (player) => handleRemovePlayer(player?.playerId),
    onSubmit: handleSubmitClick,
    submissionStatus: state.submissionStatus,
    teamCount,
    teamIds: state.submittedTeam,
  };

  const availablePlayersTable = (
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
      onFiltersToggle={() => setFiltersVisible(!filtersVisible)}
    />
  );

  if (!isAuthLoading && !isAuthenticated) {
    return (
      <SignInNotice
        message='Use the sign-in button to create an account or log in, then come back to pick your playoff roster.'
        title='Sign in to build your team'
      />
    );
  }

  return (
    <Segment.Group className='team-builder-page'>
      <Segment>
        {/*
          On mobile, RosterTable is position:fixed (drawer) — it leaves the 2nd Grid.Column empty
          in normal flow (~50% blank). Single-column grid + RosterTable outside the grid fixes it.
        */}
        <Grid columns={isMobile ? 1 : 2} stackable>
          <Grid.Row>
            <Grid.Column>{availablePlayersTable}</Grid.Column>
            {!isMobile && (
              <Grid.Column>
                <RosterTable {...rosterTableProps} />
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
        {isMobile && <RosterTable {...rosterTableProps} />}
      </Segment>
    </Segment.Group>
  );
};

export default TeamBuilder;
