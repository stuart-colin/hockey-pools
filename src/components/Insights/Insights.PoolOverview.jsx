import React from 'react';
import { Card, Grid, Statistic, Progress, Popup } from 'semantic-ui-react';
import { INSIGHT_COLORS } from '../../constants/insights';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const progressBarTrackContainerStyle = (heightPx) => ({
  display: 'block',
  height: `${heightPx}px`,
  position: 'relative',
  width: '100%',
});

const progressBarRatioStyle = (value, total, heightPx) => ({
  '--progress-ratio': value / total,
  height: `${heightPx}px`,
});

const markerPopupColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const distributionMarkerHitStyle = {
  cursor: 'pointer',
  position: 'absolute',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 10,
};

const distributionMarkerAtPositionStyle = (leftPercent) => ({
  ...distributionMarkerHitStyle,
  left: `${leftPercent}%`,
});

const distributionMarkerLineStyle = (markerHeightPx) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  borderRadius: '2px',
  height: `${markerHeightPx}px`,
  transition: 'all 0.2s ease',
  width: '6px',
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
  /**
   * ProgressBarWithMarkers - Renders a progress bar with tooltipped markers for data points
   */
  const ProgressBarWithMarkers = ({ value, total, dataPoints }) => {
    // dataPoints: array of { value, label, position }
    const PROGRESS_BAR_HEIGHT = 24; // px
    const MARKER_HEIGHT = 30; // px

    // Group data points by value to handle duplicates
    const groupedPoints = dataPoints.reduce((acc, point) => {
      const roundedValue = Math.round(point.value * 100) / 100; // Round to 2 decimal places
      const existing = acc.find(g => g.roundedValue === roundedValue);
      if (existing) {
        existing.labels.push(point.label);
      } else {
        acc.push({ value: point.value, roundedValue, labels: [point.label] });
      }
      return acc;
    }, []);

    return (
      <div
        style={progressBarTrackContainerStyle(PROGRESS_BAR_HEIGHT)}
      >
        <Progress
          className='gradient-progress'
          progress='ratio'
          style={progressBarRatioStyle(value, total, PROGRESS_BAR_HEIGHT)}
          total={total}
          value={value}
        />
        {/* Markers container - using relative positioning with negative margin */}
        <div>
          {groupedPoints.map((point, idx) => {
            const positionPercent = (point.roundedValue / total) * 100;
            const popupContent = (
              <div
                style={markerPopupColumnStyle}
              >
                {point.labels.reverse().map((label, labelIdx) => (
                  <div key={labelIdx}>{label}: {point.roundedValue}</div>
                ))}
              </div>
            );

            return (
              <div
                key={idx}
                style={distributionMarkerAtPositionStyle(positionPercent)}
              >
                <Popup
                  basic
                  content={popupContent}
                  hideOnScroll
                  trigger={
                    <div
                      className='marker-line'
                      style={distributionMarkerLineStyle(MARKER_HEIGHT)}
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
              <ProgressBarWithMarkers
                dataPoints={[
                  { value: leastPlayersRemaining, label: 'Least', position: 'left' },
                  { value: q1PlayersRemaining, label: 'Q1 (25%)', position: 'left-center' },
                  { value: medianPlayersRemaining, label: 'Median', position: 'center' },
                  { value: averagePlayersRemaining, label: 'Average', position: 'center' },
                  { value: q3PlayersRemaining, label: 'Q3 (75%)', position: 'right-center' },
                  { value: mostPlayersRemaining, label: 'Most', position: 'right' },
                ]}
                label='Players'
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
              <ProgressBarWithMarkers
                dataPoints={[
                  { value: leastPoints, label: 'Least', position: 'left' },
                  { value: q1Points, label: 'Q1 (25%)', position: 'left-center' },
                  { value: medianPoints, label: 'Median', position: 'center' },
                  { value: averagePoints, label: 'Average', position: 'center' },
                  { value: q3Points, label: 'Q3 (75%)', position: 'right-center' },
                  { value: mostPoints, label: 'Most', position: 'right' },
                ]}
                label='Points'
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
