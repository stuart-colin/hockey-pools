import React, { useState, useMemo } from 'react';
import {
  Grid,
  Header,
  Loader,
  Segment,
  Statistic,
} from 'semantic-ui-react';
import { min, max, mean, customSort } from '../../utils/stats';
import useUnselectedPlayers from '../../hooks/useUnselectedPlayers';
import {
  buildPlayerPickRate,
  buildBestTeam,
  buildCommonTeam,
  calculateTeamStats,
  getPickRateRange,
  getMostPickedPlayers,
  getTopPlayersByPoints,
  getBottomPlayersByPoints,
  getPlayersByPickRateThreshold,
  calculatePoolStats,
  getTopEliminatedPlayers,
  calculatePositionPointsBreakdown,
  calculateSunkCosts,
  calculateClutchFactor,
  calculateRosterDiversity,
  getBonusHunters,
  getLoneWolves,
} from '../../utils/insightCalculations';
import {
  DEFAULT_HIGH_THRESHOLD,
  DEFAULT_LOW_THRESHOLD,
  ROSTER_LIMITS,
  INSIGHT_COLORS,
  TOP_N,
} from '../../constants/insights';
import PoolOverview from './Insights.PoolOverview';
import TeamCompositionPanel from './Insights.TeamCompositionPanel';
import HitsAndMisses from './Insights.HitsAndMisses';
import ValueAnalysis from './Insights.ValueAnalysis';
import DraftDaySnapshot from './Insights.DraftDaySnapshot';
import EliminationImpact from './Insights.EliminationImpact';
import XFactors from './Insights.XFactors';
import { useEliminatedTeamsContext } from '../../context/EliminatedTeamsContext';
import './Insights.Sections.css';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const insightsSectionsLayoutStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
};

