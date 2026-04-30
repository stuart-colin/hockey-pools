import React from 'react';
import { Card, Grid, Statistic } from 'semantic-ui-react';
import { INSIGHT_COLORS } from '../../constants/insights';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import ProgressBarWithMarkers from './Insights.ProgressBarWithMarkers';

const progressBarRatioStyle = (value, total) => ({
  '--progress-ratio': value / total,
});

const rosterCompletionSectionStyle = {
  marginTop: '24px',
};

const distributionSectionTitleStyle = {
  fontWeight: '600',
  fontSize: '14px',
  marginBottom: '8px',
};

/**
 * PoolOverview - Displays pool-level statistics (players remaining, points)
 * Shows min, average, max for each metric using cards with progress indicators
 * Includes median and quartile markers for distribution analysis
 *
 * FUTURE ENHANCEMENT: Expected Win Range Marker
 * =============================================
 * To add markers based on historical pool data:
 * 1. Fetch previous seasons' data (2021, 2022, 2023, etc.)
 * 2. Calculate min/max performing ranges for current point in season
 * 3. Store as expectedWinMin and expectedWinMax in props
 * 4. Add to dataPoints:
 *    { value: expectedWinMin, label: 'Min Expected', position: 'center' },
 *    { value: expectedWinMax, label: 'Max Expected', position: 'center' },
 * 5. Update insightCalculations.js to include historical data fetching
 */
const PoolOverview = ({
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
}) => {
  const { isMobile } = useBreakpoint();
  const STAT_GROUP_SIZE = isMobile ? 'tiny' : 'small';

  // Adapter so we keep the existing call sites that pass `value/total/dataPoints`
  // as labelled distribution markers (Least, Q1, Median, etc.). The shared
  // marker component takes care of grouping near-duplicates and rendering.
  // `progress` controls Semantic UI's Progress label: 'ratio' renders
  // "value/total", 'value' renders just the value.
  // The leader value is intentionally NOT rendered inside the bar (no
  // `progress` prop) — `showTickValues` already places it at the leader's
  // tick, and showing it twice clutters the bar. Callers can still pass
  // `progress` explicitly if they ever want the in-bar label back.
  const DistributionBar = ({ value, total, dataPoints, progress }) => (
    <ProgressBarWithMarkers
      dataPoints={dataPoints.map((p) => ({
        value: p.value,
        label: `${p.label}: ${Math.round(p.value * 100) / 100}`,
      }))}
      total={total}
      progressProps={{
        className: 'gradient-progress',
        progress,
        style: progressBarRatioStyle(value, total),
        total,
        value,
      }}
      showTickValues
    />
  );

  return (
    <Grid stackable columns={2}>
      {/* Players Remaining Card */}
      <Grid.Column>
        <Card fluid>
          <Card.Content>
            <Card.Header>Players Remaining</Card.Header>
          </Card.Content>
          <Card.Content>
            <Statistic.Group widths='three' size={STAT_GROUP_SIZE}>
              <Statistic color={INSIGHT_COLORS.POOL_STATS.least}>
                <Statistic.Value>{leastPlayersRemaining}</Statistic.Value>
                <Statistic.Label>Least</Statistic.Label>
              </Statistic>
              <Statistic color={INSIGHT_COLORS.POOL_STATS.average}>
                <Statistic.Value>{averagePlayersRemaining}</Statistic.Value>
                <Statistic.Label>Average</Statistic.Label>
              </Statistic>
              <Statistic color={INSIGHT_COLORS.POOL_STATS.most}>
                <Statistic.Value>{mostPlayersRemaining}</Statistic.Value>
                <Statistic.Label>Most</Statistic.Label>
              </Statistic>
            </Statistic.Group>
            <div
              style={rosterCompletionSectionStyle}
            >
              <p
                style={distributionSectionTitleStyle}
              >
                Roster Completion
              </p>
              <DistributionBar
                dataPoints={[
                  { value: leastPlayersRemaining, label: 'Least' },
                  { value: q1PlayersRemaining, label: 'Q1 (25%)' },
                  { value: medianPlayersRemaining, label: 'Median' },
                  { value: averagePlayersRemaining, label: 'Average' },
                  { value: q3PlayersRemaining, label: 'Q3 (75%)' },
                  { value: mostPlayersRemaining, label: 'Most' },
                ]}
                total={16}
                value={mostPlayersRemaining}
              />
            </div>
          </Card.Content>
        </Card>
      </Grid.Column>

      {/* Pool Points Card */}
      <Grid.Column>
        <Card fluid>
          <Card.Content>
            <Card.Header>Pool Points</Card.Header>
          </Card.Content>
          <Card.Content>
            <Statistic.Group widths='three' size={STAT_GROUP_SIZE}>
              <Statistic color={INSIGHT_COLORS.POOL_STATS.least}>
                <Statistic.Value>{leastPoints}</Statistic.Value>
                <Statistic.Label>Least</Statistic.Label>
              </Statistic>
              <Statistic color={INSIGHT_COLORS.POOL_STATS.average}>
                <Statistic.Value>{averagePoints}</Statistic.Value>
                <Statistic.Label>Average</Statistic.Label>
              </Statistic>
              <Statistic color={INSIGHT_COLORS.POOL_STATS.most}>
                <Statistic.Value>{mostPoints}</Statistic.Value>
                <Statistic.Label>Most</Statistic.Label>
              </Statistic>
            </Statistic.Group>
            <div
              style={rosterCompletionSectionStyle}
            >
              <p
                style={distributionSectionTitleStyle}
              >
                Point Distribution
              </p>
              <DistributionBar
                dataPoints={[
                  { value: leastPoints, label: 'Least' },
                  { value: q1Points, label: 'Q1 (25%)' },
                  { value: medianPoints, label: 'Median' },
                  { value: averagePoints, label: 'Average' },
                  { value: q3Points, label: 'Q3 (75%)' },
                  { value: mostPoints, label: 'Most' },
                ]}
                total={mostPoints}
                value={mostPoints}
              />
            </div>
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid>
  );
};

export default React.memo(PoolOverview);
