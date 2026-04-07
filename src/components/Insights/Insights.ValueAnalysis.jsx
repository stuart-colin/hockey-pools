import React from 'react';
import {
  Card,
  Grid,
  Header,
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
    <section className='insights-section'>
      <Header as='h3' dividing>
        Value Analysis
      </Header>
      <Grid stackable columns={2} className='pick-analysis-grid three-column'>
        {/* Most Advantageous Picks (Column 1) */}
        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <Card.Header>
                Biggest Steals
                <Popup
                  content='Higher value players: lower selection rates but higher points. Rosters with these guys have an edge.'
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
                showPercentage={true}
                totalTeams={usersRostersLength}
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
                  content='Lower value players: higher selection rates but lower points. Rosters with these picks have less of an advantage.'
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
                showPercentage={true}
                totalTeams={usersRostersLength}
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
    </section>
  );
};

export default ValueAnalysis;
