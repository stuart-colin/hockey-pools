import React from 'react';
import {
  Card,
  Grid,
  Icon,
  Popup,
  Table,
} from 'semantic-ui-react';
import { INSIGHT_COLORS } from '../../constants/insights';
import InsightDataTable from './Insights.InsightDataTable';
import ThresholdControl from './Insights.ThresholdControl';

const popupQuestionIconStyle = {
  cursor: 'pointer',
  marginLeft: '6px',
  opacity: 0.6,
};

const POSITION_GROUP_LABEL = {
  F: 'forwards',
  D: 'defensemen',
  G: 'goalies',
};

const formatSigned = (value) => {
  if (value === 0) return '0';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}`;
};

const valueScoreColumn = (scoreKey, label, { negate = false } = {}) => ({
  key: scoreKey,
  label,
  width: 1,
  render: (player) => {
    const score = player[scoreKey];
    if (score === undefined || score === null) return null;
    const displayScore = negate ? -score : score;
    const expected = player._expectedPoints ?? 0;
    const actual = player.points ?? 0;
    const groupLabel = POSITION_GROUP_LABEL[player._positionGroup] || 'peers';
    const tooltip = `Expected ${expected.toFixed(1)} pts based on selection rate among ${groupLabel}; got ${actual}.`;
    return (
      <Popup
        content={tooltip}
        hideOnScroll
        position='left center'
        trigger={<strong>{formatSigned(displayScore)}</strong>}
      />
    );
  },
});

const ValueAnalysis = ({
  bestByPickThresholdList,
  worstByPickThresholdList,
  positionPointsData,
  highThresh,
  setHighThresh,
  highThreshMin,
  highThreshMax,
  lowThresh,
  setLowThresh,
  lowThreshMin,
  lowThreshMax,
  usersRostersLength,
}) => {
  return (
    <Grid stackable columns={2} className='pick-analysis-grid three-column'>
        {/* Most Advantageous Picks (Column 1) */}
        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <Card.Header>
                Biggest Steals
                <Popup
                  content='Players who outscored what their selection rate predicted, ranked within their position group (forwards, defense, goalies). Each group has its own expected-points line, so a goalie pulling big wins on a few picks still counts as a steal.'
                  hideOnScroll
                  position='right center'
                  trigger={(
                    <Icon
                      name='question circle outline'
                      size='small'
                      style={popupQuestionIconStyle}
                    />
                  )}
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
              <InsightDataTable
                players={bestByPickThresholdList}
                color={INSIGHT_COLORS.MOST_ADVANTAGEOUS}
                customColumns={[valueScoreColumn('_stealScore', 'Score')]}
                showPercentage={true}
                totalTeams={usersRostersLength}
                emptyMessage='No clear steals at this threshold — every qualifying player is performing in line with their selection rate.'
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
                  content='Players who fell furthest below the points their selection rate predicted, fit separately for forwards, defense, and goalies. A widely-picked goalie still putting up wins won\u2019t be flagged just because forwards score more.'
                  hideOnScroll
                  position='right center'
                  trigger={(
                    <Icon
                      name='question circle outline'
                      size='small'
                      style={popupQuestionIconStyle}
                    />
                  )}
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
              <InsightDataTable
                players={worstByPickThresholdList}
                color={INSIGHT_COLORS.LEAST_ADVANTAGEOUS}
                customColumns={[valueScoreColumn('_bustScore', 'Score', { negate: true })]}
                showPercentage={true}
                totalTeams={usersRostersLength}
                emptyMessage='No clear busts at this threshold — every qualifying player is performing in line with their selection rate.'
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
                  hideOnScroll
                  position='right center'
                  trigger={(
                    <Icon
                      name='question circle outline'
                      size='small'
                      style={popupQuestionIconStyle}
                    />
                  )}
                />
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <InsightDataTable
                color={INSIGHT_COLORS.BEST_PICKS}
                emptyMessage='No position data available'
                headerRenderer={() => (
                  <Table.Row>
                    <Table.HeaderCell>Position</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Avg Pts</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Total Pts</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>% of Pool</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Remaining</Table.HeaderCell>
                  </Table.Row>
                )}
                players={positionPointsData}
                rowRenderer={(item) => (
                  <Table.Row key={item.position}>
                    <Table.Cell collapsing><strong>{item.label}</strong></Table.Cell>
                    <Table.Cell textAlign='right'>{item.avgPoints}</Table.Cell>
                    <Table.Cell textAlign='right'>{item.totalPoints}</Table.Cell>
                    <Table.Cell textAlign='right'>{item.shareOfPool}%</Table.Cell>
                    <Table.Cell textAlign='right'>{item.remaining}/{item.playerCount}</Table.Cell>
                  </Table.Row>
                )}
                visibleRows={5}
              />
            </Card.Content>
          </Card>
        </Grid.Column>
    </Grid>
  );
};

export default ValueAnalysis;