const Insights = ({
  players,
  regularSeasonStats,
  season,
  users
}) => {
  const [highThresh, setHighThresh] = useState(DEFAULT_HIGH_THRESHOLD);
  const [lowThresh, setLowThresh] = useState(DEFAULT_LOW_THRESHOLD);

  const { isMobile } = useBreakpoint();

  const { eliminatedTeams } = useEliminatedTeamsContext();
  const { unselectedPlayers, loadingUnselected } = useUnselectedPlayers(players, season, eliminatedTeams);
  const loading = users.loading || loadingUnselected;

  const playerPickRate = useMemo(() => buildPlayerPickRate(players, users.rosters.length), [players, users.rosters.length]);

  const poolStats = useMemo(() => calculatePoolStats(users.rosters, min, max, mean), [users.rosters]);

  const {
    mostPlayersRemaining,
    averagePlayersRemaining,
    medianPlayersRemaining,
    q1PlayersRemaining,
    q3PlayersRemaining,
    leastPlayersRemaining,
    mostPoints,
    averagePoints,
    medianPoints,
    q1Points,
    q3Points,
    leastPoints,
  } = poolStats;

  const mostPickedPlayersList = useMemo(() => getMostPickedPlayers(playerPickRate, TOP_N.MOST_PICKS), [playerPickRate]);

  const bestTeam = useMemo(() => buildBestTeam(playerPickRate), [playerPickRate]);
  const { points: bestPoints, remaining: bestRemaining } = useMemo(() => calculateTeamStats(bestTeam), [bestTeam]);

  const commonTeam = useMemo(() => buildCommonTeam(playerPickRate), [playerPickRate]);
  const { points: commonPoints, remaining: commonRemaining } = useMemo(() => calculateTeamStats(commonTeam), [commonTeam]);

  const topPlayersList = useMemo(() => getTopPlayersByPoints(playerPickRate, TOP_N.BEST_PICKS), [playerPickRate]);

  const bottomPlayersList = useMemo(() => getBottomPlayersByPoints(playerPickRate, TOP_N.WORST_PICKS), [playerPickRate]);

  const bestByPickThresholdList = useMemo(
    () => getPlayersByPickRateThreshold(playerPickRate, highThresh, 'below', TOP_N.MOST_ADVANTAGEOUS),
    [playerPickRate, highThresh]
  );

  const { min: highThreshMin, max: highThreshMax } = useMemo(() => getPickRateRange(playerPickRate), [playerPickRate]);

  const worstByPickThresholdList = useMemo(
    () => getPlayersByPickRateThreshold(playerPickRate, lowThresh, 'above', TOP_N.LEAST_ADVANTAGEOUS),
    [playerPickRate, lowThresh]
  );

  const { min: lowThreshMin, max: lowThreshMax } = useMemo(() => getPickRateRange(playerPickRate), [playerPickRate]);

  // Elimination Impact Analytics
  const eliminatedPlayersList = useMemo(() => getTopEliminatedPlayers(playerPickRate, TOP_N.BEST_PICKS), [playerPickRate]);

  const positionPointsData = useMemo(() => calculatePositionPointsBreakdown(playerPickRate), [playerPickRate]);

  const sunkCostData = useMemo(() => calculateSunkCosts(users.rosters, eliminatedTeams), [users.rosters, eliminatedTeams]);

  // New Analytics
  const clutchFactorData = useMemo(() => calculateClutchFactor(playerPickRate, regularSeasonStats), [playerPickRate, regularSeasonStats]);
  const rosterDiversityData = useMemo(() => calculateRosterDiversity(users.rosters), [users.rosters]);
  const bonusHuntersList = useMemo(() => getBonusHunters(playerPickRate, TOP_N.BEST_PICKS), [playerPickRate]);
  const loneWolvesList = useMemo(() => getLoneWolves(playerPickRate, TOP_N.BEST_PICKS), [playerPickRate]);

  const topPlayerGainers = useMemo(() => {
    if (!players || players.length === 0) return [];
    return [...players]
      .filter(p => p._delta?.points > 0)
      .sort((a, b) => (b._delta?.points || 0) - (a._delta?.points || 0))
      .slice(0, TOP_N.BEST_PICKS);
  }, [players]);

  const renderStatistics = (players, color) => {
    return players.map((player) => (
      <Statistic
        color={player.isEliminated ? INSIGHT_COLORS.ELIMINATED : color}
        horizontal
        key={player.id}
        label={`${player.name} (${player.pickCount})`}
        value={player.points}
      />
    ));
  };

  const getTeamByPosition = (team, positionLabel) => {
    const positionMap = {
      'Left': 'L',
      'Center': 'C',
      'Right': 'R',
      'Defense': 'D',
      'Goalie': 'G'
    };

    const posCode = positionMap[positionLabel];

    if (posCode) {
      return team.filter(p => p.position === posCode).slice(0, ROSTER_LIMITS[posCode]);
    }

    const positionCounts = { L: 0, C: 0, R: 0, D: 0, G: 0 };
    const utilityPlayers = [];

    for (const player of team) {
      const pos = player.position;
      if (positionCounts[pos] !== undefined && positionCounts[pos] < ROSTER_LIMITS[pos]) {
        positionCounts[pos]++;
      } else {
        utilityPlayers.push(player);
      }
    }

    return utilityPlayers;
  };

  const topUnselectedPlayers = useMemo(() => {
    if (!unselectedPlayers || unselectedPlayers.length === 0) {
      return [];
    }
    return customSort([...unselectedPlayers], 'points').slice(0, TOP_N.BEST_UNSELECTED);
  }, [unselectedPlayers]);

  return (
    <Segment.Group>
      <Segment attached='bottom' className={'insights-container'}>
        {loading ? (
          <Loader active inline='centered' size='large'>
            Loading Insights...
          </Loader>
        ) : (
          <div style={insightsSectionsLayoutStyle}>
            {/* Section 1: Pool Overview */}
            <section className='insights-section'>
              <Header as='h3' dividing>
                The Field
              </Header>
              <PoolOverview
                mostPlayersRemaining={mostPlayersRemaining}
                averagePlayersRemaining={averagePlayersRemaining}
                medianPlayersRemaining={medianPlayersRemaining}
                q1PlayersRemaining={q1PlayersRemaining}
                q3PlayersRemaining={q3PlayersRemaining}
                leastPlayersRemaining={leastPlayersRemaining}
                mostPoints={mostPoints}
                averagePoints={averagePoints}
                medianPoints={medianPoints}
                q1Points={q1Points}
                q3Points={q3Points}
                leastPoints={leastPoints}
              />
            </section>

            {/* Section 2: Hits & Misses */}
            <HitsAndMisses
              bottomPlayersList={bottomPlayersList}
              topPlayerGainers={topPlayerGainers}
              topPlayersList={topPlayersList}
              topUnselectedPlayers={topUnselectedPlayers}
              usersRostersLength={users.rosters.length}
            />

            {/* Section 3: Value Analysis and Position Breakdown */}
            <ValueAnalysis
              bestByPickThresholdList={bestByPickThresholdList}
              highThresh={highThresh}
              highThreshMax={highThreshMax}
              highThreshMin={highThreshMin}
              lowThresh={lowThresh}
              lowThreshMax={lowThreshMax}
              lowThreshMin={lowThreshMin}
              positionPointsData={positionPointsData}
              setHighThresh={setHighThresh}
              setLowThresh={setLowThresh}
              usersRostersLength={users.rosters.length}
              worstByPickThresholdList={worstByPickThresholdList}
            />

            {/* Section 4: Draft Day Snapshot */}
            <DraftDaySnapshot
              mostPickedPlayersList={mostPickedPlayersList}
              rosterDiversityData={rosterDiversityData}
              usersRostersLength={users.rosters.length}
            />

            {/* Section 5: Team Composition */}
            <section className='insights-section'>
              <Header as='h3' dividing>
                The Dream vs. The Reality
              </Header>
              <Grid columns={2} className='team-composition-grid' stackable>
                <Grid.Column>
                  <TeamCompositionPanel
                    title='The Dream Team'
                    tooltip='The best possible roster you could have built with the top-scoring players at each position.'
                    teamPoints={bestPoints}
                    teamRemaining={bestRemaining}
                    team={bestTeam}
                    renderStatistics={renderStatistics}
                    getTeamByPosition={getTeamByPosition}
                    color={INSIGHT_COLORS.PERFECT_TEAM}
                  />
                </Grid.Column>
                <Grid.Column>
                  <TeamCompositionPanel
                    title='The Favorite Team'
                    tooltip='The roster built from the most commonly selected player at each position—what the pool collectively favored.'
                    teamPoints={commonPoints}
                    teamRemaining={commonRemaining}
                    team={commonTeam}
                    renderStatistics={renderStatistics}
                    getTeamByPosition={getTeamByPosition}
                    color={INSIGHT_COLORS.MOST_COMMON_TEAM}
                  />
                </Grid.Column>
              </Grid>
            </section>

            {/* Section 6: Elimination Impact */}
            <EliminationImpact
              eliminatedPlayersList={eliminatedPlayersList}
              sunkCostData={sunkCostData}
              usersRostersLength={users.rosters.length}
            />

            {/* Section 7: X Factors */}
            <XFactors
              bonusHuntersList={bonusHuntersList}
              clutchFactorData={clutchFactorData}
              isMobile={isMobile}
              loneWolvesList={loneWolvesList}
              regularSeasonStats={regularSeasonStats}
              usersRostersLength={users.rosters.length}
            />
          </div>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default Insights;
