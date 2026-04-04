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

const DraftDaySnapshot = ({
  mostPickedPlayersList,
  rosterDiversityData,
  usersRostersLength,
}) => {
  return (
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
                  trigger={(
                    <Icon
                      name='question circle outline'
                      size='small'
                      style={{
                        cursor: 'pointer',
                        marginLeft: '6px',
                        opacity: 0.6,
                      }}
                    />
                  )}
                />
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <InsightDataTable
                players={mostPickedPlayersList}
                color={INSIGHT_COLORS.MOST_PICKS}
                showPercentage={true}
                totalTeams={usersRostersLength}
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
                  content='How many NHL teams rosters are spread across — fewer teams means higher risk if those teams get eliminated.'
                  position='right center'
                  trigger={(
                    <Icon
                      name='question circle outline'
                      size='small'
                      style={{
                        cursor: 'pointer',
                        marginLeft: '6px',
                        opacity: 0.6,
                      }}
                    />
                  )}
                />
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <InsightDataTable
                color='blue'
                emptyMessage='No roster data available'
                headerRenderer={() => (
                  <Table.Row>
                    <Table.HeaderCell>NHL Teams</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Rosters</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>% of Pool</Table.HeaderCell>
                  </Table.Row>
                )}
                players={rosterDiversityData}
                rowRenderer={(bucket) => (
                  <Table.Row key={bucket.teamCount}>
                    <Table.Cell><strong>{bucket.teamCount}</strong></Table.Cell>
                    <Table.Cell textAlign='right'>{bucket.rosterCount}</Table.Cell>
                    <Table.Cell textAlign='right'>{bucket.percentage}%</Table.Cell>
                  </Table.Row>
                )}
                visibleRows={4}
              />
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </section>
  );
};

export default DraftDaySnapshot;
