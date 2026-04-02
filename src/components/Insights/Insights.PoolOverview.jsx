import React from 'react';
import { Card, Grid, Statistic, Progress, Popup } from 'semantic-ui-react';
import { INSIGHT_COLORS } from '../../constants/insights';
import useIsMobile from '../../hooks/useBreakpoint';

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
  const isMobile = useIsMobile();
  const STAT_GROUP_SIZE = isMobile ? 'tiny' : 'small';
  /**
   * ProgressBarWithMarkers - Renders a progress bar with tooltipped markers for data points
   */
  const ProgressBarWithMarkers = ({ value, total, dataPoints }) => {
    // dataPoints: array of { value, label, position }
    const PROGRESS_BAR_HEIGHT = 24; // px
    const MARKER_HEIGHT = 30; // px

    return (
      <div style={{ position: 'relative', diplay: 'block', width: '100%', height: `${PROGRESS_BAR_HEIGHT}px` }}>
        <Progress
          value={value}
          total={total}
          progress='ratio'
          style={{
            height: `${PROGRESS_BAR_HEIGHT}px`,
            '--progress-ratio': value / total,
          }}
          className='gradient-progress'
        />
        {/* Markers container - using relative positioning with negative margin */}
        <div>
          {dataPoints.map((point, idx) => {
            const positionPercent = (point.value / total) * 100;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: `${positionPercent}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: 10,
                }}
              >
                <Popup
                  content={`${point.label}: ${point.value}`}
                  position='top center'
                  trigger={
                    <div
                      style={{
                        width: '6px',
                        height: `${MARKER_HEIGHT}px`,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '2px',
                        transition: 'all 0.2s ease',
                      }}
                      className='marker-line'
                    />
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
              <Statistic color={INSIGHT_COLORS.POOL_STATS.most}>
                <Statistic.Value>{mostPlayersRemaining}</Statistic.Value>
                <Statistic.Label>Most</Statistic.Label>
              </Statistic>
              <Statistic color={INSIGHT_COLORS.POOL_STATS.average}>
                <Statistic.Value>{averagePlayersRemaining}</Statistic.Value>
                <Statistic.Label>Average</Statistic.Label>
              </Statistic>
              <Statistic color={INSIGHT_COLORS.POOL_STATS.least}>
                <Statistic.Value>{leastPlayersRemaining}</Statistic.Value>
                <Statistic.Label>Least</Statistic.Label>
              </Statistic>
            </Statistic.Group>
            <div style={{ marginTop: '24px' }}>
              <p style={{ fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                Roster Completion
              </p>
              <ProgressBarWithMarkers
                value={averagePlayersRemaining}
                total={16}
                dataPoints={[
                  { value: leastPlayersRemaining, label: 'Least', position: 'left' },
                  { value: q1PlayersRemaining, label: 'Q1 (25%)', position: 'left-center' },
                  { value: medianPlayersRemaining, label: 'Median', position: 'center' },
                  { value: averagePlayersRemaining, label: 'Average', position: 'center' },
                  { value: q3PlayersRemaining, label: 'Q3 (75%)', position: 'right-center' },
                  { value: mostPlayersRemaining, label: 'Most', position: 'right' },
                ]}
                label='Players'
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
              <Statistic color={INSIGHT_COLORS.POOL_STATS.most}>
                <Statistic.Value>{mostPoints}</Statistic.Value>
                <Statistic.Label>Most</Statistic.Label>
              </Statistic>
              <Statistic color={INSIGHT_COLORS.POOL_STATS.average}>
                <Statistic.Value>{averagePoints}</Statistic.Value>
                <Statistic.Label>Average</Statistic.Label>
              </Statistic>
              <Statistic color={INSIGHT_COLORS.POOL_STATS.least}>
                <Statistic.Value>{leastPoints}</Statistic.Value>
                <Statistic.Label>Least</Statistic.Label>
              </Statistic>
            </Statistic.Group>
            <div style={{ marginTop: '24px' }}>
              <p style={{ fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                Point Distribution
              </p>
              <ProgressBarWithMarkers
                value={averagePoints}
                total={mostPoints}
                dataPoints={[
                  { value: leastPoints, label: 'Least', position: 'left' },
                  { value: q1Points, label: 'Q1 (25%)', position: 'left-center' },
                  { value: medianPoints, label: 'Median', position: 'center' },
                  { value: averagePoints, label: 'Average', position: 'center' },
                  { value: q3Points, label: 'Q3 (75%)', position: 'right-center' },
                  { value: mostPoints, label: 'Most', position: 'right' },
                ]}
                label='Points'
              />
            </div>
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid>
  );
};

export default React.memo(PoolOverview);
