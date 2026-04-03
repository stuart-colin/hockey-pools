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
  Button,
  Table,
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
  TOTAL_ROSTER_SIZE,
  INSIGHT_COLORS,
  TOP_N,
} from '../../constants/insights';
import PoolOverview from './Insights.PoolOverview';
import PlayerInsightTable from './Insights.PlayerInsightTable';
import ThresholdControl from './Insights.ThresholdControl';
import TeamCompositionPanel from './Insights.TeamCompositionPanel';
import { useEliminatedTeamsContext } from '../../context/EliminatedTeamsContext';
import '../../css/customStyle.css';
import './Insights.Sections.css';
import useBreakpoint from '../../hooks/useBreakpoint';

const Insights = ({
  players,
  regularSeasonStats,
  season,
  users
}) => {
  const [highThresh, setHighThresh] = useState(DEFAULT_HIGH_THRESHOLD);
  const [lowThresh, setLowThresh] = useState(DEFAULT_LOW_THRESHOLD);
  const [eggsExpanded, setEggsExpanded] = useState(false);
  const [deadWeightExpanded, setDeadWeightExpanded] = useState(false);

  const { isMobile, isTablet } = useBreakpoint();

  const { eliminatedTeams } = useEliminatedTeamsContext();
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
            <section className='insights-section'>
              <Header as='h3' dividing>
                Hits & Misses
              </Header>
              <Grid columns={2} stackable className='pick-analysis-grid'>

                {/* Best Picks */}
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Power Plays
                        <Popup
                          content='Players scoring the most points — the anchors of winning rosters.'
                          position='right center'
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
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
                        Disappointments
                        <Popup
                          content="Players with the lowest points — picks that didn't deliver."
                          position='right center'
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
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

                {/* Missed Opportunities */}
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Missed Opportunities
                        <Popup
                          content='Highest scoring players that no one selected.'
                          position='right center'
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                        />
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <PlayerInsightTable
                        players={topUnselectedPlayers}
                        color={INSIGHT_COLORS.BEST_UNSELECTED}
                        showPercentage={false}
                        emptyMessage='No unselected players with points yet'
                      />
                    </Card.Content>
                  </Card>
                </Grid.Column>

              </Grid>
            </section>

            {/* Section 3: Value Analysis and Position Breakdown */}
            <section className='insights-section'>
              <Header as='h3' dividing>
                Value Analysis
              </Header>
              <Grid stackable columns={2} className='pick-analysis-grid'>
                {/* Most Advantageous Picks (Column 1) */}
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Biggest Steals
                        <Popup
                          content='Best value players: lower selection rates but higher points. Rosters with these guys have an edge.'
                          position='right center'
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
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
                        Biggest Busts
                        <Popup
                          content='Low value players: higher selection rates but lower points. Rosters with these picks are not at an advantage.'
                          position='right center'
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
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

                {/* Position Points Breakdown (Column 3) */}
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Position Breakdown
                        <Popup
                          content='Average points per player by position — see which positions are carrying the most weight.'
                          position='right center'
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                        />
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {positionPointsData.map((item) => (
                          <div key={item.position} style={{ borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <strong style={{ fontSize: '14px' }}>{item.label}</strong>
                              <span style={{ color: '#666', fontSize: '13px' }}>
                                {item.avgPoints} avg pts
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999' }}>
                              <span>{item.totalPoints} total pts ({item.shareOfPool}%)</span>
                              <span>{item.remaining}/{item.playerCount} remaining</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid>
            </section>

            {/* Section 4: Draft Day Snapshot */}
            <section className='insights-section'>
              <Header as='h3' dividing>
                Draft Day Snapshot
              </Header>
              <Grid stackable columns={2}>
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Consensus
                        <Popup
                          content='Players everyone wanted — the obvious picks that drove the draft.'
                          position='right center'
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
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

                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        All Your Eggs
                        <Popup
                          content='How many NHL teams each roster is spread across — fewer teams means higher risk if those teams get eliminated.'
                          position='right center'
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                        />
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      {rosterDiversityData.length > 0 ? (
                        <div>
                          <div style={{ position: 'relative' }}>
                            <Table singleLine unstackable selectable color='blue'>
                              <Table.Header>
                                <Table.Row>
                                  <Table.HeaderCell>Teams</Table.HeaderCell>
                                  <Table.HeaderCell textAlign='right'>Rosters</Table.HeaderCell>
                                  <Table.HeaderCell textAlign='right'>% of Pool</Table.HeaderCell>
                                </Table.Row>
                              </Table.Header>
                              <Table.Body>
                                {(eggsExpanded ? rosterDiversityData : rosterDiversityData.slice(0, 4)).map((bucket) => (
                                  <Table.Row key={bucket.teamCount}>
                                    <Table.Cell><strong>{bucket.teamCount}</strong></Table.Cell>
                                    <Table.Cell textAlign='right'>{bucket.rosterCount}</Table.Cell>
                                    <Table.Cell textAlign='right'>{bucket.percentage}%</Table.Cell>
                                  </Table.Row>
                                ))}
                              </Table.Body>
                            </Table>
                            {!eggsExpanded && rosterDiversityData.length > 4 && (
                              <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px',
                                background: 'linear-gradient(to bottom, rgba(250,251,252,0), rgba(250,251,252,1))',
                                pointerEvents: 'none',
                              }} />
                            )}
                          </div>
                          {rosterDiversityData.length > 4 && (
                            <Button basic color='blue' fluid size='mini' onClick={() => setEggsExpanded(!eggsExpanded)}>
                              <Icon name={eggsExpanded ? 'chevron up' : 'chevron down'} />
                              {eggsExpanded ? 'Show Less' : 'Show More'}
                            </Button>
                          )}
                        </div>
                      ) : (
                        <p style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '16px 0', margin: 0 }}>
                          No roster data available
                        </p>
                      )}
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid>
            </section>

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
            <section className='insights-section'>
              <Header as='h3' dividing>
                Elimination Impact
              </Header>

              {/* FUTURE ENHANCEMENT: Elimination Timing Impact */}
              {/* Shows when each roster's players were eliminated (Round 1, 2, 3, etc) */}
              {/* Implementation Blocker: Current data only tracks final elimination status, */}
              {/* not timing. Would require: */}
              {/*   - Playoff bracket timestamps from NHL API (series end dates) */}
              {/*   - Cross-reference player elimination date with roster picks */}
              {/*   - Track: early losses (Round 1-2) vs late eliminations (Round 3+) */}
              {/*   - Metric: "Roster Resilience" - how long rosters stayed alive */}

              <Grid stackable columns={2}>
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Golf Course All-Stars
                        <Popup
                          content='The highest scoring players who traded their sticks for clubs — gone but not forgotten.'
                          position='right center'
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
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

                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Dead Weight
                        <Popup
                          content='The rosters with the most points locked up in eliminated positions — capped value from out-of-action players.'
                          position='right center'
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                        />
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {sunkCostData.length > 0 && sunkCostData.some(r => r.eliminatedCount > 0) ? (
                          <>
                            <div style={{ position: 'relative' }}>
                              {(deadWeightExpanded ? sunkCostData.filter(r => r.eliminatedCount > 0).slice(0, 10) : sunkCostData.filter(r => r.eliminatedCount > 0).slice(0, 4)).map((roster) => (
                                <div key={roster.owner} style={{ borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <strong style={{ fontSize: '14px' }}>{roster.owner}</strong>
                                    <span style={{ color: '#666', fontSize: '13px' }}>
                                      {roster.sunkPoints} pts ({roster.sunkPercentage}%)
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999' }}>
                                    <span>{roster.eliminatedCount} eliminated player{roster.eliminatedCount !== 1 ? 's' : ''}</span>
                                    <span>{roster.totalPoints} total pts</span>
                                  </div>
                                </div>
                              ))}
                              {!deadWeightExpanded && sunkCostData.filter(r => r.eliminatedCount > 0).length > 4 && (
                                <div style={{
                                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px',
                                  background: 'linear-gradient(to bottom, rgba(250,251,252,0), rgba(250,251,252,1))',
                                  pointerEvents: 'none',
                                }} />
                              )}
                            </div>
                            {sunkCostData.filter(r => r.eliminatedCount > 0).length > 4 && (
                              <Button basic color='blue' fluid size='mini' onClick={() => setDeadWeightExpanded(!deadWeightExpanded)}>
                                <Icon name={deadWeightExpanded ? 'chevron up' : 'chevron down'} />
                                {deadWeightExpanded ? 'Show Less' : 'Show More'}
                              </Button>
                            )}
                          </>
                        ) : (
                          <div style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '16px 0', margin: 0 }}>
                            No eliminations yet
                          </div>
                        )}
                      </div>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid>
            </section>

            {/* Section 7: X Factors */}
            <section className='insights-section'>
              <Header as='h3' dividing>
                X Factors
              </Header>
              <Grid stackable columns={2} className='pick-analysis-grid'>

                {/* Verhaeghe Effect */}
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Verhaeghe Effect
                        <Popup
                          content='Playoff performance vs. regular season — who elevates their game when it matters most.'
                          position='right center'
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                        />
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {clutchFactorData.length > 0 ? (
                          clutchFactorData.slice(0, 10).map((player) => (
                            <div key={player.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <strong style={{ fontSize: '14px', color: player.isEliminated ? '#db2828' : 'inherit' }}>{player.name}</strong>
                                <span style={{
                                  fontSize: '13px', fontWeight: 'bold',
                                  color: player.clutchRating > 0 ? '#21ba45' : player.clutchRating < 0 ? '#db2828' : '#666'
                                }}>
                                  {player.clutchRating > 0 ? '+' : ''}{player.clutchRating}
                                </span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999' }}>
                                <span>Playoff: {player.playoffPPG} PPG</span>
                                <span>Regular: {player.regularSeasonPPG} PPG</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '16px 0', margin: 0 }}>
                            {regularSeasonStats?.loading ? 'Loading regular season data...' : 'No data available yet'}
                          </div>
                        )}
                      </div>
                    </Card.Content>
                  </Card>
                </Grid.Column>

                {/* Bonus Hunters */}
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Bonus Hunters
                        <Popup
                          content='Players earning extra points from overtime goals (skaters) and shutouts (goalies) — the bonus point specialists.'
                          position='right center'
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                        />
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {bonusHuntersList.length > 0 ? (
                          bonusHuntersList.map((player) => (
                            <div key={player.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <strong style={{ fontSize: '14px', color: player.isEliminated ? '#db2828' : 'inherit' }}>{player.name}</strong>
                                <span style={{ color: '#666', fontSize: '13px' }}>
                                  +{player.bonusPoints} bonus pts
                                </span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999' }}>
                                <span>{player.bonusLabel}</span>
                                <span>{player.points} total pts ({player.pickCount} roster{player.pickCount !== 1 ? 's' : ''})</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '16px 0', margin: 0 }}>
                            No bonus points scored yet
                          </div>
                        )}
                      </div>
                    </Card.Content>
                  </Card>
                </Grid.Column>

                {/* Lone Wolves */}
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>
                        Lone Wolves
                        <Popup
                          content='Players only on one roster — exclusive picks that give their owner a unique edge, if they can produce.'
                          position='right center'
                          trigger={<Icon name='question circle outline' size='small' style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.6 }} />}
                        />
                      </Card.Header>
                    </Card.Content>
                    <Card.Content>
                      <PlayerInsightTable
                        players={loneWolvesList}
                        color={INSIGHT_COLORS.MOST_ADVANTAGEOUS}
                        showPercentage={false}
                        emptyMessage='No unique picks with points yet'
                      />
                    </Card.Content>
                  </Card>
                </Grid.Column>

              </Grid>
            </section>

            {/* Section 8: Today's Top Point Gainers (Players) */}
            <section className='insights-section'>
              <Header as='h3' dividing>
                Today's Top Point Gainers
              </Header>
              <PlayerInsightTable
                color={INSIGHT_COLORS.PERFECT_TEAM}
                emptyMessage='No players scored today yet'
                players={topPlayerGainers}
                showPercentage={false}
              />
            </section>
          </div>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default Insights;
