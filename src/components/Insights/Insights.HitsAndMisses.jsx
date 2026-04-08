import React from 'react';
import {
  Card,
  Grid,
  Header,
  Icon,
  Popup,
} from 'semantic-ui-react';
import { INSIGHT_COLORS } from '../../constants/insights';
import InsightDataTable from './Insights.InsightDataTable';

const popupQuestionIconStyle = {
  cursor: 'pointer',
  marginLeft: '6px',
  opacity: 0.6,
};

const HitsAndMisses = ({
  topPlayersList,
  bottomPlayersList,
  topPlayerGainers,
  topUnselectedPlayers,
  usersRostersLength,
}) => {
  return (
    <section className='insights-section'>
      <Header as='h3' dividing>
        Hits & Misses
      </Header>
      <Grid columns={2} stackable className='pick-analysis-grid two-column'>

        {/* Best Picks */}
        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <Card.Header>
                Power Plays
                <Popup
                  content='Players with the most overall points.'
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
                players={topPlayersList}
                color={INSIGHT_COLORS.BEST_PICKS}
                showPercentage={true}
                totalTeams={usersRostersLength}
              />
            </Card.Content>
          </Card>
        </Grid.Column>

        {/* Today's Movers */}
        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <Card.Header>
                Today's Movers
                <Popup
                  content='Players with the most points today.'
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
                color={INSIGHT_COLORS.PERFECT_TEAM}
                emptyMessage='No players scored today yet'
                players={topPlayerGainers}
                showPercentage={true}
                totalTeams={usersRostersLength}
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
                  content="Players with the lowest overall points."
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
                players={bottomPlayersList}
                color={INSIGHT_COLORS.WORST_PICKS}
                showPercentage={true}
                totalTeams={usersRostersLength}
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
  );
};

export default HitsAndMisses;
