import React, { useState, useMemo } from 'react';
import {
  Grid,
  Header,
  Loader,
  Segment,
  Statistic,
  Card,
  Icon,
  Popup,
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
  calculatePositionEliminionImpact,
} from '../../utils/insightCalculations';
import {
  DEFAULT_HIGH_THRESHOLD,
  DEFAULT_LOW_THRESHOLD,
  ROSTER_LIMITS,
  TOTAL_ROSTER_SIZE,
  INSIGHT_COLORS,
  TOP_N,
} from '../../constants/insights';
import PoolOverview from './Insights.PoolOverview';
import PlayerInsightTable from './Insights.PlayerInsightTable';
import ThresholdControl from './Insights.ThresholdControl';
import TeamCompositionPanel from './Insights.TeamCompositionPanel';
import '../../css/customStyle.css';
import './Insights.Sections.css';

const Insights = ({ users, players, season, eliminatedTeams }) => {
  const [highThresh, setHighThresh] = useState(DEFAULT_HIGH_THRESHOLD);
  const [lowThresh, setLowThresh] = useState(DEFAULT_LOW_THRESHOLD);

  const { unselectedPlayers, loadingUnselected } = useUnselectedPlayers(players, season, eliminatedTeams);
  const loading = users.loading || loadingUnselected;

  const userPlayersRemaining = useMemo(() => users.rosters.map(u => u.playersRemaining), [users.rosters]);
  const userPoints = useMemo(() => users.rosters.map(u => u.points), [users.rosters]);

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

  const positionImpactData = useMemo(() => calculatePositionEliminionImpact(playerPickRate), [playerPickRate]);

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
      <Segment attached='top'>
        <Grid>
          <Grid.Column width={2} />
          <Grid.Column textAlign='center' width={12}>
            <Header size='medium' color='blue'>
              Insights
            </Header>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached='bottom' className={'insights-container'}>
        {loading ? (
          <Loader active inline='centered' size='large'>
            Loading Insights...
          </Loader>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Section 1: Pool Overview */}
            <section className='insights-section'>
              <Header as='h3' dividing>
                Pool Overview
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

            {/* Section 2: Most Common Picks */}
            <section className='insights-section'>
              <Header as='h3' dividing>
                Pick Analysis
              </Header>
              <Grid columns={3} stackable className='pick-analysis-grid'>
                {/* Most Picked */}
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Most Common Picks
                        <Popup
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                          content='Players selected most frequently'
                          size='small'
                        />
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <PlayerInsightTable
                        players={mostPickedPlayersList}
                        color={INSIGHT_COLORS.MOST_PICKS}
                        showPercentage={true}
                        totalTeams={users.rosters.length}
                      />
                    </Card.Content>
                  </Card>
                </Grid.Column>

                {/* Best Picks */}
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Best Scoring Picks
                        <Popup
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                          content='Players with highest points'
                          size='small'
                        />
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <PlayerInsightTable
                        players={topPlayersList}
                        color={INSIGHT_COLORS.BEST_PICKS}
                        showPercentage={true}
                        totalTeams={users.rosters.length}
                      />
                    </Card.Content>
                  </Card>
                </Grid.Column>

                {/* Worst Picks */}
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Worst Scoring Picks
                        <Popup
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                          content='Players with lowest points'
                          size='small'
                        />
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <PlayerInsightTable
                        players={bottomPlayersList}
                        color={INSIGHT_COLORS.WORST_PICKS}
                        showPercentage={true}
                        totalTeams={users.rosters.length}
                      />
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid>
            </section>

            {/* Section 3 & 4: Value Analysis and Unselected Opportunities */}
            <section className='insights-section'>
              <Header as='h3' dividing>
                Value Analysis & Opportunities
              </Header>
              <Grid stackable columns={3}>
                {/* Most Advantageous Picks (Column 1) */}
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Most Advantageous Picks
                        <Popup
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                          content='Best value players: lowest selection rate but highest points'
                          size='small'
                        />
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <ThresholdControl
                        threshold={highThresh}
                        setThreshold={setHighThresh}
                        minThresh={highThreshMin}
                        maxThresh={highThreshMax}
                        isHighThreshold={true}
                      />
                    </Card.Content>
                    <Card.Content>
                      <PlayerInsightTable
                        players={bestByPickThresholdList}
                        color={INSIGHT_COLORS.MOST_ADVANTAGEOUS}
                        showPercentage={true}
                        totalTeams={users.rosters.length}
                        emptyMessage='No players match this threshold'
                      />
                    </Card.Content>
                  </Card>
                </Grid.Column>

                {/* Least Advantageous Picks (Column 2) */}
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Least Advantageous Picks
                        <Popup
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                          content='Risky players: high selection rate but lowest points'
                          size='small'
                        />
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <ThresholdControl
                        threshold={lowThresh}
                        setThreshold={setLowThresh}
                        minThresh={lowThreshMin}
                        maxThresh={lowThreshMax}
                        isHighThreshold={false}
                      />
                    </Card.Content>
                    <Card.Content>
                      <PlayerInsightTable
                        players={worstByPickThresholdList}
                        color={INSIGHT_COLORS.LEAST_ADVANTAGEOUS}
                        showPercentage={true}
                        totalTeams={users.rosters.length}
                        emptyMessage='No players match this threshold'
                      />
                    </Card.Content>
                  </Card>
                </Grid.Column>

                {/* Unselected Opportunities (Column 3) */}
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Best Unselected
                        <Popup
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                          content='High-value players still available in the pool'
                          size='small'
                        />
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <PlayerInsightTable
                        players={topUnselectedPlayers}
                        color={INSIGHT_COLORS.BEST_UNSELECTED}
                        showPercentage={false}
                        emptyMessage='All top players have been selected'
                      />
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid>
            </section>

            {/* Section 5: Team Composition */}
            <section className='insights-section'>
              <Header as='h3' dividing>
                Ideal Team Rosters
              </Header>
              <Grid stackable columns={2}>
                <Grid.Column>
                  <TeamCompositionPanel
                    title='Perfect Team'
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
                    title='Most Common Team'
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

            {/* Section 6: Elimination Impact - Valuable Eliminated Players */}
            <section className='insights-section'>
              <Header as='h3' dividing>
                Elimination Impact
              </Header>

              {/* FUTURE ENHANCEMENT: Elimination Analytics - Planned Expansions */}
              {/* ================================================================ */}
              {/* #1 - Opportunity Cost / Sunk Cost Analysis */}
              {/* Shows points "locked" in eliminated players per roster */}
              {/* Implementation: */}
              {/*   - Per roster: sum points of all their eliminated players */}
              {/*   - Display as: absolute points + percentage of their current score */}
              {/*   - Table: User | Eliminated Players | Sunk Points | % of Total */}
              {/*   - Helps identify which rosters are most hamstrung by eliminations */}
              {/* */}
              {/* #3 - Elimination Timing Impact */}
              {/* Shows when each roster's players were eliminated (Round 1, 2, 3, etc) */}
              {/* Implementation Blocker: Current data only tracks final elimination status, */}
              {/* not timing. Would require: */}
              {/*   - Playoff bracket timestamps from NHL API (series end dates) */}
              {/*   - Cross-reference player elimination date with roster picks */}
              {/*   - Track: early losses (Round 1-2) vs late eliminations (Round 3+) */}
              {/*   - Metric: "Roster Resilience" - how long rosters stayed alive */}
              {/* ================================================================ */}

              <Grid stackable columns={2}>
                {/* Most Valuable Eliminated Players */}
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Most Valuable Eliminations
                        <Popup
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                          content='Highest-scoring players that were eliminated'
                          size='small'
                        />
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <PlayerInsightTable
                        players={eliminatedPlayersList}
                        color={INSIGHT_COLORS.WORST_PICKS}
                        showPercentage={true}
                        totalTeams={users.rosters.length}
                        emptyMessage='No eliminations yet'
                      />
                    </Card.Content>
                  </Card>
                </Grid.Column>

                {/* Position Impact Analysis */}
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Impact by Position
                        <Popup
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                          content='Points lost to elimination by player position'
                          size='small'
                        />
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {positionImpactData.rankedByImpact.map((item) => (
                          <div key={item.position} style={{ borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <strong style={{ fontSize: '14px' }}>
                                {item.position === 'L' && 'Left Wing'}
                                {item.position === 'C' && 'Center'}
                                {item.position === 'R' && 'Right Wing'}
                                {item.position === 'D' && 'Defense'}
                                {item.position === 'G' && 'Goalie'}
                              </strong>
                              <span style={{ color: '#666', fontSize: '13px' }}>
                                {item.pointsLost} pts ({item.percentage}%)
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999' }}>
                              <span>{item.count} player{item.count !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid>
            </section>
          </div>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default Insights;
