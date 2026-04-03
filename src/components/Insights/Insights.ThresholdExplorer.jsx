import React from 'react';
import { Grid, Card, Header } from 'semantic-ui-react';
import ThresholdControl from './Insights.ThresholdControl';
import InsightDataTable from './Insights.InsightDataTable';
import { INSIGHT_COLORS } from '../../constants/insights';

/**
 * ThresholdExplorer - Side-by-side threshold controls with player tables
 * Allows users to explore advantageous and disadvantageous picks based on selection rate
 */
const ThresholdExplorer = ({
  highThresh,
  setHighThresh,
  highThreshMin,
  highThreshMax,
  highThreshPlayers,
  lowThresh,
  setLowThresh,
  lowThreshMin,
  lowThreshMax,
  lowThreshPlayers,
  totalTeams,
}) => {
  return (
    <Grid stackable columns={2}>
      {/* Most Advantageous Picks */}
      <Grid.Column>
        <Card fluid>
          <Card.Content>
            <Card.Header>Most Advantageous Picks</Card.Header>
            <Card.Description style={{ color: '#666', fontSize: '13px', marginTop: '8px' }}>
              Best value players: lowest selection rate but highest points
            </Card.Description>
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
            <InsightDataTable
              players={highThreshPlayers}
              color={INSIGHT_COLORS.MOST_ADVANTAGEOUS}
              showPercentage={true}
              totalTeams={totalTeams}
              emptyMessage='No players match this threshold'
            />
          </Card.Content>
        </Card>
      </Grid.Column>

      {/* Least Advantageous Picks */}
      <Grid.Column>
        <Card fluid>
          <Card.Content>
            <Card.Header>Least Advantageous Picks</Card.Header>
            <Card.Description style={{ color: '#666', fontSize: '13px', marginTop: '8px' }}>
              Risky players: high selection rate but lowest points
            </Card.Description>
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
            <InsightDataTable
              players={lowThreshPlayers}
              color={INSIGHT_COLORS.LEAST_ADVANTAGEOUS}
              showPercentage={true}
              totalTeams={totalTeams}
              emptyMessage='No players match this threshold'
            />
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid>
  );
};

export default React.memo(ThresholdExplorer);
