import React, { useMemo } from 'react';
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

const popupQuestionIconStyle = {
  cursor: 'pointer',
  marginLeft: '6px',
  opacity: 0.6,
};

const EliminationImpact = ({
  eliminatedPlayersList,
  sunkCostData,
  usersRostersLength,
}) => {
  const frozenAssetsList = useMemo(() => (
    sunkCostData
      .filter(r => r.eliminatedCount > 0)
      .sort((a, b) => parseFloat(b.sunkPercentage) - parseFloat(a.sunkPercentage))
      .slice(0, 10)
  ), [sunkCostData]);

  const deadWeightList = useMemo(() => (
    sunkCostData
      .filter(r => r.eliminatedCount > 0)
      .sort((a, b) => {
        if (a.avgEliminatedPoints !== b.avgEliminatedPoints) {
          return a.avgEliminatedPoints - b.avgEliminatedPoints;
        }
        // Tie-breaker: more eliminated picks ranks higher (more wasted slots).
        return b.eliminatedCount - a.eliminatedCount;
      })
      .slice(0, 10)
  ), [sunkCostData]);

  return (
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

      <Grid stackable columns={2} className='pick-analysis-grid three-column'>
        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <Card.Header>
                Golf Course All-Stars
                <Popup
                  content='The highest scoring players who traded their sticks for clubs — gone but not forgotten.'
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
                players={eliminatedPlayersList}
                color={INSIGHT_COLORS.WORST_PICKS}
                showPercentage={true}
                totalTeams={usersRostersLength}
                emptyMessage='No eliminations yet'
              />
            </Card.Content>
          </Card>
        </Grid.Column>

        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <Card.Header>
                Frozen Assets
                <Popup
                  content='The rosters with the most points locked up in eliminated picks — high-value picks now stuck on the sideline.'
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
                players={frozenAssetsList}
                color={INSIGHT_COLORS.WORST_PICKS}
                headerRenderer={() => (
                  <Table.Row>
                    <Table.HeaderCell>Owner</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Eliminated</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Sunk Points</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Total Points</Table.HeaderCell>
                  </Table.Row>
                )}
                rowRenderer={(item) => (
                  <Table.Row key={item.owner}>
                    <Table.Cell collapsing><strong>{item.owner}</strong></Table.Cell>
                    <Table.Cell textAlign='right'>{item.eliminatedCount}</Table.Cell>
                    <Table.Cell textAlign='right'>{item.sunkPoints} ({item.sunkPercentage}%)</Table.Cell>
                    <Table.Cell textAlign='right'>{item.totalPoints}</Table.Cell>
                  </Table.Row>
                )}
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
                  content='Rosters whose eliminated picks contributed the least per slot — players who took up roster spots without producing points.'
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
                players={deadWeightList}
                color={INSIGHT_COLORS.WORST_PICKS}
                headerRenderer={() => (
                  <Table.Row>
                    <Table.HeaderCell>Owner</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Eliminated</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Avg Pts</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Sunk Pts</Table.HeaderCell>
                  </Table.Row>
                )}
                rowRenderer={(item) => (
                  <Table.Row key={item.owner}>
                    <Table.Cell collapsing><strong>{item.owner}</strong></Table.Cell>
                    <Table.Cell textAlign='right'>{item.eliminatedCount}</Table.Cell>
                    <Table.Cell textAlign='right'>{item.avgEliminatedPoints}</Table.Cell>
                    <Table.Cell textAlign='right'>{item.sunkPoints}</Table.Cell>
                  </Table.Row>
                )}
                emptyMessage='No eliminations yet'
              />
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </section>
  );
};

export default EliminationImpact;
